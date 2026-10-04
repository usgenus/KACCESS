const fs = require('fs');
const path = require('path');

const rootDir = '/Users/ejyoon/Desktop/KACCESS';

const files = [
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
  'ko/index.html',
  'ko/blog-post.php',
  'ko/forum/components.php',
  'js/fixes.js'
];

files.forEach(rel => {
  const full = path.join(rootDir, rel);
  if (!fs.existsSync(full)) return;
  let text = fs.readFileSync(full, 'utf8');
  let updated = text.replace(/의료 복지 및 시니어 케어 실시간 문의/g, '의료 복지 및 건강 상담 실시간 문의');
  updated = updated.replace(/,\s*시니어 케어를 제공하는/g, '를 제공하는');
  if (updated !== text) {
    fs.writeFileSync(full, updated, 'utf8');
    console.log(`Updated ${rel}`);
  }
});
