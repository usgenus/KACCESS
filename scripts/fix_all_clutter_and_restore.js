const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// 1. Restore js/fixes.js Senior Mode styles & Desktop gap styling
const fixesJsPath = path.join(ROOT, 'js/fixes.js');
let fixesContent = fs.readFileSync(fixesJsPath, 'utf8');

// Replace senior-mode-btn CSS block with the original robust definition
const seniorCssOld = /'(\s*)\.senior-mode-btn \{'[\s\S]*?'  box-shadow: 0 1px 2px rgba\(0, 0, 0, 0\.04\) !important;',\s*'\}',/g;
const seniorCssNew = `'  /* Senior Mode Button Base */',
      '.senior-mode-btn {',
      '  display: inline-flex !important; align-items: center !important; justify-content: center !important; gap: 4px !important;',
      '  padding: 3px 9px !important; border-radius: 9999px !important; border: 1.5px solid #cbd5e1 !important;',
      '  background: #ffffff !important; color: #334155 !important; font-size: 11px !important; font-weight: 700 !important;',
      '  letter-spacing: -0.01em !important; cursor: pointer !important; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;',
      '  white-space: nowrap !important; flex-shrink: 0 !important; line-height: 1.4 !important; user-select: none !important;',
      '  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04) !important;',
      '}',`;
fixesContent = fixesContent.replace(seniorCssOld, seniorCssNew);

// Add global nav gap rules to fixes.js styles
if (!fixesContent.includes('.desktop-nav-gap-enforcer')) {
  fixesContent = fixesContent.replace(
    /('  \/\* Senior Mode Button Base \*\/',)/,
    `'  /* Desktop Navigation Gap Enforcer */',\n      '@media (min-width: 768px) { nav .hidden.md\\\\:flex, .desktop-nav-links { display: flex !important; align-items: center !important; gap: 26px !important; } }',\n      $1`
  );
}

// Ensure Senior Mode button is also in mobile accordion menu
if (!fixesContent.includes('<!-- Senior Mode in Mobile Dropdown -->')) {
  const accordionSeniorBox = `      '<!-- Senior Mode in Mobile Dropdown -->',
      '<div class="flex items-center justify-between py-2.5 px-3.5 mb-1.5 rounded-xl bg-slate-50 border border-slate-200/80">',
      '  <div class="flex items-center gap-2">',
      '    <span class="text-xs font-bold text-slate-700">화면 글자 크기</span>',
      '  </div>',
      '  <button type="button" class="senior-mode-btn notranslate" translate="no" onclick="window.cycleSeniorMode && window.cycleSeniorMode()" style="padding:4px 10px;font-size:12px;">',
      '    <span class="senior-btn-label">시니어모드+</span>',
      '    <span class="senior-step-badge" style="display:none;"></span>',
      '  </button>',
      '</div>',
`;
  fixesContent = fixesContent.replace(
    /'<!-- 1\. 홈 -->',/,
    accordionSeniorBox + "      '<!-- 1. 홈 -->',"
  );
}

// Remove the strict removal of senior-mode-btn on mobile
fixesContent = fixesContent.replace(
  /\.senior-mode-btn, #senior-mode-btn, \[id\*="senior-mode"\], \.mobile-senior-box \{ display: none !important; \}/g,
  '/* Mobile senior mode shown in drawer */'
);

// Fix desktopDiv search in fixes.js so it matches both /ko/ and /
fixesContent = fixesContent.replace(
  /var homeA = div\.querySelector\('a\[href="\/ko\/"\]'\);/g,
  "var homeA = div.querySelector('a[href=\"/ko/\"], a[href=\"/\"]');"
);
fixesContent = fixesContent.replace(
  /var blogA = div\.querySelector\('a\[href="\/ko\/blog"\]'\);/g,
  "var blogA = div.querySelector('a[href*=\"blog\"]');"
);

// Bump version
fixesContent = fixesContent.replace(/v=[\d\.]+/g, 'v=7.0.0');

fs.writeFileSync(fixesJsPath, fixesContent, 'utf8');
console.log('[UPDATED] js/fixes.js');

// 2. Update all HTML/PHP files to load /ko/js/... and add explicit gap: 26px to desktop nav
const targetFiles = [
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
  '_not-found.html'
];

targetFiles.forEach(rel => {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) return;

  let c = fs.readFileSync(p, 'utf8');

  // Fix script src="/js/ -> src="/ko/js/
  c = c.replace(/src="\/js\//g, 'src="/ko/js/');
  c = c.replace(/src='\/js\//g, "src='/ko/js/");

  // Fix desktop nav clutter by ensuring style="display: flex; align-items: center; gap: 26px;"
  // Matches <div class="hidden md:flex items-center"> or similar
  c = c.replace(
    /(<div class="[^"]*hidden md:flex items-center[^"]*")(?!\s+style=)/g,
    '$1 style="display: flex; align-items: center; gap: 26px;"'
  );
  c = c.replace(
    /(<div class="[^"]*hidden md:flex items-center[^"]*")\s+style="([^"]*)"/g,
    (m, div, st) => {
      let updatedSt = st;
      if (!updatedSt.includes('display:')) updatedSt += '; display: flex';
      if (!updatedSt.includes('align-items:')) updatedSt += '; align-items: center';
      if (!updatedSt.includes('gap:')) updatedSt += '; gap: 26px';
      return `${div} style="${updatedSt.replace(/^;\s*/, '')}"`;
    }
  );

  // Ensure fixes.js query version is 7.0.0
  c = c.replace(/fixes\.js(\?v=[^"'\s>]*)?/g, 'fixes.js?v=7.0.0');

  fs.writeFileSync(p, c, 'utf8');
  console.log(`[UPDATED] ${rel}`);
});

// 3. Update billboard video in index.php to have both /ko/ and fallback sources
const indexPath = path.join(ROOT, 'index.php');
let indexC = fs.readFileSync(indexPath, 'utf8');
indexC = indexC.replace(
  /<source src="<\?= htmlspecialchars\(\$b\['mediaUrl'\]\) \?>" type="video\/mp4">/,
  `<?php 
    $mUrl = $b['mediaUrl'] ?? '';
    $koMUrl = (strpos($mUrl, '/') === 0 && strpos($mUrl, '/ko/') !== 0) ? '/ko' . $mUrl : $mUrl;
  ?>
  <source src="<?= htmlspecialchars($koMUrl) ?>" type="video/mp4">
  <source src="<?= htmlspecialchars($mUrl) ?>" type="video/mp4">`
);
fs.writeFileSync(indexPath, indexC, 'utf8');
console.log('[UPDATED] billboard video in index.php');

// 4. Update root .htaccess for njaccessportal.com to rewrite js/ to /ko/js/
const rootHtPath = path.join(__dirname, 'root_njaccessportal_htaccess');
let rootHt = fs.readFileSync(rootHtPath, 'utf8');
if (!rootHt.includes('RewriteRule ^js/')) {
  rootHt = rootHt.replace(
    /(# 2\. Forward legacy root asset\/API fallbacks to \/ko\/ if not found at root)/,
    `$1\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule ^js/(.*)$ /ko/js/$1 [L]\n`
  );
  fs.writeFileSync(rootHtPath, rootHt, 'utf8');
  console.log('[UPDATED] scripts/root_njaccessportal_htaccess');
}

console.log('\n=== All clutter fixes and senior mode restoration applied! ===');
