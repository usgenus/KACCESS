const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const ARTIFACTS_DIR = path.join('/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage');

async function testSeniorBillboardAndPage() {
  console.log('Connecting to Chrome CDP on 127.0.0.1:9222...');
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

  console.log('Navigating to http://localhost:8080/resource-center.html#senior...');
  await send('Page.navigate', { url: 'http://localhost:8080/resource-center.html#senior' });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Check Billboard state
  const billboardState = await send('Runtime.evaluate', {
    expression: `(() => {
      const tabs = Array.from(document.querySelectorAll('.rc-hero-tab')).map(t => ({
        id: t.id,
        text: t.querySelector('.hero-tab-title')?.innerText,
        sub: t.querySelector('.hero-tab-sub')?.innerText,
        active: t.classList.contains('active'),
        tab: t.dataset.tab
      }));
      const activeSlide = document.querySelector('.hero-slide:not(.hidden)')?.id;
      const visualNum = document.getElementById('rc-hero-visual-num')?.innerText;
      const visualCaption = document.getElementById('rc-hero-visual-caption')?.innerText;
      const seniorTabActive = !document.getElementById('tab-view-senior')?.classList.contains('hidden');
      return { tabs, activeSlide, visualNum, visualCaption, seniorTabActive };
    })()`,
    returnByValue: true
  });

  console.log('Billboard & Tab State:', JSON.stringify(billboardState.result.value, null, 2));

  // Capture billboard screenshot
  const heroShot = await send('Page.captureScreenshot', { format: 'png' });
  const heroShotPath = path.join(ARTIFACTS_DIR, 'test_senior_billboard_hero.png');
  fs.writeFileSync(heroShotPath, Buffer.from(heroShot.data, 'base64'));
  console.log('Captured test_senior_billboard_hero.png');

  // 2. Scroll to senior view
  await send('Runtime.evaluate', {
    expression: `document.getElementById('tab-view-senior')?.scrollIntoView({ behavior: 'instant', block: 'start' })`,
    awaitPromise: true
  });
  await new Promise(r => setTimeout(r, 600));

  // 3. Inspect Senior Categories & Articles
  const seniorContent = await send('Runtime.evaluate', {
    expression: `(() => {
      const categories = Array.from(document.querySelectorAll('#seniorCategoryChoicesContainer .rc-choice-card')).map(c => ({
        title: c.querySelector('.text-sm')?.innerText,
        badge: c.querySelector('.font-bold')?.innerText,
        active: c.classList.contains('active')
      }));
      const articlesCount = document.querySelectorAll('#seniorArticlesGrid .editorial-card').length;
      const countLabel = document.getElementById('seniorCountLabel')?.innerText;
      return { categoriesCount: categories.length, categories, articlesCount, countLabel };
    })()`,
    returnByValue: true
  });

  console.log('Senior Categories & Articles:', JSON.stringify(seniorContent.result.value, null, 2));

  // Capture senior view screenshot
  const seniorShot = await send('Page.captureScreenshot', { format: 'png' });
  const seniorShotPath = path.join(ARTIFACTS_DIR, 'test_senior_view_categories.png');
  fs.writeFileSync(seniorShotPath, Buffer.from(seniorShot.data, 'base64'));
  console.log('Captured test_senior_view_categories.png');

  // 4. Test clicking Category 2 (처방약 & 의료비 저축)
  console.log('Clicking senior-rx category card...');
  await send('Runtime.evaluate', {
    expression: `window.filterBySeniorCategory('senior-rx')`,
    awaitPromise: true
  });
  await new Promise(r => setTimeout(r, 500));

  const rxFilterState = await send('Runtime.evaluate', {
    expression: `(() => {
      const activeBadge = document.getElementById('activeSeniorCategoryBadge')?.innerText;
      const countLabel = document.getElementById('seniorCountLabel')?.innerText;
      const articles = Array.from(document.querySelectorAll('#seniorArticlesGrid .editorial-card h4')).map(h => h.innerText);
      return { activeBadge, countLabel, articles };
    })()`,
    returnByValue: true
  });

  console.log('Rx Filter State:', JSON.stringify(rxFilterState.result.value, null, 2));

  // 5. Test opening first article inline
  console.log('Opening first senior article inline...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const firstCard = document.querySelector('#seniorArticlesGrid .editorial-card');
      if (firstCard) firstCard.click();
    })()`,
    awaitPromise: true
  });
  await new Promise(r => setTimeout(r, 600));

  const inlineReaderState = await send('Runtime.evaluate', {
    expression: `(() => {
      const reader = document.getElementById('inlineSeniorReader');
      const isVisible = reader && !reader.classList.contains('hidden');
      const badge = document.getElementById('inlineSeniorReaderCatBadge')?.innerText;
      const title = reader?.querySelector('.rc-briefing-title')?.innerText || reader?.querySelector('h2, h3, h4')?.innerText;
      return { isVisible, badge, title };
    })()`,
    returnByValue: true
  });

  console.log('Inline Reader State:', JSON.stringify(inlineReaderState.result.value, null, 2));

  // Capture inline reader screenshot
  const readerShot = await send('Page.captureScreenshot', { format: 'png' });
  const readerShotPath = path.join(ARTIFACTS_DIR, 'test_senior_inline_reader.png');
  fs.writeFileSync(readerShotPath, Buffer.from(readerShot.data, 'base64'));
  console.log('Captured test_senior_inline_reader.png');

  ws.close();
  console.log('All tests completed successfully!');
}

testSeniorBillboardAndPage().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
