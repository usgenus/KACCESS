const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/d2df0a196edbb907/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc4ODkzNzk1OCwiaWF0IjoxNzg4OTE2MzU4fQ.v7ZdTWvleQFewqbo0ufrwfs3AbLN5HaYqeSu_vcGJEE';
const REST_AUTH_KEY = 'b7d5a76f2da93b062af72293aa23a45258e5c730b636432c75f288dd4f056748-d2df0a196edbb907';

const filesToUpload = [
  '.htaccess',
  'senior-care.php',
  'senior-care.html',
  'senior-care/index.html',
  'index.php',
  'index.html',
  'blog.php',
  'blog.html',
  'blog-post.php',
  'medicare.html',
  'medicare/index.html',
  'tool.html',
  'tool/index.html',
  'calculator.html',
  'dictionary.html',
  'matcher.html',
  'about.html',
  'about/index.html',
  '404.html',
  '_not-found.html',
  'js/fixes.js',
  '_next/static/chunks/1fosv8xgmgdeu.css',
  '_next/static/chunks/191f64lzmub01.js',
  '_next/static/chunks/3hl7r9k9z73f7.js',
  '_next/static/chunks/3hl7r9k9z73f7_v2.js',
  '_next/static/chunks/3hl7r9k9z73f7_v3.js',
  'api/comments.php',
  'api/contact.php',
  'api/db.php',
  'api/supabase.php'
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

  // Step 1: POST initiation
  await new Promise((resolve, reject) => {
    // encode path components but keep forward slashes
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

  // Step 2: PATCH payload
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
  console.log(`Starting deployment of ${filesToUpload.length} files to Hostinger...`);
  let successCount = 0;
  let errorCount = 0;

  for (const file of filesToUpload) {
    try {
      await uploadFile(file);
      successCount++;
    } catch (err) {
      console.error(`[ERROR] Failed to upload ${file}:`, err.message);
      errorCount++;
    }
  }

  console.log(`\nDeployment summary: ${successCount} succeeded, ${errorCount} failed.`);
}

main();
