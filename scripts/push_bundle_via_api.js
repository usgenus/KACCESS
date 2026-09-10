const fs = require('fs');
const https = require('https');

const GITHUB_TOKEN = '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';
const REPO = 'usgenus/KACCESS';

async function uploadFile(filePath, repoPath, message) {
  const content = fs.readFileSync(filePath);
  const base64Content = content.toString('base64');

  // Check if file already exists to get SHA
  let sha = null;
  try {
    const checkRes = await request('GET', `/repos/${REPO}/contents/${repoPath}`);
    if (checkRes && checkRes.sha) {
      sha = checkRes.sha;
      console.log(`Found existing ${repoPath} SHA: ${sha}`);
    }
  } catch (e) {
    console.log(`No existing ${repoPath}, creating new.`);
  }

  const body = {
    message: message,
    content: base64Content
  };
  if (sha) {
    body.sha = sha;
  }

  const putRes = await request('PUT', `/repos/${REPO}/contents/${repoPath}`, body);
  console.log(`Uploaded ${repoPath} successfully! Commit: ${putRes.commit ? putRes.commit.sha : 'ok'}`);
}

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.github.com',
      path: path,
      method: method,
      headers: {
        'User-Agent': 'NodeJS-Deployer',
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        ...(data ? {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        } : {})
      }
    }, (res) => {
      let chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString();
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(text ? JSON.parse(text) : {});
        } else {
          reject(new Error(`GitHub API Error (${res.statusCode}): ${text}`));
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function run() {
  console.log('Uploading deploy_bundle.tar.gz...');
  await uploadFile('/tmp/deploy_bundle.tar.gz', 'deploy_bundle.tar.gz', 'Update deploy_bundle.tar.gz for mobile accordion menu');
  
  console.log('Uploading deploy_sync.php...');
  await uploadFile('deploy_sync.php', 'deploy_sync.php', 'Update deploy_sync.php for mobile accordion menu');
  
  console.log('All files pushed to GitHub successfully!');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
