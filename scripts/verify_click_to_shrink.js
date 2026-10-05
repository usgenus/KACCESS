const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const tabId = 'ED469B668B96C9D84DF2590ABCEEDC07';
const wsUrl = `ws://localhost:9222/devtools/page/${tabId}`;
const artifactsDir = '/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage';

function cdpSession() {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let id = 1;
    const callbacks = {};

    ws.on('open', () => {
      resolve({
        send: (method, params = {}) => new Promise((res, rej) => {
          const reqId = id++;
          callbacks[reqId] = { res, rej };
          ws.send(JSON.stringify({ id: reqId, method, params }));
        }),
        close: () => ws.close()
      });
    });

    ws.on('message', (data) => {
      const msg = JSON.parse(data);
      if (msg.id && callbacks[msg.id]) {
        if (msg.error) callbacks[msg.id].rej(msg.error);
        else callbacks[msg.id].res(msg.result);
        delete callbacks[msg.id];
      }
    });

    ws.on('error', reject);
  });
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function captureScreenshot(cdp, filename) {
  const res = await cdp.send('Page.captureScreenshot', { format: 'png' });
  const buf = Buffer.from(res.data, 'base64');
  const filePath = path.join(artifactsDir, filename);
  fs.writeFileSync(filePath, buf);
  console.log(`Saved screenshot: ${filePath}`);
}

async function run() {
  const cdp = await cdpSession();
  console.log('Connected to CDP');

  await cdp.send('Page.enable');
  await cdp.send('DOM.enable');

  // Step 1: Navigate to fresh URL
  const liveUrl = `https://njaccessportal.com/?click_test=${Date.now()}`;
  console.log('Navigating to', liveUrl);
  await cdp.send('Page.navigate', { url: liveUrl });
  await sleep(2500);

  // Check initial state before click
  const beforeClick = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const hero = document.getElementById('homepage-hero-billboard-section');
      const v = document.getElementById('hero-intro-video');
      const isVideoPhase = hero ? hero.classList.contains('hero-phase-video') : false;
      return {
        isVideoPhase,
        videoPlaying: v ? (!v.paused && !v.ended) : false
      };
    })()`,
    returnByValue: true
  });
  console.log('Before Click State:', beforeClick.result.value);
  await captureScreenshot(cdp, 'live_before_video_click.png');

  // Step 2: Simulate physical Mouse Click at center of video (e.g. x: 500, y: 350)
  console.log('Simulating mouse click in center of video screen...');
  await cdp.send('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x: 500,
    y: 350,
    button: 'left',
    clickCount: 1
  });
  await cdp.send('Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x: 500,
    y: 350,
    button: 'left',
    clickCount: 1
  });

  // Wait 1 second for shrink animation
  await sleep(1000);

  // Check state after click
  const afterClick = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const hero = document.getElementById('homepage-hero-billboard-section');
      const billboardPhase = document.getElementById('hero-billboard-phase');
      const isBillboardPhase = hero ? hero.classList.contains('hero-phase-billboard') : false;
      const billboardOpacity = billboardPhase ? window.getComputedStyle(billboardPhase).opacity : null;
      return {
        isBillboardPhase,
        billboardOpacity,
        currentSlideNum: document.getElementById('hero-visual-num') ? document.getElementById('hero-visual-num').textContent.trim() : null
      };
    })()`,
    returnByValue: true
  });
  console.log('After Click State:', afterClick.result.value);
  await captureScreenshot(cdp, 'live_after_video_click_shrunk.png');

  console.log('Click verification completed successfully!');
  cdp.close();
}

run().catch(console.error);
