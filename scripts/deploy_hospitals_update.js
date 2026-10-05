const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/e7927fdc3bb8acae/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MTE4MDE4NywiaWF0IjoxNzkxMTU4NTg3fQ.yiTZIOGTkuW0arLkd7VKaOOAVQrKfuVmOyJCTkSyv2o';
const REST_AUTH_KEY = 'bb44f784210098174129e2594d1da604db391b6eb1b886eb3e135a4631b5c295-e7927fdc3bb8acae';

const filesToUpload = [
  'index.php',
  'ko/index.html',
  'uploads/images/hospitals/bergen-new-bridge.svg',
  'uploads/images/hospitals/englewood-health.svg',
  'uploads/images/hospitals/hackensack-meridian.svg',
  'uploads/images/hospitals/holy-name.png',
  'uploads/images/hospitals/palisades-medical.svg',
  'uploads/images/hospitals/pascack-valley.png',
  'uploads/images/hospitals/rwjbarnabas-health.png',
  'uploads/images/hospitals/valley-health.png',
  'assets/images/hospitals/bergen-new-bridge.svg',
  'assets/images/hospitals/englewood-health.svg',
  'assets/images/hospitals/hackensack-meridian.svg',
  'assets/images/hospitals/holy-name.png',
  'assets/images/hospitals/palisades-medical.svg',
  'assets/images/hospitals/pascack-valley.png',
  'assets/images/hospitals/rwjbarnabas-health.png',
  'assets/images/hospitals/valley-health.png'
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
    const req = https.request(postUrl, {
      method: 'PATCH',
      headers: {
        'X-Auth': AUTH_KEY,
        'X-Auth-Rest': REST_AUTH_KEY,
        'Tus-Resumable': '1.0.0',
        'Upload-Offset': 0,
        'Content-Type': 'application/offset+octet-stream'
      }
    }, res => {
      if (res.statusCode === 204 || res.statusCode === 200) resolve();
      else {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => reject(new Error(`PATCH failed ${res.statusCode}: ${body}`)));
      }
    });

    req.on('error', reject);
    req.write(fileContent);
    req.end();
  });

  console.log(`[SUCCESS] ${relPath}`);
}

async function main() {
  console.log(`Starting deployment of ${filesToUpload.length} files...`);
  for (const f of filesToUpload) {
    try {
      await uploadFile(f);
    } catch (err) {
      console.error(`[ERROR] Failed to upload ${f}:`, err.message);
    }
  }
  console.log('Deployment complete!');
}

main();
