const https = require('https');
const fs = require('fs');
const path = require('path');

const AUDIO_DIR = path.join(__dirname, '../uploads/audio');
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/09aca354dda802cb/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc4OTgyOTE2NCwiaWF0IjoxNzg5ODA3NTY0fQ.-HbnddUVsCn5zwQbhldTlhoDSUN2hciMCmC7-2dxjUU';
const REST_AUTH_KEY = 'd2deba5ae407f1e6a19bc76dbbd195a49f3f7ce8c9b8d8c6da7b80dc1d10ab09-09aca354dda802cb';

async function uploadFile(relPath) {
  const localPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(localPath)) {
    console.warn(`[SKIP] Not found locally: ${relPath}`);
    return;
  }

  const content = fs.readFileSync(localPath);
  const size = content.length;
  console.log(`[UPLOADING] ${relPath} (${(size / 1024).toFixed(1)} KB)...`);

  // Step 1: POST to create TUS upload
  await new Promise((resolve, reject) => {
    const encodedRelPath = relPath.split('/').map(encodeURIComponent).join('/');
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
      if (res.statusCode === 201 || res.statusCode === 200) {
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

  // Step 2: PATCH to upload content
  await new Promise((resolve, reject) => {
    const encodedRelPath = relPath.split('/').map(encodeURIComponent).join('/');
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

  console.log(`[SUCCESS] ${relPath}`);
}

async function main() {
  if (!fs.existsSync(AUDIO_DIR)) {
    console.error('Audio dir does not exist');
    return;
  }

  const cliArgs = process.argv.slice(2);
  const files = cliArgs.length > 0 ? cliArgs : fs.readdirSync(AUDIO_DIR).filter(f => f.endsWith('.mp3'));
  console.log(`Found ${files.length} audio files to deploy...`);

  let success = 0;
  let fail = 0;
  for (const f of files) {
    try {
      await uploadFile(`uploads/audio/${f}`);
      success++;
    } catch (e) {
      console.error(`[ERROR] ${f}:`, e.message);
      fail++;
    }
  }

  console.log(`\nDeployment finished: ${success} succeeded, ${fail} failed.`);
}

main().catch(console.error);
