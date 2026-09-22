const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Helper to safely replace in file
function updateFile(relPath, fn) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`[SKIP] Missing: ${relPath}`);
    return;
  }
  const original = fs.readFileSync(fullPath, 'utf8');
  const updated = fn(original, relPath);
  if (original !== updated) {
    fs.writeFileSync(fullPath, updated, 'utf8');
    console.log(`[UPDATED] ${relPath}`);
  } else {
    console.log(`[UNCHANGED] ${relPath}`);
  }
}

// 1. Files where https://kor2.njaccessportal.com should be replaced with https://njaccessportal.com/ko
const filesToReplaceDomain = [
  'robots.txt',
  'sitemap.php',
  'sitemap.xml',
  'medicare.html',
  'medicare/index.html',
  'senior-care.html',
  'senior-care/index.html',
  'senior-care.php',
  'blog.php',
  'blog-post.php',
  'forum/index.php',
  'forum/topic.php',
  'about.html',
  'about/index.html',
  'index.php',
  'index.html',
  'splash.html',
  'data/content.json',
  'scripts/deploy.sh'
];

console.log('--- Step 1: Replace kor2 domain references ---');
filesToReplaceDomain.forEach(rel => {
  updateFile(rel, (content) => {
    let res = content;
    // Replace trailing slash first
    res = res.replace(/https:\/\/kor2\.njaccessportal\.com\//g, 'https://njaccessportal.com/ko/');
    // Replace without trailing slash
    res = res.replace(/https:\/\/kor2\.njaccessportal\.com/g, 'https://njaccessportal.com/ko');
    // Replace http just in case
    res = res.replace(/http:\/\/kor2\.njaccessportal\.com\//g, 'https://njaccessportal.com/ko/');
    res = res.replace(/http:\/\/kor2\.njaccessportal\.com/g, 'https://njaccessportal.com/ko');
    return res;
  });
});

console.log('\n--- Step 2: Update splash.html button links to /ko/ ---');
updateFile('splash.html', (content) => {
  return content
    .replace(/href="https:\/\/njaccessportal\.com\/ko\/"/g, 'href="/ko/"')
    .replace(/href="https:\/\/njaccessportal\.com\/ko\/medicare"/g, 'href="/ko/medicare"')
    .replace(/href="https:\/\/njaccessportal\.com\/ko\/forum"/g, 'href="/ko/forum"')
    .replace(/href="https:\/\/njaccessportal\.com\/ko\/tool"/g, 'href="/ko/tool"');
});

console.log('\n--- Step 3: Update .htaccess for /ko/ subfolder ---');
updateFile('.htaccess', (content) => {
  let res = content;
  // Change RewriteBase to /ko/
  res = res.replace(/RewriteBase \//g, 'RewriteBase /ko/');
  // Update index.html redirect to /ko/
  res = res.replace(/RewriteRule \^index\\\.html\$ \/ \[R=301,L\]/g, 'RewriteRule ^index\\.html$ /ko/ [R=301,L]');
  // Update ErrorDocument 404
  res = res.replace(/ErrorDocument 404 \/404\.html/g, 'ErrorDocument 404 /ko/404.html');
  return res;
});

console.log('\n--- Step 4: Update internal navigation links across portal files ---');

const portalFiles = [
  'index.php',
  'index.html',
  'medicare.html',
  'medicare/index.html',
  'senior-care.php',
  'senior-care.html',
  'senior-care/index.html',
  'blog.php',
  'blog.html',
  'blog-post.php',
  'forum/index.php',
  'forum/topic.php',
  'forum/ask.php',
  'forum/components.php',
  'tool.html',
  'tool/index.html',
  'matcher.html',
  'calculator.html',
  'dictionary.html',
  'about.html',
  'about/index.html',
  'the-health-bridge.html',
  'the-health-bridge/index.html',
  '404.html',
  '_not-found.html',
  'admin/login.php',
  'admin/index.php',
  'admin/admin.js',
  'admin2/login.php',
  'admin2/index.php',
  'admin2/admin2.js',
  'js/cms-client.js',
  'js/fixes.js'
];

const routes = [
  'medicare',
  'blog',
  'forum',
  'senior-care',
  'tool',
  'about',
  'matcher',
  'calculator',
  'dictionary',
  'admin',
  'admin2',
  'the-health-bridge',
  '404',
  'api',
  'uploads',
  '_next',
  'favicon',
  'apple-touch-icon'
];

portalFiles.forEach(rel => {
  updateFile(rel, (content) => {
    let res = content;

    // 1. Root link href="/" -> href="/ko/"
    res = res.replace(/href="\/"/g, 'href="/ko/"');
    res = res.replace(/href='\/'/g, "href='/ko/'");

    // 2. Specific routes: href="/route" or href="/route/..." or href="/route?..."
    routes.forEach(route => {
      // Avoid already prefixed /ko/route
      // Matches href="/route" or href="/route/... or href="/route?... or href="/route#...
      const hrefRegex = new RegExp(`href="\\/${route}([\"\\/\\?#])`, 'g');
      res = res.replace(hrefRegex, `href="/ko/${route}$1`);

      const hrefSingleRegex = new RegExp(`href='\\/${route}([\'\\/\\?#])`, 'g');
      res = res.replace(hrefSingleRegex, `href='/ko/${route}$1`);

      // src="/route...
      const srcRegex = new RegExp(`src="\\/${route}([\"\\/\\?#])`, 'g');
      res = res.replace(srcRegex, `src="/ko/${route}$1`);

      const srcSingleRegex = new RegExp(`src='\\/${route}([\'\\/\\?#])`, 'g');
      res = res.replace(srcSingleRegex, `src='/ko/${route}$1`);

      // fetch('/route...
      const fetchRegex = new RegExp(`fetch\\((['"\`])\\/${route}([/'"\`\\?])`, 'g');
      res = res.replace(fetchRegex, `fetch($1/ko/${route}$2`);

      // window.location.href = '/route...
      const locRegex = new RegExp(`window\\.location\\.href\\s*=\\s*(['"])\\/${route}(['"/])`, 'g');
      res = res.replace(locRegex, `window.location.href = $1/ko/${route}$2`);

      // header('Location: /route...
      const headerRegex = new RegExp(`header\\((['"])Location:\\s*\\/${route}(['"/])`, 'g');
      res = res.replace(headerRegex, `header($1Location: /ko/${route}$2`);

      // action="/route...
      const actionRegex = new RegExp(`action="\\/${route}([\"\\/\\?#])`, 'g');
      res = res.replace(actionRegex, `action="/ko/${route}$1`);
    });

    // Asset paths like /logo, /kakao, /access.jpg
    res = res.replace(/src="\/logo/g, 'src="/ko/logo');
    res = res.replace(/src="\/kakao/g, 'src="/ko/kakao');
    res = res.replace(/src="\/access\.jpg"/g, 'src="/ko/access.jpg"');
    res = res.replace(/src="\/forum_community_banner\.jpg"/g, 'src="/ko/forum_community_banner.jpg"');

    // Handle navigateToHome in JS
    res = res.replace(/window\.location\.href\s*=\s*['"]\/['"];/g, "window.location.href = '/ko/';");
    res = res.replace(/if\s*\(cur\s*===\s*'\/'/g, "if (cur === '/ko' || cur === '/ko/' || cur === '/'");
    res = res.replace(/if\s*\(currentPath\s*===\s*'\/'/g, "if (currentPath === '/ko' || currentPath === '/ko/' || currentPath === '/'");

    // Clean up any double /ko/ko/
    res = res.replace(/\/ko\/ko\//g, '/ko/');

    return res;
  });
});

console.log('\n--- Migration path updates completed successfully! ---');
