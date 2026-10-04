const fs = require('fs');
const WebSocket = require('ws');

async function verifyLiveSlideTransition() {
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

  console.log('Navigating to live production resource-center with cache bypass...');
  await send('Page.navigate', { url: 'https://njaccessportal.com/resource-center?t=' + Date.now() });
  await new Promise(r => setTimeout(r, 2500));

  // Check script version loaded
  const scriptVersion = await send('Runtime.evaluate', {
    expression: `Array.from(document.querySelectorAll('script')).map(s => s.src).filter(s => s.includes('resource_center.js'))`,
    returnByValue: true
  });
  console.log('Resource center script src:', scriptVersion.result.value);

  // Click Tab 2 (directory) and measure at 50ms and 150ms
  console.log('Clicking Tab 2 (커뮤니티 리소스)...');
  await send('Runtime.evaluate', {
    expression: `document.getElementById('rc-billboard-tab-2').click();`
  });

  await new Promise(r => setTimeout(r, 60));
  const t50 = await send('Runtime.evaluate', {
    expression: `(() => {
      const s1 = document.getElementById('rc-hero-slide-1');
      const s2 = document.getElementById('rc-hero-slide-2');
      const s1Rect = s1 ? s1.getBoundingClientRect() : null;
      const s2Rect = s2 ? s2.getBoundingClientRect() : null;
      return {
        s1Hidden: s1 ? s1.classList.contains('hidden') : null,
        s1Opacity: s1 ? window.getComputedStyle(s1).opacity : null,
        s2Hidden: s2 ? s2.classList.contains('hidden') : null,
        s2Opacity: s2 ? window.getComputedStyle(s2).opacity : null,
        s2Top: s2Rect ? s2Rect.top : null,
        s2Height: s2Rect ? s2Rect.height : null
      };
    })()`,
    returnByValue: true
  });
  console.log('At t=60ms after clicking Tab 2:', t50.result ? t50.result.value : t50);

  await new Promise(r => setTimeout(r, 120)); // ~180ms
  const t180 = await send('Runtime.evaluate', {
    expression: `(() => {
      const s1 = document.getElementById('rc-hero-slide-1');
      const s2 = document.getElementById('rc-hero-slide-2');
      const s2Rect = s2 ? s2.getBoundingClientRect() : null;
      return {
        s1Hidden: s1.classList.contains('hidden'),
        s2Hidden: s2.classList.contains('hidden'),
        s2Opacity: window.getComputedStyle(s2).opacity,
        s2Top: s2Rect ? s2Rect.top : null
      };
    })()`,
    returnByValue: true
  });
  console.log('At t=180ms after clicking Tab 2:', t180.result ? t180.result.value : t180);

  const shotTab2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage/live_tab2_transition.png', Buffer.from(shotTab2.data, 'base64'));
  console.log('Captured live_tab2_transition.png');

  // Next click Tab 4 (시니어)
  console.log('Clicking Tab 4 (시니어)...');
  await send('Runtime.evaluate', {
    expression: `document.getElementById('rc-billboard-tab-4').click();`
  });

  await new Promise(r => setTimeout(r, 60));
  const tSenior50 = await send('Runtime.evaluate', {
    expression: `(() => {
      const s2 = document.getElementById('rc-hero-slide-2');
      const s4 = document.getElementById('rc-hero-slide-4');
      const s4Rect = s4 ? s4.getBoundingClientRect() : null;
      return {
        s2Hidden: s2.classList.contains('hidden'),
        s4Hidden: s4.classList.contains('hidden'),
        s4Opacity: window.getComputedStyle(s4).opacity,
        s4Top: s4Rect ? s4Rect.top : null
      };
    })()`,
    returnByValue: true
  });
  console.log('At t=60ms after clicking Tab 4 (시니어):', tSenior50.result ? tSenior50.result.value : tSenior50);

  await new Promise(r => setTimeout(r, 300));
  const shotTab4 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage/live_tab4_transition.png', Buffer.from(shotTab4.data, 'base64'));
  console.log('Captured live_tab4_transition.png');

  ws.close();
}

verifyLiveSlideTransition().catch(err => {
  console.error(err);
  process.exit(1);
});
