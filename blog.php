<?php
/**
 * Healthcare Access Portal - Health News & Blog List (Instant Dynamic PHP Engine)
 * Renders all published CMS articles directly on the server with instant live search and filtering.
 */
require_once __DIR__ . '/api/db.php';

$db = get_db_data();
$posts = $db['posts'] ?? [];
function normalize_news_category($cat) {
    $c = trim($cat ?? '');
    if (!$c) return '의료칼럼';
    $lower = mb_strtolower($c, 'UTF-8');
    if ($c === '의료칼럼' || $c === '의사칼럼' || mb_strpos($lower, '칼럼') !== false) return '의료칼럼';
    if ($c === 'recall(리콜)' || $c === 'FDA 리콜' || mb_strpos($lower, 'recall') !== false || mb_strpos($lower, '리콜') !== false) return 'recall(리콜)';
    if ($c === 'health&wellness' || $c === 'Health & Wellness' || mb_strpos($lower, 'health') !== false || mb_strpos($lower, 'wellness') !== false) return 'health&wellness';
    if ($c === '의료보험' || $c === 'Medicare & ACA' || mb_strpos($lower, 'medicare') !== false || mb_strpos($lower, '보험') !== false) return '의료보험';
    if ($c === '한인건강 특집' || mb_strpos($lower, '한인건강') !== false || mb_strpos($lower, '특집') !== false) return '한인건강 특집';
    if ($c === '한인커뮤니티 뉴스' || mb_strpos($lower, '한인커뮤니티') !== false || mb_strpos($lower, '커뮤니티') !== false) return '한인커뮤니티 뉴스';
    if ($c === '의학뉴스' || mb_strpos($lower, '의학뉴스') !== false || mb_strpos($lower, '의학') !== false) return '의학뉴스';
    return in_array($c, ['의료칼럼', 'recall(리콜)', 'health&wellness', '의료보험', '한인건강 특집', '한인커뮤니티 뉴스', '의학뉴스']) ? $c : '의료칼럼';
}

$categories = ['전체', '의료칼럼', 'recall(리콜)', 'health&wellness', '의료보험', '한인건강 특집', '한인커뮤니티 뉴스', '의학뉴스'];

// Filter published posts
$publishedPosts = array_values(array_filter($posts, function($p) {
    return ($p['status'] ?? 'published') === 'published';
}));

foreach ($publishedPosts as &$pRef) {
    $pRef['category'] = normalize_news_category($pRef['category'] ?? '');
}
unset($pRef);
?>
<!DOCTYPE html>
<html lang="ko" class="h-full antialiased">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>건강 의료 뉴스 · Health News | 뉴저지 의료접근센터 · NJ Healthcare Access Center</title>
  <meta name="description" content="뉴저지 의료접근센터(NJ Healthcare Access Center) 건강 의료 뉴스. 최신 미국 의료 정보, 메디케어 및 ACA 건강보험 규정, 전문의 칼럼, FDA 약물 리콜 및 의학 연구 소식을 한국어로 제공합니다." />
  <meta name="keywords" content="nj healthcare access portal, nj healthcare access center, healthcare access center, 뉴저지 의료접근센터, 의료접근, 의료접근센터, 건강 의료 뉴스, 의사칼럼, FDA 리콜, 메디케어 뉴스, 한인 건강 뉴스" />
  <link rel="canonical" href="https://kor2.njaccessportal.com/blog" />

  <!-- OpenGraph / Social Media -->
  <meta property="og:site_name" content="뉴저지 의료접근센터 · NJ Healthcare Access Center" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://kor2.njaccessportal.com/blog" />
  <meta property="og:title" content="건강 의료 뉴스 · Health News | 뉴저지 의료접근센터 (NJ Healthcare Access Center)" />
  <meta property="og:description" content="최신 미국 의료 정보, 메디케어 업데이트, 의사 칼럼 및 건강 연구 뉴스를 한국어로 제공합니다." />
  <meta property="og:image" content="https://kor2.njaccessportal.com/logo-icon.svg" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="건강 의료 뉴스 · Health News | 뉴저지 의료접근센터" />
  <meta name="twitter:description" content="최신 미국 의료 정보, 메디케어 업데이트, 의사 칼럼 및 건강 연구 뉴스를 한국어로 제공합니다." />
  <meta name="twitter:image" content="https://kor2.njaccessportal.com/logo-icon.svg" />

  <!-- Schema.org JSON-LD Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "건강 의료 뉴스 · Health News | 뉴저지 의료접근센터",
    "description": "최신 미국 의료 정보, 메디케어 업데이트, 의사 칼럼 및 건강 연구 뉴스를 한국어로 제공합니다.",
    "url": "https://kor2.njaccessportal.com/blog",
    "isPartOf": {
      "@type": "WebSite",
      "name": "뉴저지 의료접근센터 · NJ Healthcare Access Center",
      "url": "https://kor2.njaccessportal.com/"
    },
    "publisher": {
      "@type": "MedicalOrganization",
      "name": "뉴저지 의료접근센터 (NJ Healthcare Access Center)",
      "alternateName": ["NJ Healthcare Access Portal", "Healthcare Access Center", "의료접근센터", "의료접근"],
      "url": "https://kor2.njaccessportal.com"
    }
  }
  </script>

  <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
  <link rel="icon" href="/favicon.ico?v=2" sizes="16x16 32x32 48x48" type="image/x-icon" />
  <link rel="icon" href="/favicon-192.png?v=2" sizes="192x192" type="image/png" />
  <link rel="icon" href="/favicon-512.png?v=2" sizes="512x512" type="image/png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/_next/static/chunks/1fosv8xgmgdeu.css" />

  <style>
    :root, html, body {
      font-family: "Pretendard Variable", Pretendard, "Noto Sans KR", -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif !important;
    }
    @keyframes marqueeScroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .marquee-track {
      display: inline-flex !important;
      white-space: nowrap !important;
      will-change: transform;
      animation: marqueeScroll 35s linear infinite !important;
    }
    .marquee-track:hover {
      animation-play-state: paused;
    }

    /* Ensure blog posts, parent sections, and grid are always 100% visible on mobile & desktop */
    #cms-blog-main-section,
    section:has(#cms-blog-posts-grid),
    #cms-blog-posts-grid,
    .blog-post-card-item,
    .blog-post-card-item article {
      opacity: 1 !important;
      visibility: visible !important;
      transform: none !important;
    }
    .fx-slide,
    .njap-slide-in {
      opacity: 1 !important;
      transform: none !important;
    }
  </style>
</head>
<body class="min-h-full flex flex-col bg-brand-light">

  <!-- Top Marquee Banner -->
  <div class="fixed top-0 left-0 right-0 z-50 h-[45px] overflow-hidden flex items-center" style="background:#000000">
    <div class="marquee-track whitespace-nowrap">
      <?php for ($i = 0; $i < 6; $i++): ?>
        <span class="inline-block font-sans text-xs text-white/90 tracking-wide px-12">
          <span class="opacity-60 mr-3">✦</span>의료접근포탈: &quot;비영리 기관들의 의료관련 정보서비스의 한계를 넘어, 최고의 의료 전문가들이 제공하는 언어와 문화의 장벽 없이, 분야별 최고 전문가가 함께하는 무료 프리미엄 의료 접근·네비게이션 서비스&quot;<span class="opacity-60 ml-3">✦</span>
        </span>
      <?php endfor; ?>
    </div>
  </div>

  <!-- Navigation Bar -->
  <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-sm" style="top:45px">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <a class="flex-shrink-0 group flex items-center gap-2.5 cursor-pointer njap-brand-link" href="/" onclick="navigateToHome(event); return false;">
          <div class="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <img src="/logo-icon.svg" alt="NJAP Logo" class="w-full h-full object-contain transition-transform group-hover:scale-105" />
          </div>
          <div>
            <span class="font-serif text-xl text-brand-dark group-hover:text-brand-blue transition-colors duration-200 block">Healthcare Access Portal</span>
            <span class="block text-[10px] font-sans text-brand-muted leading-tight -mt-0.5">뉴저지 한인 의료 접근 포털</span>
          </div>
        </a>
        <div class="hidden md:flex items-center">
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue cursor-pointer" href="/" onclick="navigateToHome(event); return false;">홈</a>
          <a class="nav-link pb-0.5 font-bold text-brand-blue" href="/blog">뉴스</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/senior-care">시니어 케어</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/medicare">메디케어 &amp; ACA</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/tool">환자도우미</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/about">소개</a>
        </div>
        <div class="flex items-center gap-3">
          <!-- KakaoTalk 1:1 Chat Button (Top Nav) -->
          <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer" title="카카오톡 1:1 상담 바로가기"><img src="/kakaotalk-icon.png" alt="KakaoTalk" class="w-6 h-6 rounded-md shrink-0 object-contain shadow-xs" /><span class="text-xs sm:text-sm font-bold text-slate-800 hover:text-brand-blue tracking-tight whitespace-nowrap">1:1 상담</span></a>
          <button id="en-translate-btn" class="notranslate" translate="no" onclick="window.toggleTranslation && window.toggleTranslation()" title="Switch Language (EN / KR)" aria-label="Language Toggle" style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:999px;border:1.5px solid #cbd5e1;font-size:11px;font-weight:700;letter-spacing:0.08em;cursor:pointer;transition:all 0.2s ease;background:transparent;color:#475569;white-space:nowrap;flex-shrink:0;line-height:1.4;"><span class="notranslate" translate="no">🌐</span> <span class="notranslate en-btn-label" translate="no">EN</span></button>
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
                <div id="mobile-menu-dropdown" class="md:hidden overflow-hidden transition-all duration-300 max-h-0 opacity-0 bg-white/98 backdrop-blur-md border-t border-brand-border px-4 py-3 flex flex-col gap-1" style="-webkit-overflow-scrolling: touch;">
      <!-- 1. 홈 -->
      <a href="/" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span class="text-[15px]">홈</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 2. 뉴스 -->
      <a href="/blog" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-bold text-brand-blue bg-blue-50/70">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
          <span class="text-[15px]">뉴스</span>
        </div>
        <svg class="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 3. 시니어 케어 -->
      <a href="/senior-care" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          <span class="text-[15px]">시니어 케어</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 4. 메디케어 & ACA -->
      <a href="/medicare" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          <span class="text-[15px]">메디케어 &amp; ACA</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 5. 환자도우미 -->
      <a href="/tool" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span class="text-[15px]">환자도우미</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 6. 소개 -->
      <a href="/about" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span class="text-[15px]">소개</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
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
    </div>
  </nav>

  <div class="h-[109px]"></div>

  <main class="flex-1">
    <div>
      <!-- Header Banner -->
      <section class="bg-brand-darker text-white py-8 sm:py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p class="text-xs font-sans font-semibold uppercase tracking-widest text-blue-300 mb-2">뉴스 &amp; 정보</p>
          <h1 class="font-serif text-3xl sm:text-5xl text-white mb-2.5">건강 의료 뉴스</h1>
          <p class="text-white/60 font-sans text-sm sm:text-lg max-w-xl">최신 미국 의료 정보, 메디케어 업데이트, 의사 칼럼 및 건강 연구 뉴스를 한국어로 제공합니다.</p>
        </div>
      </section>

      <!-- Category Filter & Search Bar -->
      <section class="bg-white border-b border-brand-border sticky top-[109px] z-30 shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-2.5 sm:gap-4 items-start sm:items-center justify-between">
          <div id="cms-blog-categories" class="flex gap-1.5 sm:gap-2 flex-wrap">
            <button onclick="handleBlogCategoryClick(this, '전체')" class="category-filter-btn text-xs sm:text-sm font-sans font-medium px-3.5 py-1.5 rounded-full border transition-all duration-200 bg-brand-gradient text-white border-transparent shadow-sm cursor-pointer">전체</button>
            <?php foreach (array_filter($categories, function($c) { return $c !== '전체'; }) as $cat): ?>
              <button onclick="handleBlogCategoryClick(this, '<?= htmlspecialchars($cat) ?>')" class="category-filter-btn text-xs sm:text-sm font-sans font-medium px-3.5 py-1.5 rounded-full border transition-all duration-200 border-brand-border text-brand-muted hover:border-brand-blue hover:text-brand-blue bg-white cursor-pointer"><?= htmlspecialchars($cat) ?></button>
            <?php endforeach; ?>
          </div>
          <div class="relative w-full sm:w-64">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted text-sm">🔍</span>
            <input id="cms-blog-search-input" oninput="handleBlogSearchInput(this.value)" type="text" placeholder="기사 검색..." class="w-full text-xs sm:text-sm font-sans pl-9 pr-4 py-2 rounded-full border border-brand-border bg-brand-light outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all" value="" />
          </div>
        </div>
      </section>

      <!-- Main News Content Grid (4 News per Row) -->
      <section id="cms-blog-main-section" class="py-6 sm:py-10 bg-brand-light">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="cms-blog-posts-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            <?php foreach ($publishedPosts as $p): 
              $pCover = $p['coverImage'] ?: (!empty($p['images'][0]) ? $p['images'][0] : 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80');
              $pCat = $p['category'] ?: '의료칼럼';
              $searchBlob = mb_strtolower(($p['title'] ?? '') . ' ' . ($p['excerpt'] ?? '') . ' ' . ($p['author'] ?? '') . ' ' . ($p['category'] ?? ''));
            ?>
              <a class="blog-post-card-item group card-hover block h-full" href="/blog/<?= htmlspecialchars($p['slug'] ?: $p['id']) ?>" data-category="<?= htmlspecialchars($pCat) ?>" data-search="<?= htmlspecialchars($searchBlob) ?>">
                <article class="bg-white rounded-2xl overflow-hidden border border-brand-border h-full flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300">
                  <div>
                    <div class="relative h-44 sm:h-48 overflow-hidden bg-gray-100">
                      <img src="<?= htmlspecialchars($pCover) ?>" alt="<?= htmlspecialchars($p['title'] ?? '') ?>" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500">
                      <div class="absolute top-2.5 left-2.5">
                        <span class="tag-pill bg-brand-blue text-white font-bold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-xs"><?= htmlspecialchars($pCat) ?></span>
                      </div>
                    </div>
                    <div class="p-4 sm:p-4.5">
                      <div class="flex items-center gap-2 text-[11px] font-sans text-brand-muted mb-2">
                        <span><?= htmlspecialchars($p['date'] ?: '2026') ?></span>
                        <span>·</span>
                        <span><?= htmlspecialchars($p['author'] ?: '편집부') ?></span>
                      </div>
                      <h2 class="font-serif text-sm sm:text-base font-bold text-brand-dark leading-snug mb-2 line-clamp-2 group-hover:text-brand-blue transition-colors duration-200"><?= htmlspecialchars($p['title'] ?? '') ?></h2>
                      <p class="text-xs font-sans text-brand-muted leading-relaxed line-clamp-2"><?= htmlspecialchars($p['excerpt'] ?? '') ?></p>
                    </div>
                  </div>
                  <div class="px-4 pb-3.5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-brand-blue font-medium">
                    <span>⏱ <?= htmlspecialchars($p['readTime'] ?: '3분') ?> 읽기</span>
                    <span class="group-hover:translate-x-1 transition-transform inline-block">읽기 →</span>
                  </div>
                </article>
              </a>
            <?php endforeach; ?>
          </div>
          <div id="cms-blog-empty-state" class="hidden py-16 text-center text-slate-500">
            <p class="text-lg font-medium">선택하신 조건에 해당하는 기사가 없습니다.</p>
            <p class="text-sm text-slate-400 mt-1">다른 카테고리나 검색어를 선택해보세요.</p>
          </div>
        </div>
      </section>

    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-brand-darker text-white">
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
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/tool">보조금 계산기</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/tool">의학 용어 사전</a></li>
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

  <script>

    // 2. Blog filter initialization immediately or on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyBlogFilter);
    } else {
      applyBlogFilter();
    }

    // 3. Instant Blog Category & Search Filter
    var blogSelectedCategory = '전체';
    var blogSearchKeyword = '';

    function normalizeCatString(cat) {
      if (!cat) return '';
      var c = cat.trim().toLowerCase().replace(/\s+/g, '');
      if (c.indexOf('의료칼럼') !== -1 || c.indexOf('의사칼럼') !== -1) return '의료칼럼';
      if (c.indexOf('recall') !== -1 || c.indexOf('리콜') !== -1) return 'recall(리콜)';
      if (c.indexOf('health') !== -1 || c.indexOf('wellness') !== -1) return 'health&wellness';
      if (c.indexOf('의료보험') !== -1 || c.indexOf('medicare') !== -1 || c.indexOf('aca') !== -1 || c.indexOf('보험') !== -1) return '의료보험';
      if (c.indexOf('한인건강') !== -1 || c.indexOf('특집') !== -1) return '한인건강 특집';
      if (c.indexOf('한인커뮤니티') !== -1 || c.indexOf('커뮤니티') !== -1) return '한인커뮤니티 뉴스';
      if (c.indexOf('의학뉴스') !== -1 || c.indexOf('의학') !== -1) return '의학뉴스';
      return c;
    }

    function applyBlogFilter() {
      var cards = document.querySelectorAll('.blog-post-card-item');
      var emptyBox = document.getElementById('cms-blog-empty-state');
      var normActive = blogSelectedCategory === '전체' ? '' : normalizeCatString(blogSelectedCategory);
      var query = (blogSearchKeyword || '').trim().toLowerCase();
      var visible = 0;

      cards.forEach(function(card) {
        var cardCat = normalizeCatString(card.getAttribute('data-category') || '');
        var cardSearch = (card.getAttribute('data-search') || '').toLowerCase();

        var matchCat = !normActive || cardCat === normActive;
        var matchSearch = !query || cardSearch.indexOf(query) !== -1;

        if (matchCat && matchSearch) {
          card.style.display = '';
          visible++;
        } else {
          card.style.display = 'none';
        }
      });

      if (emptyBox) {
        emptyBox.classList.toggle('hidden', visible > 0);
      }
    }

    window.handleBlogCategoryClick = function(btn, catName) {
      blogSelectedCategory = catName;
      var catBox = document.getElementById('cms-blog-categories');
      if (catBox) {
        catBox.querySelectorAll('button').forEach(function(b) {
          b.className = 'category-filter-btn text-xs sm:text-sm font-sans font-medium px-3.5 py-1.5 rounded-full border transition-all duration-200 border-brand-border text-brand-muted hover:border-brand-blue hover:text-brand-blue bg-white cursor-pointer';
        });
      }
      if (btn) {
        btn.className = 'category-filter-btn text-xs sm:text-sm font-sans font-medium px-3.5 py-1.5 rounded-full border transition-all duration-200 bg-brand-gradient text-white border-transparent shadow-sm cursor-pointer';
      }
      applyBlogFilter();
    };

    window.handleBlogSearchInput = function(val) {
      blogSearchKeyword = val;
      applyBlogFilter();
    };

    // Auto-select category if URL param present (e.g. ?category=의료칼럼)
    document.addEventListener('DOMContentLoaded', function() {
      try {
        var p = new URLSearchParams(window.location.search);
        var qCat = p.get('category');
        if (qCat) {
          var btns = document.querySelectorAll('#cms-blog-categories button');
          btns.forEach(function(b) {
            if (normalizeCatString(b.textContent) === normalizeCatString(qCat)) {
              window.handleBlogCategoryClick(b, b.textContent.trim());
            }
          });
        }
      } catch(e) {}
    });
  </script>
  

  <script src="/js/cms-client.js?v=3.5.2"></script>
  <script src="/js/fixes.js?v=4.1.0"></script>
<script src="/js/njap-translate.js?v=3.0.0"></script>
</body>
</html>
