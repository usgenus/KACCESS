const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const src = fs.readFileSync(path.join(__dirname, 'update_and_deploy_recall_slide.js'), 'utf8');
const TUS_URL = src.match(/const TUS_URL = '([^']+)'/)[1];
const AUTH_KEY = src.match(/const AUTH_KEY = '([^']+)'/)[1];
const REST_AUTH_KEY = src.match(/const REST_AUTH_KEY = '([^']+)'/)[1];

const files = [
  'uploads/images/hero_slide_forum.jpg',
  'uploads/images/hero_slide_3.jpg',
  'index.php',
  'ko/index.html',
  'medicare.html',
  'medicare/index.html'
];

function req(url, method, headers, body) {
  return new Promise((resolve, reject) => {
    const r = https.request(url, { method, headers }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    r.on('error', reject);
    if (body) r.write(body);
    r.end();
  });
}

async function upload(rel) {
  const content = fs.readFileSync(path.join(BASE_DIR, rel));
  const url = new URL(`${TUS_URL}/${rel.split('/').map(encodeURIComponent).join('/')}?override=true`);
  const base = { 'X-Auth': AUTH_KEY, 'X-Auth-Rest': REST_AUTH_KEY, 'Tus-Resumable': '1.0.0' };
  const p = await req(url, 'POST', { ...base, 'Upload-Length': content.length, 'Upload-Offset': 0 });
  if (![200, 201, 204].includes(p.status)) throw new Error(`POST ${p.status}: ${p.body}`);
  const r = await req(url, 'PATCH', {
    ...base, 'Content-Type': 'application/offset+octet-stream', 'Upload-Offset': 0, 'Content-Length': content.length
  }, content);
  if (![200, 204].includes(r.status)) throw new Error(`PATCH ${r.status}: ${r.body}`);
  console.log(`[DONE] ${rel} (${r.status})`);
}

(async () => {
  for (const f of files) {
    try { await upload(f); } catch (e) { console.error(`[FAIL] ${f}: ${e.message}`); }
  }
})();
