const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const GENERATED_IMG = '/Users/ejyoon/.gemini/antigravity-ide/brain/7165a061-b6d4-4792-8ff9-059aff7269f9/hero_slide_recall_news_1791130927399.jpg';

const TUS_URL = 'https://srv1709-files.hstgr.io/rest/e7931418e95de9aa/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MTE1MjU1NiwiaWF0IjoxNzkxMTMwOTU2fQ.9ndkQ6qRwuW3lZJH5_rlzRNVE2n_iBwdjnLFAYsRByw';
const REST_AUTH_KEY = '78b255418fe9c6e4dd08b4efda5c1e72aa994400f67f42fe302172d856b69cf8-e7931418e95de9aa';

console.log('--- Step 1: Copying new recall news image to uploads directory ---');

const imgDest1 = path.join(BASE_DIR, 'uploads/images/hero_slide_recall.jpg');
const imgDest2 = path.join(BASE_DIR, 'uploads/images/hero_slide_4.jpg');

fs.copyFileSync(GENERATED_IMG, imgDest1);
fs.copyFileSync(GENERATED_IMG, imgDest2);
console.log('[OK] Copied to uploads/images/hero_slide_recall.jpg and hero_slide_4.jpg');

// Also copy to ko/uploads if directory exists
const koImgDest1 = path.join(BASE_DIR, 'ko/uploads/images/hero_slide_recall.jpg');
const koImgDest2 = path.join(BASE_DIR, 'ko/uploads/images/hero_slide_4.jpg');
if (fs.existsSync(path.dirname(koImgDest1))) {
  fs.copyFileSync(GENERATED_IMG, koImgDest1);
  fs.copyFileSync(GENERATED_IMG, koImgDest2);
  console.log('[OK] Copied to ko/uploads/images/');
}

console.log('--- Step 2: Updating index.php and ko/index.html ---');

// Update index.php
const indexPath = path.join(BASE_DIR, 'index.php');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Update slide 4 img tag with cache buster
indexContent = indexContent.replace(
  /<img id="hero-visual-4"[^>]*\/>/,
  '<img id="hero-visual-4" src="/uploads/images/hero_slide_recall.jpg?v=<?= time() ?>" alt="긴급 식품·의약품 리콜 속보" loading="lazy" class="hero-visual-img" style="opacity: 0; transform: scale(1.02); z-index: 1;" />'
);

// Update caption 4
indexContent = indexContent.replace(
  /'TOP 10 의료 칼럼'/,
  "'긴급 식품·의약품 리콜 속보'"
);

fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('[OK] Updated index.php');

// Update ko/index.html
const koIndexPath = path.join(BASE_DIR, 'ko/index.html');
if (fs.existsSync(koIndexPath)) {
  let koIndexContent = fs.readFileSync(koIndexPath, 'utf8');
  koIndexContent = koIndexContent.replace(
    /<img id="hero-visual-4"[^>]*\/>/,
    '<img id="hero-visual-4" src="/uploads/images/hero_slide_recall.jpg?v=2" alt="긴급 식품·의약품 리콜 속보" loading="lazy" class="hero-visual-img" style="opacity: 0; transform: scale(1.02); z-index: 1;" />'
  );
  koIndexContent = koIndexContent.replace(
    /'TOP 10 의료 칼럼'/,
    "'긴급 식품·의약품 리콜 속보'"
  );
  fs.writeFileSync(koIndexPath, koIndexContent, 'utf8');
  console.log('[OK] Updated ko/index.html');
}

console.log('--- Step 3: Deploying files to Hostinger Production ---');

const filesToUpload = [
  'uploads/images/hero_slide_recall.jpg',
  'uploads/images/hero_slide_4.jpg',
  'index.php',
  'ko/index.html'
];

async function uploadFile(relPath) {
  const localPath = path.join(BASE_DIR, relPath);
  if (!fs.existsSync(localPath)) return;

  const fileContent = fs.readFileSync(localPath);
  const size = fileContent.length;
  console.log(`[UPLOADING] ${relPath} (${size} bytes)...`);

  const encodedRelPath = relPath.split('/').map(encodeURIComponent).join('/');
  const postUrl = new URL(`${TUS_URL}/${encodedRelPath}?override=true`);

  await new Promise((resolve, reject) => {
    const req = https.request(postUrl, {
      method: 'POST',
      headers: {
        'X-Auth': AUTH_KEY,
        'X-Auth-Rest': REST_AUTH_KEY,
        'Tus-Resumable': '1.0.0',
        'Upload-Length': size,
        'Upload-Offset': 0
      }
    }, res => {
      if (res.statusCode === 201 || res.statusCode === 200 || res.statusCode === 204) resolve();
      else {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => reject(new Error(`POST failed ${res.statusCode}: ${body}`)));
      }
    });
    req.on('error', reject);
    req.end();
  });

  await new Promise((resolve, reject) => {
    const patchReq = https.request(postUrl, {
      method: 'PATCH',
      headers: {
        'X-Auth': AUTH_KEY,
        'X-Auth-Rest': REST_AUTH_KEY,
        'Tus-Resumable': '1.0.0',
        'Content-Type': 'application/offset+octet-stream',
        'Upload-Offset': 0,
        'Content-Length': size
      }
    }, res => {
      if (res.statusCode === 204 || res.statusCode === 200) {
        console.log(`[DONE] ${relPath} uploaded (${res.statusCode})`);
        resolve();
      } else {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => reject(new Error(`PATCH failed ${res.statusCode}: ${body}`)));
      }
    });
    patchReq.on('error', reject);
    patchReq.write(fileContent);
    patchReq.end();
  });
}

(async () => {
  for (const f of filesToUpload) {
    try {
      await uploadFile(f);
    } catch (e) {
      console.error(`Failed to upload ${f}:`, e.message);
    }
  }
  console.log('--- Recall slide image and homepage templates deployed! ---');
})();
