const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';

const creds = {
  url: 'https://srv1709-files.hstgr.io/rest/555f6ffb7d9fd586/api/tus/public_html',
  auth_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MTk2MjA5MSwiaWF0IjoxNzkxOTQwNDkxfQ._rAUoeAcY0ny1ml76rwfSgveDi64ZPcgpjhAiln3XEY',
  rest_auth_key: '8bbca3174cd1939dbd28eae0d723565a36f5334ade241a5c994a70820d427844-555f6ffb7d9fd586'
};

function req(url, method, headers, body) {
  return new Promise((resolve, reject) => {
    const r = https.request(url, { method, headers }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    r.on('error', reject);
    if (body) r.write(body);
    r.end();
  });
}

async function uploadFile(relPath) {
  const localPath = path.join(BASE_DIR, relPath);
  if (!fs.existsSync(localPath)) {
    console.warn(`[SKIP] Missing: ${localPath}`);
    return false;
  }
  const content = fs.readFileSync(localPath);
  const url = new URL(`${creds.url}/${relPath.split('/').map(encodeURIComponent).join('/')}?override=true`);
  const baseHeaders = {
    'X-Auth': creds.auth_key,
    'X-Auth-Rest': creds.rest_auth_key,
    'Tus-Resumable': '1.0.0'
  };

  const p = await req(url, 'POST', {
    ...baseHeaders,
    'Upload-Length': content.length,
    'Upload-Offset': 0
  });

  if (![200, 201, 204].includes(p.status)) {
    throw new Error(`POST failed ${p.status}: ${p.body}`);
  }

  const r = await req(url, 'PATCH', {
    ...baseHeaders,
    'Upload-Offset': 0,
    'Content-Type': 'application/offset+octet-stream'
  }, content);

  if (![200, 204].includes(r.status)) {
    throw new Error(`PATCH failed ${r.status}: ${r.body}`);
  }

  console.log(`[OK] Deployed: ${relPath} (${content.length} bytes)`);
  return true;
}

const files = [
  'api/forum_db.php',
  'ko/api/forum_db.php',
  'api/forum.php',
  'ko/api/forum.php',
  'api/forum_admin.php',
  'ko/api/forum_admin.php',
  'forum/club.php',
  'ko/forum/club.php',
  'forum/index.php',
  'ko/forum/index.php',
  'admin2/index.php',
  'admin2/admin2.js',
  '.htaccess'
];

async function main() {
  console.log('Deploying Forum & CMS Clubs section update...');
  for (const f of files) {
    try {
      await uploadFile(f);
    } catch (e) {
      console.error(`Failed ${f}:`, e.message);
    }
  }
  console.log('All Forum & CMS files deployed.');
}

main();
