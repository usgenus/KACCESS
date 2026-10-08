const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = path.join('/Users/ejyoon/.gemini/antigravity-ide/brain/d310f464-61c3-4578-9db7-df2f53a8da94');

async function run() {
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

  console.log('Navigating to http://localhost:8080/resource-center.html#resources...');
  await send('Page.navigate', { url: 'http://localhost:8080/resource-center.html#resources' });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Check Hero Slide 2
  await send('Runtime.evaluate', { expression: 'window.rcGoToSlide(2);' });
  await new Promise(r => setTimeout(r, 600));

  const heroCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const slide = document.getElementById('rc-hero-slide-2');
      return {
        badge: slide.querySelector('.hero-pill-badge')?.innerText.trim(),
        title: slide.querySelector('.hero-main-title')?.innerText.trim(),
        desc: slide.querySelector('.hero-main-desc')?.innerText.trim(),
        btnText: slide.querySelector('.hero-btn-primary')?.innerText.trim()
      };
    })()`,
    returnByValue: true
  });
  console.log('Hero Slide 2 verification:', heroCheck.result.value);

  const heroShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'hero_slide2_promoted.png'), Buffer.from(heroShot.data, 'base64'));

  // 2. Open article inline
  await send('Runtime.evaluate', { expression: 'window.openArticleInline("art-1");' });
  await new Promise(r => setTimeout(r, 600));

  const readerCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const reader = document.getElementById('inlineResourceReader');
      const header = reader.querySelector('.border-b');
      const text = header ? header.innerText : '';
      return {
        readerVisible: !reader.classList.contains('hidden'),
        headerText: text,
        hasOfficialBriefing: text.includes('뉴저지 공식 리서치 브리핑')
      };
    })()`,
    returnByValue: true
  });
  console.log('Inline Reader Header check:', readerCheck.result.value);

  await send('Runtime.evaluate', {
    expression: `document.getElementById('inlineResourceReader').scrollIntoView({ behavior: 'instant', block: 'center' });`
  });
  await new Promise(r => setTimeout(r, 400));

  const readerShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'inline_reader_no_briefing.png'), Buffer.from(readerShot.data, 'base64'));

  ws.close();
  console.log('Screenshots saved. Done!');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
