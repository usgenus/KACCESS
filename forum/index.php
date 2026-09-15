<?php
require_once __DIR__ . '/../api/forum_db.php';
require_once __DIR__ . '/components.php';

$specialtyFilter = trim($_GET['specialty'] ?? '');
$sortFilter = trim($_GET['sort'] ?? 'latest');
$searchQuery = trim($_GET['q'] ?? '');
$viewMode = trim($_GET['view'] ?? '');

// Auto-determine view mode if not set
if (empty($viewMode)) {
    if (!empty($specialtyFilter) || !empty($searchQuery) || in_array($sortFilter, ['hot', 'verified', 'unanswered'])) {
        $viewMode = 'topics';
    } else {
        $viewMode = 'categories';
    }
}

$specialties = forum_get_specialties();
$questions = forum_get_questions($specialtyFilter, $sortFilter, $searchQuery, 'active');

// Current specialty meta
$currentSpecialty = null;
if (!empty($specialtyFilter) && $specialtyFilter !== 'all') {
    foreach ($specialties as $s) {
        if ($s['id'] === $specialtyFilter || $s['slug'] === $specialtyFilter) {
            $currentSpecialty = $s;
            break;
        }
    }
}

// Featured Questions (top 3 informative/answered topics)
$allActive = forum_get_questions('', 'popular', '', 'active');
$featuredPosts = array_slice($allActive, 0, 3);

$canonicalUrl = 'https://kor2.njaccessportal.com/forum';
if ($currentSpecialty) {
    $canonicalUrl = 'https://kor2.njaccessportal.com/forum?specialty=' . urlencode($currentSpecialty['id']);
} elseif ($viewMode === 'categories') {
    $canonicalUrl = 'https://kor2.njaccessportal.com/forum?view=categories';
}
$seoTitle = ($currentSpecialty ? htmlspecialchars($currentSpecialty['name_ko']) . ' 전문의 Q&A — ' : '') . '메디컬 포럼 & 전문의 질의응답 | 뉴저지 의료접근센터 (NJAP)';
$seoDesc = $currentSpecialty ? htmlspecialchars($currentSpecialty['description']) . ' 뉴저지 한인 동포를 위한 전문의 답변 및 질문/정보 나눔.' : '뉴저지 한인 동포를 위한 전문 진료과 및 시니어 케어 무료 의료 질문/정보 공유 커뮤니티. 편리하게 전문의 답변과 건강 질의응답을 확인하세요.';
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $seoTitle ?></title>
  <meta name="description" content="<?= $seoDesc ?>" />
  <meta name="keywords" content="의료 포럼, 전문의 Q&A, 뉴저지 한인 병원, 건강 상담, 메디컬 포럼, 내과, 시니어 케어, 요양원, 호스피스" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <link rel="canonical" href="<?= htmlspecialchars($canonicalUrl) ?>" />

  <!-- OpenGraph / Social Media -->
  <meta property="og:site_name" content="뉴저지 의료접근센터 · NJAP 메디컬 포럼" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="<?= $seoTitle ?>" />
  <meta property="og:description" content="<?= $seoDesc ?>" />
  <meta property="og:url" content="<?= htmlspecialchars($canonicalUrl) ?>" />
  <meta property="og:image" content="https://kor2.njaccessportal.com/logo-icon.svg" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="<?= $seoTitle ?>" />
  <meta name="twitter:description" content="<?= $seoDesc ?>" />
  <meta name="twitter:image" content="https://kor2.njaccessportal.com/logo-icon.svg" />

  <!-- Schema.org JSON-LD Structured Data -->
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
      "url": "https://kor2.njaccessportal.com/"
    }
  }
  </script>

  <link rel="icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  
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
        width: 280px !important;
        max-width: 85vw !important;
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
        height: calc(100vh - 109px) !important;
        transform: none !important;
      }
    }
    /* Custom subtle scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  </style>
</head>
<body class="bg-[#F8FAFC] text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">

  <!-- Top Global Header -->
  <?php render_forum_header($searchQuery, $currentSpecialty); ?>

  <!-- Main Forum Layout: Sidebar + Content -->
  <div class="flex-1 flex w-full max-w-[1600px] mx-auto">
    
    <!-- Left Sidebar (Discourse Navigation & 15 Specialties) -->
    <?php render_forum_sidebar($specialties, $specialtyFilter, $sortFilter, $viewMode); ?>

    <!-- Main Content Area -->
    <main class="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
      
      <!-- Top Clinical Safety Notice Ribbon -->
      <div class="bg-amber-50 border border-amber-200/80 rounded-xl p-3 mb-6 flex items-center justify-between text-xs text-amber-900 gap-3">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-triangle-exclamation text-amber-600 text-sm shrink-0"></i>
          <span>
            <strong>의료 면책 안내:</strong> 본 포럼의 질의응답은 교육 및 일반 정보 제공 목적이며 대면 진료를 대신하지 않습니다. 응급 시 911에 신고하십시오.
          </span>
        </div>
        <a href="/about" class="text-[11px] font-bold text-amber-700 hover:underline shrink-0 hidden sm:inline">
          가이드라인 보기 →
        </a>
      </div>

      <!-- Top Forum Navigation & Quick Search Bar -->
      <div class="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-200">
        
        <!-- Left: Category / Section Title -->
        <div class="flex items-center gap-2">
          <?php if (!empty($currentSpecialty)): ?>
            <a href="/forum" class="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
              <i class="fa-solid fa-arrow-left text-[10px]"></i>
              <span>전체 포럼</span>
            </a>
            <span class="text-slate-300 text-xs">/</span>
            <div class="flex items-center gap-1.5 bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg text-xs font-bold border border-blue-200/60">
              <span class="w-2 h-2 rounded-full" style="background-color: <?= htmlspecialchars($currentSpecialty['color'] ?? '#2563eb') ?>"></span>
              <span><?= htmlspecialchars($currentSpecialty['name_ko']) ?></span>
            </div>
          <?php else: ?>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-blue-600"></span>
              <h2 class="text-sm font-extrabold text-slate-900 tracking-tight">
                전체 카테고리 및 실시간 질문
              </h2>
            </div>
          <?php endif; ?>
        </div>

        <!-- Right: Quick Search & Counter -->
        <div class="flex items-center gap-3">
          <form action="/forum" method="GET" class="relative hidden sm:block">
            <input type="hidden" name="view" value="topics" />
            <?php if (!empty($specialtyFilter)): ?>
              <input type="hidden" name="specialty" value="<?= htmlspecialchars($specialtyFilter) ?>" />
            <?php endif; ?>
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs pointer-events-none"></i>
            <input type="text" name="q" value="<?= htmlspecialchars($searchQuery) ?>" 
              placeholder="증상, 약품명, 질문 검색..." 
              class="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 lg:w-64 shadow-2xs text-slate-900" />
          </form>
          <div class="text-xs text-slate-500 font-medium whitespace-nowrap">
            총 <strong class="text-slate-900"><?= count($questions) ?></strong>개의 질문
          </div>
        </div>

      </div>

      <!-- VIEW MODE 1: Categories 2-Column Split View (Screenshot 1) -->
      <?php if ($viewMode === 'categories' && empty($specialtyFilter)): ?>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Left Column: 15 Medical Specialties Category Cards (7 cols) -->
          <div class="lg:col-span-7 space-y-3">
            <div class="flex items-center justify-between pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
              <span>Category (전문 진료과 및 시니어 케어)</span>
              <span>Topics</span>
            </div>

            <?php foreach ($specialties as $sp): ?>
              <div class="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all flex items-start justify-between gap-4"
                   style="border-left: 4px solid <?= htmlspecialchars($sp['color']) ?>;">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <a href="/forum?specialty=<?= urlencode($sp['id']) ?>&view=topics" 
                       class="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                      <span><?= htmlspecialchars($sp['name_ko']) ?></span>
                      <span class="text-xs font-normal text-slate-400">(<?= htmlspecialchars($sp['name_en']) ?>)</span>
                    </a>
                  </div>
                  <p class="text-xs text-slate-500 leading-relaxed">
                    <?= htmlspecialchars($sp['description']) ?>
                  </p>
                </div>

                <a href="/forum?specialty=<?= urlencode($sp['id']) ?>&view=topics" 
                   class="text-xs font-extrabold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 px-2.5 py-1 rounded-lg transition-colors shrink-0">
                  <?= (int)($sp['questionCount'] ?? 0) ?>
                </a>
              </div>
            <?php endforeach; ?>
          </div>

          <!-- Right Column: Latest Topics Stream (5 cols) -->
          <div class="lg:col-span-5 space-y-3">
            <div class="flex items-center justify-between pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
              <span>Latest Topics (실시간 최신 질문)</span>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200/90 divide-y divide-slate-100 shadow-2xs">
              <?php 
              $latestStream = array_slice($questions, 0, 10);
              if (empty($latestStream)):
              ?>
                <div class="p-8 text-center text-xs text-slate-400">등록된 질문이 없습니다.</div>
              <?php else: ?>
                <?php foreach ($latestStream as $lq): 
                  $lSp = $lq['specialty'] ?? null;
                  $hasDoc = !empty($lq['hasClinicianAnswer']);
                ?>
                  <div class="p-4 hover:bg-slate-50/80 transition-colors flex items-start gap-3">
                    <img src="<?= htmlspecialchars($lq['authorAvatar'] ?: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80') ?>" 
                         class="w-9 h-9 rounded-full object-cover shrink-0 border <?= $hasDoc ? 'border-emerald-500 ring-2 ring-emerald-400/20' : 'border-slate-200' ?>">
                    
                    <div class="flex-1 min-w-0">
                      <a href="/forum/topic/<?= htmlspecialchars($lq['id']) ?>" 
                         class="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        <?= htmlspecialchars($lq['title']) ?>
                      </a>

                      <div class="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                          <span class="w-2 h-2 rounded-xs shrink-0" style="background-color: <?= htmlspecialchars($lSp['color'] ?? '#3b82f6') ?>"></span>
                          <span><?= htmlspecialchars($lSp['name_ko'] ?? '기타') ?></span>
                        </span>

                        <?php if ($hasDoc): ?>
                          <span class="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                            전문의 답변
                          </span>
                        <?php endif; ?>
                      </div>
                    </div>

                    <div class="text-right shrink-0 pl-2">
                      <span class="block text-xs font-bold text-slate-700">
                        <i class="fa-regular fa-comment text-[10px] text-slate-400 mr-0.5"></i> <?= (int)$lq['replyCount'] ?>
                      </span>
                      <span class="block text-[10px] text-slate-400 mt-0.5">
                        <?= forum_format_relative_time($lq['latestActivityAt'] ?? $lq['createdAt']) ?>
                      </span>
                    </div>
                  </div>
                <?php endforeach; ?>
              <?php endif; ?>
            </div>
          </div>

        </div>

      <!-- VIEW MODE 2: Discourse Topics Table View (Screenshot 2) -->
      <?php else: ?>
        
        <!-- Category Banner (if specific specialty selected) -->
        <?php if ($currentSpecialty): ?>
          <div class="bg-white rounded-2xl p-5 mb-6 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
               style="border-left: 5px solid <?= htmlspecialchars($currentSpecialty['color']) ?>;">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="w-3 h-3 rounded-xs shrink-0" style="background-color: <?= htmlspecialchars($currentSpecialty['color']) ?>"></span>
                <h2 class="text-lg font-bold text-slate-900">
                  <?= htmlspecialchars($currentSpecialty['name_ko']) ?>
                  <span class="text-xs font-normal text-slate-500">(<?= htmlspecialchars($currentSpecialty['name_en']) ?>)</span>
                </h2>
              </div>
              <p class="text-xs text-slate-500 leading-relaxed">
                <?= htmlspecialchars($currentSpecialty['description']) ?>
              </p>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <a href="/forum?view=categories" class="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">
                ← 전체 카테고리
              </a>
              <?php if (empty($currentSpecialty['isAdminOnly']) && ($currentSpecialty['id'] ?? '') !== 'events'): ?>
                <a href="/forum/ask?specialty=<?= urlencode($currentSpecialty['id']) ?>" class="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-lg transition-colors shadow-2xs flex items-center gap-1.5">
                  <i class="fa-solid fa-plus text-xs"></i>
                  <span>질문/정보 공유</span>
                </a>
              <?php endif; ?>
            </div>
          </div>
        <?php endif; ?>

        <!-- Discourse Style Topics Table -->
        <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/60">
                  <th class="py-3 px-4 font-semibold">Topic (질문 주제)</th>
                  <th class="py-3 px-3 font-semibold hidden sm:table-cell text-center w-36">참여자</th>
                  <th class="py-3 px-3 font-semibold text-center w-20">답변</th>
                  <th class="py-3 px-3 font-semibold text-center w-20 hidden md:table-cell">조회</th>
                  <th class="py-3 px-4 font-semibold text-right w-28">최근 활동</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-xs sm:text-sm">
                <?php if (empty($questions)): ?>
                  <tr>
                    <td colspan="5" class="py-12 text-center text-slate-400 text-xs">
                      선택하신 조건에 해당하는 질문이 아직 없습니다. 첫 번째 질문을 남겨보세요!
                    </td>
                  </tr>
                <?php else: ?>
                  <?php foreach ($questions as $q): 
                    $sp = $q['specialty'] ?? null;
                    $hasClinician = !empty($q['hasClinicianAnswer']);
                    $participants = $q['participants'] ?? [];
                  ?>
                    <tr class="hover:bg-slate-50/90 transition-colors group">
                      
                      <!-- Topic Title & Category Badge -->
                      <td class="py-3.5 px-4">
                        <div class="flex items-start gap-2">
                          <?php if ($hasClinician): ?>
                            <i class="fa-solid fa-circle-check text-emerald-600 text-sm mt-0.5 shrink-0" title="공인 전문의 답변 완료"></i>
                          <?php endif; ?>
                          <div>
                            <a href="/forum/topic/<?= htmlspecialchars($q['id']) ?>" 
                               class="font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 text-sm">
                              <?= htmlspecialchars($q['title']) ?>
                            </a>

                            <div class="flex items-center gap-2 mt-1 flex-wrap">
                              <!-- Category Badge -->
                              <a href="/forum?specialty=<?= urlencode($sp['id'] ?? '') ?>&view=topics" 
                                 class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 hover:text-slate-900">
                                <span class="w-2 h-2 rounded-xs shrink-0" style="background-color: <?= htmlspecialchars($sp['color'] ?? '#3b82f6') ?>"></span>
                                <span><?= htmlspecialchars($sp['name_ko'] ?? '진료과') ?></span>
                              </a>

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
                      <td class="py-3.5 px-3 hidden sm:table-cell">
                        <div class="flex items-center justify-center -space-x-2 overflow-hidden">
                          <?php foreach ($participants as $p): ?>
                            <img src="<?= htmlspecialchars($p['avatar']) ?>" 
                                 alt="<?= htmlspecialchars($p['name']) ?>" 
                                 title="<?= htmlspecialchars($p['name']) ?><?= !empty($p['isClinician']) ? ' (전문의)' : '' ?>"
                                 class="w-6 h-6 rounded-full object-cover border-2 <?= !empty($p['isClinician']) ? 'border-emerald-500' : 'border-white' ?>">
                          <?php endforeach; ?>
                        </div>
                      </td>

                      <!-- Replies Count -->
                      <td class="py-3.5 px-3 text-center">
                        <span class="font-bold text-xs <?= (int)$q['replyCount'] > 0 ? 'text-slate-800' : 'text-slate-300' ?>">
                          <?= (int)$q['replyCount'] ?>
                        </span>
                      </td>

                      <!-- Views Count -->
                      <td class="py-3.5 px-3 text-center hidden md:table-cell">
                        <span class="text-xs font-semibold <?= (int)$q['viewCount'] > 50 ? 'text-amber-600 font-bold' : 'text-slate-400' ?>">
                          <?= (int)$q['viewCount'] ?>
                        </span>
                      </td>

                      <!-- Activity Time -->
                      <td class="py-3.5 px-4 text-right whitespace-nowrap text-xs text-slate-400 font-medium">
                        <?= forum_format_relative_time($q['latestActivityAt'] ?? $q['createdAt']) ?>
                      </td>

                    </tr>
                  <?php endforeach; ?>
                <?php endif; ?>
              </tbody>
            </table>
          </div>
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
