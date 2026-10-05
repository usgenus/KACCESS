const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

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

async function verify() {
  const wsUrl = await getWsUrl();
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.on('open', r));

  await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  const cacheBustUrl = `https://njaccessportal.com/resource-center?cb=${Date.now()}`;
  console.log('Navigating to:', cacheBustUrl);
  await sendCommand(ws, 'Page.navigate', { url: cacheBustUrl });
  await new Promise(r => setTimeout(r, 3500));

  // Click the first article card to open article reader modal/view
  const clickRes = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const card = document.querySelector('.rc-article-card') || document.querySelector('[onclick*="openArticle"]') || document.querySelector('.rc-card');
        if (card) {
          card.click();
          return { clicked: true };
        }
        // Fallback: call openArticleDirectly if exists
        if (window.openArticle) {
          window.openArticle('senior-apartments');
          return { calledOpenArticle: true };
        }
        return { clicked: false };
      })()
    `,
    returnByValue: true
  });
  console.log('Open article result:', clickRes);

  await new Promise(r => setTimeout(r, 2000));

  // Check if article reader contains the forbidden string or njaccessportal@gmail.com
  const checkText = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const bodyText = document.body.innerText;
        const hasBadString = bodyText.includes('201-336-7400 / support@njaccessportal.com');
        const hasBadPhone = bodyText.includes('뉴저지 한인 의료접근포털 (NJAP): 201-336-7400');
        const hasGmail = bodyText.includes('njaccessportal@gmail.com');
        
        // Scroll to the bottom of reader or notice box
        const noticeBox = document.querySelector('.rc-notice-box') || document.querySelector('.rc-callout-box');
        if (noticeBox) {
          noticeBox.scrollIntoView({ behavior: 'instant', block: 'center' });
        } else {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
        }
        return { hasBadString, hasBadPhone, hasGmail };
      })()
    `,
    returnByValue: true
  });
  console.log('Live page check result:', checkText);

  await new Promise(r => setTimeout(r, 1000));

  const screenshot = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  const outPath = '/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage/live_article_cleaned_contact.png';
  fs.writeFileSync(outPath, Buffer.from(screenshot.data, 'base64'));
  console.log('Saved screenshot to:', outPath);

  ws.close();
}

verify().catch(console.error);
