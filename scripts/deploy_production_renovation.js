const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/ad62a9045875d619/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MDkxOTkzNCwiaWF0IjoxNzkwODk4MzM0fQ.FITCkDBgWrV4KBzshLE4z65JDQaNJIiUAT_OLuxnveg';
const REST_AUTH_KEY = 'bbfbc568e923636fa31c57579765ff6d7b5b2e6dbef9701c243df0e7f75b7ca9-ad62a9045875d619';

function uploadFile(localPath, remoteRel) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(localPath)) {
      console.warn(`[SKIP] Missing local file: ${localPath}`);
      return resolve();
    }
    const content = fs.readFileSync(localPath);
    const size = content.length;
    console.log(`[UPLOADING] ${localPath} -> ${remoteRel} (${size} B)...`);

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
  console.log('=== STARTING PRODUCTION RENOVATION DEPLOYMENT ===');

  const files = [
    // 1. Root & Subfolder .htaccess
    ['.htaccess', '.htaccess'],
    ['ko/.htaccess', 'ko/.htaccess'],

    // 2. Root Redirect index.html and splash.html backup
    ['index.html', 'index.html'],
    ['splash.html', 'splash.html'],

    // 3. Service Worker
    ['sw.js', 'sw.js'],
    ['ko/sw.js', 'ko/sw.js'],

    // 4. Main Portal Homepages
    ['index.php', 'index.php'],
    ['index.php', 'ko/index.php'],
    ['en/index.php', 'en/index.php'],

    // 5. Blog and Content Pages
    ['blog.php', 'blog.php'],
    ['blog.php', 'ko/blog.php'],
    ['blog-post.php', 'blog-post.php'],
    ['blog-post.php', 'ko/blog-post.php'],
    ['medicare.html', 'medicare.html'],
    ['medicare.html', 'ko/medicare.html'],
    ['senior-care.php', 'senior-care.php'],
    ['senior-care.php', 'ko/senior-care.php'],
    ['senior-care.html', 'senior-care.html'],
    ['senior-care.html', 'ko/senior-care.html'],
    ['tool.html', 'tool.html'],
    ['tool.html', 'ko/tool.html'],
    ['about.html', 'about.html'],
    ['about.html', 'ko/about.html'],

    // 6. Forum Components
    ['ko/forum/components.php', 'ko/forum/components.php'],
    ['forum/components.php', 'forum/components.php'],
    ['en/forum/components.php', 'en/forum/components.php'],

    // 7. Push Notification Scripts & Backend
    ['js/njap-notifications.js', 'js/njap-notifications.js'],
    ['ko/js/njap-notifications.js', 'ko/js/njap-notifications.js'],
    ['api/push_subscription.php', 'api/push_subscription.php'],
    ['ko/api/push_subscription.php', 'ko/api/push_subscription.php'],
    ['api/push_notify.php', 'api/push_notify.php'],
    ['ko/api/push_notify.php', 'ko/api/push_notify.php'],
    ['api/posts.php', 'api/posts.php'],
    ['ko/api/posts.php', 'ko/api/posts.php'],

    // 8. Data files
    ['data/push_subscriptions.json', 'data/push_subscriptions.json'],
    ['ko/data/push_subscriptions.json', 'ko/data/push_subscriptions.json'],
    ['data/latest_broadcast.json', 'data/latest_broadcast.json'],
    ['ko/data/latest_broadcast.json', 'ko/data/latest_broadcast.json']
  ];

  for (const [localRel, remoteRel] of files) {
    const localPath = path.join(BASE_DIR, localRel);
    await uploadFile(localPath, remoteRel);
  }

  console.log('\n=== ALL PRODUCTION FILES SUCCESSFULLY DEPLOYED ===');
}

main().catch(err => {
  console.error('\nDeployment Error:', err);
  process.exit(1);
});
