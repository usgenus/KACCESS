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
      <!-- 홈 (Direct) -->
      <a href="/" class="flex items-center justify-between py-2.5 px-3 text-[15px] ${isHome ? 'font-bold text-brand-blue bg-blue-50/50' : 'font-semibold text-slate-800 hover:text-brand-blue'} hover:bg-slate-50/80 rounded-xl transition-colors border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span>홈 (Home)</span>
        </div>
        <span class="text-xs font-normal text-slate-400">메인</span>
      </a>

      <!-- 아코디언 1: 시니어 케어 -->
      <div class="mobile-accordion-group border-b border-slate-100">
        <button type="button" class="mobile-accordion-btn flex items-center justify-between w-full py-2.5 px-3 text-[15px] font-bold ${isSenior ? 'text-brand-blue' : 'text-slate-800'} hover:text-brand-blue hover:bg-slate-50/80 rounded-xl transition-colors text-left cursor-pointer" data-target="m-acc-senior">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            <span>시니어 케어</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue font-semibold">재활·요양</span>
          </div>
          <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 mobile-acc-chevron ${isSenior ? 'rotate-180' : ''}" style="${isSenior ? 'transform: rotate(180deg);' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="m-acc-senior" class="mobile-accordion-panel ${isSenior ? '' : 'hidden'} bg-slate-50/80 rounded-xl p-2 my-1 border border-slate-100 flex flex-col gap-1">
          <a href="/senior-care" class="flex items-center gap-2 py-2 px-3 text-sm font-bold text-brand-blue hover:bg-white rounded-lg transition-colors">
            <span class="text-xs">▶</span> 시니어 케어 센터 소개
          </a>
          <a href="/senior-care#rehab" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
            <span class="text-slate-400 text-xs">•</span> 단기 집중 재활 &amp; 물리치료
          </a>
          <a href="/senior-care#ltc" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
            <span class="text-slate-400 text-xs">•</span> 24시간 장기 요양 간호 (LTC)
          </a>
          <a href="/senior-care#clinical" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
            <span class="text-slate-400 text-xs">•</span> 전문 임상 케어 프로그램
          </a>
          <a href="/senior-care#inquiry" class="flex items-center gap-2 py-2 px-3 text-sm font-medium text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/70 rounded-lg transition-colors mt-0.5">
            <span>💬</span> 1:1 입소 상담 및 투어 문의
          </a>
        </div>
      </div>

      <!-- 아코디언 2: 뉴스 & 의학 칼럼 -->
      <div class="mobile-accordion-group border-b border-slate-100">
        <button type="button" class="mobile-accordion-btn flex items-center justify-between w-full py-2.5 px-3 text-[15px] font-bold ${isBlog ? 'text-brand-blue' : 'text-slate-800'} hover:text-brand-blue hover:bg-slate-50/80 rounded-xl transition-colors text-left cursor-pointer" data-target="m-acc-news">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
            <span>뉴스 &amp; 의학 칼럼</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold">최신 소식</span>
          </div>
          <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 mobile-acc-chevron ${isBlog ? 'rotate-180' : ''}" style="${isBlog ? 'transform: rotate(180deg);' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="m-acc-news" class="mobile-accordion-panel ${isBlog ? '' : 'hidden'} bg-slate-50/80 rounded-xl p-2 my-1 border border-slate-100 flex flex-col gap-1">
          <a href="/blog" class="flex items-center gap-2 py-2 px-3 text-sm font-bold text-brand-blue hover:bg-white rounded-lg transition-colors">
            <span class="text-xs">▶</span> 건강 뉴스 전체보기
          </a>
          <a href="/blog#columns" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
            <span class="text-slate-400 text-xs">•</span> 전문의 건강 칼럼
          </a>
          <a href="/blog#recalls" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
            <span class="text-slate-400 text-xs">•</span> FDA 안전 경보 &amp; 리콜
          </a>
        </div>
      </div>

      <!-- 아코디언 3: 메디케어 & ACA -->
      <div class="mobile-accordion-group border-b border-slate-100">
        <button type="button" class="mobile-accordion-btn flex items-center justify-between w-full py-2.5 px-3 text-[15px] font-bold ${isMedicare ? 'text-brand-blue' : 'text-slate-800'} hover:text-brand-blue hover:bg-slate-50/80 rounded-xl transition-colors text-left cursor-pointer" data-target="m-acc-medicare">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            <span>메디케어 &amp; ACA</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold">보험 가이드</span>
          </div>
          <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 mobile-acc-chevron ${isMedicare ? 'rotate-180' : ''}" style="${isMedicare ? 'transform: rotate(180deg);' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="m-acc-medicare" class="mobile-accordion-panel ${isMedicare ? '' : 'hidden'} bg-slate-50/80 rounded-xl p-2 my-1 border border-slate-100 flex flex-col gap-1">
          <a href="/medicare" class="flex items-center gap-2 py-2 px-3 text-sm font-bold text-brand-blue hover:bg-white rounded-lg transition-colors">
            <span class="text-xs">▶</span> 메디케어 &amp; ACA 홈
          </a>
          <a href="/medicare#medicare-types" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
            <span class="text-slate-400 text-xs">•</span> 메디케어 파트 A·B·C·D 완벽 정리
          </a>
          <a href="/medicare#aca-types" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
            <span class="text-slate-400 text-xs">•</span> ACA 오바마케어 안내
          </a>
          <a href="/medicare#faq" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
            <span class="text-slate-400 text-xs">•</span> 자주 묻는 질문 (FAQ)
          </a>
        </div>
      </div>

      <!-- 아코디언 4: 환자도우미 스마트 도구 -->
      <div class="mobile-accordion-group border-b border-slate-100">
        <button type="button" class="mobile-accordion-btn flex items-center justify-between w-full py-2.5 px-3 text-[15px] font-bold ${isTool ? 'text-brand-blue' : 'text-slate-800'} hover:text-brand-blue hover:bg-slate-50/80 rounded-xl transition-colors text-left cursor-pointer" data-target="m-acc-tool">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span>환자도우미</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold">스마트 도구</span>
          </div>
          <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 mobile-acc-chevron ${isTool ? 'rotate-180' : ''}" style="${isTool ? 'transform: rotate(180deg);' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="m-acc-tool" class="mobile-accordion-panel ${isTool ? '' : 'hidden'} bg-slate-50/80 rounded-xl p-2 my-1 border border-slate-100 flex flex-col gap-1">
          <a href="/tool" class="flex items-center gap-2 py-2 px-3 text-sm font-bold text-brand-blue hover:bg-white rounded-lg transition-colors">
            <span class="text-xs">▶</span> 환자도우미 허브 홈
          </a>
          <a href="/matcher" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
            <span class="text-slate-400 text-xs">•</span> 스마트 보험 자격 진단기
          </a>
          <a href="/calculator" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
            <span class="text-slate-400 text-xs">•</span> 건강보험료 보조금 계산기
          </a>
          <a href="/dictionary" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
            <span class="text-slate-400 text-xs">•</span> 영-한 의학 용어 사전
          </a>
        </div>
      </div>

      <!-- 아코디언 5: 센터 소개 -->
      <div class="mobile-accordion-group border-b border-slate-100">
        <button type="button" class="mobile-accordion-btn flex items-center justify-between w-full py-2.5 px-3 text-[15px] font-bold ${isAbout ? 'text-brand-blue' : 'text-slate-800'} hover:text-brand-blue hover:bg-slate-50/80 rounded-xl transition-colors text-left cursor-pointer" data-target="m-acc-about">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>센터 소개</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">About</span>
          </div>
          <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 mobile-acc-chevron ${isAbout ? 'rotate-180' : ''}" style="${isAbout ? 'transform: rotate(180deg);' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="m-acc-about" class="mobile-accordion-panel ${isAbout ? '' : 'hidden'} bg-slate-50/80 rounded-xl p-2 my-1 border border-slate-100 flex flex-col gap-1">
          <a href="/about" class="flex items-center gap-2 py-2 px-3 text-sm font-bold text-brand-blue hover:bg-white rounded-lg transition-colors">
            <span class="text-xs">▶</span> 센터 소개 및 미션
          </a>
          <a href="/about#contact" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
            <span class="text-slate-400 text-xs">•</span> 찾아오시는 길 &amp; 상담 문의
          </a>
        </div>
      </div>

      <!-- 하단 CTA: 카카오톡 1:1 상담 및 전화 연결 -->
      <div class="pt-3 pb-3 flex flex-col gap-2">
        <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-3.5 bg-[#FEE500] hover:bg-[#FDD835] active:bg-[#FBC02D] text-[#191919] rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer">
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
updateFileDropdown(path.join(__dirname, '../senior-care.php'), 'senior-care');
updateFileDropdown(path.join(__dirname, '../senior-care.html'), 'senior-care');
updateFileDropdown(path.join(__dirname, '../medicare.html'), 'medicare');
updateFileDropdown(path.join(__dirname, '../medicare/index.html'), 'medicare');
updateFileDropdown(path.join(__dirname, '../about.html'), 'about');
updateFileDropdown(path.join(__dirname, '../about/index.html'), 'about');

// 2. Handle blog-post.php specially
const blogPostPath = path.join(__dirname, '../blog-post.php');
if (fs.existsSync(blogPostPath)) {
  let bp = fs.readFileSync(blogPostPath, 'utf8');
  // Add mobile-menu-btn and dropdown if missing
  if (!bp.includes('mobile-menu-btn')) {
    const target = `<div class="flex items-center gap-3">
          <a href="/admin" class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">CMS 관리자</a>
        </div>
      </div>
    </div>
  </nav>`;

    const replacement = `<div class="flex items-center gap-3">
          <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer" title="카카오톡 1:1 상담 바로가기"><img src="/kakaotalk-icon.png" alt="KakaoTalk" class="w-6 h-6 rounded-md shrink-0 object-contain shadow-xs" /><span class="text-xs sm:text-sm font-bold text-slate-800 hover:text-brand-blue tracking-tight whitespace-nowrap">1:1 상담</span></a>
          <button id="mobile-menu-btn" class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Menu">
            <div class="w-5 h-4 flex flex-col justify-between">
              <span class="block h-0.5 bg-brand-dark rounded-full"></span>
              <span class="block h-0.5 bg-brand-dark rounded-full"></span>
              <span class="block h-0.5 bg-brand-dark rounded-full"></span>
            </div>
          </button>
        </div>
      </div>
    </div>
${getAccordionHTML('blog')}
  </nav>`;

    if (bp.includes(target)) {
      bp = bp.replace(target, replacement);
      fs.writeFileSync(blogPostPath, bp, 'utf8');
      console.log(`Successfully added mobile accordion menu to blog-post.php`);
    }
  }
}

console.log('Finished updating files with accordion menu.');
