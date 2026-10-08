const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/464cb6c1a6805783/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MTQ4ODkyMCwiaWF0IjoxNzkxNDY3MzIwfQ.D0CdJRImPWF_VyNxfLWqVLsEDtE9EQisuCi5HPEPKcc';
const REST_AUTH_KEY = 'e4841e6710f0cc3d8b0cf33d660a6784873d324a91c6089fba1e76039ca147b6-464cb6c1a6805783';

const codeFiles = [
  'api/audio_generator.php',
  'ko/api/audio_generator.php',
  'scripts/generate_news_audio.js',
  'js/resource_center.js',
  'resource-center.html',
  'medicare.html',
  'medicare/index.html',
  'data/resource_audio_manifest.js',
  'data/resource_audio_manifest.json'
];

const tipAudioFiles = [];
for (let i = 1; i <= 11; i++) {
  tipAudioFiles.push(`uploads/audio/guides/guide_tip_${i}.mp3`);
}

const artAudioFiles = [];
for (let i = 1; i <= 80; i++) {
  artAudioFiles.push(`uploads/audio/guides/guide_art_${i}.mp3`);
}

const allFiles = [...codeFiles, ...tipAudioFiles, ...artAudioFiles];

async function uploadSingleFile(relPath, retry = 3) {
  const localPath = path.join(BASE_DIR, relPath);
  if (!fs.existsSync(localPath)) {
    console.warn(`[SKIP] Local file not found: ${localPath}`);
    return;
  }

  const content = fs.readFileSync(localPath);
  const size = content.length;

  const encodedRelPath = relPath.split('/').map(encodeURIComponent).join('/');
  const postUrl = new URL(`${TUS_URL}/${encodedRelPath}?override=true`);

  for (let attempt = 1; attempt <= retry; attempt++) {
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

      // Step 2: PATCH content
      await new Promise((resolve, reject) => {
        const patchUrl = new URL(`${TUS_URL}/${encodedRelPath}`);
        const req = https.request(patchUrl, {
          method: 'PATCH',
          headers: {
            'X-Auth': AUTH_KEY,
            'X-Auth-Rest': REST_AUTH_KEY,
            'Tus-Resumable': '1.0.0',
            'Upload-Offset': 0,
            'Content-Type': 'application/offset+octet-stream',
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
        req.on('error', reject);
        req.write(content);
        req.end();
      });

      console.log(`[SUCCESS] (${(size / 1024).toFixed(1)} KB) -> ${relPath}`);
      return;
    } catch (err) {
      if (attempt === retry) {
        console.error(`[FAIL] ${relPath}: ${err.message}`);
      } else {
        await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }
  }
}

async function run() {
  console.log(`=== STARTING FULL DEPLOYMENT TO PRODUCTION (${allFiles.length} files) ===`);
  const concurrency = 4;
  for (let i = 0; i < allFiles.length; i += concurrency) {
    const chunk = allFiles.slice(i, i + concurrency);
    await Promise.all(chunk.map(file => uploadSingleFile(file)));
  }
  console.log('=== FULL DEPLOYMENT FINISHED ===');
}

run().catch(console.error);
