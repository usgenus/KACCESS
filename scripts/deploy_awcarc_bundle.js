const https = require('https');
const fs = require('fs');
const path = require('path');

const TUS_URL = 'https://srv1709-files.hstgr.io/rest/eadc6eb2eca2f423/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MDc5NzM3NiwiaWF0IjoxNzkwNzc1Nzc2fQ.R15K1s748ZLhdkITVTK1cK9r4t0nS6-z0gavKYM9-dc';
const REST_AUTH_KEY = '9192c80ec925bb3d525e3ae7c3b52ff31eff22cdb43c73b5a3eebe3b5e063271-eadc6eb2eca2f423';

function uploadFile(localPath, remoteName) {
  const content = fs.readFileSync(localPath);
  const size = content.length;
  console.log(`[UPLOADING] ${localPath} -> ${remoteName} (${(size / 1024 / 1024).toFixed(2)} MB)`);

  return new Promise((resolve, reject) => {
    const postUrl = new URL(`${TUS_URL}/${remoteName}?override=true`);
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

function triggerUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    }).on('error', reject);
  });
}

async function run() {
  console.log('=== Step 1: Upload extract_awcarc.php ===');
  await uploadFile(path.resolve(__dirname, 'extract_awcarc.php'), 'ko/extract_awcarc.php');

  console.log('=== Step 2: Upload deploy_awcarc.zip ===');
  await uploadFile('/tmp/deploy_awcarc.zip', 'ko/deploy_awcarc.zip');

  console.log('=== Step 3: Trigger Extraction via HTTP ===');
  const triggerRes = await triggerUrl('https://njaccessportal.com/ko/extract_awcarc.php');
  console.log('Trigger Response:', triggerRes.statusCode, triggerRes.body);

  if (!triggerRes.body.includes('SUCCESS')) {
    throw new Error('Extraction failed on server: ' + triggerRes.body);
  }

  console.log('\n--- Deployment finished! ---');
}

run().catch(err => {
  console.error('Deployment error:', err);
  process.exit(1);
});
