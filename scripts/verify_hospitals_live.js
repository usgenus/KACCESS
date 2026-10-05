const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const tabs = JSON.parse(data);
        const pageTab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension://'));
        if (pageTab) resolve(pageTab.webSocketDebuggerUrl);
        else reject(new Error('No page tab found'));
      });
    }).on('error', reject);
  });
}

function sendCommand(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const handler = (data) => {
      const msg = JSON.parse(data);
      if (msg.id === id) {
        ws.off('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function verify() {
  const wsUrl = await getWsUrl();
  console.log('Connecting to Chrome CDP at:', wsUrl);
  const ws = new WebSocket(wsUrl);

  await new Promise((res) => ws.on('open', res));

  // Set viewport
  await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  const cacheBustUrl = `https://njaccessportal.com/?cb=${Date.now()}`;
  console.log('Navigating to:', cacheBustUrl);
  await sendCommand(ws, 'Page.navigate', { url: cacheBustUrl });

  // Wait for load
  await new Promise(r => setTimeout(r, 4000));

  // Scroll to hospital section
  const scrollRes = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.getElementById('hospital-filter-bar') || document.getElementById('hospital-cards-grid');
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'start' });
          const rect = el.getBoundingClientRect();
          return { found: true, top: rect.top, cardsCount: document.querySelectorAll('.hospital-card').length };
        }
        return { found: false };
      })()
    `,
    returnByValue: true
  });
  console.log('Hospital section query:', scrollRes);

  await new Promise(r => setTimeout(r, 1500));

  // Capture screenshot of hospital cards
  const screenshot = await sendCommand(ws, 'Page.captureScreenshot', {
    format: 'png'
  });

  const outPath = '/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage/live_hospitals_8_with_logos.png';
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, Buffer.from(screenshot.data, 'base64'));
  console.log('Screenshot saved to:', outPath);

  // Test filter tabs: click "senior_rehab" and take another screenshot
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('.hospital-filter-btn'));
        const seniorBtn = btns.find(b => b.textContent.includes('시니어 너싱홈'));
        if (seniorBtn) {
          seniorBtn.click();
          return true;
        }
        return false;
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1000));

  const screenshotSenior = await sendCommand(ws, 'Page.captureScreenshot', {
    format: 'png'
  });
  const outPathSenior = '/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage/live_hospitals_senior_filter.png';
  fs.writeFileSync(outPathSenior, Buffer.from(screenshotSenior.data, 'base64'));
  console.log('Senior filter screenshot saved to:', outPathSenior);

  ws.close();
}

verify().catch(console.error);
