const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const targetExtensions = ['.php', '.html', '.js'];
const excludeDirs = ['node_modules', '.git', 'ko', 'en', 'engine'];

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

const files = scanDir(ROOT_DIR);
console.log(`Found ${files.length} candidate files to check`);

let totalModifications = 0;

files.forEach(filePath => {
  const relPath = path.relative(ROOT_DIR, filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace /ko/_next/ with /_next/
  content = content.replace(/(['"])\/ko\/_next\//g, '$1/_next/');
  
  // Replace /ko/js/ with /js/
  content = content.replace(/(['"])\/ko\/js\//g, '$1/js/');
  
  // Replace /ko/api/ with /api/
  content = content.replace(/(['"])\/ko\/api\//g, '$1/api/');
  
  // Replace /ko/uploads/ with /uploads/
  content = content.replace(/(['"])\/ko\/uploads\//g, '$1/uploads/');
  
  // Replace /ko/kakaotalk-icon.png with /kakaotalk-icon.png
  content = content.replace(/(['"])\/ko\/kakaotalk-icon\.png/g, '$1/kakaotalk-icon.png');
  content = content.replace(/(['"])\/ko\/kakao-icon\.png/g, '$1/kakao-icon.png');
  
  // Replace /ko/logo... with /logo...
  content = content.replace(/(['"])\/ko\/(logo[^'"]*)/g, '$1/$2');
  
  // Replace /ko/favicon... with /favicon...
  content = content.replace(/(['"])\/ko\/(favicon[^'"]*)/g, '$1/$2');
  content = content.replace(/(['"])\/ko\/apple-touch-icon\.png/g, '$1/apple-touch-icon.png');

  // Replace /ko/admin... with /admin...
  content = content.replace(/(['"])\/ko\/(admin2?)([\/'"?#])/g, '$1/$2$3');

  // Replace /ko/forum... with /forum...
  content = content.replace(/(['"])\/ko\/forum([\/'"?#])/g, '$1/forum$2');

  // Replace /ko/blog... with /blog...
  content = content.replace(/(['"])\/ko\/blog([\/'"?#])/g, '$1/blog$2');

  // Replace /ko/medicare, /ko/senior-care, /ko/about, /ko/tool, etc.
  content = content.replace(/(['"])\/ko\/(medicare|senior-care|tool|about|matcher|calculator|dictionary)([\/'"?#])/g, '$1/$2$3');

  // Replace /ko/ or /ko as links
  content = content.replace(/href="\/ko\/"/g, 'href="/"');
  content = content.replace(/href="\/ko"/g, 'href="/"');
  content = content.replace(/href='\/ko\/'/g, "href='/'");
  content = content.replace(/href='\/ko'/g, "href='/'");

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalModifications++;
    console.log(`[UPDATED] ${relPath}`);
  }
});

console.log(`Finished: ${totalModifications} files updated cleanly.`);
