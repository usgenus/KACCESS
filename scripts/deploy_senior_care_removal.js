const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/057838f46ce026e0/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MTE0MjI2NCwiaWF0IjoxNzkxMTIwNjY0fQ.YFhrLsfwHn08i5ShHOMz3KWbLmLk-4-X5rTq15YEDTM';
const REST_AUTH_KEY = '1d82c8d8722f75f47e9b7e8c492fe28eee0f9e8cec8faf7cb813fd1d1641641b-057838f46ce026e0';

const filesToUpload = [
  '.htaccess',
  'router.php',
  'senior-care.php',
  'senior-care.html',
  'senior-care/index.html',
  'index.php',
  'index.html',
  'blog.php',
  'blog-post.php',
  'about.html',
  'about/index.html',
  'medicare.html',
  'medicare/index.html',
  'tool.html',
  'tool/index.html',
  'calculator.html',
  'dictionary.html',
  'matcher.html',
  'the-health-bridge.html',
  'the-health-bridge/index.html',
  'forum/components.php',
  '404.html',
  '_not-found.html',
  'ko/index.html',
  'ko/blog-post.php',
  'ko/forum/components.php',
  'sitemap.php',
  'sitemap.xml',
  'robots.txt',
  'ko/robots.txt',
  'js/fixes.js',
  'engine/js/main.js',
  '_next/static/chunks/3hl7r9k9z73f7.js',
  '_next/static/chunks/3hl7r9k9z73f7_v2.js',
  '_next/static/chunks/3hl7r9k9z73f7_v3.js'
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
  console.log(`Starting deployment of ${filesToUpload.length} files to njaccessportal.com...`);
  let successCount = 0;
  let failCount = 0;

  for (const file of filesToUpload) {
    try {
      await uploadFile(file);
      successCount++;
    } catch (err) {
      console.error(`[ERROR] Failed to upload ${file}:`, err.message);
      failCount++;
    }
  }

  console.log('\n=======================================');
  console.log(`Deployment complete! Success: ${successCount}, Failed: ${failCount}`);
  console.log('=======================================');
}

run();
