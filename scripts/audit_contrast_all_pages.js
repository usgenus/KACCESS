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

const auditCode = `(() => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  function parseCssColor(str) {
    if (!str || str === 'transparent' || str === 'rgba(0, 0, 0, 0)') return [0, 0, 0, 0];
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = str;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  }

  function getLuminance([r, g, b]) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function contrastRatio(rgb1, rgb2) {
    const lum1 = getLuminance(rgb1);
    const lum2 = getLuminance(rgb2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  function getEffectiveBg(el) {
    // Start with default body off-white
    let bg = [248, 248, 246];
    
    // Collect ancestors from root down to el
    const chain = [];
    let cur = el;
    while (cur && cur !== document.documentElement) {
      chain.unshift(cur);
      cur = cur.parentElement;
    }

    for (let node of chain) {
      const style = window.getComputedStyle(node);
      const bi = style.backgroundImage;
      const bc = style.backgroundColor;

      // Extract colors from gradients if present (unless text-clipped)
      const isTextClipped = style.webkitBackgroundClip === 'text' || style.backgroundClip === 'text';
      if (!isTextClipped && bi && bi !== 'none' && bi.includes('gradient')) {
        const matches = bi.match(/(?:rgba?|lab|lch|oklab|oklch)\([^)]+\)|#[0-9a-fA-F]{3,8}/g);
        if (matches && matches.length > 0) {
          const firstStop = parseCssColor(matches[0]);
          if (firstStop[3] > 0.1) {
            bg = [firstStop[0], firstStop[1], firstStop[2]];
          }
        }
      }

      // Blend backgroundColor if present
      const parsed = parseCssColor(bc);
      if (parsed && parsed[3] > 0.01) {
        const [r, g, b, a] = parsed;
        bg = [
          Math.round(r * a + bg[0] * (1 - a)),
          Math.round(g * a + bg[1] * (1 - a)),
          Math.round(b * a + bg[2] * (1 - a))
        ];
      }
    }

    return bg;
  }

  const allElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, label, li, td, th, dt, dd, strong, div');
  const issues = [];

  for (let el of allElements) {
    if (el.children.length > 0 && Array.from(el.childNodes).every(n => n.nodeType !== 3 || !n.textContent.trim())) {
      continue;
    }
    const text = el.textContent.trim();
    if (!text || text.length < 2) continue;

    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;

    // If text is rendered via gradient text-fill, skip raw color check
    if (style.webkitBackgroundClip === 'text' || style.backgroundClip === 'text' || style.webkitTextFillColor === 'transparent') {
      continue;
    }

    const textColorRgba = parseCssColor(style.color);
    if (!textColorRgba || textColorRgba[3] < 0.05) continue;
    const textColor = [textColorRgba[0], textColorRgba[1], textColorRgba[2]];

    const bgColor = getEffectiveBg(el);
    if (!bgColor) continue;

    const ratio = contrastRatio(textColor, bgColor);
    const lumText = getLuminance(textColor);

    if (ratio < 2.0) {
      let sel = el.tagName.toLowerCase();
      if (el.id) sel += '#' + el.id;
      else if (el.className) sel += '.' + Array.from(el.classList).slice(0, 3).join('.');

      issues.push({
        selector: sel,
        text: text.slice(0, 60),
        textColor: style.color,
        bgColor: 'rgb(' + bgColor.join(', ') + ')',
        ratio: ratio.toFixed(2),
        type: lumText > 0.5 ? 'LIGHT_ON_LIGHT' : 'DARK_ON_DARK'
      });
    }
  }

  const unique = [];
  const seen = new Set();
  for (let iss of issues) {
    const key = iss.selector + '|' + iss.textColor + '|' + iss.bgColor;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(iss);
    }
  }
  return unique;
})()`;

const pages = [
  { url: 'https://njaccessportal.com/', name: 'home', screenshot: 'live_home_verified.png' },
  { url: 'https://njaccessportal.com/medicare', name: 'medicare', screenshot: 'live_medicare_verified.png' },
  { url: 'https://njaccessportal.com/dictionary', name: 'dictionary', screenshot: 'live_dictionary_verified.png' },
  { url: 'https://njaccessportal.com/calculator', name: 'calculator', screenshot: 'live_calculator_verified.png' },
  { url: 'https://njaccessportal.com/matcher', name: 'matcher', screenshot: 'live_matcher_verified.png' },
  { url: 'https://njaccessportal.com/about', name: 'about', screenshot: 'live_about_verified.png' },
  { url: 'https://njaccessportal.com/blog', name: 'blog', screenshot: 'live_blog_verified.png' },
  { url: 'https://njaccessportal.com/forum', name: 'forum', screenshot: 'live_forum_verified.png' }
];

async function run() {
  const wsUrl = await getCdpEndpoint();
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.on('open', r));
  console.log('[CDP] Connected for post-deploy verification');

  await sendCommand(ws, 'Page.enable');
  await sendCommand(ws, 'DOM.enable');

  const report = {};

  for (let p of pages) {
    console.log(`[VERIFYING] ${p.url}...`);
    await sendCommand(ws, 'Page.navigate', { url: p.url });
    await new Promise(r => setTimeout(r, 2200));

    const issues = await evalCode(ws, auditCode);
    report[p.url] = issues || [];
    console.log(`  Issues found: ${issues.length}`);

    await captureScreenshot(ws, p.screenshot);
  }

  // Also specifically capture video section on homepage
  console.log('[VERIFYING VIDEO SECTION ON HOMEPAGE]');
  await sendCommand(ws, 'Page.navigate', { url: 'https://njaccessportal.com/' });
  await new Promise(r => setTimeout(r, 1500));
  await evalCode(ws, `(() => {
    const el = document.getElementById('medical-videos-section') || document.getElementById('medical-videos-count-badge');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  })()`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot(ws, 'live_home_video_badge_contrast.png');

  // Also specifically capture contact form on about page
  console.log('[VERIFYING ABOUT CONTACT FORM]');
  await sendCommand(ws, 'Page.navigate', { url: 'https://njaccessportal.com/about' });
  await new Promise(r => setTimeout(r, 1500));
  await evalCode(ws, `(() => {
    const el = document.querySelector('button[type="submit"].btn-primary');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  })()`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot(ws, 'live_about_contact_form_contrast.png');

  ws.close();
  fs.writeFileSync('/Users/ejyoon/Desktop/KACCESS/contrast_verified_report.json', JSON.stringify(report, null, 2));
  console.log('[VERIFICATION COMPLETE] All pages scanned and screenshots saved!');
}

run().catch(err => {
  console.error('[ERROR]', err);
  process.exit(1);
});
