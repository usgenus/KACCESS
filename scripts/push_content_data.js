/**
 * Push local content.json to live server's public_html/data/
 * This overwrites the live data with the correct local content,
 * then triggers a PHP script to also update persistent storage.
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const TUS_URL = 'https://srv1709-files.hstgr.io/rest/d4626df06e33a1d4/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MDcyOTMwNiwiaWF0IjoxNzkwNzA3NzA2fQ.61UMWXLAsJobc8lbYQhELkMNfzl0o_BKKL55qFeg7Ns';
const REST_AUTH_KEY = '96e5ffca35f6d27084e83f8286e7cfc3bebfb9e84c739ba125f4ebb099ec88fb-d4626df06e33a1d4';

function uploadFile(localPath, remoteName) {
  const content = fs.readFileSync(localPath);
  const size = content.length;
  console.log(`[UPLOADING] ${path.basename(localPath)} -> ${remoteName} (${(size / 1024).toFixed(1)} KB)`);

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
            console.log(`[OK] ${remoteName}`);
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

// PHP script to sync data/content.json into persistent storage
const syncPhp = `<?php
header('Content-Type: application/json; charset=utf-8');
$rootDir = '/home/u738358110/domains/njaccessportal.com/public_html';
$persistentDir = '/home/u738358110/njap_persistent';
$dataFile = $rootDir . '/data/content.json';
$persistentFile = $persistentDir . '/content.json';

$result = ['steps' => []];

if (!file_exists($dataFile)) {
    $result['error'] = 'data/content.json not found';
    echo json_encode($result);
    exit;
}

$content = file_get_contents($dataFile);
$data = json_decode($content, true);
if (!is_array($data)) {
    $result['error'] = 'Invalid JSON in content.json';
    echo json_encode($result);
    exit;
}

$result['posts_count'] = count($data['posts'] ?? []);
$result['videos_count'] = count($data['videos'] ?? []);
$result['billboards_count'] = count($data['billboards'] ?? []);

// Write to persistent storage
if (!is_dir($persistentDir)) { @mkdir($persistentDir, 0777, true); }
$written = @file_put_contents($persistentFile, $content, LOCK_EX);
@chmod($persistentFile, 0666);
$result['steps'][] = 'Written to persistent: ' . ($written !== false ? $written . ' bytes' : 'FAILED');

$result['success'] = $written !== false;
@unlink(__FILE__);
echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
`;

async function main() {
  const rootDir = path.join(__dirname, '..');
  const contentJsonPath = path.join(rootDir, 'data', 'content.json');

  if (!fs.existsSync(contentJsonPath)) {
    console.error('ERROR: data/content.json not found at', contentJsonPath);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(contentJsonPath, 'utf8'));
  console.log(`Local content.json: ${data.posts?.length ?? 0} posts, ${data.videos?.length ?? 0} videos, ${data.billboards?.length ?? 0} billboards`);

  // Write sync PHP
  const syncPhpPath = path.join(rootDir, 'sync_data_persistent.php');
  fs.writeFileSync(syncPhpPath, syncPhp, 'utf8');

  try {
    // 1. Upload content.json to data/ folder
    await uploadFile(contentJsonPath, 'data/content.json');

    // 2. Upload sync PHP script
    await uploadFile(syncPhpPath, 'sync_data_persistent.php');

    // 3. Trigger the sync script
    console.log('[TRIGGERING] sync_data_persistent.php...');
    await new Promise((resolve) => {
      https.get('https://njaccessportal.com/sync_data_persistent.php', res => {
        let b = '';
        res.on('data', d => b += d);
        res.on('end', () => {
          console.log('Server result:\n', b);
          resolve();
        });
      }).on('error', e => {
        console.error('Trigger error:', e.message);
        resolve();
      });
    });

    console.log('\n[DONE] Content data synced to live server!');
    console.log('The live site should now show the correct articles.');
  } finally {
    if (fs.existsSync(syncPhpPath)) fs.unlinkSync(syncPhpPath);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
