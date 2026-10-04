const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = '/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/.tempmediaStorage';
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

function getCdpEndpoint() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json/list', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const list = JSON.parse(data);
          let target = list.find(t => t.type === 'page' && t.url.includes('njaccessportal.com'));
          if (!target) target = list.find(t => t.type === 'page');
          if (target && target.webSocketDebuggerUrl) {
            resolve(target.webSocketDebuggerUrl);
          } else {
            reject(new Error('No suitable CDP page target found'));
          }
        } catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function sendCommand(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const msg = JSON.stringify({ id, method, params });
    const onMessage = (data) => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.id === id) {
          ws.off('message', onMessage);
          if (parsed.error) reject(parsed.error);
          else resolve(parsed.result);
        }
      } catch (err) {}
    };
    ws.on('message', onMessage);
    ws.send(msg);
  });
}

async function evalCode(ws, expression) {
  const res = await sendCommand(ws, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  if (res && res.result) {
    return res.result.value;
  }
  return null;
}

async function captureScreenshot(ws, filename) {
  const result = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  const filepath = path.join(ARTIFACTS_DIR, filename);
  fs.writeFileSync(filepath, Buffer.from(result.data, 'base64'));
  console.log(`[SCREENSHOT] Saved: ${filepath}`);
}

async function run() {
  const wsUrl = await getCdpEndpoint();
  const ws = new WebSocket(wsUrl);

  await new Promise(r => ws.on('open', r));
  console.log('[CDP] Connected');

  await sendCommand(ws, 'Page.enable');
  await sendCommand(ws, 'DOM.enable');

  console.log('[NAVIGATING] https://njaccessportal.com/medicare');
  await sendCommand(ws, 'Page.navigate', { url: 'https://njaccessportal.com/medicare' });
  await new Promise(r => setTimeout(r, 2500));

  // 1. Switch to tab-senior to inspect Senior Hotline Callout
  await evalCode(ws, `window.switchTab('senior', false);`);
  await new Promise(r => setTimeout(r, 400));

  const seniorHotlineInfo = await evalCode(ws, `(() => {
    const el = document.querySelector('.medicare-dark-navy');
    if (!el) return { error: 'Not found' };
    const style = window.getComputedStyle(el);
    const heading = el.querySelector('h3');
    const headingStyle = heading ? window.getComputedStyle(heading) : null;
    const cards = Array.from(el.querySelectorAll('.grid > div')).map(c => {
      const cs = window.getComputedStyle(c);
      return {
        bg: cs.backgroundColor,
        color: cs.color,
        text: c.textContent.trim().replace(/\\s+/g, ' ')
      };
    });
    return {
      bg: style.backgroundColor,
      backgroundImage: style.backgroundImage,
      color: style.color,
      headingColor: headingStyle ? headingStyle.color : null,
      cardsCount: cards.length,
      sampleCards: cards.slice(0, 2)
    };
  })()`);
  console.log('[SENIOR HOTLINE INFO]:', JSON.stringify(seniorHotlineInfo, null, 2));

  // Scroll to senior hotline callout and screenshot
  await evalCode(ws, `(() => {
    const el = document.querySelector('.medicare-dark-navy');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  })()`);
  await new Promise(r => setTimeout(r, 500));
  await captureScreenshot(ws, 'live_senior_hotline_contrast.png');

  // 2. Inspect Footer styling & contrast
  const footerInfo = await evalCode(ws, `(() => {
    const footer = document.querySelector('footer');
    if (!footer) return { error: 'Not found' };
    const style = window.getComputedStyle(footer);
    const links = Array.from(footer.querySelectorAll('a')).slice(0, 5).map(a => {
      const as = window.getComputedStyle(a);
      return { text: a.textContent.trim(), color: as.color };
    });
    return {
      bg: style.backgroundColor,
      color: style.color,
      sampleLinks: links
    };
  })()`);
  console.log('[FOOTER INFO]:', JSON.stringify(footerInfo, null, 2));

  // Scroll to footer and screenshot
  await evalCode(ws, `(() => {
    const f = document.querySelector('footer');
    if (f) f.scrollIntoView({ behavior: 'instant', block: 'end' });
  })()`);
  await new Promise(r => setTimeout(r, 500));
  await captureScreenshot(ws, 'live_footer_contrast.png');

  // 3. Test Highlight Buttons click & immediate reveal
  // First scroll back to top
  await evalCode(ws, `window.scrollTo({ top: 0, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot(ws, 'live_hero_highlights_top.png');

  // Click Highlight 01 (자격확인 계산기) - #rc-billboard-tab-1
  console.log('[CLICKING] Highlight 01 (#rc-billboard-tab-1)');
  await evalCode(ws, `document.getElementById('rc-billboard-tab-1').click();`);
  await new Promise(r => setTimeout(r, 800));

  const tab1Check = await evalCode(ws, `(() => {
    const scrollY = window.scrollY;
    const tab = document.getElementById('tab-calculator');
    const isHidden = tab ? tab.classList.contains('hidden') : true;
    const sections = tab ? Array.from(tab.querySelectorAll('section')).map(s => {
      const cs = window.getComputedStyle(s);
      return { id: s.id, opacity: cs.opacity, transform: cs.transform };
    }) : [];
    return { scrollY, isHidden, sections: sections.slice(0, 3) };
  })()`);
  console.log('[TAB 1 CHECK]:', JSON.stringify(tab1Check, null, 2));
  await captureScreenshot(ws, 'live_tab1_instant_scrolled.png');

  // Click Highlight 02 (커뮤니티 리소스) - #rc-billboard-tab-2
  console.log('[CLICKING] Highlight 02 (#rc-billboard-tab-2)');
  await evalCode(ws, `window.scrollTo({ top: 0, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 400));
  await evalCode(ws, `document.getElementById('rc-billboard-tab-2').click();`);
  await new Promise(r => setTimeout(r, 800));

  const tab2Check = await evalCode(ws, `(() => {
    const scrollY = window.scrollY;
    const tab = document.getElementById('tab-directory');
    const isHidden = tab ? tab.classList.contains('hidden') : true;
    const sections = tab ? Array.from(tab.querySelectorAll('section')).map(s => {
      const cs = window.getComputedStyle(s);
      return { id: s.id, opacity: cs.opacity, transform: cs.transform };
    }) : [];
    return { scrollY, isHidden, sections: sections.slice(0, 3) };
  })()`);
  console.log('[TAB 2 CHECK]:', JSON.stringify(tab2Check, null, 2));
  await captureScreenshot(ws, 'live_tab2_instant_scrolled.png');

  // Click Highlight 03 (메디케어 & ACA) - #rc-billboard-tab-3
  console.log('[CLICKING] Highlight 03 (#rc-billboard-tab-3)');
  await evalCode(ws, `window.scrollTo({ top: 0, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 400));
  await evalCode(ws, `document.getElementById('rc-billboard-tab-3').click();`);
  await new Promise(r => setTimeout(r, 800));

  const tab3Check = await evalCode(ws, `(() => {
    const scrollY = window.scrollY;
    const tab = document.getElementById('tab-medicare');
    const isHidden = tab ? tab.classList.contains('hidden') : true;
    const sections = tab ? Array.from(tab.querySelectorAll('section')).map(s => {
      const cs = window.getComputedStyle(s);
      return { id: s.id, opacity: cs.opacity, transform: cs.transform };
    }) : [];
    return { scrollY, isHidden, sections: sections.slice(0, 3) };
  })()`);
  console.log('[TAB 3 CHECK]:', JSON.stringify(tab3Check, null, 2));
  await captureScreenshot(ws, 'live_tab3_instant_scrolled.png');

  // Click Highlight 04 (시니어 핫라인 & 리소스) - #rc-billboard-tab-4
  console.log('[CLICKING] Highlight 04 (#rc-billboard-tab-4)');
  await evalCode(ws, `window.scrollTo({ top: 0, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 400));
  await evalCode(ws, `document.getElementById('rc-billboard-tab-4').click();`);
  await new Promise(r => setTimeout(r, 800));

  const tab4Check = await evalCode(ws, `(() => {
    const scrollY = window.scrollY;
    const tab = document.getElementById('tab-senior');
    const isHidden = tab ? tab.classList.contains('hidden') : true;
    const sections = tab ? Array.from(tab.querySelectorAll('section')).map(s => {
      const cs = window.getComputedStyle(s);
      return { id: s.id, opacity: cs.opacity, transform: cs.transform };
    }) : [];
    return { scrollY, isHidden, sections: sections.slice(0, 3) };
  })()`);
  console.log('[TAB 4 CHECK]:', JSON.stringify(tab4Check, null, 2));
  await captureScreenshot(ws, 'live_tab4_instant_scrolled.png');

  // 4. Check Homepage footer and dark elements
  console.log('[NAVIGATING] Homepage https://njaccessportal.com/');
  await sendCommand(ws, 'Page.navigate', { url: 'https://njaccessportal.com/' });
  await new Promise(r => setTimeout(r, 2000));
  await evalCode(ws, `(() => {
    const f = document.querySelector('footer');
    if (f) f.scrollIntoView({ behavior: 'instant', block: 'end' });
  })()`);
  await new Promise(r => setTimeout(r, 500));
  await captureScreenshot(ws, 'live_homepage_footer_contrast.png');

  ws.close();
  console.log('[DONE] All contrast and scroll tests completed successfully!');
}

run().catch(err => {
  console.error('[ERROR]', err);
  process.exit(1);
});
