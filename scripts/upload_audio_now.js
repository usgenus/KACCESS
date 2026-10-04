const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/3becaea59f870b2f/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MDgwOTY0MywiaWF0IjoxNzkwNzg4MDQzfQ.AMI5Dc2UQ262fK5zNskLFV4dgfdJ3eDjyxNIDKa-20U';
const REST_AUTH_KEY = '5b0b832ce729a7bed7bcbb49a4047dc42c759e933049892da4a15ff72e14e402-3becaea59f870b2f';

const audioFiles = [
  '8----170.mp3',
  'fda---------e-coli.mp3',
  'fda---------superpotent.mp3',
  'fda-----1-3-000.mp3',
  '16-7-000.mp3'
];

function uploadSingleFile(localPath, remoteName) {
  const content = fs.readFileSync(localPath);
  const size = content.length;
  console.log(`[UPLOADING] ${localPath} -> ${remoteName} (${(size / 1024).toFixed(1)} KB)`);

  return new Promise((resolve, reject) => {
    const encoded = remoteName.split('/').map(encodeURIComponent).join('/');
    const postUrl = new URL(`${TUS_URL}/${encoded}?override=true`);
    const postReq = https.request(postUrl, {
      method: 'POST',
      headers: {
        'X-Auth': AUTH_KEY,
        'X-Auth-Rest': REST_AUTH_KEY,
        'Tus-Resumable': '1.0.0',
        'Upload-Length': size,
        'Upload-Offset': 0
      }
    }, res => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const patchReq = https.request(postUrl, {
          method: 'PATCH',
          headers: {
            'X-Auth': AUTH_KEY,
            'X-Auth-Rest': REST_AUTH_KEY,
            'Tus-Resumable': '1.0.0',
            'Content-Type': 'application/offset+octet-stream',
            'Upload-Offset': 0
          }
        }, patchRes => {
          if (patchRes.statusCode === 204 || patchRes.statusCode === 200) {
            console.log(`[DONE] ${remoteName}`);
            resolve();
          } else {
            let b = '';
            patchRes.on('data', d => b += d);
            patchRes.on('end', () => reject(new Error(`PATCH failed ${patchRes.statusCode}: ${b}`)));
          }
        });
        patchReq.on('error', reject);
        patchReq.write(content);
        patchReq.end();
      } else {
        let b = '';
        res.on('data', d => b += d);
        res.on('end', () => reject(new Error(`POST failed ${res.statusCode}: ${b}`)));
      }
    });
    postReq.on('error', reject);
    postReq.end();
  });
}

async function run() {
  console.log('--- Uploading Audio Files for Today\'s 5 Posts ---');
  for (const f of audioFiles) {
    const local = path.join(BASE_DIR, 'uploads/audio', f);
    if (!fs.existsSync(local)) {
      console.warn(`[SKIP] Missing local audio: ${local}`);
      continue;
    }

    try {
      await uploadSingleFile(local, 'uploads/audio/' + f);
      await uploadSingleFile(local, 'ko/uploads/audio/' + f);
    } catch (e) {
      console.error(`Error uploading ${f}:`, e.message);
    }
  }
  console.log('--- Audio Upload Complete! ---');
}

run();
