const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/e95a683c02b95155/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MTA5NTE1MywiaWF0IjoxNzkxMDczNTUzfQ.NBwwIN4Zw0m_l75Zx1KGA0iRuWYJLIN-5ziwpbBdqUQ';
const REST_AUTH_KEY = '29678f6f4c7df1e2c44825990d5c448a17f849dbccbacc474670a309f80b92df-e95a683c02b95155';

const filesToUpload = [
  '.htaccess',
  'index.php',
  'index.html',
  'splash.html',
  'sitemap.php',
  'sitemap.xml',
  'robots.txt',
  'about.html',
  'about/index.html',
  'medicare.html',
  'medicare/index.html',
  'senior-care.php',
  'senior-care.html',
  'senior-care/index.html',
  'tool.html',
  'tool/index.html',
  'matcher.html',
  'calculator.html',
  'dictionary.html',
  'blog.php',
  'blog-post.php',
  'the-health-bridge.html',
  'the-health-bridge/index.html',
  'forum/index.php',
  'forum/components.php',
  'forum/topic.php',
  'forum/ask.php',
  'js/fixes.js',
  'js/njap-translate.js',
  'js/translator.js'
];

async function uploadFile(relPath) {
  const localPath = path.join(BASE_DIR, relPath);
  if (!fs.existsSync(localPath)) {
    console.warn(`[SKIP] Local file not found: ${localPath}`);
    return;
  }

  const content = fs.readFileSync(localPath);
  const size = content.length;
  console.log(`[UPLOADING] ${relPath} (${size} bytes)...`);

  const encodedRelPath = relPath.split('/').map(encodeURIComponent).join('/');
  const postUrl = new URL(`${TUS_URL}/${encodedRelPath}?override=true`);

  // Step 1: POST initiation
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
      if (res.statusCode === 201 || res.statusCode === 200 || res.statusCode === 204) {
        resolve();
      } else {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => reject(new Error(`POST failed ${res.statusCode}: ${body}`)));
      }
    });
    req.on('error', reject);
    req.end();
  });

  // Step 2: PATCH data stream
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
        console.log(`[DONE] ${relPath} uploaded successfully (${res.statusCode})`);
        resolve();
      } else {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => reject(new Error(`PATCH failed ${res.statusCode}: ${body}`)));
      }
    });
    patchReq.on('error', reject);
    patchReq.write(content);
    patchReq.end();
  });
}

async function run() {
  console.log(`Starting deployment of ${filesToUpload.length} files to Hostinger production...`);
  let successCount = 0;
  for (const f of filesToUpload) {
    try {
      await uploadFile(f);
      successCount++;
    } catch (e) {
      console.error(`[ERROR] Failed to upload ${f}:`, e.message);
    }
  }
  console.log(`\nDeployment finished: ${successCount}/${filesToUpload.length} files uploaded to production!`);
}

run();
