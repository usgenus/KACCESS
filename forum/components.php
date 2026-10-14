<?php
/**
 * Shared Discourse / MissyUSA Community Forum Components for NJ Access Portal
 * Brand lockup: NJ Access Portal · 뉴저지 한인 포털
 * Palette: Deep Navy #0F2342, Medical Blue #1B6FA8, Soft Teal #7FC8C0, Kakao Yellow #FEE500
 */

function render_forum_header(string $searchQuery = '', ?array $currentSpecialty = null, string $activeCategory = '') {
    $catId = $currentSpecialty['id'] ?? $activeCategory;
    if (empty($catId)) {
        $catId = trim($_GET['specialty'] ?? ($_GET['category'] ?? ''));
    }
    // Map legacy slugs to category
    if (!empty($catId)) {
        $mapped = forum_map_specialty_to_category($catId);
        $catId = $mapped['categoryId'];
    }
?>
  <style id="njap-logo-anim-styles">
    .njap-brand-link {
      display: inline-flex !important;
      align-items: center !important;
      flex-shrink: 0 !important;
    }
    .njap-brand-link img,
    .njap-brand-link svg {
      height: 48px !important;
      max-height: 50px !important;
      width: auto !important;
      object-fit: contain !important;
    }
    @media (max-width: 640px) {
      .njap-brand-link img,
      .njap-brand-link svg {
        height: 38px !important;
        max-height: 40px !important;
        width: auto !important;
      }
    }

    @keyframes njapNavKeySlide {
      0% { opacity: 0; transform: translate(670px, 0); }
      15% { opacity: 1; }
      75% { transform: translate(0, 0); }
      86% { transform: translate(-3.5px, 0); }
      100% { opacity: 1; transform: translate(0, 0); }
    }
    @keyframes njapNavKeyholePulse {
      0%, 70% { stroke: #DC2626; filter: drop-shadow(0 0 0 transparent); }
      82% { stroke: #EF4444; filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.85)); }
      100% { stroke: #DC2626; filter: drop-shadow(0 0 0 transparent); }
    }
    @keyframes njapNavDoorAppear {
      0% { opacity: 0; transform: scale(0.96); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes njapNavTextMain {
      0% { opacity: 0; transform: translate(45px, 0); }
      100% { opacity: 1; transform: translate(0, 0); }
    }
    @keyframes njapNavTextSub {
      0% { opacity: 0; transform: translate(35px, 0); }
      100% { opacity: 1; transform: translate(0, 0); }
    }

    .njap-nav-door { transform-origin: 40px 45px; animation: njapNavDoorAppear 0.75s cubic-bezier(0.16, 1, 0.3, 1) both; }
    .njap-nav-key { animation: njapNavKeySlide 2.18s cubic-bezier(0.22, 1, 0.36, 1) 0.22s both; }
    .njap-nav-keyhole { animation: njapNavKeyholePulse 2.4s ease-out 0.22s both; }
    .njap-nav-text-main { animation: njapNavTextMain 1.0s cubic-bezier(0.16, 1, 0.3, 1) 2.18s both; }
    .njap-nav-text-sub { animation: njapNavTextSub 1.0s cubic-bezier(0.16, 1, 0.3, 1) 2.48s both; }

    @media (prefers-reduced-motion: reduce) {
      .njap-nav-door, .njap-nav-key, .njap-nav-keyhole, .njap-nav-text-main, .njap-nav-text-sub {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
    }
    .forum-cat-scroll::-webkit-scrollbar {
      display: none;
    }
  </style>

  <!-- Top Marquee Banner -->
  <div class="fixed top-0 left-0 right-0 z-50 overflow-hidden flex items-center" style="height: 40px; background:#0a1728; border-bottom: 1px solid rgba(255,255,255,0.08);">
    <div class="marquee-track whitespace-nowrap">
      <?php for ($i = 0; $i < 6; $i++): ?>
        <span class="inline-block font-sans text-xs text-white/90 tracking-wide px-10">
          <span class="text-[#38BDF8] mr-2">✦</span>NJ Access Portal: &quot;언어와 문화의 장벽 없이, 분야별 최고 전문가와 이웃이 함께하는 뉴저지 한인 광장&quot;<span class="text-[#38BDF8] ml-2">✦</span>
        </span>
      <?php endfor; ?>
    </div>
  </div>

  <!-- TIER 1: Main Website Navigation Bar (Deep Navy #0F2342) -->
  <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-md" style="top:40px; background-color: #0F2342; border-bottom: 1px solid rgba(255,255,255,0.12);">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-15 gap-2">
        
        <!-- Left: Mobile Toggle & Brand Lockup -->
        <div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
          <button id="sidebar-toggle-btn" onclick="toggleForumSidebar()" 
            class="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            title="포럼 전체 게시판 메뉴 열기/접기" aria-label="메뉴 토글">
            <i class="fa-solid fa-bars text-sm"></i>
          </button>

          <a class="flex items-center cursor-pointer njap-brand-link flex-shrink-0 group" href="/" title="NJ Access Portal · 뉴저지 한인 포털">
            <svg class="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform group-hover:scale-102" viewBox="0 0 320 60" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NJ Access Portal · 뉴저지 한인 포털" style="overflow: visible;">
              <title>NJ Access Portal · 뉴저지 한인 포털</title>
              <g transform="translate(4, 2) scale(0.56)" stroke-linecap="round" stroke-linejoin="round">
                <!-- Door Frame -->
                <g class="njap-nav-door" stroke="#FFFFFF">
                  <line x1="20" y1="12" x2="20" y2="88" stroke-width="3.5" />
                  <rect x="25" y="12" width="55" height="76" rx="2" stroke-width="4" fill="none" />
                  <polyline points="25,16 52,25 52,36" stroke-width="3.5" />
                  <text x="52.5" y="81" font-family="'Times New Roman', serif" font-size="13.5" font-weight="900" letter-spacing="1.5" fill="#FFFFFF" stroke="none" text-anchor="middle">NJAP</text>
                </g>
                <!-- Keyhole -->
                <path class="njap-nav-keyhole" d="M 43,45 A 7,7 0 1,1 53,45 L 56,64 L 40,64 Z" stroke="#EF4444" stroke-width="3.5" fill="none" />
                <!-- Key -->
                <g class="njap-nav-key">
                  <circle cx="74" cy="45" r="6.5" stroke="#EF4444" stroke-width="3.5" fill="none" />
                  <line x1="47" y1="45" x2="67.5" y2="45" stroke="#EF4444" stroke-width="3.5" />
                  <line x1="49" y1="45" x2="49" y2="49" stroke="#EF4444" stroke-width="3.5" />
                  <line x1="53" y1="45" x2="53" y2="48" stroke="#EF4444" stroke-width="3" />
                </g>
              </g>

              <g class="njap-nav-text-main">
                <text x="64" y="27" font-family="Pretendard, -apple-system, system-ui, sans-serif" font-size="18" font-weight="900" fill="#FFFFFF" letter-spacing="-0.5">NJ Access Portal</text>
              </g>
              <g class="njap-nav-text-sub">
                <text x="64" y="44" font-family="Pretendard, -apple-system, system-ui, sans-serif" font-size="10.5" font-weight="700" fill="#FFFFFF" letter-spacing="0.2">뉴저지 한인 포털</text>
              </g>
            </svg>
          </a>
        </div>

        <!-- Center: Main Webpage Navigation Links (Desktop) -->
        <div class="hidden lg:flex items-center space-x-5 xl:space-x-8 text-[14px]">
          <a class="nav-link pb-1 flex flex-col items-center justify-center leading-tight text-center cursor-pointer group transition-colors" href="/" onclick="navigateToHome(event); return false;">
            <span class="text-[14px] leading-tight font-semibold text-white/80 group-hover:text-white">홈</span>
            <span class="text-[10px] leading-tight font-medium text-white/50 group-hover:text-white/80">Home</span>
          </a>
          <a class="nav-link pb-1 flex flex-col items-center justify-center leading-tight text-center cursor-pointer group transition-colors" href="/blog">
            <span class="text-[14px] leading-tight font-semibold text-white/80 group-hover:text-white">뉴스</span>
            <span class="text-[10px] leading-tight font-medium text-white/50 group-hover:text-white/80">News</span>
          </a>
          <a class="nav-link pb-1 flex flex-col items-center justify-center leading-tight text-center cursor-pointer group border-b-2 border-white transition-colors" href="/forum">
            <span class="text-[14px] leading-tight font-extrabold text-white">뉴저지 한인광장</span>
            <span class="text-[10px] leading-tight font-medium text-white/80">Market place</span>
          </a>
          <a class="nav-link pb-1 flex flex-col items-center justify-center leading-tight text-center cursor-pointer group transition-colors" href="/partners">
            <span class="text-[14px] leading-tight font-semibold text-white/80 group-hover:text-white">뉴저지 파트너즈</span>
            <span class="text-[10px] leading-tight font-medium text-white/50 group-hover:text-white/80">NJ Partners</span>
          </a>
          <a class="nav-link pb-1 flex flex-col items-center justify-center leading-tight text-center cursor-pointer group transition-colors" href="/resource-center">
            <span class="text-[12px] leading-tight font-bold text-white group-hover:text-white">의료 &amp; 커뮤니티</span>
            <span class="text-[13px] leading-tight font-bold text-slate-300 group-hover:text-white">정보센터</span>
            <span class="text-[10px] leading-tight font-medium text-white/50 group-hover:text-white/80">Resource Center</span>
          </a>
          <a class="nav-link pb-1 flex flex-col items-center justify-center leading-tight text-center cursor-pointer group transition-colors" href="/about">
            <span class="text-[14px] leading-tight font-semibold text-white/80 group-hover:text-white">의료접근센터</span>
            <span class="text-[10px] leading-tight font-medium text-white/50 group-hover:text-white/80">Healthcare Access Center</span>
          </a>
        </div>

        <!-- Right Utility Bar -->
        <div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <!-- KakaoTalk 1:1 Chat Button (Kakao Yellow #FEE500) -->
          <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" 
             class="inline-flex items-center gap-1.5 bg-[#FEE500] hover:bg-[#FDD835] active:bg-[#FBC02D] text-slate-900 font-extrabold text-xs px-2.5 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer shrink-0" 
             title="카카오톡 1:1 상담 바로가기">
            <img src="/kakaotalk-icon.png" alt="KakaoTalk" class="w-4 h-4 rounded-xs shrink-0 object-contain" />
            <span class="whitespace-nowrap">1:1 상담</span>
          </a>

          <!-- Forum Auth / Login Profile Button -->
          <div id="auth-box" class="flex items-center shrink-0">
            <button onclick="openGoogleAuthModal()" id="btn-login" 
              class="text-xs font-bold bg-white/15 hover:bg-white/25 text-white border border-white/20 px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow-2xs" 
              title="Google 로그인">
              <i class="fa-brands fa-google text-red-400 text-xs"></i>
              <span class="hidden sm:inline">로그인</span>
            </button>
          </div>

          <!-- Mobile Right Menu Toggle -->
          <button id="mobile-menu-btn" onclick="toggleMobileNavMenu()" class="lg:hidden p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors shrink-0 flex items-center justify-center" aria-label="메뉴 열기">
            <i class="fa-solid fa-bars-staggered text-base"></i>
          </button>
        </div>

      </div>
    </div>
  </header>

  <!-- TIER 2: Forum Category Menu Bar (Medical Blue #1B6FA8) -->
  <nav class="fixed left-0 right-0 z-40 shadow-sm forum-cat-bar" style="top: 100px; background-color: #1B6FA8; border-bottom: 1px solid rgba(255,255,255,0.15);">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-12 gap-2">
        
        <!-- Category Navigation Tabs (Clean typography, zero icons) -->
        <div class="flex items-center space-x-1 sm:space-x-2 overflow-x-auto forum-cat-scroll py-1.5 text-xs sm:text-sm font-bold min-w-0 flex-1">
          <a href="/forum?specialty=all" class="px-3 py-1.5 rounded-lg whitespace-nowrap transition-all <?= ($catId === 'all' || empty($catId)) ? 'bg-white text-[#0F2342] font-black shadow-xs' : 'text-white/90 hover:text-white hover:bg-white/15' ?>">
            <span>전체보기</span>
          </a>
          <a href="/forum?specialty=medical" class="px-3 py-1.5 rounded-lg whitespace-nowrap transition-all <?= ($catId === 'medical') ? 'bg-white text-[#1B6FA8] font-black shadow-xs' : 'text-white/90 hover:text-white hover:bg-white/15' ?>">
            <span>의료관련</span>
          </a>
          <a href="/forum?specialty=community" class="px-3 py-1.5 rounded-lg whitespace-nowrap transition-all <?= ($catId === 'community') ? 'bg-white text-[#1B6FA8] font-black shadow-xs' : 'text-white/90 hover:text-white hover:bg-white/15' ?>">
            <span>자유게시판</span>
          </a>
          <a href="/forum?specialty=market" class="px-3 py-1.5 rounded-lg whitespace-nowrap transition-all <?= ($catId === 'market') ? 'bg-white text-[#1B6FA8] font-black shadow-xs' : 'text-white/90 hover:text-white hover:bg-white/15' ?>">
            <span>마켓플레이스</span>
          </a>
          <a href="/forum?specialty=wanted" class="px-3 py-1.5 rounded-lg whitespace-nowrap transition-all <?= ($catId === 'wanted' || $catId === 'services') ? 'bg-white text-[#1B6FA8] font-black shadow-xs' : 'text-white/90 hover:text-white hover:bg-white/15' ?>">
            <span>서비스</span>
          </a>
          <a href="/forum?specialty=jobs" class="px-3 py-1.5 rounded-lg whitespace-nowrap transition-all <?= ($catId === 'jobs') ? 'bg-white text-[#1B6FA8] font-black shadow-xs' : 'text-white/90 hover:text-white hover:bg-white/15' ?>">
            <span>구직</span>
          </a>
          <a href="/forum?specialty=food" class="px-3 py-1.5 rounded-lg whitespace-nowrap transition-all <?= ($catId === 'food') ? 'bg-white text-[#1B6FA8] font-black shadow-xs' : 'text-white/90 hover:text-white hover:bg-white/15' ?>">
            <span>맛집</span>
          </a>
          <a href="/forum?specialty=columns" class="px-3 py-1.5 rounded-lg whitespace-nowrap transition-all <?= ($catId === 'columns') ? 'bg-white text-[#1B6FA8] font-black shadow-xs' : 'text-white/90 hover:text-white hover:bg-white/15' ?>">
            <span>전문가 칼럼</span>
          </a>
          <a href="/forum?specialty=events" class="px-3 py-1.5 rounded-lg whitespace-nowrap transition-all <?= ($catId === 'events') ? 'bg-white text-[#1B6FA8] font-black shadow-xs' : 'text-white/90 hover:text-white hover:bg-white/15' ?>">
            <span>이벤트</span>
          </a>
          <a href="/forum?specialty=clubs" class="px-3 py-1.5 rounded-lg whitespace-nowrap transition-all <?= ($catId === 'clubs') ? 'bg-white text-[#1B6FA8] font-black shadow-xs' : 'text-white/90 hover:text-white hover:bg-white/15' ?>">
            <span>동호회/동문회</span>
          </a>
        </div>

        <!-- Quick Post Button on Right of Category Bar -->
        <div class="shrink-0 pl-2">
          <a href="/forum/ask<?= !empty($catId) ? '?category=' . urlencode($catId) : '' ?>" 
             class="inline-flex items-center gap-1.5 bg-[#FEE500] hover:bg-[#FDD835] active:bg-[#FBC02D] text-slate-900 font-extrabold text-xs sm:text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer"
             title="게시글 / 질문 등록하기">
            <span>+ 글쓰기</span>
          </a>
        </div>

      </div>
    </div>
  </nav>

  <!-- Mobile Dropdown Menu -->
  <div id="mobile-menu-dropdown" class="lg:hidden fixed top-[148px] left-0 right-0 z-40 overflow-hidden transition-all duration-300 max-h-0 opacity-0 bg-white/98 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex flex-col gap-1 shadow-xl">
    <a href="/" class="py-2.5 px-3 rounded-lg font-bold text-slate-800 hover:text-[#1B6FA8] hover:bg-slate-50 flex items-center justify-between border-b border-slate-100">
      <div class="flex flex-col text-left leading-tight">
        <span class="text-[15px] font-bold text-slate-800">홈</span>
        <span class="text-[10.5px] font-medium text-slate-400">Home</span>
      </div>
      <i class="fa-solid fa-chevron-right text-xs text-slate-400"></i>
    </a>
    <a href="/blog" class="py-2.5 px-3 rounded-lg font-bold text-slate-800 hover:text-[#1B6FA8] hover:bg-slate-50 flex items-center justify-between border-b border-slate-100">
      <div class="flex flex-col text-left leading-tight">
        <span class="text-[15px] font-bold text-slate-800">뉴스</span>
        <span class="text-[10.5px] font-medium text-slate-400">News</span>
      </div>
      <i class="fa-solid fa-chevron-right text-xs text-slate-400"></i>
    </a>
    <a href="/forum" class="py-2.5 px-3 rounded-lg font-black text-[#1B6FA8] bg-blue-50/70 flex items-center justify-between border-b border-slate-100">
      <div class="flex flex-col text-left leading-tight">
        <span class="text-[15px] font-black text-[#1B6FA8]">뉴저지 한인광장</span>
        <span class="text-[10.5px] font-medium text-[#1B6FA8]/80">Market place</span>
      </div>
      <i class="fa-solid fa-chevron-right text-xs text-[#1B6FA8]"></i>
    </a>
    <a href="/partners" class="py-2.5 px-3 rounded-lg font-bold text-slate-800 hover:text-[#1B6FA8] hover:bg-slate-50 flex items-center justify-between border-b border-slate-100">
      <div class="flex flex-col text-left leading-tight">
        <span class="text-[15px] font-bold text-slate-800">뉴저지 파트너즈</span>
        <span class="text-[10.5px] font-medium text-slate-400">NJ Partners</span>
      </div>
      <i class="fa-solid fa-chevron-right text-xs text-slate-400"></i>
    </a>
    <a href="/resource-center" class="py-2.5 px-3 rounded-lg font-bold text-slate-800 hover:text-[#1B6FA8] hover:bg-slate-50 flex items-center justify-between border-b border-slate-100">
      <div class="flex flex-col text-left leading-tight">
        <span class="text-[13px] font-bold text-black">의료 &amp; 커뮤니티</span>
        <span class="text-[13px] font-semibold text-[#475569]">정보센터</span>
        <span class="text-[10.5px] font-medium text-slate-400">Resource Center</span>
      </div>
      <i class="fa-solid fa-chevron-right text-xs text-slate-400"></i>
    </a>
    <a href="/about" class="py-2.5 px-3 rounded-lg font-bold text-slate-800 hover:text-[#1B6FA8] hover:bg-slate-50 flex items-center justify-between">
      <div class="flex flex-col text-left leading-tight">
        <span class="text-[15px] font-bold text-slate-800">의료접근센터</span>
        <span class="text-[10.5px] font-medium text-slate-400">Healthcare Access Center</span>
      </div>
      <i class="fa-solid fa-chevron-right text-xs text-slate-400"></i>
    </a>
  </div>

  <!-- Header Spacer for Fixed Nav (40px marquee + 60px navy + 48px blue = 148px) -->
  <div class="h-[148px] header-spacer" style="height: 148px; min-height: 148px; width: 100%;"></div>
<?php
}

/**
 * Dynamic Section-Specific Disclaimer Banner
 * Strictly isolates medical disclaimer to healthcare sections!
 */
function render_forum_disclaimer_banner(string $extraClass = '', ?string $categoryId = null) {
    if ($categoryId === null) {
        $categoryId = trim($_GET['specialty'] ?? ($_GET['category'] ?? ''));
    }
    $info = function_exists('forum_get_section_disclaimer') ? forum_get_section_disclaimer($categoryId) : [
        'tag' => '면책 안내',
        'badgeClass' => 'bg-[#1B6FA8] text-white',
        'boxClass' => 'from-blue-50 via-sky-50/60 to-slate-50 border-blue-200/90',
        'headline' => forum_get_disclaimer(),
        'subtext' => '본 포럼의 모든 정보는 정보 나눔 목적이며 개별 의학적 진단이나 법률 자문을 대신하지 않습니다.'
    ];
?>
  <!-- Section Specific Disclaimer Strip -->
  <div id="forum-disclaimer-strip" class="bg-gradient-to-r <?= $info['boxClass'] ?> rounded-2xl p-4 sm:p-4.5 my-6 shadow-2xs border <?= $extraClass ?>">
    <div class="leading-relaxed min-w-0 text-xs sm:text-sm text-slate-800">
      <div class="flex items-center gap-1.5 flex-wrap">
        <span id="forum-disclaimer-tag" class="inline-block <?= $info['badgeClass'] ?> text-[10px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider"><?= htmlspecialchars($info['tag']) ?></span>
        <strong id="forum-disclaimer-headline" class="text-slate-900 font-bold text-xs sm:text-sm"><?= htmlspecialchars($info['headline']) ?></strong>
      </div>
      <p id="forum-disclaimer-subtext" class="text-[11px] sm:text-xs text-slate-500 mt-1">
        <?= htmlspecialchars($info['subtext']) ?>
      </p>
    </div>
  </div>
<?php
}

/**
 * Left Sidebar: 7 Categories & Sub-Boards (MissyUSA-style scannable list)
 * ABSOLUTELY NO PUBLIC LINK TO /admin2/
 */
function render_forum_sidebar(array $categories, string $activeSpecialty = '', string $activeSort = 'latest', string $activeView = 'categories', string $activeSub = '') {
    $catInfo = forum_map_specialty_to_category($activeSpecialty, $activeSub);
    $activeCatId = $catInfo['categoryId'];
    $subBoards = forum_get_sub_boards();
?>
  <!-- Sidebar Backdrop for Mobile Drawer -->
  <div id="sidebar-backdrop" onclick="toggleForumSidebar()" class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 hidden md:hidden transition-opacity"></div>

  <!-- Left Sidebar (Clean Typographic 7 Categories + Sub-boards) -->
  <aside id="forum-sidebar" class="sidebar-closed w-[180px] md:w-[190px] bg-slate-50/95 border-r border-slate-200/90 shrink-0 overflow-y-auto px-2.5 py-3.5 z-40 flex flex-col justify-between" style="width: 190px; min-width: 190px; max-width: 190px;">
    
    <!-- Mobile Drawer Close Header -->
    <div class="flex md:hidden items-center justify-between pb-2 mb-2 border-b border-slate-200 shrink-0">
      <span class="font-bold text-xs text-slate-900">전체 카테고리</span>
      <button onclick="toggleForumSidebar()" class="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-slate-700" aria-label="메뉴 닫기">
        <i class="fa-solid fa-xmark text-sm"></i>
      </button>
    </div>

    <div class="space-y-3">
      <!-- Main Nav Links -->
      <div class="space-y-1">
        <a href="/forum" 
           class="block py-2 px-2.5 rounded-xl transition-all text-xs <?= (empty($activeSpecialty) || $activeSpecialty === 'home') ? 'bg-[#1B6FA8] text-white font-extrabold shadow-xs' : 'text-slate-700 hover:bg-slate-100 hover:text-[#1B6FA8] font-bold' ?>"
           title="포럼 홈 (요약)">
          <span>포럼 홈</span>
        </a>
        <a href="/forum?specialty=all" 
           class="block py-2 px-2.5 rounded-xl transition-all text-xs <?= ($activeSpecialty === 'all') ? 'bg-[#1B6FA8] text-white font-black shadow-xs' : 'text-slate-800 hover:bg-slate-100 hover:text-[#1B6FA8] font-bold' ?>"
           title="전체 게시판 글목록">
          <span>전체글 보기</span>
        </a>
      </div>

      <!-- Divider -->
      <div class="pt-1.5 border-t border-slate-200/80">
        <span class="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block px-1">9대 커뮤니티 게시판</span>
      </div>

      <!-- 8 Top Categories & Sub-Boards -->
      <div class="space-y-1">
        <?php foreach ($categories as $cat): 
          $isCatActive = ($activeCatId === $cat['id']);
          $cSubBoards = $subBoards[$cat['id']] ?? [];
        ?>
          <div>
            <a href="/forum?specialty=<?= urlencode($cat['id']) ?>" 
               class="group relative flex items-center justify-between py-2 px-2.5 rounded-xl transition-all text-xs <?= $isCatActive ? 'bg-[#1B6FA8] text-white font-black shadow-xs' : 'text-slate-800 hover:bg-slate-100 hover:text-[#1B6FA8] font-bold' ?>"
               title="<?= htmlspecialchars($cat['name_ko']) ?> (<?= htmlspecialchars($cat['name_en']) ?>)">
              
              <span class="truncate"><?= htmlspecialchars($cat['name_ko']) ?></span>
              
              <?php if (($cat['questionCount'] ?? 0) > 0): ?>
                <span class="text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 <?= $isCatActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600' ?>">
                  <?= (int)$cat['questionCount'] ?>
                </span>
              <?php endif; ?>
            </a>

            <!-- Sub-board links if active category has sub-boards -->
            <?php if (!empty($cSubBoards) && $isCatActive): ?>
              <div class="pl-2.5 py-1 space-y-0.5 border-l-2 border-[#1B6FA8]/40 ml-2 mt-1">
                <?php foreach ($cSubBoards as $sb): 
                  $isSubActive = ($activeSub === $sb['id']);
                ?>
                  <a href="/forum?specialty=<?= urlencode($cat['id']) ?>&sub=<?= urlencode($sb['id']) ?>" 
                     class="block py-1 px-1.5 rounded-md text-[11px] transition-colors truncate <?= $isSubActive ? 'text-[#1B6FA8] font-black bg-blue-50' : 'text-slate-600 hover:text-[#1B6FA8] hover:bg-slate-100 font-medium' ?>"
                     title="<?= htmlspecialchars($sb['name_ko']) ?>">
                    • <?= htmlspecialchars($sb['name_ko']) ?>
                  </a>
                <?php endforeach; ?>
              </div>
            <?php endif; ?>
          </div>
        <?php endforeach; ?>
      </div>

    </div>

    <!-- Sidebar Footer Brand Lockup -->
    <div class="pt-3 mt-4 border-t border-slate-200/80 text-center">
      <div class="text-[9px] text-slate-400 font-semibold">NJ Access Portal</div>
    </div>

  </aside>

  <!-- Mobile Floating Write Button -->
  <a href="/forum/ask<?= !empty($activeCatId) ? '?category=' . urlencode($activeCatId) : '' ?>" 
     class="fixed bottom-6 right-5 sm:hidden z-40 bg-[#1B6FA8] hover:bg-[#155A8A] active:scale-95 text-white font-extrabold text-sm px-5 py-3 rounded-full shadow-2xl flex items-center justify-center border-2 border-white transition-transform"
     title="글쓰기" aria-label="글쓰기">
    <i class="fa-solid fa-pen-to-square mr-1.5"></i>
    <span>글쓰기</span>
  </a>
<?php
}

function render_forum_modals() {
?>
  <!-- Google One-Click Auth Modal -->
  <div id="google-auth-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 hidden items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
      <button onclick="closeGoogleAuthModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 text-base">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <div class="text-center mb-6">
        <div class="w-12 h-12 rounded-2xl bg-blue-50 text-[#1B6FA8] mx-auto flex items-center justify-center text-xl mb-3 shadow-xs">
          <i class="fa-brands fa-google text-red-500"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-900">구글 계정으로 간편 로그인</h3>
        <p class="text-xs text-slate-500 mt-1">
          이웃들과 질문을 나누고 댓글을 작성하실 수 있습니다.
        </p>
      </div>

      <div class="mb-5 flex justify-center">
        <div id="g_id_onload"
             data-client_id="1095851141884-g8t2tblr3pjrdtu5uq65oisa7i2al1a9.apps.googleusercontent.com"
             data-context="signin"
             data-ux_mode="popup"
             data-callback="handleGoogleSignIn"
             data-auto_prompt="false">
        </div>
        <div class="g_id_signin"
             data-type="standard"
             data-shape="pill"
             data-theme="outline"
             data-text="signin_with"
             data-size="large"
             data-logo_alignment="left">
        </div>
      </div>

      <div class="relative flex py-2 items-center">
        <div class="flex-grow border-t border-slate-200"></div>
        <span class="flex-shrink mx-3 text-slate-400 text-xs font-medium">또는 이메일 직접 입력</span>
        <div class="flex-grow border-t border-slate-200"></div>
      </div>

      <form onsubmit="handleDirectGoogleSignIn(event)" class="mt-4 space-y-3">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Gmail / 이메일 주소 <span class="text-red-500">*</span></label>
          <input type="email" id="login-google-email" required
            placeholder="example@gmail.com"
            class="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#1B6FA8]" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">사용하실 닉네임 / 성함</label>
          <input type="text" id="login-google-name"
            placeholder="예: 포트리주민, 팰팍맘"
            class="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#1B6FA8]" />
        </div>
        <button type="submit" class="w-full py-3 rounded-xl bg-[#1B6FA8] hover:bg-[#155A8A] text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2">
          <i class="fa-solid fa-right-to-bracket"></i>
          <span>포럼 접속하기</span>
        </button>
      </form>

      <!-- Event Blast / Terms / CAN-SPAM Compliance Notice -->
      <div class="mt-4 pt-3.5 border-t border-slate-100 text-[11px] leading-relaxed text-slate-500 bg-slate-50/90 rounded-2xl p-3.5">
        <div class="flex items-start gap-2">
          <i class="fa-solid fa-shield-halved text-[#1B6FA8] mt-0.5 shrink-0 text-xs"></i>
          <div>
            <p class="font-medium text-slate-700 leading-snug">
              로그인 및 글/댓글 작성 시 <span class="font-bold text-slate-800">이용약관</span> 및 <span class="font-bold text-[#1B6FA8]">NJAP 주요 건강 세미나·이벤트 소식 이메일 수신</span>에 동의하게 됩니다.
            </p>
            <p class="text-[10px] text-slate-400 mt-1 leading-normal">
              ※ 발송되는 모든 안내 이메일 하단의 <strong>수신거부(Unsubscribe)</strong> 링크를 통해 언제든지 무료로 수신을 해지하실 수 있습니다. (미국 CAN-SPAM 규정 준수)
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Nickname Edit Modal -->
  <div id="modal-edit-nickname" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 hidden items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative">
      <button onclick="closeNicknameModal()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 text-sm">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <h3 class="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
        <i class="fa-solid fa-user-pen text-[#1B6FA8]"></i>
        <span>닉네임 / 성함 변경</span>
      </h3>
      <p class="text-xs text-slate-500 mb-4">포럼에서 활동할 성함이나 닉네임을 변경합니다.</p>
      
      <form onsubmit="handleUpdateNickname(event)" class="space-y-3">
        <input type="text" id="input-edit-nickname" required minlength="2" maxlength="30"
          placeholder="새로운 닉네임 또는 성함 입력"
          class="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#1B6FA8]" />
        <div class="flex items-center justify-end gap-2 pt-2">
          <button type="button" onclick="closeNicknameModal()" class="px-3 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-600">
            취소
          </button>
          <button type="submit" class="px-4 py-2 rounded-xl bg-[#1B6FA8] hover:bg-[#155A8A] text-xs font-bold text-white shadow-xs">
            저장하기
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Marketplace & Services Wanted Terms & Liability Disclaimer Popup Modal -->
  <div id="modal-market-disclaimer" onclick="if(event.target === this) closeMarketDisclaimerModal()" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 hidden items-center justify-center p-3 sm:p-5">
    <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
      <!-- Modal Header -->
      <div class="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/80">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-base shrink-0 shadow-2xs">
            <i class="fa-solid fa-scale-balanced"></i>
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-black text-slate-900 leading-tight">중고거래 이용약관 및 면책 안내</h3>
            <p class="text-xs text-slate-500 mt-0.5">NJ Access Portal · 뉴저지 한인 광장</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Language Toggle [한국어 | English] -->
          <div class="inline-flex rounded-xl bg-slate-200/80 p-1 text-xs font-bold">
            <button type="button" id="modal-btn-disclaimer-ko" onclick="switchMarketDisclaimerLang('ko')" class="px-3 py-1 rounded-lg bg-white text-slate-900 shadow-2xs transition-all cursor-pointer">
              한국어
            </button>
            <button type="button" id="modal-btn-disclaimer-en" onclick="switchMarketDisclaimerLang('en')" class="px-3 py-1 rounded-lg text-slate-500 hover:text-slate-900 transition-all cursor-pointer">
              English
            </button>
          </div>

          <button type="button" onclick="closeMarketDisclaimerModal()" class="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-sm transition-colors cursor-pointer" aria-label="닫기">
            ✕
          </button>
        </div>
      </div>

      <!-- Modal Body (Scrollable) -->
      <div class="p-6 sm:p-7 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed max-h-[62vh]">
        <!-- Korean Version (Default) -->
        <div id="modal-disclaimer-content-ko" class="space-y-4">
          <h4 class="font-black text-slate-900 text-sm sm:text-base border-b border-slate-100 pb-2">중고거래 이용약관 및 면책 안내 (NJ Access Portal · 뉴저지 한인 광장)</h4>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">1. 서비스의 성격</p>
            <p>뉴저지 한인 광장 중고거래 게시판(이하 "게시판")은 회원 상호 간 물품 거래를 위한 온라인 게시 공간을 제공하는 서비스입니다. NJ Access Portal(이하 "당사")은 회원 간 거래의 당사자가 아니며, 매도인 또는 매수인을 대리하지 않습니다.</p>
          </div>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">2. 게시글에 대한 책임</p>
            <p>게시글의 내용, 상품의 상태·진위·가격 및 거래 조건의 정확성에 대한 책임은 해당 게시글의 작성자에게 있습니다. 당사는 게시글을 사전에 검수하거나 그 진위를 보증하지 않으며, 게시글의 내용에 대해 어떠한 의견도 표명하지 않습니다.</p>
          </div>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">3. 거래 관련 면책</p>
            <p>당사는 회원 간 거래와 관련하여 발생하는 다음 사항에 대해 어떠한 책임도 지지 않습니다.</p>
            <ul class="list-disc pl-5 mt-1 space-y-0.5 text-slate-600">
              <li>금전 거래 및 결제와 관련된 분쟁·손실</li>
              <li>사기, 허위 매물, 상품 하자로 인한 손해</li>
              <li>직거래 과정에서 발생하는 신체적·재산적 피해</li>
              <li>게시글의 정보를 신뢰함으로써 발생한 직·간접적 손해</li>
            </ul>
          </div>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">4. 이용자의 주의 의무</p>
            <p>이용자는 거래 전에 상품의 상태를 직접 확인하여야 하며, 선입금을 요구받는 경우 각별히 주의하시기 바랍니다. 가급적 사람이 많은 공공장소에서 직거래하시고, 시세를 미리 확인하시기 바랍니다.</p>
          </div>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">5. 게시글 관리</p>
            <p>당사는 본 안내에 위반되거나 사기·불법 행위로 의심되는 게시글을 사전 통지 없이 삭제할 수 있으며, 해당 회원의 게시판 이용을 제한할 수 있습니다. 의심스러운 게시글은 신고하기 기능을 통해 알려주시기 바랍니다.</p>
          </div>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">6. 준거법</p>
            <p>본 안내는 미국 뉴저지주 법을 준거법으로 합니다. 본 약관의 한국어본과 영어본이 상충하는 경우, 영어본이 우선합니다.</p>
          </div>
          <p class="pt-2 text-[11px] text-slate-400 font-medium">시행일: 2026년 10월 8일</p>
        </div>

        <!-- English Version -->
        <div id="modal-disclaimer-content-en" class="space-y-4 hidden">
          <h4 class="font-black text-slate-900 text-sm sm:text-base border-b border-slate-100 pb-2">Marketplace Terms &amp; Disclaimer (NJ Access Portal · 뉴저지 한인 광장)</h4>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">1. Nature of Service</p>
            <p>The buy-and-sell board of the NJ Korean Community Square ("the Board") is an online venue for transactions between members. NJ Access Portal ("the Company") is not a party to any transaction and does not act as agent for buyers or sellers.</p>
          </div>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">2. Responsibility for Listings</p>
            <p>The author of each listing is solely responsible for its content, including the condition, authenticity, and price of the item and the accuracy of the stated terms. The Company does not pre-screen listings, does not guarantee their truthfulness, and expresses no opinion on their content.</p>
          </div>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">3. Disclaimer</p>
            <p>The Company assumes no responsibility or liability for:</p>
            <ul class="list-disc pl-5 mt-1 space-y-0.5 text-slate-600">
              <li>disputes or losses related to payments or financial transactions;</li>
              <li>damages arising from fraud, false listings, or defective items;</li>
              <li>physical or property harm occurring in the course of in-person transactions;</li>
              <li>any direct or indirect damages resulting from reliance on listing information.</li>
            </ul>
          </div>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">4. User Precautions</p>
            <p>Users should inspect items in person before transacting, exercise extreme caution when asked to pay in advance, transact in busy public places whenever possible, and check market prices in advance.</p>
          </div>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">5. Listing Management</p>
            <p>The Company may remove, without prior notice, any listing that violates these terms or is suspected of fraud or illegal activity, and may restrict the offending member's use of the Board. Please report suspicious listings via the Report button.</p>
          </div>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">6. Governing Law</p>
            <p>These terms are governed by the laws of the State of New Jersey, USA. In the event of any conflict between the Korean and English versions, the English version shall prevail.</p>
          </div>
          <p class="pt-2 text-[11px] text-slate-400 font-medium">Effective: October 8, 2026</p>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
        <span class="text-[11px] text-slate-500 font-medium hidden sm:inline-block">※ 안전한 직거래를 위해 선입금을 지양하고 대면 거래를 권장합니다.</span>
        <button type="button" onclick="closeMarketDisclaimerModal()" class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer ml-auto">
          확인 및 닫기
        </button>
      </div>
    </div>
  </div>

  <!-- Services & Community Wanted Terms & Liability Disclaimer Popup Modal -->
  <div id="modal-service-disclaimer" onclick="if(event.target === this) closeServiceDisclaimerModal()" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 hidden items-center justify-center p-3 sm:p-5">
    <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
      <!-- Modal Header -->
      <div class="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-teal-50/70">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center text-base shrink-0 shadow-2xs">
            <i class="fa-solid fa-handshake-angle"></i>
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-black text-slate-900 leading-tight">생활·교육·커뮤니티 서비스 이용약관 및 면책 안내</h3>
            <p class="text-xs text-slate-500 mt-0.5">NJ Access Portal · 뉴저지 한인 광장 서비스</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Language Toggle [한국어 | English] -->
          <div class="inline-flex rounded-xl bg-slate-200/80 p-1 text-xs font-bold">
            <button type="button" id="modal-btn-service-disclaimer-ko" onclick="switchServiceDisclaimerLang('ko')" class="px-3 py-1 rounded-lg bg-white text-slate-900 shadow-2xs transition-all cursor-pointer">
              한국어
            </button>
            <button type="button" id="modal-btn-service-disclaimer-en" onclick="switchServiceDisclaimerLang('en')" class="px-3 py-1 rounded-lg text-slate-500 hover:text-slate-900 transition-all cursor-pointer">
              English
            </button>
          </div>

          <button type="button" onclick="closeServiceDisclaimerModal()" class="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-sm transition-colors cursor-pointer" aria-label="닫기">
            ✕
          </button>
        </div>
      </div>

      <!-- Modal Body (Scrollable) -->
      <div class="p-6 sm:p-7 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed max-h-[62vh]">
        <!-- Korean Version (Default) -->
        <div id="modal-service-disclaimer-content-ko" class="space-y-4">
          <h4 class="font-black text-slate-900 text-sm sm:text-base border-b border-slate-100 pb-2">생활·교육·커뮤니티 서비스 이용약관 및 면책 안내 (NJ Access Portal)</h4>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">1. 서비스의 성격 (Nature of Service)</p>
            <p>뉴저지 한인 광장 서비스 게시판(구해요·심부름, 과외·교육, 생활서비스, 동호회·모임)은 회원 상호 간 맞춤 생활 편의, 교육/레슨, 심부름 등 서비스 요청 및 제공에 관한 자율적 정보 교류를 돕는 온라인 게시판입니다. NJ Access Portal(이하 "당사")은 회원 간 체결되는 서비스 계약, 용역 제공, 고용 또는 거래의 당사자가 아니며, 서비스 제공자나 요청자를 대리하거나 보증하지 않습니다.</p>
          </div>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">2. 게시글 및 서비스 조건에 대한 책임</p>
            <p>게시글에 기재된 업무 내용, 보수/비용, 일정, 장소 및 업무 수행 능력에 대한 모든 법적·실질적 책임은 해당 게시글의 작성자 및 계약 당사자에게 있습니다. 전문 면허나 공인 자격증(의료, 법률, 전문 시공, 운송 등)이 요구되는 업무의 경우, 이용자는 상대방의 자격 증명서를 사전에 직접 확인하여야 하며, 당사는 이를 사전 검증하거나 보증하지 않습니다.</p>
          </div>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">3. 서비스 거래 및 사고 관련 면책</p>
            <p>당사는 회원 간 서비스 제공, 협의 또는 완료 과정에서 발생하는 다음 각 호의 손해 및 분쟁에 대해 어떠한 법적 책임도 지지 않습니다.</p>
            <ul class="list-disc pl-5 mt-1 space-y-0.5 text-slate-600">
              <li>서비스 미이행, 불완전 이행, 지연, 보수 미지급 등 계약 불이행 분쟁</li>
              <li>대면 미팅, 방문 서비스, 과외, 운송/심부름 등 수행 중 발생한 신체적 상해, 재산상 피해 및 안전사고</li>
              <li>선입금 사기, 허위 구인·구직, 불법 업무 요청으로 인한 금전적 피해</li>
              <li>게시글 정보를 신뢰함으로써 발생한 모든 직·간접적 손해</li>
            </ul>
          </div>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">4. 이용자의 주의 의무 &amp; 안전 수칙</p>
            <p>서비스가 시작되거나 완료되기 전 터무니없는 전액 선입금을 요구하는 경우 각별히 주의하시기 바랍니다. 대면 미팅이나 방문 서비스 진행 시 사전에 명확한 신원과 연락처를 확인하시고, 공개된 공공장소에서의 첫 미팅을 권장합니다. 의심스러운 게시글은 신고하기 기능을 통해 즉시 제보해 주시기 바랍니다.</p>
          </div>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">5. 게시글 관리 및 제재</p>
            <p>당사는 본 약관에 위배되거나 불법·사기·유해 행위로 의심되는 게시글을 사전 통지 없이 즉시 삭제할 수 있으며, 해당 회원의 서비스 이용 권한을 제한할 수 있습니다.</p>
          </div>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">6. 준거법</p>
            <p>본 안내는 미국 뉴저지주 법을 준거법으로 합니다. 본 약관의 한국어본과 영어본이 상충하는 경우, 영어본이 우선합니다.</p>
          </div>
          <p class="pt-2 text-[11px] text-slate-400 font-medium">시행일: 2026년 10월 8일</p>
        </div>

        <!-- English Version -->
        <div id="modal-service-disclaimer-content-en" class="space-y-4 hidden">
          <h4 class="font-black text-slate-900 text-sm sm:text-base border-b border-slate-100 pb-2">Community Services Terms &amp; Liability Disclaimer (NJ Access Portal)</h4>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">1. Nature of Service</p>
            <p>The Services board (Errands &amp; Requests, Tutoring &amp; Lessons, Daily Services, Community Clubs) is an open communication venue provided for community members to exchange service requests and offers. NJ Access Portal ("the Company") is not an employer, contractor, service provider, broker, or agent for any party.</p>
          </div>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">2. Responsibility for Terms &amp; Qualifications</p>
            <p>The author of each post and the participating parties are solely responsible for all terms, fees, work scopes, schedules, and task fulfillment. The Company does not pre-screen, verify, certify, or license service providers or requesters. Users must verify all required licenses or credentials independently.</p>
          </div>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">3. Limitation of Liability</p>
            <p>The Company disclaims all liability and responsibility for:</p>
            <ul class="list-disc pl-5 mt-1 space-y-0.5 text-slate-600">
              <li>contractual disputes, non-payment, delays, or failure to perform agreed services;</li>
              <li>physical injuries, property damages, or accidents occurring during in-person meetings or task execution;</li>
              <li>damages resulting from fraud, counterfeit requests, or unauthorized financial transactions;</li>
              <li>any direct or indirect damages arising from reliance on listing information.</li>
            </ul>
          </div>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">4. User Safety &amp; Precautions</p>
            <p>Never send full payments upfront prior to service commencement or milestone verification. Always confirm identity and scope of work in advance, meet in public places when possible, and report any suspicious postings using the Report button.</p>
          </div>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">5. Listing Management</p>
            <p>The Company reserves the right to delete listings and restrict user access without prior notice if fraudulent or unlawful conduct is suspected.</p>
          </div>
          <div>
            <p class="font-extrabold text-slate-900 mb-1">6. Governing Law</p>
            <p>These terms are governed by the laws of the State of New Jersey, USA. In the event of discrepancies between language versions, the English version shall govern.</p>
          </div>
          <p class="pt-2 text-[11px] text-slate-400 font-medium">Effective: October 8, 2026</p>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
        <span class="text-[11px] text-slate-500 font-medium hidden sm:inline-block">※ 원활하고 안전한 서비스 이용을 위해 사전 조건 합의 및 선입금 지양을 권장합니다.</span>
        <button type="button" onclick="closeServiceDisclaimerModal()" class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer ml-auto">
          확인 및 닫기
        </button>
      </div>
    </div>
  </div>

  <script>
    function openMarketDisclaimerModal() {
      const modal = document.getElementById('modal-market-disclaimer');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeMarketDisclaimerModal() {
      const modal = document.getElementById('modal-market-disclaimer');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.classList.remove('overflow-hidden');
      }
    }

    function switchMarketDisclaimerLang(lang) {
      const koContent = document.getElementById('modal-disclaimer-content-ko');
      const enContent = document.getElementById('modal-disclaimer-content-en');
      const koBtn = document.getElementById('modal-btn-disclaimer-ko');
      const enBtn = document.getElementById('modal-btn-disclaimer-en');

      if (lang === 'en') {
        koContent?.classList.add('hidden');
        enContent?.classList.remove('hidden');
        enBtn?.classList.add('bg-white', 'text-slate-900', 'shadow-2xs');
        enBtn?.classList.remove('text-slate-500');
        koBtn?.classList.remove('bg-white', 'text-slate-900', 'shadow-2xs');
        koBtn?.classList.add('text-slate-500');
      } else {
        enContent?.classList.add('hidden');
        koContent?.classList.remove('hidden');
        koBtn?.classList.add('bg-white', 'text-slate-900', 'shadow-2xs');
        koBtn?.classList.remove('text-slate-500');
        enBtn?.classList.remove('bg-white', 'text-slate-900', 'shadow-2xs');
        enBtn?.classList.add('text-slate-500');
      }
    }

    function openServiceDisclaimerModal() {
      const modal = document.getElementById('modal-service-disclaimer');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.classList.add('overflow-hidden');
      }
    }

    function closeServiceDisclaimerModal() {
      const modal = document.getElementById('modal-service-disclaimer');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.classList.remove('overflow-hidden');
      }
    }

    function switchServiceDisclaimerLang(lang) {
      const koContent = document.getElementById('modal-service-disclaimer-content-ko');
      const enContent = document.getElementById('modal-service-disclaimer-content-en');
      const koBtn = document.getElementById('modal-btn-service-disclaimer-ko');
      const enBtn = document.getElementById('modal-btn-service-disclaimer-en');

      if (lang === 'en') {
        koContent?.classList.add('hidden');
        enContent?.classList.remove('hidden');
        enBtn?.classList.add('bg-white', 'text-slate-900', 'shadow-2xs');
        enBtn?.classList.remove('text-slate-500');
        koBtn?.classList.remove('bg-white', 'text-slate-900', 'shadow-2xs');
        koBtn?.classList.add('text-slate-500');
      } else {
        enContent?.classList.add('hidden');
        koContent?.classList.remove('hidden');
        koBtn?.classList.add('bg-white', 'text-slate-900', 'shadow-2xs');
        koBtn?.classList.remove('text-slate-500');
        enBtn?.classList.remove('bg-white', 'text-slate-900', 'shadow-2xs');
        enBtn?.classList.add('text-slate-500');
      }
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeMarketDisclaimerModal();
        closeServiceDisclaimerModal();
      }
    });
  </script>
<?php
}

function render_forum_auth_scripts() {
?>
  <script>
    let currentUser = null;

    async function checkAuth() {
      try {
        const res = await fetch('/api/forum_auth.php?action=me');
        const data = await res.json();
        if (data.success && data.logged_in && data.user) {
          currentUser = data.user;
          renderAuthBox();
          if (typeof syncAuthorFields === 'function') {
            syncAuthorFields();
          }
        }
      } catch(e) {}
    }

    function escapeHtml(str) {
      if (!str) return '';
      const div = document.createElement('div');
      div.innerText = str;
      return div.innerHTML;
    }

    function renderAuthBox() {
      const box = document.getElementById('auth-box');
      if (!box) return;

      if (currentUser) {
        box.innerHTML = `
          <div class="flex items-center gap-1.5 bg-white/15 py-1 px-2 rounded-lg border border-white/20 text-xs shrink-0 text-white">
            <img src="${currentUser.avatar || '/assets/avatars/avatar_01.svg'}" class="w-5 h-5 rounded-full object-cover shrink-0">
            <span class="font-bold max-w-[60px] sm:max-w-[90px] truncate" title="${escapeHtml(currentUser.name)}">${escapeHtml(currentUser.name)}</span>
            ${currentUser.isVerifiedClinician ? '<span class="text-[9px] bg-emerald-500 text-white font-extrabold px-1.5 py-0.2 rounded-full shrink-0">의사</span>' : ''}
            ${currentUser.isVerifiedExpert && !currentUser.isVerifiedClinician ? '<span class="text-[9px] bg-[#7FC8C0] text-slate-900 font-extrabold px-1.5 py-0.2 rounded-full shrink-0">전문가</span>' : ''}
            <button onclick="handleLogout()" class="text-white/60 hover:text-white ml-1 text-xs" title="로그아웃">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          </div>
        `;
      } else {
        box.innerHTML = `
          <button onclick="openGoogleAuthModal()" id="btn-login" class="text-xs font-bold bg-white/15 hover:bg-white/25 text-white border border-white/20 px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow-2xs" title="Google 로그인">
            <i class="fa-brands fa-google text-red-400 text-xs"></i>
            <span class="hidden sm:inline">로그인</span>
          </button>
        `;
      }
    }

    function openGoogleAuthModal() {
      const modal = document.getElementById('google-auth-modal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      }
      try {
        if (window.google && google.accounts && google.accounts.id) {
          google.accounts.id.initialize({
            client_id: "1095851141884-g8t2tblr3pjrdtu5uq65oisa7i2al1a9.apps.googleusercontent.com",
            callback: handleGoogleSignIn,
            auto_prompt: false
          });
          const btnTarget = document.querySelector('.g_id_signin');
          if (btnTarget) {
            google.accounts.id.renderButton(btnTarget, {
              type: "standard",
              shape: "pill",
              theme: "outline",
              text: "signin_with",
              size: "large",
              logo_alignment: "left"
            });
          }
          google.accounts.id.prompt();
        }
      } catch(e) {}
    }

    function closeGoogleAuthModal() {
      const modal = document.getElementById('google-auth-modal');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
      if (typeof onForumLoginDismissed === 'function') {
        onForumLoginDismissed();
      }
    }

    function openNicknameModal() {
      const modal = document.getElementById('modal-edit-nickname');
      const input = document.getElementById('input-edit-nickname');
      if (input && currentUser) input.value = currentUser.name || '';
      if (modal) modal.classList.remove('hidden'), modal.classList.add('flex');
    }

    function closeNicknameModal() {
      const modal = document.getElementById('modal-edit-nickname');
      if (modal) modal.classList.add('hidden'), modal.classList.remove('flex');
    }

    async function handleUpdateNickname(e) {
      e.preventDefault();
      const newName = document.getElementById('input-edit-nickname')?.value.trim();
      if (!newName) return;

      try {
        const res = await fetch('/api/forum_auth.php?action=update_name', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({name: newName})
        });
        const data = await res.json();
        if (data.success && data.user) {
          currentUser = data.user;
          renderAuthBox();
          if (typeof syncAuthorFields === 'function') {
            syncAuthorFields();
          }
          closeNicknameModal();
        } else {
          alert(data.error || '닉네임 변경에 실패했습니다.');
        }
      } catch(e) {
        alert('서버 연결 중 오류가 발생했습니다.');
      }
    }

    async function handleGoogleSignIn(response) {
      try {
        const res = await fetch('/api/forum_auth.php?action=google_login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({credential: response.credential})
        });
        const data = await res.json();
        if (data.success) {
          currentUser = data.user;
          renderAuthBox();
          if (typeof syncAuthorFields === 'function') {
            syncAuthorFields();
          }
          closeGoogleAuthModal();
          if (typeof onForumLoginSuccess === 'function') {
            onForumLoginSuccess(currentUser);
          }
        } else {
          alert(data.error || '로그인에 실패했습니다.');
        }
      } catch(e) {
        alert('로그인 오류가 발생했습니다.');
      }
    }

    async function handleDirectGoogleSignIn(e) {
      e.preventDefault();
      const email = document.getElementById('login-google-email')?.value.trim();
      const name = document.getElementById('login-google-name')?.value.trim();
      if (!email) return;

      try {
        const res = await fetch('/api/forum_auth.php?action=email_login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email, name})
        });
        const data = await res.json();
        if (data.success) {
          currentUser = data.user;
          renderAuthBox();
          if (typeof syncAuthorFields === 'function') {
            syncAuthorFields();
          }
          closeGoogleAuthModal();
          if (typeof onForumLoginSuccess === 'function') {
            onForumLoginSuccess(currentUser);
          }
        } else {
          alert(data.error || '로그인에 실패했습니다.');
        }
      } catch(e) {
        alert('로그인 오류가 발생했습니다.');
      }
    }

    async function handleLogout() {
      await fetch('/api/forum_auth.php?action=logout');
      currentUser = null;
      renderAuthBox();
      if (typeof syncAuthorFields === 'function') {
        syncAuthorFields();
      }
    }

    function toggleMobileNavMenu() {
      const menu = document.getElementById('mobile-menu-dropdown');
      if (!menu) return;
      const isOpen = menu.classList.contains('mobile-menu-open') || menu.style.maxHeight === '85vh' || (!menu.classList.contains('max-h-0') && menu.style.maxHeight !== '0px');
      if (isOpen) {
        menu.classList.remove('mobile-menu-open');
        menu.classList.add('max-h-0', 'opacity-0');
        menu.style.maxHeight = '0px';
        menu.style.opacity = '0';
        menu.style.pointerEvents = 'none';
      } else {
        menu.classList.remove('max-h-0', 'opacity-0');
        menu.classList.add('mobile-menu-open');
        menu.style.maxHeight = '85vh';
        menu.style.opacity = '1';
        menu.style.pointerEvents = 'auto';
        menu.style.display = 'flex';
      }
    }

    document.addEventListener('DOMContentLoaded', checkAuth);
  </script>
<?php
}

function render_forum_footer() {
?>
  <!-- Global Footer Matching Website -->
  <footer class="text-white mt-auto border-t border-slate-800" style="background-color: #0B192C;">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <div class="lg:col-span-2">
          <div class="engine-logo-row flex items-center gap-3.5 sm:gap-4 mb-4 flex-wrap">
            <a class="inline-flex items-center group cursor-pointer njap-brand-link" href="/" title="NJ Access Portal · 뉴저지 한인 포털">
              <svg class="h-9 sm:h-10 w-auto object-contain" viewBox="0 0 320 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(4, 2) scale(0.56)" stroke-linecap="round" stroke-linejoin="round">
                  <g stroke="#FFFFFF">
                    <line x1="20" y1="12" x2="20" y2="88" stroke-width="3.5" />
                    <rect x="25" y="12" width="55" height="76" rx="2" stroke-width="4" fill="none" />
                    <polyline points="25,16 52,25 52,36" stroke-width="3.5" />
                    <text x="52.5" y="81" font-family="'Times New Roman', serif" font-size="13.5" font-weight="900" letter-spacing="1.5" fill="#FFFFFF" stroke="none" text-anchor="middle">NJAP</text>
                  </g>
                  <path d="M 43,45 A 7,7 0 1,1 53,45 L 56,64 L 40,64 Z" stroke="#EF4444" stroke-width="3.5" fill="none" />
                  <circle cx="74" cy="45" r="6.5" stroke="#EF4444" stroke-width="3.5" fill="none" />
                  <line x1="47" y1="45" x2="67.5" y2="45" stroke="#EF4444" stroke-width="3.5" />
                </g>
                <text x="64" y="27" font-family="Pretendard, system-ui, sans-serif" font-size="18" font-weight="900" fill="#FFFFFF">NJ Access Portal</text>
                <text x="64" y="44" font-family="Pretendard, system-ui, sans-serif" font-size="10.5" font-weight="700" fill="#FFFFFF">뉴저지 한인 포털</text>
              </svg>
            </a>
            <!-- Highly Visible Engine Button Next to Logo -->
            <a href="/engine" target="_self" class="engine-footer-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-extrabold text-sm tracking-wide shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer" style="background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #0284C7 100%) !important; color: #ffffff !important; border: 1.5px solid #38BDF8 !important; box-shadow: 0 4px 18px rgba(56, 189, 248, 0.35) !important; text-decoration: none !important;" title="Universal Access Engine 포트폴리오 바로가기">
              <svg class="w-4 h-4 text-cyan-200" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>
              <span style="color: #ffffff !important; font-weight: 800; letter-spacing: 0.02em;">Engine</span>
              <svg class="w-3.5 h-3.5 text-cyan-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
            </a>
          </div>

          <!-- Engine B2B Callout Box -->
          <div class="engine-footer-card mb-5 p-3.5 sm:p-4 rounded-xl border border-sky-500/30 text-xs leading-relaxed max-w-sm shadow-md" style="background: rgba(15, 23, 42, 0.75) !important;">
            <div class="font-bold flex items-start gap-1.5 mb-1.5" style="color: #ffffff !important;">
              <span class="engine-footer-badge font-extrabold" style="color: #38BDF8 !important;">Engine:</span>
              <span style="color: #F1F5F9 !important;">For Hospitals, Physician group and Insurance Company.</span>
            </div>
            <div class="engine-footer-text" style="color: #94A3B8 !important; font-size: 12px;">
              Contact us at <a href="mailto:NJACCESSPORTAL@GMAIL.COM" class="engine-footer-mail underline font-bold transition-colors" style="color: #38BDF8 !important;">NJACCESSPORTAL@GMAIL.COM</a> to access our portfolio.
            </div>
          </div>

          <p class="text-xs sm:text-sm text-white/60 font-sans leading-relaxed max-w-sm mb-4">
            뉴저지 한인 커뮤니티를 위한 동포 나눔 &amp; 의료 네비게이션 포털. 병원 후기, 보험 Q&amp;A, 생활 정보, 중고거래, 서비스, 구직을 함께 나눕니다.
          </p>
        </div>
        <div>
          <p class="text-xs font-sans font-extrabold uppercase tracking-widest text-[#38BDF8] mb-3">뉴저지 한인 광장</p>
          <ul class="space-y-2 text-xs text-white/70">
            <li><a class="hover:text-white transition-colors" href="/forum?specialty=medical">의료관련</a></li>
            <li><a class="hover:text-white transition-colors" href="/forum?specialty=community">자유게시판</a></li>
            <li><a class="hover:text-white transition-colors" href="/forum?specialty=market">마켓플레이스</a></li>
            <li><a class="hover:text-white transition-colors" href="/forum?specialty=wanted">서비스 (구해요·교육·커뮤니티)</a></li>
            <li><a class="hover:text-white transition-colors" href="/forum?specialty=jobs">구인 / 구직</a></li>
            <li><a class="hover:text-white transition-colors" href="/forum?specialty=food">맛집 탐방</a></li>
            <li><a class="hover:text-white transition-colors" href="/forum?specialty=columns">전문가 칼럼</a></li>
            <li><a class="hover:text-white transition-colors" href="/forum?specialty=events">이벤트</a></li>
            <li><a class="hover:text-white transition-colors" href="/forum?specialty=clubs">동호회/동문회</a></li>
          </ul>
        </div>
        <div>
          <p class="text-xs font-sans font-extrabold uppercase tracking-widest text-[#38BDF8] mb-3">정보 센터</p>
          <ul class="space-y-2 text-xs text-white/70">
            <li><a class="hover:text-white transition-colors" href="/blog">건강 &amp; 복지 뉴스</a></li>
            <li><a class="hover:text-white transition-colors" href="/resource-center">의료&amp;커뮤니티 정보센터</a></li>
            <li><a class="hover:text-white transition-colors" href="/medicare">메디케어 종합 가이드</a></li>
            <li><a class="hover:text-white transition-colors" href="/about">의료 접근센터 소개</a></li>
          </ul>
        </div>
        <div>
          <p class="text-xs font-sans font-extrabold uppercase tracking-widest text-[#38BDF8] mb-3">상담 및 문의</p>
          <ul class="space-y-2 text-xs text-white/70">
            <li><a class="hover:text-white transition-colors" href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer">카카오톡 1:1 상담</a></li>
            <li><a class="hover:text-white transition-colors" href="/contact">문의 양식 작성</a></li>
            <li><a class="hover:text-white transition-colors" href="/calculator">보험 보조금 계산기</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div class="text-[11px] font-sans text-white/40 max-w-3xl leading-relaxed">
          <strong class="text-white/60">⚠ 의료 및 법률 면책 조항:</strong> 본 포럼에 게재된 모든 글과 댓글은 작성자의 개인 의견 및 정보 제공 목적이며, 개별 의학적 진단/처방 또는 법률적 자문을 대신할 수 없습니다. 응급 상황 시에는 즉시 911을 호출하십시오.
        </div>
        <p class="text-[11px] font-sans text-white/40 whitespace-nowrap">© 2026 NJ Access Portal · 뉴저지 한인 포털</p>
      </div>
    </div>
  </footer>
<?php
}

/**
 * Helper to determine category bracket tag like [의류], [화장품], [악세사리], [가전], [부동산], [맛집]
 */
function forum_get_item_bracket_tag(array $q, string $category = ''): string {
    $sub = (string)($q['subBoardId'] ?? '');
    $title = (string)($q['title'] ?? '');
    $cat = (string)($q['categoryId'] ?? $category);

    // 1. Direct subBoard matches
    if (str_contains($sub, 'fashion') || str_contains($sub, 'cloth')) return '의류';
    if (str_contains($sub, 'cosmetic') || str_contains($sub, 'beauty')) return '화장품';
    if (str_contains($sub, 'jewelry') || str_contains($sub, 'acc')) return '악세사리';
    if (str_contains($sub, 'electronic')) return '가전';
    if (str_contains($sub, 'furniture')) return '가구·생활';
    if (str_contains($sub, 'auto')) return '자동차';
    if (str_contains($sub, 'realestate')) return '부동산';

    // 2. Marketplace title keywords
    if ($cat === 'market' || str_contains($sub, 'market')) {
        if (preg_match('/(티셔츠|셔츠|베스트|니트|큐롯|원피스|바지|자켓|코트|패딩|신발|의류|xs|블라우스|스커트)/ui', $title)) {
            return '의류';
        }
        if (preg_match('/(세럼|토너|화장품|크림|에센스|로션|미스트|앰플|클렌징)/ui', $title)) {
            return '화장품';
        }
        if (preg_match('/(Bracelet|팔찌|목걸이|반지|귀걸이|악세사리|14K|18K|다이아|골드)/ui', $title)) {
            return '악세사리';
        }
        if (preg_match('/(렌트|매매|아파트|콘도|하우스|부동산|원룸|투룸)/ui', $title)) {
            return '부동산';
        }
        if (preg_match('/(자동차|혼다|도요타|현대|기아|차량|AWD|마일)/ui', $title)) {
            return '자동차';
        }
        if (preg_match('/(가구|소파|식탁|책상|의자|침대|매트리스|서랍장)/ui', $title)) {
            return '가구·생활';
        }
        if (preg_match('/(TV|모니터|스마트폰|아이폰|갤럭시|노트북|맥북|전자제품|가전)/ui', $title)) {
            return '가전';
        }
        return '벼룩';
    }

    // 3. Food title keywords
    if ($cat === 'food' || str_contains($sub, 'food')) {
        if (preg_match('/(카페|커피|디저트|베이커리|브런치|빵집)/ui', $title)) {
            return '카페';
        }
        if (preg_match('/(반찬|밀키트|김치)/ui', $title)) {
            return '반찬';
        }
        if (preg_match('/(국수|만두|칼국수|고기|돼지|삼겹살|갈비|국밥|찌개|한식)/ui', $title)) {
            return '한식';
        }
        if (preg_match('/(스시|일식|라멘|돈까스)/ui', $title)) {
            return '일식';
        }
        if (preg_match('/(짜장|짬뽕|탕수육|중식)/ui', $title)) {
            return '중식';
        }
        return '맛집';
    }

    // 4. Events title keywords
    if ($cat === 'events' || str_contains($sub, 'event')) {
        if (preg_match('/(세미나|강좌|설명회|특강)/ui', $title)) {
            return '세미나';
        }
        if (preg_match('/(축제|대잔치|페스티벌|행사)/ui', $title)) {
            return '축제';
        }
        if (preg_match('/(교실|서예|수업|문화|한글)/ui', $title)) {
            return '문화';
        }
        if (preg_match('/(대회|토너먼트|탁구|골프|체육|친선)/ui', $title)) {
            return '체육';
        }
        return '이벤트';
    }

    return '일반';
}

/**
 * Formats a thread title for community board listings:
 * Keeps the overall title in clean, comfortable regular font weight,
 * while selectively emphasizing key tags/names (e.g., [병원후기] + hospital name or key subject) in bold.
 */
function forum_format_list_title(string $rawTitle): string {
    $rawTitle = trim(strip_tags($rawTitle));
    if ($rawTitle === '') return '';

    // Check if starts with bracket tag like [병원후기], [병원안내/고정], [보험/의료비], [구인]
    if (preg_match('/^(\[[^\]]+\])\s*(.*)$/u', $rawTitle, $m)) {
        $tag = $m[1];
        $rest = trim($m[2]);

        // Check if $rest starts with a notable subject/entity like 'RWJ바나바스', '잉글우드 병원', '뉴저지 6대 종합병원'
        if (preg_match('/^([^\(\,\.\!\?\:\-]{2,28})\s*(.*)$/u', $rest, $mEntity) && mb_strlen(trim($mEntity[1])) <= 25) {
            $emph = trim($mEntity[1]);
            $tail = trim($mEntity[2]);
            return '<span class="font-bold text-[#1B6FA8]">' . htmlspecialchars($tag) . '</span> ' 
                 . '<strong class="font-bold text-slate-900">' . htmlspecialchars($emph) . '</strong>' 
                 . ($tail !== '' ? ' <span class="font-normal text-slate-700">' . htmlspecialchars($tail) . '</span>' : '');
        }

        return '<strong class="font-bold text-slate-900">' . htmlspecialchars($tag) . '</strong> ' 
             . '<span class="font-normal text-slate-700">' . htmlspecialchars($rest) . '</span>';
    }

    // No bracket tag: look for comma/colon/hyphen delimiter or first 2 words to emphasize
    if (preg_match('/^([^\,\:\-]{2,18})([\s\,\:\-].*)$/u', $rawTitle, $mNoTag)) {
        $firstPart = trim($mNoTag[1]);
        $words = preg_split('/\s+/u', $firstPart);
        if (count($words) <= 3) {
            $tail = ltrim($mNoTag[2]);
            return '<strong class="font-bold text-slate-900">' . htmlspecialchars($firstPart) . '</strong> ' 
                 . '<span class="font-normal text-slate-700">' . htmlspecialchars($tail) . '</span>';
        }
    }

    // Fallback: emphasize first 2 words, rest normal weight
    $words = preg_split('/\s+/u', $rawTitle);
    if (count($words) > 2) {
        $emph = implode(' ', array_slice($words, 0, 2));
        $tail = implode(' ', array_slice($words, 2));
        return '<strong class="font-bold text-slate-900">' . htmlspecialchars($emph) . '</strong> ' 
             . '<span class="font-normal text-slate-700">' . htmlspecialchars($tail) . '</span>';
    }

    return '<span class="font-normal text-slate-800">' . htmlspecialchars($rawTitle) . '</span>';
}

/**
 * Emoticon avatar picker (circle ID badge icon chooser) for post & reply forms.
 * Provides exactly 20 friendly circular emoticon badges with persistent selection.
 */
function render_avatar_picker(string $prefix = 'ask') {
    $avatars20 = [
      ['id' => 'avatar_01', 'name' => '따뜻한 미소', 'desc' => '친절한 이웃'],
      ['id' => 'avatar_02', 'name' => '청진기 의료', 'desc' => '의료진·건강'],
      ['id' => 'avatar_03', 'name' => '싱그런 새싹', 'desc' => '웰빙·치유'],
      ['id' => 'avatar_04', 'name' => '모닝 커피', 'desc' => '동네 카페·수다'],
      ['id' => 'avatar_05', 'name' => '귀여운 냥이', 'desc' => '반려묘'],
      ['id' => 'avatar_06', 'name' => '충직한 댕댕이', 'desc' => '반려견'],
      ['id' => 'avatar_07', 'name' => '건강 비타민', 'desc' => '약·영양'],
      ['id' => 'avatar_08', 'name' => '아늑한 우리집', 'desc' => '내집·부동산'],
      ['id' => 'avatar_09', 'name' => '아침 사과', 'desc' => '신선한 아침'],
      ['id' => 'avatar_10', 'name' => '포근한 곰돌이', 'desc' => '포근한 캐릭터'],
      ['id' => 'avatar_11', 'name' => '화사한 벚꽃', 'desc' => '봄·희망'],
      ['id' => 'avatar_12', 'name' => '행운 클로버', 'desc' => '행운과 축복'],
      ['id' => 'avatar_13', 'name' => '스마트 안경', 'desc' => '전문가·지식'],
      ['id' => 'avatar_14', 'name' => '반짝이는 별', 'desc' => '긍정 에너지'],
      ['id' => 'avatar_15', 'name' => '다정한 어르신', 'desc' => '시니어 어르신'],
      ['id' => 'avatar_16', 'name' => '온화한 어르신', 'desc' => '시니어 어르신'],
      ['id' => 'avatar_17', 'name' => '이웃과 함께', 'desc' => '나눔·동행'],
      ['id' => 'avatar_18', 'name' => '나눔의 하트', 'desc' => '배려와 사랑'],
      ['id' => 'avatar_19', 'name' => '건강 식단', 'desc' => '영양·웰빙'],
      ['id' => 'avatar_20', 'name' => '뉴저지 이웃', 'desc' => 'NJ 로컬']
    ];
?>
  <div class="avatar-picker bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/90" data-prefix="<?= htmlspecialchars($prefix) ?>">
    <input type="hidden" id="<?= $prefix ?>-author-avatar" name="author_avatar" value="">
    
    <!-- Title & Explanation -->
    <div class="flex items-center justify-between gap-2 mb-2.5">
      <div class="flex items-center gap-2">
        <span class="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
          <i class="fa-solid fa-id-badge text-[#1B6FA8]"></i>
          ID 뱃지 아이콘 선택
        </span>
        <span class="text-[11px] font-bold text-[#1B6FA8] bg-blue-100/70 border border-blue-200 px-2 py-0.5 rounded-full">20가지 아이콘</span>
      </div>
      <span class="text-[11px] text-slate-500 hidden sm:inline">글·댓글 작성자 원형 뱃지에 표시됩니다</span>
    </div>

    <!-- Selection Bar -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
      <!-- Live Preview -->
      <div class="flex items-center gap-3 shrink-0 pr-0 sm:pr-3.5 border-b sm:border-b-0 sm:border-r border-slate-100 sm:border-slate-200 pb-2.5 sm:pb-0">
        <img id="<?= $prefix ?>-avatar-preview" src="/assets/avatars/avatar_01.svg" alt="선택된 ID 뱃지"
             class="w-12 h-12 rounded-full shrink-0 border-2 border-[#1B6FA8] bg-white shadow-xs object-contain">
        <div>
          <span class="text-[10px] text-slate-400 block font-bold leading-tight">내 ID 뱃지 미리보기</span>
          <span id="<?= $prefix ?>-avatar-name" class="text-xs font-black text-slate-900 leading-tight">따뜻한 미소</span>
        </div>
      </div>

      <!-- 20 Icon Choice Grid -->
      <div id="<?= $prefix ?>-avatar-grid" class="avatar-grid flex flex-wrap gap-2 items-center flex-1">
        <?php foreach ($avatars20 as $a):
          $src = "/assets/avatars/{$a['id']}.svg"; ?>
          <button type="button" class="avatar-opt" data-src="<?= $src ?>" data-name="<?= htmlspecialchars($a['name']) ?>" title="<?= htmlspecialchars($a['name'] . ' (' . $a['desc'] . ')') ?>"
                  onclick="selectForumAvatar('<?= $prefix ?>', '<?= $src ?>', '<?= htmlspecialchars($a['name']) ?>')">
            <img src="<?= $src ?>" alt="<?= htmlspecialchars($a['name']) ?>" loading="lazy">
          </button>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
  <?php static $avatarAssetsPrinted = false; if (!$avatarAssetsPrinted): $avatarAssetsPrinted = true; ?>
  <style>
    .avatar-opt { width: 36px; height: 36px; border-radius: 9999px; padding: 0; border: 2px solid transparent; background: none; cursor: pointer; transition: transform .15s cubic-bezier(0.2, 0.8, 0.4, 1), box-shadow .15s, border-color .15s; flex-shrink: 0; }
    .avatar-opt img { width: 100%; height: 100%; border-radius: 9999px; display: block; }
    .avatar-opt:hover { transform: scale(1.18); box-shadow: 0 4px 10px rgba(0,0,0,0.12); }
    .avatar-opt.selected { border-color: #1B6FA8; box-shadow: 0 0 0 3px rgba(27,111,168,.3); transform: scale(1.12); }
    body.senior-mode .avatar-opt { width: 44px; height: 44px; }
  </style>
  <script>
    function selectForumAvatar(prefix, src, name) {
      const input = document.getElementById(prefix + '-author-avatar');
      const preview = document.getElementById(prefix + '-avatar-preview');
      const nameEl = document.getElementById(prefix + '-avatar-name');
      if (input) input.value = src;
      if (preview) preview.src = src;
      if (nameEl && name) nameEl.textContent = name;
      document.querySelectorAll('#' + prefix + '-avatar-grid .avatar-opt').forEach(b => {
        const isSel = b.dataset.src === src;
        b.classList.toggle('selected', isSel);
        if (isSel && nameEl && !name) {
          nameEl.textContent = b.dataset.name || '선택된 아이콘';
        }
      });
      try {
        localStorage.setItem('njap_forum_avatar', src);
        if (name) localStorage.setItem('njap_forum_avatar_name', name);
      } catch(e) {}
    }
    function getForumAvatar(prefix) {
      const el = document.getElementById(prefix + '-author-avatar');
      return el ? el.value : '';
    }
    document.addEventListener('DOMContentLoaded', () => {
      let saved = '';
      let savedName = '';
      try {
        saved = localStorage.getItem('njap_forum_avatar') || '';
        savedName = localStorage.getItem('njap_forum_avatar_name') || '';
      } catch(e) {}
      document.querySelectorAll('.avatar-picker').forEach(p => {
        const prefix = p.dataset.prefix;
        let initial = /^\/assets\/avatars\/avatar_\d{2}\.svg$/.test(saved) ? saved : '';
        if (!initial && typeof currentUser !== 'undefined' && currentUser && /^\/assets\/avatars\//.test(currentUser.avatar || '')) {
          initial = currentUser.avatar;
        }
        selectForumAvatar(prefix, initial || '/assets/avatars/avatar_01.svg', savedName);
      });
    });
  </script>
  <?php endif; ?>
<?php
}

/**
 * In-page image lightbox. Any <img data-lightbox> or <a data-lightbox href=...> opens
 * in an overlay on the same page; clicking the X, the image, the backdrop, or Esc closes it.
 */
function render_image_lightbox() {
?>
  <div id="njap-lightbox" class="fixed inset-0 z-[200] hidden items-center justify-center bg-slate-950/85 p-4" role="dialog" aria-modal="true" aria-label="이미지 크게 보기">
    <button type="button" id="njap-lightbox-close" aria-label="닫기"
            class="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white text-xl flex items-center justify-center transition-colors">
      <i class="fa-solid fa-xmark"></i>
    </button>
    <img id="njap-lightbox-img" src="" alt="확대 이미지" class="max-w-full max-h-[88vh] rounded-xl shadow-2xl cursor-zoom-out object-contain">
  </div>
  <script>
    (function () {
      const box = document.getElementById('njap-lightbox');
      const img = document.getElementById('njap-lightbox-img');
      function open(src, alt) {
        img.src = src; img.alt = alt || '확대 이미지';
        box.classList.remove('hidden'); box.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
      function close() {
        box.classList.add('hidden'); box.classList.remove('flex');
        img.src = ''; document.body.style.overflow = '';
      }
      window.openNjapLightbox = open;
      // Close on X, on the image itself, or on the dark backdrop
      box.addEventListener('click', close);
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && !box.classList.contains('hidden')) close(); });
      document.addEventListener('click', e => {
        const t = e.target.closest('[data-lightbox]');
        if (!t || box.contains(t)) return;
        e.preventDefault();
        const src = t.getAttribute('href') || t.getAttribute('src') || (t.querySelector('img') || {}).src;
        if (src) open(src, (t.querySelector('img') || t).getAttribute('alt'));
      });
    })();
  </script>
<?php
}
