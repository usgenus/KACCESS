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

  // Step 1: Navigate to Live Site
  const liveUrl = `https://njaccessportal.com/?v=${Date.now()}`;
  console.log('Navigating to', liveUrl);
  await cdp.send('Page.navigate', { url: liveUrl });
  await sleep(2500);

  // Check Phase 1 Clean Screen
  const checkPhase1 = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const v = document.getElementById('hero-intro-video');
      const overlay = document.getElementById('hero-video-text-overlay');
      const btn = document.querySelector('#hero-video-phase button, #hero-video-phase a');
      return {
        videoSrc: v ? v.src : null,
        videoPlaying: v ? (!v.paused && !v.ended) : false,
        overlayExists: Boolean(overlay),
        hasButtonsInPhase1: Boolean(btn)
      };
    })()`,
    returnByValue: true
  });
  console.log('Phase 1 Inspection:', checkPhase1.result.value);
  await captureScreenshot(cdp, 'live_hero_clean_big_video_no_buttons.png');

  // Step 2: Trigger Transition to 6-Slide Billboard
  console.log('Triggering transition to 6-slide billboard...');
  await cdp.send('Runtime.evaluate', {
    expression: `window.njapHeroTransition()`
  });
  await sleep(1000);

  // Check Phase 2 (6 Slides & 6 Tabs)
  const checkPhase2 = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const slides = document.querySelectorAll('.hero-slide');
      const tabs = document.querySelectorAll('.hero-tab-item');
      const s1Title = document.getElementById('hero-single-h1') ? document.getElementById('hero-single-h1').textContent.trim() : null;
      const s1Media = document.getElementById('hero-visual-1') ? document.getElementById('hero-visual-1').src : null;
      return {
        totalSlides: slides.length,
        totalTabs: tabs.length,
        slide1Title: s1Title,
        slide1Media: s1Media,
        tabTitles: Array.from(tabs).map(t => t.querySelector('.hero-tab-title').textContent.trim())
      };
    })()`,
    returnByValue: true
  });
  console.log('Phase 2 Inspection:', checkPhase2.result.value);
  await captureScreenshot(cdp, 'live_hero_phase2_slide1_linked.png');

  // Step 3: Switch to Slide 2
  await cdp.send('Runtime.evaluate', {
    expression: `window.njapHeroGoto(2)`
  });
  await sleep(600);
  await captureScreenshot(cdp, 'live_hero_phase2_slide2_medicare.png');

  // Step 4: Navigate to CMS Admin & Inspect Billboards Tab
  console.log('Navigating to CMS Admin...');
  await cdp.send('Page.navigate', { url: 'https://njaccessportal.com/admin/' });
  await sleep(2000);

  // Switch to billboard tab in Admin
  await cdp.send('Runtime.evaluate', {
    expression: `switchTab('billboard')`
  });
  await sleep(1000);

  const checkCMS = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const items = document.querySelectorAll('#billboards-grid > div');
      const titles = Array.from(items).map(el => {
        const titleEl = el.querySelector('h3');
        const badgeEl = el.querySelector('.fa-star') ? 'Main Big Video' : 'Normal';
        return {
          title: titleEl ? titleEl.textContent.trim() : '',
          type: badgeEl
        };
      });
      return {
        totalCards: items.length,
        cards: titles
      };
    })()`,
    returnByValue: true
  });
  console.log('CMS Inspection:', checkCMS.result.value);
  await captureScreenshot(cdp, 'live_cms_6slides_management.png');

  // Open modal on Slide 1
  await cdp.send('Runtime.evaluate', {
    expression: `editBillboard(state.billboards[0].id)`
  });
  await sleep(600);
  await captureScreenshot(cdp, 'live_cms_edit_slide1_modal.png');

  console.log('Verification finished successfully.');
  cdp.close();
}

run().catch(console.error);
