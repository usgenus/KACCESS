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

  // 4.5 Settings API Simulation
  if (urlPath.includes('/api/settings.php')) {
    const contentFile = path.join(ROOT, 'data', 'content.json');
    let d = {};
    if (fs.existsSync(contentFile)) {
      try { d = JSON.parse(fs.readFileSync(contentFile, 'utf8') || '{}'); } catch(e) {}
    }
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body || '{}');
          if (!d.settings) d.settings = {};
          if (parsed.scrollingBanner !== undefined) {
            d.settings.scrollingBanner = parsed.scrollingBanner;
          }
          fs.writeFileSync(contentFile, JSON.stringify(d, null, 2), 'utf8');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Saved in local test server', data: d.settings }));
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
        data: d.settings || {
          scrollingBanner: '의료접근포탈: "비영리기관(한인 커뮤니티센터)들의 의료관련 정보서비스의 한계를 넘어, 최고의 의료시스템 전문가들이 제공하는 언어와 문화의 장벽 없이, 분야별 최고 전문가가 함께하는 무료 프리미엄 의료 접근·네비게이션 서비스"'
        }
      }));
      return;
    }
  }

  // 4.6 Cron Push API Simulation
  if (urlPath.includes('/api/cron_push.php')) {
    const stateFile = path.join(ROOT, 'data', 'push_state.json');
    let st = {};
    if (fs.existsSync(stateFile)) {
      try { st = JSON.parse(fs.readFileSync(stateFile, 'utf8') || '{}'); } catch(e) {}
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      currentTime: new Date().toISOString(),
      scheduleRule: 'Monday 10:00 AM & Thursday 10:00 AM (America/New_York)',
      pendingPostsCount: 0,
      totalSubscribers: 3,
      lastSentAt: st.last_sent_at || null,
      lastSlot: st.last_slot || null
    }));
    return;
  }

  // 5. Clean URLs & Portal Pages at Root
  let filePath = '';
  if (urlPath === '/admin' || urlPath === '/admin/' || urlPath === '/admin/index.php') {
    const adminFile = path.join(ROOT, 'admin', 'index.php');
    if (fs.existsSync(adminFile)) {
      let html = fs.readFileSync(adminFile, 'utf8');
      html = html.replace(/<\?php[\s\S]*?\?>/g, '');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }
  }
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
  const stat = fs.statSync(filePath);
  const totalSize = stat.size;

  // Support Byte-Range Requests for Audio / Video Seeking
  const range = req.headers.range;
  if (range && (ext === '.mp3' || ext === '.mp4')) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
    const chunkSize = (end - start) + 1;
    const fileStream = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${totalSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': contentType
    });
    fileStream.pipe(res);
    return;
  }

  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': totalSize,
    'Accept-Ranges': 'bytes'
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Unified Root Domain Offline Server listening on http://localhost:${PORT}`);
});
