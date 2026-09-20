const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = path.join(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4'
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];

  if (urlPath === '/' || urlPath === '') {
    urlPath = '/index.html';
  } else if (urlPath === '/the-health-bridge' || urlPath === '/the-health-bridge/') {
    urlPath = '/the-health-bridge/index.html';
  } else if (urlPath === '/medicare' || urlPath === '/medicare/') {
    urlPath = '/medicare.html';
  } else if (urlPath === '/tool' || urlPath === '/tool/') {
    urlPath = '/tool.html';
  } else if (urlPath === '/about' || urlPath === '/about/') {
    urlPath = '/about.html';
  } else if (urlPath === '/calculator' || urlPath === '/calculator/') {
    urlPath = '/calculator.html';
  } else if (urlPath === '/dictionary' || urlPath === '/dictionary/') {
    urlPath = '/dictionary.html';
  }

  let filePath = path.join(ROOT, urlPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    // Try appending .html
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Not Found</h1>');
      return;
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  const content = fs.readFileSync(filePath);
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(content);
});

server.listen(PORT, () => {
  console.log(`Offline test server listening on http://localhost:${PORT}`);
});
