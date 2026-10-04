const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = path.join('/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage');

async function testCalcWindowFrames() {
  const listRes = await fetch('http://127.0.0.1:9222/json/list');
  const pages = await listRes.json();
  const page = pages.find(p => p.type === 'page');
  const WebSocket = require('ws');
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

  await send('Storage.clearDataForOrigin', {
    origin: 'http://localhost:8080',
    storageTypes: 'all'
  });

  console.log('Navigating to calculator on localhost:8080/resource-center#calculator...');
  await send('Page.navigate', { url: 'http://localhost:8080/resource-center#calculator' });
  await new Promise(r => setTimeout(r, 1200));

  // Scroll to calculator
  await send('Runtime.evaluate', {
    expression: `document.getElementById('tab-view-calculator')?.scrollIntoView({ behavior: 'instant', block: 'start' })`,
    awaitPromise: true
  });
  await new Promise(r => setTimeout(r, 600));

  // Check window frames rendered
  const evalRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const frames = document.querySelectorAll('.rc-win-frame');
      const count = frames.length;
      const categories = Array.from(frames).map(f => {
        const cat = f.querySelector('.rc-win-cat-title')?.innerText;
        const title = f.querySelector('.rc-win-title')?.innerText;
        const classNames = f.className;
        return { cat, title, classNames };
      });
      return { count, categories };
    })()`,
    returnByValue: true,
    awaitPromise: true
  });

  console.log('Window frames evaluation:', evalRes.result.value);

  // Capture screenshot of calculator section with window frames
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'rc_calc_window_frames.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved rc_calc_window_frames.png');

  // Test modifying inputs to 65+ and low income to see Senior Freeze + PAAD + MLTSS
  await send('Runtime.evaluate', {
    expression: `(() => {
      document.querySelector('input[name="calcAge"][value="65+"]').checked = true;
      document.getElementById('calcCare').checked = true;
      document.getElementById('calcHomeowner').checked = true;
      document.getElementById('calcIncome').value = '1450';
      document.getElementById('calcIncomeSlider').value = '1450';
      document.getElementById('calcIncome').dispatchEvent(new Event('input'));
    })()`,
    awaitPromise: true
  });
  await new Promise(r => setTimeout(r, 600));

  const seniorFrames = await send('Runtime.evaluate', {
    expression: `(() => {
      const frames = document.querySelectorAll('.rc-win-frame');
      return Array.from(frames).map(f => ({
        cat: f.querySelector('.rc-win-cat-title')?.innerText,
        title: f.querySelector('.rc-win-title')?.innerText,
        classNames: f.className
      }));
    })()`,
    returnByValue: true,
    awaitPromise: true
  });
  console.log('Senior Window frames:', seniorFrames.result.value);

  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'rc_calc_window_frames_senior.png'), Buffer.from(shot2.data, 'base64'));
  console.log('Saved rc_calc_window_frames_senior.png');

  ws.close();
}

testCalcWindowFrames().catch(console.error);
