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

  async captureScreenshot(filepath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filepath, Buffer.from(res.data, 'base64'));
    console.log(`Saved screenshot: ${filepath}`);
  }

  close() {
    this.ws.close();
  }
}

async function run() {
  const port = 9227;
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=390,844',
    'about:blank'
  ]);

  try {
    const wsUrl = await getPageWsUrl(port);
    const client = new CDPClient(wsUrl);
    await client.connect();

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true
    });
    await client.send('Page.enable');
    await client.send('DOM.enable');

    console.log('Navigating to https://njaccessportal.com/...');
    await client.send('Page.navigate', { url: 'https://njaccessportal.com/' });

    // Wait until document.readyState === 'complete' and button is ready
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 500));
      const ready = await client.eval(`!!document.getElementById('mobile-menu-btn')`);
      if (ready) break;
    }

    console.log('Clicking #mobile-menu-btn...');
    const clickRes = await client.eval(`(() => {
      var btn = document.getElementById('mobile-menu-btn') || document.querySelector('button[aria-label="Menu"]');
      if (!btn) return { error: 'Button not found' };
      btn.click();
      return { success: true };
    })()`);
    console.log('Click result:', clickRes);

    await new Promise(r => setTimeout(r, 600));

    const status = await client.eval(`(() => {
      var dd = document.getElementById('mobile-menu-dropdown');
      if (!dd) return { found: false };
      var st = window.getComputedStyle(dd);
      var links = Array.from(dd.querySelectorAll('a')).map(a => ({
        text: a.innerText.replace(/\\s+/g, ' ').trim(),
        href: a.getAttribute('href')
      }));
      return {
        found: true,
        isOpen: dd.classList.contains('mobile-menu-open'),
        opacity: st.opacity,
        maxHeight: st.maxHeight,
        linksCount: links.length,
        links: links
      };
    })()`);

    console.log('Home mobile menu status:', JSON.stringify(status, null, 2));

    const screenshotFile = path.join(ARTIFACTS_DIR, 'live_mobile_menu_home_open.png');
    await client.captureScreenshot(screenshotFile);

    client.close();
  } finally {
    chromeProc.kill('SIGTERM');
  }
}

run().catch(console.error);
