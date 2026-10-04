const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const targetId = 'AD036392E07222EF4B4C5CEFC1179648';
const ws = new WebSocket(`ws://localhost:9222/devtools/page/${targetId}`);

let id = 1;
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const msgId = id++;
    const handler = (data) => {
      const msg = JSON.parse(data);
      if (msg.id === msgId) {
        ws.off('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
}

const sleep = ms => new Promise(res => setTimeout(res, ms));

ws.on('open', async () => {
  try {
    console.log('Connected to CDP target');
    await send('Page.enable');
    await send('Runtime.enable');

    const cacheBuster = Date.now();
    console.log('Navigating to homepage with cachebuster...');
    await send('Page.navigate', { url: `https://njaccessportal.com/?cb=${cacheBuster}` });
    await sleep(3500);

    // Find the one-stop section and scroll into view
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const section = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('원스톱 의료 접근 & 환자 종합 센터'));
          if (section) {
            section.scrollIntoView({ behavior: 'instant', block: 'center' });
            const cards = Array.from(section.querySelectorAll('a.group')).map(a => ({
              href: a.getAttribute('href'),
              title: a.querySelector('h3') ? a.querySelector('h3').textContent.trim() : ''
            }));
            return { found: true, cards };
          }
          return { found: false };
        })()
      `,
      returnByValue: true
    });

    console.log('One-stop section evaluation:', JSON.stringify(evalRes.result.value, null, 2));
    await sleep(1000);

    // Capture screenshot of One-Stop section
    const ss1 = await send('Page.captureScreenshot', { format: 'png' });
    const ssPath1 = path.join('/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage', 'live_home_onestop_clean_3cards.png');
    fs.writeFileSync(ssPath1, Buffer.from(ss1.data, 'base64'));
    console.log(`Saved screenshot to ${ssPath1}`);

    // Check Hero Slide 5
    const slide5Res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const slide5 = document.getElementById('hero-slide-5');
          if (slide5) {
            const btn = slide5.querySelector('a');
            return {
              badge: slide5.querySelector('.hero-pill-badge') ? slide5.querySelector('.hero-pill-badge').textContent.trim() : '',
              title: slide5.querySelector('.hero-main-title') ? slide5.querySelector('.hero-main-title').textContent.trim() : '',
              btnHref: btn ? btn.getAttribute('href') : '',
              btnText: btn ? btn.textContent.trim() : ''
            };
          }
          return null;
        })()
      `,
      returnByValue: true
    });
    console.log('Hero Slide 5 check:', JSON.stringify(slide5Res.result.value, null, 2));

    // Test navigation to /matcher to verify redirect
    console.log('Testing /matcher redirect...');
    await send('Page.navigate', { url: `https://njaccessportal.com/matcher?cb=${cacheBuster}` });
    await sleep(3000);

    const redirectUrlRes = await send('Runtime.evaluate', {
      expression: `window.location.href`,
      returnByValue: true
    });
    console.log('URL after visiting /matcher:', redirectUrlRes.result.value);

    // Capture screenshot after redirect
    const ss2 = await send('Page.captureScreenshot', { format: 'png' });
    const ssPath2 = path.join('/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage', 'live_matcher_redirect_verified.png');
    fs.writeFileSync(ssPath2, Buffer.from(ss2.data, 'base64'));
    console.log(`Saved screenshot to ${ssPath2}`);

    console.log('All verifications completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error during verification:', err);
    process.exit(1);
  }
});
