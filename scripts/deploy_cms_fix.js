const https = require('https');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const TUS_URL = 'https://srv1709-files.hstgr.io/rest/a8d4faf7a7be87a3/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MDk5NjAzNSwiaWF0IjoxNzkwOTc0NDM1fQ.-Q-9054TLlXsRrwi-V-ar-0JrjGRgf4dubA6U--JUzI';
const REST_AUTH_KEY = 'e0e7c7a0f5f415f669998ac81bbb7cedf312fbe7d52f4cb1d6ccbb277bb79994-a8d4faf7a7be87a3';

function uploadFile(localPath, remoteName) {
  const content = fs.readFileSync(localPath);
  const size = content.length;
  console.log(`[UPLOADING] ${localPath} -> ${remoteName} (${(size / 1024).toFixed(2)} KB)`);

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

const phpExtract = `<?php
header('Content-Type: application/json; charset=utf-8');
$rootDir = '/home/u738358110/domains/njaccessportal.com/public_html';
$koDir = $rootDir . '/ko';
$tarFile = $rootDir . '/cms_fix_bundle.tar.gz';

$result = ['success' => false, 'steps' => []];

if (!file_exists($tarFile)) {
    $result['error'] = 'Tar file not found: ' . $tarFile;
    echo json_encode($result);
    exit;
}

try {
    $phar = new PharData($tarFile);
    
    // 1. Extract to root
    $phar->extractTo($rootDir, null, true);
    $result['steps'][] = 'Extracted to root';

    // 2. Extract to ko directory
    if (!is_dir($koDir)) @mkdir($koDir, 0777, true);
    $phar->extractTo($koDir, null, true);
    $result['steps'][] = 'Extracted to ko';

    $result['success'] = true;
    @unlink($tarFile);
    @unlink(__FILE__);
} catch (Exception $e) {
    $result['error'] = $e->getMessage();
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
`;

async function main() {
  const rootDir = path.join(__dirname, '..');
  const bundlePath = '/tmp/cms_fix_bundle.tar.gz';

  // Pack api, admin, admin2
  const cmd = `tar -czvf ${bundlePath} api admin admin2`;
  console.log('Running:', cmd);
  execSync(cmd, { cwd: rootDir });

  fs.writeFileSync(path.join(rootDir, 'extract_cms.php'), phpExtract, 'utf8');

  await uploadFile(bundlePath, 'cms_fix_bundle.tar.gz');
  await uploadFile(path.join(rootDir, 'extract_cms.php'), 'extract_cms.php');
  fs.unlinkSync(path.join(rootDir, 'extract_cms.php'));

  console.log('[TRIGGERING] extract_cms.php on live server...');
  https.get('https://njaccessportal.com/extract_cms.php', res => {
    let b = '';
    res.on('data', d => b += d);
    res.on('end', () => {
      console.log('Server result:\n', b);
    });
  }).on('error', e => console.error(e));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
