const fs = require('fs');
const WebSocket = require('ws');

async function main() {
  const listRes = await fetch('http://127.0.0.1:9222/json/list');
  const pages = await listRes.json();
  const page = pages.find(p => p.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let id = 1;
  const callbacks = new Map();
  ws.on('message', (d) => {
    const m = JSON.parse(d);
    if (m.id && callbacks.has(m.id)) {
      callbacks.get(m.id)(m.result || m.error);
      callbacks.delete(m.id);
    }
  });

  const send = (method, params = {}) => new Promise((resolve) => {
    const curId = id++;
    callbacks.set(curId, resolve);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await new Promise(r => ws.on('open', r));

  console.log('Navigating to live https://njaccessportal.com/resource-center...');
  await send('Page.navigate', { url: 'https://njaccessportal.com/resource-center' });
  await new Promise(r => setTimeout(r, 3000));

  // Hard reload
  await send('Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 3000));

  const checkIcons = async (tabLabel) => {
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const textNodes = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let n;
        while (n = walker.nextNode()) {
          const t = n.nodeValue.trim();
          if (t && !t.includes('✕ 닫기')) {
            textNodes.push(t);
          }
        }
        const fullText = textNodes.join(' ');
        const emojiRegex = /[\\u{1F300}-\\u{1F9FF}\\u{2600}-\\u{26FF}\\u{2700}-\\u{27BF}]/gu;
        const emojisFound = fullText.match(emojiRegex) || [];

        // Check SVGs
        const allSvgs = Array.from(document.querySelectorAll('svg'));
        const nonLogoSvgs = allSvgs.filter(s => {
          const vb = s.getAttribute('viewBox');
          return vb !== '0 0 320 60';
        }).map(s => ({
          class: s.getAttribute('class'),
          viewBox: s.getAttribute('viewBox'),
          parent: s.parentElement ? s.parentElement.className : ''
        }));

        // Check small images
        const smallImgs = Array.from(document.querySelectorAll('img')).map(i => ({
          src: i.src,
          className: i.className
        })).filter(i => i.src.includes('kakao') || i.src.includes('icon'));

        return {
          emojisFound,
          nonLogoSvgs,
          smallImgs
        };
      })()`,
      returnByValue: true
    });
    return evalRes && evalRes.result ? evalRes.result.value : evalRes;
  };

  const results = {};

  console.log('Auditing Tab 1: Calculator...');
  results.tab1 = await checkIcons('calculator');
  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage/live_no_icons_tab1.png', Buffer.from(shot.data, 'base64'));

  console.log('Auditing Tab 2: Community Resources...');
  await send('Runtime.evaluate', { expression: `window.rcHeroTabClick('resources', false)` });
  await new Promise(r => setTimeout(r, 1000));
  results.tab2 = await checkIcons('resources');
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage/live_no_icons_tab2.png', Buffer.from(shot.data, 'base64'));

  console.log('Auditing Tab 3: Medicare & ACA...');
  await send('Runtime.evaluate', { expression: `window.rcHeroTabClick('medicare', false)` });
  await new Promise(r => setTimeout(r, 1000));
  results.tab3 = await checkIcons('medicare');
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage/live_no_icons_tab3.png', Buffer.from(shot.data, 'base64'));

  console.log('Auditing Tab 4: Senior Welfare Hub...');
  await send('Runtime.evaluate', { expression: `window.rcHeroTabClick('senior', false)` });
  await new Promise(r => setTimeout(r, 1000));
  results.tab4 = await checkIcons('senior');
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage/live_no_icons_tab4.png', Buffer.from(shot.data, 'base64'));

  console.log('\n--- AUDIT RESULTS SUMMARY ---');
  console.log(JSON.stringify(results, null, 2));

  ws.close();
}

main().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
