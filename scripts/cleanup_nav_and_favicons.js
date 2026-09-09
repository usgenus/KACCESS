const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const targetFiles = [
  'index.html',
  'index.php',
  'senior-care.html',
  'senior-care/index.html',
  'senior-care.php',
  'blog.php',
  'blog-post.php',
  'medicare.html',
  'medicare/index.html',
  'tool.html',
  'tool/index.html',
  'matcher.html',
  'calculator.html',
  'dictionary.html',
  'about.html',
  'about/index.html',
  '404.html',
  '_not-found.html'
];

for (const relPath of targetFiles) {
  const filePath = path.join(ROOT, relPath);
  if (!fs.existsSync(filePath)) {
    console.warn(`[SKIP] File not found: ${relPath}`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Remove inline mobile menu script
  const inlineScriptRegex = /\s*<script>\s*\/\/\s*1\.\s*Mobile Menu Toggle\s*\(function\(\)\s*\{[\s\S]*?\}\)\(\);\s*<\/script>/g;
  if (inlineScriptRegex.test(content)) {
    content = content.replace(inlineScriptRegex, '');
    changed = true;
    console.log(`[${relPath}] Removed inline mobile menu script (pattern 1)`);
  }

  const inlineScriptRegex2 = /\s*<script>\s*\(function\(\)\s*\{\s*var btn = document\.getElementById\('mobile-menu-btn'\);[\s\S]*?\}\)\(\);\s*<\/script>/g;
  if (inlineScriptRegex2.test(content)) {
    content = content.replace(inlineScriptRegex2, '');
    changed = true;
    console.log(`[${relPath}] Removed inline mobile menu script (pattern 2)`);
  }

  // Also remove if inside another script tag as block
  const inlineBlockRegex = /\s*\/\/\s*1\.\s*Mobile Menu Toggle\s*\(function\(\)\s*\{\s*var btn = document\.getElementById\('mobile-menu-btn'\);[\s\S]*?\}\)\(\);/g;
  if (inlineBlockRegex.test(content)) {
    content = content.replace(inlineBlockRegex, '');
    changed = true;
    console.log(`[${relPath}] Removed inline mobile menu block`);
  }

  // 2. Remove style="display: flex; align-items: center; gap: 26px;" on hidden md:flex
  const styleDisplayFlexRegex = /(<div class="[^"]*hidden md:flex[^"]*")\s+style="display:\s*flex;\s*align-items:\s*center;\s*gap:\s*26px;"/g;
  if (styleDisplayFlexRegex.test(content)) {
    content = content.replace(styleDisplayFlexRegex, '$1');
    changed = true;
    console.log(`[${relPath}] Removed inline display:flex from desktop nav`);
  }

  // 3. Ensure id="mobile-menu-btn" on hamburger button
  const menuBtnRegex = /<button(?![^>]*id=["']mobile-menu-btn["'])([^>]*class="[^"]*md:hidden[^"]*"[^>]*aria-label="Menu"[^>]*)>/g;
  if (menuBtnRegex.test(content)) {
    content = content.replace(menuBtnRegex, '<button id="mobile-menu-btn"$1>');
    changed = true;
    console.log(`[${relPath}] Added id="mobile-menu-btn" to hamburger button`);
  }

  // 4. Ensure fixes.js is loaded
  if (!content.includes('/js/fixes.js')) {
    content = content.replace('</body>', '  <script src="/js/fixes.js?v=4.1.0"></script>\n</body>');
    changed = true;
    console.log(`[${relPath}] Added fixes.js`);
  } else {
    // Update query version to 4.1.0
    content = content.replace(/\/js\/fixes\.js(\?v=[^"'\s>]*)?/g, '/js/fixes.js?v=4.1.0');
    changed = true;
  }

  // 5. Cache bust favicons with ?v=2
  content = content.replace(/href="\/favicon\.svg(\?v=[^"'\s>]*)?"/g, 'href="/favicon.svg?v=2"');
  content = content.replace(/href="\/favicon\.ico(\?v=[^"'\s>]*)?"/g, 'href="/favicon.ico?v=2"');
  content = content.replace(/href="\/apple-touch-icon\.png(\?v=[^"'\s>]*)?"/g, 'href="/apple-touch-icon.png?v=2"');
  content = content.replace(/href="\/favicon-192\.png(\?v=[^"'\s>]*)?"/g, 'href="/favicon-192.png?v=2"');
  content = content.replace(/href="\/favicon-512\.png(\?v=[^"'\s>]*)?"/g, 'href="/favicon-512.png?v=2"');

  // Ensure favicon.svg is present in head if not yet there
  if (!content.includes('favicon.svg')) {
    content = content.replace(
      /(<link[^>]*rel="icon"[^>]*>)/i,
      '  <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />\n$1'
    );
    changed = true;
    console.log(`[${relPath}] Added favicon.svg link`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[DONE] Processed ${relPath}`);
}
