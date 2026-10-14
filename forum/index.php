<?php
require_once __DIR__ . '/../api/forum_db.php';
require_once __DIR__ . '/components.php';

$rawSpecialty = trim($_GET['specialty'] ?? ($_GET['category'] ?? ''));
$rawSub = trim($_GET['sub'] ?? '');
$sortFilter = trim($_GET['sort'] ?? 'latest');
$searchQuery = trim($_GET['q'] ?? '');

// -------------------------------------------------------------
// 301 Permanent Redirects for Legacy Board URLs
// -------------------------------------------------------------
if (!empty($rawSpecialty)) {
    $legacy301Map = [
        'hospital_reviews' => ['specialty' => 'medical', 'sub' => 'medical_reviews'],
        'bills_insurance' => ['specialty' => 'medical', 'sub' => 'medical_billing'],
        'medical_health' => ['specialty' => 'medical', 'sub' => 'medical_qa'],
        'general_community' => ['specialty' => 'community', 'sub' => ''],
        'announcements' => ['specialty' => 'events', 'sub' => '']
    ];

    if (isset($legacy301Map[$rawSpecialty])) {
        $target = $legacy301Map[$rawSpecialty];
        $newUrl = '/forum?specialty=' . urlencode($target['specialty']);
        $finalSub = !empty($rawSub) ? $rawSub : $target['sub'];
        if (!empty($finalSub)) {
            $newUrl .= '&sub=' . urlencode($finalSub);
        }
        if (!empty($searchQuery)) {
            $newUrl .= '&q=' . urlencode($searchQuery);
        }
        header('HTTP/1.1 301 Moved Permanently');
        header('Location: ' . $newUrl);
        exit;
    }

    // Check if a clinical subspecialty was directly passed as specialty
    $clinicalList = array_column(forum_get_default_sub_specialties(), 'id');
    if (in_array($rawSpecialty, $clinicalList)) {
        header('HTTP/1.1 301 Moved Permanently');
        header('Location: /forum?specialty=medical&sub=medical_qa&clin=' . urlencode($rawSpecialty));
        exit;
    }
}

// -------------------------------------------------------------
// Category & Board Data Preparation
// -------------------------------------------------------------
$categories = forum_get_categories();
$allSubBoards = forum_get_sub_boards();
$boardSettings = forum_get_board_settings();

$currentCategory = null;
$currentSubBoard = null;
$specialtyFilter = $rawSpecialty;
$subFilter = $rawSub;

if (!empty($specialtyFilter)) {
    $currentCategory = forum_get_category_by_id($specialtyFilter);
    if (!$currentCategory) {
        $mapped = forum_map_specialty_to_category($specialtyFilter, $subFilter);
        $currentCategory = forum_get_category_by_id($mapped['categoryId']);
        $specialtyFilter = $mapped['categoryId'];
        if (empty($subFilter) && !empty($mapped['subBoardId'])) {
            $subFilter = $mapped['subBoardId'];
        }
    }
}

if (!empty($subFilter) && $currentCategory) {
    $cSubs = $allSubBoards[$currentCategory['id']] ?? [];
    foreach ($cSubs as $sb) {
        if ($sb['id'] === $subFilter || ($sb['slug'] ?? '') === $subFilter) {
            $currentSubBoard = $sb;
            $subFilter = $sb['id'];
            break;
        }
    }
}

// Fetch thread listings
$currentPage = max(1, (int)($_GET['page'] ?? 1));
$isHomeView = (empty($specialtyFilter) || $specialtyFilter === 'home') && empty($searchQuery) && ($currentPage === 1 && empty($_GET['page']));
$isThumbnailBoard = in_array($specialtyFilter, ['market', 'food', 'events', 'clubs', 'buysell', 'buy-sell', 'restaurant', 'restaurants']) 
    || (!empty($currentCategory['hasThumbnails']) && $specialtyFilter !== 'all');
$questions = forum_get_questions($queryCategory, $sortFilter, $searchQuery, 'active', $subFilter);

// Club rooms data for 동호회/동문회 view & home view
$clubTypeFilter = trim($_GET['type'] ?? '');
$clubRooms = [];
if ($specialtyFilter === 'clubs' || $isHomeView) {
    $clubRooms = forum_get_club_rooms($clubTypeFilter ?: null, $searchQuery, 'active');
}

// -------------------------------------------------------------
// Pagination Logic for Board List View & Home View
// -------------------------------------------------------------
$perPage = 10; // 10 posts per page (clean, readable, standard for NJAP)

$noticeQuestions = [];
$regularQuestions = [];
foreach ($questions as $q) {
    if (!empty($q['isNotice'])) {
        $noticeQuestions[] = $q;
    } else {
        $regularQuestions[] = $q;
    }
}
$totalRegular = count($regularQuestions);
$totalPages = max(1, (int)ceil($totalRegular / $perPage));
if ($currentPage > $totalPages) {
    $currentPage = $totalPages;
}
$offset = ($currentPage - 1) * $perPage;
$pagedRegularQuestions = array_slice($regularQuestions, $offset, $perPage);
$displayQuestions = array_merge($noticeQuestions, $pagedRegularQuestions);

// For Home View Tabbed Blocks: Pre-fetch latest threads for top categories
$categoryLatestThreads = [];
if ($isHomeView) {
    foreach ($categories as $cat) {
        $categoryLatestThreads[$cat['id']] = forum_get_questions($cat['id'], 'latest', '', 'active', '', 8);
    }
}

// Right Sidebar: Top Ranked lists (조회순, 공감순, 댓글순)
$topViewed = forum_get_questions('', 'views', '', 'active', '', 10);
$topLiked = forum_get_questions('', 'likes', '', 'active', '', 10);
$topCommented = forum_get_questions('', 'comments', '', 'active', '', 10);

// Center Tabbed Hub: 2-column layout matching attached mockup
$reviewsThreads = forum_get_questions('medical', 'latest', '', 'active', 'medical_reviews', 3);
$billingThreads = forum_get_questions('medical', 'latest', '', 'active', 'medical_billing', 3);
$qaThreads = forum_get_questions('medical', 'latest', '', 'active', 'medical_qa', 2);
$hotThreads = forum_get_questions('medical', 'hot', '', 'active', '', 3);
if (count($hotThreads) < 3) {
    $hotThreads = forum_get_questions('', 'views', '', 'active', '', 3);
}

if (empty($reviewsThreads)) {
    $reviewsThreads = [
        ['id' => 'seed_rev_1', 'title' => '팰리세이즈팍 한인 내과 추천해주세요', 'replyCount' => 24],
        ['id' => 'seed_rev_2', 'title' => '잉글우드 정형외과 무릎 수술 후기', 'replyCount' => 18],
        ['id' => 'seed_rev_3', 'title' => '치과 임플란트 가격 비교 (NJ vs 한국)', 'replyCount' => 31],
    ];
}
if (empty($billingThreads)) {
    $billingThreads = [
        ['id' => 'seed_bill_1', 'title' => '메디케어 $90 일회성 지급 받으셨어요?', 'replyCount' => 42],
        ['id' => 'seed_bill_2', 'title' => 'Charity Care 신청 서류 질문드립니다', 'replyCount' => 11],
        ['id' => 'seed_bill_3', 'title' => '보험 없이 MRI 찍으려면 얼마쯤?', 'replyCount' => 9],
    ];
}
if (empty($qaThreads)) {
    $qaThreads = [
        ['id' => 'seed_med_qa_1', 'title' => '혈압약 복용 시간 언제 가 좋을까요', 'replyCount' => 7],
        ['id' => 'seed_med_qa_2', 'title' => '독감 백신 올해도 맞아야 하나요', 'replyCount' => 15],
    ];
}
if (empty($hotThreads)) {
    $hotThreads = [
        ['id' => 'seed_hot_1', 'title' => '응급실 갔는데 청구서 보고 기절할 뻔', 'viewCount' => 2100],
        ['id' => 'seed_hot_2', 'title' => '한국에서 약 가져올 때 주의사항 정리', 'viewCount' => 1800],
        ['id' => 'seed_hot_3', 'title' => '오픈 인롤먼트, 어드밴티지 갈아탈까요?', 'viewCount' => 1500],
    ];
}

// Center Tabbed Hub: Services Sub-Boards (구해요, 교육, 서비스, 커뮤니티 센터)
$serviceWantedThreads = forum_get_questions('wanted', 'latest', '', 'active', 'wanted_requests', 3);
$serviceEduThreads = forum_get_questions('wanted', 'latest', '', 'active', 'wanted_education', 3);
$serviceGenThreads = forum_get_questions('wanted', 'latest', '', 'active', 'wanted_services', 3);
$serviceCommThreads = forum_get_questions('wanted', 'latest', '', 'active', 'wanted_community_center', 3);

if (empty($serviceWantedThreads)) {
    $serviceWantedThreads = [
        ['id' => 'seed_srv_w1', 'title' => '병원 진료 동행 통역 및 서류 안내 도와주실 분 구합니다 (팰팍)', 'replyCount' => 8, 'location' => 'Palisades Park'],
        ['id' => 'seed_srv_w2', 'title' => '포트리 지역 초등학생 방과후 라이드 및 돌봄 도우미 모십니다', 'replyCount' => 14, 'location' => 'Fort Lee'],
        ['id' => 'seed_srv_w3', 'title' => '시니어 병원 방문 및 마트 장보기 동행해주실 분 구합니다', 'replyCount' => 6, 'location' => 'Bergen County'],
    ];
}
if (empty($serviceEduThreads)) {
    $serviceEduThreads = [
        ['id' => 'seed_srv_e1', 'title' => '버겐카운티 초중등 수학·과학 1:1 방문 과외 선생님 추천', 'replyCount' => 11, 'location' => 'Bergen County'],
        ['id' => 'seed_srv_e2', 'title' => '성인 기초 영어 회화 및 미국 생활 실전 영어 소그룹 레슨', 'replyCount' => 19, 'location' => 'Fort Lee'],
        ['id' => 'seed_srv_e3', 'title' => '방과후 한글 학교 및 한국어 지도 프로그램 정보 공유', 'replyCount' => 7, 'location' => 'Englewood Cliffs'],
    ];
}
if (empty($serviceGenThreads)) {
    $serviceGenThreads = [
        ['id' => 'seed_srv_s1', 'title' => '가정 내 배관·전기 수리 및 긴급 핸디맨 서비스 추천', 'replyCount' => 22, 'location' => 'Palisades Park'],
        ['id' => 'seed_srv_s2', 'title' => '뉴저지/뉴욕 소형 이사, 가구 운반 및 정리지원 서비스 안내', 'replyCount' => 15, 'location' => 'NJ/NY'],
        ['id' => 'seed_srv_s3', 'title' => '입주 청소 및 카펫 스팀 딥클리닝 전문 서비스 솔직 후기', 'replyCount' => 9, 'location' => 'Fort Lee'],
    ];
}
if (empty($serviceCommThreads)) {
    $serviceCommThreads = [
        ['id' => 'seed_srv_c1', 'title' => '뉴저지 한인 복지관 시니어 무료 스마트폰·디지털 교육 강좌', 'replyCount' => 17, 'location' => 'Teaneck'],
        ['id' => 'seed_srv_c2', 'title' => '버겐카운티 동포 무료 법률·세무 이동 상담의 날 일정 안내', 'replyCount' => 25, 'location' => 'Bergenfield'],
        ['id' => 'seed_srv_c3', 'title' => '청소년 자원봉사 및 리더십 커뮤니티 프로그램 신청 접수', 'replyCount' => 13, 'location' => 'Ridgefield'],
    ];
}

// Featured Services & Ads for bottom page
$featuredAdsList = forum_get_featured_ads(true);

// Canonical & Title
$canonicalUrl = 'https://njaccessportal.com/forum';
if ($currentCategory) {
    $canonicalUrl .= '?specialty=' . urlencode($currentCategory['id']);
    if ($currentSubBoard) {
        $canonicalUrl .= '&sub=' . urlencode($currentSubBoard['id']);
    }
}

$pageTitle = '한인 의료 접근센터 (Healthcare Access Center) · 뉴저지 한인포럼 · 한인광장 | NJAP';
if ($currentSubBoard) {
    $pageTitle = htmlspecialchars($currentSubBoard['name_ko']) . ' | ' . htmlspecialchars($currentCategory['name_ko']) . ' — 한인 의료 접근센터 (Healthcare Access Center) 포럼';
} elseif ($currentCategory) {
    $pageTitle = htmlspecialchars($currentCategory['name_ko']) . ' — 한인 의료 접근센터 (Healthcare Access Center) 포럼';
}

$seoTitle = $pageTitle;
$seoDesc = '한인 의료 접근센터(Healthcare Access Center) & 뉴저지 한인포럼·한인광장(NJ Korean Forum · Korean Portal) - 한인 의료접근센터, 한인 의료, 한인 의사, 한인 병원 후기 및 의료정보센터(의료점보센터 / Healthcare Resource Center). 메디케어, ACA 보험, 부동산·렌트, 구인구직, 자유게시판 커뮤니티.';
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $seoTitle ?></title>
  <meta name="description" content="<?= $seoDesc ?>" />
  <meta name="keywords" content="한인 의료 접근센터, 한인 의료접근센터, 한인의료접근센터, 뉴저지 한인 의료 접근센터, healthcare access center, 한인포럼, 뉴저지 한인포럼, 한인광장, 뉴저지 한인광장, 의료점보센터, 의료정보센터, 의료접근센터, korean portal, healthcare resource center, 한인 의료, 한인 의사, 한인 병원, 뉴저지 한인 병원 후기, 팰팍 렌트, 포트리 아파트, 뉴저지 중고거래, 메디케어 Q&A, 한인 의사 추천, 버겐카운티 병원, NJ Access Portal" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="<?= htmlspecialchars($canonicalUrl) ?>" />

  <!-- OpenGraph -->
  <meta property="og:site_name" content="한인 의료 접근센터 · Healthcare Access Center · 뉴저지 한인포럼 &amp; 한인광장" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="<?= $seoTitle ?>" />
  <meta property="og:description" content="<?= $seoDesc ?>" />
  <meta property="og:url" content="<?= htmlspecialchars($canonicalUrl) ?>" />
  <meta property="og:image" content="https://njaccessportal.com/logo-icon.svg" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="<?= $seoTitle ?>" />
  <meta name="twitter:description" content="<?= $seoDesc ?>" />
  <meta name="twitter:image" content="https://njaccessportal.com/logo-icon.svg" />

  <!-- Schema.org JSON-LD Structured Data for Google Search -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": <?= json_encode($seoTitle, JSON_UNESCAPED_UNICODE) ?>,
    "description": <?= json_encode($seoDesc, JSON_UNESCAPED_UNICODE) ?>,
    "url": <?= json_encode($canonicalUrl, JSON_UNESCAPED_SLASHES) ?>,
    "isPartOf": {
      "@type": "WebSite",
      "name": "뉴저지 한인포럼 · 뉴저지 한인광장 (NJ Korean Forum & Korean Portal)",
      "alternateName": [
        "한인포럼",
        "뉴저지 한인포럼",
        "한인광장",
        "뉴저지 한인광장",
        "의료점보센터",
        "의료정보센터",
        "의료접근센터",
        "healthcare access center",
        "korean portal",
        "healthcare resource center",
        "한인 의료",
        "한인 의사",
        "한인 병원"
      ],
      "url": "https://njaccessportal.com/forum"
    },
    "keywords": [
      "한인포럼",
      "뉴저지 한인포럼",
      "한인광장",
      "뉴저지 한인광장",
      "의료점보센터",
      "의료정보센터",
      "의료접근센터",
      "healthcare access center",
      "korean portal",
      "healthcare resource center",
      "한인 의료",
      "한인 의사",
      "한인 병원"
    ]
  }
  </script>

  <link rel="icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/_next/static/chunks/1fosv8xgmgdeu.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://accounts.google.com/gsi/client" async defer></script>
  
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              navy: '#0F2342',
              blue: '#1B6FA8',
              teal: '#7FC8C0',
              yellow: '#FEE500',
              darker: '#0B192C'
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
      font-family: "Pretendard Variable", Pretendard, "Noto Sans KR", -apple-system, system-ui, sans-serif !important;
      font-size: 15px;
    }
    body.senior-mode {
      font-size: 18px !important;
    }
    body.senior-mode h1 { font-size: 1.85rem !important; }
    body.senior-mode h2 { font-size: 1.6rem !important; }
    body.senior-mode h3 { font-size: 1.35rem !important; }
    body.senior-mode p, body.senior-mode span, body.senior-mode td, body.senior-mode th, body.senior-mode a {
      font-size: 1.12rem !important;
      line-height: 1.65 !important;
    }
    .header-spacer {
      height: 148px !important;
      min-height: 148px !important;
      display: block !important;
      width: 100% !important;
    }
    .home-tab-btn.active {
      color: #1B6FA8;
      font-weight: 800;
      border-bottom: 3px solid #1B6FA8;
      background-color: #f0f7fc;
    }
    .home-tab-btn:not(.active) {
      color: #475569;
      font-weight: 600;
      border-bottom: 3px solid transparent;
    }
    .home-tab-btn:not(.active):hover {
      color: #1B6FA8;
      background-color: #f8fafc;
    }
    .sidebar-rank-tab.active {
      background-color: #1B6FA8;
      color: #ffffff;
      font-weight: 800;
    }
    .sidebar-rank-tab:not(.active) {
      background-color: #f1f5f9;
      color: #64748b;
      font-weight: 600;
    }
    .sidebar-rank-tab:not(.active):hover {
      color: #1e293b;
      background-color: #e2e8f0;
    }
    @media (max-width: 767px) {
      #forum-sidebar.sidebar-closed { display: none !important; }
      #forum-sidebar.sidebar-open {
        display: flex !important;
        position: fixed !important;
        top: 0 !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 280px !important;
        max-width: 85vw !important;
        height: 100vh !important;
        z-index: 100 !important;
        background-color: #ffffff !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
      }
    }
    @media (min-width: 768px) {
      #forum-sidebar {
        display: flex !important;
        position: sticky !important;
        top: 148px !important;
        width: 190px !important;
        min-width: 190px !important;
        max-width: 190px !important;
        height: calc(100vh - 148px) !important;
      }
    }
    .card-hover {
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .card-hover:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgba(15, 35, 66, 0.1);
    }
  </style>
</head>
<body class="bg-[#F8FAFC] text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-[#1B6FA8] selection:text-white">

  <!-- Top Global Header (Navy Main Menu + Medical Blue Forum Menu) -->
  <?php render_forum_header($searchQuery, $currentCategory, $specialtyFilter); ?>

  <!-- Main Forum Container: Left Sidebar + Center/Right Content -->
  <div class="flex-1 flex w-full max-w-[1560px] mx-auto">
    
    <!-- Left Sidebar: 7 Categories & Sub-Boards -->
    <?php render_forum_sidebar($categories, $specialtyFilter, $sortFilter, $isHomeView ? 'categories' : 'topics', $subFilter); ?>

    <!-- Main Content Flow Area -->
    <main class="flex-1 min-w-0 p-3 sm:p-5 lg:p-7">

      <!-- =========================================================
           SCENARIO 1: FORUM HOME (MissyUSA/HeyKorea Style Scannable Hub)
           ========================================================= -->
      <?php if ($isHomeView): ?>

        <!-- 2-Column Grid: Center Content (8 cols) + Right Sidebar (4 cols) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- Center Column (lg:col-span-8): Tabbed Section Blocks Matching Attached Mockup -->
          <div class="lg:col-span-8 min-w-0">
            
            <!-- Category Tabs Header (Clean typography, zero emoji) -->
            <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div class="flex items-center overflow-x-auto border-b border-slate-200 bg-white text-sm sm:text-base font-bold">
                <button type="button" onclick="switchHomeTab('medical')" id="htab-medical" class="home-tab-btn active px-5 py-3.5 shrink-0 transition-colors cursor-pointer border-b-2 border-[#1B6FA8] text-[#1B6FA8] font-black">
                  <span>의료관련</span>
                </button>
                <button type="button" onclick="switchHomeTab('community')" id="htab-community" class="home-tab-btn px-5 py-3.5 shrink-0 transition-colors cursor-pointer border-b-2 border-transparent text-slate-600 hover:text-[#1B6FA8] font-bold">
                  <span>자유게시판</span>
                </button>
                <button type="button" onclick="switchHomeTab('market')" id="htab-market" class="home-tab-btn px-5 py-3.5 shrink-0 transition-colors cursor-pointer border-b-2 border-transparent text-slate-600 hover:text-[#1B6FA8] font-bold">
                  <span>마켓플레이스</span>
                </button>
                <button type="button" onclick="switchHomeTab('wanted')" id="htab-wanted" class="home-tab-btn px-5 py-3.5 shrink-0 transition-colors cursor-pointer border-b-2 border-transparent text-slate-600 hover:text-[#1B6FA8] font-bold">
                  <span>서비스</span>
                </button>
                <button type="button" onclick="switchHomeTab('jobs')" id="htab-jobs" class="home-tab-btn px-5 py-3.5 shrink-0 transition-colors cursor-pointer border-b-2 border-transparent text-slate-600 hover:text-[#1B6FA8] font-bold">
                  <span>구직</span>
                </button>
                <button type="button" onclick="switchHomeTab('food')" id="htab-food" class="home-tab-btn px-5 py-3.5 shrink-0 transition-colors cursor-pointer border-b-2 border-transparent text-slate-600 hover:text-[#1B6FA8] font-bold">
                  <span>맛집</span>
                </button>
                <button type="button" onclick="switchHomeTab('columns')" id="htab-columns" class="home-tab-btn px-5 py-3.5 shrink-0 transition-colors cursor-pointer border-b-2 border-transparent text-slate-600 hover:text-[#1B6FA8] font-bold">
                  <span>전문가 칼럼</span>
                </button>
                <button type="button" onclick="switchHomeTab('events')" id="htab-events" class="home-tab-btn px-5 py-3.5 shrink-0 transition-colors cursor-pointer border-b-2 border-transparent text-slate-600 hover:text-[#1B6FA8] font-bold">
                  <span>이벤트</span>
                </button>
                <button type="button" onclick="switchHomeTab('clubs')" id="htab-clubs" class="home-tab-btn px-5 py-3.5 shrink-0 transition-colors cursor-pointer border-b-2 border-transparent text-slate-600 hover:text-[#1B6FA8] font-bold">
                  <span>동호회/동문회</span>
                </button>
              </div>

              <!-- Tab Pane 1: 의료관련 (Exact Mimic of Attached Mockup) -->
              <div id="pane-medical" class="home-tab-pane">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 p-5 sm:p-7">
                  
                  <!-- Left Column -->
                  <div class="space-y-6">
                    <!-- Section: [병원/의원 추천 및 이용 후기] -->
                    <div>
                      <h3 class="text-[15px] sm:text-base font-bold text-[#1B6FA8] mb-2.5">
                        <a href="/forum?specialty=medical&sub=medical_reviews" class="hover:underline">[병원/의원 추천 및 이용 후기]</a>
                      </h3>
                      <div class="space-y-0.5">
                        <?php foreach ($reviewsThreads as $t): ?>
                          <div class="flex items-center justify-between py-2.5 border-b border-dotted border-slate-200">
                            <a href="/forum/topic/<?= htmlspecialchars($t['id']) ?>" class="text-[14px] text-slate-800 hover:text-[#1B6FA8] truncate font-medium">
                              <?= htmlspecialchars($t['title']) ?>
                            </a>
                            <span class="text-xs text-slate-400 font-normal shrink-0 ml-3 whitespace-nowrap">
                              댓글 <span class="text-slate-500 font-medium"><?= (int)($t['replyCount'] ?? 0) ?></span>
                            </span>
                          </div>
                        <?php endforeach; ?>
                      </div>
                    </div>

                    <!-- Section: [의료비·보험 Q&A] -->
                    <div>
                      <h3 class="text-[15px] sm:text-base font-bold text-[#1B6FA8] mb-2.5">
                        <a href="/forum?specialty=medical&sub=medical_billing" class="hover:underline">[의료비·보험 Q&amp;A]</a>
                      </h3>
                      <div class="space-y-0.5">
                        <?php foreach ($billingThreads as $t): ?>
                          <div class="flex items-center justify-between py-2.5 border-b border-dotted border-slate-200">
                            <a href="/forum/topic/<?= htmlspecialchars($t['id']) ?>" class="text-[14px] text-slate-800 hover:text-[#1B6FA8] truncate font-medium">
                              <?= htmlspecialchars($t['title']) ?>
                            </a>
                            <span class="text-xs text-slate-400 font-normal shrink-0 ml-3 whitespace-nowrap">
                              댓글 <span class="text-slate-500 font-medium"><?= (int)($t['replyCount'] ?? 0) ?></span>
                            </span>
                          </div>
                        <?php endforeach; ?>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column -->
                  <div class="space-y-6">
                    <!-- Section: [의학 Q&A] -->
                    <div>
                      <h3 class="text-[15px] sm:text-base font-bold text-[#1B6FA8] mb-2.5">
                        <a href="/forum?specialty=medical&sub=medical_qa" class="hover:underline">[의학 Q&amp;A]</a>
                      </h3>
                      <div class="space-y-0.5">
                        <?php foreach ($qaThreads as $t): ?>
                          <div class="flex items-center justify-between py-2.5 border-b border-dotted border-slate-200">
                            <a href="/forum/topic/<?= htmlspecialchars($t['id']) ?>" class="text-[14px] text-slate-800 hover:text-[#1B6FA8] truncate font-medium">
                              <?= htmlspecialchars($t['title']) ?>
                            </a>
                            <span class="text-xs text-slate-400 font-normal shrink-0 ml-3 whitespace-nowrap">
                              댓글 <span class="text-slate-500 font-medium"><?= (int)($t['replyCount'] ?? 0) ?></span>
                            </span>
                          </div>
                        <?php endforeach; ?>
                      </div>
                    </div>

                    <!-- Section: 🔥 스레드에서 핫한 글 -->
                    <div>
                      <h3 class="text-[15px] sm:text-base font-bold text-slate-900 mb-2.5 flex items-center gap-1.5">
                        <span class="text-red-500">🔥</span>
                        <a href="/forum?specialty=medical&sort=hot" class="text-red-600 hover:underline">스레드에서 핫한 글</a>
                      </h3>
                      <div class="space-y-0.5">
                        <?php foreach ($hotThreads as $t): 
                          $v = (int)($t['viewCount'] ?? 0);
                          $viewsFormatted = ($v >= 1000) ? round($v / 1000, 1) . 'k' : (string)$v;
                        ?>
                          <div class="flex items-center justify-between py-2.5 border-b border-dotted border-slate-200">
                            <a href="/forum/topic/<?= htmlspecialchars($t['id']) ?>" class="text-[14px] text-slate-800 hover:text-[#1B6FA8] truncate font-medium">
                              <?= htmlspecialchars($t['title']) ?>
                            </a>
                            <span class="text-xs text-slate-400 font-normal shrink-0 ml-3 whitespace-nowrap">
                              조회 <span class="text-slate-500 font-medium"><?= htmlspecialchars($viewsFormatted) ?></span>
                            </span>
                          </div>
                        <?php endforeach; ?>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Tab Pane 2: 자유게시판 -->
              <div id="pane-community" class="home-tab-pane p-5 sm:p-7 space-y-3 hidden">
                <div class="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <span class="text-xs font-bold text-slate-500">뉴저지 이웃들의 자유로운 일상 나눔과 생활 꿀팁</span>
                  <a href="/forum?specialty=community" class="text-xs font-bold text-[#1B6FA8] hover:underline">자유게시판 바로가기 →</a>
                </div>
                <div class="space-y-0.5">
                  <?php foreach (($categoryLatestThreads['community'] ?? []) as $t): ?>
                    <div class="py-2.5 border-b border-dotted border-slate-200 flex items-center justify-between gap-3">
                      <a href="/forum/topic/<?= htmlspecialchars($t['id']) ?>" class="text-[14px] font-medium text-slate-800 hover:text-[#1B6FA8] truncate flex-1">
                        <?= htmlspecialchars($t['title']) ?>
                      </a>
                      <div class="flex items-center gap-2 text-xs text-slate-400 shrink-0">
                        <span><?= htmlspecialchars($t['authorName'] ?? '이웃') ?></span>
                        <span>•</span>
                        <span>댓글 <?= (int)$t['replyCount'] ?></span>
                      </div>
                    </div>
                  <?php endforeach; ?>
                </div>
              </div>

              <!-- Tab Pane 3: 마켓플레이스 -->
              <div id="pane-market" class="home-tab-pane p-5 sm:p-7 space-y-4 hidden">
                <div class="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <div class="flex items-center gap-2 flex-wrap text-xs font-bold text-slate-700">
                    <span class="text-[#1B6FA8]">서브 카테고리:</span>
                    <a href="/forum?specialty=market&sub=market_realestate" class="px-2 py-0.5 rounded bg-blue-50 text-[#1B6FA8]">부동산(매매/렌트)</a>
                    <a href="/forum?specialty=market&sub=market_auto" class="px-2 py-0.5 rounded bg-slate-100 hover:text-[#1B6FA8]">자동차</a>
                    <a href="/forum?specialty=market&sub=market_electronics" class="px-2 py-0.5 rounded bg-slate-100 hover:text-[#1B6FA8]">전자제품</a>
                    <a href="/forum?specialty=market&sub=market_furniture" class="px-2 py-0.5 rounded bg-slate-100 hover:text-[#1B6FA8]">가구·생활용품</a>
                  </div>
                  <a href="/forum?specialty=market" class="text-xs font-bold text-[#1B6FA8] hover:underline">마켓플레이스 전체보기 →</a>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <?php foreach (($categoryLatestThreads['market'] ?? []) as $t): ?>
                    <a href="/forum/topic/<?= htmlspecialchars($t['id']) ?>" class="p-3 rounded-xl border border-slate-200/90 bg-white hover:border-[#1B6FA8] transition-all flex gap-3 group">
                      <?php if (!empty($t['images'][0])): ?>
                        <img src="<?= htmlspecialchars($t['images'][0]) ?>" class="w-16 h-16 rounded-lg object-cover shrink-0 bg-slate-100" alt="사진">
                      <?php else: ?>
                        <div class="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 text-sm font-bold">
                          사진
                        </div>
                      <?php endif; ?>
                      <div class="min-w-0 flex-1 flex flex-col justify-between">
                        <span class="text-xs font-bold text-slate-900 group-hover:text-[#1B6FA8] line-clamp-1 leading-snug"><?= htmlspecialchars($t['title']) ?></span>
                        <?php if (!empty($t['price'])): ?>
                          <span class="text-xs font-black text-[#1B6FA8]"><?= htmlspecialchars($t['price']) ?></span>
                        <?php endif; ?>
                        <div class="flex items-center justify-between text-[11px] text-slate-400">
                          <span><?= htmlspecialchars($t['location'] ?? 'NJ') ?></span>
                          <span>댓글 <?= (int)$t['replyCount'] ?></span>
                        </div>
                      </div>
                    </a>
                  <?php endforeach; ?>
                </div>
              </div>

              <!-- Tab Pane: 서비스 (Services: 구해요, 교육, 서비스, 커뮤니티 센터) -->
              <div id="pane-wanted" class="home-tab-pane hidden">
                <div class="p-5 sm:p-7 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                  <span class="text-xs font-bold text-slate-500">뉴저지 생활 맞춤 서비스 &amp; 커뮤니티 — 구해요, 교육, 서비스, 커뮤니티 센터</span>
                  <a href="/forum?specialty=wanted" class="text-xs font-bold text-[#1B6FA8] hover:underline">서비스 전체보기 →</a>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 p-5 sm:p-7">
                  
                  <!-- Left Column -->
                  <div class="space-y-6">
                    <!-- Sub-Category: [구해요] -->
                    <div>
                      <h3 class="text-[15px] sm:text-base font-bold text-[#0D9488] mb-2.5 flex items-center justify-between">
                        <a href="/forum?specialty=wanted&sub=wanted_requests" class="hover:underline flex items-center gap-1.5">
                          <i class="fa-solid fa-hand-holding-heart text-xs text-[#0D9488]"></i>
                          <span>[구해요] 생활 도움·돌봄·통역</span>
                        </a>
                        <a href="/forum?specialty=wanted&sub=wanted_requests" class="text-[11px] font-semibold text-slate-400 hover:text-[#0D9488]">더보기 →</a>
                      </h3>
                      <div class="space-y-0.5">
                        <?php foreach ($serviceWantedThreads as $t): ?>
                          <div class="flex items-center justify-between py-2.5 border-b border-dotted border-slate-200">
                            <a href="/forum/topic/<?= htmlspecialchars($t['id']) ?>" class="text-[14px] text-slate-800 hover:text-[#0D9488] truncate font-medium">
                              <?= htmlspecialchars($t['title']) ?>
                            </a>
                            <span class="text-xs text-slate-400 font-normal shrink-0 ml-3 whitespace-nowrap">
                              댓글 <span class="text-slate-500 font-medium"><?= (int)($t['replyCount'] ?? 0) ?></span>
                            </span>
                          </div>
                        <?php endforeach; ?>
                      </div>
                    </div>

                    <!-- Sub-Category: [교육] -->
                    <div>
                      <h3 class="text-[15px] sm:text-base font-bold text-[#4F46E5] mb-2.5 flex items-center justify-between">
                        <a href="/forum?specialty=wanted&sub=wanted_education" class="hover:underline flex items-center gap-1.5">
                          <i class="fa-solid fa-graduation-cap text-xs text-[#4F46E5]"></i>
                          <span>[교육] 과외·레슨·입시</span>
                        </a>
                        <a href="/forum?specialty=wanted&sub=wanted_education" class="text-[11px] font-semibold text-slate-400 hover:text-[#4F46E5]">더보기 →</a>
                      </h3>
                      <div class="space-y-0.5">
                        <?php foreach ($serviceEduThreads as $t): ?>
                          <div class="flex items-center justify-between py-2.5 border-b border-dotted border-slate-200">
                            <a href="/forum/topic/<?= htmlspecialchars($t['id']) ?>" class="text-[14px] text-slate-800 hover:text-[#4F46E5] truncate font-medium">
                              <?= htmlspecialchars($t['title']) ?>
                            </a>
                            <span class="text-xs text-slate-400 font-normal shrink-0 ml-3 whitespace-nowrap">
                              댓글 <span class="text-slate-500 font-medium"><?= (int)($t['replyCount'] ?? 0) ?></span>
                            </span>
                          </div>
                        <?php endforeach; ?>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column -->
                  <div class="space-y-6">
                    <!-- Sub-Category: [서비스] -->
                    <div>
                      <h3 class="text-[15px] sm:text-base font-bold text-[#059669] mb-2.5 flex items-center justify-between">
                        <a href="/forum?specialty=wanted&sub=wanted_services" class="hover:underline flex items-center gap-1.5">
                          <i class="fa-solid fa-screwdriver-wrench text-xs text-[#059669]"></i>
                          <span>[서비스] 핸디맨·수리·청소·이사</span>
                        </a>
                        <a href="/forum?specialty=wanted&sub=wanted_services" class="text-[11px] font-semibold text-slate-400 hover:text-[#059669]">더보기 →</a>
                      </h3>
                      <div class="space-y-0.5">
                        <?php foreach ($serviceGenThreads as $t): ?>
                          <div class="flex items-center justify-between py-2.5 border-b border-dotted border-slate-200">
                            <a href="/forum/topic/<?= htmlspecialchars($t['id']) ?>" class="text-[14px] text-slate-800 hover:text-[#059669] truncate font-medium">
                              <?= htmlspecialchars($t['title']) ?>
                            </a>
                            <span class="text-xs text-slate-400 font-normal shrink-0 ml-3 whitespace-nowrap">
                              댓글 <span class="text-slate-500 font-medium"><?= (int)($t['replyCount'] ?? 0) ?></span>
                            </span>
                          </div>
                        <?php endforeach; ?>
                      </div>
                    </div>

                    <!-- Sub-Category: [커뮤니티 센터] -->
                    <div>
                      <h3 class="text-[15px] sm:text-base font-bold text-[#D97706] mb-2.5 flex items-center justify-between">
                        <a href="/forum?specialty=wanted&sub=wanted_community_center" class="hover:underline flex items-center gap-1.5">
                          <i class="fa-solid fa-people-roof text-xs text-[#D97706]"></i>
                          <span>[커뮤니티 센터] 동포 지원·프로그램</span>
                        </a>
                        <a href="/forum?specialty=wanted&sub=wanted_community_center" class="text-[11px] font-semibold text-slate-400 hover:text-[#D97706]">더보기 →</a>
                      </h3>
                      <div class="space-y-0.5">
                        <?php foreach ($serviceCommThreads as $t): ?>
                          <div class="flex items-center justify-between py-2.5 border-b border-dotted border-slate-200">
                            <a href="/forum/topic/<?= htmlspecialchars($t['id']) ?>" class="text-[14px] text-slate-800 hover:text-[#D97706] truncate font-medium">
                              <?= htmlspecialchars($t['title']) ?>
                            </a>
                            <span class="text-xs text-slate-400 font-normal shrink-0 ml-3 whitespace-nowrap">
                              댓글 <span class="text-slate-500 font-medium"><?= (int)($t['replyCount'] ?? 0) ?></span>
                            </span>
                          </div>
                        <?php endforeach; ?>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Tab Pane 4: 구직 (Jobs) -->
              <div id="pane-jobs" class="home-tab-pane p-5 sm:p-7 space-y-3 hidden">
                <div class="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <span class="text-xs font-bold text-slate-500">버겐카운티 및 뉴저지 한인 병의원, 비즈니스 구인/구직</span>
                  <a href="/forum?specialty=jobs" class="text-xs font-bold text-[#1B6FA8] hover:underline">구직 포럼 전체보기 →</a>
                </div>
                <div class="space-y-0.5">
                  <?php foreach (($categoryLatestThreads['jobs'] ?? []) as $t): ?>
                    <div class="py-2.5 border-b border-dotted border-slate-200 flex items-center justify-between gap-3">
                      <div class="min-w-0 flex-1">
                        <a href="/forum/topic/<?= htmlspecialchars($t['id']) ?>" class="text-[14px] font-medium text-slate-800 hover:text-[#1B6FA8] truncate block">
                          <?= htmlspecialchars($t['title']) ?>
                        </a>
                        <span class="text-[11px] text-slate-400 mt-0.5 block"><?= htmlspecialchars($t['location'] ?? '뉴저지') ?> • <?= htmlspecialchars($t['authorName'] ?? '채용담당자') ?></span>
                      </div>
                      <span class="text-[11px] bg-slate-100 px-2.5 py-1 rounded font-bold text-slate-600 shrink-0">채용</span>
                    </div>
                  <?php endforeach; ?>
                </div>
              </div>

              <!-- Tab Pane 5: 맛집 -->
              <div id="pane-food" class="home-tab-pane p-5 sm:p-7 space-y-4 hidden">
                <div class="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <span class="text-xs font-bold text-slate-500">포트리, 팰팍, 잉글우드 등 뉴저지 한인 맛집 및 카페 솔직 후기</span>
                  <a href="/forum?specialty=food" class="text-xs font-bold text-[#1B6FA8] hover:underline">맛집 전체보기 →</a>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <?php foreach (($categoryLatestThreads['food'] ?? []) as $t): ?>
                    <a href="/forum/topic/<?= htmlspecialchars($t['id']) ?>" class="p-3 rounded-xl border border-slate-200/90 bg-white hover:border-[#1B6FA8] transition-all flex gap-3 group">
                      <?php if (!empty($t['images'][0])): ?>
                        <img src="<?= htmlspecialchars($t['images'][0]) ?>" class="w-16 h-16 rounded-lg object-cover shrink-0 bg-slate-100" alt="사진">
                      <?php else: ?>
                        <div class="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 text-sm font-bold">
                          맛집
                        </div>
                      <?php endif; ?>
                      <div class="min-w-0 flex-1 flex flex-col justify-between">
                        <span class="text-xs font-bold text-slate-900 group-hover:text-[#1B6FA8] line-clamp-1 leading-snug"><?= htmlspecialchars($t['title']) ?></span>
                        <?php if (!empty($t['price'])): ?>
                          <span class="text-xs font-bold text-red-600"><?= htmlspecialchars($t['price']) ?></span>
                        <?php endif; ?>
                        <div class="flex items-center justify-between text-[11px] text-slate-400">
                          <span><?= htmlspecialchars($t['location'] ?? 'NJ') ?></span>
                          <span>댓글 <?= (int)$t['replyCount'] ?></span>
                        </div>
                      </div>
                    </a>
                  <?php endforeach; ?>
                </div>
              </div>

              <!-- Tab Pane 6: 전문가 칼럼 -->
              <div id="pane-columns" class="home-tab-pane p-5 sm:p-7 space-y-3 hidden">
                <div class="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <span class="text-xs font-bold text-slate-500">공인 의사 · 변호사 · 보험 에이전트 · CPA 전문 지식 칼럼</span>
                  <a href="/forum?specialty=columns" class="text-xs font-bold text-[#1B6FA8] hover:underline">칼럼 전체보기 →</a>
                </div>
                <div class="space-y-2.5">
                  <?php foreach (($categoryLatestThreads['columns'] ?? []) as $t): ?>
                    <a href="/forum/topic/<?= htmlspecialchars($t['id']) ?>" class="block p-3.5 rounded-xl border border-slate-200/80 hover:border-[#1B6FA8] bg-slate-50/50 hover:bg-white transition-all group">
                      <div class="flex items-center justify-between gap-2 mb-1">
                        <span class="text-[11px] font-extrabold text-[#1B6FA8] bg-blue-50 px-2 py-0.5 rounded">
                          <?= htmlspecialchars($t['authorBadge'] ?? '공인 전문가') ?>
                        </span>
                        <span class="text-[11px] text-slate-400">조회 <?= (int)$t['viewCount'] ?></span>
                      </div>
                      <span class="text-[14px] font-bold text-slate-900 group-hover:text-[#1B6FA8] block leading-snug"><?= htmlspecialchars($t['title']) ?></span>
                      <span class="text-xs text-slate-500 mt-1 block"><?= htmlspecialchars($t['authorName'] ?? '전문가') ?></span>
                    </a>
                  <?php endforeach; ?>
                </div>
              </div>

              <!-- Tab Pane 7: 이벤트 -->
              <div id="pane-events" class="home-tab-pane p-5 sm:p-7 space-y-4 hidden">
                <div class="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <span class="text-xs font-bold text-slate-500">뉴저지 한인 커뮤니티 세미나, 건강강좌, 공식 행사 및 공지</span>
                  <a href="/forum?specialty=events" class="text-xs font-bold text-[#1B6FA8] hover:underline">이벤트 전체보기 →</a>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <?php foreach (($categoryLatestThreads['events'] ?? []) as $t): ?>
                    <a href="/forum/topic/<?= htmlspecialchars($t['id']) ?>" class="p-3 rounded-xl border border-slate-200/90 bg-white hover:border-[#1B6FA8] transition-all flex gap-3 group">
                      <?php if (!empty($t['images'][0])): ?>
                        <img src="<?= htmlspecialchars($t['images'][0]) ?>" class="w-16 h-16 rounded-lg object-cover shrink-0 bg-slate-100" alt="사진">
                      <?php else: ?>
                        <div class="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 text-sm font-bold">
                          이벤트
                        </div>
                      <?php endif; ?>
                      <div class="min-w-0 flex-1 flex flex-col justify-between">
                        <span class="text-xs font-bold text-slate-900 group-hover:text-[#1B6FA8] line-clamp-1 leading-snug"><?= htmlspecialchars($t['title']) ?></span>
                        <div class="flex items-center justify-between text-[11px] text-slate-400">
                          <span><?= htmlspecialchars($t['location'] ?? '버겐카운티') ?></span>
                          <span>조회 <?= (int)$t['viewCount'] ?></span>
                        </div>
                      </div>
                    </a>
                  <?php endforeach; ?>
                </div>
              </div>

              <!-- Tab Pane 8: 동호회/동문회 -->
              <div id="pane-clubs" class="home-tab-pane p-5 sm:p-7 space-y-4 hidden">
                <div class="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <span class="text-xs font-bold text-slate-500">뉴저지 한인 동호회, 동문회, 소모임 전용 미니 룸 공간</span>
                  <a href="/forum?specialty=clubs" class="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1">
                    <span>동호회 룸 전체보기</span>
                    <i class="fa-solid fa-arrow-right text-[10px]"></i>
                  </a>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <?php 
                  $homeClubs = array_slice($clubRooms, 0, 4);
                  foreach ($homeClubs as $c): 
                    $cBanner = !empty($c['banner_url']) ? $c['banner_url'] : '';
                    $cColor = $c['theme_color'] ?? '#7C3AED';
                    $cEmblem = $c['emblem'] ?? 'fa-users';
                  ?>
                    <a href="/forum/club.php?id=<?= htmlspecialchars($c['id']) ?>" class="p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:border-purple-500 hover:shadow-md transition-all flex gap-3.5 group relative overflow-hidden">
                      <div class="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xl shadow-xs" style="background: <?= $cBanner ? "linear-gradient(rgba(15,23,42,0.3), rgba(15,23,42,0.7)), url('" . htmlspecialchars($cBanner) . "') center/cover" : "linear-gradient(135deg, " . htmlspecialchars($cColor) . ", #0F2342)" ?>;">
                        <i class="fa-solid <?= htmlspecialchars($cEmblem) ?> drop-shadow"></i>
                      </div>
                      <div class="min-w-0 flex-1 flex flex-col justify-between">
                        <div>
                          <div class="flex items-center gap-1.5 mb-1 text-[11px]">
                            <span class="px-1.5 py-0.2 rounded font-semibold bg-purple-50 text-purple-700"><?= htmlspecialchars($c['type']) ?></span>
                            <span class="text-slate-400 font-mono text-[10px]">👑 방장: <?= htmlspecialchars($c['leader_name']) ?></span>
                          </div>
                          <span class="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-purple-600 line-clamp-1 leading-snug"><?= htmlspecialchars($c['name']) ?></span>
                        </div>
                        <div class="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                          <span class="truncate max-w-[120px]"><i class="fa-solid fa-location-dot text-slate-300 mr-1 text-[10px]"></i><?= htmlspecialchars($c['location']) ?></span>
                          <span class="font-bold text-purple-600 group-hover:underline text-[11px]">룸 입장 →</span>
                        </div>
                      </div>
                    </a>
                  <?php endforeach; ?>
                </div>
              </div>

            </div>

          </div>

          <!-- Right Sidebar (lg:col-span-4): Sort Tabs & Widgets -->
          <div class="lg:col-span-4 space-y-5">
            
            <!-- Right Sidebar: Sort Tabs (조회순 / 공감순 / 댓글순) -->
            <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div class="p-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <span class="text-xs font-black text-slate-900">실시간 인기 랭킹</span>
                <span class="text-[10px] text-slate-400 font-bold">TOP 10</span>
              </div>

              <!-- 3 Sort Tabs -->
              <div class="grid grid-cols-3 p-1.5 bg-slate-100/80 gap-1 text-xs font-bold">
                <button type="button" onclick="switchRankTab('views')" id="rtab-views" class="sidebar-rank-tab active py-1.5 rounded-lg text-center transition-all cursor-pointer">
                  조회순
                </button>
                <button type="button" onclick="switchRankTab('likes')" id="rtab-likes" class="sidebar-rank-tab py-1.5 rounded-lg text-center transition-all cursor-pointer">
                  공감순
                </button>
                <button type="button" onclick="switchRankTab('comments')" id="rtab-comments" class="sidebar-rank-tab py-1.5 rounded-lg text-center transition-all cursor-pointer">
                  댓글순
                </button>
              </div>

              <!-- Rank List 1: 조회순 -->
              <div id="rpane-views" class="rank-pane p-3 space-y-2 text-xs">
                <?php $idx = 1; foreach ($topViewed as $q): ?>
                  <a href="/forum/topic/<?= htmlspecialchars($q['id']) ?>" class="flex items-start gap-2.5 hover:text-[#1B6FA8] group py-1">
                    <span class="w-5 h-5 rounded-md <?= ($idx <= 3) ? 'bg-[#1B6FA8] text-white font-black' : 'bg-slate-100 text-slate-500 font-bold' ?> flex items-center justify-center text-[10px] shrink-0"><?= $idx++ ?></span>
                    <span class="truncate font-semibold text-slate-800 group-hover:text-[#1B6FA8] flex-1"><?= htmlspecialchars($q['title']) ?></span>
                    <span class="text-[10.5px] text-slate-400 font-mono shrink-0">조회 <?= (int)$q['viewCount'] ?></span>
                  </a>
                <?php endforeach; ?>
              </div>

              <!-- Rank List 2: 공감순 -->
              <div id="rpane-likes" class="rank-pane p-3 space-y-2 text-xs hidden">
                <?php $idx = 1; foreach ($topLiked as $q): ?>
                  <a href="/forum/topic/<?= htmlspecialchars($q['id']) ?>" class="flex items-start gap-2.5 hover:text-[#1B6FA8] group py-1">
                    <span class="w-5 h-5 rounded-md <?= ($idx <= 3) ? 'bg-rose-500 text-white font-black' : 'bg-slate-100 text-slate-500 font-bold' ?> flex items-center justify-center text-[10px] shrink-0"><?= $idx++ ?></span>
                    <span class="truncate font-semibold text-slate-800 group-hover:text-[#1B6FA8] flex-1"><?= htmlspecialchars($q['title']) ?></span>
                    <span class="text-[10.5px] text-rose-500 font-bold shrink-0">공감 <?= (int)($q['likeCount'] ?? 0) ?></span>
                  </a>
                <?php endforeach; ?>
              </div>

              <!-- Rank List 3: 댓글순 -->
              <div id="rpane-comments" class="rank-pane p-3 space-y-2 text-xs hidden">
                <?php $idx = 1; foreach ($topCommented as $q): ?>
                  <a href="/forum/topic/<?= htmlspecialchars($q['id']) ?>" class="flex items-start gap-2.5 hover:text-[#1B6FA8] group py-1">
                    <span class="w-5 h-5 rounded-md <?= ($idx <= 3) ? 'bg-amber-500 text-white font-black' : 'bg-slate-100 text-slate-500 font-bold' ?> flex items-center justify-center text-[10px] shrink-0"><?= $idx++ ?></span>
                    <span class="truncate font-semibold text-slate-800 group-hover:text-[#1B6FA8] flex-1"><?= htmlspecialchars($q['title']) ?></span>
                    <span class="text-[10.5px] text-amber-600 font-bold shrink-0">댓글 <?= (int)$q['replyCount'] ?></span>
                  </a>
                <?php endforeach; ?>
              </div>

            </div>

            <!-- Medical & Community Help Badge (Clean, no emoji) -->
            <div class="rounded-2xl p-4.5 border border-sky-200 bg-sky-50/70 text-slate-800 text-xs space-y-2">
              <span class="font-extrabold text-[#1B6FA8] text-xs block">이웃과 전문가가 함께합니다</span>
              <p class="leading-relaxed text-slate-600">
                의사, 변호사, 보험전문가, CPA가 직접 칼럼과 답변으로 동포 여러분의 안전한 뉴저지 정착을 돕습니다.
              </p>
            </div>

          </div>

        </div>

        <!-- =========================================================
             BOTTOM OF FORUM HOME: FEATURED SERVICES & ADS
             (Recommended Partners & Verified Professional Services)
             ========================================================= -->
        <?php if (!empty($featuredAdsList)): ?>
          <section class="mt-10 pt-8 border-t border-slate-200/80">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>추천 서비스 &amp; 파트너 안내</span>
                  <span class="text-[11px] bg-blue-100 text-[#1B6FA8] font-extrabold px-2 py-0.5 rounded-full">Featured Partners</span>
                </h2>
                <p class="text-xs text-slate-500 mt-0.5">
                  병원, 법률, 부동산, 보험 등 뉴저지 한인 동포를 위한 검증된 전문 파트너 서비스
                </p>
              </div>
            </div>

            <!-- Featured Ads Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <?php foreach ($featuredAdsList as $ad): 
                $thumb = !empty($ad['image']) ? $ad['image'] : 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80';
                $adUrl = !empty($ad['url']) ? $ad['url'] : '#';
                $isExternal = str_starts_with($adUrl, 'http');
              ?>
                <a href="<?= htmlspecialchars($adUrl) ?>" <?= $isExternal ? 'target="_blank" rel="noopener noreferrer"' : '' ?> class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden card-hover group flex flex-col">
                  <div class="relative aspect-16/9 bg-slate-100 overflow-hidden">
                    <img src="<?= htmlspecialchars($thumb) ?>" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="<?= htmlspecialchars($ad['title']) ?>">
                    <?php if (!empty($ad['badge'])): ?>
                      <span class="absolute top-2.5 left-2.5 bg-[#1B6FA8] text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
                        <?= htmlspecialchars($ad['badge']) ?>
                      </span>
                    <?php endif; ?>
                    <?php if (!empty($ad['price'])): ?>
                      <span class="absolute bottom-2.5 right-2.5 bg-slate-900/85 text-white font-bold text-[11px] px-2 py-0.5 rounded-md backdrop-blur-xs">
                        <?= htmlspecialchars($ad['price']) ?>
                      </span>
                    <?php endif; ?>
                  </div>

                  <div class="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#1B6FA8] line-clamp-1 leading-snug">
                        <?= htmlspecialchars($ad['title']) ?>
                      </h3>
                      <?php if (!empty($ad['desc'])): ?>
                        <p class="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          <?= htmlspecialchars($ad['desc']) ?>
                        </p>
                      <?php endif; ?>
                    </div>

                    <div class="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                      <span><?= htmlspecialchars($ad['location'] ?? '뉴저지') ?></span>
                      <?php if (!empty($ad['phone'])): ?>
                        <span class="font-bold text-[#1B6FA8]"><?= htmlspecialchars($ad['phone']) ?></span>
                      <?php else: ?>
                        <span class="text-[#1B6FA8] font-bold">자세히 보기 →</span>
                      <?php endif; ?>
                    </div>
                  </div>
                </a>
              <?php endforeach; ?>
            </div>
          </section>
        <?php endif; ?>

        <!-- =========================================================
             HOME VIEW BOTTOM: 전체 최신글 목록 & 페이지 네비게이션
             ========================================================= -->
        <section class="mt-10 pt-8 border-t border-slate-200/80">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 class="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span>뉴저지 한인 광장 전체 최신글</span>
                <span class="text-[11px] bg-blue-100 text-[#1B6FA8] font-extrabold px-2 py-0.5 rounded-full">전체 <?= $totalRegular ?>개</span>
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">
                9대 커뮤니티 게시판의 모든 최신 글을 페이지별로 확인하세요.
              </p>
            </div>

            <div class="flex items-center gap-2">
              <a href="/forum?specialty=all" class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#1B6FA8] text-[#1B6FA8] font-bold text-xs transition-all shadow-2xs flex items-center gap-1.5">
                <span>전체글 전용 화면</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </a>
            </div>
          </div>

          <!-- Table Container -->
          <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr class="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                    <th class="py-3 px-3.5 text-center w-14">번호</th>
                    <th class="py-3 px-2 sm:px-3 text-center w-20 sm:w-24">구분</th>
                    <th class="py-3 px-3">제목</th>
                    <th class="py-3 px-3 text-center w-28">작성자</th>
                    <th class="py-3 px-3 text-center w-20">공감</th>
                    <th class="py-3 px-3 text-center w-24">등록일</th>
                    <th class="py-3 px-3.5 text-center w-16">조회</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-medium">
                  <?php 
                  $hRegIdx = 0;
                  foreach ($displayQuestions as $q): 
                    $isPinned = !empty($q['isNotice']);
                    $hasPhotos = !empty($q['images']) && count($q['images']) > 0;
                    $itemSeq = $isPinned ? '공지' : ($totalRegular - $offset - $hRegIdx);
                    if (!$isPinned) {
                      $hRegIdx++;
                    }
                    $cObj = $q['category'] ?? null;
                    $cName = $cObj['name_ko'] ?? '자유게시판';
                  ?>
                    <tr class="hover:bg-slate-50/80 transition-colors <?= $isPinned ? 'bg-amber-50/40' : '' ?>">
                      <!-- 번호 / 공지 배지 -->
                      <td class="py-3 px-3.5 text-center text-slate-400 font-mono text-xs">
                        <?php if ($isPinned): ?>
                          <span class="inline-block px-1.5 py-0.5 rounded bg-amber-500 text-white font-extrabold text-[10px]">공지</span>
                        <?php else: ?>
                          <?= $itemSeq ?>
                        <?php endif; ?>
                      </td>

                      <!-- 구분 (카테고리) -->
                      <td class="py-3 px-2 sm:px-3 text-center whitespace-nowrap">
                        <span class="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-[#1B6FA8]">
                          <?= htmlspecialchars($cName) ?>
                        </span>
                      </td>

                      <!-- 제목 + 댓글수 + 포토 아이콘 -->
                      <td class="py-3 px-3">
                        <div class="flex items-center gap-2 flex-wrap">
                          <?php if (!empty($q['price'])): ?>
                            <span class="text-[11px] font-black text-[#1B6FA8] bg-blue-50 px-1.5 py-0.2 rounded shrink-0">
                              <?= htmlspecialchars($q['price']) ?>
                            </span>
                          <?php endif; ?>

                          <a href="/forum/topic/<?= htmlspecialchars($q['id']) ?>" class="font-normal text-slate-700 hover:text-[#1B6FA8] transition-colors leading-snug text-xs sm:text-[14px]">
                            <?= forum_format_list_title($q['title']) ?>
                          </a>

                          <?php if ($hasPhotos): ?>
                            <span class="text-slate-400 text-[11px]" title="사진 첨부"><i class="fa-regular fa-image"></i></span>
                          <?php endif; ?>

                          <?php if ((int)$q['replyCount'] > 0): ?>
                            <span class="text-xs font-bold text-[#1B6FA8] font-mono">[<?= (int)$q['replyCount'] ?>]</span>
                          <?php endif; ?>
                        </div>
                      </td>

                      <!-- 작성자 -->
                      <td class="py-3 px-3 text-center text-slate-600 truncate max-w-[120px]">
                        <?= htmlspecialchars($q['authorName'] ?? '이웃') ?>
                      </td>

                      <!-- 공감 -->
                      <td class="py-3 px-3 text-center text-rose-500 font-bold font-mono">
                        <?= (int)($q['likeCount'] ?? 0) ?>
                      </td>

                      <!-- 등록일 -->
                      <td class="py-3 px-3 text-center text-slate-400 text-xs font-mono">
                        <?= substr($q['createdAt'] ?? '', 0, 10) ?>
                      </td>

                      <!-- 조회수 -->
                      <td class="py-3 px-3.5 text-center text-slate-400 font-mono">
                        <?= (int)$q['viewCount'] ?>
                      </td>
                    </tr>
                  <?php endforeach; ?>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Pagination Controls on Home View -->
          <?php if ($totalPages > 1): 
            $homePageBaseUrl = function($p) {
              return ($p > 1) ? '/forum?specialty=all&page=' . $p : '/forum';
            };
            $prevPage = max(1, $currentPage - 1);
            $nextPage = min($totalPages, $currentPage + 1);

            $startP = max(1, $currentPage - 2);
            $endP = min($totalPages, $startP + 4);
            if ($endP - $startP < 4) {
              $startP = max(1, $endP - 4);
            }
          ?>
            <div class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
              <div class="text-xs text-slate-500 font-medium order-2 sm:order-1">
                총 <span class="font-bold text-slate-800"><?= $totalRegular ?></span>개 글 (<?= $currentPage ?> / <?= $totalPages ?> 페이지)
              </div>

              <nav class="flex items-center gap-1.5 order-1 sm:order-2" aria-label="게시판 페이지 네비게이션">
                <!-- 이전 페이지 -->
                <?php if ($currentPage > 1): ?>
                  <a href="<?= htmlspecialchars($homePageBaseUrl($prevPage)) ?>" class="px-3 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-[#1B6FA8] hover:text-[#1B6FA8] font-bold text-xs flex items-center gap-1 transition-all shadow-2xs">
                    <i class="fa-solid fa-chevron-left text-[10px]"></i>
                    <span>이전</span>
                  </a>
                <?php else: ?>
                  <span class="px-3 h-9 rounded-xl bg-slate-100/70 border border-slate-200/60 text-slate-300 font-bold text-xs flex items-center gap-1 cursor-not-allowed">
                    <i class="fa-solid fa-chevron-left text-[10px]"></i>
                    <span>이전</span>
                  </span>
                <?php endif; ?>

                <!-- 숫자 페이지 버튼들 (1, 2, 3, 4, 5, 6...) -->
                <div class="flex items-center gap-1">
                  <?php for ($p = $startP; $p <= $endP; $p++): ?>
                    <?php if ($p === $currentPage): ?>
                      <span class="w-9 h-9 rounded-xl bg-[#1B6FA8] text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-xs cursor-default">
                        <?= $p ?>
                      </span>
                    <?php else: ?>
                      <a href="<?= htmlspecialchars($homePageBaseUrl($p)) ?>" class="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-[#1B6FA8] hover:text-[#1B6FA8] font-bold text-xs sm:text-sm flex items-center justify-center transition-all shadow-2xs">
                        <?= $p ?>
                      </a>
                    <?php endif; ?>
                  <?php endfor; ?>
                </div>

                <!-- 다음 페이지 -->
                <?php if ($currentPage < $totalPages): ?>
                  <a href="<?= htmlspecialchars($homePageBaseUrl($nextPage)) ?>" class="px-3 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-[#1B6FA8] hover:text-[#1B6FA8] font-bold text-xs flex items-center gap-1 transition-all shadow-2xs">
                    <span>다음</span>
                    <i class="fa-solid fa-chevron-right text-[10px]"></i>
                  </a>
                <?php else: ?>
                  <span class="px-3 h-9 rounded-xl bg-slate-100/70 border border-slate-200/60 text-slate-300 font-bold text-xs flex items-center gap-1 cursor-not-allowed">
                    <span>다음</span>
                    <i class="fa-solid fa-chevron-right text-[10px]"></i>
                  </span>
                <?php endif; ?>
              </nav>
            </div>
          <?php endif; ?>
        </section>

      <!-- =========================================================
           SCENARIO 2-A: CLUBS DIRECTORY VIEW (동호회/동문회 룸 라운지)
           ========================================================= -->
      <?php elseif ($specialtyFilter === 'clubs'): ?>
        
        <div class="space-y-6">
          <!-- Clubs Hero Header with "+ 동호회/동문회 만들기" CTA -->
          <div class="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#0F2342] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
            <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div class="flex items-center gap-2 mb-2 text-purple-200 text-xs">
                  <a href="/forum" class="hover:underline">광장 홈</a>
                  <span>/</span>
                  <span class="text-white font-bold">동호회/동문회</span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-2.5">
                  <span class="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 text-lg border border-white/20">
                    <i class="fa-solid fa-people-roof"></i>
                  </span>
                  <span>동호회/동문회 룸 라운지</span>
                </h1>
                <p class="text-xs sm:text-sm text-purple-200 max-w-2xl leading-relaxed">
                  뉴저지 한인 취미·스포츠 클럽, 대학·고교 동문회, 소모임 전용 미니 룸 공간입니다. 누구나 자유롭게 룸을 개설하여 방장이 되고, 전용 배너와 게시판으로 모임을 이끌어보세요!
                </p>
              </div>

              <div class="shrink-0">
                <button type="button" onclick="openCreateClubModal()" class="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer">
                  <i class="fa-solid fa-plus text-base"></i>
                  <span>동호회/동문회 만들기</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Filter Pills & Search Bar -->
          <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <!-- Type Filter Tabs -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
              <?php
              $clubTypes = [
                  '' => '전체 모임',
                  '취미/스포츠' => '⚽ 취미/스포츠',
                  '대학/고교 동문회' => '🎓 동문회',
                  '친목/소모임' => '☕ 친목/소모임',
                  '문화/예술' => '🎨 문화/예술',
                  '전문직/비즈니스' => '💼 비즈니스'
              ];
              foreach ($clubTypes as $cTypeVal => $cTypeLabel):
                  $isActive = ($clubTypeFilter === $cTypeVal);
                  $url = '/forum?specialty=clubs' . ($cTypeVal ? '&type=' . urlencode($cTypeVal) : '') . ($searchQuery ? '&q=' . urlencode($searchQuery) : '');
              ?>
              <a href="<?= $url ?>" class="px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all <?= $isActive ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200' ?>">
                <?= $cTypeLabel ?>
              </a>
              <?php endforeach; ?>
            </div>

            <!-- Search Bar -->
            <form method="GET" action="/forum" class="relative sm:w-64 shrink-0">
              <input type="hidden" name="specialty" value="clubs">
              <?php if ($clubTypeFilter): ?>
                <input type="hidden" name="type" value="<?= htmlspecialchars($clubTypeFilter) ?>">
              <?php endif; ?>
              <input type="text" name="q" value="<?= htmlspecialchars($searchQuery) ?>" placeholder="동호회명, 방장, 지역 검색" class="w-full text-xs rounded-xl border border-slate-300 pl-8 pr-3 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
              <i class="fa-solid fa-magnifying-glass text-slate-400 text-xs absolute left-3 top-2.5"></i>
            </form>
          </div>

          <!-- Club Room Cards Grid -->
          <?php if (empty($clubRooms)): ?>
          <div class="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-2xs">
            <div class="w-16 h-16 mx-auto rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-3xl mb-4">
              <i class="fa-solid fa-users"></i>
            </div>
            <h3 class="text-base sm:text-lg font-bold text-slate-900 mb-1">등록된 동호회/동문회가 없습니다</h3>
            <p class="text-xs text-slate-500 max-w-md mx-auto mb-5">
              지금 첫 번째 동호회 또는 동문회 룸을 개설하고 뉴저지 한인 회원들을 초대해보세요!
            </p>
            <button onclick="openCreateClubModal()" class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition">
              + 첫 동호회/동문회 만들기
            </button>
          </div>
          <?php else: ?>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <?php foreach ($clubRooms as $room): 
              $rBanner = !empty($room['banner_url']) ? $room['banner_url'] : '';
              $rColor = $room['theme_color'] ?? '#7C3AED';
              $rEmblem = $room['emblem'] ?? 'fa-users';
              $postCount = (int)($room['post_count'] ?? 0);
              $viewCount = (int)($room['view_count'] ?? 0);
            ?>
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group hover:border-purple-400">
              <!-- Card Header Banner -->
              <div class="h-32 sm:h-36 relative flex flex-col justify-between p-4" style="background: <?= $rBanner ? "linear-gradient(to bottom, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.85) 100%), url('" . htmlspecialchars($rBanner) . "') center/cover" : "linear-gradient(135deg, " . htmlspecialchars($rColor) . " 0%, #0F2342 100%)" ?>;">
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/20 flex items-center gap-1">
                    <i class="fa-solid <?= htmlspecialchars($rEmblem) ?>"></i>
                    <span><?= htmlspecialchars($room['type']) ?></span>
                  </span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/40 backdrop-blur-md text-white/90">
                    <i class="fa-solid fa-location-dot text-red-400 mr-0.5"></i>
                    <?= htmlspecialchars($room['location']) ?>
                  </span>
                </div>

                <!-- Room Emblem & Crown -->
                <div class="flex items-center gap-2">
                  <span class="w-10 h-10 rounded-xl bg-white/95 text-slate-800 flex items-center justify-center text-lg shadow-md font-bold">
                    <i class="fa-solid <?= htmlspecialchars($rEmblem) ?>" style="color: <?= htmlspecialchars($rColor) ?>"></i>
                  </span>
                  <div class="text-white drop-shadow">
                    <span class="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300">
                      <i class="fa-solid fa-crown text-[10px]"></i>
                      <span>방장: <?= htmlspecialchars($room['leader_name']) ?></span>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Card Body -->
              <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-purple-600 transition line-clamp-1 mb-1.5">
                    <a href="/forum/club.php?id=<?= htmlspecialchars($room['id']) ?>">
                      <?= htmlspecialchars($room['name']) ?>
                    </a>
                  </h3>
                  <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    <?= htmlspecialchars($room['one_liner'] ?? $room['description'] ?? '') ?>
                  </p>
                </div>

                <!-- Card Footer Stats & Enter Button -->
                <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-3 text-slate-400 font-medium">
                    <span title="게시글"><i class="fa-solid fa-file-lines mr-1 text-slate-300"></i>글 <?= $postCount ?></span>
                    <span title="조회수"><i class="fa-solid fa-eye mr-1 text-slate-300"></i><?= $viewCount ?></span>
                  </div>

                  <a href="/forum/club.php?id=<?= htmlspecialchars($room['id']) ?>" class="px-3.5 py-1.5 rounded-xl bg-purple-50 group-hover:bg-purple-600 text-purple-700 group-hover:text-white font-bold text-xs flex items-center gap-1 transition-all">
                    <span>룸 입장하기</span>
                    <i class="fa-solid fa-arrow-right text-[10px]"></i>
                  </a>
                </div>
              </div>
            </div>
            <?php endforeach; ?>
          </div>
          <?php endif; ?>

          <!-- ⚠️ MANDATORY PLATFORM DISCLAIMER IN CLUBS SECTION -->
          <div class="bg-amber-50/80 border border-amber-200 rounded-3xl p-5 sm:p-6 text-sm text-amber-950 mt-10">
            <div class="flex items-start gap-3.5">
              <div class="w-8 h-8 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <i class="fa-solid fa-shield-halved text-sm"></i>
              </div>
              <div class="space-y-1.5 flex-1">
                <h4 class="font-bold text-amber-900 text-sm sm:text-base">동호회/동문회 룸 이용 안전 안내 및 플랫폼 면책 공고</h4>
                <p class="text-amber-800 leading-relaxed text-xs sm:text-sm">
                  본 동호회 및 동문회 룸은 포털 이용자가 자유롭게 개설하여 운영하는 <strong>자율 운영 소모임 공간</strong>입니다. 
                  NJ Access Portal(KACCESS)은 회원 상호 간의 친목 및 정보 교류를 돕는 기술적 플랫폼만을 제공하며, 
                  각 동호회의 <strong>회비 징수, 사적 금전 거래, 오프라인 모임 진행 시 발생하는 일체의 사건·사고나 민형사상 분쟁에 대해 법적 책임을 지지 않습니다.</strong>
                </p>
                <p class="text-amber-800/80 text-xs">
                  ※ 안전한 커뮤니티 조성을 위해 사기, 불법 행위, 상업적 무단 광고, 성희롱 등 이용 가이드라인 위반 적발 시 사전 통보 없이 해당 룸은 즉각 <strong>제재(Flagged) 및 영구 폐쇄</strong> 조치됩니다. (신고 접수: <a href="mailto:njaccessportal@gmail.com" class="font-bold underline text-amber-950">njaccessportal@gmail.com</a>)
                </p>
              </div>
            </div>
          </div>

        </div>

      <!-- =========================================================
           SCENARIO 2-B: STANDARD BOARD LIST VIEW (Clicking other Categories)
           ========================================================= -->
      <?php else: ?>
        
        <?php if ($specialtyFilter === 'market' || ($currentCategory['id'] ?? '') === 'market'): ?>
          <!-- Persistent Compact Marketplace Banner (Dismissible per session) -->
          <div id="market-index-banner" class="mb-5 p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-xs text-amber-900 leading-relaxed shadow-xs flex items-start justify-between gap-3">
            <div class="flex items-start gap-2.5">
              <i class="fa-solid fa-triangle-exclamation text-amber-600 text-sm mt-0.5 shrink-0"></i>
              <div>
                <span class="font-black text-amber-950 block mb-0.5">거래 주의 안내</span>
                <p>
                  거래 주의 안내: 뉴저지 한인 광장 중고거래는 회원 간 직거래를 위한 게시판입니다. NJ Access Portal은 거래의 당사자가 아니며, 게시글의 진위·상품 상태·거래 안전을 보증하지 않습니다. 금전 거래, 사기, 분쟁, 손해에 대해 당사는 책임을 지지 않습니다. 자세한 내용은 페이지 하단의 이용약관 및 면책 안내를 확인하세요.
                </p>
              </div>
            </div>
            <button type="button" onclick="dismissMarketBanner()" class="text-amber-700 hover:text-amber-950 p-1 text-sm font-bold shrink-0 cursor-pointer" title="닫기">✕</button>
          </div>
          <script>
            if (sessionStorage.getItem('njap_market_banner_dismissed') === '1') {
              const b = document.getElementById('market-index-banner');
              if (b) b.style.display = 'none';
            }
            function dismissMarketBanner() {
              sessionStorage.setItem('njap_market_banner_dismissed', '1');
              const b = document.getElementById('market-index-banner');
              if (b) b.style.display = 'none';
            }
          </script>
        <?php endif; ?>

        <!-- Board Header & Sub-board Nav Bar -->
        <div class="bg-white rounded-2xl p-4 sm:p-5 mb-5 border border-slate-200/90 shadow-2xs">
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <a href="/forum" class="text-xs font-bold text-slate-400 hover:text-[#1B6FA8]">광장 홈</a>
                <span class="text-slate-300 text-xs">/</span>
                <h1 class="text-lg sm:text-xl font-black text-slate-900">
                  <?= htmlspecialchars($currentCategory['name_ko'] ?? '게시판') ?>
                </h1>
                <?php if ($currentSubBoard): ?>
                  <span class="text-slate-300 text-xs">/</span>
                  <span class="text-xs sm:text-sm font-extrabold text-[#1B6FA8] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    <?= htmlspecialchars($currentSubBoard['name_ko']) ?>
                  </span>
                <?php endif; ?>
              </div>
              <p class="text-xs sm:text-sm text-slate-500">
                <?= htmlspecialchars($currentSubBoard['description'] ?? ($currentCategory['description'] ?? '')) ?>
              </p>
            </div>

            <!-- Right: Search Form & Write Button -->
            <div class="flex items-center gap-2 shrink-0">
              <a href="/forum/ask?category=<?= urlencode($currentCategory['id'] ?? 'community') ?><?= $currentSubBoard ? '&sub=' . urlencode($currentSubBoard['id']) : '' ?>" 
                 class="px-4 py-2 bg-[#1B6FA8] hover:bg-[#155A8A] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-pen-to-square text-xs"></i>
                <span>글쓰기</span>
              </a>
            </div>
          </div>

          <!-- Sub-board Horizontal Pills (if parent has sub-boards, or all categories if viewing 'all') -->
          <?php 
          $activeCatSubs = $allSubBoards[$currentCategory['id'] ?? ''] ?? [];
          if ($specialtyFilter === 'all'):
          ?>
            <div class="flex items-center gap-1.5 overflow-x-auto pt-3 text-xs forum-cat-scroll">
              <a href="/forum?specialty=all" 
                 class="px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition-all bg-[#1B6FA8] text-white shadow-xs">
                <span>전체</span>
              </a>
              <?php foreach ($categories as $c): ?>
                <a href="/forum?specialty=<?= urlencode($c['id']) ?>" 
                   class="px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition-all bg-slate-100 text-slate-700 hover:bg-slate-200">
                  <span><?= htmlspecialchars($c['name_ko']) ?></span>
                </a>
              <?php endforeach; ?>
            </div>
          <?php elseif (!empty($activeCatSubs)): ?>
            <div class="flex items-center gap-1.5 overflow-x-auto pt-3 text-xs forum-cat-scroll">
              <a href="/forum?specialty=<?= urlencode($currentCategory['id']) ?>" 
                 class="px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition-all <?= empty($subFilter) ? 'bg-[#1B6FA8] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200' ?>">
                <span>전체</span>
              </a>
              <?php foreach ($activeCatSubs as $sb): 
                $isSbActive = ($subFilter === $sb['id']);
              ?>
                <a href="/forum?specialty=<?= urlencode($currentCategory['id']) ?>&sub=<?= urlencode($sb['id']) ?>" 
                   class="px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition-all <?= $isSbActive ? 'bg-[#1B6FA8] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200' ?>">
                  <span><?= htmlspecialchars($sb['name_ko']) ?></span>
                </a>
              <?php endforeach; ?>
            </div>
          <?php endif; ?>

          <!-- Filter & Search Bar -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-3 mt-1 text-xs">
            <div class="flex items-center gap-2">
              <span class="text-slate-400">정렬:</span>
              <a href="/forum?specialty=<?= urlencode($specialtyFilter) ?><?= $subFilter ? '&sub=' . urlencode($subFilter) : '' ?>&sort=latest" class="font-bold <?= ($sortFilter === 'latest') ? 'text-[#1B6FA8] underline' : 'text-slate-600 hover:text-slate-900' ?>">최신순</a>
              <span class="text-slate-300">|</span>
              <a href="/forum?specialty=<?= urlencode($specialtyFilter) ?><?= $subFilter ? '&sub=' . urlencode($subFilter) : '' ?>&sort=views" class="font-bold <?= ($sortFilter === 'views') ? 'text-[#1B6FA8] underline' : 'text-slate-600 hover:text-slate-900' ?>">조회순</a>
              <span class="text-slate-300">|</span>
              <a href="/forum?specialty=<?= urlencode($specialtyFilter) ?><?= $subFilter ? '&sub=' . urlencode($subFilter) : '' ?>&sort=likes" class="font-bold <?= ($sortFilter === 'likes') ? 'text-[#1B6FA8] underline' : 'text-slate-600 hover:text-slate-900' ?>">공감순</a>
              <span class="text-slate-300">|</span>
              <a href="/forum?specialty=<?= urlencode($specialtyFilter) ?><?= $subFilter ? '&sub=' . urlencode($subFilter) : '' ?>&sort=comments" class="font-bold <?= ($sortFilter === 'comments') ? 'text-[#1B6FA8] underline' : 'text-slate-600 hover:text-slate-900' ?>">댓글순</a>
            </div>

            <form action="/forum" method="GET" class="relative">
              <input type="hidden" name="specialty" value="<?= htmlspecialchars($specialtyFilter) ?>">
              <?php if ($subFilter): ?>
                <input type="hidden" name="sub" value="<?= htmlspecialchars($subFilter) ?>">
              <?php endif; ?>
              <input type="text" name="q" value="<?= htmlspecialchars($searchQuery) ?>" placeholder="게시판 내 검색..." class="px-3 py-1.5 rounded-lg border border-slate-200 text-xs w-48 sm:w-60 focus:outline-none focus:border-[#1B6FA8]">
            </form>
          </div>

        </div>

        <!-- Classic Community Table (번호 · 제목 · 공감 · 등록일 · 조회) -->
        <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          
          <?php if (empty($questions)): ?>
            <div class="p-12 text-center text-slate-400 text-xs sm:text-sm">
              <i class="fa-regular fa-comment-dots text-2xl mb-2 block text-slate-300"></i>
              등록된 게시글이 없습니다. 첫 번째 글을 작성해보세요!
              <div class="mt-4">
                <a href="/forum/ask?category=<?= urlencode($specialtyFilter) ?><?= $subFilter ? '&sub=' . urlencode($subFilter) : '' ?>" class="px-4 py-2 rounded-xl bg-[#1B6FA8] text-white font-bold text-xs inline-flex items-center gap-1.5">
                  <i class="fa-solid fa-pen"></i>
                  <span>글 작성하기</span>
                </a>
              </div>
            </div>
          <?php elseif ($isThumbnailBoard): ?>
            
            <!-- THUMBNAIL TABLE VIEW (마켓플레이스, 맛집, 이벤트 등) -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs sm:text-sm border-collapse min-w-[720px]">
                <thead>
                  <tr class="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                    <th class="py-3 px-2 sm:px-3 text-center w-14 sm:w-16">번호</th>
                    <th class="py-3 px-2 sm:px-2.5 text-center w-14 sm:w-16">구분</th>
                    <th class="py-3 px-2 sm:px-2.5 text-center w-20 sm:w-24">사진</th>
                    <th class="py-3 px-3">제목</th>
                    <th class="py-3 px-2 sm:px-3 text-center w-20 sm:w-28 text-red-600 font-black">가격</th>
                    <th class="py-3 px-2 sm:px-3 text-center w-24 sm:w-32">작성자</th>
                    <th class="py-3 px-2 sm:px-3 text-center w-20 sm:w-24">등록일</th>
                    <th class="py-3 px-2 sm:px-3 text-center w-12 sm:w-14">조회</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-medium">
                  <?php 
                  $regIdx = 0;
                  foreach ($displayQuestions as $q): 
                    $isPinned = !empty($q['isNotice']);
                    $thumbUrl = '';
                    if (!empty($q['images']) && is_array($q['images']) && count($q['images']) > 0) {
                      $thumbUrl = $q['images'][0];
                    } elseif (!empty($q['imageUrl'])) {
                      $thumbUrl = $q['imageUrl'];
                    }
                    $tagLabel = forum_get_item_bracket_tag($q, $currentCategory['id'] ?? $specialtyFilter);

                    // Author display split into Name and (username)
                    $rawAuthor = $q['authorName'] ?? '이웃';
                    $authorDisplayName = $rawAuthor;
                    $authorUsername = '';
                    if (preg_match('/^(.*?)\s*\((.*?)\)$/', $rawAuthor, $mAuth)) {
                      $authorDisplayName = trim($mAuth[1]);
                      $authorUsername = trim($mAuth[2]);
                    }

                    // Date format (e.g. 2026-10-5 matching screenshot)
                    $formattedDate = !empty($q['createdAt']) ? date('Y-n-j', strtotime($q['createdAt'])) : date('Y-n-j');

                    // New badge within 3 days
                    $isNewPost = !empty($q['createdAt']) && (time() - strtotime($q['createdAt']) < 86400 * 3);
                    $seqNo = $isPinned ? '공지' : (98600 + ($totalRegular - $offset - $regIdx));
                    if (!$isPinned) {
                      $regIdx++;
                    }
                  ?>
                    <tr class="hover:bg-slate-50/80 transition-colors <?= $isPinned ? 'bg-amber-50/40' : '' ?>">
                      <!-- 번호 -->
                      <td class="py-2.5 px-2 sm:px-3 text-center text-slate-400 font-mono text-xs sm:text-[13px]">
                        <?php if ($isPinned): ?>
                          <span class="inline-block px-1.5 py-0.5 rounded bg-amber-500 text-white font-extrabold text-[10px]">공지</span>
                        <?php else: ?>
                          <?= $seqNo ?>
                        <?php endif; ?>
                      </td>

                      <!-- 구분 -->
                      <td class="py-2.5 px-2 sm:px-2.5 text-center text-slate-600 text-xs sm:text-[13px] whitespace-nowrap font-medium">
                        [<?= htmlspecialchars($tagLabel) ?>]
                      </td>

                      <!-- 사진 -->
                      <td class="py-2 px-2 sm:px-2.5 text-center">
                        <a href="/forum/topic/<?= htmlspecialchars($q['id']) ?>" class="block w-16 h-14 sm:w-20 sm:h-16 mx-auto rounded-md overflow-hidden border border-slate-200 shadow-2xs hover:opacity-90 transition-opacity bg-slate-50 shrink-0">
                          <?php if (!empty($thumbUrl)): ?>
                            <img src="<?= htmlspecialchars($thumbUrl) ?>" alt="사진" class="w-full h-full object-cover">
                          <?php else: ?>
                            <div class="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-300">
                              <i class="fa-regular fa-image text-base"></i>
                            </div>
                          <?php endif; ?>
                        </a>
                      </td>

                      <!-- 제목 -->
                      <td class="py-2.5 px-3">
                        <div class="flex items-center gap-1.5 flex-wrap">
                          <a href="/forum/topic/<?= htmlspecialchars($q['id']) ?>" class="font-normal text-slate-700 hover:text-[#1B6FA8] transition-colors leading-snug text-xs sm:text-[14px]">
                            <?= forum_format_list_title($q['title']) ?>
                          </a>

                          <?php if ($isNewPost): ?>
                            <span class="inline-flex items-center justify-center w-3.5 h-3.5 text-[9px] font-bold text-white bg-amber-400 rounded-[2px] shrink-0" title="새 글">N</span>
                          <?php endif; ?>

                          <?php if ((int)($q['replyCount'] ?? 0) > 0): ?>
                            <span class="text-xs font-bold text-[#1B6FA8] font-mono">[<?= (int)$q['replyCount'] ?>]</span>
                          <?php endif; ?>
                        </div>
                      </td>

                      <!-- 가격 (Bold Red Text matching screenshot) -->
                      <td class="py-2.5 px-2 sm:px-3 text-center whitespace-nowrap">
                        <?php if (!empty($q['price'])): ?>
                          <span class="font-bold text-xs sm:text-[13px] text-red-600 block leading-tight">
                            <?= htmlspecialchars($q['price']) ?>
                          </span>
                        <?php else: ?>
                          <span class="text-slate-300 text-xs">-</span>
                        <?php endif; ?>
                      </td>

                      <!-- 작성자 -->
                      <td class="py-2.5 px-2 sm:px-3 text-center text-slate-700 text-xs sm:text-[13px] leading-tight">
                        <div class="font-medium truncate max-w-[120px] mx-auto"><?= htmlspecialchars($authorDisplayName) ?></div>
                        <?php if (!empty($authorUsername)): ?>
                          <div class="text-[11px] text-slate-400 font-normal truncate max-w-[120px] mx-auto">(<?= htmlspecialchars($authorUsername) ?>)</div>
                        <?php endif; ?>
                      </td>

                      <!-- 등록일 -->
                      <td class="py-2.5 px-2 sm:px-3 text-center text-slate-500 text-xs sm:text-[13px] font-mono whitespace-nowrap">
                        <?= $formattedDate ?>
                      </td>

                      <!-- 조회수 -->
                      <td class="py-2.5 px-2 sm:px-3 text-center text-slate-500 font-mono text-xs sm:text-[13px]">
                        <?= (int)($q['viewCount'] ?? 0) ?>
                      </td>
                    </tr>
                  <?php endforeach; ?>
                </tbody>
              </table>
            </div>

          <?php else: ?>
            
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr class="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                    <th class="py-3 px-3.5 text-center w-14">번호</th>
                    <?php if ($specialtyFilter === 'all' || empty($specialtyFilter)): ?>
                      <th class="py-3 px-2 sm:px-3 text-center w-20 sm:w-24">구분</th>
                    <?php endif; ?>
                    <th class="py-3 px-3">제목</th>
                    <th class="py-3 px-3 text-center w-28">작성자</th>
                    <th class="py-3 px-3 text-center w-20">공감</th>
                    <th class="py-3 px-3 text-center w-24">등록일</th>
                    <th class="py-3 px-3.5 text-center w-16">조회</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-medium">
                  <?php 
                  $regIdx = 0;
                  foreach ($displayQuestions as $q): 
                    $isPinned = !empty($q['isNotice']);
                    $hasPhotos = !empty($q['images']) && count($q['images']) > 0;
                    $itemSeq = $isPinned ? '공지' : ($totalRegular - $offset - $regIdx);
                    if (!$isPinned) {
                      $regIdx++;
                    }
                    $cObj = $q['category'] ?? null;
                    $cName = $cObj['name_ko'] ?? '자유게시판';
                  ?>
                    <tr class="hover:bg-slate-50/80 transition-colors <?= $isPinned ? 'bg-amber-50/40' : '' ?>">
                      <!-- 번호 / 공지 배지 -->
                      <td class="py-3 px-3.5 text-center text-slate-400 font-mono text-xs">
                        <?php if ($isPinned): ?>
                          <span class="inline-block px-1.5 py-0.5 rounded bg-amber-500 text-white font-extrabold text-[10px]">공지</span>
                        <?php else: ?>
                          <?= $itemSeq ?>
                        <?php endif; ?>
                      </td>

                      <!-- 구분 (전체 목록일 때 카테고리 표시) -->
                      <?php if ($specialtyFilter === 'all' || empty($specialtyFilter)): ?>
                        <td class="py-3 px-2 sm:px-3 text-center whitespace-nowrap">
                          <span class="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-[#1B6FA8]">
                            <?= htmlspecialchars($cName) ?>
                          </span>
                        </td>
                      <?php endif; ?>

                      <!-- 제목 + 댓글수 + 포토 아이콘 -->
                      <td class="py-3 px-3">
                        <div class="flex items-center gap-2 flex-wrap">
                          <?php if (!empty($q['price'])): ?>
                            <span class="text-[11px] font-black text-[#1B6FA8] bg-blue-50 px-1.5 py-0.2 rounded shrink-0">
                              <?= htmlspecialchars($q['price']) ?>
                            </span>
                          <?php endif; ?>

                          <a href="/forum/topic/<?= htmlspecialchars($q['id']) ?>" class="font-normal text-slate-700 hover:text-[#1B6FA8] transition-colors leading-snug text-xs sm:text-[14px]">
                            <?= forum_format_list_title($q['title']) ?>
                          </a>

                          <?php if ($hasPhotos): ?>
                            <span class="text-slate-400 text-[11px]" title="사진 첨부"><i class="fa-regular fa-image"></i></span>
                          <?php endif; ?>

                          <?php if ((int)$q['replyCount'] > 0): ?>
                            <span class="text-xs font-bold text-[#1B6FA8] font-mono">[<?= (int)$q['replyCount'] ?>]</span>
                          <?php endif; ?>
                        </div>
                      </td>

                      <!-- 작성자 -->
                      <td class="py-3 px-3 text-center text-slate-600 truncate max-w-[120px]">
                        <?= htmlspecialchars($q['authorName'] ?? '이웃') ?>
                      </td>

                      <!-- 공감 -->
                      <td class="py-3 px-3 text-center text-rose-500 font-bold font-mono">
                        <?= (int)($q['likeCount'] ?? 0) ?>
                      </td>

                      <!-- 등록일 -->
                      <td class="py-3 px-3 text-center text-slate-400 text-xs font-mono">
                        <?= substr($q['createdAt'] ?? '', 0, 10) ?>
                      </td>

                      <!-- 조회수 -->
                      <td class="py-3 px-3.5 text-center text-slate-400 font-mono">
                        <?= (int)$q['viewCount'] ?>
                      </td>
                    </tr>
                  <?php endforeach; ?>
                </tbody>
              </table>
            </div>

          <?php endif; ?>

        </div>

        <!-- Pagination Controls (1, 2, 3, 4, 5... Next) -->
        <?php if ($totalPages > 1): 
          $pageBaseUrl = function($p) use ($specialtyFilter, $subFilter, $sortFilter, $searchQuery) {
            $params = [];
            if (!empty($specialtyFilter)) $params['specialty'] = $specialtyFilter;
            if (!empty($subFilter)) $params['sub'] = $subFilter;
            if (!empty($sortFilter) && $sortFilter !== 'latest') $params['sort'] = $sortFilter;
            if (!empty($searchQuery)) $params['q'] = $searchQuery;
            if ($p > 1) $params['page'] = $p;
            return '/forum' . (!empty($params) ? '?' . http_build_query($params) : '');
          };
          $prevPage = max(1, $currentPage - 1);
          $nextPage = min($totalPages, $currentPage + 1);

          $startP = max(1, $currentPage - 2);
          $endP = min($totalPages, $startP + 4);
          if ($endP - $startP < 4) {
            $startP = max(1, $endP - 4);
          }
        ?>
          <div class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
            <div class="text-xs text-slate-500 font-medium order-2 sm:order-1">
              총 <span class="font-bold text-slate-800"><?= $totalRegular ?></span>개 글 (<?= $currentPage ?> / <?= $totalPages ?> 페이지)
            </div>

            <nav class="flex items-center gap-1.5 order-1 sm:order-2" aria-label="게시판 페이지 네비게이션">
              <!-- 이전 페이지 -->
              <?php if ($currentPage > 1): ?>
                <a href="<?= htmlspecialchars($pageBaseUrl($prevPage)) ?>" class="px-3 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-[#1B6FA8] hover:text-[#1B6FA8] font-bold text-xs flex items-center gap-1 transition-all shadow-2xs">
                  <i class="fa-solid fa-chevron-left text-[10px]"></i>
                  <span>이전</span>
                </a>
              <?php else: ?>
                <span class="px-3 h-9 rounded-xl bg-slate-100/70 border border-slate-200/60 text-slate-300 font-bold text-xs flex items-center gap-1 cursor-not-allowed">
                  <i class="fa-solid fa-chevron-left text-[10px]"></i>
                  <span>이전</span>
                </span>
              <?php endif; ?>

              <!-- 숫자 페이지 버튼들 -->
              <div class="flex items-center gap-1">
                <?php for ($p = $startP; $p <= $endP; $p++): ?>
                  <?php if ($p === $currentPage): ?>
                    <span class="w-9 h-9 rounded-xl bg-[#1B6FA8] text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-xs cursor-default">
                      <?= $p ?>
                    </span>
                  <?php else: ?>
                    <a href="<?= htmlspecialchars($pageBaseUrl($p)) ?>" class="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-[#1B6FA8] hover:text-[#1B6FA8] font-bold text-xs sm:text-sm flex items-center justify-center transition-all shadow-2xs">
                      <?= $p ?>
                    </a>
                  <?php endif; ?>
                <?php endfor; ?>
              </div>

              <!-- 다음 페이지 -->
              <?php if ($currentPage < $totalPages): ?>
                <a href="<?= htmlspecialchars($pageBaseUrl($nextPage)) ?>" class="px-3 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-[#1B6FA8] hover:text-[#1B6FA8] font-bold text-xs flex items-center gap-1 transition-all shadow-2xs">
                  <span>다음</span>
                  <i class="fa-solid fa-chevron-right text-[10px]"></i>
                </a>
              <?php else: ?>
                <span class="px-3 h-9 rounded-xl bg-slate-100/70 border border-slate-200/60 text-slate-300 font-bold text-xs flex items-center gap-1 cursor-not-allowed">
                  <span>다음</span>
                  <i class="fa-solid fa-chevron-right text-[10px]"></i>
                </span>
              <?php endif; ?>
            </nav>
          </div>
        <?php endif; ?>

        <?php 
          $isWantedSection = ($specialtyFilter === 'wanted' || ($currentCategory['id'] ?? '') === 'wanted' || strpos((string)$specialtyFilter, 'wanted_') === 0 || strpos((string)($activeSub ?? ''), 'wanted_') === 0);
          $isMarketSection = ($specialtyFilter === 'market' || ($currentCategory['id'] ?? '') === 'market');
        ?>
        <?php if ($isWantedSection): ?>
          <!-- Services Section Safety Tips Box -->
          <div class="mt-8 p-5 rounded-2xl bg-teal-50/80 border border-teal-200 text-xs sm:text-sm space-y-2.5">
            <div class="flex items-center gap-2 font-black text-teal-950 text-sm">
              <i class="fa-solid fa-shield-halved text-teal-600"></i>
              <span>생활·교육·커뮤니티 서비스 이용 안전 수칙</span>
            </div>
            <ul class="list-disc pl-5 space-y-1.5 text-teal-900 leading-relaxed text-xs sm:text-sm">
              <li><strong>선입금 주의:</strong> 서비스가 시작되거나 완료되기 전 터무니없는 전액 선입금 요구는 사기일 가능성이 높으니 주의하세요. 단계별 정산이나 작업 완료 후 정산을 권장합니다.</li>
              <li><strong>신원 및 조건 명확화:</strong> 과외·레슨, 심부름, 돌봄, 방문 도움 등 대면 서비스는 사전에 연락처, 구체적인 작업 범위, 보수 조건을 상호 명확히 합의하세요.</li>
              <li><strong>전문 자격 확인:</strong> 전문 면허나 자격(의료, 법률, 전문 시공, 운송 등)이 필요한 업무는 관련 자격 증명서를 사전에 직접 확인하시기 바랍니다.</li>
              <li><strong>신고 기능 활용:</strong> 의심스러운 게시글, 부당한 요구, 사기 정황은 게시글 상단의 '신고하기' 버튼으로 즉시 알려주세요.</li>
            </ul>
          </div>

          <!-- Services Section Disclaimer Card with Popup Trigger -->
          <div class="mt-4 p-5 rounded-2xl bg-white border border-teal-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-start sm:items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-base shrink-0">
                <i class="fa-solid fa-handshake-angle"></i>
              </div>
              <div>
                <h4 class="text-sm sm:text-base font-black text-slate-900">생활·교육·커뮤니티 서비스 이용약관 및 면책 안내 (Service Terms &amp; Disclaimer)</h4>
                <p class="text-xs text-slate-500 mt-0.5">회원 간 서비스 요청 및 제공 면책, 당사자 간 합의 책임, 안전 수칙 및 준거법 안내 전문을 팝업으로 확인하실 수 있습니다.</p>
              </div>
            </div>
            <button type="button" onclick="openServiceDisclaimerModal()" 
                    class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors shrink-0 cursor-pointer">
              <i class="fa-regular fa-file-lines"></i>
              <span>서비스 약관 및 면책 안내 전문 보기</span>
            </button>
          </div>
        <?php elseif ($isMarketSection): ?>
          <!-- Market Tips and Card -->
          <div class="mt-8 p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs sm:text-sm space-y-2.5">
            <div class="flex items-center gap-2 font-black text-amber-950 text-sm">
              <i class="fa-solid fa-shield-halved text-amber-600"></i>
              <span>안전 거래 팁</span>
            </div>
            <ul class="list-disc pl-5 space-y-1 text-amber-900 leading-relaxed text-xs sm:text-sm">
              <li>선입금을 요구하면 사기일 가능성이 높습니다. 물건을 받거나 서비스를 제공받기 전에는 송금하지 마세요.</li>
              <li>가급적 사람이 많은 공공장소에서 직거래 또는 대면 미팅을 진행하세요.</li>
              <li>시세를 미리 확인하고, 터무니없이 싼 가격이나 비정상적인 조건은 의심하세요.</li>
              <li>의심스러운 게시글은 게시글 상단의 '신고하기' 버튼으로 즉시 알려주세요.</li>
            </ul>
          </div>

          <!-- Bottom Compact Card with Popup Trigger -->
          <div class="mt-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-start sm:items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-base shrink-0">
                <i class="fa-solid fa-scale-balanced"></i>
              </div>
              <div>
                <h4 class="text-sm sm:text-base font-black text-slate-900">중고거래 이용약관 및 면책 안내 (Terms &amp; Disclaimer)</h4>
                <p class="text-xs text-slate-500 mt-0.5">회원 간 직거래 면책, 게시글 책임, 거래 주의사항 및 준거법 안내 전문을 팝업으로 확인하실 수 있습니다.</p>
              </div>
            </div>
            <button type="button" onclick="openMarketDisclaimerModal()" 
                    class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors shrink-0 cursor-pointer">
              <i class="fa-regular fa-file-lines"></i>
              <span>약관 및 면책 안내 전문 보기</span>
            </button>
          </div>
        <?php endif; ?>

      <?php endif; ?>

      <!-- Dynamic Section Safety & Policy Disclaimer Strip (At bottom of site) -->
      <?php render_forum_disclaimer_banner('mt-8', $specialtyFilter ?: ($currentCategory['id'] ?? 'community')); ?>

    </main>

  </div>

  <!-- Global Footer -->
  <?php render_forum_footer(); ?>

  <!-- Modals & Scripts -->
  <?php render_forum_modals(); ?>
  <?php render_forum_auth_scripts(); ?>

  <!-- Modal: 동호회/동문회 만들기 (Create Club Room Modal) -->
  <div id="createClubModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-fade-in my-8 max-h-[92vh] overflow-y-auto">
      <button type="button" onclick="closeCreateClubModal()" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <div class="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
        <span class="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg font-bold shadow-xs">
          <i class="fa-solid fa-people-roof"></i>
        </span>
        <div>
          <h3 class="text-lg sm:text-xl font-black text-slate-900">동호회 / 동문회 룸 개설하기</h3>
          <p class="text-xs text-slate-500">배너와 전용 게시판이 있는 미니 사이트 룸을 무료로 개설하고 방장이 되어보세요.</p>
        </div>
      </div>

      <form id="createClubForm" onsubmit="handleCreateClubSubmit(event)" class="space-y-4">
        
        <!-- 1. Room Name & Type -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-slate-700 mb-1">동호회/동문회 명칭 <span class="text-red-500">*</span></label>
            <input type="text" name="name" placeholder="예: 뉴저지 버겐 골프클럽, 고려대 교우회" required class="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">모임 분류 <span class="text-red-500">*</span></label>
            <select name="type" class="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-white" required>
              <option value="취미/스포츠">취미/스포츠</option>
              <option value="대학/고교 동문회">대학/고교 동문회</option>
              <option value="친목/소모임">친목/소모임</option>
              <option value="문화/예술">문화/예술</option>
              <option value="전문직/비즈니스">전문직/비즈니스</option>
              <option value="기타">기타 모임</option>
            </select>
          </div>
        </div>

        <!-- 2. Leader Info & Location -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">👑 방장 이름/닉네임 <span class="text-red-500">*</span></label>
            <input type="text" name="leader_name" placeholder="방장 닉네임" required class="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">방장 연락처/이메일 <span class="text-red-500">*</span></label>
            <input type="text" name="leader_contact" placeholder="이메일 또는 연락처" required class="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">방장 비밀번호(PIN) <span class="text-red-500">*</span></label>
            <input type="password" name="pin" maxlength="10" placeholder="4자리 숫자" required class="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500" title="글 작성 시 방장 인증용으로 사용됩니다">
          </div>
        </div>

        <!-- Location & Kakao Chat -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">주요 활동 지역 <span class="text-red-500">*</span></label>
            <input type="text" name="location" placeholder="예: 포트리 & 팰팍, 버겐카운티, 뉴저지 전역" required class="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">카카오톡 오픈채팅방 링크 (선택)</label>
            <input type="url" name="kakao_chat_url" placeholder="https://open.kakao.com/o/..." class="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
          </div>
        </div>

        <!-- One Liner & Description -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">한 줄 소개 <span class="text-red-500">*</span></label>
          <input type="text" name="one_liner" placeholder="회원들에게 보여질 대표 한 줄 소개 (최대 50자)" maxlength="80" required class="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">상세 소개 및 모임 규칙</label>
          <textarea name="description" rows="3" placeholder="모임 활동 취지, 정기 모임 주기, 회원 가입 조건 등을 적어주세요." class="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 leading-relaxed"></textarea>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">방장 환영 공지 (룸 상단에 표시)</label>
          <textarea name="notice" rows="2" placeholder="새로 들어온 회원들에게 전하는 환영 인사말" class="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 leading-relaxed"></textarea>
        </div>

        <!-- 3. TOP BANNER UPLOAD & DECORATION -->
        <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <i class="fa-solid fa-wand-magic-sparkles text-purple-600"></i>
              <span>룸 상단 배너 업로드 및 룸 꾸미기 (Decoration)</span>
            </span>
            <span class="text-[11px] text-slate-400">선택 사항</span>
          </div>

          <!-- Banner Image Upload -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">상단 와이드 배너 사진 업로드</label>
            <div class="flex items-center gap-3">
              <input type="file" id="clubBannerFileInput" accept="image/jpeg,image/png,image/webp" class="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer">
              <input type="hidden" name="banner_url" id="clubBannerUrlHidden" value="">
            </div>
            <div id="clubBannerPreviewBox" class="hidden mt-2 relative rounded-xl overflow-hidden h-24 border border-slate-200">
              <img id="clubBannerPreviewImg" src="" alt="배너 미리보기" class="w-full h-full object-cover">
              <span class="absolute bottom-1 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-bold">배너 적용됨</span>
            </div>
          </div>

          <!-- Room Decoration: Theme Color -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">룸 테마 색상 (Accent Color)</label>
            <input type="hidden" name="theme_color" id="clubThemeColorHidden" value="#7C3AED">
            <div class="flex items-center gap-2">
              <button type="button" onclick="selectClubThemeColor(this, '#7C3AED')" class="theme-color-btn w-7 h-7 rounded-full bg-[#7C3AED] ring-2 ring-purple-600 ring-offset-2 transition"></button>
              <button type="button" onclick="selectClubThemeColor(this, '#1B6FA8')" class="theme-color-btn w-7 h-7 rounded-full bg-[#1B6FA8] ring-0 transition"></button>
              <button type="button" onclick="selectClubThemeColor(this, '#059669')" class="theme-color-btn w-7 h-7 rounded-full bg-[#059669] ring-0 transition"></button>
              <button type="button" onclick="selectClubThemeColor(this, '#E11D48')" class="theme-color-btn w-7 h-7 rounded-full bg-[#E11D48] ring-0 transition"></button>
              <button type="button" onclick="selectClubThemeColor(this, '#D97706')" class="theme-color-btn w-7 h-7 rounded-full bg-[#D97706] ring-0 transition"></button>
              <button type="button" onclick="selectClubThemeColor(this, '#0F2342')" class="theme-color-btn w-7 h-7 rounded-full bg-[#0F2342] ring-0 transition"></button>
            </div>
          </div>

          <!-- Room Decoration: Emblem Icon -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">룸 엠블럼 아이콘</label>
            <input type="hidden" name="emblem" id="clubEmblemHidden" value="fa-users">
            <div class="flex flex-wrap items-center gap-2 text-xs">
              <button type="button" onclick="selectClubEmblem(this, 'fa-users')" class="emblem-btn px-2.5 py-1.5 rounded-xl border border-purple-600 bg-purple-50 text-purple-700 font-bold transition flex items-center gap-1">
                <i class="fa-solid fa-users"></i><span>친목</span>
              </button>
              <button type="button" onclick="selectClubEmblem(this, 'fa-golf-ball-tee')" class="emblem-btn px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-medium transition flex items-center gap-1">
                <i class="fa-solid fa-golf-ball-tee"></i><span>골프</span>
              </button>
              <button type="button" onclick="selectClubEmblem(this, 'fa-person-hiking')" class="emblem-btn px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-medium transition flex items-center gap-1">
                <i class="fa-solid fa-person-hiking"></i><span>등산</span>
              </button>
              <button type="button" onclick="selectClubEmblem(this, 'fa-graduation-cap')" class="emblem-btn px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-medium transition flex items-center gap-1">
                <i class="fa-solid fa-graduation-cap"></i><span>동문회</span>
              </button>
              <button type="button" onclick="selectClubEmblem(this, 'fa-futbol')" class="emblem-btn px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-medium transition flex items-center gap-1">
                <i class="fa-solid fa-futbol"></i><span>스포츠</span>
              </button>
              <button type="button" onclick="selectClubEmblem(this, 'fa-briefcase')" class="emblem-btn px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-medium transition flex items-center gap-1">
                <i class="fa-solid fa-briefcase"></i><span>비즈니스</span>
              </button>
              <button type="button" onclick="selectClubEmblem(this, 'fa-palette')" class="emblem-btn px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-medium transition flex items-center gap-1">
                <i class="fa-solid fa-palette"></i><span>문화예술</span>
              </button>
              <button type="button" onclick="selectClubEmblem(this, 'fa-baby')" class="emblem-btn px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-medium transition flex items-center gap-1">
                <i class="fa-solid fa-baby"></i><span>육아</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 4. Platform Safety Disclaimer Agreement -->
        <div class="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950">
          <label class="flex items-start gap-2 cursor-pointer font-bold leading-snug">
            <input type="checkbox" name="agree_terms" required class="mt-0.5 rounded text-amber-600 focus:ring-amber-500">
            <span>[필수] 동호회 자율 운영 규정 및 KACCESS 플랫폼 면책 조항에 동의합니다.</span>
          </label>
          <p class="text-[11px] text-amber-800 mt-1 pl-5 leading-relaxed">
            본 룸은 방장 자율 운영 모임이며, 회비 징수, 사적 거래, 오프라인 활동 시 사고에 대해 NJ Access Portal은 법적 책임을 지지 않습니다. 사기, 불법 행위, 상업적 스팸 적발 시 룸은 즉각 제재(Flagged) 및 폐쇄 처리됩니다.
          </p>
        </div>

        <div class="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
          <button type="button" onclick="closeCreateClubModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition">
            취소
          </button>
          <button type="submit" id="btnSubmitClubCreate" class="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md transition transform active:scale-95">
            동호회/동문회 룸 개설하기
          </button>
        </div>
      </form>
    </div>
  </div>

  <script>
    function openCreateClubModal() {
      document.getElementById('createClubModal').classList.remove('hidden');
    }
    function closeCreateClubModal() {
      document.getElementById('createClubModal').classList.add('hidden');
    }

    function selectClubThemeColor(btn, color) {
      document.getElementById('clubThemeColorHidden').value = color;
      document.querySelectorAll('.theme-color-btn').forEach(b => {
        b.classList.remove('ring-2', 'ring-purple-600', 'ring-offset-2');
        b.classList.add('ring-0');
      });
      btn.classList.remove('ring-0');
      btn.classList.add('ring-2', 'ring-purple-600', 'ring-offset-2');
    }

    function selectClubEmblem(btn, emblem) {
      document.getElementById('clubEmblemHidden').value = emblem;
      document.querySelectorAll('.emblem-btn').forEach(b => {
        b.classList.remove('border-purple-600', 'bg-purple-50', 'text-purple-700', 'font-bold');
        b.classList.add('border-slate-200', 'bg-white', 'text-slate-600', 'font-medium');
      });
      btn.classList.remove('border-slate-200', 'bg-white', 'text-slate-600', 'font-medium');
      btn.classList.add('border-purple-600', 'bg-purple-50', 'text-purple-700', 'font-bold');
    }

    // Banner file upload handler
    document.getElementById('clubBannerFileInput')?.addEventListener('change', async function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('banner', file);

      try {
        const res = await fetch('/api/forum.php?action=upload_club_banner', {
          method: 'POST',
          body: formData
        });
        const json = await res.json();
        if (json.success && json.url) {
          document.getElementById('clubBannerUrlHidden').value = json.url;
          const box = document.getElementById('clubBannerPreviewBox');
          document.getElementById('clubBannerPreviewImg').src = json.url;
          box.classList.remove('hidden');
        } else {
          alert(json.error || '배너 업로드에 실패했습니다.');
        }
      } catch (err) {
        alert('배너 업로드 통신 오류가 발생했습니다.');
      }
    });

    // Create room submission
    async function handleCreateClubSubmit(e) {
      e.preventDefault();
      const form = e.target;
      const btn = document.getElementById('btnSubmitClubCreate');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 룸 개설 중...';

      const formData = new FormData(form);
      const payload = {
        name: formData.get('name'),
        type: formData.get('type'),
        leader_name: formData.get('leader_name'),
        leader_contact: formData.get('leader_contact'),
        pin: formData.get('pin'),
        location: formData.get('location'),
        kakao_chat_url: formData.get('kakao_chat_url') || '',
        one_liner: formData.get('one_liner'),
        description: formData.get('description') || '',
        notice: formData.get('notice') || '',
        banner_url: formData.get('banner_url') || '',
        theme_color: formData.get('theme_color') || '#7C3AED',
        emblem: formData.get('emblem') || 'fa-users'
      };

      try {
        const res = await fetch('/api/forum.php?action=create_club_room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success && json.roomId) {
          alert('축하합니다! 동호회/동문회 룸이 개설되었습니다. 룸으로 이동합니다.');
          window.location.href = '/forum/club.php?id=' + encodeURIComponent(json.roomId);
        } else {
          alert(json.error || '룸 개설에 실패했습니다.');
          btn.disabled = false;
          btn.innerHTML = '동호회/동문회 룸 개설하기';
        }
      } catch (err) {
        alert('서버 통신 오류가 발생했습니다.');
        btn.disabled = false;
        btn.innerHTML = '동호회/동문회 룸 개설하기';
      }
    }
  </script>

  <script>
    // Tab Switching for MissyUSA Center Section Blocks
    function switchHomeTab(tabId) {
      document.querySelectorAll('.home-tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.home-tab-pane').forEach(p => p.classList.add('hidden'));

      const activeBtn = document.getElementById('htab-' + tabId);
      const activePane = document.getElementById('pane-' + tabId);

      if (activeBtn) activeBtn.classList.add('active');
      if (activePane) activePane.classList.remove('hidden');
    }

    // Tab Switching for Right Sidebar Rankings (조회순 / 공감순 / 댓글순)
    function switchRankTab(type) {
      document.querySelectorAll('.sidebar-rank-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.rank-pane').forEach(p => p.classList.add('hidden'));

      const b = document.getElementById('rtab-' + type);
      const p = document.getElementById('rpane-' + type);

      if (b) b.classList.add('active');
      if (p) p.classList.remove('hidden');
    }

    function toggleForumSidebar() {
      const sb = document.getElementById('forum-sidebar');
      const bd = document.getElementById('sidebar-backdrop');
      if (!sb) return;

      const isOpen = sb.classList.contains('sidebar-open');
      if (isOpen) {
        sb.classList.remove('sidebar-open');
        sb.classList.add('sidebar-closed');
        if (bd) bd.classList.add('hidden');
      } else {
        sb.classList.remove('sidebar-closed');
        sb.classList.add('sidebar-open');
        if (bd) bd.classList.remove('hidden');
      }
    }
  </script>
</body>
</html>
