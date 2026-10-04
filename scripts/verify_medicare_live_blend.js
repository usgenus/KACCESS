const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACTS_DIR = '/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9';

async function getPageWsUrl(port) {
  for (let i = 0; i < 30; i++) {
    try {
      const targets = await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${port}/json/list`, res => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
          });
        }).on('error', reject);
      });
      const pageTarget = targets.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
      if (pageTarget) return pageTarget.webSocketDebuggerUrl;
    } catch (e) {
      await new Promise(r => setTimeout(r, 200));
    }
  }
  throw new Error('Failed to get page WebSocket debugger URL');
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.pending = new Map();
  }

  async connect() {
    if (this.ws.readyState === WebSocket.OPEN) return;
    return new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve, reject } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return res.result ? res.result.value : null;
  }

  async captureScreenshot(filepath, clip = null) {
    const params = { format: 'png' };
    if (clip) params.clip = clip;
    const res = await this.send('Page.captureScreenshot', params);
    fs.writeFileSync(filepath, Buffer.from(res.data, 'base64'));
    console.log(`Saved screenshot: ${filepath}`);
  }

  close() {
    this.ws.close();
  }
}

async function run() {
  const port = 9232;
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,900',
    'about:blank'
  ]);

  try {
    const wsUrl = await getPageWsUrl(port);
    const client = new CDPClient(wsUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('DOM.enable');

    console.log('Navigating to https://njaccessportal.com/medicare...');
    await client.send('Page.navigate', { url: 'https://njaccessportal.com/medicare' });

    // Wait 3 seconds
    await new Promise(r => setTimeout(r, 3000));

    // Check DOM elements
    const verification = await client.eval(`(() => {
      const aep = document.getElementById('section-open-enrollment');
      const cms = document.getElementById('section-cms-numbers');
      const ira = document.getElementById('section-ira');
      const compare = document.getElementById('section-compare');
      const timeline = document.getElementById('section-enrollment-timeline');
      const senior = document.getElementById('section-senior');

      return {
        hasAep: !!aep,
        aepText: aep ? aep.innerText.slice(0, 150) : null,
        hasCmsNumbers: !!cms,
        cmsText: cms ? cms.innerText.slice(0, 150) : null,
        hasIra: !!ira,
        hasCompare: !!compare,
        hasTimeline: !!timeline,
        hasSenior: !!senior,
        bodyHas20290: document.body.innerText.includes('$202.90'),
        bodyHas2100: document.body.innerText.includes('$2,100'),
        bodyHasANOC: document.body.innerText.includes('ANOC'),
        bodyHasM3P: document.body.innerText.includes('M3P')
      };
    })()`);

    console.log('Verification Results:', JSON.stringify(verification, null, 2));

    // Scroll to AEP and capture screenshot
    await client.eval(`(() => {
      const el = document.getElementById('section-open-enrollment');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await new Promise(r => setTimeout(r, 500));
    await client.captureScreenshot(path.join(ARTIFACTS_DIR, 'medicare_live_aep_checklist.png'));

    // Scroll to CMS Numbers and capture screenshot
    await client.eval(`(() => {
      const el = document.getElementById('section-cms-numbers');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await new Promise(r => setTimeout(r, 500));
    await client.captureScreenshot(path.join(ARTIFACTS_DIR, 'medicare_live_cms_numbers.png'));

    // Scroll to Timeline & Penalties and capture screenshot
    await client.eval(`(() => {
      const el = document.getElementById('section-enrollment-timeline');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await new Promise(r => setTimeout(r, 500));
    await client.captureScreenshot(path.join(ARTIFACTS_DIR, 'medicare_live_timeline_penalties.png'));

    client.close();
  } finally {
    chromeProc.kill('SIGTERM');
  }
}

run().catch(console.error);
