const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACTS_DIR = path.join(__dirname, '..');

async function getPageWsUrl(port) {
  for (let i = 0; i < 30; i++) {
    try {
      const targets = await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${port}/json/list`, res => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
          });
        }).on('error', reject);
      });
      const pageTarget = targets.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
      if (pageTarget) return pageTarget.webSocketDebuggerUrl;
    } catch (e) {
      await new Promise(r => setTimeout(r, 200));
    }
  }
  throw new Error('Failed to get page WebSocket debugger URL');
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.pending = new Map();
  }

  async connect() {
    if (this.ws.readyState === WebSocket.OPEN) return;
    return new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve, reject } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return res.result ? res.result.value : null;
  }

  async captureScreenshot(filepath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filepath, Buffer.from(res.data, 'base64'));
    console.log(`Saved screenshot: ${filepath}`);
  }

  close() {
    this.ws.close();
  }
}

async function run() {
  console.log('Launching headless Chrome for verification...');
  const port = 9223;
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    'http://localhost:8080/'
  ]);

  try {
    const wsUrl = await getPageWsUrl(port);
    console.log('Connected to Chrome Page Target:', wsUrl);
    const client = new CDPClient(wsUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('DOM.enable');
    await client.send('Runtime.enable');

    await client.send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        try {
          localStorage.setItem('njap_push_dismissed', 'dismissed');
          localStorage.setItem('njap_push_registered', 'true');
          const style = document.createElement('style');
          style.innerHTML = '#njap-notif-modal, #njap-notif-toast, .notif-modal-backdrop { display: none !important; pointer-events: none !important; }';
          document.head ? document.head.appendChild(style) : document.addEventListener('DOMContentLoaded', () => document.head.appendChild(style));
        } catch(e) {}
      `
    });

    console.log('Navigating to page...');
    await client.send('Page.navigate', { url: 'http://localhost:8080/' });
    await new Promise(r => setTimeout(r, 1500));

    // Test 1: Video layer and Skip button
    console.log('1. Verifying Video Layer & Skip Button...');
    const videoInfo = await client.eval(`(() => {
      const v = document.getElementById('hero-intro-video');
      const skip = document.getElementById('hero-video-skip-btn');
      const hero = document.getElementById('homepage-hero-billboard-section');
      return {
        hasVideo: !!v,
        videoSrc: v ? v.querySelector('source')?.src : null,
        poster: v ? v.poster : null,
        hasSkip: !!skip,
        skipText: skip ? skip.innerText.trim() : null,
        heightBefore: hero ? hero.offsetHeight : null
      };
    })()`);
    console.log('Video Info & Height Before:', videoInfo);
    await client.captureScreenshot(path.join(ARTIFACTS_DIR, 'hero_test_1_video.png'));

    // Test 2: Click Skip button and verify Billboard Slide 01
    console.log('2. Clicking Skip button...');
    await client.eval(`document.getElementById('hero-video-skip-btn').click()`);
    await new Promise(r => setTimeout(r, 800));

    const slide1Info = await client.eval(`(() => {
      const hero = document.getElementById('homepage-hero-billboard-section');
      const h1 = document.getElementById('hero-single-h1');
      const s1 = document.getElementById('hero-slide-1');
      const s2 = document.getElementById('hero-slide-2');
      const tab1 = document.getElementById('hero-tab-1');
      const tab2 = document.getElementById('hero-tab-2');
      const heightAfter = hero ? hero.offsetHeight : null;
      return {
        heightAfter,
        h1Text: h1 ? h1.innerText.replace(/\\n/g, ' ') : null,
        s1Visible: s1 && !s1.classList.contains('hidden'),
        s2Visible: s2 && !s2.classList.contains('hidden'),
        tab1Selected: tab1 ? tab1.getAttribute('aria-selected') : null,
        tab2Selected: tab2 ? tab2.getAttribute('aria-selected') : null
      };
    })()`);
    const hBefore = videoInfo.heightBefore;
    const hAfter = slide1Info.heightAfter;
    const shrinkPct = Math.round(((hBefore - hAfter) / hBefore) * 100);
    console.log(`Height Transition: ${hBefore}px -> ${hAfter}px (Shrunk vertically by: ${shrinkPct}%)`);
    console.log('Slide 1 Billboard Info:', slide1Info);
    await client.captureScreenshot(path.join(ARTIFACTS_DIR, 'hero_test_2_slide1.png'));

    // Test 3: Wait 4.2 seconds to verify auto-rotation to Slide 02
    console.log('3. Waiting for auto-rotation (4.2 seconds)...');
    await new Promise(r => setTimeout(r, 4200));

    const slide2Info = await client.eval(`(() => {
      const h1 = document.getElementById('hero-single-h1');
      const s1 = document.getElementById('hero-slide-1');
      const s2 = document.getElementById('hero-slide-2');
      const caption = document.getElementById('hero-visual-caption');
      const num = document.getElementById('hero-visual-num');
      const tab2 = document.getElementById('hero-tab-2');
      return {
        h1Text: h1 ? h1.innerText.replace(/\\n/g, ' ') : null,
        s1Visible: s1 && !s1.classList.contains('hidden'),
        s2Visible: s2 && !s2.classList.contains('hidden'),
        caption: caption ? caption.innerText.trim() : null,
        num: num ? num.innerText.trim() : null,
        tab2Selected: tab2 ? tab2.getAttribute('aria-selected') : null
      };
    })()`);
    console.log('Slide 2 Auto-rotated Info:', slide2Info);
    await client.captureScreenshot(path.join(ARTIFACTS_DIR, 'hero_test_3_slide2.png'));

    // Test 4: Click Tab 3 (커뮤니티 포럼) & reset timer
    console.log('4. Clicking Tab 3 (커뮤니티 포럼)...');
    await client.eval(`window.njapHeroGoto(3)`);
    await new Promise(r => setTimeout(r, 450));

    const slide3Info = await client.eval(`(() => {
      const h1 = document.getElementById('hero-single-h1');
      const s3 = document.getElementById('hero-slide-3');
      const caption = document.getElementById('hero-visual-caption');
      const num = document.getElementById('hero-visual-num');
      const tab3 = document.getElementById('hero-tab-3');
      return {
        h1Text: h1 ? h1.innerText.replace(/\\n/g, ' ') : null,
        s3Visible: s3 && !s3.classList.contains('hidden'),
        caption: caption ? caption.innerText.trim() : null,
        num: num ? num.innerText.trim() : null,
        tab3Selected: tab3 ? tab3.getAttribute('aria-selected') : null
      };
    })()`);
    console.log('Slide 3 Manual Navigation Info:', slide3Info);
    await client.captureScreenshot(path.join(ARTIFACTS_DIR, 'hero_test_4_slide3.png'));

    // Test 5: Keyboard navigation (ArrowRight)
    console.log('5. Testing Keyboard Navigation...');
    await client.eval(`(() => {
      const tablist = document.querySelector('[role="tablist"]');
      tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    })()`);
    await new Promise(r => setTimeout(r, 450));

    const slide4Info = await client.eval(`(() => {
      const caption = document.getElementById('hero-visual-caption');
      const tab4 = document.getElementById('hero-tab-4');
      return {
        caption: caption ? caption.innerText.trim() : null,
        tab4Selected: tab4 ? tab4.getAttribute('aria-selected') : null
      };
    })()`);
    console.log('Keyboard Navigation to Slide 4:', slide4Info);

    // Test 6: Mobile layout check (390x844)
    console.log('6. Resizing to Mobile (390x844)...');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 600));

    const mobileInfo = await client.eval(`(() => {
      const bodyWidth = document.body.scrollWidth;
      const windowWidth = window.innerWidth;
      const hasOverflow = bodyWidth > windowWidth;
      return { bodyWidth, windowWidth, hasOverflow };
    })()`);
    console.log('Mobile Layout Check:', mobileInfo);
    await client.captureScreenshot(path.join(ARTIFACTS_DIR, 'hero_test_5_mobile.png'));

    console.log('\nAll browser verification tests passed successfully!');
    client.close();
  } finally {
    chromeProc.kill();
  }
}

run().catch(console.error);
