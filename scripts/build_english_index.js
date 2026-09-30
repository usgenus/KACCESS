const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');
const srcPath = path.join(BASE_DIR, 'index.php');
const destPath = path.join(BASE_DIR, 'en', 'index.php');

let content = fs.readFileSync(srcPath, 'utf8');

// 1. Language definition & DB path fix
content = content.replace('<?php', "<?php\ndefine('SITE_LANG', 'en');");
content = content.replace("__DIR__ . '/api/db.php'", "__DIR__ . '/../api/db.php'");
content = content.replace("__DIR__ . '/api/forum_db.php'", "__DIR__ . '/../api/forum_db.php'");
content = content.replace('<html lang="ko"', '<html lang="en"');

// 2. Canonical and hreflang
const hreflang = `
  <link rel="canonical" href="https://njaccessportal.com/en/" />
  <link rel="alternate" hreflang="ko" href="https://njaccessportal.com/ko/" />
  <link rel="alternate" hreflang="en" href="https://njaccessportal.com/en/" />
  <link rel="alternate" hreflang="x-default" href="https://njaccessportal.com/ko/" />`;
content = content.replace(/<link rel="canonical"[^>]+>/, hreflang);

// 3. Meta Title & Description
content = content.replace(
  /<title>.*?<\/title>/,
  '<title>NJ Healthcare Access Center · Major Hospital Network &amp; Community Medical Navigation | NJAP</title>'
);
content = content.replace(
  '뉴저지 의료접근센터(NJ Healthcare Access Center) - 잉글우드 병원(Englewood Health), 홀리네임 병원(Holy Name Medical Center), 해켄색 메리디안 헬스(HUMC), 밸리 병원(The Valley Hospital), 파스카크 밸리(HMH), RWJBarnabas 등 뉴저지 주요 의료 기관 정보와 한인 환자 프로그램, 한국어 통역, 메디케어, ACA 건강보험, 자선진료(Charity Care) 지원 포털.',
  'NJ Healthcare Access Center - Comprehensive medical navigation, hospital networks (Englewood Health, Holy Name Medical Center, Hackensack Meridian Health, The Valley Hospital), Korean patient programs, Medicare, ACA health insurance, Charity Care, and free cancer screenings in New Jersey.'
);

// 4. Logo subtitle
content = content.replace(
  '<text x="64" y="44" font-family="Pretendard, -apple-system, system-ui, sans-serif" font-size="10.5" font-weight="600" fill="#64748B" letter-spacing="0.2">뉴저지 한인 의료 정보 포털 · NJAP</text>',
  '<text x="64" y="44" font-family="Pretendard, -apple-system, system-ui, sans-serif" font-size="10.5" font-weight="600" fill="#64748B" letter-spacing="0.2">NJ Healthcare Access Portal · NJAP</text>'
);

// 5. Desktop Nav Links
content = content.replace(
  /<div class="hidden md:flex items-center" style="display: flex; align-items: center; gap: 26px;">[\s\S]*?<\/div>\s*<div class="flex items-center gap-2 sm:gap-3">/,
  `<div class="hidden md:flex items-center" style="display: flex; align-items: center; gap: 26px;">
          <a class="nav-link pb-0.5 font-bold text-brand-blue cursor-pointer" href="/en/" onclick="navigateToHome(event); return false;">Home</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/en/blog">News</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/en/forum">Community Forum</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/en/senior-care">Senior Care</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/en/medicare">Medicare &amp; ACA</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/en/tool">Patient Tools</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/en/about">About</a>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">`
);

// Kakao button label and senior button
content = content.replace(
  '<span class="text-xs sm:text-sm font-bold text-slate-800 hover:text-brand-blue tracking-tight whitespace-nowrap">1:1 상담</span>',
  '<span class="text-xs sm:text-sm font-bold text-slate-800 hover:text-brand-blue tracking-tight whitespace-nowrap">1:1 Consultation</span>'
);
content = content.replace(
  '<span class="senior-btn-label">시니어모드+</span>',
  '<span class="senior-btn-label">Senior Mode+</span>'
);

// 6. Language Toggle Button on English page (shows KR, clicks to /ko/)
content = content.replace(
  /<button id="en-translate-btn"[\s\S]*?<\/button>/,
  `<button id="en-translate-btn" class="notranslate" translate="no" onclick="location.href='https://njaccessportal.com/ko/';" title="한국어 버전으로 이동 (Switch to Korean)" aria-label="Language Toggle" style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:999px;border:1.5px solid #2563eb;font-size:11px;font-weight:700;letter-spacing:0.08em;cursor:pointer;transition:all 0.2s ease;background:#2563eb;color:#ffffff;white-space:nowrap;flex-shrink:0;line-height:1.4;"><span class="notranslate" translate="no">🌐</span> <span class="notranslate en-btn-label" translate="no">KR</span></button>`
);

// 7. Mobile Menu Dropdown
content = content.replace(
  /<div id="mobile-menu-dropdown"[\s\S]*?<\/nav>/,
  `<div id="mobile-menu-dropdown" class="md:hidden overflow-hidden transition-all duration-300 max-h-0 opacity-0 bg-white/98 backdrop-blur-md border-t border-brand-border px-4 py-3 flex flex-col gap-1" style="-webkit-overflow-scrolling: touch;">
      <!-- Language Switcher in Mobile Menu -->
      <div class="flex items-center justify-between py-2.5 px-3.5 mb-1.5 rounded-xl bg-blue-50/60 border border-blue-100">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-slate-700">Language / 언어</span>
        </div>
        <button type="button" class="notranslate" translate="no" onclick="location.href='https://njaccessportal.com/ko/';" style="padding:4px 12px;font-size:12px;font-weight:700;border-radius:999px;border:1.5px solid #2563eb;background:#2563eb;color:#ffffff;display:inline-flex;align-items:center;gap:4px;cursor:pointer;">
          <span>🌐</span> <span>한국어 (KR)</span>
        </button>
      </div>

      <!-- Senior Mode in Mobile Menu -->
      <div class="flex items-center justify-between py-2.5 px-3.5 mb-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-slate-700">Display Font Size</span>
        </div>
        <button type="button" class="senior-mode-btn notranslate" translate="no" onclick="window.cycleSeniorMode && window.cycleSeniorMode()" style="padding:4px 10px;font-size:12px;">
          <span class="senior-btn-label">Senior Mode+</span>
          <span class="senior-step-badge" style="display:none;"></span>
        </button>
      </div>

      <!-- 1. Home -->
      <a href="/en/" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-bold text-brand-blue bg-blue-50/70">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span class="text-[15px]">Home</span>
        </div>
        <svg class="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 2. News -->
      <a href="/en/blog" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
          <span class="text-[15px]">News</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 2.5 Community Forum -->
      <a href="/en/forum" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>
          <span class="text-[15px]">Community Forum</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 3. Senior Care -->
      <a href="/en/senior-care" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          <span class="text-[15px]">Senior Care</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 4. Medicare & ACA -->
      <a href="/en/medicare" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          <span class="text-[15px]">Medicare &amp; ACA</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 5. Patient Tools -->
      <a href="/en/tool" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span class="text-[15px]">Patient Tools</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 6. About -->
      <a href="/en/about" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span class="text-[15px]">About</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- KakaoTalk Consultation CTA -->
      <div class="pt-2 pb-1">
        <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-3.5 bg-[#FEE500] hover:bg-[#FDD835] active:bg-[#FBC02D] text-[#191919] rounded-xl font-bold text-sm shadow-xs transition-all cursor-pointer">
          <div class="flex items-center gap-2.5">
            <img src="/ko/kakaotalk-icon.png" alt="KakaoTalk" class="w-6 h-6 rounded-md shrink-0 object-contain shadow-xs" />
            <div class="flex flex-col text-left">
              <span class="text-sm font-bold leading-tight">1:1 Consultation (KakaoTalk)</span>
              <span class="text-[11px] font-medium text-black/70">Healthcare Navigation &amp; Senior Care Support</span>
            </div>
          </div>
          <svg class="w-4 h-4 text-black/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  </nav>`
);

// 8. Replace /ko/ paths with /en/ paths across all internal links
content = content.replaceAll('href="/ko/"', 'href="/en/"');
content = content.replaceAll('href="/ko"', 'href="/en/"');
content = content.replaceAll('/ko/blog', '/en/blog');
content = content.replaceAll('/ko/forum', '/en/forum');
content = content.replaceAll('/ko/senior-care', '/en/senior-care');
content = content.replaceAll('/ko/medicare', '/en/medicare');
content = content.replaceAll('/ko/tool', '/en/tool');
content = content.replaceAll('/ko/about', '/en/about');
content = content.replaceAll('/ko/calculator', '/en/calculator');
content = content.replaceAll('/ko/dictionary', '/en/dictionary');
content = content.replaceAll('/ko/matcher', '/en/matcher');

// 9. Billboard & Live Updates
content = content.replaceAll("htmlspecialchars($b['linkText'] ?? '자세히 보기')", "htmlspecialchars($b['linkText'] ?? 'Learn more')");
content = content.replaceAll("htmlspecialchars($b2['linkText'] ?? '자세히 보기')", "htmlspecialchars($b2['linkText'] ?? 'Learn more')");
content = content.replace('>전체 뉴스 →<', '>All News →<');

// 10. News section texts
content = content.replace("htmlspecialchars($topStory['category'] ?: '주요 뉴스')", "htmlspecialchars($topStory['category'] ?: 'Top Story')");
content = content.replace('<p class="text-xs text-gray-400 mb-2 font-sans font-medium">특별 기획:', '<p class="text-xs text-gray-400 mb-2 font-sans font-medium">Special Feature:');
content = content.replace('<p class="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 whitespace-nowrap">핵심 요약</p>', '<p class="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 whitespace-nowrap">Key Takeaways</p>');
content = content.replace("htmlspecialchars($topStory['author'] ?? '편집부')", "htmlspecialchars($topStory['author'] ?? 'Editorial Desk')");
content = content.replace("<h2 class=\"font-black text-sm sm:text-base text-black uppercase tracking-wider whitespace-nowrap\">\n                    주요 뉴스\n                  </h2>", "<h2 class=\"font-black text-sm sm:text-base text-black uppercase tracking-wider whitespace-nowrap\">\n                    Top News\n                  </h2>");
content = content.replace("<h2 class=\"font-black text-sm sm:text-base text-black uppercase tracking-wider whitespace-nowrap\">\n                    의료칼럼\n                  </h2>", "<h2 class=\"font-black text-sm sm:text-base text-black uppercase tracking-wider whitespace-nowrap\">\n                    Doctor Columns\n                  </h2>");

// 11. Recalls section
content = content.replace('>리콜(Recalls and Food Safety)<', '>FDA Recalls &amp; Food Safety Alerts<');
content = content.replace('>전체보기 →<', '>View All Alerts →<');

// 12. Medical Forum Section
content = content.replaceAll('전문의 건강 Q&A 포럼', 'Specialist Health Q&A Forum');
content = content.replaceAll('질문하기', 'Ask Question');
content = content.replaceAll('포럼 바로가기', 'Visit Forum');

// 13. One-stop Coverage & Patient Services
content = content.replace(
  '<h2 class="font-extrabold text-3xl sm:text-4xl text-white mb-3">원스톱 의료 접근 &amp; 환자 종합 센터</h2>',
  '<h2 class="font-extrabold text-3xl sm:text-4xl text-white mb-3">One-Stop Healthcare Access &amp; Patient Center</h2>'
);
content = content.replace(
  '<p class="text-white/70 text-sm sm:text-base leading-relaxed">보험 자격 진단부터 병원 사전접수, 의학 용어 사전 및 의료비 지원 신청까지 한곳에서 이용하실 수 있습니다.</p>',
  '<p class="text-white/70 text-sm sm:text-base leading-relaxed">From health insurance eligibility screening to hospital pre-registration, medical dictionary, and medical bill relief — all in one unified center.</p>'
);

// Card 1: Matcher
content = content.replace('<h3 class="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">메디케어 &amp; ACA 자격 진단</h3>', '<h3 class="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">Medicare &amp; ACA Eligibility Matcher</h3>');
content = content.replace('<p class="text-xs text-white/60 leading-relaxed mb-4">나이, 소득, 신분 상태에 따른 맞춤형 건강보험 혜택 및 보조금을 즉시 진단하세요.</p>', '<p class="text-xs text-white/60 leading-relaxed mb-4">Instantly evaluate customized health insurance options and subsidies based on age, income, and immigration status.</p>');

// Card 2: Calculator
content = content.replace('<h3 class="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">ACA 보험료 보조금 계산기</h3>', '<h3 class="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">ACA Subsidy &amp; Premium Calculator</h3>');
content = content.replace('<p class="text-xs text-white/60 leading-relaxed mb-4">가족 수와 연 소득을 기반으로 지원받을 수 있는 세액 공제 보조금액을 산출합니다.</p>', '<p class="text-xs text-white/60 leading-relaxed mb-4">Estimate your qualifying federal and state premium tax credits based on household size and annual income.</p>');

// Card 3: Dictionary
content = content.replace('<h3 class="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">영-한 의학 용어 사전</h3>', '<h3 class="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">English-Korean Medical Dictionary</h3>');
content = content.replace('<p class="text-xs text-white/60 leading-relaxed mb-4">미국 병원 진료실에서 자주 쓰는 필수 영문 의학 표현과 한국어 해설 모음.</p>', '<p class="text-xs text-white/60 leading-relaxed mb-4">Essential clinical vocabulary and medical expressions commonly used in US healthcare settings with explanations.</p>');

// Card 4: Tool
content = content.replace('<h3 class="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">스마트 환자 서비스 &amp; 사전접수</h3>', '<h3 class="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">Smart Patient Services &amp; Pre-Registration</h3>');
content = content.replace('<p class="text-xs text-white/60 leading-relaxed mb-4">병원 사전접수 차트 작성, 피검사 입력 및 의료비 탕감 지원 신청을 한곳에서 제공합니다.</p>', '<p class="text-xs text-white/60 leading-relaxed mb-4">Complete pre-registration forms, track blood test results, and apply for Charity Care hospital bill assistance.</p>');

content = content.replaceAll('서비스 바로가기 →', 'Explore Service →');

// 14. Section 7: NJ Healthcare Access Center Overview
content = content.replace(
  '<h2 class="font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight mb-3">\n              뉴저지 의료접근센터 · 의료접근포털\n            </h2>',
  '<h2 class="font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight mb-3">\n              New Jersey Healthcare Access Center &amp; Portal\n            </h2>'
);
content = content.replace(
  '<p class="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">\n              언어와 문화의 장벽 없이, 뉴저지 한인 동포 누구나 최적의 공공 의료 혜택과 건강보험, 병원 진료에 접근할 수 있도록 돕는 종합 건강 네비게이션 포털입니다.\n            </p>',
  '<p class="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">\n              A comprehensive health navigation portal dedicated to ensuring that everyone in New Jersey can access essential public medical benefits, health insurance, and hospital care without language or cultural barriers.\n            </p>'
);

// Mission card
content = content.replace('<span class="text-xs font-semibold text-slate-400">의료 접근성 지원</span>', '<span class="text-xs font-semibold text-slate-400">Healthcare Access Support</span>');
content = content.replace('<h3 class="font-black text-xl text-slate-900 mb-3 tracking-tight group-hover:text-brand-blue transition-colors">우리의 미션 (Our Mission)</h3>', '<h3 class="font-black text-xl text-slate-900 mb-3 tracking-tight group-hover:text-brand-blue transition-colors">Our Mission</h3>');
content = content.replace(
  '복잡하고 어려운 미국 의료 시스템 속에서 한인 동포들이 필수적인 의료 자원에 원활히 도달하도록 전문 네비게이션을 제공합니다. 의사 예약, 병원 진료, 필수 의약품 처방은 물론 적합한 공공 보험 및 정부 보조 혜택 가입까지 한국어로 1:1 지원합니다.',
  'We provide professional navigation to help community members reach essential healthcare resources in the complex US medical system. We offer 1:1 bilingual assistance for doctor appointments, hospital visits, prescriptions, and enrollment in public insurance and government assistance programs.'
);
content = content.replace('<span class="px-3 py-1.5 rounded-lg bg-blue-50/90 text-brand-blue border border-blue-100/90">전문 의료진 연계</span>', '<span class="px-3 py-1.5 rounded-lg bg-blue-50/90 text-brand-blue border border-blue-100/90">Specialist Connections</span>');
content = content.replace('<span class="px-3 py-1.5 rounded-lg bg-blue-50/90 text-brand-blue border border-blue-100/90">한국어 통역 및 서류 지원</span>', '<span class="px-3 py-1.5 rounded-lg bg-blue-50/90 text-brand-blue border border-blue-100/90">Bilingual Support &amp; Paperwork</span>');
content = content.replace('<span class="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100">100% 무료 상담</span>', '<span class="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100">100% Free Consultation</span>');

// Who we help card
content = content.replace('<span class="text-xs font-semibold text-slate-400">지원 대상 및 권리</span>', '<span class="text-xs font-semibold text-slate-400">Eligibility &amp; Rights</span>');
content = content.replace('<h3 class="font-black text-xl text-slate-900 mb-3 tracking-tight group-hover:text-amber-800 transition-colors">우리가 지원하는 분들 (Who We Help)</h3>', '<h3 class="font-black text-xl text-slate-900 mb-3 tracking-tight group-hover:text-amber-800 transition-colors">Who We Help</h3>');
content = content.replace(
  '뉴저지 의료접근센터는 연령, 재정 상태, 이민 및 체류 신분(<strong class="text-amber-900 font-bold bg-amber-100/90 px-2 py-0.5 rounded-md inline-block">미등록 체류자 및 서류미비자 포함</strong>) 또는 기존 보험 유무와 상관없이 의료 지원이 필요한 모든 한인 주민에게 문을 열어두고 있습니다.',
  'The NJ Healthcare Access Center welcomes all NJ residents who need medical assistance regardless of age, financial status, immigration status (<strong class="text-amber-900 font-bold bg-amber-100/90 px-2 py-0.5 rounded-md inline-block">including undocumented individuals</strong>), or insurance status.'
);
content = content.replace('<span class="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80">철저한 비밀 보장 (HIPAA)</span>', '<span class="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80">Confidential (HIPAA Protected)</span>');
content = content.replace('<span class="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80">신분 불문 자선치료 지원</span>', '<span class="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80">Charity Care Regardless of Status</span>');
content = content.replace('<span class="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80">권리 보장</span>', '<span class="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80">Patient Rights Protected</span>');

// 15. FAQ Section
content = content.replace(
  '<h3 class="font-black text-2xl sm:text-3xl text-slate-900 mt-1 mb-2 tracking-tight">자주 묻는 질문 (FAQ)</h3>',
  '<h3 class="font-black text-2xl sm:text-3xl text-slate-900 mt-1 mb-2 tracking-tight">Frequently Asked Questions (FAQ)</h3>'
);
content = content.replace(
  '<p class="text-xs sm:text-sm text-slate-500 font-normal">뉴저지 한인 동포분들이 가장 많이 질문하시는 미국 의료 및 건강보험 핵심 안내</p>',
  '<p class="text-xs sm:text-sm text-slate-500 font-normal">Essential guidance on US healthcare, health insurance, and hospital billing most frequently asked by community residents.</p>'
);

// FAQ Filter tabs
content = content.replace('>전체<', '>All<');
content = content.replace('>응급 및 911<', '>Emergency &amp; 911<');
content = content.replace('>의료비 및 청구<', '>Billing &amp; Charges<');
content = content.replace('>건강보험 및 EOB<', '>Insurance &amp; EOB<');
content = content.replace('>무보험 및 복지<', '>Uninsured &amp; Relief<');
content = content.replace('>포털 및 검진<', '>Portals &amp; Screenings<');
content = content.replace('모두 펼치기', 'Expand All');

// FAQ Items translation
const faqMap = [
  {
    q_ko: '응급실(ER)과 911은 언제 사용해야 할까요?',
    q_en: 'When should I call 911 or go to the Emergency Room (ER)?',
    badge_ko: '응급 · 911',
    badge_en: 'Emergency · 911',
    ans_ko: `<p class="font-medium text-slate-800 mb-2">다음과 같은 심각하거나 생명을 위협할 수 있는 증상이 있을 때는 즉시 911에 전화하거나 응급실(ER)을 방문하세요:</p>
                  <ul class="space-y-1.5 text-slate-700 my-3">
                    <li class="flex items-start gap-2"><span class="text-rose-600 font-bold shrink-0 mt-0.5">•</span><span>가슴 또는 복부의 극심한 압박감 또는 급성 통증</span></li>
                    <li class="flex items-start gap-2"><span class="text-rose-600 font-bold shrink-0 mt-0.5">•</span><span>지혈되지 않는 과다 출혈</span></li>
                    <li class="flex items-start gap-2"><span class="text-rose-600 font-bold shrink-0 mt-0.5">•</span><span>갑작스러운 시력 변화, 언어 어눌함, 편마비, 의식 혼란</span></li>
                    <li class="flex items-start gap-2"><span class="text-rose-600 font-bold shrink-0 mt-0.5">•</span><span>호흡 곤란 및 숨쉬기 어려움</span></li>
                    <li class="flex items-start gap-2"><span class="text-rose-600 font-bold shrink-0 mt-0.5">•</span><span>고열을 동반한 극심한 두통 또는 유독 물질 섭취</span></li>
                  </ul>
                  <div class="mt-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-900 font-medium leading-relaxed">
                    ※ 스스로 이동하기 위험한 상황에서는 지체 없이 911에 전화하여 구급차(Ambulance)를 요청하십시오.
                  </div>`,
    ans_en: `<p class="font-medium text-slate-800 mb-2">Call 911 or go to the nearest Emergency Room immediately for life-threatening symptoms such as:</p>
                  <ul class="space-y-1.5 text-slate-700 my-3">
                    <li class="flex items-start gap-2"><span class="text-rose-600 font-bold shrink-0 mt-0.5">•</span><span>Severe chest pressure, shortness of breath, or sudden acute abdominal pain</span></li>
                    <li class="flex items-start gap-2"><span class="text-rose-600 font-bold shrink-0 mt-0.5">•</span><span>Uncontrollable bleeding</span></li>
                    <li class="flex items-start gap-2"><span class="text-rose-600 font-bold shrink-0 mt-0.5">•</span><span>Sudden numbness, facial drooping, slurred speech, or confusion (stroke signs)</span></li>
                    <li class="flex items-start gap-2"><span class="text-rose-600 font-bold shrink-0 mt-0.5">•</span><span>Difficulty breathing or choking</span></li>
                    <li class="flex items-start gap-2"><span class="text-rose-600 font-bold shrink-0 mt-0.5">•</span><span>Severe allergic reactions, seizures, or suspected poisoning</span></li>
                  </ul>
                  <div class="mt-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-900 font-medium leading-relaxed">
                    ※ If driving yourself or having someone drive you is unsafe, do not hesitate to call 911 for an ambulance.
                  </div>`
  },
  {
    q_ko: '예상치 못한 깜짝 의료비(Surprise Medical Bills) 청구 방지법',
    q_en: 'How to protect yourself against Surprise Medical Bills',
    badge_ko: '깜짝 의료비',
    badge_en: 'Surprise Bills',
    ans_ko: `인-네트워크 병원을 방문했더라도 마취과 의사, 영상의학과 전문의 등이 네트워크 외(Out-of-Network)인 경우 깜짝 청구가 발생할 수 있습니다. 비응급 시술 전 보험사에 의료진 네트워크 상태를 서면으로 확인하시고, 연방법인 'No Surprises Act' 및 뉴저지 'Out-of-Network Consumer Protection Act'에 의해 부당한 추가 청구로부터 법적 보호를 받으실 수 있습니다.`,
    ans_en: `Even when visiting an in-network hospital, you may receive surprise bills if the anesthesiologist, radiologist, or assistant surgeon is out-of-network. Before non-emergency procedures, confirm that all providers are in-network. Under the federal No Surprises Act and New Jersey's Out-of-Network Consumer Protection Act, patients are legally protected from surprise balance billing for emergency services and certain non-emergency care.`
  },
  {
    q_ko: '의료비 청구서(Medical Bill) 주요 용어 및 해석 방법',
    q_en: 'Key Medical Bill terms and how to read your statement',
    badge_ko: '청구서 용어',
    badge_en: 'Billing Terms',
    ans_ko: `<p class="font-medium text-slate-800 mb-2">의료비 청구서를 받으셨을 때 확인해야 할 핵심 용어입니다:</p>
                  <ul class="space-y-2 text-slate-700 my-3">
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">DOS (Date of Service)</span><span>진료를 받은 일자</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">CPT Code</span><span>시술 및 처치 식별 표준 코드</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">ICD Code</span><span>의학적 진단 질병 분류 코드</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Charge (Charged Amount)</span><span>병원이 청구한 정가 금액</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Adjustment / Write-Off</span><span>보험사와 병원 간 계약에 의해 자동 삭감된 금액 (환자가 납부할 필요 없음)</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Insurance Payment</span><span>보험사가 병원에 실제 지급한 금액</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Patient Balance (Balance Due)</span><span>환자가 최종적으로 지불해야 하는 잔여 금액</span></li>
                  </ul>`,
    ans_en: `<p class="font-medium text-slate-800 mb-2">Key terms to check on your medical statement:</p>
                  <ul class="space-y-2 text-slate-700 my-3">
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">DOS (Date of Service)</span><span>The date care was provided.</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">CPT Code</span><span>5-digit standardized medical procedure codes.</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">ICD Code</span><span>International diagnostic classification codes.</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Charged Amount</span><span>The full gross price billed by the hospital.</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Adjustment / Discount</span><span>Contracted savings negotiated by insurance (you do not pay this).</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Insurance Payment</span><span>The portion paid directly by your insurance plan.</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Patient Balance Due</span><span>The actual remaining amount you owe after adjustments and insurer payments.</span></li>
                  </ul>`
  },
  {
    q_ko: '보험 설명서(EOB - Explanation of Benefits) 핵심 조건',
    q_en: 'Understanding your Explanation of Benefits (EOB)',
    badge_ko: 'EOB 명세서',
    badge_en: 'EOB Statement',
    ans_ko: `<p class="font-medium text-slate-800 mb-2">EOB는 납부 청구서가 아니며 보험사가 병원 청구를 어떻게 처리했는지 보여주는 명세서입니다.</p>
                  <ul class="space-y-2 text-slate-700 my-3">
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Deductible (디덕터블 / 공제액)</span><span>보험 혜택이 본격 시작되기 전 환자가 연간 먼저 채워야 하는 금액</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Copay (코페이 / 본인 부담금)</span><span>방문 또는 진료 시마다 고정 지불하는 정액 (예: $20)</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Coinsurance (코인슈어런스 / 공동보험)</span><span>디덕터블 충족 후 환자와 보험사가 나누어 내는 비율 (예: 20%)</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Out-of-Pocket</span><span>연간 환자 주머니에서 지출된 총 본인 부담 비용</span></li>
                  </ul>`,
    ans_en: `<p class="font-medium text-slate-800 mb-2">An EOB is NOT a bill; it is an informational statement showing how your insurer processed provider claims.</p>
                  <ul class="space-y-2 text-slate-700 my-3">
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Deductible</span><span>The annual amount you must pay out-of-pocket before insurance begins cost-sharing.</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Copayment (Copay)</span><span>A fixed dollar amount you pay per visit or prescription (e.g. $20).</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Coinsurance</span><span>Your percentage share of the costs after meeting your deductible (e.g. 20%).</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Total Patient Responsibility</span><span>The exact amount you may be billed by the doctor or facility.</span></li>
                  </ul>`
  },
  {
    q_ko: '병원 청구서와 보험사 EOB 명세서 대조 및 확인 요령',
    q_en: 'How to compare your Hospital Bill with your EOB before paying',
    badge_ko: '청구서 대조',
    badge_en: 'Compare Bills',
    ans_ko: `청구서를 받자마자 바로 결제하지 마세요! 반드시 보험사에서 발송된 EOB의 <strong>"You May Owe"</strong> 또는 <strong>"Patient Responsibility"</strong> 금액과 병원 청구서의 <strong>"Patient Balance"</strong>가 일치하는지 먼저 대조해야 합니다. 만약 EOB 금액보다 병원 청구서 금액이 높다면 병원 측에 보험사 청구가 정상 반영되었는지 확인을 요청해야 합니다.`,
    ans_en: `Never pay a medical bill immediately without verifying! Always cross-reference the <strong>"You May Owe"</strong> amount on your EOB with the <strong>"Patient Balance"</strong> on the hospital bill. If the hospital bill is higher, it usually means the insurance claim is still pending or was processed incorrectly. Contact the billing office and request a hold while reviewing.`
  },
  {
    q_ko: '무보험자이거나 재정적 어려움이 있을 때의 지원 제도',
    q_en: 'Financial assistance programs for uninsured or low-income residents',
    badge_ko: '자선진료 · FQHC',
    badge_en: 'Charity Care & FQHC',
    ans_ko: `뉴저지 거주자는 소득에 따라 뉴저지 패밀리케어(NJFamilyCare 메디케이드) 신청이 연중 상시 가능합니다. 메디케이드 자격이 안 되더라도 연방 지원 지역 보건센터(FQHC) 및 가정의료보험기관(BVMI)에서 소득에 따른 진료비 감면 혜택(Sliding Fee Scale)을 받으실 수 있으며, 병원 입원 및 응급 진료에 대해서는 뉴저지 주정부 병원 자선 진료(Hospital Charity Care)를 신청하여 의료비를 100% 탕감받을 수 있습니다.`,
    ans_en: `NJ residents may enroll in NJFamilyCare (Medicaid) year-round if eligible by income. Even if ineligible for Medicaid, Federally Qualified Health Centers (FQHCs) provide comprehensive outpatient care on an income-based sliding fee scale. For hospital inpatient and emergency care, New Jersey's Hospital Charity Care Program provides up to 100% bill forgiveness for qualifying individuals.`
  },
  {
    q_ko: 'MOOP (최대 본인 부담금 - Maximum Out-of-Pocket)이란?',
    q_en: 'What is MOOP (Maximum Out-of-Pocket limit)?',
    badge_ko: 'MOOP 한도',
    badge_en: 'MOOP Limit',
    ans_ko: `가입자가 1개 연도 동안 건강보험 적용 진료비(Deductible, Copay, Coinsurance 합산)로 지출할 수 있는 법적 최대 한도액입니다. 1년 동안 환자의 본인 지출이 이 MOOP 한도에 도달하면, 그 해의 남은 기간 동안에는 인-네트워크 필수 의료 서비스 비용을 보험사가 100% 전액 부담합니다.`,
    ans_en: `The Maximum Out-of-Pocket (MOOP) is the statutory maximum amount you can be required to pay for covered in-network essential healthcare services in a calendar year (combining deductibles, copayments, and coinsurance). Once reached, your insurance plan covers 100% of all in-network covered medical expenses for the rest of that year.`
  },
  {
    q_ko: '전문의 진료 의뢰 (Referral) vs 보험사 사전 승인 (Prior Authorization)',
    q_en: 'Specialist Referral vs Insurance Prior Authorization',
    badge_ko: '진료의뢰 · 사전승인',
    badge_en: 'Referral vs Prior Auth',
    ans_ko: `<div class="space-y-2.5">
                    <p><strong class="text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs">진료 의뢰 (Referral):</strong> 주치의(PCP)가 안과, 심장내과, 이비인후과 등 특정 전문의의 진료가 필요하다고 판단하여 발급하는 허가서입니다 (HMO 플랜 필수).</p>
                    <p><strong class="text-indigo-900 bg-indigo-100/80 px-2 py-0.5 rounded text-xs">사전 승인 (Prior Authorization):</strong> MRI, CT, 복잡한 수술, 고가 항암제 등 특정 고비용 시술을 받기 전에 병원이 보험사에 의학적 타당성을 사전 검토받아 결제 보증을 받는 절차입니다.</p>
                  </div>`,
    ans_en: `<div class="space-y-2.5">
                    <p><strong class="text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs">Referral:</strong> Written permission from your Primary Care Physician (PCP) recommending that you see a medical specialist (required under HMO and POS plans).</p>
                    <p><strong class="text-indigo-900 bg-indigo-100/80 px-2 py-0.5 rounded text-xs">Prior Authorization (Pre-Auth):</strong> Advance approval from your health insurance company before receiving specific high-cost treatments, MRIs, surgeries, or specialty medications.</p>
                  </div>`
  },
  {
    q_ko: '마이차트 (MyChart) 포털 사용법 및 진료 기록 관리',
    q_en: 'How to use MyChart for health records and appointments',
    badge_ko: 'MyChart 포털',
    badge_en: 'MyChart Patient Portal',
    ans_ko: `MyChart는 병원과 의사 진료 기록을 실시간으로 확인하는 보안 환자 포털입니다. 혈액 검사, 영상 판독 결과 확인, 의사와의 안전한 메시지 상담, 온라인 진료 예약, 처방전 리필 요청, 진료비 명세서 확인 및 납부 등을 스마트폰 앱과 PC에서 간편하게 처리하실 수 있습니다.`,
    ans_en: `MyChart is a secure patient electronic health portal connecting you to hospital systems. It lets you review lab test results and clinical notes, message your care team, request prescription refills, schedule appointments, and manage billing statements directly from your smartphone or computer.`
  },
  {
    q_ko: '미등록 체류자(서류미비자) 지원 및 의료 정보 비밀 보장',
    q_en: 'Medical support and privacy protection for undocumented residents',
    badge_ko: '서류미비자 지원',
    badge_en: 'Immigration & Privacy',
    ans_ko: `체류 신분과 전혀 관계없이 뉴저지 주 병원의 자선 치료(Charity Care)와 연방 공인 커뮤니티 보건소(FQHC)를 전액 무료 또는 최소한의 비용으로 이용하실 수 있습니다. 연방법(HIPAA)에 의해 환자의 진료 기록 및 신분 정보는 이민국이나 외부 기관에 절대 공개되지 않으며 100% 비밀이 보장됩니다.`,
    ans_en: `Regardless of immigration status, all NJ residents can access emergency medical care, hospital Charity Care, and FQHC community clinics at reduced or zero cost. Under federal HIPAA privacy laws, patient medical records and immigration details are strictly confidential and are never shared with immigration enforcement authorities.`
  },
  {
    q_ko: '뉴저지 무료 암 검진 프로그램 (NJCEED) 안내',
    q_en: 'New Jersey Free Cancer Screening Program (NJCEED)',
    badge_ko: 'NJCEED 무료검진',
    badge_en: 'NJCEED Free Screenings',
    ans_ko: `NJCEED(New Jersey Cancer Education and Early Detection)는 무보험 또는 저보험 상태인 뉴저지 주민(연방 빈곤선 250% 이하)을 대상으로 유방암(맘모그램), 자궁경부암(Pap 도말검사/HPV 검사), 대장암(분변잠혈검사/대장내시경 연계), 전립선암 검진을 무료로 제공합니다. 조기 발견을 위한 정기 검진을 꼭 신청하세요.`,
    ans_en: `The NJCEED program provides free comprehensive cancer screenings for breast (mammograms), cervical (Pap/HPV tests), colorectal (FIT test and colonoscopy navigation), and prostate cancer for uninsured and underinsured residents living up to 250% of the Federal Poverty Level.`
  },
  {
    q_ko: '뉴저지 한인 정신 건강 및 심리 상담 지원 연계',
    q_en: 'Mental health and psychological counseling resources in New Jersey',
    badge_ko: '정신건강 상담',
    badge_en: 'Mental Health Support',
    ans_ko: `이민 생활의 스트레스, 우울증, 불안 장애, 가족 갈등으로 어려움을 겪으시는 분들을 위해 에스더 하 재단(Esther Ha Foundation) 및 케어 플러스 뉴저지(Care Plus NJ) 등 한국어 상담이 가능한 전문 정신건강 비영리 기관과 긴밀히 협력하고 있습니다. 상담 신청 시 비밀이 철저히 보장됩니다.`,
    ans_en: `For individuals dealing with immigrant stress, depression, anxiety, or family hardship, we collaborate closely with licensed non-profit organizations offering confidential counseling in both Korean and English (e.g. Esther Ha Foundation, Care Plus NJ). All inquiries are strictly confidential.`
  }
];

faqMap.forEach(item => {
  content = content.replace(item.q_ko, item.q_en);
  content = content.replace(item.badge_ko, item.badge_en);
  content = content.replace(item.ans_ko, item.ans_en);
});

content = content.replaceAll("anyClosed ? '모두 접기' : '모두 펼치기'", "anyClosed ? 'Collapse All' : 'Expand All'");
content = content.replaceAll('자세히 보기', 'View Details');
content = content.replaceAll('접기', 'Collapse');
content = content.replaceAll('모두 펼치기', 'Expand All');
content = content.replaceAll('모두 접기', 'Collapse All');

// 16. Section 8: Video News
content = content.replace(
  '<h2 class="font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">의학비디오뉴스</h2>',
  '<h2 class="font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">Medical Video News</h2>'
);
content = content.replace('<?= count($activeVideos) ?>개 영상', '<?= count($activeVideos) ?> Videos');
content = content.replaceAll("onclick=\"window.cmsSetVideoCat('전체')\"", "onclick=\"window.cmsSetVideoCat('All')\"");
content = content.replace('>전체 영상<', '>All Videos<');
content = content.replace('>전체<', '>All<');
content = content.replace('>만성질환 &amp; 당뇨<', '>Chronic &amp; Diabetes<');
content = content.replace('>심장 &amp; 혈관<', '>Cardiovascular<');
content = content.replace('>뇌신경 &amp; 치매<', '>Neurology &amp; Memory<');
content = content.replace('>암 예방 &amp; 검진<', '>Cancer Prevention<');
content = content.replace('>감염병 &amp; 백신<', '>Infectious &amp; Vaccines<');
content = content.replace('>건강검진 &amp; 의료정보<', '>Checkups &amp; Guidance<');
content = content.replace('‹ 이전', '‹ Prev');
content = content.replace('다음 ›', 'Next ›');

// 17. Section 9: Major Hospitals
content = content.replace(
  '뉴저지 주요 병원 및 의료 네트워크 리소스',
  'Major New Jersey Hospitals &amp; Medical Network Resources'
);
content = content.replace(
  '뉴저지 한인 동포들이 신뢰하고 찾을 수 있는 버겐 카운티 및 뉴저지 전역의 핵심 종합병원과 전문의 네트워크 안내입니다. <strong>한인 환자 전담 서비스, 한국어 통역, 전문의 연계 및 자선 진료(Charity Care)</strong> 정보를 한눈에 비교하고 바로 연결하세요.',
  'Comprehensive directory of leading acute care hospitals and specialty medical networks across Bergen County and New Jersey. Compare <strong>bilingual patient navigation, Korean medical programs, specialist access, and Charity Care financial assistance</strong>.'
);
content = content.replace('병원 후기 &amp; 질문 바로가기 →', 'Hospital Reviews &amp; Q&A →');
content = content.replace('>전체 병원 보기<', '>All Hospitals<');
content = content.replace('>버겐카운티 핵심 병원<', '>Bergen County Centers<');
content = content.replace('>한인 프로그램 운영<', '>Korean Medical Program<');
content = content.replace('>응급실 (24/7 ER)<', '>Emergency (24/7 ER)<');
content = content.replace('>자선치료 지원<', '>Charity Care Support<');
content = content.replace('>암 전문 센터<', '>Specialty Cancer Center<');

// Hospital cards labels
content = content.replaceAll('공식 웹사이트', 'Official Website');
content = content.replaceAll('후기 &amp; 질문', 'Reviews &amp; Q&A');
content = content.replaceAll('대표 전화:', 'Main Phone:');
content = content.replaceAll('한인 전담:', 'Korean Dept:');
content = content.replaceAll('네트워크 안내:', 'Network Info:');
content = content.replaceAll('한인 핫라인:', 'KMP Hotline:');

// 18. Footer
content = content.replace(
  '뉴저지 한인 커뮤니티를 위한 의료 접근 및 건강 정보 포털. 메디케어, ACA, 의료 상담을 한국어로 제공합니다.',
  'Comprehensive healthcare access and navigation portal for New Jersey residents. Providing Medicare, ACA health insurance, and bilingual patient advocacy.'
);
content = content.replace('>정보<', '>Information<');
content = content.replace('>의료 가이드<', '>Healthcare Guides<');
content = content.replace('>환자도우미<', '>Patient Tools<');
content = content.replace('>메디케어 안내<', '>Medicare Guide<');
content = content.replace('>ACA 보험<', '>ACA Insurance<');
content = content.replace('>주요 병원 네트워크<', '>Hospital Networks<');
content = content.replace('>자주 묻는 질문<', '>FAQ<');
content = content.replace('>보험 자격 진단<', '>Eligibility Matcher<');
content = content.replace('>보조금 계산기<', '>Subsidy Calculator<');
content = content.replace('>의학 용어 사전<', '>Medical Dictionary<');
content = content.replace('>건강 뉴스<', '>Health News<');
content = content.replace(
  '<span class="font-semibold text-white/40">⚠ 의료 면책 조항:</span> 이 웹사이트의 정보는 교육 목적으로만 제공됩니다. 의료 결정은 반드시 자격을 갖춘 의료 전문가와 상담하십시오.',
  '<span class="font-semibold text-white/40">⚠ Medical Disclaimer:</span> The information provided on this website is for educational and navigation purposes only. Always consult a qualified healthcare professional for medical decisions.'
);

fs.writeFileSync(destPath, content, 'utf8');
console.log('[SUCCESS] Created completely bilingual en/index.php (' + content.length + ' bytes)');
