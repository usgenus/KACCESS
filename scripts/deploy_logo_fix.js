const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/ce78d94858a02aa4/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MDkyNDExMSwiaWF0IjoxNzkwOTAyNTExfQ.hNqhwHLRjEMDvQO_yulHRSp19o8gNRBHrAM_kJ7-kic';
const REST_AUTH_KEY = 'e960931cc9f16488a41499c218f6caea279e71692d91a49037ffa8f0a19752d5-ce78d94858a02aa4';

const files = [
  'index.php',
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
  'en/blog.php',
  'forum/components.php',
  'ko/forum/components.php',
  'ko/index.html',
  '404.html',
  '_not-found.html',
  'engine/js/main.js'
];

async function uploadFile(relPath) {
  const localPath = path.join(BASE_DIR, relPath);
  if (!fs.existsSync(localPath)) return;

  const content = fs.readFileSync(localPath);
  const size = content.length;
  const encodedRelPath = relPath.split('/').map(encodeURIComponent).join('/');
  const postUrl = new URL(`${TUS_URL}/${encodedRelPath}?override=true`);

  // Step 1: POST
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
      if ([200, 201, 204].includes(res.statusCode)) resolve();
      else {
        let b = '';
        res.on('data', d => b += d);
        res.on('end', () => reject(new Error(`POST failed ${res.statusCode}: ${b}`)));
      }
    });
    req.on('error', reject);
    req.end();
  });

  // Step 2: PATCH
  await new Promise((resolve, reject) => {
    const req = https.request(postUrl, {
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
      if ([200, 204].includes(res.statusCode)) {
        console.log(`[DONE] ${relPath}`);
        resolve();
      } else {
        let b = '';
        res.on('data', d => b += d);
        res.on('end', () => reject(new Error(`PATCH failed ${res.statusCode}: ${b}`)));
      }
    });
    req.on('error', reject);
    req.write(content);
    req.end();
  });
}

async function run() {
  console.log(`Uploading ${files.length} files with clean logo subtitle...`);
  for (const f of files) {
    try {
      await uploadFile(f);
    } catch (e) {
      console.error(`[ERROR] ${f}: ${e.message}`);
    }
  }
  console.log('Upload finished!');
}

run();
