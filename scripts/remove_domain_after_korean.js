const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const targetExtensions = ['.php', '.html', '.js'];
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
console.log(`Found ${allFiles.length} files to check.`);

let modified = 0;
allFiles.forEach(file => {
  const relPath = path.relative(ROOT_DIR, file);
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace 뉴저지 한인 의료접근포털 with 뉴저지 한인 의료접근포털
  content = content.replace(/뉴저지 한인 의료접근포털\s*·\s*njaccessportal\.com/g, '뉴저지 한인 의료접근포털');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    modified++;
    console.log(`[UPDATED] ${relPath}`);
  }
});

console.log(`Finished: ${modified} files updated.`);
