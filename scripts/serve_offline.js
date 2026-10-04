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
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg'
};

const server = http.createServer((req, res) => {
  const [urlPath, queryStr] = req.url.split('?');

  // 1. Legacy /ko/ 301 Permanent Redirect to root domain (matching .htaccess)
  if (urlPath === '/ko' || urlPath === '/ko/') {
    res.writeHead(301, {
      'Location': '/' + (queryStr ? '?' + queryStr : ''),
      'Cache-Control': 'no-cache'
    });
    res.end();
    return;
  }
  if (urlPath.startsWith('/ko/')) {
    const sub = urlPath.slice(4);
    res.writeHead(301, {
      'Location': '/' + sub + (queryStr ? '?' + queryStr : ''),
      'Cache-Control': 'no-cache'
    });
    res.end();
    return;
  }

  // 2. Engine Routing (untouched)
  if (urlPath === '/engine' || urlPath === '/engine/') {
    const engineFile = path.join(ROOT, 'engine', 'index.html');
    if (fs.existsSync(engineFile)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fs.readFileSync(engineFile));
      return;
    }
  }

  // 3. Service Worker
  if (urlPath === '/sw.js') {
    const swFile = path.join(ROOT, 'sw.js');
    if (fs.existsSync(swFile)) {
      res.writeHead(200, {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Service-Worker-Allowed': '/',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(fs.readFileSync(swFile));
      return;
    }
  }

  // 4. Push Subscription API Simulation
  if (urlPath.includes('/api/push_subscription.php')) {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body || '{}');
          const subsFile = path.join(ROOT, 'data', 'push_subscriptions.json');
          let subs = [];
          if (fs.existsSync(subsFile)) {
            subs = JSON.parse(fs.readFileSync(subsFile, 'utf8') || '[]');
          }
          subs.push({
            endpoint: parsed.endpoint,
            keys: parsed.keys,
            subscribedAt: new Date().toISOString()
          });
          fs.writeFileSync(subsFile, JSON.stringify(subs, null, 2));
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Subscribed in local test server', totalSubscribers: subs.length }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
      });
      return;
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        publicKey: 'BJpQ9Wxw10X-8ODi78gIo2j2heFmIhHK5VqhxgIN_NJ6c0GJxIgNF6CCZQgH-X9W7oPu_PsxYqDhJ1PKRWFxbkQ'
      }));
      return;
    }
  }

  // 5. Clean URLs & Portal Pages at Root
  let filePath = '';
  if (urlPath === '/' || urlPath === '/index.html' || urlPath === '/index.php') {
    filePath = path.join(ROOT, 'ko', 'index.html');
  } else if (urlPath === '/blog' || urlPath === '/blog/') {
    filePath = path.join(ROOT, 'blog.html');
  } else if (urlPath.startsWith('/blog/')) {
    filePath = path.join(ROOT, 'blog.html');
  } else if (urlPath === '/resource-center' || urlPath === '/resource-center/' || urlPath === '/resources' || urlPath === '/resources/') {
    filePath = path.join(ROOT, 'resource-center.html');
  } else if (urlPath === '/resources/medicare' || urlPath === '/resources/medicare/' || urlPath === '/medicare' || urlPath === '/medicare/') {
    filePath = path.join(ROOT, 'resource-center.html');
  } else if (urlPath === '/navigation' || urlPath === '/navigation/' || urlPath === '/tool' || urlPath === '/tool/') {
    filePath = path.join(ROOT, 'tool.html');
  } else if (urlPath === '/news' || urlPath === '/news/') {
    filePath = path.join(ROOT, 'blog.html');
  } else if (urlPath === '/senior-care' || urlPath === '/senior-care/') {
    res.writeHead(301, { 'Location': '/' });
    res.end();
    return;
  } else if (urlPath === '/tool' || urlPath === '/tool/') {
    filePath = path.join(ROOT, 'tool.html');
  } else if (urlPath === '/about' || urlPath === '/about/') {
    filePath = path.join(ROOT, 'about.html');
  } else if (urlPath === '/matcher' || urlPath === '/matcher/') {
    filePath = path.join(ROOT, 'matcher.html');
  } else if (urlPath === '/calculator' || urlPath === '/calculator/') {
    filePath = path.join(ROOT, 'calculator.html');
  } else if (urlPath === '/dictionary' || urlPath === '/dictionary/') {
    filePath = path.join(ROOT, 'dictionary.html');
  } else if (urlPath === '/forum' || urlPath === '/forum/') {
    filePath = path.join(ROOT, 'forum', 'index.php');
  } else if (urlPath.startsWith('/forum/')) {
    filePath = path.join(ROOT, 'forum', 'index.php');
  } else {
    filePath = path.join(ROOT, urlPath);
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Not Found (Offline Simulator)</h1>');
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
  console.log(`Unified Root Domain Offline Server listening on http://localhost:${PORT}`);
});
