const fs = require('fs');
const path = require('path');

function getAccordionHTML(activePage) {
  const isHome = activePage === 'home';
  const isSenior = activePage === 'senior-care';
  const isBlog = activePage === 'blog';
  const isMedicare = activePage === 'medicare';
  const isTool = activePage === 'tool';
  const isAbout = activePage === 'about';

  return `    <div id="mobile-menu-dropdown" class="md:hidden overflow-hidden transition-all duration-300 max-h-0 opacity-0 bg-white/98 backdrop-blur-md border-t border-brand-border px-4 py-3 flex flex-col gap-1" style="-webkit-overflow-scrolling: touch;">
      <!-- 1. 홈 -->
      <a href="/" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 ${isHome ? 'font-bold text-brand-blue bg-blue-50/70' : 'font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50'}">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 ${isHome ? 'text-brand-blue' : 'text-slate-400'} shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span class="text-[15px]">홈</span>
        </div>
        <svg class="w-4 h-4 ${isHome ? 'text-brand-blue' : 'text-slate-300'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 2. 뉴스 -->
      <a href="/blog" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 ${isBlog ? 'font-bold text-brand-blue bg-blue-50/70' : 'font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50'}">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 ${isBlog ? 'text-brand-blue' : 'text-slate-400'} shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
          <span class="text-[15px]">뉴스</span>
        </div>
        <svg class="w-4 h-4 ${isBlog ? 'text-brand-blue' : 'text-slate-300'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 3. 시니어 케어 -->
      <a href="/senior-care" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 ${isSenior ? 'font-bold text-brand-blue bg-blue-50/70' : 'font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50'}">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 ${isSenior ? 'text-brand-blue' : 'text-slate-400'} shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          <span class="text-[15px]">시니어 케어</span>
        </div>
        <svg class="w-4 h-4 ${isSenior ? 'text-brand-blue' : 'text-slate-300'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 4. 메디케어 & ACA -->
      <a href="/medicare" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 ${isMedicare ? 'font-bold text-brand-blue bg-blue-50/70' : 'font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50'}">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 ${isMedicare ? 'text-brand-blue' : 'text-slate-400'} shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          <span class="text-[15px]">메디케어 &amp; ACA</span>
        </div>
        <svg class="w-4 h-4 ${isMedicare ? 'text-brand-blue' : 'text-slate-300'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 5. 환자도우미 -->
      <a href="/tool" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 ${isTool ? 'font-bold text-brand-blue bg-blue-50/70' : 'font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50'}">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 ${isTool ? 'text-brand-blue' : 'text-slate-400'} shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span class="text-[15px]">환자도우미</span>
        </div>
        <svg class="w-4 h-4 ${isTool ? 'text-brand-blue' : 'text-slate-300'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 6. 소개 -->
      <a href="/about" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 ${isAbout ? 'font-bold text-brand-blue bg-blue-50/70' : 'font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50'}">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 ${isAbout ? 'text-brand-blue' : 'text-slate-400'} shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span class="text-[15px]">소개</span>
        </div>
        <svg class="w-4 h-4 ${isAbout ? 'text-brand-blue' : 'text-slate-300'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 카카오톡 1:1 상담 바로가기 -->
      <div class="pt-2 pb-1">
        <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-3.5 bg-[#FEE500] hover:bg-[#FDD835] active:bg-[#FBC02D] text-[#191919] rounded-xl font-bold text-sm shadow-xs transition-all cursor-pointer">
          <div class="flex items-center gap-2.5">
            <img src="/kakaotalk-icon.png" alt="KakaoTalk" class="w-6 h-6 rounded-md shrink-0 object-contain shadow-xs" />
            <div class="flex flex-col text-left">
              <span class="text-sm font-bold leading-tight">카카오톡 1:1 상담 바로가기</span>
              <span class="text-[11px] font-medium text-black/70">의료 복지 및 시니어 케어 실시간 문의</span>
            </div>
          </div>
          <svg class="w-4 h-4 text-black/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </a>
      </div>
    </div>`;
}

function updateFileDropdown(filePath, activePage) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace existing mobile-menu-dropdown div
  const regex = /<div id="mobile-menu-dropdown"[\s\S]*?<\/div>(\s*<\/nav>)/;
  const newDropdown = getAccordionHTML(activePage);

  if (regex.test(content)) {
    content = content.replace(regex, newDropdown + '\n  </nav>');
    console.log(`Updated mobile-menu-dropdown in ${filePath}`);
  } else {
    // If about.html has class-based dropdown without id:
    const aboutRegex = /<div class="md:hidden overflow-hidden transition-all duration-300 max-h-0 opacity-0">[\s\S]*?<\/div>(\s*<\/nav>)/;
    if (aboutRegex.test(content)) {
      content = content.replace(aboutRegex, newDropdown + '\n  </nav>');
      console.log(`Updated mobile-menu-dropdown (about variant) in ${filePath}`);
    } else {
      console.warn(`Could not find mobile-menu-dropdown in ${filePath}`);
    }
  }

  // Ensure senior-care files load fixes.js
  if (filePath.includes('senior-care') && !content.includes('/js/fixes.js')) {
    content = content.replace('</body>', '  <script src="/js/fixes.js?v=2.3"></script>\n</body>');
    console.log(`Added fixes.js to ${filePath}`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

// 1. Update main pages
updateFileDropdown(path.join(__dirname, '../index.php'), 'home');
updateFileDropdown(path.join(__dirname, '../index.html'), 'home');
updateFileDropdown(path.join(__dirname, '../blog.php'), 'blog');
updateFileDropdown(path.join(__dirname, '../blog-post.php'), 'blog');
updateFileDropdown(path.join(__dirname, '../senior-care.php'), 'senior-care');
updateFileDropdown(path.join(__dirname, '../senior-care.html'), 'senior-care');
updateFileDropdown(path.join(__dirname, '../medicare.html'), 'medicare');
updateFileDropdown(path.join(__dirname, '../medicare/index.html'), 'medicare');
updateFileDropdown(path.join(__dirname, '../about.html'), 'about');
updateFileDropdown(path.join(__dirname, '../about/index.html'), 'about');

console.log('Finished updating files with flat desktop-matching mobile menu.');
