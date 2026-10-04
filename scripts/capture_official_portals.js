const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const PORTAL_URLS = [
  { id: 'medicare', url: 'https://www.medicare.gov/', file: 'medicare_gov_portal.jpg' },
  { id: 'getcoverednj', url: 'https://www.getcovered.nj.gov/', file: 'getcovered_nj_portal.jpg' },
  { id: 'njhelps', url: 'https://www.njhelps.gov/', file: 'njhelps_gov_portal.jpg' },
  { id: 'njfamilycare', url: 'https://njfamilycare.dhs.state.nj.us/', file: 'njfamilycare_portal.jpg' },
  { id: 'ssa', url: 'https://www.ssa.gov/', file: 'ssa_gov_portal.jpg' },
  { id: 'njtax', url: 'https://www.nj.gov/treasury/taxation/', file: 'nj_taxation_portal.jpg' },
  { id: 'njshares', url: 'https://njshares.org/', file: 'njshares_portal.jpg' },
  { id: 'nj211', url: 'https://www.nj211.org/', file: 'nj211_portal.jpg' }
];

const OUT_DIR = '/Users/ejyoon/Desktop/KACCESS/uploads/images/resources';

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
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

async function capture() {
  const targets = await getJson('http://127.0.0.1:9222/json/list');
  const target = targets.find(t => t.type === 'page');
  const cdp = new CDPClient(target.webSocketDebuggerUrl);
  await cdp.connect();

  await cdp.send('Page.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1200,
    height: 700,
    deviceScaleFactor: 1,
    mobile: false
  });

  for (const item of PORTAL_URLS) {
    try {
      console.log(`[CAPTURING] ${item.id} -> ${item.url}`);
      await cdp.send('Page.navigate', { url: item.url });
      await new Promise(r => setTimeout(r, 4500));
      const shot = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 85 });
      const dest = path.join(OUT_DIR, item.file);
      fs.writeFileSync(dest, Buffer.from(shot.data, 'base64'));
      console.log(`[SAVED] ${item.file} (${fs.statSync(dest).size} bytes)`);
    } catch (e) {
      console.error(`[ERROR] ${item.id}:`, e.message);
    }
  }

  cdp.close();
}

capture().catch(console.error);
