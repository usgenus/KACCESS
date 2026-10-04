const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/234937901dd57bb8/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MDc5ODY0NywiaWF0IjoxNzkwNzc3MDQ3fQ.y5vKQVgJ-PPM-BBukmEk799U-oV5EcB2ENr7XdwXh6Y';
const REST_AUTH_KEY = 'fc44882aafb12cceb422aa2abdd30de5379da1b5a7532d15087de3b5d1ba7521-234937901dd57bb8';

const filesToUpload = [
  // 1. Core API files (sync to both api/ and ko/api/)
  { local: 'api/forum_db.php', remote: 'api/forum_db.php' },
  { local: 'api/forum_db.php', remote: 'ko/api/forum_db.php' },
  { local: 'api/forum.php', remote: 'api/forum.php' },
  { local: 'api/forum.php', remote: 'ko/api/forum.php' },
  { local: 'api/forum_admin.php', remote: 'api/forum_admin.php' },
  { local: 'api/forum_admin.php', remote: 'ko/api/forum_admin.php' },
  { local: 'api/forum_auth.php', remote: 'api/forum_auth.php' },
  { local: 'api/forum_auth.php', remote: 'ko/api/forum_auth.php' },
  { local: 'api/db.php', remote: 'ko/api/db.php' },
  { local: 'api/supabase.php', remote: 'ko/api/supabase.php' },

  // 2. Korean Forum UI
  { local: 'ko/forum/index.php', remote: 'ko/forum/index.php' },
  { local: 'ko/forum/topic.php', remote: 'ko/forum/topic.php' },
  { local: 'ko/forum/ask.php', remote: 'ko/forum/ask.php' },
  { local: 'ko/forum/components.php', remote: 'ko/forum/components.php' },
  { local: 'forum/index.php', remote: 'forum/index.php' },
  { local: 'forum/topic.php', remote: 'forum/topic.php' },
  { local: 'forum/ask.php', remote: 'forum/ask.php' },
  { local: 'forum/components.php', remote: 'forum/components.php' },

  // 3. English Forum UI
  { local: 'en/forum/index.php', remote: 'en/forum/index.php' },
  { local: 'en/forum/topic.php', remote: 'en/forum/topic.php' },
  { local: 'en/forum/ask.php', remote: 'en/forum/ask.php' },
  { local: 'en/forum/components.php', remote: 'en/forum/components.php' },

  // 4. Forum data mirrors
  { local: 'data/forum.json', remote: 'data/forum.json' },
  { local: 'data/forum.json', remote: 'ko/data/forum.json' },
  { local: 'data/forum_en.json', remote: 'data/forum_en.json' },
  { local: 'data/forum_en.json', remote: 'ko/data/forum_en.json' }
];

function uploadFile(item) {
  const localPath = path.join(BASE_DIR, item.local);
  if (!fs.existsSync(localPath)) {
    console.warn(`[SKIP] Local file not found: ${localPath}`);
    return Promise.resolve();
  }

  const content = fs.readFileSync(localPath);
  const size = content.length;
  console.log(`[UPLOADING] ${item.local} -> ${item.remote} (${size} bytes)...`);

  return new Promise((resolve, reject) => {
    const encodedRelPath = item.remote.split('/').map(encodeURIComponent).join('/');
    const postUrl = new URL(`${TUS_URL}/${encodedRelPath}?override=true`);
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
            console.log(`[DONE] ${item.remote}`);
            resolve();
          } else {
            let b = '';
            patchRes.on('data', d => b += d);
            patchRes.on('end', () => reject(new Error(`PATCH failed for ${item.remote} (${patchRes.statusCode}): ${b}`)));
          }
        });
        patchReq.on('error', reject);
        patchReq.write(content);
        patchReq.end();
      } else {
        let b = '';
        res.on('data', d => b += d);
        res.on('end', () => reject(new Error(`POST failed for ${item.remote} (${res.statusCode}): ${b}`)));
      }
    });

    postReq.on('error', reject);
    postReq.end();
  });
}

// Clean up temporary debug files
function removeTestFile(filename) {
  const blank = Buffer.from('<?php exit; ?>');
  return new Promise((resolve) => {
    const postUrl = new URL(`${TUS_URL}/${filename}?override=true`);
    const postReq = https.request(postUrl, {
      method: 'POST',
      headers: {
        'X-Auth': AUTH_KEY,
        'X-Auth-Rest': REST_AUTH_KEY,
        'Tus-Resumable': '1.0.0',
        'Upload-Length': blank.length,
        'Upload-Offset': 0
      }
    }, res => {
      const patchReq = https.request(postUrl, {
        method: 'PATCH',
        headers: {
          'X-Auth': AUTH_KEY,
          'X-Auth-Rest': REST_AUTH_KEY,
          'Tus-Resumable': '1.0.0',
          'Content-Type': 'application/offset+octet-stream',
          'Upload-Offset': 0
        }
      }, () => resolve());
      patchReq.on('error', () => resolve());
      patchReq.write(blank);
      patchReq.end();
    });
    postReq.on('error', () => resolve());
    postReq.end();
  });
}

async function run() {
  console.log('--- Starting Forum Fix Deployment ---');
  for (const item of filesToUpload) {
    try {
      await uploadFile(item);
    } catch (e) {
      console.error(`[ERROR] Failed to upload ${item.remote}:`, e.message);
    }
  }

  // Blank out test debug files
  console.log('[CLEANUP] Neutralizing test debug files...');
  await removeTestFile('test_err.php');
  await removeTestFile('test_err_en.php');

  console.log('--- Forum Fix Deployment Complete! ---');
}

run();
