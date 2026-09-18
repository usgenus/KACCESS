const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/1f4136099826cc5e/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc4OTcxNjkzMSwiaWF0IjoxNzg5Njk1MzMxfQ.Tsr3nWzNtffOhx-Qt6oWPWWC-DU8WUZSbrrzLf_vAu4';
const REST_AUTH_KEY = '26326db0f233184413854b1d60ca7ebe40ccfaf80f1532ce916c667dc82377c0-1f4136099826cc5e';

const filesToUpload = [
  '.htaccess',
  'robots.txt',
  'sitemap.php',
  'sitemap.xml',
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
  'js/translator.js',
  'js/njap-translate.js',
  'favicon.ico',
  'favicon.svg',
  'apple-touch-icon.png',
  'favicon-192.png',
  'favicon-512.png',
  'favicon-32.png',
  'favicon-16.png',
  'api/config.php',
  'api/translate.php',
  'api/comments.php',
  'api/contact.php',
  'api/db.php',
  'api/media.php',
  'api/supabase.php',
  'api/forum_db.php',
  'api/forum_auth.php',
  'api/forum.php',
  'api/forum_admin.php',
  'forum/index.php',
  'forum/topic.php',
  'forum/ask.php',
  'forum/components.php',
  'admin2/index.php',
  'admin2/login.php',
  'admin2/admin2.js',
  'data/forum.json',
  'supabase_forum_schema.sql',
  'splash.html',
  'uploads/videos/splash-video.mp4',
  'uploads/images/event_poster_20260915_031056_8b8ab63a.png',
  'uploads/images/forum_community_banner.jpg'
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
  const targets = process.argv.slice(2).length > 0 ? process.argv.slice(2) : filesToUpload;
  console.log(`Starting deployment of ${targets.length} files to Hostinger...`);
  let successCount = 0;
  let errorCount = 0;

  for (const file of targets) {
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
