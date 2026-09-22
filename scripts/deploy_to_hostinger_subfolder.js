const https = require('https');
const fs = require('fs');
const path = require('path');

const NJAP_TUS_URL = 'https://srv1709-files.hstgr.io/rest/787d6ea3e98fec44/api/tus/public_html';
const NJAP_AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MDE0MTcxNywiaWF0IjoxNzkwMTIwMTE3fQ.-sfUSKjniqRRxA1zJL2U1vxgl6UE9RQS6oqLpOBufFg';
const NJAP_REST_AUTH_KEY = '28dfb4fc086af7707cb4213f0d9e70256eacecdf417212057f1517bfee47fbc6-787d6ea3e98fec44';

async function uploadToTus(localFilePath, destRelPath) {
  const content = fs.readFileSync(localFilePath);
  const size = content.length;
  console.log(`[UPLOADING] ${destRelPath} (${(size / 1024 / 1024).toFixed(2)} MB)...`);

  const encodedRelPath = destRelPath.split('/').map(encodeURIComponent).join('/');
  const targetUrl = new URL(`${NJAP_TUS_URL}/${encodedRelPath}?override=true`);

  // Step 1: POST
  await new Promise((resolve, reject) => {
    const req = https.request(targetUrl, {
      method: 'POST',
      headers: {
        'X-Auth': NJAP_AUTH_KEY,
        'X-Auth-Rest': NJAP_REST_AUTH_KEY,
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

  // Step 2: PATCH
  await new Promise((resolve, reject) => {
    const req = https.request(targetUrl, {
      method: 'PATCH',
      headers: {
        'X-Auth': NJAP_AUTH_KEY,
        'X-Auth-Rest': NJAP_REST_AUTH_KEY,
        'Tus-Resumable': '1.0.0',
        'Content-Type': 'application/offset+octet-stream',
        'Upload-Offset': 0
      }
    }, res => {
      if (res.statusCode === 204 || res.statusCode === 200) {
        resolve();
      } else {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => reject(new Error(`PATCH failed ${res.statusCode}: ${body}`)));
      }
    });
    req.on('error', reject);
    req.write(content);
    req.end();
  });

  console.log(`[SUCCESS] Uploaded ${destRelPath}`);
}

function triggerUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body });
      });
    }).on('error', reject);
  });
}

async function main() {
  const ROOT = path.resolve(__dirname, '..');
  
  console.log('=== Step 1: Uploading extract_ko.php ===');
  await uploadToTus(path.join(__dirname, 'extract_ko.php'), 'extract_ko.php');

  console.log('\n=== Step 2: Uploading deploy_ko.zip (clean zip) ===');
  await uploadToTus('/tmp/deploy_ko_clean.zip', 'deploy_ko.zip');

  console.log('\n=== Step 3: Triggering server-side extraction into public_html/ko ===');
  const extractRes = await triggerUrl('https://njaccessportal.com/extract_ko.php');
  console.log(`Extraction response (${extractRes.statusCode}):\n${extractRes.body}`);

  console.log('\n=== Step 4: Updating root index.html on njaccessportal.com ===');
  await uploadToTus(path.join(ROOT, 'splash.html'), 'index.html');

  console.log('\n=== Step 5: Uploading root .htaccess on njaccessportal.com ===');
  await uploadToTus(path.join(__dirname, 'root_njaccessportal_htaccess'), '.htaccess');

  console.log('\nDone deploying to njaccessportal.com!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
