const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const targetFiles = [
  'index.php',
  'blog.php',
  'blog.html',
  'blog-post.php',
  'senior-care.php',
  'senior-care.html',
  'senior-care/index.html',
  'medicare.html',
  'medicare/index.html',
  'tool.html',
  'tool/index.html',
  'about.html',
  'about/index.html',
  'calculator.html',
  'dictionary.html',
  'matcher.html',
  'the-health-bridge.html',
  'the-health-bridge/index.html',
  'forum/components.php',
  '404.html',
  '_not-found.html'
];

let updatedCount = 0;

for (const relPath of targetFiles) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  // ONLY replace 480px in njapNavKeySlide
  if (content.includes('480px')) {
    content = content.replace(/translate\(480px,\s*0\)/g, 'translate(335px, 0)');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('[UPDATED] ' + relPath);
    updatedCount++;
  } else {
    console.log('[NO CHANGE] ' + relPath);
  }
}

console.log('Updated ' + updatedCount + ' files to translate(335px, 0).');
