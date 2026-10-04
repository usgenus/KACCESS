const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/1ae29299e84f1871/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MDkyMDAwMiwiaWF0IjoxNzkwODk4NDAyfQ.LFmlE7yMuu9QJnzWR4IU1Zy1xj8BJFFyOuxjRonQaXg';
const REST_AUTH_KEY = 'bafa5f871b43ce09ef6cfc32ea16caa48b2abd2f29bb01e31ffc34d76269384a-1ae29299e84f1871';

function uploadFile(localPath, remoteRel) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(localPath)) {
      console.warn(`[SKIP] Missing: ${localPath}`);
      return resolve();
    }
    const content = fs.readFileSync(localPath);
    const size = content.length;
    console.log(`[UPLOADING] ${remoteRel} (${size} B)...`);

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
            patchRes.on('end', () => reject(new Error(`PATCH failed ${patchRes.statusCode} for ${remoteRel}: ${b}`)));
          }
        });
        patchReq.on('error', reject);
        patchReq.write(content);
        patchReq.end();
      } else {
        let b = '';
        res.on('data', d => b += d);
        res.on('end', () => reject(new Error(`POST failed ${res.statusCode} for ${remoteRel}: ${b}`)));
      }
    });
    postReq.on('error', reject);
    postReq.end();
  });
}

async function main() {
  const files = [
    ['js/njap-notifications.js', 'js/njap-notifications.js'],
    ['ko/js/njap-notifications.js', 'ko/js/njap-notifications.js'],
    ['api/push_subscription.php', 'api/push_subscription.php'],
    ['ko/api/push_subscription.php', 'ko/api/push_subscription.php'],
    ['api/push_notify.php', 'api/push_notify.php'],
    ['ko/api/push_notify.php', 'ko/api/push_notify.php'],
    ['api/posts.php', 'api/posts.php'],
    ['ko/api/posts.php', 'ko/api/posts.php'],
    ['data/push_subscriptions.json', 'data/push_subscriptions.json'],
    ['ko/data/push_subscriptions.json', 'ko/data/push_subscriptions.json'],
    ['data/latest_broadcast.json', 'data/latest_broadcast.json'],
    ['ko/data/latest_broadcast.json', 'ko/data/latest_broadcast.json']
  ];

  for (const [localRel, remoteRel] of files) {
    const localPath = path.join(BASE_DIR, localRel);
    await uploadFile(localPath, remoteRel);
  }

  console.log('\n=== ALL REMAINING FILES SUCCESSFULLY DEPLOYED ===');
}

main().catch(err => {
  console.error('\nError:', err);
  process.exit(1);
});
