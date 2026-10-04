const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/b3f4c246999dc13f/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MTE0NTc2OSwiaWF0IjoxNzkxMTI0MTY5fQ.Pmv36SmWwMlHS7Rwt3quFl4kuZOR-ktsadwyAyPnQ6o';
const REST_AUTH_KEY = '055038e3265ac19da4e0a8e66c143034f75c2221d4a2ab72771385f4f16da30c-b3f4c246999dc13f';

const filesToUpload = [
  'index.php',
  'ko/index.html',
  'admin/admin.js',
  'js/cms-client.js',
  'js/fixes.js',
  'ko/js/fixes.js',
  'ko/js/cms-client.js',
  'data/content.json'
];

async function uploadFile(relPath) {
  const localPath = path.join(BASE_DIR, relPath);
  if (!fs.existsSync(localPath)) {
    console.warn(`[SKIP] Local file not found: ${localPath}`);
    return;
  }

  const content = fs.readFileSync(localPath);
  const size = content.length;
  console.log(`[UPLOADING] ${relPath} (${size} bytes)...`);

  const encodedRelPath = relPath.split('/').map(encodeURIComponent).join('/');
  const postUrl = new URL(`${TUS_URL}/${encodedRelPath}?override=true`);

  // Step 1: POST initiation
  await new Promise((resolve, reject) => {
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

  // Step 2: PATCH data stream
  await new Promise((resolve, reject) => {
    const patchReq = https.request(postUrl, {
      method: 'PATCH',
      headers: {
        'X-Auth': AUTH_KEY,
        'X-Auth-Rest': REST_AUTH_KEY,
        'Tus-Resumable': '1.0.0',
        'Content-Type': 'application/offset+octet-stream',
        'Upload-Offset': 0,
        'Content-Length': size
      }
    }, res => {
      if (res.statusCode === 204 || res.statusCode === 200) {
        console.log(`[DONE] ${relPath} uploaded successfully (${res.statusCode})`);
        resolve();
      } else {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => reject(new Error(`PATCH failed ${res.statusCode}: ${body}`)));
      }
    });
    patchReq.on('error', reject);
    patchReq.write(content);
    patchReq.end();
  });
}

// Script to sync persistent storage on server
const syncPhp = `<?php
require_once __DIR__ . '/api/config.php';
require_once __DIR__ . '/api/db.php';

header('Content-Type: text/plain; charset=utf-8');

$targets = [
    PERSISTENT_DATA_FILE,
    DATA_FILE,
    dirname(DATA_FILE, 2) . '/ko/data/content.json'
];

foreach ($targets as $f) {
    if (file_exists($f)) {
        $str = file_get_contents($f);
        if ($str) {
            $json = json_decode($str, true);
            if (is_array($json) && !empty($json['posts'])) {
                foreach ($json['posts'] as &$p) {
                    if (($p['id'] ?? '') === 'p_1790785291_39a6' || ($p['id'] ?? '') === 'p_1790784679_c6f5') {
                        $p['isPolicyReport'] = true;
                    }
                }
                unset($p);
                file_put_contents($f, json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX);
                clearstatcache(true, $f);
                echo "UPDATED_POSTS: $f\\n";
            }
        }
    }
}
@unlink(__FILE__);
`;

async function run() {
  console.log('--- Deploying 6 Recall Slots Update to Hostinger ---');
  for (const file of filesToUpload) {
    try {
      await uploadFile(file);
    } catch (err) {
      console.error(`[ERROR] Failed to deploy ${file}:`, err.message);
    }
  }

  // Upload sync script
  console.log('\n--- Uploading sync script to update persistent storage ---');
  fs.writeFileSync(path.join(BASE_DIR, 'sync_recall_update.php'), syncPhp, 'utf8');
  await uploadFile('sync_recall_update.php');

  // Trigger sync script via curl
  console.log('\n--- Triggering persistent storage sync on production ---');
  try {
    const syncRes = execSync('curl -s https://njaccessportal.com/sync_recall_update.php', { encoding: 'utf8' });
    console.log('Server response:\n' + syncRes);
  } catch (err) {
    console.error('[ERROR] Sync trigger error:', err.message);
  }

  // Clean local sync helper
  try { fs.unlinkSync(path.join(BASE_DIR, 'sync_recall_update.php')); } catch (e) {}

  console.log('\n--- Deployment finished! ---');
}

run();
