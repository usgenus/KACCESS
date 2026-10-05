const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = '/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage';
if (!fs.existsSync(ARTIFACTS_DIR)) fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const tabs = JSON.parse(data);
        const pageTab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension://'));
        if (pageTab) resolve(pageTab.webSocketDebuggerUrl);
        else reject(new Error('No page tab found'));
      });
    }).on('error', reject);
  });
}

function sendCommand(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const handler = (data) => {
      const msg = JSON.parse(data);
      if (msg.id === id) {
        ws.off('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function run() {
  const wsUrl = await getWsUrl();
  console.log('Connecting to Chrome CDP at:', wsUrl);
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.on('open', r));

  await sendCommand(ws, 'Page.enable');
  const cb = Date.now();
  console.log(`Navigating to https://njaccessportal.com/?v=${cb}`);
  await sendCommand(ws, 'Page.navigate', { url: `https://njaccessportal.com/?v=${cb}` });
  await new Promise(r => setTimeout(r, 4000));

  // Check Phase 1 state
  const phase1Check = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const hero = document.getElementById('homepage-hero-billboard-section');
      const vPhase = document.getElementById('hero-video-phase');
      const video = document.getElementById('hero-intro-video');
      const overlayTitle = document.getElementById('hero-video-title');
      const overlayDesc = document.getElementById('hero-video-desc');
      const overlayLink = document.getElementById('hero-video-link-primary');
      const nextBtn = document.getElementById('hero-video-next-btn');
      const skipBtn = document.getElementById('hero-video-skip-btn');
      const counter = document.getElementById('hero-video-counter');

      return {
        hasHero: !!hero,
        isPhaseVideo: hero ? hero.classList.contains('hero-phase-video') : false,
        vPhaseVisible: vPhase ? window.getComputedStyle(vPhase).opacity : null,
        videoSrc: video ? video.currentSrc : null,
        videoPaused: video ? video.paused : null,
        overlayTitle: overlayTitle ? overlayTitle.innerText.trim() : null,
        overlayDesc: overlayDesc ? overlayDesc.innerText.trim() : null,
        overlayLinkHref: overlayLink ? overlayLink.href : null,
        overlayLinkText: overlayLink ? overlayLink.innerText.trim() : null,
        hasNoNextBtn: !nextBtn,
        hasNoSkipBtn: !skipBtn,
        hasNoCounter: !counter
      };
    })()`,
    returnByValue: true
  });
  console.log('Phase 1 Inspection:', phase1Check.result.value);

  // Capture Phase 1 Screenshot
  const ss1 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  const p1Path = path.join(ARTIFACTS_DIR, 'live_hero_phase1_video_clean.png');
  fs.writeFileSync(p1Path, Buffer.from(ss1.data, 'base64'));
  console.log('Saved Phase 1 screenshot to:', p1Path);

  // Trigger video 1 ended to test Video 2 playback
  console.log('Simulating Video 1 ended -> testing sequential Video 2...');
  const video2Check = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const video = document.getElementById('hero-intro-video');
      if (video) {
        video.dispatchEvent(new Event('ended'));
      }
      return new Promise(r => setTimeout(() => {
        const videoAfter = document.getElementById('hero-intro-video');
        const overlayDesc = document.getElementById('hero-video-desc');
        r({
          videoSrc: videoAfter ? videoAfter.currentSrc : null,
          overlayDesc: overlayDesc ? overlayDesc.innerText.trim() : null
        });
      }, 500));
    })()`,
    awaitPromise: true,
    returnByValue: true
  });
  console.log('Video 2 Inspection:', video2Check.result.value);

  // Capture Video 2 Screenshot
  const ss2 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  const p2Path = path.join(ARTIFACTS_DIR, 'live_hero_phase1_video2_clean.png');
  fs.writeFileSync(p2Path, Buffer.from(ss2.data, 'base64'));
  console.log('Saved Video 2 screenshot to:', p2Path);

  // Test automatic scroll-to-skip transition to Phase 2 (6 Slides)
  console.log('Testing automatic scroll skip to Phase 2...');
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      window.dispatchEvent(new WheelEvent('wheel', { deltaY: 50 }));
    })()`
  });
  await new Promise(r => setTimeout(r, 1000));

  const phase2Check = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const hero = document.getElementById('homepage-hero-billboard-section');
      const bPhase = document.getElementById('hero-billboard-phase');
      const slides = document.querySelectorAll('.hero-slide');
      const tabs = document.querySelectorAll('.hero-tab-item');
      const slide1H1 = document.getElementById('hero-single-h1');
      const slide1Desc = document.getElementById('hero-slide1-desc');
      const slide1Link = document.getElementById('hero-slide1-link');
      const vis1 = document.getElementById('hero-visual-1');
      const caption = document.getElementById('hero-visual-caption');
      const num = document.getElementById('hero-visual-num');

      return {
        isPhaseBillboard: hero ? hero.classList.contains('hero-phase-billboard') : false,
        totalSlides: slides.length,
        totalTabs: tabs.length,
        tabTitles: Array.from(tabs).map(t => t.innerText.trim().replace(/\\n/g, ' ')),
        slide1H1: slide1H1 ? slide1H1.innerText.trim() : null,
        slide1Desc: slide1Desc ? slide1Desc.innerText.trim() : null,
        slide1LinkHref: slide1Link ? slide1Link.href : null,
        slide1LinkText: slide1Link ? slide1Link.innerText.trim() : null,
        vis1Tag: vis1 ? vis1.tagName : null,
        vis1Src: vis1 ? (vis1.currentSrc || vis1.src) : null,
        captionText: caption ? caption.innerText.trim() : null,
        captionNum: num ? num.innerText.trim() : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Phase 2 Inspection (6 Slides):', phase2Check.result.value);

  // Capture Phase 2 Slide 1 Screenshot
  const ss3 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  const p3Path = path.join(ARTIFACTS_DIR, 'live_hero_phase2_6slides_slide1.png');
  fs.writeFileSync(p3Path, Buffer.from(ss3.data, 'base64'));
  console.log('Saved Phase 2 Slide 1 screenshot to:', p3Path);

  // Test clicking Tab 2 (메디케어 & ACA)
  console.log('Clicking Tab 2 (메디케어 & ACA)...');
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      window.njapHeroGoto(2);
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  const tab2Check = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const activeSlide = document.getElementById('hero-slide-2');
      const activeTab = document.getElementById('hero-tab-2');
      const caption = document.getElementById('hero-visual-caption');
      const num = document.getElementById('hero-visual-num');
      return {
        slide2Visible: activeSlide ? !activeSlide.classList.contains('hidden') : false,
        slide2Title: activeSlide ? activeSlide.querySelector('.hero-main-title').innerText.trim().replace(/\\n/g, ' ') : null,
        tab2Active: activeTab ? activeTab.getAttribute('aria-selected') : null,
        caption: caption ? caption.innerText.trim() : null,
        num: num ? num.innerText.trim() : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Tab 2 Check:', tab2Check.result.value);

  const ss4 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  const p4Path = path.join(ARTIFACTS_DIR, 'live_hero_phase2_slide2_medicare.png');
  fs.writeFileSync(p4Path, Buffer.from(ss4.data, 'base64'));
  console.log('Saved Slide 2 screenshot to:', p4Path);

  ws.close();
  console.log('Verification completed successfully!');
}

run().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
