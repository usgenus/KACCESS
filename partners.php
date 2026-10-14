<?php
/**
 * NJ Partners Directory (뉴저지 파트너즈)
 * Public Directory Page matching the approved mockup exactly.
 * URL: /partners or /partners.php
 */
require_once __DIR__ . '/api/partners_db.php';

// SSR Data Pre-load
$data = get_partners_data();
$rawSlides = $data['hero_slides'] ?? [];
$slides = [];
foreach ($rawSlides as $s) {
    if (!empty($s['visible'])) {
        $slides[] = $s;
    }
}
usort($slides, function($a, $b) {
    return intval($a['order'] ?? 1) <=> intval($b['order'] ?? 1);
});
$slides = array_slice($slides, 0, 3);

$rawPartners = $data['partners'] ?? [];
$partners = [];
foreach ($rawPartners as $p) {
    if (!empty($p['visible'])) {
        $partners[] = [
            'id' => $p['id'] ?? '',
            'name' => $p['name'] ?? '',
            'category' => $p['category'] ?? '',
            'town' => $p['town'] ?? '',
            'imageUrl' => $p['imageUrl'] ?? '',
            'intro' => $p['intro'] ?? '',
            'content' => $p['content'] ?? '',
            'tags' => is_array($p['tags'] ?? null) ? $p['tags'] : [],
            'minisiteUrl' => $p['minisiteUrl'] ?? '',
            'contactMethod' => $p['contactMethod'] ?? 'kakao',
            'email' => $p['email'] ?? '',
            'kakaoChannelId' => $p['kakaoChannelId'] ?? '',
            'featured' => !empty($p['featured']),
            'isSample' => $p['isSample'] ?? '가상 상호',
            'order' => intval($p['order'] ?? 1)
        ];
    }
}
usort($partners, function($a, $b) {
    return $a['order'] <=> $b['order'];
});

$initialCount = count($partners);
?>
<!DOCTYPE html>
<html lang="ko" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>뉴저지 파트너즈 · NJ Partners | NJ Access Portal 뉴저지 한인 포털</title>
  <meta name="description" content="뉴저지 한인 커뮤니티가 신뢰하는 병원·의원·약국·비즈니스 디렉터리 및 브랜드 프로필. 한인 의료진과 전문 비즈니스를 한눈에 확인하세요." />
  <link rel="canonical" href="https://njaccessportal.com/partners" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="뉴저지 파트너즈 · NJ Partners | NJ Access Portal" />
  <meta property="og:description" content="뉴저지 한인 커뮤니티가 신뢰하는 병원·의원·약국·비즈니스 디렉터리 및 브랜드 프로필." />
  <meta property="og:image" content="/uploads/images/partners/hero_bergen_medical.jpg" />

  <!-- Fonts & Icons -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              forest: '#0D4B37',
              forestDark: '#093627',
              forestLight: '#14634B',
              orange: '#E65127',
              orangeDark: '#C93F19',
              yellow: '#FEE500',
              blue: '#1565C0',
              dark: '#0B192C'
            }
          },
          fontFamily: {
            sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
          }
        }
      }
    }
  </script>

  <!-- Kakao SDK -->
  <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"></script>

  <style>
    body {
      font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      overflow-x: hidden;
    }
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .hero-slide {
      transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;
    }
    .active-pill {
      background-color: #0D4B37 !important;
      color: #ffffff !important;
      border-color: #0D4B37 !important;
    }
    .modal-backdrop-blur {
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
  </style>
</head>
<body class="bg-[#FAFBF9] text-[#191919] min-h-screen flex flex-col selection:bg-emerald-600 selection:text-white">

  <!-- ===================================================================
       1. Top Global Navigation Header (Matches Exact Site Logo & Menu Order)
       =================================================================== -->
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      
      <!-- Brand Logo (Exact official SVG from index.php) -->
      <a class="flex items-center cursor-pointer njap-brand-link flex-shrink-0 group" href="/" title="NJ Access Portal · 뉴저지 한인 포털">
        <svg class="h-9 sm:h-10 md:h-11 w-auto object-contain transition-transform group-hover:scale-102" viewBox="0 0 320 60" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NJ Access Portal · 뉴저지 한인 포털" style="overflow: visible;">
          <title>NJ Access Portal · 뉴저지 한인 포털</title>
          <!-- Icon Mark (Door + Key + NJAP) -->
          <g transform="translate(4, 2) scale(0.56)" stroke-linecap="round" stroke-linejoin="round">
            <!-- Door Frame & NJAP Text -->
            <g class="njap-nav-door" stroke="#1E3A8A">
              <line x1="20" y1="12" x2="20" y2="88" stroke-width="3.5" />
              <rect x="25" y="12" width="55" height="76" rx="2" stroke-width="4" fill="none" />
              <polyline points="25,16 52,25 52,36" stroke-width="3.5" />
              <text x="52.5" y="81" font-family="'Times New Roman', serif" font-size="13.5" font-weight="900" letter-spacing="1.5" fill="#1E3A8A" stroke="none" text-anchor="middle">NJAP</text>
            </g>
            
            <!-- Keyhole -->
            <path class="njap-nav-keyhole" d="M 43,45 A 7,7 0 1,1 53,45 L 56,64 L 40,64 Z" stroke="#DC2626" stroke-width="3.5" fill="none" />
            
            <!-- Key: enters from right side into the door -->
            <g class="njap-nav-key">
              <circle cx="74" cy="45" r="6.5" stroke="#DC2626" stroke-width="3.5" fill="none" />
              <line x1="47" y1="45" x2="67.5" y2="45" stroke="#DC2626" stroke-width="3.5" />
              <line x1="49" y1="49" x2="49" y2="49" stroke="#DC2626" stroke-width="3.5" />
              <line x1="53" y1="45" x2="53" y2="48" stroke="#DC2626" stroke-width="3" />
            </g>
          </g>

          <!-- Typography: slides in from right after key enters -->
          <g class="njap-nav-text-main">
            <text x="64" y="27" font-family="Pretendard, -apple-system, system-ui, sans-serif" font-size="18" font-weight="900" fill="#0B192C" letter-spacing="-0.5">NJ Access Portal</text>
          </g>
          <g class="njap-nav-text-sub">
            <text x="64" y="44" font-family="Pretendard, -apple-system, system-ui, sans-serif" font-size="10.5" font-weight="600" fill="#64748B" letter-spacing="0.2">뉴저지 한인 포털</text>
          </g>
        </svg>
      </a>

      <!-- Desktop Nav (Ordered: 홈 -> 뉴스 -> 뉴저지 한인광장 -> 뉴저지 파트너즈 -> 정보센터 -> 의료접근센터) -->
      <nav class="hidden md:flex items-center gap-8 lg:gap-10">
        <a class="nav-link flex flex-col items-center justify-center leading-tight group" href="/">
          <span class="text-[14px] font-semibold text-slate-700 group-hover:text-brand-forest transition-colors">홈</span>
          <span class="text-[10px] font-medium text-slate-400 group-hover:text-brand-forest/80 transition-colors">Home</span>
        </a>
        <a class="nav-link flex flex-col items-center justify-center leading-tight group" href="/blog">
          <span class="text-[14px] font-semibold text-slate-700 group-hover:text-brand-forest transition-colors">뉴스</span>
          <span class="text-[10px] font-medium text-slate-400 group-hover:text-brand-forest/80 transition-colors">News</span>
        </a>
        <a class="nav-link flex flex-col items-center justify-center leading-tight group" href="/forum">
          <span class="text-[14px] font-semibold text-slate-700 group-hover:text-brand-forest transition-colors">뉴저지 한인광장</span>
          <span class="text-[10px] font-medium text-slate-400 group-hover:text-brand-forest/80 transition-colors">Market place</span>
        </a>
        <!-- Right after Market place: 뉴저지 파트너즈 -->
        <a class="nav-link flex flex-col items-center justify-center leading-tight group relative py-1" href="/partners">
          <span class="text-[14px] font-black text-brand-forest">뉴저지 파트너즈</span>
          <span class="text-[10px] font-bold text-brand-forest/80">NJ Partners</span>
          <span class="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-forest rounded-full"></span>
        </a>
        <a class="nav-link flex flex-col items-center justify-center leading-tight group" href="/resource-center">
          <span class="text-[14px] font-semibold text-slate-700 group-hover:text-brand-forest transition-colors">의료 &amp; 커뮤니티</span>
          <span class="text-[10px] font-medium text-slate-400 group-hover:text-brand-forest/80 transition-colors">Resource Center</span>
        </a>
        <a class="nav-link flex flex-col items-center justify-center leading-tight group" href="/about">
          <span class="text-[14px] font-semibold text-slate-700 group-hover:text-brand-forest transition-colors">의료접근센터</span>
          <span class="text-[10px] font-medium text-slate-400 group-hover:text-brand-forest/80 transition-colors">Healthcare Access Center</span>
        </a>
      </nav>

      <!-- Right Buttons -->
      <div class="flex items-center gap-3">
        <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-bold text-xs shadow-xs transition-transform active:scale-95" title="카카오톡 1:1 상담 바로가기">
          <img src="/kakaotalk-icon.png" alt="KakaoTalk" class="w-4 h-4 rounded-xs shrink-0 object-contain" />
          <span>1:1 상담</span>
        </a>
        <button id="mobile-menu-btn" onclick="toggleMobileMenu()" class="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors" aria-label="메뉴 열기">
          <i class="fa-solid fa-bars text-xl text-slate-800"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Drawer (Ordered: 홈 -> 뉴스 -> 뉴저지 한인광장 -> 뉴저지 파트너즈 -> 정보센터 -> 의료접근센터) -->
    <div id="mobile-menu" class="hidden md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
      <a href="/" class="block py-2 text-sm font-semibold text-slate-800 hover:text-brand-forest">홈 (Home)</a>
      <a href="/blog" class="block py-2 text-sm font-semibold text-slate-800 hover:text-brand-forest">뉴스 (News)</a>
      <a href="/forum" class="block py-2 text-sm font-semibold text-slate-800 hover:text-brand-forest">뉴저지 한인광장 (Market place)</a>
      <a href="/partners" class="block py-2 text-sm font-black text-brand-forest bg-emerald-50 rounded-lg px-2">뉴저지 파트너즈 (NJ Partners)</a>
      <a href="/resource-center" class="block py-2 text-sm font-semibold text-slate-800 hover:text-brand-forest">의료 &amp; 커뮤니티 정보센터</a>
      <a href="/about" class="block py-2 text-sm font-semibold text-slate-800 hover:text-brand-forest">의료접근센터</a>
      <div class="pt-3">
        <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#FEE500] text-[#191919] font-bold text-sm">
          <img src="/kakaotalk-icon.png" alt="Kakao" class="w-4 h-4 rounded-xs" />
          카카오톡 1:1 상담 바로가기
        </a>
      </div>
    </div>
  </header>

  <div class="h-20"></div>

  <!-- ===================================================================
       2. Page Main Body
       =================================================================== -->
  <main class="flex-1 w-full flex flex-col">
    
    <!-- Top Title Section (Inside max-w-7xl) -->
    <section class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
      <div class="max-w-3xl">
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-black text-black tracking-tight leading-[1.08] mb-4">
          뉴저지<br>파트너즈
        </h1>
        <p class="text-base sm:text-lg text-slate-600 font-medium tracking-tight">
          뉴저지 한인 커뮤니티가 신뢰하는 병원·의원·약국·비즈니스
        </p>
      </div>
    </section>

    <!-- ===================================================================
         3. Fully Panoramic Edge-to-Edge Hero Carousel Banner
         (Covering end-to-end horizontally across full screen width)
         =================================================================== -->
    <section id="hero-carousel-container" class="relative w-full bg-brand-forest group min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] overflow-hidden select-none" style="width: 100vw; max-width: 100vw; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw;">
      <div id="hero-slides-wrapper" class="relative w-full h-full min-h-[420px] sm:min-h-[480px] lg:min-h-[520px]">
        <?php foreach ($slides as $idx => $s): ?>
          <div class="hero-slide absolute inset-0 w-full h-full flex flex-col lg:flex-row transition-opacity duration-700 <?= $idx === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none' ?>" data-slide-index="<?= $idx ?>">
            
            <!-- Left Side: Panoramic Photo (50% on desktop, full on mobile) -->
            <div class="w-full lg:w-1/2 h-64 sm:h-80 lg:h-full relative overflow-hidden bg-slate-900">
              <img src="<?= htmlspecialchars($s['imageUrl']) ?>" alt="<?= htmlspecialchars($s['title']) ?>" class="w-full h-full object-cover object-center transform scale-100 hover:scale-105 transition-transform duration-700" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden"></div>
            </div>

            <!-- Right Side: Dark Forest Green (#0D4B37) -->
            <div class="w-full lg:w-1/2 flex-1 p-6 sm:p-12 lg:p-16 flex flex-col justify-between bg-brand-forest text-white relative">
              <div class="space-y-4 lg:space-y-6 max-w-xl">
                <!-- Pill Tag -->
                <div>
                  <span class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-[#E6F4EA] text-brand-forest tracking-tight shadow-xs">
                    <?= htmlspecialchars($s['tag'] ?: '프리미엄 샘플 · 가상 상호') ?>
                  </span>
                </div>

                <!-- Big Title -->
                <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-snug">
                  <?= htmlspecialchars($s['title']) ?>
                </h2>

                <!-- Subtitle -->
                <p class="text-base sm:text-lg text-emerald-100/90 font-normal leading-relaxed line-clamp-3">
                  <?= htmlspecialchars($s['subtitle']) ?>
                </p>

                <!-- Action Button (Direct Link) -->
                <div class="pt-2">
                  <a href="<?= htmlspecialchars($s['buttonLink'] ?: '#') ?>" onclick="handleHeroButtonClick(event, '<?= htmlspecialchars($s['buttonLink']) ?>')" class="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-brand-forest hover:bg-emerald-50 font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer">
                    <span><?= htmlspecialchars($s['buttonText'] ?: '자세히보기 →') ?></span>
                  </a>
                </div>
              </div>

              <!-- Carousel Navigation Controls at Bottom Right -->
              <div class="pt-6 flex items-center justify-end gap-3 z-20">
                <button type="button" onclick="prevSlide()" class="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/30 hover:border-white hover:bg-white/10 text-white flex items-center justify-center transition-all cursor-pointer" aria-label="이전 슬라이드">
                  <i class="fa-solid fa-arrow-left text-xs sm:text-sm"></i>
                </button>
                <div class="flex items-center gap-2 px-2">
                  <?php for ($i = 0; $i < count($slides); $i++): ?>
                    <button type="button" onclick="goToSlide(<?= $i ?>)" class="carousel-dot transition-all duration-300 rounded-full h-2 <?= $i === 0 ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70' ?>" aria-label="슬라이드 <?= $i + 1 ?>"></button>
                  <?php endfor; ?>
                </div>
                <button type="button" onclick="nextSlide()" class="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/30 hover:border-white hover:bg-white/10 text-white flex items-center justify-center transition-all cursor-pointer" aria-label="다음 슬라이드">
                  <i class="fa-solid fa-arrow-right text-xs sm:text-sm"></i>
                </button>
              </div>

            </div>

          </div>
        <?php endforeach; ?>
      </div>
    </section>

    <!-- ===================================================================
         4. Filters, Partner Directory & Content Sections (Inside max-w-7xl)
         =================================================================== -->
    <div class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      <!-- Search & Filters Bar (Search Box + Town Dropdown + 12 Category Chips) -->
      <section class="space-y-4 pt-2">
        <!-- Search Input Row -->
        <div class="relative w-full">
          <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <i class="fa-solid fa-magnifying-glass text-sm"></i>
          </span>
          <input type="text" id="filter-search" oninput="applyFilters()" placeholder="파트너명, 진료과, 서비스로 검색" class="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest focus:border-brand-forest transition-all shadow-xs" />
          <button id="search-clear-btn" onclick="clearSearch()" class="hidden absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- 12 Category Chips (+ 전체) -->
        <div class="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 flex-nowrap sm:flex-wrap">
          <button type="button" onclick="selectCategory('all', this)" class="category-chip active-pill px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:border-brand-forest transition-all shrink-0 cursor-pointer shadow-xs">
            전체
          </button>
          <?php
            $categoryList = [
              '종합병원', '의원·클리닉', '약국', '물리치료·재활',
              '보험·브로커', '시니어 케어', '커뮤니티 센터', '학원/교육',
              '식당', '자동차', '쇼핑', '법률·회계·부동산'
            ];
            foreach ($categoryList as $cat):
          ?>
            <button type="button" onclick="selectCategory('<?= $cat ?>', this)" class="category-chip px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:border-brand-forest transition-all shrink-0 cursor-pointer shadow-xs">
              <?= $cat ?>
            </button>
          <?php endforeach; ?>
        </div>
      </section>

      <!-- Partner Directory Section -->
      <section class="space-y-6 pt-4">
        <!-- Section Header -->
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span class="text-xs font-black tracking-widest text-brand-forest uppercase mb-1 block">PARTNER DIRECTORY</span>
            <h2 class="text-2xl sm:text-3xl font-black text-black tracking-tight">분야별 파트너</h2>
            <p class="text-xs sm:text-sm text-slate-500 font-normal mt-1">
              이름만 나열하지 않고, 지역·전문 분야·콘텐츠 활동을 한눈에 비교하도록 구성했습니다.
            </p>
          </div>
          <div class="text-right">
            <span class="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              <span id="partner-count" class="text-brand-forest font-black mr-1"><?= $initialCount ?></span>개의 파트너
            </span>
          </div>
        </div>

        <!-- Partner Cards Grid (5 in a row on desktop, half the size) -->
        <div id="partner-grid" class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          <?php foreach ($partners as $p): ?>
            <article class="partner-card bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group" data-category="<?= htmlspecialchars($p['category']) ?>" data-town="<?= htmlspecialchars($p['town']) ?>" data-name="<?= htmlspecialchars($p['name']) ?>" data-intro="<?= htmlspecialchars($p['intro']) ?>" data-id="<?= htmlspecialchars($p['id']) ?>">
              
              <!-- Image Area (Direct Full Page Click - Half Size Height) -->
              <div class="relative w-full h-28 sm:h-32 bg-slate-100 overflow-hidden cursor-pointer" onclick="handleCardClick('<?= htmlspecialchars($p['id']) ?>', '<?= htmlspecialchars($p['minisiteUrl']) ?>')">
                <img src="<?= htmlspecialchars($p['imageUrl']) ?>" alt="<?= htmlspecialchars($p['name']) ?>" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                
                <!-- Top-Left Category Badge -->
                <div class="absolute top-2 left-2">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E6F4EA] text-brand-forest shadow-xs">
                    <?= htmlspecialchars($p['category']) ?>
                  </span>
                </div>

                <!-- Bottom-Right Sample Badge -->
                <div class="absolute bottom-2 right-2">
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-medium bg-black/60 text-white backdrop-blur-xs">
                    <?= htmlspecialchars($p['isSample'] ?: '가상 상호') ?>
                  </span>
                </div>
              </div>

              <!-- Card Body (Compact Half-Size Spacing) -->
              <div class="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                <div class="space-y-1.5">
                  <!-- Town -->
                  <div class="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    <?= htmlspecialchars($p['town']) ?>, NJ
                  </div>

                  <!-- Business Name (Direct Full Page Click) -->
                  <h3 class="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-snug group-hover:text-brand-forest transition-colors cursor-pointer line-clamp-1" onclick="handleCardClick('<?= htmlspecialchars($p['id']) ?>', '<?= htmlspecialchars($p['minisiteUrl']) ?>')">
                    <?= htmlspecialchars($p['name']) ?>
                  </h3>

                  <!-- Intro -->
                  <p class="text-[11px] sm:text-xs text-slate-600 font-normal leading-relaxed line-clamp-2 min-h-[32px]">
                    <?= htmlspecialchars($p['intro']) ?>
                  </p>

                  <!-- Tags -->
                  <?php if (!empty($p['tags'])): ?>
                    <div class="flex flex-wrap gap-1 pt-0.5">
                      <?php foreach (array_slice($p['tags'], 0, 2) as $tag): ?>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-medium bg-slate-100 text-slate-600 truncate max-w-[100px]">
                          <?= htmlspecialchars($tag) ?>
                        </span>
                      <?php endforeach; ?>
                    </div>
                  <?php endif; ?>
                </div>

                <!-- Action Buttons Row -->
                <div class="pt-2 grid grid-cols-2 gap-1.5 border-t border-slate-100">
                  <!-- Full Webpage Direct Link Button -->
                  <a href="<?= !empty($p['minisiteUrl']) ? htmlspecialchars($p['minisiteUrl']) : 'javascript:void(0)' ?>" 
                     onclick="handleDetailClick(event, '<?= htmlspecialchars($p['name']) ?>', '<?= htmlspecialchars($p['minisiteUrl']) ?>')" 
                     <?= !empty($p['minisiteUrl']) ? 'target="_blank" rel="noopener noreferrer"' : '' ?> 
                     class="w-full py-1.5 px-1.5 rounded-lg bg-brand-forest hover:bg-brand-forestDark text-white font-bold text-[11px] tracking-tight transition-all active:scale-95 shadow-xs flex items-center justify-center text-center whitespace-nowrap cursor-pointer">
                    <span>자세히보기</span>
                  </a>

                  <!-- Contact Button (KakaoTalk OR Email) -->
                  <?php if (($p['contactMethod'] ?? 'kakao') === 'email'): ?>
                    <a href="mailto:<?= htmlspecialchars($p['email'] ?: 'contact@njaccessportal.com') ?>?subject=<?= urlencode('[' . $p['name'] . ' 문의] NJ Access Portal 파트너즈 연결') ?>" class="w-full py-1.5 px-1.5 rounded-lg bg-slate-900 hover:bg-black text-white font-bold text-[11px] tracking-tight transition-all active:scale-95 shadow-xs flex items-center justify-center gap-1 text-center whitespace-nowrap cursor-pointer">
                      <i class="fa-solid fa-envelope text-[10px]"></i>
                      <span>이메일</span>
                    </a>
                  <?php else: ?>
                    <button type="button" onclick="handleKakaoChat('<?= htmlspecialchars($p['id']) ?>', '<?= htmlspecialchars($p['kakaoChannelId']) ?>')" class="w-full py-1.5 px-1.5 rounded-lg bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-bold text-[11px] tracking-tight transition-all active:scale-95 shadow-xs flex items-center justify-center gap-1 text-center whitespace-nowrap cursor-pointer">
                      <img src="/kakaotalk-icon.png" alt="Kakao" class="w-3 h-3 rounded-xs object-contain" />
                      <span>카카오톡</span>
                    </button>
                  <?php endif; ?>
                </div>

              </div>

            </article>
          <?php endforeach; ?>
        </div>

        <!-- Empty State -->
        <div id="no-partners-msg" class="hidden text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
          <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 text-2xl">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <h3 class="text-base font-bold text-slate-800">일치하는 파트너가 없습니다</h3>
          <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            선택하신 카테고리 또는 검색 조건에 부합하는 파트너를 찾지 못했습니다. 다른 조건으로 다시 검색해 보세요.
          </p>
          <button type="button" onclick="resetAllFilters()" class="mt-4 px-4 py-2 rounded-xl bg-brand-forest text-white font-bold text-xs hover:bg-brand-forestDark transition-all">
            필터 초기화
          </button>
        </div>
      </section>

      <!-- Display Strategy Section (01, 02, 03 Cards) -->
      <section class="bg-[#F4F7F5] rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <!-- Left Column -->
          <div class="lg:col-span-5 space-y-3">
            <span class="text-xs font-black tracking-widest text-brand-forest uppercase">DISPLAY STRATEGY</span>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight leading-tight">
              같은 목록 안에서도<br>노출의 깊이를 다르게
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pt-2">
              모든 파트너를 공정하게 찾을 수 있게 하되, 유료 광고는 “더 큰 로고”가 아니라 더 풍부한 콘텐츠와 더 강한 연결로 차별화하는 구조입니다.
            </p>
          </div>

          <!-- Right Column -->
          <div class="lg:col-span-7 space-y-3.5">
            <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
              <div class="flex items-center gap-4 sm:gap-6">
                <span class="text-2xl sm:text-3xl font-black text-brand-forest font-serif">01</span>
                <div>
                  <h3 class="text-sm sm:text-base font-bold text-slate-900 tracking-tight">기본 등록</h3>
                  <p class="text-xs text-slate-500 mt-0.5">카테고리·지역 검색, 소개, 연락처</p>
                </div>
              </div>
              <div>
                <span class="text-xs font-bold text-brand-orange px-2.5 py-1 rounded-md bg-orange-50">발견</span>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
              <div class="flex items-center gap-4 sm:gap-6">
                <span class="text-2xl sm:text-3xl font-black text-brand-forest font-serif">02</span>
                <div>
                  <h3 class="text-sm sm:text-base font-bold text-slate-900 tracking-tight">콘텐츠 파트너</h3>
                  <p class="text-xs text-slate-500 mt-0.5">전문가 칼럼·뉴스·영상 자동 연결</p>
                </div>
              </div>
              <div>
                <span class="text-xs font-bold text-brand-orange px-2.5 py-1 rounded-md bg-orange-50">신뢰</span>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
              <div class="flex items-center gap-4 sm:gap-6">
                <span class="text-2xl sm:text-3xl font-black text-brand-forest font-serif">03</span>
                <div>
                  <h3 class="text-sm sm:text-base font-bold text-slate-900 tracking-tight">프리미엄 스포트라이트</h3>
                  <p class="text-xs text-slate-500 mt-0.5">상단 대형 노출 + 완성형 미니 웹사이트</p>
                </div>
              </div>
              <div>
                <span class="text-xs font-bold text-brand-orange px-2.5 py-1 rounded-md bg-orange-50">전환</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- "파트너 되기" CTA Banner -->
      <section class="bg-brand-orange rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-xl relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2 max-w-2xl">
            <span class="text-xs font-black tracking-widest text-white/80 uppercase">PARTNER WITH US</span>
            <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight">파트너 되기</h2>
            <p class="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
              기본 디렉터리 등록부터 전문가 칼럼, 영상 제작, 프리미엄 미니사이트까지 목적에 맞게 협업할 수 있습니다.
            </p>
          </div>

          <div>
            <button type="button" onclick="openPartnerInquiryModal()" class="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-brand-orange hover:bg-orange-50 font-bold text-sm sm:text-base tracking-tight shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap cursor-pointer">
              <span>파트너 문의하기 ➔</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Sub-footer Disclaimer Bar -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-200 pt-4 pb-2">
        <p>페이지 구조·광고 노출·콘텐츠 연결 방식 제안용</p>
        <div class="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-500 font-medium">
          목업 · 모든 상호/인물/후기는 샘플 데이터
        </div>
      </div>

    </div>

  </main>

  <!-- ===================================================================
       5. Partner Inquiry Modal (for "파트너 되기" CTA)
       =================================================================== -->
  <div id="inquiry-modal" class="hidden fixed inset-0 z-50 modal-backdrop-blur bg-black/60 items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
      <button type="button" onclick="closeInquiryModal()" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer" aria-label="닫기">
        <i class="fa-solid fa-xmark text-sm"></i>
      </button>

      <div class="text-center mb-6">
        <span class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-100 text-brand-orange text-xl mb-3">
          🤝
        </span>
        <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">파트너 등록 및 제휴 문의</h3>
        <p class="text-xs text-slate-500 mt-1">
          뉴저지 한인 동포들에게 신뢰받는 비즈니스 프로필을 선보이세요.
        </p>
      </div>

      <form id="inquiry-form" onsubmit="handleInquirySubmit(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">상호명 (비즈니스 이름) *</label>
          <input type="text" id="inq-business" required placeholder="예: 버겐 웰니스 클리닉" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">담당자 성함 *</label>
            <input type="text" id="inq-name" required placeholder="홍길동" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">연락처 *</label>
            <input type="text" id="inq-phone" required placeholder="201-000-0000" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">업종 / 분야 *</label>
          <select id="inq-category" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest bg-white">
            <option value="">분야를 선택해주세요</option>
            <option value="종합병원">종합병원</option>
            <option value="의원·클리닉">의원·클리닉</option>
            <option value="약국">약국</option>
            <option value="물리치료·재활">물리치료·재활</option>
            <option value="보험·브로커">보험·브로커</option>
            <option value="시니어 케어">시니어 케어</option>
            <option value="커뮤니티 센터">커뮤니티 센터</option>
            <option value="학원/교육">학원/교육</option>
            <option value="식당">식당</option>
            <option value="자동차">자동차</option>
            <option value="쇼핑">쇼핑</option>
            <option value="법률·회계·부동산">법률·회계·부동산</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">문의 내용 (선택)</label>
          <textarea id="inq-message" rows="3" placeholder="궁금하신 제휴 내용이나 홍보 희망 사항을 적어주세요." class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest"></textarea>
        </div>

        <div class="pt-2">
          <button type="submit" id="inq-submit-btn" class="w-full py-3 rounded-xl bg-brand-orange hover:bg-brand-orangeDark text-white font-bold text-sm tracking-tight shadow-md transition-all active:scale-95 cursor-pointer">
            제휴 신청 접수하기
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- ===================================================================
       6. Official Global Footer
       =================================================================== -->
  <footer class="bg-brand-dark text-white border-t border-slate-800 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p class="text-base font-bold text-white mb-2">NJ Access Portal</p>
          <p class="text-xs text-white/50 leading-relaxed">
            뉴저지 한인 동포를 위한 종합 의료 복지 정보 포털이자 신뢰받는 비즈니스 네트워크입니다.
          </p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">주요 메뉴</p>
          <ul class="space-y-2 text-xs text-white/60">
            <li><a href="/" class="hover:text-white transition-colors">홈 (Home)</a></li>
            <li><a href="/forum" class="hover:text-white transition-colors">뉴저지 한인 광장</a></li>
            <li><a href="/partners" class="hover:text-white font-bold text-emerald-400 transition-colors">뉴저지 파트너즈</a></li>
            <li><a href="/blog" class="hover:text-white transition-colors">건강 뉴스</a></li>
          </ul>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">의료 정보</p>
          <ul class="space-y-2 text-xs text-white/60">
            <li><a href="/resource-center" class="hover:text-white transition-colors">의료 &amp; 커뮤니티 정보센터</a></li>
            <li><a href="/medicare" class="hover:text-white transition-colors">메디케어 종합 가이드</a></li>
            <li><a href="/calculator" class="hover:text-white transition-colors">보조금 자격 계산기</a></li>
            <li><a href="/about" class="hover:text-white transition-colors">의료접근센터 소개</a></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="text-xs text-white/40 max-w-2xl leading-relaxed">
          <span class="font-semibold text-white/50">⚠ 면책 조항:</span> 본 사이트의 파트너 디렉터리는 정보 제공을 목적으로 운영되며, 개별 의료 진단 및 법률 자문은 각 전문 파트너와 직접 진행하시기 바랍니다.
        </div>
        <p class="text-xs text-white/40 whitespace-nowrap">© 2026 NJ Access Portal · 뉴저지 파트너즈 · All Rights Reserved.</p>
      </div>
    </div>
  </footer>

  <!-- ===================================================================
       7. Client-Side State, Filter Logic, Carousel & Direct Webpage Navigation
       =================================================================== -->
  <script>
    // Embedded SSR Data Store
    const rawPartnersData = <?= json_encode($partners, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>;
    let selectedCategory = 'all';
    let currentSlide = 0;
    const totalSlides = <?= count($slides) ?>;
    let slideInterval = null;

    // --- Mobile Menu Toggle ---
    function toggleMobileMenu() {
      const el = document.getElementById('mobile-menu');
      el.classList.toggle('hidden');
    }

    // --- Hero Carousel Controller ---
    function updateSlideUI() {
      const slides = document.querySelectorAll('.hero-slide');
      const dots = document.querySelectorAll('.carousel-dot');

      slides.forEach((s, idx) => {
        if (idx === currentSlide) {
          s.classList.remove('opacity-0', 'pointer-events-none', 'z-0');
          s.classList.add('opacity-100', 'z-10');
        } else {
          s.classList.remove('opacity-100', 'z-10');
          s.classList.add('opacity-0', 'pointer-events-none', 'z-0');
        }
      });

      dots.forEach((d, idx) => {
        if (idx === currentSlide) {
          d.classList.remove('w-2', 'bg-white/40');
          d.classList.add('w-8', 'bg-white');
        } else {
          d.classList.remove('w-8', 'bg-white');
          d.classList.add('w-2', 'bg-white/40');
        }
      });
    }

    function nextSlide() {
      if (totalSlides <= 1) return;
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlideUI();
    }

    function prevSlide() {
      if (totalSlides <= 1) return;
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateSlideUI();
    }

    function goToSlide(idx) {
      currentSlide = idx;
      updateSlideUI();
      resetSlideTimer();
    }

    function resetSlideTimer() {
      clearInterval(slideInterval);
      if (totalSlides > 1) {
        slideInterval = setInterval(nextSlide, 5500);
      }
    }

    // Initialize Carousel
    if (totalSlides > 1) {
      slideInterval = setInterval(nextSlide, 5500);
      const container = document.getElementById('hero-carousel-container');
      if (container) {
        container.addEventListener('mouseenter', () => clearInterval(slideInterval));
        container.addEventListener('mouseleave', () => resetSlideTimer());
      }
    }

    function handleHeroButtonClick(e, link) {
      if (!link || link === '#' || link === 'javascript:void(0)') {
        e.preventDefault();
        return;
      }
      if (link.startsWith('#partner-')) {
        e.preventDefault();
        const pId = link.replace('#', '');
        const p = rawPartnersData.find(item => item.id === pId);
        if (p) {
          handleCardClick(p.id, p.minisiteUrl);
        }
      }
    }

    // --- Direct Full Webpage Navigation (NO POPUP) ---
    function handleCardClick(partnerId, url) {
      if (url && url.trim() !== '' && url.trim() !== '#' && url.trim() !== 'javascript:void(0)') {
        const targetUrl = url.trim();
        if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = targetUrl;
        }
      } else {
        alert('해당 파트너사의 상세 웹사이트가 준비 중입니다.\n관리자 CMS(/admin3)에서 연결 웹사이트 주소(URL)를 등록하시면 클릭 시 해당 전체 웹페이지로 직접 이동합니다.');
      }
    }

    function handleDetailClick(e, partnerName, url) {
      if (!url || url.trim() === '' || url.trim() === '#' || url.trim() === 'javascript:void(0)') {
        e.preventDefault();
        alert(`[${partnerName}]\n상세 웹사이트가 준비 중입니다.\n관리자 CMS(/admin3)에서 연결 웹사이트 주소(URL)를 등록하시면 클릭 시 해당 전체 웹페이지로 직접 이동합니다.`);
      }
    }

    // --- Dynamic Filtering Logic (Category + Town + Search Text with AND logic) ---
    function selectCategory(cat, btnEl) {
      selectedCategory = cat;
      document.querySelectorAll('.category-chip').forEach(b => {
        b.classList.remove('active-pill');
      });
      if (btnEl) {
        btnEl.classList.add('active-pill');
      }
      applyFilters();
    }

    function clearSearch() {
      const searchInput = document.getElementById('filter-search');
      searchInput.value = '';
      document.getElementById('search-clear-btn').classList.add('hidden');
      applyFilters();
    }

    function resetAllFilters() {
      selectedCategory = 'all';
      document.querySelectorAll('.category-chip').forEach((b, i) => {
        if (i === 0) b.classList.add('active-pill');
        else b.classList.remove('active-pill');
      });
      document.getElementById('filter-search').value = '';
      document.getElementById('search-clear-btn').classList.add('hidden');
      applyFilters();
    }

    function applyFilters() {
      const searchVal = (document.getElementById('filter-search').value || '').trim().toLowerCase();
      const clearBtn = document.getElementById('search-clear-btn');
      if (searchVal) clearBtn.classList.remove('hidden');
      else clearBtn.classList.add('hidden');

      const cards = document.querySelectorAll('.partner-card');
      let visibleCount = 0;

      cards.forEach(card => {
        const cCat = (card.getAttribute('data-category') || '').trim();
        const cTown = (card.getAttribute('data-town') || '').trim().toLowerCase();
        const cName = (card.getAttribute('data-name') || '').trim().toLowerCase();
        const cIntro = (card.getAttribute('data-intro') || '').trim().toLowerCase();

        const matchCat = (selectedCategory === 'all' || cCat === selectedCategory);
        const matchSearch = (!searchVal || cName.includes(searchVal) || cIntro.includes(searchVal) || cCat.toLowerCase().includes(searchVal) || cTown.includes(searchVal));

        if (matchCat && matchSearch) {
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      document.getElementById('partner-count').textContent = visibleCount;
      const emptyState = document.getElementById('no-partners-msg');
      if (visibleCount === 0) {
        emptyState.classList.remove('hidden');
      } else {
        emptyState.classList.add('hidden');
      }
    }

    // --- Partner Inquiry Modal ---
    function openPartnerInquiryModal() {
      const modal = document.getElementById('inquiry-modal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }

    function closeInquiryModal() {
      const modal = document.getElementById('inquiry-modal');
      modal.classList.remove('flex');
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }

    document.getElementById('inquiry-modal').addEventListener('click', function(e) {
      if (e.target === this) closeInquiryModal();
    });

    async function handleInquirySubmit(e) {
      e.preventDefault();
      const submitBtn = document.getElementById('inq-submit-btn') || e.target.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '제휴 신청 접수하기';

      const business = (document.getElementById('inq-business').value || '').trim();
      const name = (document.getElementById('inq-name').value || '').trim();
      const phone = (document.getElementById('inq-phone').value || '').trim();
      const category = (document.getElementById('inq-category').value || '').trim();
      const message = (document.getElementById('inq-message').value || '').trim();

      if (!business || !name || !phone || !category) {
        alert('상호명, 담당자 성함, 연락처, 업종/분야를 모두 입력해주세요.');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="inline-block animate-spin mr-2">⏳</span> 신청 접수 및 이메일 전송 중...';
      }

      try {
        // 1. Submit to primary server API (/api/contact.php) which stores in CMS & emails njaccessportal@gmail.com
        const payload = {
          businessName: business,
          name: name,
          phone: phone,
          category: category,
          message: message || `파트너 등록 및 제휴 문의 신청 (${category})`,
          type: 'partner',
          contactMethod: 'phone'
        };

        const res = await fetch('/api/contact.php?action=submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        // 2. Dual-dispatch via FormSubmit to guarantee 100% email inbox delivery to njaccessportal@gmail.com
        try {
          fetch('https://formsubmit.co/ajax/njaccessportal@gmail.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              _subject: `[NJ Access Portal] 파트너 등록 및 제휴 문의: ${business} (${name})`,
              상호명: business,
              담당자성함: name,
              연락처: phone,
              업종분야: category,
              문의내용: message || '파트너 등록 및 제휴 희망 신청 (상세 메시지 없음)',
              접수페이지: '뉴저지 파트너즈 (njaccessportal.com/partners)'
            })
          }).catch(e => console.warn('FormSubmit dual-dispatch warning:', e));
        } catch (fsErr) {
          console.warn('FormSubmit trigger warning:', fsErr);
        }

        if (data && data.success) {
          alert(`[제휴 신청 접수 완료]\n\n상호명: ${business}\n담당자: ${name} (${phone})\n\n신청 내용이 njaccessportal@gmail.com으로 안전하게 전송되었습니다.\n담당자가 확인 후 신속히 안내해 드리겠습니다. 감사합니다!`);
          document.getElementById('inquiry-form').reset();
          closeInquiryModal();
        } else {
          alert((data && data.error) ? data.error : '접수 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        }
      } catch (err) {
        console.error('Inquiry submit error:', err);
        // Fallback directly via FormSubmit
        try {
          await fetch('https://formsubmit.co/ajax/njaccessportal@gmail.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              _subject: `[NJ Access Portal] 파트너 등록 및 제휴 문의: ${business} (${name})`,
              상호명: business,
              담당자성함: name,
              연락처: phone,
              업종분야: category,
              문의내용: message || '파트너 등록 및 제휴 희망 신청',
              접수페이지: '뉴저지 파트너즈 (njaccessportal.com/partners)'
            })
          });
          alert(`[제휴 신청 접수 완료]\n\n상호명: ${business}\n담당자: ${name}\n\n신청 내용이 njaccessportal@gmail.com으로 전송되었습니다. 담당자가 확인 후 신속히 안내해 드리겠습니다.`);
          document.getElementById('inquiry-form').reset();
          closeInquiryModal();
        } catch (fallbackErr) {
          alert('접수 전송 중 오류가 발생했습니다. njaccessportal@gmail.com으로 직접 문의해 주시기 바랍니다.');
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    }

    // --- ESC Key Handler for Modals ---
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeInquiryModal();
      }
    });

    // --- Per-Partner KakaoTalk Business Connection ---
    async function handleKakaoChat(partnerId, fallbackChannelId) {
      let channelId = fallbackChannelId ? fallbackChannelId.replace(/^@/, '') : '';

      try {
        const res = await fetch(`/api/partner_chat.php?id=${encodeURIComponent(partnerId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.channel_id) {
            channelId = data.channel_id;
          }
        }
      } catch (err) {
        console.warn('Partner chat resolution fallback:', err);
      }

      if (!channelId) {
        alert('해당 파트너의 카카오톡 채널 정보가 준비 중입니다. 잠시 후 다시 시도해 주세요.');
        return;
      }

      const directUrl = `https://pf.kakao.com/${channelId}/chat`;
      try {
        if (typeof Kakao !== 'undefined' && Kakao.Channel && Kakao.isInitialized && Kakao.isInitialized()) {
          Kakao.Channel.chat({
            channelPublicId: channelId
          });
          return;
        }
      } catch (sdkErr) {
        console.warn('Kakao SDK chat failed, falling back to direct link:', sdkErr);
      }

      window.open(directUrl, '_blank', 'noopener,noreferrer');
    }
  </script>
</body>
</html>
