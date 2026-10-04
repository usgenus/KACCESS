const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const targetExtensions = ['.php', '.html', '.js', '.json', '.sql'];
const excludeDirs = ['node_modules', '.git'];

function scanDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      const base = path.basename(fullPath);
      if (!excludeDirs.includes(base)) {
        results = results.concat(scanDir(fullPath));
      }
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (targetExtensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const allFiles = scanDir(ROOT_DIR);
console.log(`Found ${allFiles.length} files to scan for brand transition.`);

let updatedCount = 0;

allFiles.forEach(filePath => {
  const relPath = path.relative(ROOT_DIR, filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  const isEn = relPath.startsWith('en/') || relPath.includes('_en.json');

  // 1. Nav Logo SVG Typography (Main Text)
  // Replace Healthcare Access Portal with NJ Access Portal in SVG main text
  content = content.replace(/(<g class="njap-nav-text-main">\s*<text[^>]*>)Healthcare Access Portal(<\/text>)/g,
    '$1NJ Access Portal$2');

  // 2. Nav Logo SVG Typography (Sub Text)
  if (isEn) {
    content = content.replace(/(<g class="njap-nav-text-sub">\s*<text[^>]*>)[^<]*(<\/text>)/g,
      '$1Community Resources &amp; Patient Navigation · njaccessportal.com$2');
  } else {
    content = content.replace(/(<g class="njap-nav-text-sub">\s*<text[^>]*>)[^<]*(<\/text>)/g,
      '$1뉴저지 한인 의료접근포털$2');
  }

  // 3. Brand titles & aria-labels on navbar brand link
  if (isEn) {
    content = content.replace(/title="NJ Access Portal · 뉴저지 한인 의료접근포털"/g, 'title="NJ Access Portal · Community Resources &amp; Patient Navigation"');
    content = content.replace(/aria-label="NJ Access Portal · 뉴저지 한인 의료접근포털"]*"/g, 'aria-label="NJ Access Portal · Community Resources &amp; Patient Navigation"');
  } else {
    content = content.replace(/title="NJ Access Portal · 뉴저지 한인 의료접근포털"/g, 'title="NJ Access Portal · 뉴저지 한인 의료접근포털"');
    content = content.replace(/aria-label="NJ Access Portal · 뉴저지 한인 의료접근포털"]*"/g, 'aria-label="NJ Access Portal · 뉴저지 한인 의료접근포털"');
  }

  // 4. Logo SVGs inner <title>
  if (isEn) {
    content = content.replace(/<title>Healthcare Access Portal[^<]*<\/title>/g,
      '<title>NJ Access Portal · Community Resources &amp; Patient Navigation</title>');
  } else {
    content = content.replace(/<title>Healthcare Access Portal[^<]*<\/title>/g,
      '<title>NJ Access Portal · 뉴저지 한인 의료접근포털</title>');
  }

  // 5. Footer copyright & Logo Alt text
  content = content.replace(/©\s*(?:<!-- -->)?\s*2026\s*(?:<!-- -->)?\s*Healthcare Access Portal/g,
    '© 2026 NJ Access Portal · 뉴저지 한인 의료접근센터');
  content = content.replace(/alt="NJ Access Portal · 뉴저지 한인 의료접근포털"/g,
    'alt="NJ Access Portal · 뉴저지 한인 의료접근포털"');
  content = content.replace(/alt="NJ Access Portal · Community Resources &amp; Healthcare Navigation"/g,
    'alt="NJ Access Portal · Community Resources &amp; Healthcare Navigation"');

  // 6. Meta OpenGraph & Site Name
  if (isEn) {
    content = content.replace(/property="og:site_name" content="[^"]*Healthcare Access[^"]*"/g,
      'property="og:site_name" content="NJ Access Portal · Community Resources &amp; Healthcare Navigation"');
  } else {
    content = content.replace(/property="og:site_name" content="[^"]*Healthcare Access[^"]*"/g,
      'property="og:site_name" content="NJ Access Portal · 뉴저지 한인 의료접근포털"');
  }

  // 7. General English Title transitions
  content = content.replace(/NJ Access Portal · njaccessportal.com/g, 'NJ Access Portal · njaccessportal.com');
  content = content.replace(/NJ Access Portal/g, 'NJ Access Portal');
  content = content.replace(/Healthcare Access Portal \(NJAP\)/g, 'NJ Access Portal');

  // 8. Specific Title Tags
  if (isEn) {
    content = content.replace(/\| NJ Access Portal · 뉴저지 한인 의료접근포털/g, '| NJ Access Portal');
    content = content.replace(/Healthcare Access Portal - /g, 'NJ Access Portal - ');
  } else {
    content = content.replace(/\| NJ Access Portal · 뉴저지 한인 의료접근포털/g, '| NJ Access Portal · 뉴저지 한인 의료접근포털');
    content = content.replace(/NJ Access Portal - 뉴저지 한인 의료접근포털/g, 'NJ Access Portal - 뉴저지 한인 의료접근포털');
  }

  // 9. Specific Admin / CMS Title
  content = content.replace(/NJ Access Portal — 메디컬 포럼 관리자 CMS/g,
    'NJ Access Portal — 메디컬 포럼 관리자 CMS');
  content = content.replace(/NJ Access Portal — 포털 콘텐츠 관리자 CMS/g,
    'NJ Access Portal — 포털 콘텐츠 관리자 CMS');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
    console.log(`[UPDATED] ${relPath}`);
  }
});

console.log(`Brand transition applied to ${updatedCount} files.`);
