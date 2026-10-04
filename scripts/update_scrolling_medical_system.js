const fs = require('fs');
const path = require('path');

function walk(dir, files = []) {
  for (const item of fs.readdirSync(dir)) {
    if (item === 'node_modules' || item === '.git' || item.startsWith('.temp') || item === '.agents') continue;
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else if (/\.(php|html|js|txt)$/.test(item)) files.push(full);
  }
  return files;
}

const all = walk('/Users/ejyoon/Desktop/KACCESS');
let modifiedCount = 0;

for (const file of all) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('최고의 의료시스템 전문가들이')) {
    content = content.replace(/최고의 의료시스템 전문가들이/g, '최고의 의료시스템 전문가들이');
    changed = true;
  }

  if (file.endsWith('en/blog.php') && content.includes('비영리 기관들의')) {
    content = content.replace(/비영리 기관들의/g, '비영리기관(한인 커뮤니티센터)들의');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log('Updated:', file.replace('/Users/ejyoon/Desktop/KACCESS/', ''));
  }
}

console.log(`\nSuccessfully updated ${modifiedCount} files.`);
