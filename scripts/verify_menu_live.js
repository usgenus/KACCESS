const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage';
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.on('open', resolve);
      this.ws.on('error', reject);
    });
    this.ws.on('message', data => {
      const msg = JSON.parse(data.toString());
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  const targets = await getJson('http://127.0.0.1:9222/json/list');
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  if (!pageTarget) throw new Error('No page target found');

  const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await cdp.connect();

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

  console.log('--- 1. Testing Desktop Navbar on https://njaccessportal.com/ ---');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 2,
    mobile: false
  });
  await cdp.send('Page.navigate', { url: 'https://njaccessportal.com/?v=' + Date.now() });
  await new Promise(r => setTimeout(r, 2500));

  let res = await cdp.send('Runtime.evaluate', {
    expression: `
      (() => {
        const link = document.querySelector('a[href*="resource-center"], a[href*="medicare"]');
        return {
          text: link ? link.innerText : null,
          html: link ? link.innerHTML : null,
          classes: link ? link.className : null
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Home Desktop Nav Link:', res.result.value);

  let shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'menu_desktop_home_live.png'), Buffer.from(shot.data, 'base64'));

  console.log('--- 2. Testing Desktop Navbar on https://njaccessportal.com/resource-center ---');
  await cdp.send('Page.navigate', { url: 'https://njaccessportal.com/resource-center?v=' + Date.now() });
  await new Promise(r => setTimeout(r, 2500));

  res = await cdp.send('Runtime.evaluate', {
    expression: `
      (() => {
        const link = document.querySelector('header a[href*="resource-center"], nav a[href*="resource-center"]');
        return {
          text: link ? link.innerText : null,
          html: link ? link.innerHTML : null,
          classes: link ? link.className : null
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Resource Center Desktop Nav Link:', res.result.value);

  shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'menu_desktop_rc_live.png'), Buffer.from(shot.data, 'base64'));

  console.log('--- 3. Testing Mobile Menu on https://njaccessportal.com/resource-center ---');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true
  });
  await cdp.send('Page.navigate', { url: 'https://njaccessportal.com/resource-center?v=' + Date.now() });
  await new Promise(r => setTimeout(r, 2500));

  // Click mobile menu button
  await cdp.send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.getElementById('mobile-menu-btn');
        if (btn) btn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  res = await cdp.send('Runtime.evaluate', {
    expression: `
      (() => {
        const dropdown = document.getElementById('mobile-menu-dropdown');
        const link = dropdown ? dropdown.querySelector('a[href*="resource-center"], a[href*="medicare"]') : null;
        return {
          dropdownVisible: dropdown ? !dropdown.classList.contains('hidden') : false,
          linkText: link ? link.innerText : null,
          linkHtml: link ? link.innerHTML : null
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Resource Center Mobile Dropdown Item:', res.result.value);

  shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'menu_mobile_rc_live.png'), Buffer.from(shot.data, 'base64'));

  console.log('--- 4. Testing Mobile Menu on https://njaccessportal.com/ ---');
  await cdp.send('Page.navigate', { url: 'https://njaccessportal.com/?v=' + Date.now() });
  await new Promise(r => setTimeout(r, 2500));

  // Click mobile menu button
  await cdp.send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.getElementById('mobile-menu-btn');
        if (btn) btn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  res = await cdp.send('Runtime.evaluate', {
    expression: `
      (() => {
        const dropdown = document.getElementById('mobile-menu-dropdown');
        const link = dropdown ? dropdown.querySelector('a[href*="resource-center"], a[href*="medicare"]') : null;
        return {
          dropdownVisible: dropdown ? !dropdown.classList.contains('hidden') : false,
          linkText: link ? link.innerText : null,
          linkHtml: link ? link.innerHTML : null
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Home Mobile Dropdown Item:', res.result.value);

  shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'menu_mobile_home_live.png'), Buffer.from(shot.data, 'base64'));

  cdp.close();
  console.log('--- Verification Complete! ---');
}

run().catch(console.error);
