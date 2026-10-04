const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/8a7ed4d8543c29eb/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MDgwODY5NiwiaWF0IjoxNzkwNzg3MDk2fQ.JGIhEgTpNz0tOeGVBYF4mJQ1xGtz9sPlwQ_110QReMM';
const REST_AUTH_KEY = '97feb9ac2df9bd5b1953859a40c8a0cb5adf5b12067fe1f01be33ef913f27289-8a7ed4d8543c29eb';

const filesToUpload = [
  { local: 'api/config.php', remote: 'api/config.php' },
  { local: 'api/config.php', remote: 'ko/api/config.php' },
  { local: 'api/upload.php', remote: 'api/upload.php' },
  { local: 'api/upload.php', remote: 'ko/api/upload.php' },
  { local: 'api/media.php', remote: 'api/media.php' },
  { local: 'api/media.php', remote: 'ko/api/media.php' },
  { local: '.htaccess', remote: '.htaccess' },
  { local: 'data/content.json', remote: 'data/content.json' },
  { local: 'data/content.json', remote: 'ko/data/content.json' }
];

function uploadFile(item) {
  const localPath = path.join(BASE_DIR, item.local);
  if (!fs.existsSync(localPath)) {
    console.warn(`[SKIP] Local file not found: ${localPath}`);
    return Promise.resolve();
  }

  const content = fs.readFileSync(localPath);
  const size = content.length;
  console.log(`[UPLOADING] ${item.local} -> ${item.remote} (${size} bytes)...`);

  return new Promise((resolve, reject) => {
    const encodedRelPath = item.remote.split('/').map(encodeURIComponent).join('/');
    const postUrl = new URL(`${TUS_URL}/${encodedRelPath}?override=true`);
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
            console.log(`[DONE] ${item.remote}`);
            resolve();
          } else {
            let b = '';
            patchRes.on('data', d => b += d);
            patchRes.on('end', () => reject(new Error(`PATCH failed for ${item.remote} (${patchRes.statusCode}): ${b}`)));
          }
        });
        patchReq.on('error', reject);
        patchReq.write(content);
        patchReq.end();
      } else {
        let b = '';
        res.on('data', d => b += d);
        res.on('end', () => reject(new Error(`POST failed for ${item.remote} (${res.statusCode}): ${b}`)));
      }
    });

    postReq.on('error', reject);
    postReq.end();
  });
}

function removeFile(filename) {
  const blank = Buffer.from('<?php exit; ?>');
  return new Promise((resolve) => {
    const postUrl = new URL(`${TUS_URL}/${filename}?override=true`);
    const postReq = https.request(postUrl, {
      method: 'POST',
      headers: {
        'X-Auth': AUTH_KEY,
        'X-Auth-Rest': REST_AUTH_KEY,
        'Tus-Resumable': '1.0.0',
        'Upload-Length': blank.length,
        'Upload-Offset': 0
      }
    }, res => {
      const patchReq = https.request(postUrl, {
        method: 'PATCH',
        headers: {
          'X-Auth': AUTH_KEY,
          'X-Auth-Rest': REST_AUTH_KEY,
          'Tus-Resumable': '1.0.0',
          'Content-Type': 'application/offset+octet-stream',
          'Upload-Offset': 0
        }
      }, () => resolve());
      patchReq.on('error', () => resolve());
      patchReq.write(blank);
      patchReq.end();
    });
    postReq.on('error', () => resolve());
    postReq.end();
  });
}

async function run() {
  console.log('--- Deploying Media & Upload Architecture Fix ---');
  for (const item of filesToUpload) {
    try {
      await uploadFile(item);
    } catch (e) {
      console.error(`[ERROR] ${item.remote}:`, e.message);
    }
  }

  console.log('[CLEANUP] Neutralizing sync_uploads.php...');
  await removeFile('sync_uploads.php');
  console.log('--- Deployment Complete! ---');
}

run();
