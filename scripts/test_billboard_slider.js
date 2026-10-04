const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8080;
const ROOT = path.join(__dirname, '..');
const ARTIFACTS_DIR = path.join('/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage');

class CdpClient {
  constructor(port = 9222) {
    this.port = port;
    this.ws = null;
    this.msgId = 1;
    this.callbacks = new Map();
  }

  async connect() {
    const listRes = await fetch(`http://127.0.0.1:${this.port}/json/list`);
    const pages = await listRes.json();
    const page = pages.find(p => p.type === 'page');
    if (!page) throw new Error('No page found');

    const WebSocket = require('ws');
    this.ws = new WebSocket(page.webSocketDebuggerUrl);

    return new Promise((resolve, reject) => {
      this.ws.on('open', resolve);
      this.ws.on('error', reject);
      this.ws.on('message', (data) => {
        const msg = JSON.parse(data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { res, rej } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) rej(msg.error);
          else res(msg.result);
        }
      });
    });
  }

  send(method, params = {}) {
    return new Promise((res, rej) => {
      const id = this.msgId++;
      this.callbacks.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expr) {
    const res = await this.send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : null;
  }

  async captureScreenshot(filePath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    console.log(`Saved screenshot: ${filePath}`);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runBillboardTest() {
  const client = new CdpClient();
  await client.connect();

  console.log('1. Navigating to http://localhost:8080/resource-center ...');
  await client.send('Page.navigate', { url: 'http://localhost:8080/resource-center' });
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot initial billboard (Slide 1)
  await client.eval(`window.scrollTo({ top: 0, behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 400));
  await client.captureScreenshot(path.join(ARTIFACTS_DIR, 'rc_billboard_slide1.png'));

  const slide1State = await client.eval(`(() => {
    const s1 = document.getElementById('rc-hero-slide-1');
    const s2 = document.getElementById('rc-hero-slide-2');
    const s3 = document.getElementById('rc-hero-slide-3');
    const t1 = document.getElementById('rc-billboard-tab-1');
    const caption = document.getElementById('rc-hero-visual-caption')?.innerText;
    const num = document.getElementById('rc-hero-visual-num')?.innerText;
    const calcVisible = !document.getElementById('tab-view-calculator')?.classList.contains('hidden');
    return {
      s1Visible: !s1.classList.contains('hidden'),
      s2Visible: !s2.classList.contains('hidden'),
      s3Visible: !s3.classList.contains('hidden'),
      t1Active: t1.classList.contains('active'),
      caption,
      num,
      calcVisible
    };
  })()`);
  console.log('Slide 1 State:', slide1State);

  // Click Tab 2 (커뮤니티 리소스)
  console.log('2. Clicking Billboard Tab 2 (커뮤니티 리소스)...');
  await client.eval(`document.getElementById('rc-billboard-tab-2').click()`);
  await new Promise(r => setTimeout(r, 600));
  await client.captureScreenshot(path.join(ARTIFACTS_DIR, 'rc_billboard_slide2.png'));

  const slide2State = await client.eval(`(() => {
    const s1 = document.getElementById('rc-hero-slide-1');
    const s2 = document.getElementById('rc-hero-slide-2');
    const s3 = document.getElementById('rc-hero-slide-3');
    const t2 = document.getElementById('rc-billboard-tab-2');
    const caption = document.getElementById('rc-hero-visual-caption')?.innerText;
    const num = document.getElementById('rc-hero-visual-num')?.innerText;
    const resVisible = !document.getElementById('tab-view-resources')?.classList.contains('hidden');
    return {
      s1Visible: !s1.classList.contains('hidden'),
      s2Visible: !s2.classList.contains('hidden'),
      s3Visible: !s3.classList.contains('hidden'),
      t2Active: t2.classList.contains('active'),
      caption,
      num,
      resVisible
    };
  })()`);
  console.log('Slide 2 State:', slide2State);

  // Click Tab 3 (메디케어 & ACA)
  console.log('3. Clicking Billboard Tab 3 (메디케어 & ACA)...');
  await client.eval(`document.getElementById('rc-billboard-tab-3').click()`);
  await new Promise(r => setTimeout(r, 600));
  await client.captureScreenshot(path.join(ARTIFACTS_DIR, 'rc_billboard_slide3.png'));

  const slide3State = await client.eval(`(() => {
    const s1 = document.getElementById('rc-hero-slide-1');
    const s2 = document.getElementById('rc-hero-slide-2');
    const s3 = document.getElementById('rc-hero-slide-3');
    const t3 = document.getElementById('rc-billboard-tab-3');
    const caption = document.getElementById('rc-hero-visual-caption')?.innerText;
    const num = document.getElementById('rc-hero-visual-num')?.innerText;
    const medVisible = !document.getElementById('tab-view-medicare')?.classList.contains('hidden');
    return {
      s1Visible: !s1.classList.contains('hidden'),
      s2Visible: !s2.classList.contains('hidden'),
      s3Visible: !s3.classList.contains('hidden'),
      t3Active: t3.classList.contains('active'),
      caption,
      num,
      medVisible
    };
  })()`);
  console.log('Slide 3 State:', slide3State);

  console.log('[SUCCESS] Billboard slider tests completed!');
  client.close();
}

runBillboardTest().catch(err => {
  console.error('[ERROR]', err);
  process.exit(1);
});
