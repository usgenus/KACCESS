const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = '/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage';
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

function getCdpEndpoint() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json/list', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const list = JSON.parse(data);
          let target = list.find(t => t.type === 'page' && t.url.includes('njaccessportal.com'));
          if (!target) target = list.find(t => t.type === 'page');
          if (target && target.webSocketDebuggerUrl) {
            resolve(target.webSocketDebuggerUrl);
          } else {
            reject(new Error('No suitable CDP page target found'));
          }
        } catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function sendCommand(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const msg = JSON.stringify({ id, method, params });
    const onMessage = (data) => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.id === id) {
          ws.off('message', onMessage);
          if (parsed.error) reject(parsed.error);
          else resolve(parsed.result);
        }
      } catch (err) {}
    };
    ws.on('message', onMessage);
    ws.send(msg);
  });
}

async function run() {
  const wsUrl = await getCdpEndpoint();
  const ws = new WebSocket(wsUrl);

  await new Promise(r => ws.on('open', r));
  console.log('[CDP] Connected');

  // Navigate to /forum/ask
  await sendCommand(ws, 'Page.enable');
  await sendCommand(ws, 'Page.navigate', { url: 'https://njaccessportal.com/forum/ask' });
  await new Promise(r => setTimeout(r, 2500));

  // Evaluate and scroll to the attachment section
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      const el = document.getElementById('attach-tab-btn-photo') || document.querySelector('#attach-panel-photo');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    `
  });
  await new Promise(r => setTimeout(r, 500));

  // 1. Screenshot of Tab 1: 사진 첨부
  const shot1 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'live_attach_option_photo.png'), Buffer.from(shot1.data, 'base64'));
  console.log('[SCREENSHOT 1] live_attach_option_photo.png saved');

  // 2. Click Tab 2: 비디오링크
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      const btn = document.getElementById('attach-tab-btn-video');
      if (btn) btn.click();
    `
  });
  await new Promise(r => setTimeout(r, 500));
  const shot2 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'live_attach_option_video.png'), Buffer.from(shot2.data, 'base64'));
  console.log('[SCREENSHOT 2] live_attach_option_video.png saved');

  // 3. Click Tab 3: 웹링크
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      const btn = document.getElementById('attach-tab-btn-link');
      if (btn) btn.click();
    `
  });
  await new Promise(r => setTimeout(r, 500));
  const shot3 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'live_attach_option_link.png'), Buffer.from(shot3.data, 'base64'));
  console.log('[SCREENSHOT 3] live_attach_option_link.png saved');

  // Check text content in DOM to confirm no legacy words
  const checkText = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        return {
          hasLegacy1: text.includes('사진 / 영수증 / 검사결과'),
          hasLegacy2: text.includes('병원 청구서(빌)'),
          hasPhotoTab: !!document.getElementById('attach-tab-btn-photo'),
          hasVideoTab: !!document.getElementById('attach-tab-btn-video'),
          hasLinkTab: !!document.getElementById('attach-tab-btn-link')
        };
      })()
    `,
    returnByValue: true
  });
  console.log('[VERIFICATION RESULT]', checkText.result.value);

  ws.close();
}

run().catch(console.error);
