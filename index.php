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

// 3. Recalls & Food Safety (Strictly show ONLY posts check-marked with isPolicyReport === true, Max 4)
$reportNews = array_values(array_filter($posts, function($p) {
    return !empty($p['isPolicyReport']) && $p['isPolicyReport'] !== 'false' && $p['isPolicyReport'] !== false && $p['isPolicyReport'] !== 0 && $p['isPolicyReport'] !== '0';
}));
$reportNews = array_slice($reportNews, 0, 4);

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
$playlistVideos = array_slice($activeVideos, 0, 7);
?>
<!DOCTYPE html>
<html lang="ko" class="h-full antialiased">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>뉴저지 의료접근센터 · NJ Healthcare Access Center | Healthcare Access Portal (의료접근)</title>
  <meta name="description" content="뉴저지 의료접근센터 (NJ Healthcare Access Center / Healthcare Access Portal)는 뉴저지 한인 동포를 위한 무료 프리미엄 의료접근 및 건강 네비게이션 포털입니다. 메디케어, ACA 건강보험, 시니어 케어 장기요양 및 전문 재활, 한국어 1:1 의료 상담을 제공합니다." />
  <meta name="keywords" content="nj healthcare access portal, nj healthcare access center, healthcare access center, 뉴저지 의료접근센터, 의료접근, 의료접근센터, 뉴저지 한인 의료, 뉴저지 건강보험, 메디케어, ACA 오바마케어, 뉴저지 시니어 케어, 한인 재활치료" />
  <link rel="canonical" href="https://kor2.njaccessportal.com/" />

  <!-- OpenGraph / Social Media -->
  <meta property="og:site_name" content="뉴저지 의료접근센터 · NJ Healthcare Access Center" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://kor2.njaccessportal.com/" />
  <meta property="og:title" content="뉴저지 의료접근센터 · NJ Healthcare Access Center | Healthcare Access Portal (의료접근)" />
  <meta property="og:description" content="뉴저지 의료접근센터 (NJ Healthcare Access Center / Portal) - 뉴저지 한인 커뮤니티를 위한 무료 의료 접근, 메디케어, ACA, 시니어 케어 및 건강 상담 포털." />
  <meta property="og:image" content="<?= htmlspecialchars(!empty($topStory['coverImage']) ? $topStory['coverImage'] : 'https://kor2.njaccessportal.com/logo-icon.svg') ?>" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="뉴저지 의료접근센터 · NJ Healthcare Access Center" />
  <meta name="twitter:description" content="뉴저지 한인을 위한 무료 프리미엄 의료 접근·네비게이션 서비스 (Healthcare Access Portal)" />
  <meta name="twitter:image" content="<?= htmlspecialchars(!empty($topStory['coverImage']) ? $topStory['coverImage'] : 'https://kor2.njaccessportal.com/logo-icon.svg') ?>" />

  <!-- Schema.org JSON-LD Structured Data for Google Search & AI Search -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://kor2.njaccessportal.com/#website",
        "url": "https://kor2.njaccessportal.com/",
        "name": "뉴저지 의료접근센터 · NJ Healthcare Access Center",
        "alternateName": [
          "NJ Healthcare Access Portal",
          "NJ Healthcare Access Center",
          "Healthcare Access Center",
          "뉴저지 의료접근센터",
          "의료접근센터",
          "의료접근",
          "Healthcare Access Portal"
        ],
        "description": "뉴저지 한인 동포를 위한 무료 프리미엄 의료 접근 및 건강 네비게이션 서비스 포털",
        "inLanguage": ["ko", "en"],
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://kor2.njaccessportal.com/blog?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "MedicalOrganization",
        "@id": "https://kor2.njaccessportal.com/#organization",
        "name": "뉴저지 의료접근센터 (NJ Healthcare Access Center)",
        "alternateName": [
          "Healthcare Access Center",
          "NJ Healthcare Access Portal",
          "의료접근센터",
          "의료접근"
        ],
        "url": "https://kor2.njaccessportal.com",
        "logo": "https://kor2.njaccessportal.com/logo-icon.svg",
        "email": "njaccessportal@gmail.com",
        "areaServed": {
          "@type": "State",
          "name": "New Jersey"
        },
        "knowsLanguage": ["ko", "en"],
        "description": "뉴저지 한인 커뮤니티의 언어와 문화적 장벽을 해소하고 최고의 의료 접근성을 제공하는 전문 건강 포털 및 상담 센터",
        "sameAs": [
          "http://pf.kakao.com/_hdxmxaX/chat"
        ]
      }
    ]
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
    #gallery-billboard-section, #gallery-billboard2-section, #medical-videos-section, .billboard-section {
      width: 100vw !important;
      max-width: 100vw !important;
      position: relative !important;
      left: 50% !important;
      right: 50% !important;
      margin-left: -50vw !important;
      margin-right: -50vw !important;
      box-sizing: border-box !important;
      opacity: 1 !important;
      transform: none !important;
      display: block !important;
      visibility: visible !important;
    }
    #medical-videos-section {
      width: 100vw !important;
      max-width: 100vw !important;
      position: relative !important;
      left: 50% !important;
      right: 50% !important;
      margin-left: -50vw !important;
      margin-right: -50vw !important;
      margin-top: 4.5rem !important;
      margin-bottom: 0 !important;
      background-color: #181818 !important;
      border-top: 1px solid #2d2d2d !important;
      border-bottom: 1px solid #2d2d2d !important;
      padding-top: 52px !important;
      padding-bottom: 60px !important;
      box-sizing: border-box !important;
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

    /* Billboard 1 Vignette Effect — Layer 2: sits above media, below text */
    .billboard1-vignette {
      position: absolute !important;
      inset: 0 !important;
      pointer-events: none !important;
      z-index: 3 !important;
      box-shadow: inset 0 0 110px 30px rgba(0, 0, 0, 0.7) !important;
      background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 55%, rgba(0, 0, 0, 0.55) 100%) !important;
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

    /* Medical Video Player Dark Theme - Seamless with Section Background */
    .video-theme-card {
      background-color: transparent !important;
      border: none !important;
      border-radius: 0 !important;
      overflow: visible !important;
      box-shadow: none !important;
    }
    .video-theme-topbar {
      background-color: #181818 !important;
      border-top: 1px solid #2e2e2e !important;
      border-bottom: 1px solid #2e2e2e !important;
      display: flex !important;
      align-items: stretch !important;
    }
    .video-theme-home-btn {
      background-color: #1e1e1e !important;
      color: #d1d5db !important;
      padding: 12px 18px !important;
      border: none !important;
      border-right: 1px solid #2e2e2e !important;
      border-left: 1px solid #2e2e2e !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      transition: background-color 0.2s, color 0.2s !important;
    }
    .video-theme-home-btn:hover {
      background-color: #333333 !important;
      color: #ffffff !important;
    }
    .video-theme-categories {
      display: flex !important;
      align-items: center !important;
      overflow-x: auto !important;
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
      flex: 1 !important;
    }
    .video-theme-categories::-webkit-scrollbar {
      display: none !important;
    }
    .video-theme-cat-btn {
      padding: 12px 18px !important;
      font-size: 13px !important;
      font-weight: 500 !important;
      color: #9ca3af !important;
      background: transparent !important;
      border: none !important;
      border-right: 1px solid rgba(255, 255, 255, 0.05) !important;
      white-space: nowrap !important;
      cursor: pointer !important;
      transition: all 0.2s !important;
      display: inline-block !important;
    }
    .video-theme-cat-btn:hover {
      color: #ffffff !important;
      background-color: rgba(255, 255, 255, 0.06) !important;
    }
    .video-theme-cat-btn.active {
      color: #ffffff !important;
      font-weight: 700 !important;
      background-color: #7e2224 !important;
    }
    .video-theme-layout {
      display: flex !important;
      flex-direction: column !important;
    }
    @media (min-width: 1024px) {
      .video-theme-layout {
        display: grid !important;
        grid-template-columns: 340px 1fr !important;
      }
    }
    @media (min-width: 1280px) {
      .video-theme-layout {
        grid-template-columns: 380px 1fr !important;
      }
    }
    .video-theme-sidebar {
      background-color: #181818 !important;
      border-right: 1px solid #2e2e2e !important;
      border-left: 1px solid #2e2e2e !important;
      border-bottom: 1px solid #2e2e2e !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      order: 2 !important;
    }
    @media (min-width: 1024px) {
      .video-theme-sidebar {
        order: 1 !important;
      }
    }
    .video-theme-playlist {
      max-height: 560px !important;
      overflow-y: auto !important;
    }
    .video-theme-item {
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
      padding: 10px 14px !important;
      border-bottom: 1px solid #292929 !important;
      cursor: pointer !important;
      transition: background-color 0.15s ease !important;
      text-decoration: none !important;
      background-color: transparent !important;
      color: #e2e8f0 !important;
    }
    .video-theme-item:hover {
      background-color: #2b2b2b !important;
    }
    .video-theme-item.active {
      background-color: #7e2224 !important;
    }
    .video-theme-item-thumb {
      width: 92px !important;
      height: 58px !important;
      border-radius: 4px !important;
      overflow: hidden !important;
      position: relative !important;
      background-color: #000000 !important;
      flex-shrink: 0 !important;
    }
    .video-theme-item-thumb img {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
    }
    .video-theme-item-duration {
      position: absolute !important;
      bottom: 3px !important;
      right: 3px !important;
      background-color: rgba(0, 0, 0, 0.85) !important;
      color: #ffffff !important;
      font-family: monospace !important;
      font-size: 10px !important;
      padding: 1px 4px !important;
      border-radius: 2px !important;
      line-height: 1 !important;
    }
    .video-theme-item-text {
      flex: 1 !important;
      min-width: 0 !important;
    }
    .video-theme-item-title {
      color: #ffffff !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      line-height: 1.35 !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical !important;
      overflow: hidden !important;
    }
    .video-theme-item-meta {
      color: #8f96a3 !important;
      font-size: 11px !important;
      margin-top: 4px !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }
    .video-theme-item.active .video-theme-item-meta {
      color: rgba(255, 255, 255, 0.85) !important;
    }
    .video-theme-pagination {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      padding: 10px 16px !important;
      background-color: #181818 !important;
      border-top: 1px solid #2d2d2d !important;
      font-size: 12px !important;
      color: #8f96a3 !important;
    }
    .video-theme-main {
      background-color: #181818 !important;
      padding: 20px !important;
      border-right: 1px solid #2e2e2e !important;
      border-bottom: 1px solid #2e2e2e !important;
      order: 1 !important;
    }
    @media (min-width: 1024px) {
      .video-theme-main {
        order: 2 !important;
        padding: 24px 28px !important;
      }
    }
    .video-theme-player-frame {
      position: relative !important;
      width: 100% !important;
      aspect-ratio: 16 / 9 !important;
      background-color: #000000 !important;
      border-radius: 6px !important;
      overflow: hidden !important;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5) !important;
    }
    .video-theme-play-btn {
      width: 64px !important;
      height: 48px !important;
      background-color: rgba(0, 0, 0, 0.72) !important;
      backdrop-filter: blur(4px) !important;
      border-radius: 8px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: all 0.25s ease !important;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
    }
    .video-theme-play-btn:hover {
      background-color: #dc2626 !important;
      transform: scale(1.08) !important;
    }
    .video-theme-info-title {
      color: #ffffff !important;
      font-size: 22px !important;
      font-weight: 700 !important;
      line-height: 1.3 !important;
      margin-top: 20px !important;
    }
    @media (min-width: 640px) {
      .video-theme-info-title {
        font-size: 26px !important;
      }
    }
    .video-theme-info-byline {
      color: #9ca3af !important;
      font-size: 13px !important;
      margin-top: 6px !important;
    }
    .video-theme-info-desc {
      color: #d1d5db !important;
      font-size: 14px !important;
      line-height: 1.6 !important;
      margin-top: 12px !important;
    }
    .video-theme-readmore-btn {
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
      background-color: #3f3f3f !important;
      color: #ffffff !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      padding: 8px 16px !important;
      border-radius: 4px !important;
      border: none !important;
      cursor: pointer !important;
      margin-top: 14px !important;
      transition: background-color 0.2s !important;
    }
    .video-theme-readmore-btn:hover {
      background-color: #7e2224 !important;
    }
  </style>
</head>
<body class="min-h-full flex flex-col bg-brand-light">

  <!-- Top Marquee Banner -->
  <div class="fixed top-0 left-0 right-0 z-50 overflow-hidden flex items-center" style="height: 45px; background:#000000">
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
        <div class="hidden md:flex items-center">
          <a class="nav-link pb-0.5 font-bold text-brand-blue cursor-pointer" href="/" onclick="navigateToHome(event); return false;">홈</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/blog">뉴스</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/senior-care">시니어 케어</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/medicare">메디케어 &amp; ACA</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/tool">환자도우미</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/about">소개</a>
        </div>
        <div class="flex items-center gap-3">
          <!-- KakaoTalk 1:1 Chat Button (Top Nav) -->
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
        <div id="mobile-menu-dropdown" class="md:hidden overflow-hidden transition-all duration-300 max-h-0 opacity-0 bg-white/98 backdrop-blur-md border-t border-brand-border px-4 py-3 flex flex-col gap-1" style="-webkit-overflow-scrolling: touch;">
      <!-- 홈 (Direct) -->
      <a href="/" class="flex items-center justify-between py-2.5 px-3 text-[15px] font-bold text-brand-blue bg-blue-50/50 hover:bg-slate-50/80 rounded-xl transition-colors border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span>홈 (Home)</span>
        </div>
        <span class="text-xs font-normal text-slate-400">메인</span>
      </a>

      <!-- 아코디언 1: 시니어 케어 -->
      <div class="mobile-accordion-group border-b border-slate-100">
        <button type="button" class="mobile-accordion-btn flex items-center justify-between w-full py-2.5 px-3 text-[15px] font-bold text-slate-800 hover:text-brand-blue hover:bg-slate-50/80 rounded-xl transition-colors text-left cursor-pointer" data-target="m-acc-senior">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            <span>시니어 케어</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue font-semibold">재활·요양</span>
          </div>
          <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 mobile-acc-chevron " style="" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="m-acc-senior" class="mobile-accordion-panel hidden bg-slate-50/80 rounded-xl p-2 my-1 border border-slate-100 flex flex-col gap-1">
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
        <button type="button" class="mobile-accordion-btn flex items-center justify-between w-full py-2.5 px-3 text-[15px] font-bold text-slate-800 hover:text-brand-blue hover:bg-slate-50/80 rounded-xl transition-colors text-left cursor-pointer" data-target="m-acc-news">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
            <span>뉴스 &amp; 의학 칼럼</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold">최신 소식</span>
          </div>
          <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 mobile-acc-chevron " style="" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="m-acc-news" class="mobile-accordion-panel hidden bg-slate-50/80 rounded-xl p-2 my-1 border border-slate-100 flex flex-col gap-1">
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
        <button type="button" class="mobile-accordion-btn flex items-center justify-between w-full py-2.5 px-3 text-[15px] font-bold text-slate-800 hover:text-brand-blue hover:bg-slate-50/80 rounded-xl transition-colors text-left cursor-pointer" data-target="m-acc-medicare">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            <span>메디케어 &amp; ACA</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold">보험 가이드</span>
          </div>
          <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 mobile-acc-chevron " style="" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="m-acc-medicare" class="mobile-accordion-panel hidden bg-slate-50/80 rounded-xl p-2 my-1 border border-slate-100 flex flex-col gap-1">
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
        <button type="button" class="mobile-accordion-btn flex items-center justify-between w-full py-2.5 px-3 text-[15px] font-bold text-slate-800 hover:text-brand-blue hover:bg-slate-50/80 rounded-xl transition-colors text-left cursor-pointer" data-target="m-acc-tool">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span>환자도우미</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold">스마트 도구</span>
          </div>
          <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 mobile-acc-chevron " style="" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="m-acc-tool" class="mobile-accordion-panel hidden bg-slate-50/80 rounded-xl p-2 my-1 border border-slate-100 flex flex-col gap-1">
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
        <button type="button" class="mobile-accordion-btn flex items-center justify-between w-full py-2.5 px-3 text-[15px] font-bold text-slate-800 hover:text-brand-blue hover:bg-slate-50/80 rounded-xl transition-colors text-left cursor-pointer" data-target="m-acc-about">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>센터 소개</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">About</span>
          </div>
          <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 mobile-acc-chevron " style="" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="m-acc-about" class="mobile-accordion-panel hidden bg-slate-50/80 rounded-xl p-2 my-1 border border-slate-100 flex flex-col gap-1">
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
        <a href="tel:2018868686" class="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-600 hover:text-brand-blue transition-colors">
          <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          <span>문의 전화: (201) 886-8686</span>
        </a>
      </div>
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
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" style="z-index: 2;"></div>
                <div class="absolute inset-0 bg-gradient-to-r from-black/65 via-transparent to-black/20 pointer-events-none" style="z-index: 2;"></div>
                <div class="absolute inset-0 billboard1-vignette" style="z-index: 3;"></div>
              </div>

              <!-- Top Layer (Layer 3): Text, Badges, and Action Buttons -->
              <div class="absolute inset-0 flex items-end" style="z-index: 10;">
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
                    class="transition-all duration-300 <?= $idx === 0 ? 'w-6 h-1.5 sm:w-8 sm:h-2 bg-white rounded-full shadow-lg ring-1 ring-white/50' : 'w-2 h-1.5 sm:w-2.5 sm:h-2 bg-white/40 hover:bg-white/80 rounded-full' ?>"
                    aria-label="Slide <?= $idx + 1 ?>"
                    title="Slide <?= $idx + 1 ?>">
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
            <a class="group" href="/matcher">
              <div class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 h-full flex flex-col justify-between transition-all duration-300 group-hover:border-blue-400/50">
                <div>
                  <div class="flex items-center justify-between mb-4"><span class="text-2xl">🏥</span><span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/80">INSURANCE MATCHER</span></div>
                  <h3 class="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">메디케어 &amp; ACA 자격 진단</h3>
                  <p class="text-xs text-white/60 leading-relaxed mb-4">나이, 소득, 신분 상태에 따른 맞춤형 건강보험 혜택 및 보조금을 즉시 진단하세요.</p>
                </div>
                <div class="text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">서비스 바로가기 →</div>
              </div>
            </a>
            <a class="group" href="/calculator">
              <div class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 h-full flex flex-col justify-between transition-all duration-300 group-hover:border-blue-400/50">
                <div>
                  <div class="flex items-center justify-between mb-4"><span class="text-2xl">🧮</span><span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/80">CALCULATOR</span></div>
                  <h3 class="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">ACA 보험료 보조금 계산기</h3>
                  <p class="text-xs text-white/60 leading-relaxed mb-4">가족 수와 연 소득을 기반으로 지원받을 수 있는 세액 공제 보조금액을 산출합니다.</p>
                </div>
                <div class="text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">서비스 바로가기 →</div>
              </div>
            </a>
            <a class="group" href="/dictionary">
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
      </div>

      <!-- 6. Medical Video News Section (의학비디오뉴스) - FULL HORIZONTAL WIDTH -->
      <section id="medical-videos-section" class="w-full font-sans billboard-section" style="width: 100vw !important; max-width: 100vw !important; position: relative !important; left: 50% !important; right: 50% !important; margin-left: -50vw !important; margin-right: -50vw !important; margin-top: 4.5rem !important; background-color: #181818 !important; border-top: 1px solid #2d2d2d !important; border-bottom: 1px solid #2d2d2d !important; padding-top: 52px !important; padding-bottom: 60px !important; box-sizing: border-box !important; display: block !important;">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Section Title Bar -->
            <div class="flex items-center justify-between mb-5 pb-3 border-b border-[#333333]">
              <h2 class="font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">의학비디오뉴스</h2>
              <span id="medical-videos-count-badge" class="text-xs font-semibold text-slate-400 bg-[#282828] px-3 py-1 rounded-full border border-[#383838]"><?= count($activeVideos) ?>개 영상</span>
            </div>

            <!-- Video Player Widget Container (Attached Design Theme) -->
            <div class="video-theme-card">
              <!-- Top Category Navigation Bar -->
              <div class="video-theme-topbar">
                <button type="button" onclick="window.cmsSetVideoCat('전체')" class="video-theme-home-btn" title="전체 영상">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
                </button>
                <div id="medical-videos-categories" class="video-theme-categories">
                  <button type="button" onclick="window.cmsSetVideoCat('전체')" class="video-theme-cat-btn active">전체</button>
                  <button type="button" onclick="window.cmsSetVideoCat('만성질환 & 당뇨')" class="video-theme-cat-btn">만성질환 &amp; 당뇨</button>
                  <button type="button" onclick="window.cmsSetVideoCat('심장 & 혈관')" class="video-theme-cat-btn">심장 &amp; 혈관</button>
                  <button type="button" onclick="window.cmsSetVideoCat('뇌신경 & 치매')" class="video-theme-cat-btn">뇌신경 &amp; 치매</button>
                  <button type="button" onclick="window.cmsSetVideoCat('암 예방 & 검진')" class="video-theme-cat-btn">암 예방 &amp; 검진</button>
                  <button type="button" onclick="window.cmsSetVideoCat('감염병 & 백신')" class="video-theme-cat-btn">감염병 &amp; 백신</button>
                  <button type="button" onclick="window.cmsSetVideoCat('건강검진 & 의료정보')" class="video-theme-cat-btn">건강검진 &amp; 의료정보</button>
                </div>
              </div>

              <!-- Main Player & Playlist Grid (Left Playlist, Right Video) -->
              <div class="video-theme-layout">
                
                <!-- Left Column: Playlist -->
                <div class="video-theme-sidebar">
                  <div id="medical-videos-playlist" class="video-theme-playlist">
                    <?php foreach ($playlistVideos as $v): 
                      $isPlaying = $mainVideo && $mainVideo['id'] === $v['id'];
                      $itemThumb = !empty($v['thumbnail']) ? $v['thumbnail'] : (!empty($v['thumbnailUrl']) ? $v['thumbnailUrl'] : (!empty($v['youtubeId']) ? ('https://img.youtube.com/vi/' . $v['youtubeId'] . '/hqdefault.jpg') : 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80'));
                      $author = !empty($v['doctor']) ? ($v['doctor'] . ' · ') : '';
                      $date = $v['date'] ?? ($v['category'] ?? '최신영상');
                    ?>
                      <div onclick="window.cmsSelectVideo('<?= $v['id'] ?>', true)" 
                           class="video-theme-item <?= $isPlaying ? 'active' : '' ?>">
                        <div class="video-theme-item-thumb">
                          <img src="<?= htmlspecialchars($itemThumb) ?>" alt="<?= htmlspecialchars($v['title'] ?? '') ?>" onerror="if(this.src.indexOf('maxresdefault')!==-1){this.src=this.src.replace('maxresdefault','hqdefault');}else{this.onerror=null;this.src='https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80';}" class="w-full h-full object-cover">
                          <div class="video-theme-item-duration">
                            <?= htmlspecialchars($v['duration'] ?: '10:00') ?>
                          </div>
                        </div>
                        <div class="video-theme-item-text">
                          <h4 class="video-theme-item-title">
                            <?= htmlspecialchars($v['title'] ?? '') ?>
                          </h4>
                          <div class="video-theme-item-meta">
                            <?= htmlspecialchars($author . $date) ?>
                          </div>
                        </div>
                      </div>
                    <?php endforeach; ?>
                  </div>

                  <div id="medical-videos-pagination" class="video-theme-pagination">
                    <button onclick="window.cmsPrevVideoPage()" class="cursor-pointer font-bold text-slate-400 hover:text-white">‹ 이전</button>
                    <span class="font-mono font-bold text-slate-400">1 / <?= max(1, ceil(count($activeVideos) / 7)) ?></span>
                    <button onclick="window.cmsNextVideoPage()" class="cursor-pointer font-bold text-slate-400 hover:text-white">다음 ›</button>
                  </div>
                </div>

                <!-- Right Column: Main Player & Details -->
                <div class="video-theme-main">
                  <div id="medical-video-player-box" class="video-theme-player-frame">
                    <?php if ($mainVideo): 
                      $ytId = $mainVideo['youtubeId'] ?? '';
                      if (!$ytId && !empty($mainVideo['youtubeUrl']) && preg_match('~(?:youtu\.be/|youtube\.com/(?:embed/|v/|watch\?v=))([\w-]{11})~', $mainVideo['youtubeUrl'], $m)) {
                          $ytId = $m[1];
                      }
                      $vThumb = !empty($mainVideo['thumbnail']) ? $mainVideo['thumbnail'] : (!empty($mainVideo['thumbnailUrl']) ? $mainVideo['thumbnailUrl'] : (!empty($ytId) ? ('https://img.youtube.com/vi/' . $ytId . '/maxresdefault.jpg') : 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80'));
                    ?>
                      <div class="relative w-full h-full group cursor-pointer" onclick="window.cmsPlayCurrentVideo()">
                        <img src="<?= htmlspecialchars($vThumb) ?>" alt="<?= htmlspecialchars($mainVideo['title'] ?? '') ?>" onerror="if(this.src.indexOf('maxresdefault')!==-1){this.src=this.src.replace('maxresdefault','hqdefault');}else{this.onerror=null;this.src='https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80';}" class="object-cover w-full h-full group-hover:scale-103 transition-transform duration-500">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"></div>
                        <div class="absolute inset-0 flex items-center justify-center">
                          <div class="video-theme-play-btn group-hover:scale-110 transition-transform">
                            <svg class="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                        </div>
                        <div class="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded flex items-center gap-1.5 font-mono border border-white/10">
                          <svg class="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          <span><?= htmlspecialchars($mainVideo['duration'] ?: '10:00') ?></span>
                        </div>
                      </div>
                    <?php endif; ?>
                  </div>

                  <div id="medical-video-info-box">
                    <?php if ($mainVideo): 
                      $authorMeta = $mainVideo['doctor'] ?: ($mainVideo['hospital'] ?: '뉴저지 한인 전문의');
                      $dateMeta = $mainVideo['date'] ?: '최신 의학 정보';
                      $catMeta = $mainVideo['category'] ?: '의학뉴스';
                    ?>
                      <h3 class="video-theme-info-title">
                        <?= htmlspecialchars($mainVideo['title'] ?? '') ?>
                      </h3>
                      <div class="video-theme-info-byline">
                        <span>By <?= htmlspecialchars($authorMeta) ?></span>
                        <span class="mx-1.5 text-slate-500">/</span>
                        <span><?= htmlspecialchars($dateMeta) ?></span>
                        <span class="mx-1.5 text-slate-500">•</span>
                        <span class="text-red-400 font-medium"><?= htmlspecialchars($catMeta) ?></span>
                      </div>
                      <p class="video-theme-info-desc line-clamp-3">
                        <?= htmlspecialchars($mainVideo['description'] ?: ($mainVideo['summary'] ?? '')) ?>
                      </p>
                    <?php endif; ?>
                  </div>
                </div>

              </div>
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
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/matcher">보험 자격 진단</a></li>
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

  <script>

    // 2. Global Section Slide-in on Scroll (Excludes Top Billboard)
    document.addEventListener('DOMContentLoaded', function() {
      var targets = document.querySelectorAll('main section:not(#gallery-billboard-section):not(#gallery-billboard2-section):not(#medical-videos-section), main article, #homepage-top-story-box, #homepage-latest-news-box, #homepage-doctor-columns-box, #homepage-reports-grid');
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
