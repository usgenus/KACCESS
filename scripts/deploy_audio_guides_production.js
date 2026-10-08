const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/2d49046b7a08c1ef/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MTQ0ODM0NywiaWF0IjoxNzkxNDI2NzQ3fQ.MhapkDguZkq3K3dg4xqvcTPAamEbuuRgd0WG_JMgVHo';
const REST_AUTH_KEY = '0dbdf450fb9474e333ea54cc0ae7dc53e79404334590db3d7195f64d32e5bb6f-2d49046b7a08c1ef';

// Core code & data files
const codeFiles = [
  'js/resource_center.js',
  'resource-center.html',
  'medicare.html',
  'medicare/index.html',
  'data/resource_audio_manifest.js',
  'data/resource_audio_manifest.json'
];

// 80 Audio MP3 files
const audioDir = path.join(BASE_DIR, 'uploads/audio/guides');
const audioFiles = fs.readdirSync(audioDir)
  .filter(f => f.endsWith('.mp3'))
  .map(f => `uploads/audio/guides/${f}`);

const allFiles = [...codeFiles, ...audioFiles];

async function uploadSingleFile(relPath, retry = 2) {
  const localPath = path.join(BASE_DIR, relPath);
  if (!fs.existsSync(localPath)) {
    console.warn(`[SKIP] File not found: ${localPath}`);
    return;
  }

  const content = fs.readFileSync(localPath);
  const size = content.length;

  const encodedRelPath = relPath.split('/').map(encodeURIComponent).join('/');
  const postUrl = new URL(`${TUS_URL}/${encodedRelPath}?override=true`);

  try {
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
          res.on('end', () => reject(new Error(`POST failed ${res.statusCode}: ${body.slice(0, 100)}`)));
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
          resolve();
        } else {
          let body = '';
          res.on('data', d => body += d);
          res.on('end', () => reject(new Error(`PATCH failed ${res.statusCode}: ${body.slice(0, 100)}`)));
        }
      });
      patchReq.on('error', reject);
      patchReq.write(content);
      patchReq.end();
    });

    console.log(`[OK] ${relPath} (${(size / 1024).toFixed(1)} KB)`);
  } catch (err) {
    if (retry > 0) {
      console.warn(`[RETRY] ${relPath}: ${err.message}`);
      await new Promise(r => setTimeout(r, 1000));
      return uploadSingleFile(relPath, retry - 1);
    }
    throw err;
  }
}

async function run() {
  console.log(`Starting deployment of ${allFiles.length} files to njaccessportal.com...`);
  console.log(`- Code & Data files: ${codeFiles.length}`);
  console.log(`- Audio MP3 files: ${audioFiles.length}`);

  let successCount = 0;
  let failCount = 0;

  // First deploy code files sequentially
  for (const f of codeFiles) {
    try {
      await uploadSingleFile(f);
      successCount++;
    } catch (e) {
      console.error(`[FAIL] ${f}:`, e.message);
      failCount++;
    }
  }

  // Then deploy audio files in parallel batches of 5
  const CONCURRENCY = 5;
  for (let i = 0; i < audioFiles.length; i += CONCURRENCY) {
    const chunk = audioFiles.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map(async f => {
      try {
        await uploadSingleFile(f);
        successCount++;
      } catch (e) {
        console.error(`[FAIL] ${f}:`, e.message);
        failCount++;
      }
    }));
  }

  console.log(`\n========================================`);
  console.log(`Deployment finished: ${successCount}/${allFiles.length} succeeded, ${failCount} failed.`);
  console.log(`========================================\n`);
}

run();
