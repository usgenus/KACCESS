const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/95bc1299df41ac60/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc4OTk2ODUwNSwiaWF0IjoxNzg5OTQ2OTA1fQ.TBq1yXKyT7nEpOb16pDg8oRx8WW3C5p44QcjYTJWBb0';
const REST_AUTH_KEY = '7d27eeea49a698b9b8b90e407c7bb4c2c26291351a9b9ead2dff896613e956c5-95bc1299df41ac60';

const filesToUpload = [
  'medicare.html',
  'medicare/index.html',
  'senior-care.html',
  'senior-care.php',
  'senior-care/index.html',
  'about.html',
  'about/index.html',
  'tool.html',
  'tool/index.html',
  'blog.php',
  'blog.html',
  'blog-post.php',
  'calculator.html',
  'dictionary.html',
  'matcher.html',
  'the-health-bridge.html',
  'the-health-bridge/index.html',
  'forum/components.php',
  '404.html',
  '_not-found.html'
];

function uploadFile(relPath) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(BASE_DIR, relPath);
    if (!fs.existsSync(filePath)) {
      console.log(`[SKIP] ${relPath} (does not exist)`);
      return resolve();
    }
    const stat = fs.statSync(filePath);
    const size = stat.size;
    const fileData = fs.readFileSync(filePath);

    // Step 1: POST creation
    const postUrl = new URL(`${TUS_URL}/${encodeURI(relPath)}?override=true`);
    const postOptions = {
      method: 'POST',
      headers: {
        'X-Auth': AUTH_KEY,
        'X-Auth-Rest': REST_AUTH_KEY,
        'Tus-Resumable': '1.0.0',
        'Upload-Length': size.toString(),
        'Upload-Offset': '0'
      }
    };

    const postReq = https.request(postUrl, postOptions, (res) => {
      if (res.statusCode !== 201 && res.statusCode !== 200) {
        console.error(`[ERR POST] ${relPath}: ${res.statusCode} ${res.statusMessage}`);
        return resolve();
      }

      // Step 2: PATCH data
      const patchUrl = new URL(`${TUS_URL}/${encodeURI(relPath)}?override=true`);
      const patchOptions = {
        method: 'PATCH',
        headers: {
          'X-Auth': AUTH_KEY,
          'X-Auth-Rest': REST_AUTH_KEY,
          'Tus-Resumable': '1.0.0',
          'Content-Type': 'application/offset+octet-stream',
          'Upload-Offset': '0',
          'Content-Length': size.toString()
        }
      };

      const patchReq = https.request(patchUrl, patchOptions, (patchRes) => {
        if (patchRes.statusCode === 204 || patchRes.statusCode === 200) {
          console.log(`[OK] ${relPath} (${size} bytes)`);
        } else {
          console.error(`[ERR PATCH] ${relPath}: ${patchRes.statusCode}`);
        }
        resolve();
      });

      patchReq.on('error', (err) => {
        console.error(`[ERR PATCH] ${relPath}: ${err.message}`);
        resolve();
      });

      patchReq.write(fileData);
      patchReq.end();
    });

    postReq.on('error', (err) => {
      console.error(`[ERR POST] ${relPath}: ${err.message}`);
      resolve();
    });

    postReq.end();
  });
}

async function run() {
  console.log(`Starting upload of ${filesToUpload.length} files...`);
  for (const f of filesToUpload) {
    await uploadFile(f);
  }
  console.log('All uploads finished.');
}

run();
