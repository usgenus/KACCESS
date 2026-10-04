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

  console.log('Navigating to live https://njaccessportal.com/resource-center#resources...');
  await send('Page.navigate', { url: 'https://njaccessportal.com/resource-center#resources' });
  await new Promise(r => setTimeout(r, 2000));

  // Hard reload
  await send('Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 3000));

  // Switch to Tab 2 via window.rcHeroTabClick or direct DOM click
  console.log('Activating Tab 2 (resources)...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      if (typeof window.rcHeroTabClick === 'function') {
        window.rcHeroTabClick('resources', true);
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 1500));

  // Check choices and articles count
  const state = await send('Runtime.evaluate', {
    expression: `(() => {
      const choices = document.querySelectorAll('.rc-choice-card').length;
      const articles = document.querySelectorAll('.editorial-card').length;
      const activeTabVisible = !document.getElementById('tab-view-resources')?.classList.contains('hidden');
      return { choices, articles, activeTabVisible };
    })()`,
    returnByValue: true
  });
  console.log('Resources tab state:', state.result.value);

  // Click on first article (HUD Section 202)
  console.log('Calling window.openArticleInline("art-1")...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      window.openArticleInline('art-1');
    })()`
  });
  await new Promise(r => setTimeout(r, 2000));

  // Inspect the open inline reader
  const readerState = await send('Runtime.evaluate', {
    expression: `(() => {
      const reader = document.getElementById('inlineResourceReader');
      const isVisible = reader && !reader.classList.contains('hidden');
      const title = document.querySelector('.rc-briefing-title')?.innerText || '';
      const catTag = document.querySelector('.rc-briefing-tag')?.innerText || '';
      
      const portalCard = !!document.querySelector('.rc-portal-mockup-card');
      const portalImg = document.querySelector('.rc-portal-mockup-img')?.src || '';
      const portalImgComplete = document.querySelector('.rc-portal-mockup-img')?.complete;
      const portalImgWidth = document.querySelector('.rc-portal-mockup-img')?.naturalWidth || 0;
      
      const chartCard = !!document.querySelector('.rc-redesigned-chart-card');
      const chartTitle = document.querySelector('.rc-chart-card-title')?.innerText || '';
      const chartBadge = document.querySelector('.rc-chart-card-badge')?.innerText || '';
      const tableRows = document.querySelectorAll('.rc-chart-table tbody tr').length;
      
      const summaryList = document.querySelectorAll('.rc-callout-list li').length;
      const bodyLength = document.querySelector('.rc-guide-body-content')?.innerText.length || 0;

      return {
        isVisible,
        title,
        catTag,
        portalCard,
        portalImg,
        portalImgComplete,
        portalImgWidth,
        chartCard,
        chartTitle,
        chartBadge,
        tableRows,
        summaryList,
        bodyLength
      };
    })()`,
    returnByValue: true
  });
  console.log('HUD Article Inspection:', JSON.stringify(readerState.result.value, null, 2));

  // Capture screenshot of HUD article reader
  await send('Runtime.evaluate', {
    expression: `document.getElementById('inlineResourceReader').scrollIntoView({ behavior: 'instant', block: 'start' })`
  });
  await new Promise(r => setTimeout(r, 600));

  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage/live_article_reader_hud.png', Buffer.from(shot1.data, 'base64'));
  console.log('Saved live_article_reader_hud.png');

  // Scroll down a bit to show the redesigned chart
  await send('Runtime.evaluate', {
    expression: `window.scrollBy({ top: 480, behavior: 'instant' })`
  });
  await new Promise(r => setTimeout(r, 600));

  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage/live_article_reader_chart.png', Buffer.from(shot2.data, 'base64'));
  console.log('Saved live_article_reader_chart.png');

  // Now open art-58 (Medicare Parts A & B)
  console.log('Opening art-58 (Medicare Parts A & B)...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      window.openArticleInline('art-58');
      document.getElementById('inlineResourceReader').scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`
  });
  await new Promise(r => setTimeout(r, 1500));

  const readerState2 = await send('Runtime.evaluate', {
    expression: `(() => {
      const title = document.querySelector('.rc-briefing-title')?.innerText || '';
      const portalImg = document.querySelector('.rc-portal-mockup-img')?.src || '';
      const portalImgWidth = document.querySelector('.rc-portal-mockup-img')?.naturalWidth || 0;
      const chartTitle = document.querySelector('.rc-chart-card-title')?.innerText || '';
      const tableRows = document.querySelectorAll('.rc-chart-table tbody tr').length;
      return { title, portalImg, portalImgWidth, chartTitle, tableRows };
    })()`,
    returnByValue: true
  });
  console.log('Medicare Article Inspection:', JSON.stringify(readerState2.result.value, null, 2));

  const shot3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage/live_article_reader_medicare.png', Buffer.from(shot3.data, 'base64'));
  console.log('Saved live_article_reader_medicare.png');

  // Also check navigation menu item "의료&커뮤니티 정보센터"
  await send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 0, behavior: 'instant' })`
  });
  await new Promise(r => setTimeout(r, 500));
  const menuText = await send('Runtime.evaluate', {
    expression: `(() => {
      const links = Array.from(document.querySelectorAll('nav a'));
      const rcLink = links.find(a => a.href.includes('resource-center') || a.innerText.includes('의료') || a.innerText.includes('정보센터'));
      return rcLink ? rcLink.innerText : '';
    })()`,
    returnByValue: true
  });
  console.log('Navigation link text:', JSON.stringify(menuText.result.value));

  ws.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
