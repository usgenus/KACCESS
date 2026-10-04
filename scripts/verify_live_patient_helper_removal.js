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

  async captureScreenshot(outputPath, clip = null) {
    const params = { format: 'png' };
    if (clip) params.clip = clip;
    const { data } = await this.send('Page.captureScreenshot', params);
    fs.writeFileSync(outputPath, Buffer.from(data, 'base64'));
    console.log(`Saved screenshot: ${outputPath}`);
  }

  async close() {
    try { this.ws.close(); } catch (e) {}
  }
}

async function run() {
  const port = 9333;
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=/tmp/chrome-test-removal-' + Date.now(),
    '--window-size=1440,1000'
  ]);

  try {
    const wsUrl = await getPageWsUrl(port);
    const client = new CDPClient(wsUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('DOM.enable');

    console.log('Navigating to live homepage...');
    await client.send('Page.navigate', { url: 'https://njaccessportal.com/?v=' + Date.now() });
    await new Promise(r => setTimeout(r, 4000));

    // Screenshot 1: Desktop Nav bar
    const navShotPath = path.join(ARTIFACTS_DIR, `live_desktop_navbar_${Date.now()}.png`);
    await client.captureScreenshot(navShotPath, { x: 0, y: 0, width: 1440, height: 160, scale: 1 });

    // Scroll to interactive tools grid
    await client.send('Runtime.evaluate', {
      expression: `
        var el = document.querySelector('section#tools') || document.querySelector('a[href="/matcher"]');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      `
    });
    await new Promise(r => setTimeout(r, 1000));

    // Screenshot 2: 3-column tools grid
    const toolsShotPath = path.join(ARTIFACTS_DIR, `live_tools_grid_${Date.now()}.png`);
    await client.captureScreenshot(toolsShotPath, { x: 0, y: 150, width: 1440, height: 600, scale: 1 });

    // Scroll to footer
    await client.send('Runtime.evaluate', {
      expression: `window.scrollTo(0, document.body.scrollHeight);`
    });
    await new Promise(r => setTimeout(r, 1000));

    // Screenshot 3: Footer
    const footerShotPath = path.join(ARTIFACTS_DIR, `live_footer_${Date.now()}.png`);
    await client.captureScreenshot(footerShotPath, { x: 0, y: 300, width: 1440, height: 600, scale: 1 });

    // Check calculator hub tabs
    console.log('Navigating to /calculator...');
    await client.send('Page.navigate', { url: 'https://njaccessportal.com/calculator?v=' + Date.now() });
    await new Promise(r => setTimeout(r, 3000));

    const calcShotPath = path.join(ARTIFACTS_DIR, `live_calculator_tabs_${Date.now()}.png`);
    await client.captureScreenshot(calcShotPath, { x: 0, y: 120, width: 1440, height: 400, scale: 1 });

    await client.close();
  } finally {
    chrome.kill();
  }
}

run().catch(console.error);
