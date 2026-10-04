const fs = require('fs');
const WebSocket = require('ws');

async function verifyLive() {
  const listRes = await fetch('http://127.0.0.1:9222/json/list');
  const pages = await listRes.json();
  const page = pages.find(p => p.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let id = 1;
  const callbacks = new Map();
  ws.on('message', (d) => {
    const m = JSON.parse(d);
    if (m.id && callbacks.has(m.id)) {
      callbacks.get(m.id)(m.result);
      callbacks.delete(m.id);
    }
  });

  const send = (method, params = {}) => new Promise((resolve) => {
    const curId = id++;
    callbacks.set(curId, resolve);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await new Promise(r => ws.on('open', r));

  console.log('Navigating to live https://njaccessportal.com/resource-center#senior...');
  await send('Page.navigate', { url: 'https://njaccessportal.com/resource-center#senior' });
  await new Promise(r => setTimeout(r, 2500));

  const liveState = await send('Runtime.evaluate', {
    expression: `(() => {
      const tabs = Array.from(document.querySelectorAll('.rc-hero-tab')).map(t => ({
        id: t.id,
        text: t.querySelector('.hero-tab-title')?.innerText,
        active: t.classList.contains('active'),
        tab: t.dataset.tab
      }));
      const activeSlide = document.querySelector('.hero-slide:not(.hidden)')?.id;
      const visualNum = document.getElementById('rc-hero-visual-num')?.innerText;
      const seniorTabActive = !document.getElementById('tab-view-senior')?.classList.contains('hidden');
      const seniorCategoriesCount = document.querySelectorAll('#seniorCategoryChoicesContainer .rc-choice-card').length;
      const seniorArticlesCount = document.querySelectorAll('#seniorArticlesGrid .editorial-card').length;
      return { tabs, activeSlide, visualNum, seniorTabActive, seniorCategoriesCount, seniorArticlesCount };
    })()`,
    returnByValue: true
  });

  console.log('Live Production State:', JSON.stringify(liveState.result.value, null, 2));

  const liveShot = await send('Page.captureScreenshot', { format: 'png' });
  const shotPath = '/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage/live_senior_production_verified.png';
  fs.writeFileSync(shotPath, Buffer.from(liveShot.data, 'base64'));
  console.log('Captured live_senior_production_verified.png');

  ws.close();
}

verifyLive().catch(err => {
  console.error(err);
  process.exit(1);
});
