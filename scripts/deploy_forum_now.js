const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/d4626df06e33a1d4/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MDcyOTMwNiwiaWF0IjoxNzkwNzA3NzA2fQ.61UMWXLAsJobc8lbYQhELkMNfzl0o_BKKL55qFeg7Ns';
const REST_AUTH_KEY = '96e5ffca35f6d27084e83f8286e7cfc3bebfb9e84c739ba125f4ebb099ec88fb-d4626df06e33a1d4';

const filesToUpload = [
  // Core forum logic
  { local: 'api/forum_db.php', remote: 'api/forum_db.php' },
  { local: 'ko/api/forum_db.php', remote: 'ko/api/forum_db.php' },
  { local: 'api/forum.php', remote: 'api/forum.php' },
  { local: 'api/forum.php', remote: 'ko/api/forum.php' },
  { local: 'api/forum_admin.php', remote: 'api/forum_admin.php' },
  { local: 'api/forum_admin.php', remote: 'ko/api/forum_admin.php' },
  { local: 'api/forum_auth.php', remote: 'api/forum_auth.php' },
  { local: 'api/forum_auth.php', remote: 'ko/api/forum_auth.php' },
  { local: 'api/config.php', remote: 'api/config.php' },
  { local: 'api/config.php', remote: 'ko/api/config.php' },

  // Korean forum data
  { local: 'data/forum.json', remote: 'data/forum.json' },
  { local: 'data/forum.json', remote: 'ko/data/forum.json' },
  { local: 'data/forum_en.json', remote: 'data/forum_en.json' },
  { local: 'data/forum_en.json', remote: 'ko/data/forum_en.json' },

  // Forum pages
  { local: 'forum/index.php', remote: 'forum/index.php' },
  { local: 'ko/forum/index.php', remote: 'ko/forum/index.php' },
  { local: 'forum/topic.php', remote: 'forum/topic.php' },
  { local: 'ko/forum/topic.php', remote: 'ko/forum/topic.php' },
  { local: 'forum/components.php', remote: 'forum/components.php' },
  { local: 'ko/forum/components.php', remote: 'ko/forum/components.php' },
  { local: 'forum/ask.php', remote: 'forum/ask.php' },
  { local: 'ko/forum/ask.php', remote: 'ko/forum/ask.php' },

  // Sync script
  { local: 'deploy_sync.php', remote: 'deploy_sync.php' },
  { local: 'deploy_sync.php', remote: 'ko/deploy_sync.php' }
];

async function uploadFile(item) {
  const localPath = path.join(BASE_DIR, item.local);
  if (!fs.existsSync(localPath)) {
    console.warn(`[SKIP] Local file not found: ${localPath}`);
    return;
  }

  const content = fs.readFileSync(localPath);
  const size = content.length;
  console.log(`[UPLOADING] ${item.local} -> ${item.remote} (${size} bytes)...`);

  // Step 1: POST initiation
  await new Promise((resolve, reject) => {
    const encodedRelPath = item.remote.split('/').map(encodeURIComponent).join('/');
    const postUrl = new URL(`${TUS_URL}/${encodedRelPath}?override=true`);
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
      if (res.statusCode >= 200 && res.statusCode < 300) {
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

  // Step 2: PATCH payload
  await new Promise((resolve, reject) => {
    const encodedRelPath = item.remote.split('/').map(encodeURIComponent).join('/');
    const patchUrl = new URL(`${TUS_URL}/${encodedRelPath}?override=true`);
    const req = https.request(patchUrl, {
      method: 'PATCH',
      headers: {
        'X-Auth': AUTH_KEY,
        'X-Auth-Rest': REST_AUTH_KEY,
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

  console.log(`[DONE] ${item.remote}`);
}

// PHP script to overwrite persistent storage with clean Korean forum.json
const phpPStorageFix = `<?php
$pDir = '/home/u738358110/domains/njaccessportal.com/persistent_storage';
$koDataDir = '/home/u738358110/domains/njaccessportal.com/public_html/ko/data';
$rootDataDir = '/home/u738358110/domains/njaccessportal.com/public_html/data';

$res = [];
if (file_exists($koDataDir . '/forum.json')) {
    $c = file_get_contents($koDataDir . '/forum.json');
    file_put_contents($pDir . '/forum.json', $c, LOCK_EX);
    file_put_contents($rootDataDir . '/forum.json', $c, LOCK_EX);
    $res['forum_json_bytes'] = strlen($c);
}
if (file_exists($koDataDir . '/forum_en.json')) {
    $c = file_get_contents($koDataDir . '/forum_en.json');
    file_put_contents($pDir . '/forum_en.json', $c, LOCK_EX);
    file_put_contents($rootDataDir . '/forum_en.json', $c, LOCK_EX);
    $res['forum_en_json_bytes'] = strlen($c);
}
header('Content-Type: application/json');
echo json_encode($res);
@unlink(__FILE__);
`;

async function main() {
  for (const item of filesToUpload) {
    await uploadFile(item);
  }

  // Upload temporary persistent storage fixer
  console.log('[UPLOADING] fix_persistent_forum.php...');
  const fixPath = path.join(BASE_DIR, 'fix_persistent_forum.php');
  fs.writeFileSync(fixPath, phpPStorageFix, 'utf8');
  await uploadFile({ local: 'fix_persistent_forum.php', remote: 'fix_persistent_forum.php' });
  fs.unlinkSync(fixPath);

  // Trigger fix
  console.log('[TRIGGERING] fix_persistent_forum.php on live server...');
  await new Promise((resolve) => {
    https.get('https://njaccessportal.com/fix_persistent_forum.php', res => {
      let b = '';
      res.on('data', d => b += d);
      res.on('end', () => {
        console.log('Fixer response:', b);
        resolve();
      });
    }).on('error', e => {
      console.warn('Fixer request error:', e.message);
      resolve();
    });
  });

  console.log('[ALL FINISHED SUCCESSFULLY]');
}

main().catch(err => {
  console.error('Fatal deployment error:', err);
  process.exit(1);
});
