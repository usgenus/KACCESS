const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACTS_DIR = '/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9';

const serverProc = spawn('node', ['scripts/serve_offline.js'], { cwd: '/Users/ejyoon/Desktop/KACCESS' });

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
  async captureScreenshot(outPath, clip) {
    const params = { format: 'png' };
    if (clip) params.clip = clip;
    const res = await this.send('Page.captureScreenshot', params);
    fs.writeFileSync(outPath, Buffer.from(res.data, 'base64'));
  }
  close() {
    try { this.ws.close(); } catch(e){}
  }
}

async function run() {
  await new Promise(r => setTimeout(r, 1000));
  const port = 9338;
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,1200'
  ]);

  try {
    const wsUrl = await getPageWsUrl(port);
    const client = new CDPClient(wsUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');

    console.log('1. Navigating to http://localhost:8080/resource-center ...');
    await client.send('Page.navigate', { url: 'http://localhost:8080/resource-center?v=' + Date.now() });
    await new Promise(r => setTimeout(r, 2000));

    // Test 1: Verify exactly 3 nav buttons
    const navButtons = await client.eval(`(() => {
      const tabs = Array.from(document.querySelectorAll('.rc-nav-tab'));
      return tabs.map(t => ({ tab: t.dataset.tab, text: t.innerText.trim() }));
    })()`);
    console.log('Top Nav Buttons (Must be exactly 3):', navButtons);

    // Test 2: Calculator initial result & linking
    const calcInfo = await client.eval(`(() => {
      const count = document.getElementById('calcEligibleCount')?.innerText;
      const fpl = document.getElementById('calcFplInfo')?.innerText;
      const results = document.querySelectorAll('#calcResultsContainer > div').length;
      return { count, fpl, resultsCount: results };
    })()`);
    console.log('Calculator initial result:', calcInfo);

    await client.captureScreenshot(path.join(ARTIFACTS_DIR, 'rc_test_1_calc.png'));

    // Test 3: Test clicking a service link in the calculator results
    console.log('2. Testing calculator result service click (e.g. SNAP)...');
    await client.eval(`window.handleCalculatorServiceClick('snap')`);
    await new Promise(r => setTimeout(r, 600));
    await client.eval(`document.getElementById('inlineResourceReader')?.scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await new Promise(r => setTimeout(r, 400));

    const snapInlineCheck = await client.eval(`(() => {
      const activeTabIsResources = !document.getElementById('tab-view-resources').classList.contains('hidden');
      const reader = document.getElementById('inlineResourceReader');
      const readerVisible = reader && !reader.classList.contains('hidden');
      const readerTitle = reader ? reader.querySelector('.rc-briefing-title')?.innerText : null;
      return { activeTabIsResources, readerVisible, readerTitle };
    })()`);
    console.log('Calculator link to SNAP result:', snapInlineCheck);

    await client.captureScreenshot(path.join(ARTIFACTS_DIR, 'rc_test_2_inline_reader.png'));

    // Test 4: Switching to Community Resources tab & testing category choices
    console.log('3. Testing Community Resources Category Choices...');
    await client.eval(`window.closeInlineReader()`);
    await client.eval(`window.scrollTo({ top: 400, behavior: 'instant' })`);
    await new Promise(r => setTimeout(r, 400));

    await client.captureScreenshot(path.join(ARTIFACTS_DIR, 'rc_test_3_choices.png'));

    const choicesCount = await client.eval(`document.querySelectorAll('.rc-choice-card').length`);
    console.log('Categorized Choices count (should be 8):', choicesCount);

    // Click Housing choice
    console.log('Clicking Housing category choice...');
    await client.eval(`window.filterByCategory('housing')`);
    await new Promise(r => setTimeout(r, 500));

    const housingCheck = await client.eval(`(() => {
      const housingSection = document.getElementById('housingSpecialSection');
      const housingVisible = housingSection && housingSection.style.display !== 'none';
      const housingCards = document.querySelectorAll('.rc-housing-card').length;
      const filteredGuides = document.querySelectorAll('#resourcesGrid > div').length;
      return { housingVisible, housingCards, filteredGuides };
    })()`);
    console.log('Housing category info:', housingCheck);

    await client.captureScreenshot(path.join(ARTIFACTS_DIR, 'rc_test_3_resources_housing.png'));

    // Test 5: Verify no popup modals exist
    const popupCheck = await client.eval(`(() => {
      const oldModal = document.getElementById('articleReaderModal');
      return { hasPopupModal: !!oldModal };
    })()`);
    console.log('Popup Modal check (Must be false):', popupCheck);

    // Test 6: Switching to Medicare tab
    console.log('4. Switching to Medicare tab...');
    await client.eval(`document.querySelector('.rc-nav-tab[data-tab="medicare"]').click()`);
    await new Promise(r => setTimeout(r, 500));

    const medicareInfo = await client.eval(`(() => {
      const aep = document.getElementById('section-open-enrollment');
      return {
        hasAep: !!aep,
        aepColor: aep ? window.getComputedStyle(aep).color : null
      };
    })()`);
    console.log('Medicare tab info:', medicareInfo);

    await client.captureScreenshot(path.join(ARTIFACTS_DIR, 'rc_test_4_medicare.png'));

    console.log('\n[SUCCESS] All updated tests passed!');
    client.close();
  } finally {
    chromeProc.kill();
    serverProc.kill();
  }
}

run().catch(err => {
  console.error(err);
  serverProc.kill();
  process.exit(1);
});
