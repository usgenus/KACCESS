const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const targetExtensions = ['.php', '.html', '.js'];
const excludeDirs = ['node_modules', '.git', 'en']; // Keep en as is unless it has Korean text

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
console.log(`Checking ${allFiles.length} files...`);

let modified = 0;

allFiles.forEach(file => {
  const relPath = path.relative(ROOT_DIR, file);
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 1. In index.php: restore the full quote with (한인 커뮤니티센터)
  if (relPath === 'index.php') {
    content = content.replace(
      /NJ Access Portal \(뉴저지 한인 의료접근포털\): &quot;지역사회 커뮤니티 리소스와 전문 환자 내비게이션, 의료 리에종 지원 및 건강 정보 포털&quot;/g,
      '의료접근포탈: &quot;비영리기관(한인 커뮤니티센터)들의 의료관련 정보서비스의 한계를 넘어, 최고의 의료시스템 전문가들이 제공하는 언어와 문화의 장벽 없이, 분야별 최고 전문가가 함께하는 무료 프리미엄 의료 접근·네비게이션 서비스&quot;'
    );
  }

  // 2. Replace all instances of "비영리기관(한인 커뮤니티센터)들의" or "비영리 기관" in scrolling marquee
  content = content.replace(/비영리\s*기관들의/g, '비영리기관(한인 커뮤니티센터)들의');
  content = content.replace(/비영리기관(한인 커뮤니티센터)들의/g, '비영리기관(한인 커뮤니티센터)들의');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    modified++;
    console.log(`[UPDATED] ${relPath}`);
  }
});

console.log(`Updated scrolling message in ${modified} files.`);
