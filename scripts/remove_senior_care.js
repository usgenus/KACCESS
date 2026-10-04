const fs = require('fs');
const path = require('path');

const rootDir = '/Users/ejyoon/Desktop/KACCESS';

console.log('--- Step 1: Updating .htaccess ---');
const htaccessPath = path.join(rootDir, '.htaccess');
if (fs.existsSync(htaccessPath)) {
  let ht = fs.readFileSync(htaccessPath, 'utf8');
  ht = ht.replace(/RewriteRule \^senior-care\/\?\$ senior-care\.php \[L\]/g, 'RewriteRule ^senior-care/?$ / [R=301,L]');
  if (!ht.includes('RewriteRule ^senior-care/?$ / [R=301,L]')) {
    ht = ht.replace(/RewriteEngine On\n/, 'RewriteEngine On\nRewriteRule ^senior-care/?$ / [R=301,L]\n');
  }
  fs.writeFileSync(htaccessPath, ht, 'utf8');
  console.log('Updated .htaccess with 301 redirect');
}

console.log('--- Step 2: Updating router.php ---');
const routerPath = path.join(rootDir, 'router.php');
if (fs.existsSync(routerPath)) {
  let r = fs.readFileSync(routerPath, 'utf8');
  r = r.replace(
    /if \(preg_match\('#\^\/senior-care\/\?\$#', \$uri\)\) \{\s*require __DIR__ \. '\/senior-care\.php';\s*\}/g,
    "if (preg_match('#^/senior-care/?$#', $uri)) {\n    header('Location: /', true, 301);\n    exit;\n}"
  );
  fs.writeFileSync(routerPath, r, 'utf8');
  console.log('Updated router.php with 301 redirect');
}

console.log('--- Step 3: Updating senior-care.php & senior-care.html ---');
const scPhp = path.join(rootDir, 'senior-care.php');
if (fs.existsSync(scPhp)) {
  const phpRedirect = `<?php\nheader("Location: /", true, 301);\nexit;\n`;
  let content = fs.readFileSync(scPhp, 'utf8');
  if (!content.startsWith('<?php\nheader("Location: /"')) {
    fs.writeFileSync(scPhp, phpRedirect + content, 'utf8');
    console.log('Added 301 header redirect to senior-care.php');
  }
}

const scHtml = path.join(rootDir, 'senior-care.html');
if (fs.existsSync(scHtml)) {
  const htmlRedirect = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/"><script>location.replace('/');</script></head><body>Redirecting to <a href="/">NJ Access Portal</a>...</body></html>`;
  fs.writeFileSync(scHtml, htmlRedirect, 'utf8');
  console.log('Replaced senior-care.html with instant client-side redirect');
}

const scIndexHtml = path.join(rootDir, 'senior-care/index.html');
if (fs.existsSync(scIndexHtml)) {
  const htmlRedirect = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/"><script>location.replace('/');</script></head><body>Redirecting to <a href="/">NJ Access Portal</a>...</body></html>`;
  fs.writeFileSync(scIndexHtml, htmlRedirect, 'utf8');
  console.log('Replaced senior-care/index.html with instant client-side redirect');
}

console.log('--- Step 4: Updating sitemap.php & sitemap.xml & robots.txt ---');
const sitemapPhp = path.join(rootDir, 'sitemap.php');
if (fs.existsSync(sitemapPhp)) {
  let s = fs.readFileSync(sitemapPhp, 'utf8');
  s = s.replace(/\s*\[\s*'path'\s*=>\s*'\/senior-care'[\s\S]*?\],?/g, '');
  fs.writeFileSync(sitemapPhp, s, 'utf8');
  console.log('Removed /senior-care from sitemap.php');
}

const sitemapXml = path.join(rootDir, 'sitemap.xml');
if (fs.existsSync(sitemapXml)) {
  let x = fs.readFileSync(sitemapXml, 'utf8');
  x = x.replace(/\s*<url>\s*<loc>https:\/\/njaccessportal\.com\/senior-care<\/loc>[\s\S]*?<\/url>/g, '');
  fs.writeFileSync(sitemapXml, x, 'utf8');
  console.log('Removed /senior-care from sitemap.xml');
}

const robotsTxt = path.join(rootDir, 'robots.txt');
if (fs.existsSync(robotsTxt)) {
  let rb = fs.readFileSync(robotsTxt, 'utf8');
  rb = rb.replace(/Allow: \/senior-care\r?\n/g, '');
  fs.writeFileSync(robotsTxt, rb, 'utf8');
  console.log('Updated robots.txt');
}

const koRobotsTxt = path.join(rootDir, 'ko/robots.txt');
if (fs.existsSync(koRobotsTxt)) {
  let krb = fs.readFileSync(koRobotsTxt, 'utf8');
  krb = krb.replace(/Allow: \/senior-care\r?\n/g, '');
  fs.writeFileSync(koRobotsTxt, krb, 'utf8');
  console.log('Updated ko/robots.txt');
}

console.log('--- Step 5: Updating HTML/PHP Navigation Links ---');
const targetFiles = [
  'index.php',
  'blog.php',
  'blog-post.php',
  'about.html',
  'about/index.html',
  'medicare.html',
  'medicare/index.html',
  'tool.html',
  'tool/index.html',
  'calculator.html',
  'dictionary.html',
  'matcher.html',
  'the-health-bridge.html',
  'the-health-bridge/index.html',
  'forum/components.php',
  '404.html',
  '_not-found.html',
  'ko/index.html',
  'ko/blog-post.php',
  'ko/forum/components.php'
];

targetFiles.forEach(rel => {
  const fullPath = path.join(rootDir, rel);
  if (!fs.existsSync(fullPath)) return;
  let html = fs.readFileSync(fullPath, 'utf8');
  const original = html;

  // 1. Remove Desktop Nav link: <a class="nav-link... href="(/ko)?/senior-care">시니어 케어</a>
  html = html.replace(/\s*<a\s+class="nav-link[^"]*"\s+href="(?:\/ko)?\/senior-care">시니어 케어<\/a>/g, '');
  html = html.replace(/\s*<a\s+href="(?:\/ko)?\/senior-care"\s+class="nav-link[^"]*">시니어 케어<\/a>/g, '');
  html = html.replace(/<a class="nav-link[^"]*" href="(?:\/ko)?\/senior-care">시니어 케어<\/a>/g, '');

  // 2. Remove Mobile Menu Senior Care link block
  // Pattern: <!-- 3. 시니어 케어 --> or similar comments and the <a> tag
  html = html.replace(/\s*<!--\s*(?:3\.\s*)?시니어 케어\s*-->\s*<a\s+href="(?:\/ko)?\/senior-care"[\s\S]*?<\/a>/g, '');
  // Also any <a> tag linking to senior-care in mobile menu
  html = html.replace(/\s*<a\s+href="(?:\/ko)?\/senior-care"\s+class="flex items-center justify-between[^"]*"[\s\S]*?<\/a>/g, '');
  html = html.replace(/\s*<a\s+class="flex items-center justify-between[^"]*"\s+href="(?:\/ko)?\/senior-care"[\s\S]*?<\/a>/g, '');
  // Simple fallback for any lingering mobile link
  html = html.replace(/\s*<a\s+class="font-sans[^"]*"\s+href="(?:\/ko)?\/senior-care">시니어 케어<\/a>/g, '');

  // 3. Remove Footer item: <li><a ... href="(/ko)?/senior-care">시니어 케어</a></li>
  html = html.replace(/\s*<li><a\s+class="[^"]*"\s+href="(?:\/ko)?\/senior-care">시니어 케어<\/a><\/li>/g, '');
  html = html.replace(/\s*<li><a\s+href="(?:\/ko)?\/senior-care"\s+class="[^"]*">시니어 케어<\/a><\/li>/g, '');

  if (html !== original) {
    fs.writeFileSync(fullPath, html, 'utf8');
    console.log(`Updated navigation in ${rel}`);
  }
});

console.log('--- Step 6: Updating engine/js/main.js ---');
const mainJsPath = path.join(rootDir, 'engine/js/main.js');
if (fs.existsSync(mainJsPath)) {
  let mjs = fs.readFileSync(mainJsPath, 'utf8');
  mjs = mjs.replace(/<a class="nav-link pb-0\.5 font-medium text-slate-700 hover:text-brand-blue" href="(?:\/ko)?\/senior-care">시니어 케어<\/a>/g, '');
  mjs = mjs.replace(/<a class="font-sans text-sm font-medium text-brand-dark hover:text-brand-blue py-2 border-b border-brand-border\/50 transition-colors" href="(?:\/ko)?\/senior-care">시니어 케어<\/a>/g, '');
  mjs = mjs.replace(/<li><a class="text-sm font-sans text-white\/60 hover:text-white transition-colors duration-200" href="(?:\/ko)?\/senior-care">시니어 케어<\/a><\/li>/g, '');
  fs.writeFileSync(mainJsPath, mjs, 'utf8');
  console.log('Updated engine/js/main.js');
}

console.log('--- Step 7: Updating _next/static/chunks/ ---');
const chunkFiles = [
  '_next/static/chunks/3hl7r9k9z73f7.js',
  '_next/static/chunks/3hl7r9k9z73f7_v2.js',
  '_next/static/chunks/3hl7r9k9z73f7_v3.js'
];
chunkFiles.forEach(cf => {
  const chunkPath = path.join(rootDir, cf);
  if (fs.existsSync(chunkPath)) {
    let c = fs.readFileSync(chunkPath, 'utf8');
    c = c.replace(/,\{href:"\/senior-care",label:"시니어 케어"\}/g, '');
    c = c.replace(/\{href:"\/senior-care",label:"시니어 케어\},/g, '');
    fs.writeFileSync(chunkPath, c, 'utf8');
    console.log(`Updated chunk ${cf}`);
  }
});

console.log('--- Step 8: Updating js/fixes.js ---');
const fixesPath = path.join(rootDir, 'js/fixes.js');
if (fs.existsSync(fixesPath)) {
  let fx = fs.readFileSync(fixesPath, 'utf8');

  // Remove the senior care mobile nav block in buildAccordionMenuHTML
  fx = fx.replace(/\s*'<!-- 3\. Senior Care -->',[\s\S]*?'<\/a>',/g, '');

  // In fixHeaderAndNavLinks, ensure senior-care link is removed, not added:
  const oldSeniorBlock = `      var seniorA = desktopDiv.querySelector('a[href*="senior-care"]');
      var blogA = desktopDiv.querySelector('a[href="/blog"]');
      if (!seniorA && blogA) {
        seniorA = document.createElement('a');
        seniorA.href = '/senior-care';
        seniorA.textContent = '시니어 케어';
        seniorA.className = 'nav-link pb-0.5 ' + (curPath === '/senior-care' ? 'font-bold text-brand-blue' : 'font-medium text-slate-700 hover:text-brand-blue');
        if (blogA.nextSibling) {
          desktopDiv.insertBefore(seniorA, blogA.nextSibling);
        } else {
          desktopDiv.appendChild(seniorA);
        }
      } else if (seniorA) {
        if (curPath === '/senior-care') {
          seniorA.classList.add('font-bold', 'text-brand-blue');
          seniorA.classList.remove('text-slate-700');
        }
      }`;

  const newSeniorBlock = `      var seniorA = desktopDiv.querySelector('a[href*="senior-care"]');
      if (seniorA) {
        seniorA.remove();
      }`;

  if (fx.includes(oldSeniorBlock)) {
    fx = fx.replace(oldSeniorBlock, newSeniorBlock);
  } else {
    // If exact match doesn't hit, replace via regex
    fx = fx.replace(/var seniorA = desktopDiv\.querySelector\('a\[href\*="senior-care"\]'\);[\s\S]*?else if \(seniorA\) \{[\s\S]*?\}/, `var seniorA = desktopDiv.querySelector('a[href*="senior-care"]'); if (seniorA) seniorA.remove();`);
  }

  // Remove footer injection
  const oldFooterBlock = `      var footerSeniorA = footer.querySelector('a[href*="senior-care"]');
      if (footerBlogA && !footerSeniorA) {
        var li = document.createElement('li');
        var fA = document.createElement('a');
        fA.href = '/senior-care';
        fA.textContent = '시니어 케어';
        fA.className = 'text-sm font-sans text-white/60 hover:text-white transition-colors duration-200';
        li.appendChild(fA);
        var pLi = footerBlogA.closest('li');
        if (pLi && pLi.parentElement) {
          if (pLi.nextSibling) {
            pLi.parentElement.insertBefore(li, pLi.nextSibling);
          } else {
            pLi.parentElement.appendChild(li);
          }
        }
      }`;

  const newFooterBlock = `      var footerSeniorA = footer.querySelector('a[href*="senior-care"]');
      if (footerSeniorA) {
        var sLi = footerSeniorA.closest('li');
        if (sLi) sLi.remove();
        else footerSeniorA.remove();
      }`;

  if (fx.includes(oldFooterBlock)) {
    fx = fx.replace(oldFooterBlock, newFooterBlock);
  } else {
    fx = fx.replace(/var footerSeniorA = footer\.querySelector\('a\[href\*="senior-care"\]'\);[\s\S]*?var pLi = footerBlogA\.closest\('li'\);[\s\S]*?\}/, `var footerSeniorA = footer.querySelector('a[href*="senior-care"]'); if (footerSeniorA) { var sLi = footerSeniorA.closest('li'); if (sLi) sLi.remove(); else footerSeniorA.remove(); }`);
  }

  // Also in mobile menu check, remove any senior link
  fx = fx.replace(/if \(mobileDropdown && !mobileDropdown\.querySelector\('a\[href\*="senior-care"\]'\)\) \{\s*mobileDropdown\.innerHTML = buildAccordionMenuHTML\(curPath\);\s*\}/g,
    `if (mobileDropdown) {\n      var mSenior = mobileDropdown.querySelector('a[href*="senior-care"]');\n      if (mSenior) mSenior.remove();\n    }`
  );

  // Global DOM purge of any senior care links
  if (!fx.includes('purgeSeniorCareLinks')) {
    fx += `\n\n// Auto-purge any senior care links\n(function purgeSeniorCareLinks() {\n  function purge() {\n    document.querySelectorAll('a[href*="senior-care"]').forEach(function(el) {\n      var li = el.closest('li');\n      if (li) li.remove();\n      else el.remove();\n    });\n  }\n  if (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', purge);\n  } else {\n    purge();\n  }\n  setTimeout(purge, 500);\n  setTimeout(purge, 1500);\n})();\n`;
  }

  fs.writeFileSync(fixesPath, fx, 'utf8');
  console.log('Updated js/fixes.js');
}

console.log('--- Finished Script ---');
