const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const targetFiles = [
  'index.html',
  'medicare.html',
  'medicare/index.html',
  'tool.html',
  'tool/index.html',
  'about.html',
  'about/index.html',
  'senior-care.html',
  'senior-care/index.html',
  'calculator.html',
  'dictionary.html',
  'matcher.html',
  'blog.html',
  '404.html',
  '_not-found.html'
];

const desktopForumLink = `          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/forum">커뮤니티 포럼</a>`;

const mobileForumLink = `      <!-- 2.5. 커뮤니티 포럼 -->
      <a href="/forum" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>
          <span class="text-[15px]">커뮤니티 포럼</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>`;

const footerForumLink = `            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/forum">커뮤니티 포럼</a></li>`;

targetFiles.forEach(relPath => {
  const filePath = path.join(ROOT, relPath);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // 1. Desktop Nav: Add /forum right after /blog if not already present
  if (!content.includes('href="/forum"')) {
    // Pattern A: <a class="nav-link... href="/blog">뉴스</a>
    content = content.replace(/(<a class="nav-link[^>]*href="\/blog"[^>]*>뉴스<\/a>)/g, `$1\n${desktopForumLink}`);
    
    // Pattern B: mobile menu
    content = content.replace(/(<!-- 2\. 뉴스 -->[\s\S]*?<\/a>)/g, `$1\n\n${mobileForumLink}`);
    
    // Pattern C: footer
    content = content.replace(/(<li><a[^>]*href="\/blog"[^>]*>건강 뉴스<\/a><\/li>)/g, `$1\n${footerForumLink}`);

    updated = true;
  }

  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[UPDATED] Added Forum link to: ${relPath}`);
  }
});
