const https = require('https');
const fs = require('fs');

const TUS_URL = 'https://srv1709-files.hstgr.io/rest/d4626df06e33a1d4/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MDcyOTMwNiwiaWF0IjoxNzkwNzA3NzA2fQ.61UMWXLAsJobc8lbYQhELkMNfzl0o_BKKL55qFeg7Ns';
const REST_AUTH_KEY = '96e5ffca35f6d27084e83f8286e7cfc3bebfb9e84c739ba125f4ebb099ec88fb-d4626df06e33a1d4';

function uploadFile(localPath, remoteName) {
  const content = fs.readFileSync(localPath);
  const size = content.length;
  console.log(`[UPLOADING] ${localPath} -> ${remoteName} (${size} bytes)`);

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

async function run() {
  await uploadFile('/tmp/deploy_bundle.tar.gz', 'deploy_bundle.tar.gz');
  await uploadFile('run_extract.php', 'run_extract.php');

  console.log('[TRIGGERING] run_extract.php...');
  https.get('https://njaccessportal.com/run_extract.php', res => {
    let b = '';
    res.on('data', d => b += d);
    res.on('end', () => {
      console.log('Result:\n', b);
    });
  }).on('error', e => console.error(e));
}

run().catch(e => console.error(e));
