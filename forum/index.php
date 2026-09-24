<?php
require_once __DIR__ . '/../api/forum_db.php';
require_once __DIR__ . '/components.php';

$rawSpecialty = trim($_GET['specialty'] ?? '');
$rawSub = trim($_GET['sub'] ?? '');
$sortFilter = trim($_GET['sort'] ?? 'latest');
$searchQuery = trim($_GET['q'] ?? '');
$viewMode = trim($_GET['view'] ?? '');

$categories = forum_get_categories();
$subSpecialties = forum_get_sub_specialties();

// Handle category & sub mapping
$currentCategory = null;
$currentSub = null;
$specialtyFilter = $rawSpecialty;
$subFilter = $rawSub;

if (!empty($rawSpecialty)) {
    // Check if it's one of the 5 core categories
    $currentCategory = forum_get_category_by_id($rawSpecialty);
    if (!$currentCategory) {
        // Legacy specialty ID passed: map it
        $mapped = forum_map_specialty_to_category($rawSpecialty);
        $currentCategory = forum_get_category_by_id($mapped['category']);
        $specialtyFilter = $mapped['category'];
        if (empty($subFilter) && !empty($mapped['subSpecialty'])) {
            $subFilter = $mapped['subSpecialty'];
        }
    }
}

if (!empty($subFilter)) {
    $currentSub = forum_get_sub_specialty_by_id($subFilter);
}

// Auto-determine view mode if not set
if (empty($viewMode)) {
    if (!empty($specialtyFilter) || !empty($searchQuery) || in_array($sortFilter, ['hot', 'verified', 'unanswered'])) {
        $viewMode = 'topics';
    } else {
        $viewMode = 'categories';
    }
}

// Fetch questions
$questions = forum_get_questions($specialtyFilter, $sortFilter, $searchQuery, 'active', $subFilter);

// All active questions for real-time feed
$allActive = forum_get_questions('', 'latest', '', 'active');
$recentFeed = array_slice($allActive, 0, 10);

// Canonical & SEO metadata
$canonicalUrl = 'https://njaccessportal.com/ko/forum';
if ($currentCategory) {
    $canonicalUrl = 'https://njaccessportal.com/ko/forum?specialty=' . urlencode($currentCategory['id']);
    if ($currentSub) {
        $canonicalUrl .= '&sub=' . urlencode($currentSub['id']);
    }
} elseif ($viewMode === 'categories') {
    $canonicalUrl = 'https://njaccessportal.com/ko/forum?view=categories';
}

$pageTitle = '뉴저지 한인 헬스케어 커뮤니티 포럼';
if ($currentSub) {
    $pageTitle = htmlspecialchars($currentSub['name_ko']) . ' | ' . htmlspecialchars($currentCategory['name_ko']) . ' — NJAP 포럼';
} elseif ($currentCategory) {
    $pageTitle = htmlspecialchars($currentCategory['name_ko']) . ' — 뉴저지 한인 헬스케어 포럼 (NJAP)';
}

$seoTitle = $pageTitle . ' | 뉴저지 의료접근센터 (NJAP)';
$seoDesc = $currentCategory 
    ? htmlspecialchars($currentCategory['description']) . ' 뉴저지 한인 동포를 위한 건강 Q&A, 의료비·보험 정보 나눔 및 병원 이용 후기.'
    : '뉴저지 한인 동포를 위한 5대 핵심 헬스케어 커뮤니티 포럼: 자유게시판, 병의원 추천/후기, 의료비·보험 Q&A, 의학포럼(19개 진료과), 건강강좌 및 공지.';
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $seoTitle ?></title>
  <meta name="description" content="<?= $seoDesc ?>" />
  <meta name="keywords" content="뉴저지 한인 포럼, 뉴저지 한인 병원 후기, 메디케어 Q&A, 메디케이드 질문, 오바마케어, 의학포럼, 한인 의사 추천, 뉴저지 의료접근센터" />
  <!-- Directives for Googlebot & Web Crawlers -->
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <link rel="canonical" href="<?= htmlspecialchars($canonicalUrl) ?>" />

  <!-- OpenGraph / Social Media -->
  <meta property="og:site_name" content="뉴저지 의료접근센터 · NJAP 헬스케어 포럼" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="<?= $seoTitle ?>" />
  <meta property="og:description" content="<?= $seoDesc ?>" />
  <meta property="og:url" content="<?= htmlspecialchars($canonicalUrl) ?>" />
  <meta property="og:image" content="https://njaccessportal.com/ko/logo-icon.svg" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="<?= $seoTitle ?>" />
  <meta name="twitter:description" content="<?= $seoDesc ?>" />
  <meta name="twitter:image" content="https://njaccessportal.com/ko/logo-icon.svg" />

  <!-- Schema.org JSON-LD Structured Data: MedicalWebPage, Breadcrumbs & ItemList -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "<?= addslashes(strip_tags($seoTitle)) ?>",
    "description": "<?= addslashes(strip_tags($seoDesc)) ?>",
    "url": "<?= $canonicalUrl ?>",
    "inLanguage": "ko",
    "publisher": {
      "@type": "MedicalOrganization",
      "name": "뉴저지 의료접근센터 (Healthcare Access Portal)",
      "url": "https://njaccessportal.com/ko/"
    }
  }
  </script>

  <script type="application/ld+json">
  <?= json_encode([
      '@context' => 'https://schema.org',
      '@type' => 'BreadcrumbList',
      'itemListElement' => array_values(array_filter([
          [
              '@type' => 'ListItem',
              'position' => 1,
              'name' => '홈',
              'item' => 'https://njaccessportal.com/ko/'
          ],
          [
              '@type' => 'ListItem',
              'position' => 2,
              'name' => '커뮤니티 포럼',
              'item' => 'https://njaccessportal.com/ko/forum'
          ],
          $currentCategory ? [
              '@type' => 'ListItem',
              'position' => 3,
              'name' => $currentCategory['name_ko'],
              'item' => 'https://njaccessportal.com/ko/forum?specialty=' . urlencode($currentCategory['id'])
          ] : null,
          $currentSub ? [
              '@type' => 'ListItem',
              'position' => 4,
              'name' => $currentSub['name_ko'],
              'item' => 'https://njaccessportal.com/ko/forum?specialty=medical_health&sub=' . urlencode($currentSub['id'])
          ] : null
      ]))
  ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) ?>
  </script>

  <?php if (!empty($questions)): ?>
  <script type="application/ld+json">
  <?= json_encode([
      '@context' => 'https://schema.org',
      '@type' => 'ItemList',
      'name' => strip_tags($pageTitle),
      'itemListElement' => array_values(array_map(function($idx, $q) {
          return [
              '@type' => 'ListItem',
              'position' => $idx + 1,
              'name' => $q['title'],
              'url' => 'https://njaccessportal.com/ko/forum/topic/' . urlencode($q['id'])
          ];
      }, array_keys(array_slice($questions, 0, 15)), array_slice($questions, 0, 15)))
  ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) ?>
  </script>
  <?php endif; ?>

  <link rel="icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/ko/_next/static/chunks/1fosv8xgmgdeu.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Identity Services (GIS) -->
  <script src="https://accounts.google.com/gsi/client" async defer></script>
  
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              blue: '#1E3A8A',
              lightBlue: '#3B82F6',
              dark: '#0B192C',
              darker: '#0d1b2b',
              light: '#f8f8f6'
            }
          },
          fontFamily: {
            sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    :root, html, body {
      font-family: "Pretendard Variable", Pretendard, "Noto Sans KR", -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif !important;
      font-size: 16px;
    }
    html, body {
      overflow-x: hidden !important;
      max-width: 100% !important;
    }
    .h-\[109px\], .header-spacer, #header-spacer {
      height: 109px !important;
      min-height: 109px !important;
      display: block !important;
      width: 100% !important;
    }
    @media (max-width: 767px) {
      #forum-sidebar.sidebar-closed {
        display: none !important;
      }
      #forum-sidebar.sidebar-open {
        display: flex !important;
        position: fixed !important;
        top: 0 !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 290px !important;
        max-width: 88vw !important;
        height: 100vh !important;
        z-index: 100 !important;
        background-color: #ffffff !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        transform: translateX(0) !important;
      }
      #sidebar-backdrop {
        z-index: 99 !important;
      }
    }
    @media (min-width: 768px) {
      #forum-sidebar {
        display: flex !important;
        position: sticky !important;
        top: 109px !important;
        width: 110px !important;
        min-width: 110px !important;
        max-width: 110px !important;
        height: calc(100vh - 109px) !important;
        transform: none !important;
      }
    }
    /* Senior-friendly touch buttons */
    .touch-target {
      min-height: 48px;
      min-width: 48px;
    }
    /* Smooth horizontal chip scroll */
    .chips-scroll::-webkit-scrollbar {
      height: 5px;
    }
    .chips-scroll::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 9999px;
    }
  </style>
</head>
<body class="bg-[#F8FAFC] text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">

  <!-- Top Global Header -->
  <?php render_forum_header($searchQuery, $currentCategory); ?>

  <!-- Main Forum Layout: Sidebar + Content -->
  <div class="flex-1 flex w-full max-w-[1600px] mx-auto">
    
    <!-- Left Sidebar (Discourse Navigation & 5 Core Categories) -->
    <?php render_forum_sidebar($categories, $specialtyFilter, $sortFilter, $viewMode); ?>

    <!-- Main Content Area -->
    <main class="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
      
      <!-- Mandatory Clinical Disclaimer Banner -->
      <?php render_forum_disclaimer_banner(); ?>

      <!-- Top Navigation & Breadcrumbs Bar -->
      <div class="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-200">
        
        <!-- Left: Category Breadcrumbs -->
        <div class="flex items-center gap-2 flex-wrap">
          <?php if (!empty($currentCategory)): ?>
            <a href="/ko/forum?view=categories" class="text-xs sm:text-sm font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors touch-target py-1">
              <span>← 전체 게시판</span>
            </a>
            <span class="text-slate-300 text-xs">/</span>
            
            <?php if (!empty($currentSub)): ?>
              <a href="/ko/forum?specialty=<?= urlencode($currentCategory['id']) ?>&view=topics" 
                 class="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-900 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border border-slate-200 shadow-2xs transition-colors">
                <span><?= htmlspecialchars($currentCategory['name_ko']) ?></span>
              </a>
              <span class="text-slate-300 text-xs">/</span>
              <h1 class="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-900 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold border border-indigo-200/80 shadow-2xs">
                <span><?= htmlspecialchars($currentSub['name_ko']) ?></span>
              </h1>
            <?php else: ?>
              <h1 class="inline-flex items-center gap-1.5 bg-blue-50 text-blue-900 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold border border-blue-200/80 shadow-2xs">
                <span><?= htmlspecialchars($currentCategory['name_ko']) ?></span>
              </h1>
            <?php endif; ?>

          <?php else: ?>
            <div class="flex items-center gap-2.5">
              <h1 class="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                뉴저지 한인 5대 헬스케어 포럼
              </h1>
            </div>
          <?php endif; ?>
        </div>

        <!-- Right: Search Form & Topic Counter -->
        <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <form action="/ko/forum" method="GET" class="relative flex-1 sm:flex-initial">
            <input type="hidden" name="view" value="topics" />
            <?php if (!empty($specialtyFilter)): ?>
              <input type="hidden" name="specialty" value="<?= htmlspecialchars($specialtyFilter) ?>" />
            <?php endif; ?>
            <?php if (!empty($subFilter)): ?>
              <input type="hidden" name="sub" value="<?= htmlspecialchars($subFilter) ?>" />
            <?php endif; ?>
            <input type="text" name="q" value="<?= htmlspecialchars($searchQuery) ?>" 
              placeholder="증상, 병원, 보험, 질문 검색..." 
              class="px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 w-full sm:w-56 lg:w-72 shadow-2xs text-slate-900" />
          </form>

          <div class="text-xs sm:text-sm text-slate-500 font-medium whitespace-nowrap pl-2">
            총 <strong class="text-slate-900 font-bold"><?= count($questions) ?></strong>건
          </div>
        </div>

      </div>

      <!-- CRITICAL REQUIREMENT: For 의학포럼 (medical_health), show all 19 sub-specialties list -->
      <?php if (($specialtyFilter === 'medical_health') || (!empty($currentCategory) && $currentCategory['id'] === 'medical_health')): ?>
        <div class="bg-gradient-to-r from-blue-50/80 via-white to-slate-50 border border-blue-200/90 rounded-2xl p-4 sm:p-5 mb-6 shadow-2xs">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <h3 class="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>의학포럼 19대 전문 진료과목 선택</span>
                <span class="text-[11px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">전문의 질의응답</span>
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">
                궁금한 증상이나 진료 분야를 선택하시면 해당 과목의 전문의 답변 및 질문들을 모아보실 수 있습니다.
              </p>
            </div>

            <?php if (!empty($subFilter)): ?>
              <a href="/ko/forum?specialty=medical_health&view=topics" 
                 class="text-xs font-bold text-blue-600 hover:text-blue-800 bg-white border border-blue-200 hover:border-blue-300 px-3 py-1.5 rounded-xl transition-all self-start sm:self-auto shrink-0 shadow-2xs">
                <span>전체 진료과 보기 →</span>
              </a>
            <?php endif; ?>
          </div>

          <!-- 19 Sub-specialty Horizontal / Wrap Chips Grid (Clean, No Small Icons) -->
          <div class="flex flex-wrap gap-2 pt-1 chips-scroll">
            
            <!-- All sub-specialties pill -->
            <a href="/ko/forum?specialty=medical_health&view=topics" 
               class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border <?= empty($subFilter) ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50' ?>">
              <span>전체 진료과</span>
              <span class="text-[11px] opacity-80 px-1.5 py-0.2 rounded-full <?= empty($subFilter) ? 'bg-white/20' : 'bg-slate-100' ?>">
                <?= (int)($currentCategory['questionCount'] ?? count($questions)) ?>
              </span>
            </a>

            <!-- 19 Specialty Chips (Clean Typography) -->
            <?php foreach ($subSpecialties as $sub): 
              $isActive = ($subFilter === $sub['id']);
            ?>
              <a href="/ko/forum?specialty=medical_health&sub=<?= urlencode($sub['id']) ?>&view=topics" 
                 class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border <?= $isActive ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-500/20' : 'bg-white text-slate-700 border-slate-200/90 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/30' ?>">
                <span><?= htmlspecialchars($sub['name_ko']) ?></span>
                <span class="text-[11px] font-semibold px-1.5 py-0.2 rounded-full <?= $isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500' ?>">
                  <?= (int)($sub['questionCount'] ?? 0) ?>
                </span>
              </a>
            <?php endforeach; ?>

          </div>
        </div>
      <?php endif; ?>

      <!-- REQUIREMENT: For 병원/의원 추천 및 이용 후기 (hospital_reviews), show Major Hospitals & Network Quick Filter & Tags Bar -->
      <?php if (($specialtyFilter === 'hospital_reviews') || (!empty($currentCategory) && $currentCategory['id'] === 'hospital_reviews')): ?>
        <div class="bg-gradient-to-r from-emerald-50/90 via-white to-slate-50 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 mb-6 shadow-2xs">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <h3 class="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>뉴저지 6대 주요 병원 네트워크 빠른 검색 &amp; 후기 태그</span>
                <span class="text-[11px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">지역 의료 연계</span>
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">
                버겐·허드슨 카운티 및 뉴저지 주요 종합병원과 의사 네트워크별 내방 후기, 한국어 통역 및 한인 환자 프로그램 정보를 태그별로 모아보실 수 있습니다.
              </p>
            </div>

            <?php if (!empty($searchQuery)): ?>
              <a href="/ko/forum?specialty=hospital_reviews&view=topics" 
                 class="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-white border border-emerald-200 hover:border-emerald-300 px-3 py-1.5 rounded-xl transition-all self-start sm:self-auto shrink-0 shadow-2xs">
                <span>전체 후기 보기 →</span>
              </a>
            <?php endif; ?>
          </div>

          <!-- Major Hospital Filter Chips (Clean Typography, No Small Icons) -->
          <div class="flex flex-wrap gap-2 pt-1 chips-scroll">
            <a href="/ko/forum?specialty=hospital_reviews&view=topics" 
               class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border <?= empty($searchQuery) ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50' ?>">
              <span>전체 병원후기</span>
            </a>

            <?php
            $hospitalQuickTags = [
              ['q' => 'Englewood', 'label' => '잉글우드 병원', 'sub' => 'Englewood Health'],
              ['q' => 'EHPN', 'label' => 'EHPN 의사망', 'sub' => 'Physician Network'],
              ['q' => 'Hackensack', 'label' => '해켄색 대학병원', 'sub' => 'HUMC / HMH'],
              ['q' => 'Valley', 'label' => '더 밸리 병원', 'sub' => 'The Valley Hospital'],
              ['q' => 'Pascack', 'label' => '파스카크 밸리', 'sub' => 'Pascack Valley'],
              ['q' => 'RWJ', 'label' => 'RWJ바나바스', 'sub' => 'RWJBarnabas Health'],
              ['q' => '통역', 'label' => '한국어 통역 지원', 'sub' => 'Korean Services'],
              ['q' => '자선진료', 'label' => '자선진료·의료비 지원', 'sub' => 'Charity Care']
            ];
            foreach ($hospitalQuickTags as $tagItem):
              $isTagActive = (stripos($searchQuery, $tagItem['q']) !== false);
            ?>
              <a href="/ko/forum?specialty=hospital_reviews&q=<?= urlencode($tagItem['q']) ?>&view=topics" 
                 class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border <?= $isTagActive ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-500/20' : 'bg-white text-slate-700 border-slate-200/90 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50/30' ?>">
                <span>#<?= htmlspecialchars($tagItem['label']) ?></span>
                <span class="text-[10px] hidden sm:inline-block font-normal <?= $isTagActive ? 'text-emerald-100' : 'text-slate-400' ?>">(<?= htmlspecialchars($tagItem['sub']) ?>)</span>
              </a>
            <?php endforeach; ?>
          </div>
        </div>
      <?php endif; ?>


      <!-- VIEW MODE 1: Categories 2-Column Split View (The 5 Core Categories + Live Realtime Feed) -->
      <?php if ($viewMode === 'categories' && empty($specialtyFilter)): ?>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- Left Column: The 5 Core Open Categories (7 cols) -->
          <div class="lg:col-span-7 space-y-4">
            <div class="flex items-center justify-between pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
              <span>5대 핵심 오픈 포럼 카테고리</span>
              <span>등록글</span>
            </div>

            <?php foreach ($categories as $cat): 
              $isMedical = ($cat['id'] === 'medical_health');
              $isReviews = ($cat['id'] === 'hospital_reviews');
              $isBills = ($cat['id'] === 'bills_insurance');
              $isCommunity = ($cat['id'] === 'general_community');
              $isEvents = ($cat['id'] === 'events' || $cat['id'] === 'announcements');
            ?>
              <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
                   style="border-left: 5px solid <?= htmlspecialchars($cat['color']) ?>;">
                
                <div class="flex items-start justify-between gap-4 mb-2.5">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <a href="/ko/forum?specialty=<?= urlencode($cat['id']) ?>&view=topics" 
                         class="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                        <?= htmlspecialchars($cat['name_ko']) ?>
                      </a>
                      <span class="text-xs font-semibold text-slate-400">(<?= htmlspecialchars($cat['name_en']) ?>)</span>
                      <?php if ($isMedical): ?>
                        <span class="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                          19대 전문과목 포함
                        </span>
                      <?php elseif ($isEvents): ?>
                        <span class="text-[10px] font-extrabold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-200">
                          공식 이벤트 &amp; 세미나
                        </span>
                      <?php endif; ?>
                    </div>

                    <p class="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                      <?= htmlspecialchars($cat['description']) ?>
                    </p>
                  </div>

                  <a href="/ko/forum?specialty=<?= urlencode($cat['id']) ?>&view=topics" 
                     class="text-xs sm:text-sm font-black text-slate-700 bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-700 px-3 py-1.5 rounded-xl transition-colors shrink-0 touch-target flex items-center justify-center">
                    <?= (int)($cat['questionCount'] ?? 0) ?>
                  </a>
                </div>

                <!-- Sub-items preview for Medical & Health -->
                <?php if ($isMedical): ?>
                  <div class="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
                    <span class="font-bold text-slate-400 text-[11px] mr-1">세부 진료과:</span>
                    <a href="/ko/forum?specialty=medical_health&sub=internal_medicine&view=topics" class="px-2 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-md text-[11px] font-medium text-slate-600">내과·가정의학과</a>
                    <a href="/ko/forum?specialty=medical_health&sub=cardiology&view=topics" class="px-2 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-md text-[11px] font-medium text-slate-600">순환기·심장내과</a>
                    <a href="/ko/forum?specialty=medical_health&sub=pediatrics&view=topics" class="px-2 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-md text-[11px] font-medium text-slate-600">소아과</a>
                    <a href="/ko/forum?specialty=medical_health&sub=dental&view=topics" class="px-2 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-md text-[11px] font-medium text-slate-600">치과</a>
                    <a href="/ko/forum?specialty=medical_health&sub=dermatology&view=topics" class="px-2 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-md text-[11px] font-medium text-slate-600">피부과</a>
                    <a href="/ko/forum?specialty=medical_health&view=topics" class="text-blue-600 font-bold hover:underline text-[11px] ml-1">외 14개 진료과 모두보기 →</a>
                  </div>
                <?php elseif ($isReviews): ?>
                  <div class="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
                    <span class="font-bold text-slate-400 text-[11px] mr-1">주요 네트워크:</span>
                    <a href="/ko/forum?specialty=hospital_reviews&q=Englewood&view=topics" class="px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-md text-[11px] font-medium text-slate-600">#잉글우드병원</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=EHPN&view=topics" class="px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-md text-[11px] font-medium text-slate-600">#EHPN</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=Hackensack&view=topics" class="px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-md text-[11px] font-medium text-slate-600">#해켄색대학병원</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=Valley&view=topics" class="px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-md text-[11px] font-medium text-slate-600">#밸리병원</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=Pascack&view=topics" class="px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-md text-[11px] font-medium text-slate-600">#파스카크밸리</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=RWJ&view=topics" class="px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-md text-[11px] font-medium text-slate-600">#RWJ바나바스</a>
                  </div>
                <?php elseif ($isBills): ?>
                  <div class="mt-2 text-[11px] text-slate-500">
                    병원비 청구서 분할 납부, Charity Care, 메디케어 Part A/B/D, 메디케이드 신청 Q&A
                  </div>
                <?php endif; ?>

              </div>
            <?php endforeach; ?>
          </div>

          <!-- Right Column: Real-time Live Topics Stream (5 cols) -->
          <div class="lg:col-span-5 space-y-4">
            <div class="flex items-center justify-between pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
              <span>실시간 최신 질문 및 정보 피드</span>
              <span class="text-[11px] text-emerald-600 font-bold">LIVE UPDATE</span>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200/90 divide-y divide-slate-100 shadow-2xs overflow-hidden">
              <?php if (empty($recentFeed)): ?>
                <div class="p-8 text-center text-xs text-slate-400">등록된 질문이 없습니다. 첫 질문을 남겨보세요!</div>
              <?php else: ?>
                <?php foreach ($recentFeed as $lq): 
                  $lCat = $lq['category'] ?? null;
                  $lSub = $lq['subSpecialty'] ?? null;
                  $hasDoc = !empty($lq['hasClinicianAnswer']);
                ?>
                  <div class="p-4 hover:bg-slate-50/90 transition-colors flex items-start gap-3">
                    <img src="<?= htmlspecialchars($lq['authorAvatar'] ?: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80') ?>" 
                         class="w-10 h-10 rounded-full object-cover shrink-0 border <?= $hasDoc ? 'border-emerald-500 ring-2 ring-emerald-400/20' : 'border-slate-200' ?>"
                         alt="<?= htmlspecialchars($lq['authorName'] ?? '회원') ?>">
                    
                    <div class="flex-1 min-w-0">
                      <a href="/ko/forum/topic/<?= htmlspecialchars($lq['id']) ?>" 
                         class="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        <?= htmlspecialchars($lq['title']) ?>
                      </a>

                      <div class="flex items-center gap-2 mt-1.5 flex-wrap">
                        <!-- Category Badge -->
                        <span class="text-[11px] font-semibold text-slate-600">
                          <?= htmlspecialchars($lCat['name_ko'] ?? '포럼') ?>
                        </span>

                        <!-- Sub-specialty if present -->
                        <?php if (!empty($lSub)): ?>
                          <span class="text-[10px] bg-slate-100 text-slate-600 font-medium px-1.5 py-0.2 rounded">
                            <?= htmlspecialchars($lSub['name_ko']) ?>
                          </span>
                        <?php endif; ?>

                        <?php if ($hasDoc): ?>
                          <span class="text-[9px] bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.2 rounded border border-emerald-200">
                            전문의 답변
                          </span>
                        <?php endif; ?>
                      </div>
                    </div>

                    <div class="text-right shrink-0 pl-2">
                      <span class="inline-flex items-center text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">
                        <span>댓글 <?= (int)$lq['replyCount'] ?></span>
                      </span>
                      <span class="block text-[10px] text-slate-400 mt-1">
                        <?= forum_format_relative_time($lq['latestActivityAt'] ?? $lq['createdAt']) ?>
                      </span>
                    </div>
                  </div>
                <?php endforeach; ?>
              <?php endif; ?>
            </div>

            <!-- Quick Action Box for Seniors (High-contrast, Senior-friendly) -->
            <div class="rounded-2xl p-5 shadow-xs space-y-3 border" style="background-color: #eff6ff !important; border: 1.5px solid #bfdbfe !important;">
              <div class="text-xs font-bold uppercase tracking-wider" style="color: #1d4ed8 !important;">
                <span style="color: #1d4ed8 !important;">처음 이용하시나요?</span>
              </div>
              <h4 class="text-base sm:text-lg font-black leading-snug" style="color: #0f172a !important;">
                뉴저지 거주 한인 동포를 위한<br/>안전한 헬스케어 상담 &amp; 정보 나눔
              </h4>
              <p class="text-xs sm:text-sm leading-relaxed" style="color: #334155 !important;">
                복잡한 미국 의료비, 병원 선택, 보험 혜택 고민을 익명으로 안전하게 나누고 공인 한인 전문의의 조언을 받아보세요.
              </p>
              <a href="/ko/forum/ask" class="inline-flex items-center justify-center gap-2 w-full py-3 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm touch-target" style="background-color: #2563eb !important; color: #ffffff !important;">
                <span style="color: #ffffff !important;">새 질문 또는 후기 남기기</span>
              </a>
            </div>

          </div>

        </div>

      <!-- VIEW MODE 2: Discourse Topics Table View (Specific Category or All Topics) -->
      <?php else: ?>
        
        <!-- Category Banner (if specific category selected) -->
        <?php if ($currentCategory): ?>
          <div class="bg-white rounded-2xl p-5 sm:p-6 mb-6 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
               style="border-left: 5px solid <?= htmlspecialchars($currentCategory['color']) ?>;">
            <div>
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <h2 class="text-lg sm:text-xl font-black text-slate-900">
                  <?= htmlspecialchars($currentCategory['name_ko']) ?>
                  <span class="text-xs sm:text-sm font-normal text-slate-500">(<?= htmlspecialchars($currentCategory['name_en']) ?>)</span>
                </h2>
                <?php if ($currentSub): ?>
                  <span class="text-slate-300">/</span>
                  <span class="text-base font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                    <?= htmlspecialchars($currentSub['name_ko']) ?>
                  </span>
                <?php endif; ?>
              </div>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                <?= htmlspecialchars($currentSub['description'] ?? $currentCategory['description']) ?>
              </p>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <a href="/ko/forum?view=categories" class="text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2.5 rounded-xl transition-colors touch-target flex items-center">
                <span>← 전체 게시판</span>
              </a>
              <?php if (empty($currentCategory['isAdminOnly']) && !in_array($currentCategory['id'] ?? '', ['events', 'announcements'])): ?>
                <a href="/ko/forum/ask?category=<?= urlencode($currentCategory['id']) ?><?= $currentSub ? '&sub=' . urlencode($currentSub['id']) : '' ?>" 
                   class="text-xs sm:text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center touch-target">
                  <span>글 작성하기</span>
                </a>
              <?php else: ?>
                <a href="/ko/admin2/" target="_blank" 
                   class="text-xs sm:text-sm font-extrabold text-white bg-rose-600 hover:bg-rose-700 px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center touch-target">
                  <span>새 이벤트 등록 (CMS)</span>
                </a>
              <?php endif; ?>
            </div>
          </div>
        <?php endif; ?>

        <!-- Discourse Style Topics: Mobile List View (< md) + Desktop Table (>= md) -->
        <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          
          <?php if (empty($questions)): ?>
            <div class="py-16 px-4 text-center text-slate-400 text-sm">
              <?php if (in_array($currentCategory['id'] ?? '', ['events', 'announcements'])): ?>
                현재 등록된 공식 이벤트 및 세미나 일정이 없습니다.<br/>
                관리자 CMS에서 새 이벤트를 등록하시면 회원들에게 이메일 알림이 발송됩니다.
                <div class="mt-4">
                  <a href="/ko/admin2/" target="_blank" class="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs hover:bg-rose-700 transition-colors">
                    <span>새 이벤트 등록하기 (CMS)</span>
                  </a>
                </div>
              <?php else: ?>
                선택하신 카테고리에 등록된 질문이 아직 없습니다.<br/>
                첫 번째 질문이나 경험을 나누어보세요!
                <div class="mt-4">
                  <a href="/ko/forum/ask<?= $currentCategory ? '?category=' . urlencode($currentCategory['id']) : '' ?>" class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs hover:bg-blue-700 transition-colors">
                    <span>첫 질문 작성하기</span>
                  </a>
                </div>
              <?php endif; ?>
            </div>
          <?php else: ?>

            <!-- 1. Mobile Optimized Stream View (< md) -->
            <div class="divide-y divide-slate-100 md:hidden">
              <?php foreach ($questions as $q): 
                $qCat = $q['category'] ?? null;
                $qSub = $q['subSpecialty'] ?? null;
                $hasClinician = !empty($q['hasClinicianAnswer']);
                $participants = $q['participants'] ?? [];
              ?>
                <div class="p-4 hover:bg-slate-50/90 transition-colors">
                  <div class="flex items-start gap-3">
                    <?php if ($hasClinician): ?>
                      <span class="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded border border-emerald-200 shrink-0 mt-0.5">전문의 답변</span>
                    <?php endif; ?>

                    <div class="flex-1 min-w-0">
                      <!-- Full Width Topic Title for effortless reading -->
                      <a href="/ko/forum/topic/<?= htmlspecialchars($q['id']) ?>" 
                         class="font-black text-slate-900 hover:text-blue-600 transition-colors leading-snug text-base line-clamp-2 block">
                        <?= htmlspecialchars($q['title']) ?>
                      </a>

                      <!-- Subtitle row: Category, Sub-specialty, Tags, Stats inline -->
                      <div class="flex items-center gap-2 mt-2 flex-wrap text-xs text-slate-500">
                        <!-- Category Badge -->
                        <a href="/ko/forum?specialty=<?= urlencode($qCat['id'] ?? '') ?>&view=topics" 
                           class="inline-flex items-center text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md hover:bg-slate-200">
                          <span><?= htmlspecialchars($qCat['name_ko'] ?? '게시판') ?></span>
                        </a>

                        <!-- Sub-specialty if applicable -->
                        <?php if (!empty($qSub)): ?>
                          <a href="/ko/forum?specialty=medical_health&sub=<?= urlencode($qSub['id']) ?>&view=topics"
                             class="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md hover:underline">
                            <?= htmlspecialchars($qSub['name_ko']) ?>
                          </a>
                        <?php endif; ?>

                        <!-- Minimal Inline Stats -->
                        <span class="text-[11px] <?= (int)$q['replyCount'] > 0 ? 'text-blue-600 font-bold' : 'text-slate-400' ?>">
                          <span>답변 <?= (int)$q['replyCount'] ?></span>
                        </span>

                        <span class="text-[11px] text-slate-400">
                          <span>조회 <?= (int)$q['viewCount'] ?></span>
                        </span>

                        <span class="text-[11px] text-slate-400 ml-auto whitespace-nowrap">
                          <?= forum_format_relative_time($q['latestActivityAt'] ?? $q['createdAt']) ?>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              <?php endforeach; ?>
            </div>

            <!-- 2. Desktop Discourse Table View (>= md) -->
            <div class="hidden md:block overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/60">
                    <th class="py-3 px-4 font-semibold">Topic (주제 및 질문)</th>
                    <th class="py-3 px-3 font-semibold text-center w-32">참여자</th>
                    <th class="py-3 px-3 font-semibold text-center w-20">답변</th>
                    <th class="py-3 px-3 font-semibold text-center w-20">조회</th>
                    <th class="py-3 px-4 font-semibold text-right w-28">최근 활동</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-xs sm:text-sm">
                  <?php foreach ($questions as $q): 
                    $qCat = $q['category'] ?? null;
                    $qSub = $q['subSpecialty'] ?? null;
                    $hasClinician = !empty($q['hasClinicianAnswer']);
                    $participants = $q['participants'] ?? [];
                  ?>
                    <tr class="hover:bg-slate-50/90 transition-colors group">
                      
                      <!-- Topic Title & Category Badge -->
                      <td class="py-4 px-4">
                        <div class="flex items-start gap-2.5">
                          <?php if ($hasClinician): ?>
                            <span class="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded border border-emerald-200 shrink-0 mt-0.5">전문의 답변</span>
                          <?php endif; ?>
                          <div>
                            <a href="/ko/forum/topic/<?= htmlspecialchars($q['id']) ?>" 
                               class="font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 text-sm sm:text-base">
                              <?= htmlspecialchars($q['title']) ?>
                            </a>

                            <div class="flex items-center gap-2 mt-1.5 flex-wrap">
                              <!-- Category Badge -->
                              <a href="/ko/forum?specialty=<?= urlencode($qCat['id'] ?? '') ?>&view=topics" 
                                 class="inline-flex items-center text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md hover:bg-slate-200">
                                <span><?= htmlspecialchars($qCat['name_ko'] ?? '게시판') ?></span>
                              </a>

                              <!-- Sub-specialty if applicable -->
                              <?php if (!empty($qSub)): ?>
                                <a href="/ko/forum?specialty=medical_health&sub=<?= urlencode($qSub['id']) ?>&view=topics"
                                   class="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md hover:underline">
                                  <?= htmlspecialchars($qSub['name_ko']) ?>
                                </a>
                              <?php endif; ?>

                              <!-- Tags -->
                              <?php if (!empty($q['tags'])): ?>
                                <?php foreach (array_slice($q['tags'], 0, 3) as $tag): ?>
                                  <span class="text-[10px] text-slate-400 hover:text-slate-600">#<?= htmlspecialchars($tag) ?></span>
                                <?php endforeach; ?>
                              <?php endif; ?>
                            </div>
                          </div>
                        </div>
                      </td>

                      <!-- Participants Avatars Stack -->
                      <td class="py-4 px-3">
                        <div class="flex items-center justify-center -space-x-2 overflow-hidden">
                          <?php foreach ($participants as $p): ?>
                            <img src="<?= htmlspecialchars($p['avatar']) ?>" 
                                 alt="<?= htmlspecialchars($p['name']) ?>" 
                                 title="<?= htmlspecialchars($p['name']) ?><?= !empty($p['isClinician']) ? ' (전문의)' : '' ?>"
                                 class="w-7 h-7 rounded-full object-cover border-2 <?= !empty($p['isClinician']) ? 'border-emerald-500 ring-2 ring-emerald-400/20' : 'border-white' ?>">
                          <?php endforeach; ?>
                        </div>
                      </td>

                      <!-- Replies Count -->
                      <td class="py-4 px-3 text-center">
                        <span class="font-extrabold text-xs sm:text-sm <?= (int)$q['replyCount'] > 0 ? 'text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg' : 'text-slate-300' ?>">
                          <?= (int)$q['replyCount'] ?>
                        </span>
                      </td>

                      <!-- Views Count -->
                      <td class="py-4 px-3 text-center">
                        <span class="text-xs font-semibold <?= (int)$q['viewCount'] > 50 ? 'text-amber-600 font-bold' : 'text-slate-400' ?>">
                          <?= (int)$q['viewCount'] ?>
                        </span>
                      </td>

                      <!-- Activity Time -->
                      <td class="py-4 px-4 text-right whitespace-nowrap text-xs text-slate-400 font-medium">
                        <?= forum_format_relative_time($q['latestActivityAt'] ?? $q['createdAt']) ?>
                      </td>

                    </tr>
                  <?php endforeach; ?>
                </tbody>
              </table>
            </div>
          <?php endif; ?>

        </div>

      <?php endif; ?>

    </main>
  </div>

  <!-- Shared Global Footer Matching Website -->
  <?php render_forum_footer(); ?>

  <!-- Shared Auth & Nickname Modals -->
  <?php render_forum_modals(); ?>

  <!-- Shared Auth & Sidebar Controller Scripts -->
  <?php render_forum_auth_scripts(); ?>

</body>
</html>
