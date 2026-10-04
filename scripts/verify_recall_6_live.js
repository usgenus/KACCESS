const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACT_DIR = '/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9';

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

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || 'Evaluation failed');
    }
    return res.result?.value;
  }
}

(async () => {
  const port = 9334;
  const userDataDir = `/tmp/chrome_test_recall_${Date.now()}`;
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,900',
    'about:blank'
  ]);

  try {
    const wsUrl = await getPageWsUrl(port);
    const client = new CDPClient(wsUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('DOM.enable');
    await client.send('Runtime.enable');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    console.log('Navigating to https://njaccessportal.com/ ...');
    await client.send('Page.navigate', { url: `https://njaccessportal.com/?cb=${Date.now()}` });
    await new Promise(r => setTimeout(r, 4000));

    const recallInfo = await client.evaluate(`
      (() => {
        const grid = document.getElementById('homepage-reports-grid');
        if (!grid) return { found: false };
        const articles = Array.from(grid.querySelectorAll('article'));
        return {
          found: true,
          count: articles.length,
          gridClasses: grid.className,
          items: articles.map(a => {
            const h3 = a.querySelector('h3');
            const cat = a.querySelector('span');
            return {
              title: h3 ? h3.innerText.trim() : '',
              category: cat ? cat.innerText.trim() : ''
            };
          })
        };
      })()
    `);

    console.log('--- Recall Section Inspection Result ---');
    console.log(JSON.stringify(recallInfo, null, 2));

    // Scroll to recall section and take screenshot
    await client.evaluate(`
      (() => {
        const grid = document.getElementById('homepage-reports-grid');
        if (grid) {
          grid.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      })()
    `);
    await new Promise(r => setTimeout(r, 1000));

    const screenshotRes = await client.send('Page.captureScreenshot', { format: 'png' });
    const screenshotPath = path.join(ARTIFACT_DIR, 'recall_6_slots_verified.png');
    fs.writeFileSync(screenshotPath, Buffer.from(screenshotRes.data, 'base64'));
    console.log(`Saved screenshot to: ${screenshotPath}`);

    // Check nav links for senior care
    const seniorLinks = await client.evaluate(`
      (() => {
        return Array.from(document.querySelectorAll('a[href*="senior-care"]')).map(a => ({
          text: a.innerText.trim(),
          href: a.href,
          visible: a.offsetParent !== null
        }));
      })()
    `);
    console.log('Senior care links in DOM:', JSON.stringify(seniorLinks, null, 2));

  } catch (err) {
    console.error('Error during CDP verification:', err);
  } finally {
    chrome.kill();
    try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}
  }
})();
