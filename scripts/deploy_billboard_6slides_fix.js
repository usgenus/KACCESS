const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/ba91cc298370e11f/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MTIzMDkxNCwiaWF0IjoxNzkxMjA5MzE0fQ.xgDSrn5kq78os8P6Wtb-_OZ2-nJqRvp-yJLQryaxCEg';
const REST_AUTH_KEY = '4f2ac118cf1b45741fa954b561365d00501fb589f2b4dd304ddab6c77fe454a6-ba91cc298370e11f';

const filesToUpload = [
  'index.php',
  'ko/index.html',
  'admin/index.php',
  'admin/admin.js',
  'api/billboards.php',
  'api/db.php',
  'data/content.json'
];

async function uploadFile(relPath) {
  const localPath = path.join(BASE_DIR, relPath);
  if (!fs.existsSync(localPath)) {
    console.warn(`[SKIP] ${relPath} does not exist locally`);
    return;
  }

  const fileContent = fs.readFileSync(localPath);
  const size = fileContent.length;
  console.log(`[UPLOADING] ${relPath} (${size} bytes)...`);

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

  // Step 2: PATCH
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
        console.log(`[SUCCESS] ${relPath} uploaded (${res.statusCode})`);
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

async function run() {
  console.log(`Deploying ${filesToUpload.length} files to Hostinger production...`);
  let success = 0;
  for (const file of filesToUpload) {
    try {
      await uploadFile(file);
      success++;
    } catch (err) {
      console.error(`[ERROR] ${file}:`, err.message);
    }
  }
  console.log(`Deployment finished: ${success}/${filesToUpload.length} files successfully uploaded.`);
}

run();
