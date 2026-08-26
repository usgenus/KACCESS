<?php
/**
 * Healthcare Access Portal - Main Homepage (Instant Dynamic PHP Engine)
 * Renders the latest CMS Billboard, Top Story, Real-time News, Policy Reports, and Video News directly on the server.
 */
require_once __DIR__ . '/api/db.php';

$db = get_db_data();
$billboards = $db['billboards'] ?? [];
$billboards2 = $db['billboards2'] ?? [];
$videos = $db['videos'] ?? [];
$posts = $db['posts'] ?? [];

// Filter active billboards
$activeBillboards = array_values(array_filter($billboards, function($b) {
    return !isset($b['active']) || $b['active'] !== false;
}));
if (empty($activeBillboards) && !empty($billboards)) {
    $activeBillboards = $billboards;
}

// Filter active billboards 2
$activeBillboards2 = array_values(array_filter($billboards2, function($b) {
    return !isset($b['active']) || $b['active'] !== false;
}));
if (empty($activeBillboards2) && !empty($billboards2)) {
    $activeBillboards2 = $billboards2;
}

// Filter published posts and sort by newest first (date then updatedAt/createdAt)
$publishedPosts = array_values(array_filter($posts, function($p) {
    return ($p['status'] ?? 'published') === 'published';
}));
usort($publishedPosts, function($a, $b) {
    $d1 = strtotime($a['date'] ?? '1970-01-01');
    $d2 = strtotime($b['date'] ?? '1970-01-01');
    if ($d1 !== $d2) {
        return $d2 <=> $d1;
    }
    $u1 = strtotime($a['updatedAt'] ?? $a['createdAt'] ?? '1970-01-01');
    $u2 = strtotime($b['updatedAt'] ?? $b['createdAt'] ?? '1970-01-01');
    return $u2 <=> $u1;
});
$posts = !empty($publishedPosts) ? $publishedPosts : $posts;

// 1. Doctor / Medical Column (의료칼럼) ONLY: strictly items with isDoctorColumn === true
$doctorPosts = array_values(array_filter($posts, function($p) {
    return !empty($p['isDoctorColumn']) && $p['isDoctorColumn'] !== 'false' && $p['isDoctorColumn'] !== false && $p['isDoctorColumn'] !== 0 && $p['isDoctorColumn'] !== '0';
}));

// Find Top Story (strictly isTopStory === true)
$topStory = null;
foreach ($posts as $p) {
    if (!empty($p['isTopStory']) && $p['isTopStory'] !== 'false' && $p['isTopStory'] !== false && $p['isTopStory'] !== 0 && $p['isTopStory'] !== '0') {
        $topStory = $p;
        break;
    }
}
// If no explicit top story, fall back to newest live update post
if (!$topStory) {
    foreach ($posts as $p) {
        if (!empty($p['isLiveUpdate']) && $p['isLiveUpdate'] !== 'false' && $p['isLiveUpdate'] !== false && $p['isLiveUpdate'] !== 0 && $p['isLiveUpdate'] !== '0') {
            $topStory = $p;
            break;
        }
    }
}
if (!$topStory && !empty($posts)) {
    $topStory = $posts[0];
}

// 2. Middle Column: 실시간 주요 뉴스 (Live Updates - Strictly only posts with isLiveUpdate === true, Max 6)
$latestNews = array_values(array_filter($posts, function($p) use ($topStory) {
    if ($topStory && (string)$p['id'] === (string)$topStory['id']) {
        return false;
    }
    $isLive = !empty($p['isLiveUpdate']) && $p['isLiveUpdate'] !== 'false' && $p['isLiveUpdate'] !== false && $p['isLiveUpdate'] !== 0 && $p['isLiveUpdate'] !== '0';
    return $isLive;
}));
$latestNews = array_slice($latestNews, 0, 6);

// 3. Recalls & Food Safety / Reports: (4 slots strictly: prioritize isPolicyReport or category '리콜(Recalls and Food Safety)')
$explicitReports = array_values(array_filter($posts, function($p) use ($topStory) {
    if ($topStory && (string)$p['id'] === (string)$topStory['id']) return false;
    $isReport = (!empty($p['isPolicyReport']) && $p['isPolicyReport'] !== 'false' && $p['isPolicyReport'] !== false && $p['isPolicyReport'] !== 0 && $p['isPolicyReport'] !== '0')
        || (($p['category'] ?? '') === '리콜(Recalls and Food Safety)')
        || (($p['category'] ?? '') === '보건 정책 & 메디케어 리포트')
        || (($p['category'] ?? '') === '보건 정책 & 리포트');
    return $isReport;
}));
$otherCandidates = array_values(array_filter($posts, function($p) use ($topStory, $explicitReports) {
    if ($topStory && (string)$p['id'] === (string)$topStory['id']) return false;
    foreach ($explicitReports as $er) {
        if ((string)$er['id'] === (string)$p['id']) return false;
    }
    return true;
}));
$reportNews = array_slice(array_merge($explicitReports, $otherCandidates), 0, 4);

// Live update headline (Strictly latest post with isLiveUpdate or isTopStory)
$liveUpdatePost = null;
foreach ($posts as $p) {
    if (!empty($p['isLiveUpdate']) && $p['isLiveUpdate'] !== 'false' && $p['isLiveUpdate'] !== false && $p['isLiveUpdate'] !== 0 && $p['isLiveUpdate'] !== '0') {
        $liveUpdatePost = $p;
        break;
    }
}
if (!$liveUpdatePost && $topStory) {
    $liveUpdatePost = $topStory;
}
$liveHeadline = !empty($liveUpdatePost['title']) ? $liveUpdatePost['title'] : '뉴저지 한인 의료 접근 포털 — 2026 메디케어 및 ACA 오바마케어 수혜 자격 종합 안내 개시';
$liveSlug = !empty($liveUpdatePost['slug']) ? $liveUpdatePost['slug'] : (!empty($liveUpdatePost['id']) ? $liveUpdatePost['id'] : '');

// Medical videos
$activeVideos = array_values(array_filter($videos, function($v) {
    return !isset($v['active']) || $v['active'] !== false;
}));
if (empty($activeVideos) && !empty($videos)) {
    $activeVideos = $videos;
}
$mainVideo = $activeVideos[0] ?? null;
$playlistVideos = array_slice($activeVideos, 0, 4);
?>
<!DOCTYPE html>
<html lang="ko" class="h-full antialiased">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Healthcare Access Portal | 뉴저지 한인 의료 정보 포털</title>
  <meta name="description" content="뉴저지 한인 커뮤니티를 위한 의료 접근 및 건강 정보 포털. 메디케어, ACA, 의료 상담을 한국어로 제공합니다." />
  <meta property="og:title" content="Healthcare Access Portal | 뉴저지 한인 의료 정보 포털" />
  <meta property="og:description" content="뉴저지 한인 커뮤니티를 위한 의료 접근 및 건강 정보 포털. 메디케어, ACA, 의료 상담을 한국어로 제공합니다." />
  <meta property="og:image" content="<?= htmlspecialchars($topStory['coverImage'] ?? '/logo-icon.svg') ?>" />
  <link rel="icon" href="/favicon.ico" sizes="256x256" type="image/x-icon" />

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/_next/static/chunks/1fosv8xgmgdeu.css" />

  <style>
    :root, html, body {
      font-family: "Pretendard Variable", Pretendard, "Noto Sans KR", -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif !important;
    }
    html, body {
      overflow-x: hidden !important;
      max-width: 100% !important;
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
    .h-\[109px\], .header-spacer, #header-spacer {
      height: 109px !important;
      min-height: 109px !important;
      display: block !important;
      width: 100% !important;
    }
    .h-\[45px\] {
      height: 45px !important;
    }
    #gallery-billboard-section {
      width: 100vw !important;
      max-width: 100vw !important;
      position: relative !important;
      left: 50% !important;
      right: 50% !important;
      margin-left: -50vw !important;
      margin-right: -50vw !important;
      opacity: 1 !important;
      transform: none !important;
      display: block !important;
      visibility: visible !important;
    }
    #gallery-billboard-container {
      opacity: 1 !important;
      transform: none !important;
      visibility: visible !important;
    }
    @media (max-width: 640px) {
      #gallery-billboard-section {
        margin-top: 0 !important;
        margin-bottom: 1.25rem !important;
      }
      #gallery-billboard-container > div {
        min-height: 230px !important;
        height: 240px !important;
      }
      #gallery-billboard-container video,
      #gallery-billboard-container img {
        min-height: 230px !important;
        height: 100% !important;
        object-fit: cover !important;
      }
    }

    /* Billboard Image Hover Scale */
    #gallery-billboard-container img,
    #gallery-billboard-container video,
    #billboard-active-img,
    .billboard-img {
      transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
      will-change: transform;
    }
    #gallery-billboard-container:hover img,
    #gallery-billboard-container:hover video,
    #gallery-billboard-section:hover img,
    .group:hover #billboard-active-img {
      transform: scale(1.06) !important;
    }

    /* Section Slide-In Animation */
    .reveal-section {
      opacity: 0;
      transform: translateY(35px);
      transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
      will-change: opacity, transform;
    }
    .reveal-section.is-revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }

    /* 3-Column News Section: 2.0fr Top Story (Wider) | 1.05fr Latest News | 0.58fr Doctor Column (35% narrower) */
    .news-layout-3col {
      display: grid !important;
      grid-template-columns: 1fr !important;
      gap: 1.5rem !important;
      width: 100% !important;
    }
    @media (min-width: 1024px) {
      .news-layout-3col {
        display: grid !important;
        grid-template-columns: 2.0fr 1.05fr 0.58fr !important;
        gap: 1.75rem !important;
        align-items: start !important;
      }
      .news-col-left {
        border-right: 1px solid #e5e7eb !important;
        padding-right: 1.75rem !important;
      }
      .news-col-mid {
        border-right: 1px solid #e5e7eb !important;
        padding-right: 1.75rem !important;
      }
      .news-col-right {
        padding-left: 0.25rem !important;
      }
    }

    /* News Thumbnail Box (Middle Column) */
    .news-thumb-box {
      width: 80px !important;
      height: 56px !important;
      min-width: 80px !important;
      min-height: 56px !important;
      max-width: 80px !important;
      max-height: 56px !important;
      flex-shrink: 0 !important;
      overflow: hidden !important;
      border-radius: 4px !important;
      background-color: #f3f4f6 !important;
    }
    .news-thumb-box img {
      width: 80px !important;
      height: 56px !important;
      object-fit: cover !important;
      display: block !important;
    }

    /* Small Thumbnail Box (Doctor Column - Compact) */
    .news-thumb-small {
      width: 44px !important;
      height: 34px !important;
      min-width: 44px !important;
      min-height: 34px !important;
      max-width: 44px !important;
      max-height: 34px !important;
      flex-shrink: 0 !important;
      overflow: hidden !important;
      border-radius: 4px !important;
      background-color: #f3f4f6 !important;
    }
    .news-thumb-small img {
      width: 44px !important;
      height: 34px !important;
      object-fit: cover !important;
      display: block !important;
    }
  </style>
</head>
<body class="min-h-full flex flex-col bg-brand-light">

  <!-- Top Marquee Banner -->
  <div class="fixed top-0 left-0 right-0 z-50 overflow-hidden flex items-center" style="height: 45px; background:linear-gradient(135deg, #0f3a9e 0%, #5e0f73 100%)">
    <div class="marquee-track whitespace-nowrap">
      <?php for ($i = 0; $i < 6; $i++): ?>
        <span class="inline-block font-sans text-xs text-white/90 tracking-wide px-12">
          <span class="opacity-60 mr-3">✦</span>의료접근포탈: &quot;비영리 기관들의 의료관련 정보서비스의 한계를 넘어, 최고의 의료 전문가들이 제공하는 언어와 문화의 장벽 없이, 분야별 최고 전문가가 함께하는 무료 프리미엄 의료 접근·네비게이션 서비스&quot;<span class="opacity-60 ml-3">✦</span>
        </span>
      <?php endfor; ?>
    </div>
  </div>

  <!-- Main Navigation Bar -->
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
        <div class="hidden md:flex items-center gap-8">
          <a class="nav-link pb-0.5 font-bold text-brand-blue cursor-pointer" href="/" onclick="navigateToHome(event); return false;">홈</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/blog">뉴스</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/medicare">메디케어 &amp; ACA</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/tool">환자도우미</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/about">소개</a>
        </div>
        <div class="flex items-center gap-4">
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
    <div id="mobile-menu-dropdown" class="md:hidden overflow-hidden transition-all duration-300 max-h-0 opacity-0 bg-white/95 backdrop-blur-md border-t border-brand-border px-4 py-4 flex flex-col gap-3">
      <a class="font-sans text-sm font-bold text-brand-blue py-2 border-b border-brand-border/50 cursor-pointer" href="/" onclick="navigateToHome(event); return false;">홈</a>
      <a class="font-sans text-sm font-medium text-brand-dark hover:text-brand-blue py-2 border-b border-brand-border/50" href="/blog">뉴스</a>
      <a class="font-sans text-sm font-medium text-brand-dark hover:text-brand-blue py-2 border-b border-brand-border/50" href="/medicare">메디케어 &amp; ACA</a>
      <a class="font-sans text-sm font-medium text-brand-dark hover:text-brand-blue py-2 border-b border-brand-border/50" href="/tool">환자도우미</a>
      <a class="font-sans text-sm font-medium text-brand-dark hover:text-brand-blue py-2 border-b border-brand-border/50" href="/about">소개</a>
    </div>
  </nav>

  <div class="h-[109px] header-spacer" style="height: 109px; min-height: 109px; width: 100%;"></div>

  <main class="flex-1">
    <div class="flex flex-col bg-[#F3F3F5] min-h-screen text-[#111111] font-sans">
      
      <!-- 1. 100vw Panoramic Billboard Section (At Top) -->
      <section id="gallery-billboard-section" class="w-full font-sans bg-slate-950 mb-6" style="width:100vw; max-width:100vw; position:relative; left:50%; right:50%; margin-left:-50vw; margin-right:-50vw;">
        <div id="gallery-billboard-container" class="w-full relative group">
          <?php if (!empty($activeBillboards)): 
            $b = $activeBillboards[0];
            $isVideo = ($b['mediaType'] ?? '') === 'video' || (isset($b['mediaUrl']) && (str_ends_with($b['mediaUrl'], '.mp4') || str_ends_with($b['mediaUrl'], '.webm')));
          ?>
          <div class="relative w-full overflow-hidden bg-slate-950 select-none group" style="aspect-ratio: 1920 / 566; min-height: 230px; width: 100%; max-height: 480px;">
            <a href="<?= htmlspecialchars($b['linkUrl'] ?? '/about#contact') ?>" class="block relative w-full h-full cursor-pointer" title="<?= htmlspecialchars($b['title'] ?? '') ?>">
              <div class="w-full h-full relative overflow-hidden" style="min-height: 230px;">
                <?php if ($isVideo): ?>
                  <video src="<?= htmlspecialchars($b['mediaUrl']) ?>" class="w-full h-full object-cover" autoplay muted loop playsinline></video>
                <?php else: ?>
                  <img id="billboard-active-img" 
                    src="<?= htmlspecialchars($b['mediaUrl'] ?: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=2000&q=85&auto=format') ?>" 
                    alt="<?= htmlspecialchars($b['title'] ?? '') ?>" 
                    class="w-full h-full object-cover transform scale-100 group-hover:scale-103 transition-transform duration-1000 ease-out">
                <?php endif; ?>
                <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/15 pointer-events-none"></div>
                <div class="absolute inset-0 bg-gradient-to-r from-black/75 via-transparent to-black/25 pointer-events-none"></div>
              </div>

              <div class="absolute inset-0 flex items-end">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-4 sm:pb-6 flex items-end justify-between gap-4">
                  <div class="max-w-3xl space-y-1 sm:space-y-2">
                    <div class="flex items-center gap-2">
                      <span class="bg-red-600 text-white text-[10px] sm:text-xs font-extrabold px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow">
                        <?= htmlspecialchars(!empty($b['subtitle']) ? $b['subtitle'] : ($b['category'] ?? 'SPECIAL CAMPAIGN')) ?>
                      </span>
                      <span class="text-xs font-mono text-white/80 bg-black/60 px-2.5 py-0.5 rounded-full border border-white/15">
                        1 / <?= count($activeBillboards) ?>
                      </span>
                    </div>
                    <h3 class="font-extrabold text-base sm:text-2xl md:text-3xl text-white tracking-tight leading-snug drop-shadow-md group-hover:text-blue-300 transition-colors line-clamp-1">
                      <?= htmlspecialchars($b['title'] ?? '') ?>
                    </h3>
                  </div>

                  <div class="flex items-center gap-2 shrink-0">
                    <span class="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-brand-blue text-white font-extrabold text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-xl">
                      <span><?= htmlspecialchars($b['linkText'] ?? '자세히 보기') ?></span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </div>
            </a>

            <button onclick="event.stopPropagation(); event.preventDefault(); window.cmsPrevBillboard();" 
              class="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-red-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center text-xl sm:text-3xl transition-all duration-200 z-20 hover:scale-110 shadow-2xl cursor-pointer"
              aria-label="Previous Slide">
              ‹
            </button>

            <button onclick="event.stopPropagation(); event.preventDefault(); window.cmsNextBillboard();" 
              class="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-red-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center text-xl sm:text-3xl transition-all duration-200 z-20 hover:scale-110 shadow-2xl cursor-pointer"
              aria-label="Next Slide">
              ›
            </button>

            <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
              <?php foreach ($activeBillboards as $idx => $dummy): ?>
                <button onclick="event.stopPropagation(); event.preventDefault(); window.cmsGoBillboard(<?= $idx ?>);" 
                  class="transition-all duration-300 <?= $idx === 0 ? 'w-6 h-1.5 sm:w-8 sm:h-2 bg-white rounded-full shadow-lg ring-1 ring-white/50' : 'w-2 h-1.5 sm:w-2.5 sm:h-2 bg-white/40 hover:bg-white/80 rounded-full' ?>">
                </button>
              <?php endforeach; ?>
            </div>
          </div>
          <?php endif; ?>
        </div>
      </section>

      <!-- Main Centered Content Container (Exact matching width with Medical Videos max-w-7xl) -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10 pb-16">

        <!-- 2. Live Updates Bar (Auto-updates with newest blog post title) -->
        <div class="bg-[#0C0C0E] text-white rounded-xl py-2.5 px-4 sm:px-6 flex items-center justify-between gap-4 text-xs font-sans shadow-sm border border-white/10">
          <div class="flex items-center gap-3 overflow-hidden">
            <span class="bg-red-600 text-white font-extrabold px-2.5 py-0.5 rounded text-[11px] tracking-wider uppercase shrink-0 animate-pulse">LIVE UPDATES</span>
            <a id="homepage-live-link" href="<?= $liveSlug ? '/blog/' . htmlspecialchars($liveSlug) : '/blog' ?>" class="truncate text-white/90 font-medium hover:text-blue-300 transition-colors">
              <span id="homepage-live-headline"><?= htmlspecialchars($liveHeadline) ?></span>
            </a>
          </div>
          <a class="shrink-0 text-white/70 hover:text-white transition-colors underline font-medium" href="/blog">전체 뉴스 →</a>
        </div>

        <!-- 3. Top Story, Real-time Latest News & Doctor's Column Grid (3 Columns) -->
        <section class="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-xs">
          <div class="news-layout-3col items-start">
            
            <!-- Column 1 (Left): Top Story -->
            <?php if ($topStory): 
              $summaryPoints = $topStory['summaryPoints'] ?? [];
              if (is_string($summaryPoints)) {
                  $trimmed = trim($summaryPoints);
                  if (strpos($trimmed, '[') === 0 || strpos($trimmed, '{') === 0) {
                      $decoded = json_decode($trimmed, true);
                      if (is_array($decoded)) $summaryPoints = $decoded;
                      else $summaryPoints = explode("\n", $summaryPoints);
                  } else {
                      $summaryPoints = explode("\n", $summaryPoints);
                  }
              }
              if (is_array($summaryPoints)) {
                  $cleanPoints = [];
                  foreach ($summaryPoints as $pt) {
                      if (is_array($pt)) {
                          $pt = implode(' ', array_filter($pt, 'is_string'));
                      }
                      if (is_string($pt)) {
                          $t = trim($pt);
                          if ($t !== '' && $t !== '[object Object]' && strpos($t, '[object Object]') === false) {
                              $cleanPoints[] = $t;
                          }
                      }
                  }
                  $summaryPoints = $cleanPoints;
              } else {
                  $summaryPoints = [];
              }
              if (empty($summaryPoints)) {
                  $summaryPoints = ['공식 당국 승인 안전 가이드라인 적용 및 신속 지원', '뉴저지 거주 한인 대상 한국어 무료 상담 창구 운영', '의료 혜택 및 처방약 복용 시 주의 사항 안내'];
              }
              $topCover = $topStory['coverImage'] ?: (!empty($topStory['images'][0]) ? $topStory['images'][0] : 'https://images.unsplash.com/photo-1628771065117-74ccb5690668?w=1200&q=80&auto=format');
            ?>
            <div id="homepage-top-story-box" class="news-col-left flex flex-col justify-between pb-6 lg:pb-0">
              <a class="group block" href="/blog/<?= htmlspecialchars($topStory['slug'] ?: $topStory['id']) ?>">
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-2.5 h-2.5 bg-red-600 inline-block"></span>
                  <span class="text-xs sm:text-sm font-black text-red-600 uppercase tracking-widest whitespace-nowrap"><?= htmlspecialchars($topStory['category'] ?: '주요 뉴스') ?></span>
                  <span class="text-xs text-gray-400">·</span>
                  <span class="text-xs sm:text-sm text-gray-500 whitespace-nowrap"><?= htmlspecialchars($topStory['date'] ?: date('Y-m-d')) ?></span>
                </div>
                <h1 class="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-gray-950 leading-tight mb-3 tracking-tight group-hover:text-brand-blue transition-colors">
                  <?= htmlspecialchars($topStory['title'] ?? '') ?>
                </h1>
                <div class="relative w-full aspect-[16/10] overflow-hidden mb-2.5 bg-gray-100 shadow-xs rounded-sm">
                  <img src="<?= htmlspecialchars($topCover) ?>" 
                    alt="<?= htmlspecialchars($topStory['title'] ?? '') ?>" 
                    class="object-cover group-hover:scale-102 transition-transform duration-500 w-full h-full">
                </div>
                <p class="text-xs text-gray-400 mb-2 font-sans font-medium">특별 기획: <?= htmlspecialchars($topStory['title'] ?? '') ?></p>
                <p class="text-gray-800 text-sm sm:text-base leading-relaxed mb-4 line-clamp-3 font-serif">
                  <?= htmlspecialchars($topStory['excerpt'] ?? '') ?>
                </p>
              </a>
              <div class="bg-gray-50 rounded-xl p-4 border border-gray-200/80 mb-3">
                <p class="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 whitespace-nowrap">핵심 요약</p>
                <ul class="space-y-1.5 text-xs sm:text-sm text-gray-900 font-semibold">
                  <?php foreach (array_slice($summaryPoints, 0, 2) as $pt): ?>
                    <li class="flex items-start gap-2">
                      <span class="text-red-600 font-black text-sm leading-none mt-0.5">•</span>
                      <span class="line-clamp-1"><?= htmlspecialchars($pt) ?></span>
                    </li>
                  <?php endforeach; ?>
                </ul>
              </div>
              <div class="flex items-center justify-between text-xs sm:text-sm text-gray-500 pt-2.5 border-t border-gray-100">
                <div class="flex items-center gap-2">
                  <span class="font-black text-gray-950 whitespace-nowrap"><?= htmlspecialchars($topStory['author'] ?? '편집부') ?></span>
                  <span>·</span>
                  <span class="whitespace-nowrap font-medium">⏱ <?= htmlspecialchars($topStory['readTime'] ?? '3분') ?></span>
                </div>
                <span class="text-red-600 font-black text-[11px] uppercase tracking-wider whitespace-nowrap">TOP STORY</span>
              </div>
            </div>
            <?php endif; ?>

            <!-- Column 2 (Middle): Real-time Latest News -->
            <div class="news-col-mid flex flex-col justify-between pb-6 lg:pb-0">
              <div>
                <div class="flex items-center justify-between mb-3 pb-1.5 border-b-2 border-black">
                  <h2 class="font-black text-sm sm:text-base text-black uppercase tracking-wider whitespace-nowrap">
                    주요 뉴스
                  </h2>
                </div>
                <div id="homepage-latest-news-box" class="divide-y divide-gray-100">
                  <?php foreach ($latestNews as $item): 
                    $itemCover = $item['coverImage'] ?: (!empty($item['images'][0]) ? $item['images'][0] : 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80');
                  ?>
                    <a class="group py-3.5 first:pt-0 last:pb-0 flex gap-3 items-start justify-between" href="/blog/<?= htmlspecialchars($item['slug'] ?: $item['id']) ?>">
                      <div class="flex-1 min-w-0 pr-1">
                        <span class="text-[11px] sm:text-xs font-black text-red-600 uppercase tracking-wider block mb-1 whitespace-nowrap">
                          <?= htmlspecialchars($item['category'] ?: '뉴스') ?>
                        </span>
                        <h3 class="font-extrabold text-sm sm:text-base text-gray-950 leading-snug line-clamp-2 group-hover:text-brand-blue transition-colors">
                          <?= htmlspecialchars($item['title'] ?? '') ?>
                        </h3>
                        <div class="text-xs font-medium text-gray-400 mt-1.5 whitespace-nowrap">
                          <span><?= htmlspecialchars($item['date'] ?? '') ?></span>
                        </div>
                      </div>
                      <div class="news-thumb-box border border-gray-200">
                        <img src="<?= htmlspecialchars($itemCover) ?>" alt="<?= htmlspecialchars($item['title'] ?? '') ?>" class="group-hover:scale-105 transition-transform">
                      </div>
                    </a>
                  <?php endforeach; ?>
                </div>
              </div>
            </div>

            <!-- Column 3 (Right): Medical Column / 의료칼럼 (TOP 10) -->
            <div class="news-col-right flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3 pb-1.5 border-b-2 border-black">
                  <h2 class="font-black text-sm sm:text-base text-black uppercase tracking-wider whitespace-nowrap">
                    의료칼럼
                  </h2>
                  <span class="text-xs font-black text-red-600 tracking-wider whitespace-nowrap">TOP 10</span>
                </div>
                <div id="homepage-doctor-columns-box" class="divide-y divide-gray-100">
                  <?php foreach (array_slice($doctorPosts, 0, 10) as $dIdx => $dItem): 
                    $dCover = $dItem['coverImage'] ?: (!empty($dItem['images'][0]) ? $dItem['images'][0] : 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80');
                  ?>
                    <a class="group py-2.5 first:pt-0 last:pb-0 flex gap-2.5 items-start justify-between cursor-pointer" href="/blog/<?= htmlspecialchars($dItem['slug'] ?: $dItem['id']) ?>">
                      <div class="flex gap-2 items-start flex-1 min-w-0 pr-1">
                        <span class="text-lg sm:text-xl font-serif font-black text-red-600 leading-none w-4 shrink-0 mt-0.5 select-none">
                          <?= $dIdx + 1 ?>
                        </span>
                        <div class="flex-1 min-w-0">
                          <span class="text-[11px] font-black text-red-600 uppercase tracking-wider block mb-0.5 whitespace-nowrap truncate">
                            <?= htmlspecialchars($dItem['author'] ?: ($dItem['category'] ?: '의료칼럼')) ?>
                          </span>
                          <h3 class="font-extrabold text-xs sm:text-sm text-gray-950 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                            <?= htmlspecialchars($dItem['title'] ?? '') ?>
                          </h3>
                        </div>
                      </div>
                      <div class="news-thumb-small border border-gray-200">
                        <img src="<?= htmlspecialchars($dCover) ?>" alt="<?= htmlspecialchars($dItem['title'] ?? '') ?>" class="group-hover:scale-105 transition-transform">
                      </div>
                    </a>
                  <?php endforeach; ?>
                </div>
              </div>
            </div>

          </div>
        </section>

        <!-- 4. Recalls and Food Safety -->
        <section>
          <div class="flex items-center justify-between mb-4 pb-2 border-b-2 border-gray-900">
            <h2 class="font-extrabold text-xl text-gray-950 uppercase tracking-wider">리콜(Recalls and Food Safety)</h2>
            <a class="text-xs font-bold text-brand-blue hover:underline" href="/blog">전체보기 →</a>
          </div>
          <div id="homepage-reports-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <?php foreach ($reportNews as $p): 
              $pCover = $p['coverImage'] ?: (!empty($p['images'][0]) ? $p['images'][0] : 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80');
            ?>
              <a class="group card-hover" href="/blog/<?= htmlspecialchars($p['slug'] ?: $p['id']) ?>">
                <article class="bg-white rounded-2xl p-4 border border-gray-200/90 h-full flex flex-col justify-between shadow-sm">
                  <div>
                    <div class="relative h-40 w-full rounded-xl overflow-hidden mb-3 bg-gray-100">
                      <img src="<?= htmlspecialchars($pCover) ?>" alt="<?= htmlspecialchars($p['title'] ?? '') ?>" class="object-cover group-hover:scale-105 transition-transform duration-500 w-full h-full">
                    </div>
                    <span class="text-[11px] font-bold text-red-600 uppercase tracking-wider block mb-1"><?= htmlspecialchars($p['category'] ?: '리포트') ?></span>
                    <h3 class="font-bold text-base text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-brand-blue transition-colors">
                      <?= htmlspecialchars($p['title'] ?? '') ?>
                    </h3>
                    <p class="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                      <?= htmlspecialchars($p['excerpt'] ?? '') ?>
                    </p>
                  </div>
                  <div class="flex items-center justify-between text-[11px] text-gray-400 pt-3 border-t border-gray-100">
                    <span><?= htmlspecialchars($p['date'] ?? '') ?></span>
                    <span>⏱ <?= htmlspecialchars($p['readTime'] ?? '3분') ?></span>
                  </div>
                </article>
              </a>
            <?php endforeach; ?>
          </div>
        </section>

        <!-- 4.5. 100vw Panoramic Billboard 2 Section (Right Above One-Stop Coverage & Patient Services Center) -->
        <section id="gallery-billboard2-section" class="w-full font-sans bg-slate-950 mb-8" style="width:100vw; max-width:100vw; position:relative; left:50%; right:50%; margin-left:-50vw; margin-right:-50vw;">
          <div id="gallery-billboard2-container" class="w-full relative group">
            <?php if (!empty($activeBillboards2)): 
              $b2 = $activeBillboards2[0];
              $isVid2 = ($b2['mediaType'] ?? '') === 'video' || (isset($b2['mediaUrl']) && (str_ends_with($b2['mediaUrl'], '.mp4') || str_ends_with($b2['mediaUrl'], '.webm')));
            ?>
            <div class="relative w-full overflow-hidden bg-slate-950 select-none group" style="aspect-ratio: 1920 / 566; min-height: 230px; width: 100%; max-height: 480px;">
              <a href="<?= htmlspecialchars($b2['linkUrl'] ?? '/about#contact') ?>" class="block relative w-full h-full cursor-pointer" title="<?= htmlspecialchars($b2['title'] ?? '') ?>">
                <div class="w-full h-full relative overflow-hidden" style="min-height: 230px;">
                  <?php if ($isVid2): ?>
                    <video src="<?= htmlspecialchars($b2['mediaUrl']) ?>" class="w-full h-full object-cover" autoplay muted loop playsinline></video>
                  <?php else: ?>
                    <img id="billboard2-active-img" 
                      src="<?= htmlspecialchars($b2['mediaUrl'] ?: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=2000&q=85&auto=format') ?>" 
                      alt="<?= htmlspecialchars($b2['title'] ?? '') ?>" 
                      class="w-full h-full object-cover transform scale-100 group-hover:scale-103 transition-transform duration-1000 ease-out">
                  <?php endif; ?>
                  <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/15 pointer-events-none"></div>
                  <div class="absolute inset-0 bg-gradient-to-r from-black/75 via-transparent to-black/25 pointer-events-none"></div>
                </div>

                <div class="absolute inset-0 flex items-end">
                  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-4 sm:pb-6 flex items-end justify-between gap-4">
                    <div class="max-w-3xl space-y-1 sm:space-y-2">
                      <div class="flex items-center gap-2">
                        <span class="bg-red-600 text-white text-[10px] sm:text-xs font-extrabold px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow">
                          <?= htmlspecialchars(!empty($b2['subtitle']) ? $b2['subtitle'] : ($b2['category'] ?? 'SPECIAL CAMPAIGN')) ?>
                        </span>
                        <span class="text-xs font-mono text-white/80 bg-black/60 px-2.5 py-0.5 rounded-full border border-white/15">
                          1 / <?= count($activeBillboards2) ?>
                        </span>
                      </div>
                      <h3 class="font-extrabold text-base sm:text-2xl md:text-3xl text-white tracking-tight leading-snug drop-shadow-md group-hover:text-blue-300 transition-colors line-clamp-1">
                        <?= htmlspecialchars($b2['title'] ?? '') ?>
                      </h3>
                    </div>

                    <div class="flex items-center gap-2 shrink-0">
                      <span class="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-brand-blue text-white font-extrabold text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-xl">
                        <span><?= htmlspecialchars($b2['linkText'] ?? '자세히 보기') ?></span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                </div>
              </a>

              <button onclick="event.stopPropagation(); event.preventDefault(); window.cmsPrevBillboard2();" 
                class="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-red-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center text-xl sm:text-3xl transition-all duration-200 z-20 hover:scale-110 shadow-2xl cursor-pointer"
                aria-label="Previous Slide">
                ‹
              </button>

              <button onclick="event.stopPropagation(); event.preventDefault(); window.cmsNextBillboard2();" 
                class="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-red-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center text-xl sm:text-3xl transition-all duration-200 z-20 hover:scale-110 shadow-2xl cursor-pointer"
                aria-label="Next Slide">
                ›
              </button>

              <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                <?php foreach ($activeBillboards2 as $idx => $dummy): ?>
                  <button onclick="event.stopPropagation(); event.preventDefault(); window.cmsGoBillboard2(<?= $idx ?>);" 
                    class="transition-all duration-300 <?= $idx === 0 ? 'w-6 h-1.5 sm:w-8 sm:h-2 bg-white rounded-full shadow-lg ring-1 ring-white/50' : 'w-2 h-1.5 sm:w-2.5 sm:h-2 bg-white/40 hover:bg-white/80 rounded-full' ?>">
                  </button>
                <?php endforeach; ?>
              </div>
            </div>
            <?php endif; ?>
          </div>
        </section>

        <!-- 5. One-stop Coverage & Patient Services -->
        <section class="bg-brand-darker text-white rounded-3xl p-6 sm:p-10 border border-white/10 shadow-xl">
          <div class="max-w-3xl mb-8">
            <span class="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-3">SPECIAL COVERAGE &amp; PATIENT SERVICES</span>
            <h2 class="font-extrabold text-3xl sm:text-4xl text-white mb-3">원스톱 의료 접근 &amp; 환자 종합 센터</h2>
            <p class="text-white/70 text-sm sm:text-base leading-relaxed">보험 자격 진단부터 병원 사전접수, 의학 용어 사전 및 의료비 지원 신청까지 한곳에서 이용하실 수 있습니다.</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <a class="group" href="/tool">
              <div class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 h-full flex flex-col justify-between transition-all duration-300 group-hover:border-blue-400/50">
                <div>
                  <div class="flex items-center justify-between mb-4"><span class="text-2xl">🏥</span><span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/80">INSURANCE MATCHER</span></div>
                  <h3 class="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">메디케어 &amp; ACA 자격 진단</h3>
                  <p class="text-xs text-white/60 leading-relaxed mb-4">나이, 소득, 신분 상태에 따른 맞춤형 건강보험 혜택 및 보조금을 즉시 진단하세요.</p>
                </div>
                <div class="text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">서비스 바로가기 →</div>
              </div>
            </a>
            <a class="group" href="/tool">
              <div class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 h-full flex flex-col justify-between transition-all duration-300 group-hover:border-blue-400/50">
                <div>
                  <div class="flex items-center justify-between mb-4"><span class="text-2xl">🧮</span><span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/80">CALCULATOR</span></div>
                  <h3 class="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">ACA 보험료 보조금 계산기</h3>
                  <p class="text-xs text-white/60 leading-relaxed mb-4">가족 수와 연 소득을 기반으로 지원받을 수 있는 세액 공제 보조금액을 산출합니다.</p>
                </div>
                <div class="text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">서비스 바로가기 →</div>
              </div>
            </a>
            <a class="group" href="/tool">
              <div class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 h-full flex flex-col justify-between transition-all duration-300 group-hover:border-blue-400/50">
                <div>
                  <div class="flex items-center justify-between mb-4"><span class="text-2xl">📖</span><span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/80">DICTIONARY</span></div>
                  <h3 class="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">영-한 의학 용어 사전</h3>
                  <p class="text-xs text-white/60 leading-relaxed mb-4">미국 병원 진료실에서 자주 쓰는 필수 영문 의학 표현과 한국어 해설 모음.</p>
                </div>
                <div class="text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">서비스 바로가기 →</div>
              </div>
            </a>
            <a class="group" href="/tool">
              <div class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 h-full flex flex-col justify-between transition-all duration-300 group-hover:border-blue-400/50">
                <div>
                  <div class="flex items-center justify-between mb-4"><span class="text-2xl">📋</span><span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/80">PATIENT PORTAL</span></div>
                  <h3 class="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">스마트 환자 서비스 &amp; 사전접수</h3>
                  <p class="text-xs text-white/60 leading-relaxed mb-4">병원 사전접수 차트 작성, 피검사 입력 및 의료비 탕감 지원 신청을 한곳에서 제공합니다.</p>
                </div>
                <div class="text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">서비스 바로가기 →</div>
              </div>
            </a>
          </div>
        </section>

        <!-- 6. Medical Video News Section (의학비디오뉴스) -->
        <section id="medical-videos-section" class="bg-gradient-to-b from-slate-50/60 via-white to-slate-50/60 py-16 border-t border-b border-slate-200/60 font-sans">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-200/80 pb-5">
              <div>
                <div class="flex items-center gap-2 mb-1.5">
                  <span class="p-1.5 bg-red-50 text-red-600 rounded-lg text-lg border border-red-100 shadow-xs">🎬</span>
                  <span class="text-[10px] font-bold text-red-600 uppercase tracking-widest block">MEDICAL VIDEO NEWS</span>
                </div>
                <h2 class="font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight">의학비디오뉴스</h2>
                <p class="text-xs sm:text-sm text-slate-600 mt-1.5 font-normal">한인 전문의와 병원이 직접 전하는 검증된 최신 의학 정보 및 건강 가이드</p>
              </div>
              <div id="medical-videos-categories" class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button onclick="window.cmsSetVideoCat('전체')" class="text-xs font-semibold px-4 py-2 rounded-full transition-all whitespace-nowrap bg-red-600 text-white shadow-sm cursor-pointer">전체</button>
                <button onclick="window.cmsSetVideoCat('심장 & 혈관')" class="text-xs font-medium px-4 py-2 rounded-full transition-all whitespace-nowrap bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer">심장 &amp; 혈관</button>
                <button onclick="window.cmsSetVideoCat('뇌신경 질환')" class="text-xs font-medium px-4 py-2 rounded-full transition-all whitespace-nowrap bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer">뇌신경 질환</button>
                <button onclick="window.cmsSetVideoCat('암 예방 & 검진')" class="text-xs font-medium px-4 py-2 rounded-full transition-all whitespace-nowrap bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer">암 예방 &amp; 검진</button>
                <button onclick="window.cmsSetVideoCat('관절 & 정형외과')" class="text-xs font-medium px-4 py-2 rounded-full transition-all whitespace-nowrap bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer">관절 &amp; 정형외과</button>
                <button onclick="window.cmsSetVideoCat('만성질환 관리')" class="text-xs font-medium px-4 py-2 rounded-full transition-all whitespace-nowrap bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer">만성질환 관리</button>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              <!-- Main Video Player -->
              <div class="lg:col-span-7 xl:col-span-8 space-y-4">
                <div id="medical-video-player-box" class="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-200/80 shadow-md">
                  <?php if ($mainVideo): 
                    $ytId = $mainVideo['youtubeId'] ?? '';
                    if (!$ytId && !empty($mainVideo['youtubeUrl']) && preg_match('~(?:youtu\.be/|youtube\.com/(?:embed/|v/|watch\?v=))([\w-]{11})~', $mainVideo['youtubeUrl'], $m)) {
                        $ytId = $m[1];
                    }
                  ?>
                    <?php if ($ytId): 
                      $vThumb = $mainVideo['thumbnailUrl'] ?: ($mainVideo['thumbnail'] ?: ('https://img.youtube.com/vi/' . $ytId . '/maxresdefault.jpg'));
                    ?>
                      <div class="relative w-full h-full group cursor-pointer" 
                           onclick="if(window.cmsPlayCurrentVideo){window.cmsPlayCurrentVideo();}else{this.innerHTML='<iframe class=\'w-full h-full border-0\' src=\'https://www.youtube.com/embed/<?= $ytId ?>?autoplay=1&enablejsapi=1&rel=0&playsinline=1\' title=\'<?= htmlspecialchars($mainVideo['title'] ?? '') ?>\' allow=\'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\' referrerpolicy=\'strict-origin-when-cross-origin\' allowfullscreen></iframe>';}">
                        <img src="<?= $vThumb ?>" alt="<?= htmlspecialchars($mainVideo['title'] ?? '') ?>" onerror="if(this.src.indexOf('maxresdefault')!==-1){this.src=this.src.replace('maxresdefault','hqdefault');}else if(this.src.indexOf('hqdefault')!==-1){this.src='https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80';}" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-black/20 to-transparent"></div>
                        <div class="absolute inset-0 flex items-center justify-center">
                          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-red-600 flex items-center justify-center text-2xl sm:text-3xl shadow-2xl group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 ring-4 ring-red-500/30">▶</div>
                        </div>
                        <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                          <span class="bg-red-600 text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-sm"><?= htmlspecialchars($mainVideo['category'] ?: '의학뉴스') ?></span>
                          <span class="bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-mono font-semibold px-2.5 py-1 rounded-md border border-slate-200/80 shadow-sm">⏱ <?= htmlspecialchars($mainVideo['duration'] ?: '10:00') ?></span>
                        </div>
                      </div>
                    <?php else: ?>
                      <div class="relative w-full h-full group cursor-pointer" onclick="if(window.cmsPlayCurrentVideo){window.cmsPlayCurrentVideo();}else{window.cmsSelectVideo('<?= $mainVideo['id'] ?>', true);}">
                        <img src="<?= htmlspecialchars($mainVideo['thumbnailUrl'] ?: ($mainVideo['thumbnail'] ?: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80')) ?>" alt="<?= htmlspecialchars($mainVideo['title'] ?? '') ?>" class="w-full h-full object-cover">
                        <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div class="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center text-2xl shadow-2xl">▶</div>
                        </div>
                      </div>
                    <?php endif; ?>
                  <?php endif; ?>
                </div>

                <div id="medical-video-info-box" class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-2.5">
                  <?php if ($mainVideo): ?>
                    <div class="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                      <span class="font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full"><?= htmlspecialchars($mainVideo['category'] ?: '의학뉴스') ?></span>
                      <span>·</span>
                      <span class="font-semibold text-slate-800"><?= htmlspecialchars($mainVideo['speaker'] ?: ($mainVideo['doctor'] ?: '한인 전문의')) ?></span>
                      <span>·</span>
                      <span class="text-slate-600">⏱ <?= htmlspecialchars($mainVideo['duration'] ?: '10:00') ?></span>
                      <span>·</span>
                      <span class="text-slate-600">👁️ <?= htmlspecialchars($mainVideo['views'] ?: '조회수') ?></span>
                    </div>
                    <h3 class="font-extrabold text-xl sm:text-2xl text-slate-900 leading-snug tracking-tight">
                      <?= htmlspecialchars($mainVideo['title'] ?? '') ?>
                    </h3>
                    <p class="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                      <?= htmlspecialchars($mainVideo['description'] ?: ($mainVideo['summary'] ?? '')) ?>
                    </p>
                  <?php endif; ?>
                </div>
              </div>

              <!-- Recommended Playlist -->
              <div class="lg:col-span-5 xl:col-span-4 space-y-4">
                <div class="flex items-center justify-between pb-2.5 border-b border-slate-200/80">
                  <h3 class="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>추천 의학 영상 플레이리스트
                  </h3>
                  <span id="medical-videos-count-badge" class="text-xs font-semibold text-slate-500"><?= count($activeVideos) ?>개 영상</span>
                </div>
                
                <div id="medical-videos-playlist" class="space-y-3">
                  <?php foreach ($playlistVideos as $v): 
                    $isPlaying = $mainVideo && $mainVideo['id'] === $v['id'];
                  ?>
                    <div onclick="window.cmsSelectVideo('<?= $v['id'] ?>')" 
                      class="flex gap-3.5 p-3 rounded-2xl border transition-all duration-200 cursor-pointer <?= $isPlaying ? 'bg-red-50/70 border-red-300 ring-2 ring-red-400 shadow-sm' : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 shadow-xs' ?>">
                      <div class="relative w-28 h-20 sm:w-32 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-black">
                        <img src="<?= htmlspecialchars($v['thumbnailUrl'] ?: ($v['thumbnail'] ?: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80')) ?>" alt="<?= htmlspecialchars($v['title'] ?? '') ?>" class="w-full h-full object-cover">
                        <div class="absolute bottom-1 right-1 bg-black/85 text-white font-mono font-bold text-[10px] px-1.5 py-0.5 rounded">
                          <?= htmlspecialchars($v['duration'] ?: '10:00') ?>
                        </div>
                      </div>
                      <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <span class="text-[10px] font-bold text-red-600 uppercase tracking-wider block mb-0.5">
                            <?= htmlspecialchars($v['category'] ?: '의학뉴스') ?>
                          </span>
                          <h4 class="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2 <?= $isPlaying ? 'text-red-700' : '' ?>">
                            <?= htmlspecialchars($v['title'] ?? '') ?>
                          </h4>
                        </div>
                        <div class="flex items-center gap-2 text-[11px] text-slate-500 mt-1.5">
                          <span class="truncate"><?= htmlspecialchars($v['speaker'] ?: ($v['doctor'] ?: '전문의')) ?></span>
                          <span>·</span>
                          <span class="text-slate-700 font-semibold"><?= htmlspecialchars($v['views'] ?: '조회수') ?></span>
                        </div>
                      </div>
                    </div>
                  <?php endforeach; ?>
                </div>

                <div id="medical-videos-pagination" class="flex items-center justify-between pt-3 border-t border-slate-200/80">
                  <button onclick="window.cmsPrevVideoPage()" class="cursor-pointer font-bold text-slate-700 hover:text-red-600">‹ 이전</button>
                  <span class="text-xs font-mono font-bold">1 / <?= max(1, ceil(count($activeVideos) / 4)) ?></span>
                  <button onclick="window.cmsNextVideoPage()" class="cursor-pointer font-bold text-slate-700 hover:text-red-600">다음 ›</button>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
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
    // 1. Mobile Menu Toggle
    (function() {
      var btn = document.getElementById('mobile-menu-btn');
      var menu = document.getElementById('mobile-menu-dropdown');
      if (btn && menu) {
        var isOpen = false;
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          isOpen = !isOpen;
          if (isOpen) {
            menu.style.maxHeight = '400px';
            menu.style.opacity = '1';
            menu.style.pointerEvents = 'auto';
          } else {
            menu.style.maxHeight = '0';
            menu.style.opacity = '0';
            menu.style.pointerEvents = 'none';
          }
        });
        document.addEventListener('click', function(e) {
          if (isOpen && !btn.contains(e.target) && !menu.contains(e.target)) {
            isOpen = false;
            menu.style.maxHeight = '0';
            menu.style.opacity = '0';
            menu.style.pointerEvents = 'none';
          }
        });
      }
    })();

    // 2. Global Section Slide-in on Scroll (Excludes Top Billboard)
    document.addEventListener('DOMContentLoaded', function() {
      var targets = document.querySelectorAll('main section:not(#gallery-billboard-section), main article, #homepage-top-story-box, #homepage-latest-news-box, #homepage-doctor-columns-box, #homepage-reports-grid');
      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
        targets.forEach(function(el, i) {
          el.classList.add('reveal-section');
          el.style.transitionDelay = Math.min(i * 50, 300) + 'ms';
          observer.observe(el);
        });
      }
    });
  </script>
  <script src="/js/cms-client.js?v=<?= time() ?>"></script>
  <script src="/js/fixes.js?v=<?= time() ?>"></script>
</body>
</html>
