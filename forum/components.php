<?php
/**
 * Shared Discourse / Cursor Forum Components for NJAP Medical Forum
 */

function render_forum_header(string $searchQuery = '', ?array $currentSpecialty = null) {
?>
  <!-- Top Marquee Banner Matching Website -->
  <div class="fixed top-0 left-0 right-0 z-50 overflow-hidden flex items-center" style="height: 45px; background:#000000">
    <div class="marquee-track whitespace-nowrap">
      <?php for ($i = 0; $i < 6; $i++): ?>
        <span class="inline-block font-sans text-xs text-white/90 tracking-wide px-12">
          <span class="opacity-60 mr-3">✦</span>의료접근포탈: &quot;비영리 기관들의 의료관련 정보서비스의 한계를 넘어, 최고의 의료 전문가들이 제공하는 언어와 문화의 장벽 없이, 분야별 최고 전문가가 함께하는 무료 프리미엄 의료 접근·네비게이션 서비스&quot;<span class="opacity-60 ml-3">✦</span>
        </span>
      <?php endfor; ?>
    </div>
  </div>

  <!-- Main Website Navigation Bar -->
  <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs" style="top:45px">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 gap-2">
        
        <!-- Left: Sidebar Mobile Toggle + Brand Logo -->
        <div class="flex items-center gap-1.5 sm:gap-3 shrink-0 min-w-0">
          <button id="sidebar-toggle-btn" onclick="toggleForumSidebar()" 
            class="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
            title="진료과목 메뉴 열기/접기" aria-label="메뉴 토글">
            <i class="fa-solid fa-bars text-sm"></i>
          </button>

          <a class="min-w-0 flex items-center gap-2 cursor-pointer njap-brand-link" href="/" onclick="navigateToHome(event); return false;">
            <div class="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
              <img src="/logo-icon.svg" alt="NJAP Logo" class="w-full h-full object-contain transition-transform group-hover:scale-105" />
            </div>
            <div class="min-w-0">
              <span class="font-serif text-xs sm:text-base md:text-xl text-brand-dark group-hover:text-brand-blue transition-colors duration-200 block truncate font-bold leading-tight">Healthcare Access</span>
              <span class="hidden sm:block text-[9px] sm:text-[10px] font-sans text-brand-muted leading-tight -mt-0.5 truncate">뉴저지 한인 의료 접근 포털</span>
            </div>
          </a>
        </div>

        <!-- Center: Main Webpage Navigation Links -->
        <div class="hidden lg:flex items-center space-x-1 xl:space-x-3 text-[14px]">
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue cursor-pointer" href="/" onclick="navigateToHome(event); return false;">홈</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/blog">뉴스</a>
          <a class="nav-link pb-0.5 font-bold text-brand-blue" href="/forum">커뮤니티 포럼</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/senior-care">시니어 케어</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/medicare">메디케어 &amp; ACA</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/tool">환자도우미</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/about">소개</a>
        </div>

        <!-- Right: Kakao 1:1, EN Switch, Forum Auth Box & New Topic Button -->
        <div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <!-- KakaoTalk 1:1 Chat Button (hidden on mobile, visible sm+) -->
          <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="hidden sm:inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer" title="카카오톡 1:1 상담 바로가기">
            <img src="/kakaotalk-icon.png" alt="KakaoTalk" class="w-6 h-6 rounded-md shrink-0 object-contain shadow-xs" />
            <span class="text-xs sm:text-sm font-bold text-slate-800 hover:text-brand-blue tracking-tight whitespace-nowrap">1:1 상담</span>
          </a>

          <!-- EN Translation Toggle Button -->
          <button id="senior-mode-btn" class="senior-mode-btn notranslate" translate="no" type="button" onclick="window.cycleSeniorMode && window.cycleSeniorMode()" title="시니어모드+ (글자 크기 3단계 조절)" aria-label="시니어모드 글자 크기 조절"><span class="senior-btn-label">시니어모드+</span><span class="senior-step-badge" style="display:none;"></span></button>
          <button id="en-translate-btn" class="notranslate" translate="no" onclick="window.toggleTranslation && window.toggleTranslation()" title="Switch Language (EN / KR)" aria-label="Language Toggle" style="display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:999px;border:1.5px solid #cbd5e1;font-size:10px;font-weight:700;letter-spacing:0.04em;cursor:pointer;transition:all 0.2s ease;background:transparent;color:#475569;white-space:nowrap;flex-shrink:0;line-height:1.4;"><span class="notranslate" translate="no">🌐</span> <span class="notranslate en-btn-label" translate="no">EN</span></button>

          <!-- Forum Auth Profile / Google Login -->
          <div id="auth-box" class="flex items-center gap-1 shrink-0">
            <button onclick="openGoogleAuthModal()" id="btn-login" class="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-2 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow-2xs">
              <i class="fa-brands fa-google text-red-500 text-xs"></i>
              <span class="hidden xs:inline">로그인</span>
            </button>
          </div>

          <!-- Forum Style New Topic Button (Icon only on mobile, text on sm+) -->
          <a href="/forum/ask<?= ($currentSpecialty && ($currentSpecialty['id'] ?? '') !== 'events') ? '?specialty=' . urlencode($currentSpecialty['id']) : '' ?>" 
             class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs p-2 sm:px-3 sm:py-1.5 rounded-lg transition-all shadow-xs flex items-center gap-1.5 shrink-0"
             title="질문/정보 공유">
            <i class="fa-solid fa-plus text-xs"></i>
            <span class="hidden sm:inline">질문/정보 공유</span>
          </a>

          <!-- Mobile Nav Hamburger Button -->
          <button id="mobile-menu-btn" onclick="toggleMobileNavMenu()" class="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0" aria-label="Menu">
            <div class="w-5 h-4 flex flex-col justify-between">
              <span class="block h-0.5 bg-brand-dark rounded-full"></span>
              <span class="block h-0.5 bg-brand-dark rounded-full"></span>
              <span class="block h-0.5 bg-brand-dark rounded-full"></span>
            </div>
          </button>
        </div>

      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <div id="mobile-menu-dropdown" class="lg:hidden overflow-hidden transition-all duration-300 max-h-0 opacity-0 bg-white/98 backdrop-blur-md border-t border-brand-border px-4 py-3 flex flex-col gap-1" style="-webkit-overflow-scrolling: touch;">
      <!-- 1. 홈 -->
      <a href="/" class="flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span class="text-[14px]">홈</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 2. 뉴스 -->
      <a href="/blog" class="flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
          <span class="text-[14px]">뉴스</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 2.5. 커뮤니티 포럼 (Active) -->
      <a href="/forum" class="flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors border-b border-slate-100 font-bold text-brand-blue bg-blue-50/70">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>
          <span class="text-[14px]">커뮤니티 포럼</span>
        </div>
        <svg class="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 3. 시니어 케어 -->
      <a href="/senior-care" class="flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          <span class="text-[14px]">시니어 케어</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 4. 메디케어 & ACA -->
      <a href="/medicare" class="flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          <span class="text-[14px]">메디케어 &amp; ACA</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 5. 환자도우미 -->
      <a href="/tool" class="flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span class="text-[14px]">환자도우미</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 6. 소개 -->
      <a href="/about" class="flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span class="text-[14px]">소개</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 카카오톡 1:1 상담 바로가기 -->
      <div class="pt-2 pb-1">
        <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-3 bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer">
          <div class="flex items-center gap-2.5">
            <img src="/kakaotalk-icon.png" alt="KakaoTalk" class="w-5 h-5 rounded-md shrink-0 object-contain shadow-xs" />
            <div class="flex flex-col text-left">
              <span class="text-xs font-bold leading-tight">카카오톡 1:1 상담 바로가기</span>
              <span class="text-[10px] font-medium text-black/70">의료 복지 및 시니어 케어 실시간 문의</span>
            </div>
          </div>
          <svg class="w-4 h-4 text-black/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  </nav>

  <!-- 109px Header Spacer for Fixed Nav (45px marquee + 64px nav) -->
  <div class="h-[109px] header-spacer" style="height: 109px; min-height: 109px; width: 100%;"></div>
<?php
}

function render_forum_sidebar(array $specialties, string $activeSpecialty = '', string $activeSort = 'latest', string $activeView = 'categories') {
?>
  <!-- Discourse Sidebar Backdrop for Mobile Drawer -->
  <div id="sidebar-backdrop" onclick="toggleForumSidebar()" class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 hidden md:hidden transition-opacity"></div>

  <!-- Discourse Left Sidebar -->
  <aside id="forum-sidebar" class="sidebar-closed w-64 bg-slate-50/70 border-r border-slate-200/90 shrink-0 overflow-y-auto p-4 z-40 flex flex-col justify-between">
    
    <!-- Mobile Drawer Close Header -->
    <div class="flex md:hidden items-center justify-between pb-3 mb-3 border-b border-slate-200 shrink-0">
      <div class="flex items-center gap-2">
        <img src="/logo-icon.svg" class="w-5 h-5" alt="Logo">
        <span class="font-bold text-xs text-slate-900">전문 진료과목 &amp; 이벤트</span>
      </div>
      <button onclick="toggleForumSidebar()" class="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100" aria-label="메뉴 닫기">
        <i class="fa-solid fa-xmark text-sm"></i>
      </button>
    </div>

    <div class="space-y-6">
      <!-- Main Nav Links -->
      <div class="space-y-0.5">
        <a href="/forum?view=categories" 
           class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors <?= ($activeView === 'categories' && empty($activeSpecialty)) ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900' ?>">
          <i class="fa-solid fa-house text-sm w-4 text-center <?= ($activeView === 'categories' && empty($activeSpecialty)) ? 'text-blue-600' : 'text-slate-400' ?>"></i>
          <span>포럼 홈 (Home)</span>
        </a>
      </div>

      <!-- Categories with Discourse Colored Squares & Events Highlight -->
      <div>
        <div class="flex items-center justify-between px-3 mb-2 text-slate-400">
          <span class="text-[11px] font-bold uppercase tracking-wider">진료과목 &amp; 이벤트</span>
          <span class="text-[10px] bg-slate-200/80 text-slate-600 px-1.5 py-0.2 rounded font-bold"><?= count($specialties) ?></span>
        </div>
        
        <div class="space-y-0.5">
          <?php foreach ($specialties as $sp): 
            $isActive = ($activeSpecialty === $sp['id'] || $activeSpecialty === $sp['slug']);
            $isEvents = ($sp['id'] === 'events');
          ?>
            <a href="/forum?specialty=<?= urlencode($sp['id']) ?>&view=topics" 
               class="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors <?= $isActive ? ($isEvents ? 'bg-rose-600 text-white font-bold shadow-xs' : 'bg-blue-600 text-white font-bold shadow-xs') : ($isEvents ? 'bg-rose-50/80 hover:bg-rose-100/70 text-rose-900 font-bold border border-rose-200/60' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium') ?>"
               title="<?= htmlspecialchars($sp['name_ko']) ?> (<?= htmlspecialchars($sp['name_en']) ?>)">
              <div class="flex items-center gap-2.5 truncate">
                <?php if ($isEvents): ?>
                  <i class="fa-solid fa-calendar-star text-rose-600 shrink-0 text-xs <?= $isActive ? 'text-white' : '' ?>"></i>
                  <span class="truncate"><?= htmlspecialchars($sp['name_ko']) ?></span>
                  <span class="text-[9px] px-1 py-0.2 rounded font-extrabold uppercase <?= $isActive ? 'bg-white/25 text-white' : 'bg-rose-600 text-white' ?>">공식</span>
                <?php else: ?>
                  <span class="w-2.5 h-2.5 rounded-xs shrink-0" style="background-color: <?= htmlspecialchars($sp['color']) ?>"></span>
                  <span class="truncate"><?= htmlspecialchars($sp['name_ko']) ?></span>
                <?php endif; ?>
              </div>
              <span class="text-[10px] px-1.5 py-0.2 rounded font-semibold <?= $isActive ? 'bg-white/20 text-white' : ($isEvents ? 'text-rose-600 bg-rose-100/80' : 'text-slate-400') ?>">
                <?= (int)($sp['questionCount'] ?? 0) ?>
              </span>
            </a>
          <?php endforeach; ?>

          <a href="/forum?view=categories" 
             class="flex items-center gap-2.5 px-3 py-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors font-semibold mt-1">
            <i class="fa-solid fa-list-ul text-[11px] text-slate-400"></i>
            <span>전체 카테고리 (All Categories)</span>
          </a>
        </div>
      </div>

      <!-- Discourse Tags Section -->
      <div>
        <div class="flex items-center justify-between px-3 mb-2 text-slate-400">
          <span class="text-[11px] font-bold uppercase tracking-wider">주요 건강 태그 (Tags)</span>
        </div>
        <div class="flex flex-wrap gap-1 px-2">
          <?php 
          $tags = ['혈압약', '당뇨전단계', '예방접종', '경도인지장애', '소아과', '응급실', '콜레스테롤', '영상의학'];
          foreach ($tags as $tag):
          ?>
            <a href="/forum?q=<?= urlencode($tag) ?>&view=topics" 
               class="text-[11px] px-2 py-0.5 rounded bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 transition-colors">
              #<?= htmlspecialchars($tag) ?>
            </a>
          <?php endforeach; ?>
        </div>
      </div>

    </div>

    <!-- Bottom Links (About / CMS) -->
    <div class="pt-4 mt-6 border-t border-slate-200 text-[11px] text-slate-400 space-y-1.5">
      <div class="flex items-center justify-between px-3">
        <a href="/about" class="hover:text-slate-600 transition-colors flex items-center gap-1.5">
          <i class="fa-solid fa-circle-info text-[10px]"></i>
          <span>포럼 안내 &amp; 면책조항</span>
        </a>
        <a href="/admin2/" class="hover:text-blue-600 transition-colors font-bold flex items-center gap-1">
          <i class="fa-solid fa-lock text-[9px]"></i>
          <span>관리자 CMS</span>
        </a>
      </div>
      <p class="px-3 text-[10px] text-slate-400 leading-tight">
        © 2026 NJ Healthcare Access Portal
      </p>
    </div>

  </aside>
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
        <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center text-xl mb-3 shadow-xs">
          <i class="fa-brands fa-google text-red-500"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-900">구글 계정으로 시작하기</h3>
        <p class="text-xs text-slate-500 mt-1">
          복잡한 절차 없이 구글 로그인 후 누구나 자유롭게 의료 질문/정보 나눔에 참여하실 수 있습니다.
        </p>
      </div>

      <!-- Real Google GIS One-tap Button -->
      <div class="mb-5 flex justify-center">
        <div id="g_id_onload"
             data-client_id="81226768822-demo-client.apps.googleusercontent.com"
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

      <!-- Direct Google Email Login Form -->
      <form onsubmit="handleDirectGoogleSignIn(event)" class="mt-4 space-y-3">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Gmail 주소 <span class="text-red-500">*</span></label>
          <input type="email" id="login-google-email" required
            placeholder="example@gmail.com"
            class="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600" />
          <p class="text-[11px] text-slate-400 mt-1">
            ※ 관리자 CMS에 등록된 전문의 Gmail인 경우 자동으로 <strong>공인 전문의 인증 배지</strong>가 부여됩니다.
          </p>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">사용하실 닉네임 / 성함</label>
          <input type="text" id="login-google-name"
            placeholder="예: 홍길동, 또는 전문의 성함"
            class="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600" />
        </div>
        <button type="submit" class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2">
          <i class="fa-solid fa-right-to-bracket"></i>
          <span>포럼 접속하기</span>
        </button>
      </form>
    </div>
  </div>

  <!-- Nickname Edit Modal -->
  <div id="modal-edit-nickname" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 hidden items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative">
      <button onclick="closeNicknameModal()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 text-sm">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <h3 class="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
        <i class="fa-solid fa-user-pen text-blue-600"></i>
        <span>닉네임 / 성함 변경</span>
      </h3>
      <p class="text-xs text-slate-500 mb-4">포럼에서 활동할 성함이나 닉네임을 변경합니다.</p>
      
      <form onsubmit="handleUpdateNickname(event)" class="space-y-3">
        <input type="text" id="input-edit-nickname" required minlength="2" maxlength="30"
          placeholder="새로운 닉네임 또는 성함 입력"
          class="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-600" />
        <div class="flex items-center justify-end gap-2 pt-2">
          <button type="button" onclick="closeNicknameModal()" class="px-3 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-600">
            취소
          </button>
          <button type="submit" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-xs">
            저장하기
          </button>
        </div>
      </form>
    </div>
  </div>
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
          <div class="flex items-center gap-1 bg-slate-100/90 py-1 px-1.5 sm:px-2 rounded-lg border border-slate-200 text-xs shrink-0">
            <img src="${currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80'}" class="w-5 h-5 rounded-full object-cover shrink-0">
            <span class="font-bold text-slate-800 max-w-[50px] sm:max-w-[90px] truncate" title="${escapeHtml(currentUser.name)}">${escapeHtml(currentUser.name)}</span>
            ${currentUser.isVerifiedClinician ? '<span class="text-[8px] sm:text-[9px] bg-emerald-600 text-white font-extrabold px-1 sm:px-1.5 py-0.2 rounded-full shrink-0">전문의</span>' : ''}
            <button onclick="openNicknameModal()" class="text-slate-400 hover:text-blue-600 p-0.5 sm:p-1" title="닉네임 변경"><i class="fa-solid fa-pen text-[9px] sm:text-[10px]"></i></button>
            <button onclick="handleLogout()" class="text-slate-400 hover:text-red-600 p-0.5 sm:p-1" title="로그아웃"><i class="fa-solid fa-right-from-bracket text-[9px] sm:text-[10px]"></i></button>
          </div>
        `;
      } else {
        box.innerHTML = `
          <button onclick="openGoogleAuthModal()" class="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-2 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow-2xs">
            <i class="fa-brands fa-google text-red-500 text-xs"></i>
            <span class="hidden xs:inline">로그인</span>
          </button>
        `;
      }
    }

    function toggleForumSidebar() {
      const sidebar = document.getElementById('forum-sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      if (!sidebar) return;

      if (window.innerWidth < 768) {
        // Mobile drawer overlay toggle
        const isOpen = sidebar.classList.contains('sidebar-open');
        if (isOpen) {
          sidebar.classList.remove('sidebar-open');
          sidebar.classList.add('sidebar-closed');
          if (backdrop) backdrop.classList.add('hidden');
          document.body.style.overflow = '';
        } else {
          sidebar.classList.remove('sidebar-closed');
          sidebar.classList.add('sidebar-open');
          if (backdrop) backdrop.classList.remove('hidden');
          document.body.style.overflow = 'hidden';
        }
      } else {
        // Desktop collapse toggle
        sidebar.classList.toggle('md:hidden');
      }
    }

    function openGoogleAuthModal() {
      const modal = document.getElementById('google-auth-modal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      }
    }

    function closeGoogleAuthModal() {
      const modal = document.getElementById('google-auth-modal');
      if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
      }
    }

    function openNicknameModal() {
      if (!currentUser) return;
      const input = document.getElementById('input-edit-nickname');
      if (input) input.value = currentUser.name || '';
      const modal = document.getElementById('modal-edit-nickname');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      }
    }

    function closeNicknameModal() {
      const modal = document.getElementById('modal-edit-nickname');
      if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
      }
    }

    async function handleUpdateNickname(e) {
      e.preventDefault();
      const input = document.getElementById('input-edit-nickname');
      const newName = input?.value.trim() || '';
      if (!newName) return;

      try {
        const res = await fetch('/api/forum_auth.php?action=update_name', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName })
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
      } catch(err) {
        alert('오류가 발생했습니다.');
      }
    }

    async function handleGoogleSignIn(response) {
      try {
        const res = await fetch('/api/forum_auth.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: response.credential })
        });
        const data = await res.json();
        if (data.success) {
          currentUser = data.user;
          renderAuthBox();
          if (typeof syncAuthorFields === 'function') {
            syncAuthorFields();
          }
          closeGoogleAuthModal();
        } else {
          alert(data.error || '로그인에 실패했습니다.');
        }
      } catch (e) {
        alert('구글 인증 처리 중 오류가 발생했습니다.');
      }
    }

    async function handleDirectGoogleSignIn(e) {
      e.preventDefault();
      const emailInput = document.getElementById('login-google-email');
      const nameInput = document.getElementById('login-google-name');
      const email = emailInput?.value.trim() || '';
      const name = nameInput?.value.trim() || '';

      if (!email) {
        alert('구글 이메일 주소를 입력해주세요.');
        return;
      }

      const profile = {
        email: email,
        name: name || email.split('@')[0],
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80'
      };

      try {
        const res = await fetch('/api/forum_auth.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile)
        });
        const data = await res.json();
        if (data.success) {
          currentUser = data.user;
          renderAuthBox();
          if (typeof syncAuthorFields === 'function') {
            syncAuthorFields();
          }
          closeGoogleAuthModal();
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
      const isClosed = menu.classList.contains('max-h-0');
      if (isClosed) {
        menu.classList.remove('max-h-0', 'opacity-0');
        menu.classList.add('max-h-[600px]', 'opacity-100');
      } else {
        menu.classList.add('max-h-0', 'opacity-0');
        menu.classList.remove('max-h-[600px]', 'opacity-100');
      }
    }

    // Keyboard shortcut for search
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[name="q"]');
        if (searchInput) searchInput.focus();
      }
    });

    document.addEventListener('DOMContentLoaded', checkAuth);
  </script>
<?php
}

function render_forum_footer() {
?>
  <!-- Global Footer Matching Website -->
  <footer class="bg-brand-darker text-white mt-auto border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        <div class="lg:col-span-2">
          <a class="inline-flex items-center gap-3 mb-4 group cursor-pointer njap-brand-link" href="/" onclick="navigateToHome(event); return false;">
            <img src="/logo-icon.svg" alt="NJAP Logo" style="width: 36px; height: 36px; object-fit: contain; filter: invert(1) brightness(2); flex-shrink: 0;" class="transition-transform group-hover:scale-105" />
            <div>
              <span class="font-serif text-2xl text-white group-hover:text-blue-300 transition-colors block">Healthcare Access Portal</span>
              <span class="block text-xs text-white/50 mt-0.5 font-sans">뉴저지 한인 의료 정보 포털</span>
            </div>
          </a>
          <p class="text-sm text-white/60 font-sans leading-relaxed max-w-xs mb-6">뉴저지 한인 커뮤니티를 위한 의료 접근 및 건강 정보 포털. 메디케어, ACA, 의료 상담을 한국어로 제공합니다.</p>
        </div>
        <div>
          <p class="text-xs font-sans font-semibold uppercase tracking-widest text-white/40 mb-4">정보</p>
          <ul class="space-y-2.5">
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200 cursor-pointer" href="/" onclick="navigateToHome(event); return false;">홈</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/about">소개</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/blog">건강 뉴스</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200 font-bold text-white" href="/forum">커뮤니티 포럼</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/senior-care">시니어 케어</a></li>
          </ul>
        </div>
        <div>
          <p class="text-xs font-sans font-semibold uppercase tracking-widest text-white/40 mb-4">의료 가이드</p>
          <ul class="space-y-2.5">
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/medicare">메디케어 안내</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/medicare#aca">ACA 보험</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/medicare#faq">자주 묻는 질문</a></li>
          </ul>
        </div>
        <div>
          <p class="text-xs font-sans font-semibold uppercase tracking-widest text-white/40 mb-4">환자도우미</p>
          <ul class="space-y-2.5">
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/tool">보험 자격 진단</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/calculator">보조금 계산기</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/dictionary">의학 용어 사전</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="text-xs font-sans text-white/30 max-w-2xl leading-relaxed">
          <span class="font-semibold text-white/40">⚠ 의료 면책 조항:</span> 이 웹사이트의 정보는 교육 목적으로만 제공됩니다. 의료 결정은 반드시 자격을 갖춘 의료 전문가와 상담하십시오.
        </div>
        <p class="text-xs font-sans text-white/30 whitespace-nowrap">© 2026 Healthcare Access Portal</p>
      </div>
    </div>
  </footer>
  <script src="/js/njap-translate.js?v=3.0.0"></script>
  <script src="/js/fixes.js?v=5.1.0"></script>
<?php
}

