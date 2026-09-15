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

$specialties = forum_get_specialties();
$specialty = $question['specialty'] ?? null;
$relatedQuestions = forum_get_questions($question['specialtyId'] ?? '', 'popular', '', 'active');
$relatedQuestions = array_values(array_filter($relatedQuestions, fn($q) => $q['id'] !== $id));
$relatedQuestions = array_slice($relatedQuestions, 0, 4);

$isQuestionClinician = !empty($question['authorBadge']) && str_contains($question['authorBadge'], 'Clinician');
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($question['title']) ?> | NJAP 메디컬 포럼</title>
  <meta name="description" content="<?= htmlspecialchars(mb_substr(strip_tags($question['body']), 0, 160)) ?>" />
  <meta name="keywords" content="<?= htmlspecialchars($specialty['name_ko'] ?? '전문의 상담') ?>, <?= htmlspecialchars($specialty['name_en'] ?? '') ?>, 건강 Q&A, 의료 질문 정보 나눔, 전문의 답변, 뉴저지 한인 병원" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <link rel="canonical" href="https://kor2.njaccessportal.com/forum/topic/<?= urlencode($question['id']) ?>" />

  <!-- OpenGraph / Social Media -->
  <meta property="og:site_name" content="NJAP 메디컬 포럼 · 뉴저지 의료접근센터" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="<?= htmlspecialchars($question['title']) ?>" />
  <meta property="og:description" content="<?= htmlspecialchars(mb_substr(strip_tags($question['body']), 0, 160)) ?>" />
  <meta property="og:url" content="https://kor2.njaccessportal.com/forum/topic/<?= urlencode($question['id']) ?>" />
  <meta property="og:image" content="<?= htmlspecialchars(!empty($question['images'][0]) ? (str_starts_with($question['images'][0], 'http') ? $question['images'][0] : 'https://kor2.njaccessportal.com/' . ltrim($question['images'][0], '/')) : 'https://kor2.njaccessportal.com/logo-icon.svg') ?>" />
  <meta property="article:published_time" content="<?= htmlspecialchars(date('c', strtotime($question['createdAt'] ?? 'now'))) ?>" />
  <meta property="article:section" content="<?= htmlspecialchars($specialty['name_ko'] ?? '의학 Q&A') ?>" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="<?= htmlspecialchars($question['title']) ?>" />
  <meta name="twitter:description" content="<?= htmlspecialchars(mb_substr(strip_tags($question['body']), 0, 160)) ?>" />
  <meta name="twitter:image" content="<?= htmlspecialchars(!empty($question['images'][0]) ? (str_starts_with($question['images'][0], 'http') ? $question['images'][0] : 'https://kor2.njaccessportal.com/' . ltrim($question['images'][0], '/')) : 'https://kor2.njaccessportal.com/logo-icon.svg') ?>" />

  <!-- Schema.org JSON-LD Structured Data: Google QAPage Rich Results -->
  <script type="application/ld+json">
  <?= json_encode([
      '@context' => 'https://schema.org',
      '@type' => 'QAPage',
      'mainEntity' => [
          '@type' => 'Question',
          'name' => $question['title'],
          'text' => strip_tags($question['body']),
          'answerCount' => count($question['answers'] ?? []),
          'upvoteCount' => (int)($question['replyCount'] ?? 0),
          'dateCreated' => date('c', strtotime($question['createdAt'] ?? 'now')),
          'author' => [
              '@type' => 'Person',
              'name' => $question['authorName'] ?? '포럼 회원'
          ],
          'suggestedAnswer' => array_values(array_map(function($ans) use ($question) {
              return [
                  '@type' => 'Answer',
                  'text' => strip_tags($ans['body']),
                  'dateCreated' => date('c', strtotime($ans['createdAt'] ?? 'now')),
                  'upvoteCount' => (int)($ans['upvotes'] ?? 0),
                  'url' => 'https://kor2.njaccessportal.com/forum/topic/' . urlencode($question['id']) . '#ans-' . urlencode($ans['id']),
                  'author' => [
                      '@type' => 'Person',
                      'name' => $ans['authorName'] ?? '답변자'
                  ]
              ];
          }, array_filter($question['answers'] ?? [], fn($a) => ($a['status'] ?? 'active') === 'active')))
      ]
  ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) ?>
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
  </style>
</head>
<body class="bg-[#F8FAFC] text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">

  <!-- Top Global Header -->
  <?php render_forum_header('', $specialty); ?>

  <!-- Main Forum Layout: Sidebar + Thread Content -->
  <div class="flex-1 flex w-full max-w-[1600px] mx-auto">
    
    <!-- Left Sidebar -->
    <?php render_forum_sidebar($specialties, $question['specialtyId'] ?? '', 'latest', 'topics'); ?>

    <!-- Main Content Area -->
    <main class="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
      
      <!-- Top Breadcrumbs & Back Bar -->
      <div class="flex items-center justify-between gap-4 mb-4 text-xs font-semibold text-slate-500">
        <a href="/forum?specialty=<?= urlencode($question['specialtyId'] ?? '') ?>&view=topics" 
           class="inline-flex items-center gap-2 hover:text-blue-600 transition-colors">
          <i class="fa-solid fa-arrow-left"></i>
          <span><?= $specialty ? htmlspecialchars($specialty['name_ko']) . ' 목록으로' : '포럼 목록으로' ?></span>
        </a>
        <span class="text-slate-400">
          게시일: <?= date('Y.m.d H:i', strtotime($question['createdAt'] ?? 'now')) ?>
        </span>
      </div>

      <!-- Thread Header Banner -->
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-2 flex-wrap">
          <?php if ($specialty): ?>
            <a href="/forum?specialty=<?= urlencode($specialty['id']) ?>&view=topics" 
               class="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border bg-white text-slate-800 shadow-2xs hover:border-blue-400 transition-colors">
              <span class="w-2.5 h-2.5 rounded-xs shrink-0" style="background-color: <?= htmlspecialchars($specialty['color']) ?>"></span>
              <span><?= htmlspecialchars($specialty['name_ko']) ?></span>
            </a>
          <?php endif; ?>

          <?php if (!empty($question['tags'])): ?>
            <?php foreach ($question['tags'] as $tag): ?>
              <span class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">#<?= htmlspecialchars($tag) ?></span>
            <?php endforeach; ?>
          <?php endif; ?>
        </div>

        <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
          <?= htmlspecialchars($question['title'] ?? '') ?>
        </h1>
      </div>

      <!-- Two-Column Thread Grid (Main Posts + Right Sidebar on Desktop) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Left Column: Posts Stream (8 cols) -->
        <div class="lg:col-span-8 space-y-6">
          
          <!-- Original Post (Question Card) -->
          <article class="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs relative">
            
            <!-- Author Header -->
            <div class="flex items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-100">
              <div class="flex items-center gap-3">
                <img src="<?= htmlspecialchars($question['authorAvatar'] ?: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80') ?>" 
                     alt="<?= htmlspecialchars($question['authorName'] ?? '작성자') ?>" 
                     class="w-10 h-10 rounded-full object-cover border border-slate-200" />
                <div>
                  <div class="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <span><?= htmlspecialchars($question['authorName'] ?? '익명') ?></span>
                    <?php if ($isQuestionClinician): ?>
                      <span class="text-[10px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.2 rounded-full">전문의</span>
                    <?php endif; ?>
                  </div>
                  <p class="text-xs text-slate-400"><?= date('Y-m-d H:i', strtotime($question['createdAt'] ?? 'now')) ?></p>
                </div>
              </div>

              <div class="text-right text-xs text-slate-400">
                <span>#1</span>
              </div>
            </div>

            <!-- Question Body -->
            <div class="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans mb-4">
              <?= htmlspecialchars($question['body'] ?? '') ?>
            </div>

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
                        <a href="<?= htmlspecialchars($question['images'][$i]) ?>" target="_blank" class="block rounded-xl overflow-hidden border border-slate-200 aspect-video hover:opacity-90 bg-slate-100">
                          <img src="<?= htmlspecialchars($question['images'][$i]) ?>" class="w-full h-full object-cover" alt="추가 이미지" />
                        </a>
                      <?php endfor; ?>
                    </div>
                  <?php endif; ?>
                <?php else: ?>
                  <!-- Medical Question Attached Photos Grid -->
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <?php foreach ($question['images'] as $qImg): ?>
                      <a href="<?= htmlspecialchars($qImg) ?>" target="_blank" class="block rounded-xl overflow-hidden border border-slate-200 aspect-video hover:opacity-90 bg-slate-100 shadow-2xs group relative">
                        <img src="<?= htmlspecialchars($qImg) ?>" class="w-full h-full object-cover" alt="상담 첨부 사진" />
                        <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                          <i class="fa-solid fa-magnifying-glass-plus"></i>
                          <span>확대</span>
                        </div>
                      </a>
                    <?php endforeach; ?>
                  </div>
                <?php endif; ?>
              </div>
            <?php endif; ?>

            <!-- Bottom Action Row -->
            <div class="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
              <div class="flex items-center gap-2">
                <span class="text-slate-400 flex items-center gap-1">
                  <i class="fa-regular fa-eye text-[11px]"></i> <?= (int)($question['viewCount'] ?? 0) ?>회 조회
                </span>
              </div>
              <div class="flex items-center gap-2">
                <a href="#reply-section" class="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  <i class="fa-solid fa-reply"></i> 답변 작성하기
                </a>
              </div>
            </div>
          </article>

          <!-- Answers Section Header -->
          <div class="flex items-center justify-between pt-2">
            <h2 class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <i class="fa-solid fa-comments text-blue-600"></i>
              <span>전문의 &amp; 커뮤니티 답변</span>
              <span class="text-xs font-extrabold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                <?= count($question['answers'] ?? []) ?>
              </span>
            </h2>
          </div>

          <!-- Chronological Answers Stream -->
          <?php if (empty($question['answers'])): ?>
            <div class="bg-white rounded-2xl p-8 text-center border border-slate-200/90 shadow-2xs">
              <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-3 text-lg">
                <i class="fa-solid fa-user-doctor"></i>
              </div>
              <p class="text-xs text-slate-600 font-bold mb-1">아직 등록된 답변이 없습니다.</p>
              <p class="text-[11px] text-slate-400">첫 번째 전문의 답변 또는 경험담을 남겨주세요!</p>
            </div>
          <?php else: ?>
            <div class="space-y-4">
              <?php 
              $ansIndex = 1;
              foreach ($question['answers'] as $ans): 
                $ansIndex++;
                $isClinician = !empty($ans['authorBadge']) && str_contains($ans['authorBadge'], 'Clinician');
                $hasUpvoted = !empty($ans['hasUpvoted']);
              ?>
                <article class="bg-white rounded-2xl p-6 border <?= $isClinician ? 'border-emerald-300 ring-2 ring-emerald-500/10 shadow-xs' : 'border-slate-200/90 shadow-2xs' ?> relative">
                  
                  <?php if ($isClinician): ?>
                    <!-- Verified Clinician Top Accent Ribbon -->
                    <div class="flex items-center gap-2 mb-3 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-200 inline-flex">
                      <i class="fa-solid fa-circle-check text-emerald-600 text-sm"></i>
                      <span>NJAP 공인 의료 전문가 인증 답변 (Verified Clinician)</span>
                    </div>
                  <?php endif; ?>

                  <!-- Answer Author Header -->
                  <div class="flex items-center justify-between gap-4 mb-4">
                    <div class="flex items-center gap-3">
                      <img src="<?= htmlspecialchars($ans['authorAvatar'] ?: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80') ?>" 
                           alt="<?= htmlspecialchars($ans['authorName'] ?? '답변자') ?>" 
                           class="w-10 h-10 rounded-full object-cover border <?= $isClinician ? 'border-emerald-500 ring-2 ring-emerald-400/30' : 'border-slate-200' ?>" />
                      <div>
                        <div class="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <span><?= htmlspecialchars($ans['authorName'] ?? '사용자') ?></span>
                          <?php if ($isClinician): ?>
                            <span class="text-[10px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.2 rounded-full">전문의</span>
                          <?php endif; ?>
                        </div>
                        <p class="text-xs text-slate-400"><?= date('Y-m-d H:i', strtotime($ans['createdAt'] ?? 'now')) ?></p>
                      </div>
                    </div>

                    <!-- Upvote Button -->
                    <div class="flex items-center gap-2">
                      <button onclick="handleUpvote('<?= htmlspecialchars($ans['id']) ?>', this)" 
                              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all <?= $hasUpvoted ? 'bg-red-50 text-red-600 border-red-300' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200' ?>"
                              title="유익한 답변 추천">
                        <i class="fa-<?= $hasUpvoted ? 'solid' : 'regular' ?> fa-heart text-red-500"></i>
                        <span class="upvote-count"><?= (int)($ans['upvotes'] ?? 0) ?></span>
                      </button>
                      <span class="text-xs text-slate-300 font-mono">#<?= $ansIndex ?></span>
                    </div>
                  </div>

                  <!-- Answer Body -->
                  <div class="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed whitespace-pre-line">
                    <?= htmlspecialchars($ans['body'] ?? '') ?>
                  </div>

                  <!-- Answer Attached Images -->
                  <?php if (!empty($ans['images'])): ?>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 mb-1">
                      <?php foreach ($ans['images'] as $aImg): ?>
                        <a href="<?= htmlspecialchars($aImg) ?>" target="_blank" class="block rounded-lg overflow-hidden border border-slate-200 aspect-video hover:opacity-90 bg-slate-100 relative group">
                          <img src="<?= htmlspecialchars($aImg) ?>" class="w-full h-full object-cover" alt="답변 첨부 이미지" />
                          <div class="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold">
                            <i class="fa-solid fa-magnifying-glass-plus mr-1"></i> 원본보기
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
            <h3 class="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <i class="fa-solid fa-reply text-blue-600"></i>
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
                    <i class="fa-solid fa-user-doctor mr-1"></i><span id="reply-badge-text">공인 전문의 인증 계정</span>
                  </span>
                </label>
                <input type="text" id="reply-author-name" name="author_name" required minlength="2"
                  placeholder="예: 홍길동, 또는 전문의 성함 및 진료과"
                  class="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600" />
              </div>

              <textarea id="reply-body" name="body" rows="4" required
                placeholder="의학적 소견, 경험담, 또는 조언을 상세히 적어주세요..." 
                class="w-full p-4 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 leading-relaxed"></textarea>

              <!-- Reply Image Attachment -->
              <div>
                <input type="file" id="reply-image-input" accept="image/jpeg,image/png,image/webp" multiple class="hidden" onchange="handleReplyImageSelect(this)">
                <div class="flex items-center gap-3">
                  <button type="button" onclick="triggerReplyImageUpload()" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors cursor-pointer">
                    <i class="fa-solid fa-camera text-blue-600"></i>
                    <span>사진 첨부 (JPEG/PNG)</span>
                  </button>
                  <span id="reply-upload-spinner" class="hidden text-xs text-blue-600 font-semibold flex items-center gap-1">
                    <i class="fa-solid fa-spinner fa-spin"></i> 업로드 중...
                  </span>
                </div>
                <div id="reply-images-preview" class="flex flex-wrap gap-2 mt-2 empty:mt-0"></div>
              </div>

              <div class="flex items-center justify-between flex-wrap gap-3 pt-2">
                <span class="text-[11px] text-slate-400">
                  ※ 제출 전 상단의 의료 면책 조항을 확인해 주세요.
                </span>
                <button type="submit" id="btn-submit-reply" class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2">
                  <i class="fa-solid fa-paper-plane"></i>
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
                <img src="<?= htmlspecialchars($question['authorAvatar'] ?: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80') ?>" 
                     title="<?= htmlspecialchars($question['authorName'] ?? '질문자') ?>"
                     class="w-7 h-7 rounded-full object-cover border border-slate-200" />
                <?php foreach (($question['answers'] ?? []) as $a): ?>
                  <img src="<?= htmlspecialchars($a['authorAvatar'] ?: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80') ?>" 
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

    </main>
  </div>

  <!-- Shared Global Footer Matching Website -->
  <?php render_forum_footer(); ?>

  <!-- Shared Auth Modals -->
  <?php render_forum_modals(); ?>

  <!-- Shared Auth & Sidebar Controller Scripts -->
  <?php render_forum_auth_scripts(); ?>

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

      const body = document.getElementById('reply-body').value.trim();
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
            body: body,
            images: replyUploadedImages
          })
        });
        const data = await res.json();
        if (data.success) {
          window.location.reload();
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
  </script>
</body>
</html>
