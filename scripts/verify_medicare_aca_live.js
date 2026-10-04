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

async function evalCode(ws, expression) {
  const res = await sendCommand(ws, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  if (res && res.result) {
    return res.result.value;
  }
  return null;
}

async function captureScreenshot(ws, filename) {
  const result = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  const filepath = path.join(ARTIFACTS_DIR, filename);
  fs.writeFileSync(filepath, Buffer.from(result.data, 'base64'));
  console.log(`[SCREENSHOT] Saved: ${filepath}`);
}

async function run() {
  const wsUrl = await getCdpEndpoint();
  const ws = new WebSocket(wsUrl);

  await new Promise(r => ws.on('open', r));
  console.log('[CDP] Connected');

  await sendCommand(ws, 'Page.enable');
  await sendCommand(ws, 'DOM.enable');

  console.log('[NAVIGATING] https://njaccessportal.com/medicare');
  await sendCommand(ws, 'Page.navigate', { url: 'https://njaccessportal.com/medicare' });

  // Wait for load
  await new Promise(r => setTimeout(r, 2500));

  // Check state
  const state = await evalCode(ws, `(() => {
    const activeTab = document.querySelector('.rc-tab-view:not(.hidden)')?.id;
    const medicareWrap = document.querySelector('.medicare-guide-container');
    const svgs = document.querySelectorAll('.medicare-guide-container svg').length;
    const sections = Array.from(document.querySelectorAll('.medicare-guide-container section')).map(s => s.id || s.className.slice(0, 30));
    const compareIntro = !!document.getElementById('section-compare-intro');
    const aep = !!document.getElementById('section-open-enrollment');
    const parts = !!document.getElementById('section-medicare-parts');
    const ira = !!document.getElementById('section-ira');
    const flow = !!document.getElementById('section-compare');
    const timeline = !!document.getElementById('section-enrollment-timeline');
    const aca = !!document.getElementById('section-aca-guide');
    const senior = !!document.getElementById('section-senior-support');
    const faq = !!document.getElementById('section-medicare-faq');

    return {
      activeTab,
      hasContainer: !!medicareWrap,
      svgCount: svgs,
      sections,
      verified: {
        compareIntro,
        aep,
        parts,
        ira,
        flow,
        timeline,
        aca,
        senior,
        faq
      }
    };
  })()`);

  console.log('[STATE RESULTS]:', JSON.stringify(state, null, 2));

  // Scroll to compareIntro and screenshot
  await evalCode(ws, `document.getElementById('section-compare-intro').scrollIntoView({ behavior: 'instant', block: 'start' });`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot(ws, 'live_medicare_aca_intro_diagram.png');

  // Scroll to parts and screenshot
  await evalCode(ws, `document.getElementById('section-medicare-parts').scrollIntoView({ behavior: 'instant', block: 'start' });`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot(ws, 'live_medicare_parts_cards.png');

  // Scroll to IRA $2100 cap and screenshot
  await evalCode(ws, `document.getElementById('section-ira').scrollIntoView({ behavior: 'instant', block: 'start' });`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot(ws, 'live_medicare_ira_donut_hole_chart.png');

  // Scroll to flowchart Original vs Advantage
  await evalCode(ws, `document.getElementById('section-compare').scrollIntoView({ behavior: 'instant', block: 'start' });`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot(ws, 'live_medicare_flowchart_comparison.png');

  // Scroll to ACA guide
  await evalCode(ws, `document.getElementById('section-aca-guide').scrollIntoView({ behavior: 'instant', block: 'start' });`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot(ws, 'live_aca_subsidy_ladder_guide.png');

  // Also open an FAQ accordion and take screenshot
  await evalCode(ws, `(() => {
    const details = document.querySelector('#section-medicare-faq details');
    if (details) details.open = true;
    document.getElementById('section-medicare-faq').scrollIntoView({ behavior: 'instant', block: 'start' });
  })()`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot(ws, 'live_medicare_faq_accordion.png');

  ws.close();
  console.log('[DONE] Verification complete!');
}

run().catch(err => {
  console.error('[ERROR]', err);
  process.exit(1);
});
