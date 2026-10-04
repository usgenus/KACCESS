const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/b3f4c246999dc13f/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MTE0NTc2OSwiaWF0IjoxNzkxMTI0MTY5fQ.Pmv36SmWwMlHS7Rwt3quFl4kuZOR-ktsadwyAyPnQ6o';
const REST_AUTH_KEY = '055038e3265ac19da4e0a8e66c143034f75c2221d4a2ab72771385f4f16da30c-b3f4c246999dc13f';

const filesToUpload = [
  '.htaccess',
  'router.php',
  'index.php',
  'index.html',
  'ko/index.html',
  'tool.html',
  'tool/index.html',
  'calculator.html',
  'dictionary.html',
  'matcher.html',
  'medicare.html',
  'medicare/index.html',
  'about.html',
  'about/index.html',
  'blog.php',
  'blog-post.php',
  'ko/blog-post.php',
  'the-health-bridge.html',
  'the-health-bridge/index.html',
  'senior-care.php',
  'senior-care.html',
  'senior-care/index.html',
  'splash.html',
  '404.html',
  '_not-found.html',
  'forum/components.php',
  'ko/forum/components.php',
  'sitemap.php',
  'sitemap.xml',
  'robots.txt',
  'ko/robots.txt',
  'js/fixes.js',
  'admin/admin.js',
  'admin/index.php',
  'api/billboards2.php',
  'ko/api/billboards2.php',
  'data/content.json',
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
  console.log(`Starting deployment of ${filesToUpload.length} files to Hostinger production...`);
  for (const file of filesToUpload) {
    try {
      await uploadFile(file);
    } catch (err) {
      console.error(`[ERROR] Failed to deploy ${file}:`, err.message);
    }
  }
  console.log('\n--- Deployment finished! ---');
}

run();
