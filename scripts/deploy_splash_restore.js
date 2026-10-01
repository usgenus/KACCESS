const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/fbef04c1c46b9778/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MDg4MjkyOCwiaWF0IjoxNzkwODYxMzI4fQ.0tiVC4cnDB-IHRTxj1UBT8NEdwYP5bSCju5OugSEp3A';
const REST_AUTH_KEY = '11b1746f597e7314634f3862bb392290a138c8a45c93d8535d6370db9962c7d1-fbef04c1c46b9778';

function uploadSingleFile(localPath, remoteRel) {
  const content = fs.readFileSync(localPath);
  const size = content.length;
  console.log(`[UPLOADING] ${localPath} -> ${remoteRel} (${size} B)...`);

  return new Promise((resolve, reject) => {
    const encoded = remoteRel.split('/').map(encodeURIComponent).join('/');
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
            console.log(`[SUCCESS] ${remoteRel}`);
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

async function main() {
  console.log('=== Deploying Splash Page & Root .htaccess Restore ===');
  
  // 1. Upload index.html (Splash Page) to root
  await uploadSingleFile(path.join(BASE_DIR, 'index.html'), 'index.html');
  await uploadSingleFile(path.join(BASE_DIR, 'splash.html'), 'splash.html');

  // 2. Upload root .htaccess
  await uploadSingleFile(path.join(BASE_DIR, '.htaccess'), '.htaccess');

  // 3. Upload ko/.htaccess
  if (fs.existsSync(path.join(BASE_DIR, 'ko', '.htaccess'))) {
    await uploadSingleFile(path.join(BASE_DIR, 'ko', '.htaccess'), 'ko/.htaccess');
  }

  console.log('\n=== All Done! ===');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
