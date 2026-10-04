const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/cec1d485e5fa0f2a/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MDgwOTk2NiwiaWF0IjoxNzkwNzg4MzY2fQ.PcyrGNtWons7-pUHFrAr3Jb2hKDtdpZ9au4jFZ3oGio';
const REST_AUTH_KEY = '1091193b2c013d7df278072d55a43d7bd1c1614f14de0244f18dd775e60d3d60-cec1d485e5fa0f2a';

const filesToUpload = [
  { local: 'api/audio_generator.php', remote: 'api/audio_generator.php' },
  { local: 'api/audio_generator.php', remote: 'ko/api/audio_generator.php' },
  { local: 'api/posts.php', remote: 'api/posts.php' },
  { local: 'api/posts.php', remote: 'ko/api/posts.php' },
  { local: 'blog-post.php', remote: 'blog-post.php' },
  { local: 'blog-post.php', remote: 'ko/blog-post.php' },
  { local: 'en/blog-post.php', remote: 'en/blog-post.php' }
];

function uploadSingleFile(localRel, remoteRel) {
  const localPath = path.join(BASE_DIR, localRel);
  const content = fs.readFileSync(localPath);
  const size = content.length;
  console.log(`[UPLOADING] ${localRel} -> ${remoteRel} (${size} B)`);

  return new Promise((resolve, reject) => {
    const encoded = remoteRel.split('/').map(encodeURIComponent).join('/');
    const postUrl = new URL(`${TUS_URL}/${encoded}?override=true`);
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
            console.log(`[DONE] ${remoteRel}`);
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

(async () => {
  for (const f of filesToUpload) {
    try {
      await uploadSingleFile(f.local, f.remote);
    } catch (e) {
      console.error(`Failed ${f.remote}:`, e.message);
    }
  }
  console.log('All files processed.');
})();
