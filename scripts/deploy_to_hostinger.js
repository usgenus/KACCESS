const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/edda57d2987305e4/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc4ODk4NzU4NSwiaWF0IjoxNzg4OTY1OTg1fQ.CW_9i94EcsqXhAKf67Y32MxyN81r4g4dNwae_RUNSH4';
const REST_AUTH_KEY = '78de60b74bd7302878e019da5b64e89debdc85020e802b6a565dec7aca98c7e0-edda57d2987305e4';

const filesToUpload = [
  '.htaccess',
  'robots.txt',
  'sitemap.php',
  'sitemap.xml',
  'data/content.json',
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
  'js/cms-client.js',
  'favicon.ico',
  'favicon.svg',
  'apple-touch-icon.png',
  'favicon-192.png',
  'favicon-512.png',
  'favicon-32.png',
  'favicon-16.png',
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
