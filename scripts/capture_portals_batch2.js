const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const PORTAL_URLS = [
  { id: 'staynj_freeze', url: 'https://propertytaxreliefapp.nj.gov/', file: 'stay_nj_senior_freeze_portal.jpg' },
  { id: 'habc_housing', url: 'https://habcnj.org/', file: 'habc_housing_portal.jpg' },
  { id: 'hud_section202', url: 'https://www.hud.gov/program_offices/housing/mfh/progdesc/eld202', file: 'hud_section202_portal.jpg' },
  { id: 'paad_seniorgold', url: 'https://www.nj.gov/humanservices/doas/services/paad/', file: 'paad_seniorgold_portal.jpg' },
  { id: 'meals_on_wheels', url: 'https://www.mealsonwheelsamerica.org/', file: 'meals_on_wheels_portal.jpg' },
  { id: 'nj_ppp', url: 'https://www.nj.gov/humanservices/dmahs/clients/ppp/', file: 'nj_ppp_caregiver_portal.jpg' },
  { id: 'nj_consumer_scam', url: 'https://www.njconsumeraffairs.gov/', file: 'nj_consumer_affairs_scam_portal.jpg' },
  { id: 'bergen_seniors', url: 'https://www.co.bergen.nj.us/division-of-senior-services', file: 'bergen_senior_services_portal.jpg' },
  { id: 'nj_charity_care', url: 'https://www.nj.gov/health/charitycare/', file: 'nj_charity_care_portal.jpg' },
  { id: 'nj_dhs_doas', url: 'https://www.nj.gov/humanservices/doas/', file: 'nj_dhs_aging_services_portal.jpg' }
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
  console.log('Capture batch 2 complete!');
}

capture().catch(console.error);
