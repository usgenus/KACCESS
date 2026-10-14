<?php
require_once __DIR__ . '/../api/forum_db.php';
require_once __DIR__ . '/components.php';

$id = trim($_GET['id'] ?? '');
if (!$id) {
    header('Location: /forum');
    exit;
}

$question = forum_get_question($id, true);
if (!$question || (($question['status'] ?? '') === 'hidden')) {
    header('Location: /forum');
    exit;
}

$categories = forum_get_categories();
$catInfo = forum_map_specialty_to_category($question['specialtyId'] ?? '', $question['subBoardId'] ?? null);
$category = forum_get_category_by_id($catInfo['categoryId']) ?: forum_get_category_by_id('community');
$allSubs = forum_get_sub_boards();
$subBoard = null;
if (!empty($catInfo['subBoardId']) && !empty($allSubs[$catInfo['categoryId']])) {
    foreach ($allSubs[$catInfo['categoryId']] as $sb) {
        if ($sb['id'] === $catInfo['subBoardId']) {
            $subBoard = $sb;
            break;
        }
    }
}
$subSpecialty = !empty($catInfo['subSpecialtyId']) ? forum_get_sub_specialty_by_id($catInfo['subSpecialtyId']) : null;
$specialty = $category;

$relatedQuestions = forum_get_questions($category['id'] ?? '', 'popular', '', 'active', $catInfo['subBoardId'] ?? '');
$relatedQuestions = array_values(array_filter($relatedQuestions, fn($q) => $q['id'] !== $id));
$relatedQuestions = array_slice($relatedQuestions, 0, 4);

$isQuestionClinician = !empty($question['authorBadge']) && str_contains($question['authorBadge'], 'Clinician');
$isProfessionalCategory = in_array($question['category'] ?? '', ['medical', 'columns']) || !empty($question['isProfessionalListing']);
$answersHeadingTitle = $isProfessionalCategory ? '전문가 답변' : '댓글';

$cleanBodyText = preg_replace('/\s+/', ' ', trim(strip_tags($question['body'])));
$cleanTitleText = trim(strip_tags($question['title']));
$seoDesc = mb_substr($cleanBodyText, 0, 155, 'UTF-8') . (mb_strlen($cleanBodyText, 'UTF-8') > 155 ? '...' : '');
$topicUrl = 'https://njaccessportal.com/forum/topic/' . urlencode($question['id']);
$coverImage = !empty($question['images'][0]) ? (str_starts_with($question['images'][0], 'http') ? $question['images'][0] : 'https://njaccessportal.com/' . ltrim($question['images'][0], '/')) : 'https://njaccessportal.com/logo-icon.svg';
$pubDate = date('c', strtotime($question['createdAt'] ?? 'now'));
$modDate = date('c', strtotime($question['updatedAt'] ?? ($question['createdAt'] ?? 'now')));

// Prepare answers for QAPage & DiscussionForumPosting
$activeAnswers = array_values(array_filter($question['answers'] ?? [], fn($a) => ($a['status'] ?? 'active') === 'active'));
$acceptedAnswerObj = null;
$suggestedAnswerObjs = [];

foreach ($activeAnswers as $ans) {
    $isClin = !empty($ans['authorBadge']) && str_contains($ans['authorBadge'], 'Clinician');
    $cleanAnsText = preg_replace('/\s+/', ' ', trim(strip_tags($ans['body'])));
    $ansItem = [
        '@type' => 'Answer',
        'text' => $cleanAnsText,
        'dateCreated' => date('c', strtotime($ans['createdAt'] ?? 'now')),
        'upvoteCount' => (int)($ans['upvotes'] ?? 0),
        'url' => $topicUrl . '#ans-' . urlencode($ans['id']),
        'author' => [
            '@type' => 'Person',
            'name' => $ans['authorName'] ?? '답변자',
            'jobTitle' => $isClin ? ($ans['clinicianTitle'] ?? '공인 전문의') : '포럼 참여자',
            'url' => $topicUrl . '#ans-' . urlencode($ans['id'])
        ]
    ];
    if ($isClin && !$acceptedAnswerObj) {
        $acceptedAnswerObj = $ansItem;
    } else {
        $suggestedAnswerObjs[] = $ansItem;
    }
}

// Question schema entity
$questionEntity = [
    '@type' => 'Question',
    'name' => $cleanTitleText,
    'text' => $cleanBodyText,
    'answerCount' => count($activeAnswers),
    'upvoteCount' => (int)($question['replyCount'] ?? 0),
    'dateCreated' => $pubDate,
    'dateModified' => $modDate,
    'author' => [
        '@type' => 'Person',
        'name' => $question['authorName'] ?? '포럼 회원',
        'url' => $topicUrl
    ]
];
if ($acceptedAnswerObj) {
    $questionEntity['acceptedAnswer'] = $acceptedAnswerObj;
}
if (!empty($suggestedAnswerObjs)) {
    $questionEntity['suggestedAnswer'] = $suggestedAnswerObjs;
}

// BreadcrumbList schema
$breadcrumbList = [
    '@context' => 'https://schema.org',
    '@type' => 'BreadcrumbList',
    'itemListElement' => [
        [
            '@type' => 'ListItem',
            'position' => 1,
            'name' => '홈',
            'item' => 'https://njaccessportal.com/'
        ],
        [
            '@type' => 'ListItem',
            'position' => 2,
            'name' => '뉴저지 한인 광장',
            'item' => 'https://njaccessportal.com/forum'
        ]
    ]
];
$bPos = 3;
if ($category) {
    $breadcrumbList['itemListElement'][] = [
        '@type' => 'ListItem',
        'position' => $bPos++,
        'name' => $category['name_ko'],
        'item' => 'https://njaccessportal.com/forum?specialty=' . urlencode($category['id'])
    ];
}
if ($subSpecialty) {
    $breadcrumbList['itemListElement'][] = [
        '@type' => 'ListItem',
        'position' => $bPos++,
        'name' => $subSpecialty['name_ko'],
        'item' => 'https://njaccessportal.com/forum?specialty=medical_health&sub=' . urlencode($subSpecialty['id'])
    ];
}
$breadcrumbList['itemListElement'][] = [
    '@type' => 'ListItem',
    'position' => $bPos,
    'name' => $cleanTitleText,
    'item' => $topicUrl
];

// DiscussionForumPosting Schema (Google Search forum feature support)
$forumPostingSchema = [
    '@context' => 'https://schema.org',
    '@type' => 'DiscussionForumPosting',
    'headline' => $cleanTitleText,
    'articleBody' => $cleanBodyText,
    'datePublished' => $pubDate,
    'dateModified' => $modDate,
    'mainEntityOfPage' => $topicUrl,
    'author' => [
        '@type' => 'Person',
        'name' => $question['authorName'] ?? '포럼 회원',
        'url' => $topicUrl
    ],
    'keywords' => [
        '한인포럼',
        '뉴저지 한인포럼',
        '한인광장',
        '뉴저지 한인광장',
        '의료점보센터',
        '의료정보센터',
        '의료접근센터',
        'healthcare access center',
        'korean portal',
        'healthcare resource center',
        '한인 의료',
        '한인 의사',
        '한인 병원'
    ],
    'publisher' => [
        '@type' => 'Organization',
        'name' => '뉴저지 한인포럼 · 뉴저지 한인광장 (NJ Access Portal)',
        'url' => 'https://njaccessportal.com/forum'
    ],
    'interactionStatistic' => [
        [
            '@type' => 'InteractionCounter',
            'interactionType' => 'https://schema.org/CommentAction',
            'userInteractionCount' => count($activeAnswers)
        ],
        [
            '@type' => 'InteractionCounter',
            'interactionType' => 'https://schema.org/ReadAction',
            'userInteractionCount' => (int)($question['viewCount'] ?? 1)
        ]
    ]
];
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($cleanTitleText) ?> | 한인 의료 접근센터 (Healthcare Access Center)</title>
  <meta name="description" content="<?= htmlspecialchars($seoDesc) ?>" />
  <meta name="keywords" content="<?= htmlspecialchars($category['name_ko'] ?? '건강 Q&A') ?>, <?= htmlspecialchars($subSpecialty['name_ko'] ?? '') ?>, 한인 의료 접근센터, 한인 의료접근센터, 한인의료접근센터, 뉴저지 한인 의료 접근센터, 한인포럼, 뉴저지 한인포럼, 한인광장, 뉴저지 한인광장, 의료정보센터, 의료점보센터, 의료접근센터, healthcare access center, korean portal, healthcare resource center, 한인 의료, 한인 의사, 한인 병원, 건강 포럼, 뉴저지 한인 병원 후기, 메디케어, 메디케이드" />
  
  <!-- Directives for Googlebot & Web Crawlers -->
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <link rel="canonical" href="https://njaccessportal.com/forum/topic/<?= htmlspecialchars($id) ?>" />

  <!-- OpenGraph / Social Media -->
  <meta property="og:site_name" content="한인 의료 접근센터 · Healthcare Access Center · 뉴저지 한인포럼" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="<?= htmlspecialchars($cleanTitleText) ?>" />
  <meta property="og:description" content="<?= htmlspecialchars($seoDesc) ?>" />
  <meta property="og:url" content="<?= htmlspecialchars($topicUrl) ?>" />
  <meta property="og:image" content="<?= htmlspecialchars($coverImage) ?>" />
  <meta property="article:published_time" content="<?= htmlspecialchars($pubDate) ?>" />
  <meta property="article:modified_time" content="<?= htmlspecialchars($modDate) ?>" />
  <meta property="article:section" content="<?= htmlspecialchars($category['name_ko'] ?? '건강 Q&A') ?>" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="<?= htmlspecialchars($cleanTitleText) ?>" />
  <meta name="twitter:description" content="<?= htmlspecialchars($seoDesc) ?>" />
  <meta name="twitter:image" content="<?= htmlspecialchars($coverImage) ?>" />

  <!-- Schema.org JSON-LD Structured Data: Google QAPage, DiscussionForumPosting & Breadcrumbs -->
  <script type="application/ld+json">
  <?= json_encode([
      '@context' => 'https://schema.org',
      '@type' => 'QAPage',
      'mainEntity' => $questionEntity
  ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) ?>
  </script>

  <script type="application/ld+json">
  <?= json_encode($forumPostingSchema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) ?>
  </script>

  <script type="application/ld+json">
  <?= json_encode($breadcrumbList, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) ?>
  </script>

  <link rel="icon" href="/favicon.ico">
  
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/_next/static/chunks/1fosv8xgmgdeu.css" />
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
    .touch-target {
      min-height: 48px;
    }
    /* Compact Author Spacing for Maximum Content Visibility (1 line spacing default) */
    .prose.whitespace-pre-line {
      margin-top: 0 !important;
      padding-top: 0 !important;
    }
    .prose.whitespace-pre-line > *:first-child {
      margin-top: 0 !important;
    }
  </style>
</head>
<body class="bg-[#F8FAFC] text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">

  <!-- Top Global Header -->
  <?php render_forum_header('', $category); ?>

  <!-- Main Forum Layout: Sidebar + Thread Content -->
  <div class="flex-1 flex w-full max-w-[1600px] mx-auto">
    
    <!-- Left Sidebar -->
    <?php render_forum_sidebar($categories, $category['id'] ?? '', 'latest', 'topics'); ?>

    <!-- Main Content Area -->
    <main class="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">

      <!-- Top Breadcrumbs & Back Bar -->
      <div class="flex items-center justify-between gap-4 mb-4 text-xs sm:text-sm font-bold text-slate-500 flex-wrap">
        <div class="flex items-center gap-2 flex-wrap">
          <a href="/forum" class="hover:text-[#1B6FA8] transition-colors">포럼 홈</a>
          <span class="text-slate-300">/</span>
          <a href="/forum?specialty=<?= urlencode($category['id'] ?? '') ?>" 
             class="hover:text-[#1B6FA8] transition-colors">
            <?= htmlspecialchars($category['name_ko'] ?? '게시판') ?>
          </a>
          <?php if (!empty($subBoard)): ?>
            <span class="text-slate-300">/</span>
            <a href="/forum?specialty=<?= urlencode($category['id'] ?? '') ?>&sub=<?= urlencode($subBoard['id']) ?>"
               class="text-[#1B6FA8] hover:underline transition-colors">
              <?= htmlspecialchars($subBoard['name_ko']) ?>
            </a>
          <?php endif; ?>
          <?php if (!empty($subSpecialty)): ?>
            <span class="text-slate-300">/</span>
            <span class="text-slate-600 font-medium">
              <?= htmlspecialchars($subSpecialty['name_ko']) ?>
            </span>
          <?php endif; ?>
        </div>
        <span class="text-slate-400 font-normal">
          작성일: <?= date('Y.m.d H:i', strtotime($question['createdAt'] ?? 'now')) ?>
        </span>
      </div>

      <!-- Thread Header Banner -->
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-2.5 flex-wrap">
          <?php if ($category): ?>
            <a href="/forum?specialty=<?= urlencode($category['id']) ?>" 
               class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl border bg-white text-slate-800 shadow-2xs hover:border-[#1B6FA8] transition-colors">
              <span><?= htmlspecialchars($category['name_ko']) ?></span>
            </a>
          <?php endif; ?>

          <?php if (!empty($subBoard)): ?>
            <a href="/forum?specialty=<?= urlencode($category['id']) ?>&sub=<?= urlencode($subBoard['id']) ?>"
               class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl border border-blue-200 bg-blue-50 text-[#1B6FA8] shadow-2xs hover:bg-blue-100 transition-colors">
              <span><?= htmlspecialchars($subBoard['name_ko']) ?></span>
            </a>
          <?php endif; ?>

          <?php if (!empty($subSpecialty)): ?>
            <span class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl border border-slate-200 bg-slate-100 text-slate-700">
              <span><?= htmlspecialchars($subSpecialty['name_ko']) ?></span>
            </span>
          <?php endif; ?>

          <?php if (!empty($question['tags'])): ?>
            <?php foreach ($question['tags'] as $tag): ?>
              <a href="/forum?specialty=<?= urlencode($category['id'] ?? '') ?>&q=<?= urlencode($tag) ?>" 
                 class="text-xs bg-slate-100 hover:bg-blue-50 hover:text-[#1B6FA8] text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200/80 transition-colors font-medium">
                #<?= htmlspecialchars($tag) ?>
              </a>
            <?php endforeach; ?>
          <?php endif; ?>
        </div>

        <h1 class="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug">
          <?= htmlspecialchars($question['title'] ?? '') ?>
        </h1>

        <?php 
          $isMarket = ($question['categoryId'] ?? '') === 'market';
          $isWanted = ($question['categoryId'] ?? '') === 'wanted';
          $isEvents = ($question['categoryId'] ?? '') === 'events';
          $hasLocation = !empty($question['location']);
          
          $hasRating = isset($question['rating']) && $question['rating'] !== null && $question['rating'] !== '';
          if (!$hasRating && (in_array($question['categoryId'] ?? '', ['food', 'restaurants']) || ($question['subBoardId'] ?? '') === 'medical_reviews' || strpos($question['title'] ?? '', '후기') !== false)) {
              $hasRating = true;
              $question['rating'] = 9.5;
          }
          $ratingVal = $hasRating ? floatval($question['rating']) : null;
          if ($ratingVal !== null) {
              $ratingVal = max(0, min(10, $ratingVal)); // 0 to 10 scale
          }
        ?>

        <?php if ($isMarket || $isWanted): ?>
          <?php if ($isWanted): ?>
            <!-- Wanted Top Banner: Dedicated Service Liability & Precautions Banner -->
            <div class="mt-4 p-4 rounded-2xl bg-teal-50/90 border border-teal-200/90 text-xs text-teal-950 leading-relaxed shadow-2xs">
              <div class="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                <div class="flex items-center gap-1.5 font-black text-teal-950 text-xs sm:text-sm">
                  <i class="fa-solid fa-shield-halved text-teal-600"></i>
                  <span>생활·교육·커뮤니티 서비스 이용 주의 및 면책 안내</span>
                </div>
                <button type="button" onclick="openServiceDisclaimerModal()" class="text-[11px] font-bold text-teal-800 underline hover:text-black cursor-pointer">
                  서비스 약관 및 면책 안내 전문 보기 →
                </button>
              </div>
              <p class="text-teal-900 text-xs leading-relaxed">
                뉴저지 한인 광장 서비스는 회원 상호 간 맞춤 생활 도움, 과외·교육, 심부름 및 커뮤니티 소통을 위한 자율 정보 공간입니다. NJ Access Portal은 서비스의 당사자 또는 고용주가 아니며, 업무 조건·자격·안전을 보증하지 않습니다. 당사자 간 계약 불이행, 금전 거래, 사고, 분쟁, 손해에 대해 당사는 법적 책임을 지지 않습니다.
              </p>
            </div>
          <?php else: ?>
            <!-- Marketplace Top Banner: Compact Liability Disclaimer -->
            <div class="mt-4 p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-xs text-amber-900 leading-relaxed shadow-2xs">
              <div class="flex items-center justify-between gap-2 mb-1">
                <div class="flex items-center gap-1.5 font-black text-amber-950 text-xs">
                  <i class="fa-solid fa-triangle-exclamation text-amber-600"></i>
                  <span>거래 주의 안내</span>
                </div>
                <button type="button" onclick="openMarketDisclaimerModal()" class="text-[11px] font-bold text-amber-900 underline hover:text-black cursor-pointer">
                  약관 및 면책 안내 전문 보기
                </button>
              </div>
              <p>
                뉴저지 한인 광장 중고거래는 회원 간 직거래를 위한 게시판입니다. NJ Access Portal은 거래의 당사자가 아니며, 게시글의 진위·상품 상태·거래 안전을 보증하지 않습니다. 금전 거래, 사기, 분쟁, 손해에 대해 당사는 책임을 지지 않습니다.
              </p>
            </div>
          <?php endif; ?>

          <!-- Unified Specs & Contact Bar (Everything in One Space) -->
          <?php
            $rawMethods = $question['contactMethods'] ?? ($question['contact_methods'] ?? ['email']);
            if (is_string($rawMethods)) {
              $decodedMethods = json_decode($rawMethods, true);
              $rawMethods = is_array($decodedMethods) ? $decodedMethods : explode(',', $rawMethods);
            }
            $activeMethods = is_array($rawMethods) ? array_map('trim', $rawMethods) : ['email'];
            if (empty($activeMethods)) $activeMethods = ['email'];
            
            $isPhoneVisible = !empty($question['phoneVisible']) && !empty($question['contactPhone']);
            $rawPhone = $isPhoneVisible ? trim((string)$question['contactPhone']) : '';
            $telDigits = preg_replace('/[^\d\+]/', '', $rawPhone);
          ?>
          <div class="mt-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            <!-- Left: Specs (Location, Price, Condition) -->
            <div class="flex items-center gap-4 sm:gap-6 flex-wrap text-xs sm:text-sm">
              <?php if ($hasLocation): ?>
                <div class="flex items-center gap-1.5">
                  <span class="text-slate-400 text-xs font-bold">위치:</span>
                  <span class="font-extrabold text-slate-800 flex items-center gap-1">
                    <i class="fa-solid fa-location-dot text-red-500 text-xs"></i>
                    <?= htmlspecialchars($question['location']) ?>
                  </span>
                </div>
              <?php endif; ?>

              <?php if (!empty($question['price'])): ?>
                <div class="flex items-baseline gap-1.5">
                  <span class="<?= $isWanted ? 'text-teal-700' : 'text-slate-400' ?> text-xs font-bold"><?= $isWanted ? '희망 보수 / 예산:' : '가격:' ?></span>
                  <span class="font-black text-base <?= $isWanted ? 'text-teal-800' : 'text-[#1B6FA8]' ?>"><?= htmlspecialchars($question['price']) ?></span>
                </div>
              <?php endif; ?>

              <?php if (!empty($question['itemCondition'])): ?>
                <div class="flex items-baseline gap-1.5">
                  <span class="<?= $isWanted ? 'text-teal-700' : 'text-slate-400' ?> text-xs font-bold"><?= $isWanted ? '희망 일정 / 조건:' : '상태 / 조건:' ?></span>
                  <span class="font-bold text-slate-700"><?= htmlspecialchars($question['itemCondition']) ?></span>
                </div>
              <?php endif; ?>
            </div>

            <!-- Right: Contact / Reply Buttons -->
            <div class="flex items-center gap-2 flex-wrap shrink-0 pt-2.5 md:pt-0 border-t md:border-t-0 border-slate-100">
              <!-- 1. 전화 걸기 (전화 활성화 & 번호공개 시에만 노출) -->
              <?php if (in_array('tel', $activeMethods) && $isPhoneVisible && !empty($telDigits)): ?>
                <a href="tel:<?= htmlspecialchars($telDigits) ?>" 
                   class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-xs transition-colors">
                  <i class="fa-solid fa-phone text-xs"></i>
                  <span>전화 걸기</span>
                </a>
              <?php endif; ?>

              <!-- 2. 문자 보내기 (문자 활성화 & 번호공개 시에만 노출) -->
              <?php if (in_array('sms', $activeMethods) && $isPhoneVisible && !empty($telDigits)): ?>
                <a href="sms:<?= htmlspecialchars($telDigits) ?>" 
                   class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs sm:text-sm shadow-xs transition-colors">
                  <i class="fa-solid fa-comment-sms text-xs"></i>
                  <span>문자 보내기</span>
                </a>
              <?php endif; ?>

              <!-- 3. 이메일 보내기 (모달을 통해 안전 발송, 이메일 주소 비노출) -->
              <?php if (in_array('email', $activeMethods)): ?>
                <button type="button" onclick="openMarketEmailModal()" 
                        class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1B6FA8] hover:bg-[#155A8A] text-white font-extrabold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer">
                  <i class="fa-solid fa-envelope text-xs"></i>
                  <span>이메일 보내기</span>
                </button>
              <?php endif; ?>

              <!-- 4. 신고하기 (모든 리스팅 상시 노출) -->
              <button type="button" onclick="openMarketReportModal()" 
                      class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-xs sm:text-sm shadow-2xs transition-colors cursor-pointer"
                      title="허위 매물 또는 사기 의심 신고">
                <i class="fa-solid fa-flag text-red-600 text-xs"></i>
                <span>신고하기</span>
              </button>
            </div>
          </div>
        <?php elseif ($hasLocation || $ratingVal !== null || ($isEvents && !empty($question['price']))): ?>
          <!-- Other Boards Specs Bar (Food, Events, Reviews, etc.) -->
          <div class="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div class="flex items-center gap-5 sm:gap-6 flex-wrap">
              <?php if ($hasLocation): ?>
                <div class="flex items-center gap-1.5">
                  <span class="text-slate-400 text-xs font-bold">위치:</span>
                  <span class="font-extrabold text-slate-800 flex items-center gap-1">
                    <i class="fa-solid fa-location-dot text-red-500"></i>
                    <?= htmlspecialchars($question['location']) ?>
                  </span>
                </div>
              <?php endif; ?>

              <?php if ($ratingVal !== null): ?>
                <div class="flex items-center gap-2">
                  <span class="text-slate-400 text-xs font-bold">만족도 평점:</span>
                  <div class="flex items-center gap-1.5">
                    <div class="flex items-center text-amber-400 text-xs tracking-tight" title="<?= number_format($ratingVal, 1) ?> / 10점 (10점 최고 ⭐ / 0점 최악)">
                      <?php for ($s = 1; $s <= 10; $s++): ?>
                        <?php if ($s <= floor($ratingVal)): ?>
                          <i class="fa-solid fa-star"></i>
                        <?php elseif ($s - 0.5 <= $ratingVal): ?>
                          <i class="fa-solid fa-star-half-stroke"></i>
                        <?php else: ?>
                          <i class="fa-regular fa-star text-slate-300"></i>
                        <?php endif; ?>
                      <?php endfor; ?>
                    </div>
                    <span class="font-black text-amber-600 text-xs sm:text-sm">
                      <?= number_format($ratingVal, ($ratingVal == intval($ratingVal) ? 0 : 1)) ?><span class="text-slate-400 text-[11px] font-normal"> / 10점</span>
                    </span>
                    <?php if ($ratingVal >= 9.5): ?>
                      <span class="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded">최고 (Best)</span>
                    <?php elseif ($ratingVal <= 2.0): ?>
                      <span class="text-[10px] bg-slate-200 text-slate-600 font-extrabold px-1.5 py-0.5 rounded">최악 (Worst)</span>
                    <?php endif; ?>
                  </div>
                </div>
              <?php endif; ?>

              <?php if ($isEvents && !empty($question['price'])): ?>
                <div>
                  <span class="text-slate-400 text-[11px] block font-bold">참가비</span>
                  <span class="font-bold text-sm text-slate-800"><?= htmlspecialchars($question['price']) ?></span>
                </div>
              <?php endif; ?>
            </div>
          </div>
        <?php endif; ?>
      </div>

      <!-- Two-Column Thread Grid (Main Posts + Right Sidebar on Desktop) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Left Column: Posts Stream (8 cols) -->
        <div class="lg:col-span-8 space-y-6">
          
          <!-- Original Post (Question Card) -->
          <article class="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs relative">
            
            <!-- Author Header -->
            <div class="flex items-center justify-between gap-4 pb-2 mb-2.5 border-b border-slate-100">
              <div class="flex items-center gap-3">
                <img src="<?= htmlspecialchars(forum_sanitize_avatar($question['authorAvatar'] ?? '', $question['authorName'] ?? '', $question['authorBadge'] ?? '')) ?>" 
                     alt="<?= htmlspecialchars($question['authorName'] ?? '작성자') ?>" 
                     class="w-9 h-9 rounded-full object-cover border border-slate-200" />
                <div>
                  <div class="font-bold text-sm text-slate-900 flex items-center gap-1.5 leading-tight">
                    <span><?= htmlspecialchars($question['authorName'] ?? '익명') ?></span>
                    <?php if ($isQuestionClinician): ?>
                      <span class="text-[10px] bg-[#1B6FA8] text-white font-extrabold px-2 py-0.5 rounded-full"><?= htmlspecialchars($question['authorBadgeLabel'] ?? '공인 전문가') ?></span>
                    <?php endif; ?>
                  </div>
                  <p class="text-xs text-slate-400 mt-0.5 leading-none"><?= date('Y-m-d H:i', strtotime($question['createdAt'] ?? 'now')) ?></p>
                </div>
              </div>

              <div class="text-right text-xs text-slate-400 font-mono">
                <span>#1</span>
              </div>
            </div>

            <!-- Question Body -->
            <div class="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans mb-4 mt-0 pt-0"><?= htmlspecialchars(preg_replace('/^[\r\n\s]+/', '', $question['body'] ?? '')) ?></div>

            <!-- Attached Video Display -->
            <?php 
              $videoUrl = $question['videoUrl'] ?? '';
              // Also auto-detect YouTube link in body if videoUrl is not explicitly set
              if (empty($videoUrl) && !empty($question['body'])) {
                if (preg_match('/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\s]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i', $question['body'], $bm)) {
                  $videoUrl = $bm[0];
                }
              }
              if (!empty($videoUrl)): 
                $ytId = '';
                if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i', $videoUrl, $m)) {
                  $ytId = $m[1];
                }
            ?>
              <div class="mt-5 mb-5 p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-slate-50/70">
                <div class="flex items-center gap-2 mb-2.5 text-xs font-bold text-slate-800">
                  <i class="fa-brands fa-youtube text-red-600 text-base"></i>
                  <span>동영상 재생</span>
                </div>
                <?php if ($ytId): ?>
                  <div class="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-300 shadow-sm bg-black">
                    <iframe class="w-full h-full" src="https://www.youtube-nocookie.com/embed/<?= htmlspecialchars($ytId) ?>" title="YouTube 비디오 플레이어" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                  </div>
                <?php else: ?>
                  <a href="<?= htmlspecialchars($videoUrl) ?>" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3.5 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 transition-all text-slate-800 group">
                    <div class="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <i class="fa-solid fa-play"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-xs font-bold text-red-700">비디오 링크</div>
                      <div class="text-xs sm:text-sm text-slate-700 truncate"><?= htmlspecialchars($videoUrl) ?></div>
                    </div>
                    <i class="fa-solid fa-arrow-up-right-from-square text-xs text-slate-400 group-hover:text-red-600 mr-1"></i>
                  </a>
                <?php endif; ?>
              </div>
            <?php endif; ?>

            <!-- Attached Web Link Display -->
            <?php if (!empty($question['webLink'])): 
              $linkUrl = $question['webLink'];
              $parsedHost = parse_url($linkUrl, PHP_URL_HOST) ?: $linkUrl;
            ?>
              <div class="mt-3 mb-4">
                <a href="<?= htmlspecialchars($linkUrl) ?>" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3.5 rounded-2xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 transition-all text-slate-800 group shadow-2xs">
                  <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <i class="fa-solid fa-link"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-[11px] font-bold text-blue-700 uppercase tracking-wider"><?= htmlspecialchars($parsedHost) ?></div>
                    <div class="text-xs sm:text-sm text-slate-800 font-semibold truncate"><?= htmlspecialchars($linkUrl) ?></div>
                  </div>
                  <span class="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-blue-800">
                    웹링크 방문 <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </span>
                </a>
              </div>
            <?php endif; ?>

            <!-- Question Images / Poster Display -->
            <?php if (!empty($question['images'])): ?>
              <div class="mt-4 mb-5">
                <?php if (($question['specialtyId'] ?? '') === 'events'): ?>
                  <!-- Event Poster (Featured Banner) -->
                  <div class="rounded-2xl overflow-hidden border border-rose-200 shadow-sm bg-slate-900 text-center">
                    <img src="<?= htmlspecialchars($question['images'][0]) ?>" alt="이벤트 포스터" class="w-full max-h-[600px] object-contain mx-auto" />
                  </div>
                  <?php if (count($question['images']) > 1): ?>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                      <?php for ($i = 1; $i < count($question['images']); $i++): ?>
                        <a href="<?= htmlspecialchars($question['images'][$i]) ?>" data-lightbox class="block rounded-xl overflow-hidden border border-slate-200 aspect-video hover:opacity-90 bg-slate-100 cursor-zoom-in">
                          <img src="<?= htmlspecialchars($question['images'][$i]) ?>" class="w-full h-full object-cover" alt="추가 이미지" />
                        </a>
                      <?php endfor; ?>
                    </div>
                  <?php endif; ?>
                <?php else: ?>
                  <!-- Attached Photos Grid -->
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <?php foreach ($question['images'] as $qImg): ?>
                      <a href="<?= htmlspecialchars($qImg) ?>" data-lightbox class="block rounded-xl overflow-hidden border border-slate-200 aspect-video hover:opacity-90 bg-slate-100 shadow-2xs group relative cursor-zoom-in">
                        <img src="<?= htmlspecialchars($qImg) ?>" class="w-full h-full object-cover" alt="첨부 사진" />
                        <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                          <span>확대</span>
                        </div>
                      </a>
                    <?php endforeach; ?>
                  </div>
                <?php endif; ?>
              </div>
            <?php endif; ?>

            <!-- Bottom Action Row: Like / 공감, Views, Reply Link -->
            <div class="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
              <div class="flex items-center gap-3">
                <button type="button" onclick="handleQuestionLike('<?= htmlspecialchars($question['id']) ?>')" id="btn-q-like" 
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-600 font-bold transition-all cursor-pointer shadow-2xs">
                  <i class="fa-solid fa-heart text-rose-500"></i>
                  <span>공감</span>
                  <span id="q-like-count" class="font-mono"><?= (int)($question['likeCount'] ?? ($question['upvotes'] ?? 0)) ?></span>
                </button>
                <span class="text-slate-400">
                  <?= (int)($question['viewCount'] ?? 0) ?>회 조회
                </span>
              </div>
              <div class="flex items-center gap-2">
                <a href="#reply-section" class="font-bold text-[#1B6FA8] hover:underline">
                  답변 / 댓글 작성하기 →
                </a>
              </div>
            </div>
          </article>

          <!-- Answers Section Header -->
          <div class="flex items-center justify-between pt-2">
            <h2 class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span><?= htmlspecialchars($answersHeadingTitle) ?></span>
              <span class="text-xs font-extrabold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                <?= count($question['answers'] ?? []) ?>
              </span>
            </h2>
          </div>

          <?php if ($isWanted): ?>
            <!-- Wanted Service Safety Callout -->
            <div class="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/90 text-xs text-teal-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0">
                  <i class="fa-solid fa-handshake-angle"></i>
                </div>
                <div>
                  <h4 class="font-bold text-teal-950 text-xs sm:text-sm">서비스 의뢰 및 거래 안전 안내</h4>
                  <p class="text-[11px] text-teal-800/90 mt-0.5">선입금 지양, 작업 조건 사전 합의, 신원 확인을 권장합니다. 당사는 회원 간 거래·고용의 당사자가 아닙니다.</p>
                </div>
              </div>
              <button type="button" onclick="openServiceDisclaimerModal()" class="text-xs font-bold text-teal-800 hover:text-teal-950 underline shrink-0 cursor-pointer self-start sm:self-auto">
                약관 및 면책 전문 보기 →
              </button>
            </div>
          <?php endif; ?>

          <!-- Chronological Answers Stream -->
          <?php if (empty($question['answers'])): ?>
            <div class="bg-white rounded-2xl p-8 text-center border border-slate-200/90 shadow-2xs">
              <p class="text-xs text-slate-600 font-bold mb-1">아직 등록된 답변이 없습니다.</p>
              <p class="text-[11px] text-slate-400">첫 번째 <?= $isProfessionalCategory ? '전문가 답변' : '댓글' ?>을 남겨주세요!</p>
            </div>
          <?php else: ?>
            <div class="space-y-4">
              <?php 
              $ansIndex = 1;
              foreach ($question['answers'] as $ans): 
                $ansIndex++;
                $isClinician = !empty($ans['authorBadge']) && (str_contains($ans['authorBadge'], 'Clinician') || str_contains($ans['authorBadge'], 'Expert') || !empty($ans['authorBadgeLabel']));
                $badgeText = $ans['authorBadgeLabel'] ?? ($isClinician ? '공인 전문가' : '');
                $hasUpvoted = !empty($ans['hasUpvoted']);
              ?>
                <article class="bg-white rounded-2xl p-6 border <?= $isClinician ? 'border-blue-300 ring-2 ring-blue-500/10 shadow-xs' : 'border-slate-200/90 shadow-2xs' ?> relative">
                  
                  <?php if ($isClinician): ?>
                    <!-- Verified Clinician Top Accent Ribbon -->
                    <div class="flex items-center gap-2 mb-3 bg-blue-50 text-[#1B6FA8] px-3 py-1 rounded-lg text-xs font-bold border border-blue-200 inline-flex">
                      <span>NJAP 공인 전문가 인증 답변 (Verified Professional)</span>
                    </div>
                  <?php endif; ?>

                  <!-- Answer Author Header -->
                  <div class="flex items-center justify-between gap-4 pb-2 mb-2.5 border-b border-slate-100/80">
                    <div class="flex items-center gap-3">
                      <img src="<?= htmlspecialchars(forum_sanitize_avatar($ans['authorAvatar'] ?? '', $ans['authorName'] ?? '', $ans['authorBadge'] ?? '')) ?>" 
                           alt="<?= htmlspecialchars($ans['authorName'] ?? '답변자') ?>" 
                           class="w-9 h-9 rounded-full object-cover border <?= $isClinician ? 'border-[#1B6FA8] ring-2 ring-blue-400/30' : 'border-slate-200' ?>" />
                      <div>
                        <div class="font-bold text-sm text-slate-900 flex items-center gap-2 leading-tight">
                          <span><?= htmlspecialchars($ans['authorName'] ?? '사용자') ?></span>
                          <?php if ($isClinician && !empty($badgeText)): ?>
                            <span class="text-[10px] bg-[#1B6FA8] text-white font-extrabold px-2 py-0.5 rounded-full"><?= htmlspecialchars($badgeText) ?></span>
                          <?php endif; ?>
                        </div>
                        <p class="text-xs text-slate-400 mt-0.5 leading-none"><?= date('Y-m-d H:i', strtotime($ans['createdAt'] ?? 'now')) ?></p>
                      </div>
                    </div>

                    <!-- Upvote Button -->
                    <div class="flex items-center gap-2">
                      <button onclick="handleUpvote('<?= htmlspecialchars($ans['id']) ?>', this)" 
                              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all <?= $hasUpvoted ? 'bg-red-50 text-red-600 border-red-300' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200' ?>"
                              title="유익한 답변 추천">
                        <span class="text-red-500">♥</span>
                        <span class="upvote-count"><?= (int)($ans['upvotes'] ?? 0) ?></span>
                      </button>
                      <span class="text-xs text-slate-300 font-mono">#<?= $ansIndex ?></span>
                    </div>
                  </div>

                  <!-- Answer Body -->
                  <div class="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed whitespace-pre-line mt-0 pt-0"><?= htmlspecialchars(preg_replace('/^[\r\n\s]+/', '', $ans['body'] ?? '')) ?></div>

                  <!-- Answer Attached Images -->
                  <?php if (!empty($ans['images'])): ?>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 mb-1">
                      <?php foreach ($ans['images'] as $aImg): ?>
                        <a href="<?= htmlspecialchars($aImg) ?>" data-lightbox class="block rounded-lg overflow-hidden border border-slate-200 aspect-video hover:opacity-90 bg-slate-100 relative group cursor-zoom-in">
                          <img src="<?= htmlspecialchars($aImg) ?>" class="w-full h-full object-cover" alt="답변 첨부 이미지" />
                          <div class="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold">
                            <span>원본보기</span>
                          </div>
                        </a>
                      <?php endforeach; ?>
                    </div>
                  <?php endif; ?>
                </article>
              <?php endforeach; ?>
            </div>
          <?php endif; ?>

          <!-- Post Answer Composer -->
          <section id="reply-section" class="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs">
            <h3 class="text-base font-bold text-slate-900 mb-1">
              <span>답변 작성하기</span>
            </h3>
            <p class="text-xs text-slate-500 mb-4">
              정확하고 따뜻한 의학 정보 및 환자 경험을 나눠주세요. 질문자와 커뮤니티에 큰 도움이 됩니다.
            </p>

            <form id="reply-form" onsubmit="handlePostReply(event)" class="space-y-4">
              <input type="hidden" name="question_id" value="<?= htmlspecialchars($question['id']) ?>">
              
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>답변자 성함 / 닉네임 <span class="text-red-500">*</span></span>
                  <span id="reply-badge-indicator" class="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md hidden">
                    <span id="reply-badge-text">공인 전문의 인증 계정</span>
                  </span>
                </label>
                <input type="text" id="reply-author-name" name="author_name" required minlength="2"
                  placeholder="예: 홍길동, 또는 전문의 성함 및 진료과"
                  class="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600" />
              </div>

              <?php render_avatar_picker('reply'); ?>

              <textarea id="reply-body" name="body" rows="4" required
                placeholder="의학적 소견, 경험담, 또는 조언을 상세히 적어주세요..." 
                class="w-full p-4 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 leading-relaxed"></textarea>

              <!-- Reply Image Attachment -->
              <div>
                <input type="file" id="reply-image-input" accept="image/jpeg,image/png,image/webp" multiple class="hidden" onchange="handleReplyImageSelect(this)">
                <div class="flex items-center gap-3">
                  <button type="button" onclick="triggerReplyImageUpload()" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors cursor-pointer">
                    <span>사진 첨부 (JPEG/PNG)</span>
                  </button>
                  <span id="reply-upload-spinner" class="hidden text-xs text-blue-600 font-semibold flex items-center gap-1">
                    업로드 중...
                  </span>
                </div>
                <div id="reply-images-preview" class="flex flex-wrap gap-2 mt-2 empty:mt-0"></div>
              </div>

              <div class="flex items-center justify-between flex-wrap gap-3 pt-2">
                <span class="text-[11px] text-slate-400">
                  ※ 제출 전 상단의 의료 면책 조항을 확인해 주세요.
                </span>
                <button type="submit" id="btn-submit-reply" class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center">
                  <span>답변 등록하기</span>
                </button>
              </div>
            </form>
          </section>

        </div>

        <!-- Right Column: Thread Stats & Related Topics (4 cols) -->
        <div class="lg:col-span-4 space-y-6">
          
          <!-- Thread Summary Card (Discourse Style) -->
          <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">토픽 정보</h4>

            <div class="grid grid-cols-2 gap-3 text-center">
              <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span class="block text-lg font-black text-slate-800"><?= count($question['answers'] ?? []) ?></span>
                <span class="text-[10px] text-slate-400 font-bold uppercase">답변</span>
              </div>
              <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span class="block text-lg font-black text-slate-800"><?= (int)($question['viewCount'] ?? 0) ?></span>
                <span class="text-[10px] text-slate-400 font-bold uppercase">조회수</span>
              </div>
            </div>

            <!-- Participants -->
            <div>
              <span class="block text-[11px] font-bold text-slate-500 mb-2">참여 의료진 &amp; 회원</span>
              <div class="flex items-center gap-1.5 flex-wrap">
                <img src="<?= htmlspecialchars(forum_sanitize_avatar($question['authorAvatar'] ?? '', $question['authorName'] ?? '', $question['authorBadge'] ?? '')) ?>" 
                     title="<?= htmlspecialchars($question['authorName'] ?? '질문자') ?>"
                     class="w-7 h-7 rounded-full object-cover border border-slate-200" />
                <?php foreach (($question['answers'] ?? []) as $a): ?>
                  <img src="<?= htmlspecialchars(forum_sanitize_avatar($a['authorAvatar'] ?? '', $a['authorName'] ?? '', $a['authorBadge'] ?? '')) ?>" 
                       title="<?= htmlspecialchars($a['authorName'] ?? '답변자') ?>"
                       class="w-7 h-7 rounded-full object-cover border <?= !empty($a['authorBadge']) ? 'border-emerald-500' : 'border-slate-200' ?>" />
                <?php endforeach; ?>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
              <div class="flex justify-between">
                <span>진료과:</span>
                <strong class="text-slate-800"><?= htmlspecialchars($specialty['name_ko'] ?? '일반') ?></strong>
              </div>
              <div class="flex justify-between">
                <span>공인 전문의 답변:</span>
                <strong class="<?= !empty($question['answers']) ? 'text-emerald-600' : 'text-slate-400' ?>">
                  <?= count(array_filter($question['answers'] ?? [], fn($a) => !empty($a['authorBadge']))) > 0 ? '완료' : '대기중' ?>
                </strong>
              </div>
            </div>
          </div>

          <!-- Related Questions in Specialty -->
          <?php if (!empty($relatedQuestions)): ?>
            <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                <?= htmlspecialchars($specialty['name_ko'] ?? '진료과') ?> 관련 토픽
              </h4>
              <div class="space-y-3">
                <?php foreach ($relatedQuestions as $rq): ?>
                  <a href="/forum/topic/<?= htmlspecialchars($rq['id']) ?>" 
                     class="block group text-xs text-slate-700 hover:text-blue-600 font-medium leading-snug">
                    <span class="group-hover:underline line-clamp-2"><?= htmlspecialchars($rq['title']) ?></span>
                    <span class="block text-[10px] text-slate-400 mt-0.5">답변 <?= (int)$rq['replyCount'] ?>개</span>
                  </a>
                <?php endforeach; ?>
              </div>
            </div>
          <?php endif; ?>

        </div>

      </div>

      <!-- Section Specific Safety & Policy Disclaimer Strip (At bottom of site) -->
      <?php render_forum_disclaimer_banner('mt-8', $question['categoryId'] ?? 'community'); ?>

    </main>
  </div>

  <!-- Shared Global Footer Matching Website -->
  <?php render_forum_footer(); ?>

  <!-- Shared Auth Modals -->
  <?php render_forum_modals(); ?>

  <!-- Shared Auth & Sidebar Controller Scripts -->
  <?php render_forum_auth_scripts(); ?>
  <?php render_image_lightbox(); ?>

  <script>
    function syncAuthorFields() {
      if (!currentUser) return;
      const authorInput = document.getElementById('reply-author-name');
      if (authorInput && !authorInput.value) {
        authorInput.value = currentUser.name || '';
      }

      // If clinician, show badge indicator
      const badgeIndicator = document.getElementById('reply-badge-indicator');
      const badgeText = document.getElementById('reply-badge-text');
      if (currentUser.isVerifiedClinician && badgeIndicator) {
        badgeIndicator.classList.remove('hidden');
        if (badgeText && currentUser.clinicianTitle) {
          badgeText.innerText = `${currentUser.clinicianTitle} 인증 계정`;
        }
      }
    }

    let replyUploadedImages = [];

    function triggerReplyImageUpload() {
      if (!currentUser) {
        openGoogleAuthModal();
        return;
      }
      document.getElementById('reply-image-input').click();
    }

    async function handleReplyImageSelect(input) {
      const files = Array.from(input.files || []);
      if (!files.length) return;

      if (!currentUser) {
        openGoogleAuthModal();
        input.value = '';
        return;
      }

      if (replyUploadedImages.length + files.length > 5) {
        alert('이미지는 최대 5장까지 첨부할 수 있습니다.');
        return;
      }

      const spinner = document.getElementById('reply-upload-spinner');
      if (spinner) spinner.classList.remove('hidden');

      for (const file of files) {
        if (!file.type.match(/^image\/(jpeg|png|webp|gif)/i)) {
          alert('JPEG, PNG, WEBP 이미지 파일만 첨부 가능합니다.');
          continue;
        }
        if (file.size > 12 * 1024 * 1024) {
          alert(`'${file.name}' 파일이 너무 큽니다 (최대 12MB).`);
          continue;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
          const res = await fetch('/api/forum.php?action=upload_image', {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          if (data.success && data.url) {
            replyUploadedImages.push(data.url);
            renderReplyImagePreviews();
          } else {
            alert(data.error || '이미지 업로드에 실패했습니다.');
          }
        } catch(err) {
          alert('이미지 업로드 통신 오류가 발생했습니다.');
        }
      }

      if (spinner) spinner.classList.add('hidden');
      input.value = '';
    }

    function removeReplyImage(index) {
      replyUploadedImages.splice(index, 1);
      renderReplyImagePreviews();
    }

    function renderReplyImagePreviews() {
      const previewBox = document.getElementById('reply-images-preview');
      if (!previewBox) return;

      previewBox.innerHTML = replyUploadedImages.map((url, idx) => `
        <div class="relative group w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-white">
          <img src="${url}" class="w-full h-full object-cover" alt="첨부 이미지">
          <button type="button" onclick="removeReplyImage(${idx})" 
                  class="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] flex items-center justify-center hover:bg-red-700">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      `).join('');
    }

    async function handlePostReply(e) {
      e.preventDefault();
      if (!currentUser) {
        openGoogleAuthModal();
        return;
      }

      const body = (document.getElementById('reply-body')?.value || '').trim().replace(/^[\r\n\s]+/, '');
      const authorName = document.getElementById('reply-author-name')?.value.trim() || '';
      if (!body) return;

      const btn = document.getElementById('btn-submit-reply');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 등록 중...';

      try {
        const res = await fetch('/api/forum.php?action=reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question_id: '<?= htmlspecialchars($question['id']) ?>',
            author_name: authorName,
            author_avatar: (typeof getForumAvatar === 'function') ? getForumAvatar('reply') : '',
            body: body,
            images: replyUploadedImages
          })
        });
        const data = await res.json();
        if (data.success) {
          window.location.reload();
        } else if (res.status === 401 || data.require_auth) {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> 답변 등록하기';
          openGoogleAuthModal();
        } else {
          alert(data.error || '답변 등록에 실패했습니다.');
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> 답변 등록하기';
        }
      } catch(err) {
        alert('답변 등록 중 통신 오류가 발생했습니다.');
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> 답변 등록하기';
      }
    }

    async function handleUpvote(answerId, btn) {
      if (!currentUser) {
        openGoogleAuthModal();
        return;
      }

      try {
        const res = await fetch('/api/forum.php?action=upvote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answer_id: answerId })
        });
        const data = await res.json();
        if (data.success) {
          const countEl = btn.querySelector('.upvote-count');
          if (countEl) countEl.innerText = data.upvotes;
          if (data.hasUpvoted) {
            btn.classList.add('bg-red-50', 'text-red-600', 'border-red-300');
            btn.classList.remove('bg-slate-50', 'text-slate-600', 'border-slate-200');
            btn.querySelector('i').classList.replace('fa-regular', 'fa-solid');
          } else {
            btn.classList.remove('bg-red-50', 'text-red-600', 'border-red-300');
            btn.classList.add('bg-slate-50', 'text-slate-600', 'border-slate-200');
            btn.querySelector('i').classList.replace('fa-solid', 'fa-regular');
          }
        } else {
          alert(data.error || '추천 처리 실패');
        }
      } catch(e) {}
    }

    async function handleQuestionLike(qId) {
      try {
        const res = await fetch('/api/forum.php?action=toggle_like', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question_id: qId })
        });
        const data = await res.json();
        if (data.success && typeof data.likeCount !== 'undefined') {
          const countEl = document.getElementById('q-like-count');
          if (countEl) countEl.innerText = data.likeCount;
        }
      } catch(e) {}
    }

    // Marketplace Contact & Report Modal Logic
    function openMarketEmailModal() {
      document.getElementById('market-email-modal')?.classList.remove('hidden');
    }
    function closeMarketEmailModal() {
      document.getElementById('market-email-modal')?.classList.add('hidden');
    }
    function openMarketReportModal() {
      document.getElementById('market-report-modal')?.classList.remove('hidden');
    }
    function closeMarketReportModal() {
      document.getElementById('market-report-modal')?.classList.add('hidden');
    }

    async function handleMarketEmailSubmit(e) {
      e.preventDefault();
      const listingId = document.getElementById('market_email_listing_id')?.value;
      const hp = document.getElementById('market_email_hp')?.value;
      if (hp) return; // bot honeypot

      const name = document.getElementById('market_sender_name')?.value.trim();
      const email = document.getElementById('market_sender_email')?.value.trim();
      const message = document.getElementById('market_email_message')?.value.trim();

      if (!name || !email || !message) {
        alert('모든 필수 항목을 입력해 주세요.');
        return;
      }

      const btn = document.getElementById('btn-submit-market-email');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xs"></i> 전송 중...';

      try {
        const res = await fetch('/api/forum.php?action=market_contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listing_id: listingId,
            sender_name: name,
            sender_email: email,
            message: message,
            hp: hp
          })
        });
        const data = await res.json();
        if (data.success) {
          alert('판매자에게 문의 메일이 안전하게 전송되었습니다.');
          closeMarketEmailModal();
          document.getElementById('market-email-form')?.reset();
        } else {
          alert(data.error || '메시지 전송에 실패했습니다.');
        }
      } catch (err) {
        alert('통신 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane text-xs"></i> <span>메시지 전송</span>';
      }
    }

    async function handleMarketReportSubmit(e) {
      e.preventDefault();
      const listingId = document.getElementById('market_report_listing_id')?.value;
      const hp = document.getElementById('market_report_hp')?.value;
      if (hp) return; // bot honeypot

      const reason = document.getElementById('market_report_reason')?.value;
      const details = document.getElementById('market_report_details')?.value.trim();
      const contact = document.getElementById('market_report_contact')?.value.trim();

      if (!reason || !details) {
        alert('신고 사유와 상세 내용을 입력해 주세요.');
        return;
      }

      const btn = document.getElementById('btn-submit-market-report');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xs"></i> 접수 중...';

      try {
        const res = await fetch('/api/forum.php?action=report_listing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listing_id: listingId,
            reason: reason,
            details: details,
            reporter_contact: contact,
            hp: hp
          })
        });
        const data = await res.json();
        if (data.success) {
          alert('신고가 접수되었습니다. 운영진이 신속히 확인하여 조치하겠습니다.');
          closeMarketReportModal();
          document.getElementById('market-report-form')?.reset();
        } else {
          alert(data.error || '신고 접수에 실패했습니다.');
        }
      } catch (err) {
        alert('통신 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-flag text-xs"></i> <span>신고 접수</span>';
      }
    }
  </script>

  <!-- Marketplace Contact Email Modal (Craigslist Privacy Relay) -->
  <div id="market-email-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 hidden">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
      <div class="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-blue-50 text-[#1B6FA8] flex items-center justify-center">
            <i class="fa-solid fa-envelope text-sm"></i>
          </div>
          <h3 class="text-base sm:text-lg font-black text-slate-900"><?= $isWanted ? '요청자에게 이메일 보내기' : '판매자에게 이메일 보내기' ?></h3>
        </div>
        <button type="button" onclick="closeMarketEmailModal()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm transition-colors cursor-pointer">✕</button>
      </div>

      <div class="p-3 bg-blue-50/70 rounded-xl text-xs text-blue-900 leading-relaxed mb-4 flex items-start gap-2">
        <i class="fa-solid fa-shield-halved text-[#1B6FA8] mt-0.5 shrink-0"></i>
        <span><?= $isWanted ? '요청자의 이메일 주소는 비공개로 보호되며, 작성하신 문의 내용이 안전하게 전달됩니다.' : '판매자의 이메일 주소는 비공개로 보호되며, 작성하신 문의 내용이 안전하게 전달됩니다.' ?></span>
      </div>

      <form id="market-email-form" onsubmit="handleMarketEmailSubmit(event)" class="space-y-4">
        <input type="hidden" id="market_email_listing_id" value="<?= htmlspecialchars((string)($question['id'] ?? '')) ?>">
        <!-- Honeypot -->
        <div style="display:none !important;" aria-hidden="true">
          <input type="text" id="market_email_hp" name="hp_phone_fake" tabindex="-1" autocomplete="off">
        </div>

        <div>
          <label for="market_sender_name" class="block text-xs font-bold text-slate-800 mb-1">
            이름 <span class="text-red-500">*</span>
          </label>
          <input type="text" id="market_sender_name" required placeholder="본인 성함 또는 닉네임"
                 class="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans text-slate-900 focus:outline-none focus:border-[#1B6FA8]">
        </div>

        <div>
          <label for="market_sender_email" class="block text-xs font-bold text-slate-800 mb-1">
            내 이메일 <span class="text-red-500">*</span> <span class="text-[11px] font-normal text-slate-500">(판매자가 답장할 주소)</span>
          </label>
          <input type="email" id="market_sender_email" required placeholder="답변 받으실 이메일 주소"
                 class="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans text-slate-900 focus:outline-none focus:border-[#1B6FA8]">
        </div>

        <div>
          <label for="market_email_message" class="block text-xs font-bold text-slate-800 mb-1">
            메시지 <span class="text-red-500">*</span>
          </label>
          <textarea id="market_email_message" rows="4" required placeholder="구매 희망 내용, 거래 희망 장소 및 시간 등을 적어주세요."
                    class="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans text-slate-900 focus:outline-none focus:border-[#1B6FA8] resize-none"></textarea>
        </div>

        <div class="pt-2 flex items-center justify-end gap-2.5">
          <button type="button" onclick="closeMarketEmailModal()" class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer">
            취소
          </button>
          <button type="submit" id="btn-submit-market-email" class="px-5 py-2.5 rounded-xl bg-[#1B6FA8] hover:bg-[#155A8A] text-white text-xs sm:text-sm font-black shadow-xs transition-colors flex items-center gap-2 cursor-pointer">
            <i class="fa-solid fa-paper-plane text-xs"></i>
            <span>메시지 전송</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Marketplace Listing Report Modal -->
  <div id="market-report-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 hidden">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
      <div class="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <i class="fa-solid fa-flag text-sm"></i>
          </div>
          <h3 class="text-base sm:text-lg font-black text-slate-900">게시글 신고하기</h3>
        </div>
        <button type="button" onclick="closeMarketReportModal()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm transition-colors cursor-pointer">✕</button>
      </div>

      <p class="text-xs text-slate-600 leading-relaxed mb-4">
        사기 의심 또는 허위 매물 등의 불법·부정 게시글을 운영진에게 제보해 주시면 즉시 검토 후 조치합니다.
      </p>

      <form id="market-report-form" onsubmit="handleMarketReportSubmit(event)" class="space-y-4">
        <input type="hidden" id="market_report_listing_id" value="<?= htmlspecialchars((string)($question['id'] ?? '')) ?>">
        <!-- Honeypot -->
        <div style="display:none !important;" aria-hidden="true">
          <input type="text" id="market_report_hp" name="hp_name_fake" tabindex="-1" autocomplete="off">
        </div>

        <div>
          <label for="market_report_reason" class="block text-xs font-bold text-slate-800 mb-1">
            신고 사유 <span class="text-red-500">*</span>
          </label>
          <select id="market_report_reason" required class="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans text-slate-900 focus:outline-none focus:border-red-500 bg-white">
            <option value="사기 의심">사기 의심 (선입금 요구, 시세 조작 등)</option>
            <option value="허위 매물">허위 매물 (실물 없음, 허위 정보)</option>
            <option value="부적절한 내용">부적절한 내용 (욕설, 음란, 비방)</option>
            <option value="기타">기타</option>
          </select>
        </div>

        <div>
          <label for="market_report_details" class="block text-xs font-bold text-slate-800 mb-1">
            상세 내용 <span class="text-red-500">*</span>
          </label>
          <textarea id="market_report_details" rows="4" required placeholder="구체적인 정황이나 사유를 적어주세요."
                    class="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans text-slate-900 focus:outline-none focus:border-red-500 resize-none"></textarea>
        </div>

        <div>
          <label for="market_report_contact" class="block text-xs font-bold text-slate-800 mb-1">
            연락처 (선택) <span class="text-[11px] font-normal text-slate-500">(이메일 또는 전화번호)</span>
          </label>
          <input type="text" id="market_report_contact" placeholder="추가 확인이 필요한 경우 연락받으실 수단"
                 class="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans text-slate-900 focus:outline-none focus:border-[#1B6FA8]">
        </div>

        <div class="pt-2 flex items-center justify-end gap-2.5">
          <button type="button" onclick="closeMarketReportModal()" class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer">
            취소
          </button>
          <button type="submit" id="btn-submit-market-report" class="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-black shadow-xs transition-colors flex items-center gap-2 cursor-pointer">
            <i class="fa-solid fa-flag text-xs"></i>
            <span>신고 접수</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</body>
</html>
