<?php
require_once __DIR__ . '/../api/forum_db.php';
require_once __DIR__ . '/components.php';

$roomId = trim($_GET['id'] ?? ($_GET['room_id'] ?? ''));
if (empty($roomId)) {
    header('Location: /forum?specialty=clubs');
    exit;
}

$room = forum_get_club_room($roomId);
if (!$room) {
    header('Location: /forum?specialty=clubs');
    exit;
}

$categories = forum_get_categories();
$currentCategory = forum_get_category_by_id('clubs');

// Room posts
$tagFilter = trim($_GET['tag'] ?? '');
$searchQuery = trim($_GET['q'] ?? '');
$posts = forum_get_club_posts($roomId, $tagFilter ?: null, $searchQuery);

// Status check
$isClosed = (($room['status'] ?? 'active') === 'closed');
$closeReason = $room['close_reason'] ?? '운영 정책 위반으로 제재(Flagged) 처리되었습니다.';

// Meta tags
$seoTitle = htmlspecialchars($room['name']) . ' - 동호회/동문회 룸 | NJ Access Portal';
$seoDesc = htmlspecialchars(mb_substr(strip_tags($room['description'] ?? $room['one_liner'] ?? ''), 0, 150));
$themeColor = $room['theme_color'] ?? '#1B6FA8';
$emblem = $room['emblem'] ?? 'fa-users';
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $seoTitle ?></title>
  <meta name="description" content="<?= $seoDesc ?>">
  <meta property="og:title" content="<?= $seoTitle ?>">
  <meta property="og:description" content="<?= $seoDesc ?>">
  <?php if (!empty($room['banner_url'])): ?>
  <meta property="og:image" content="<?= htmlspecialchars($room['banner_url']) ?>">
  <?php endif; ?>
  <link rel="icon" type="image/svg+xml" href="/logo-icon.svg">
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              navy: '#0F2342',
              blue: '<?= htmlspecialchars($themeColor) ?>',
              teal: '#7FC8C0',
              kakao: '#FEE500'
            }
          }
        }
      }
    }
  </script>
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="/forum/assets/forum.css?v=20261014">
  <style>
    .club-banner-bg {
      background: <?= !empty($room['banner_url']) ? "linear-gradient(to bottom, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.88) 100%), url('" . htmlspecialchars($room['banner_url']) . "')" : "linear-gradient(135deg, " . htmlspecialchars($themeColor) . " 0%, #0F2342 100%)" ?>;
      background-size: cover;
      background-position: center;
    }
    .leader-crown-badge {
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
      color: #FFFFFF;
      box-shadow: 0 2px 8px rgba(217, 119, 6, 0.35);
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased font-sans min-h-screen flex flex-col">

  <?php render_forum_header('', $currentCategory, 'clubs'); ?>

  <!-- Breadcrumb & Back to Directory -->
  <div class="bg-white border-b border-slate-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs sm:text-sm text-slate-500">
      <div class="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
        <a href="/forum" class="hover:text-blue-600 transition flex items-center gap-1">
          <i class="fa-solid fa-house"></i>
          <span>포럼 홈</span>
        </a>
        <i class="fa-solid fa-chevron-right text-[10px] text-slate-400"></i>
        <a href="/forum?specialty=clubs" class="hover:text-blue-600 font-medium transition">
          동호회/동문회
        </a>
        <i class="fa-solid fa-chevron-right text-[10px] text-slate-400"></i>
        <span class="text-slate-800 font-semibold truncate"><?= htmlspecialchars($room['name']) ?></span>
      </div>
      <a href="/forum?specialty=clubs" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition shrink-0">
        <i class="fa-solid fa-arrow-left"></i>
        <span>동호회 목록</span>
      </a>
    </div>
  </div>

  <main class="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">

    <?php if ($isClosed): ?>
    <!-- ⚠️ FLAGGED / CLOSED ROOM WARNING BANNER -->
    <div class="bg-red-50 border-2 border-red-500 rounded-2xl p-6 sm:p-8 text-center shadow-md mb-8 animate-pulse">
      <div class="w-16 h-16 mx-auto bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mb-4">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
      <span class="inline-block px-3 py-1 bg-red-600 text-white font-bold text-xs rounded-full uppercase tracking-wider mb-2">Room Flagged & Closed</span>
      <h2 class="text-2xl sm:text-3xl font-black text-red-700 mb-2">운영 정책 위반으로 제재(Flagged) 처리된 룸입니다</h2>
      <p class="text-red-900 font-bold text-lg mb-4">You are flagged. Contact: <a href="mailto:njaccessportal@gmail.com" class="underline hover:text-red-700">njaccessportal@gmail.com</a></p>
      <div class="bg-white/80 border border-red-200 rounded-xl p-4 max-w-2xl mx-auto text-left text-sm text-red-950">
        <p class="font-semibold mb-1">📌 제재 사유:</p>
        <p class="text-red-800"><?= htmlspecialchars($closeReason) ?></p>
        <p class="text-xs text-slate-500 mt-3">
          본 동호회/동문회 룸은 커뮤니티 이용 가이드라인 위반 또는 부적격 행위 접수로 인해 관리자에 의해 폐쇄 조치되었습니다. 이 룸에서는 신규 글 작성 및 활동이 전면 중단됩니다. 재심사나 문의 사항은 포털 공식 관리팀(<a href="mailto:njaccessportal@gmail.com" class="text-blue-600 underline">njaccessportal@gmail.com</a>)으로 연락 바랍니다.
        </p>
      </div>
    </div>
    <?php endif; ?>

    <!-- Mini-Site Hero Banner -->
    <div class="relative rounded-3xl overflow-hidden shadow-xl mb-8 club-banner-bg text-white">
      <div class="p-6 sm:p-10 flex flex-col justify-end min-h-[260px] sm:min-h-[320px] relative z-10">
        <!-- Top Tags & Badges -->
        <div class="flex flex-wrap items-center gap-2 mb-4">
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-1.5">
            <i class="fa-solid <?= htmlspecialchars($emblem) ?>"></i>
            <span><?= htmlspecialchars($room['type']) ?></span>
          </span>
          <span class="px-3 py-1 rounded-full text-xs font-medium bg-black/40 backdrop-blur-md text-white/90 flex items-center gap-1">
            <i class="fa-solid fa-location-dot text-red-400"></i>
            <span><?= htmlspecialchars($room['location']) ?></span>
          </span>
          <?php if ($isClosed): ?>
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
            제재(Flagged) 폐쇄됨
          </span>
          <?php else: ?>
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/90 text-white flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <span>정상 운영 중</span>
          </span>
          <?php endif; ?>
        </div>

        <!-- Room Title & One Liner -->
        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 drop-shadow-md">
          <?= htmlspecialchars($room['name']) ?>
        </h1>
        <p class="text-base sm:text-lg text-white/90 max-w-3xl font-normal leading-relaxed drop-shadow mb-6">
          <?= htmlspecialchars($room['one_liner'] ?? $room['description'] ?? '') ?>
        </p>

        <!-- Room Info Strip & Actions -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/20">
          <div class="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-white/90">
            <!-- 방장 Badge -->
            <div class="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
              <span class="leader-crown-badge w-6 h-6 rounded-full flex items-center justify-center text-xs">
                <i class="fa-solid fa-crown text-[11px]"></i>
              </span>
              <span class="font-bold text-amber-300">방장</span>
              <span class="font-semibold text-white"><?= htmlspecialchars($room['leader_name']) ?></span>
            </div>
            <div class="flex items-center gap-1.5">
              <i class="fa-solid fa-file-lines text-slate-300"></i>
              <span>게시글 <strong><?= number_format(count($posts)) ?></strong></span>
            </div>
            <div class="flex items-center gap-1.5">
              <i class="fa-solid fa-eye text-slate-300"></i>
              <span>조회수 <strong><?= number_format($room['view_count'] ?? 0) ?></strong></span>
            </div>
            <div class="flex items-center gap-1.5 text-slate-300 text-xs">
              <i class="fa-regular fa-calendar-check"></i>
              <span>개설일: <?= date('Y.m.d', strtotime($room['created_at'] ?? 'now')) ?></span>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex items-center gap-2">
            <?php if (!empty($room['kakao_chat_url'])): ?>
            <a href="<?= htmlspecialchars($room['kakao_chat_url']) ?>" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-xl bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition transform active:scale-95">
              <i class="fa-solid fa-comment text-amber-950"></i>
              <span>카카오톡 모임톡</span>
            </a>
            <?php endif; ?>

            <?php if (!$isClosed): ?>
            <button onclick="openClubPostModal()" class="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition transform active:scale-95">
              <i class="fa-solid fa-pen-nib text-blue-600"></i>
              <span>글쓰기</span>
            </button>
            <?php endif; ?>

            <button onclick="shareClubRoom()" class="w-9 h-9 rounded-xl bg-black/40 backdrop-blur-md text-white hover:bg-black/60 flex items-center justify-center text-xs transition" title="룸 공유하기">
              <i class="fa-solid fa-share-nodes"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 2-Column Mini-Site Body -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      <!-- Left / Sidebar: Room Profile & Notice -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Room Notice & Welcome Card -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div class="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm">
            <span class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs">
              <i class="fa-solid fa-bullhorn"></i>
            </span>
            <span>방장 환영 인사 & 공지</span>
          </div>
          <div class="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-3.5 rounded-xl border border-slate-100 mb-4"><?= htmlspecialchars(trim($room['notice'] ?: ($room['description'] ?: '회원 여러분 환영합니다! 활발하고 매너 있는 모임 활동을 부탁드립니다.'))) ?></div>

          <div class="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div class="flex justify-between">
              <span class="text-slate-400">모임 분류</span>
              <span class="font-semibold text-slate-800"><?= htmlspecialchars($room['type']) ?></span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">주요 활동 지역</span>
              <span class="font-semibold text-slate-800"><?= htmlspecialchars($room['location']) ?></span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-400">방장 연락처</span>
              <span class="text-slate-700 font-mono text-[11px]"><?= htmlspecialchars($room['leader_contact']) ?></span>
            </div>
          </div>
        </div>

        <!-- Room Rules & Manners Card -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <h3 class="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <i class="fa-solid fa-heart text-red-400 text-xs"></i>
            <span>동호회 활동 에티켓</span>
          </h3>
          <ul class="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
            <li>서로 배려하고 존중하는 언어를 사용해주세요.</li>
            <li>정모 참석 시 약속 시간을 철저히 준수합니다.</li>
            <li>상업적 스팸 홍보 및 타인 비방은 즉시 강퇴 처리됩니다.</li>
            <li>개인 정보 및 금융 거래 요구에 주의하세요.</li>
          </ul>
        </div>
      </div>

      <!-- Right / Main Content: In-Room Forum Board -->
      <div class="lg:col-span-3 space-y-6">
        
        <!-- Board Header & Filter Pills -->
        <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <!-- Tag Tabs -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <?php
            $tags = [
                '' => '전체글',
                '공지' => '📢 공지사항',
                '자유' => '💬 자유토크',
                '정모/후기' => '📅 정모/후기',
                '사진첩' => '📸 사진첩',
                'Q&A' => '❓ Q&A'
            ];
            foreach ($tags as $tKey => $tLabel):
                $isActive = ($tagFilter === $tKey);
                $link = '/forum/club.php?id=' . urlencode($roomId) . ($tKey ? '&tag=' . urlencode($tKey) : '');
            ?>
            <a href="<?= $link ?>" class="px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition <?= $isActive ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200' ?>">
              <?= $tLabel ?>
            </a>
            <?php endforeach; ?>
          </div>

          <!-- In-Room Write Button -->
          <?php if (!$isClosed): ?>
          <button onclick="openClubPostModal()" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition shrink-0">
            <i class="fa-solid fa-pen"></i>
            <span>룸에 글쓰기</span>
          </button>
          <?php endif; ?>
        </div>

        <!-- In-Room Posts List -->
        <?php if ($isClosed): ?>
        <div class="bg-white rounded-2xl p-12 text-center border border-red-200 text-slate-500">
          <i class="fa-solid fa-lock text-4xl text-red-400 mb-3 block"></i>
          <p class="font-bold text-red-600 text-base mb-1">제재 및 폐쇄된 룸입니다</p>
          <p class="text-xs text-slate-500">운영 정책 위반으로 인해 게시판 접근 및 조회가 제한되었습니다. 관리팀(njaccessportal@gmail.com)에 문의해주세요.</p>
        </div>
        <?php elseif (empty($posts)): ?>
        <div class="bg-white rounded-2xl p-12 text-center border border-slate-200/80 text-slate-500 shadow-sm">
          <div class="w-16 h-16 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mb-3">
            <i class="fa-regular fa-comments"></i>
          </div>
          <h3 class="font-bold text-slate-800 text-base mb-1">아직 등록된 게시글이 없습니다</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            동호회 회원들과 첫 번째 이야기나 정모 소식을 나눠보세요!
          </p>
          <button onclick="openClubPostModal()" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition">
            첫 글 작성하기
          </button>
        </div>
        <?php else: ?>
        <div class="space-y-3">
          <?php foreach ($posts as $p): 
            $isPostPinned = !empty($p['isPinned']);
            $isPostLeader = !empty($p['isLeader']);
            $pTag = $p['roomTag'] ?? '자유';
            $hasImages = !empty($p['images']) && count($p['images']) > 0;
            $replyCount = (int)($p['replyCount'] ?? 0);
            $likeCount = (int)($p['likeCount'] ?? 0);
            $viewCount = (int)($p['viewCount'] ?? 0);
            $pDate = date('Y.m.d', strtotime($p['createdAt'] ?? 'now'));
            $topicLink = '/forum/topic/' . urlencode($p['id']);
          ?>
          <div class="bg-white rounded-2xl p-4 sm:p-5 border <?= $isPostPinned ? 'border-amber-300 bg-amber-50/20 shadow-sm' : 'border-slate-200/80 hover:border-blue-300' ?> transition hover:shadow-md">
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <!-- Tag & Author -->
                <div class="flex flex-wrap items-center gap-2 mb-2 text-xs">
                  <?php if ($isPostPinned): ?>
                  <span class="px-2 py-0.5 rounded-md bg-amber-500 text-white font-bold text-[10px] flex items-center gap-1">
                    <i class="fa-solid fa-thumbtack text-[9px]"></i>
                    <span>공지</span>
                  </span>
                  <?php endif; ?>
                  <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-[11px]">
                    <?= htmlspecialchars($pTag) ?>
                  </span>
                  
                  <!-- Author & 방장 Badge -->
                  <div class="flex items-center gap-1.5 text-slate-700 font-medium">
                    <?php if ($isPostLeader): ?>
                    <span class="leader-crown-badge px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <i class="fa-solid fa-crown text-[9px]"></i>
                      <span>방장</span>
                    </span>
                    <?php endif; ?>
                    <span class="truncate max-w-[140px]"><?= htmlspecialchars($p['authorName'] ?? '익명') ?></span>
                  </div>

                  <span class="text-slate-400 text-[11px]">• <?= $pDate ?></span>
                </div>

                <!-- Post Title -->
                <h3 class="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-600 transition mb-1.5 leading-snug">
                  <a href="<?= $topicLink ?>">
                    <?= htmlspecialchars($p['title']) ?>
                  </a>
                </h3>

                <!-- Post Body Preview -->
                <p class="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  <?= htmlspecialchars(mb_substr(strip_tags($p['body'] ?? ''), 0, 160)) ?>
                </p>

                <!-- Post Meta (Views, Replies, Likes) -->
                <div class="flex items-center gap-4 text-xs text-slate-400 font-medium">
                  <span class="flex items-center gap-1">
                    <i class="fa-regular fa-eye"></i>
                    <span><?= $viewCount ?></span>
                  </span>
                  <span class="flex items-center gap-1 text-blue-600 font-semibold">
                    <i class="fa-regular fa-comment-dots"></i>
                    <span>댓글 <?= $replyCount ?></span>
                  </span>
                  <?php if ($likeCount > 0): ?>
                  <span class="flex items-center gap-1 text-rose-500">
                    <i class="fa-solid fa-heart"></i>
                    <span><?= $likeCount ?></span>
                  </span>
                  <?php endif; ?>
                </div>
              </div>

              <!-- Optional Thumbnail -->
              <?php if ($hasImages): ?>
              <a href="<?= $topicLink ?>" class="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src="<?= htmlspecialchars($p['images'][0]) ?>" alt="" class="w-full h-full object-cover hover:scale-105 transition duration-300" loading="lazy">
              </a>
              <?php endif; ?>
            </div>
          </div>
          <?php endforeach; ?>
        </div>
        <?php endif; ?>

      </div>
    </div>

    <!-- ⚠️ MANDATORY PLATFORM DISCLAIMER IN ROOM -->
    <div class="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 sm:p-6 text-sm text-amber-950 mt-10">
      <div class="flex items-start gap-3.5">
        <div class="w-8 h-8 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
          <i class="fa-solid fa-shield-halved text-sm"></i>
        </div>
        <div class="space-y-1.5 flex-1">
          <h4 class="font-bold text-amber-900 text-sm sm:text-base">동호회/동문회 룸 이용 안전 안내 및 플랫폼 면책 공고</h4>
          <p class="text-amber-800 leading-relaxed text-xs sm:text-sm">
            본 룸은 포털 이용자가 개설한 <strong>자율 운영 소모임 공간</strong>입니다. 
            NJ Access Portal(KACCESS)은 회원 간의 소통과 정보 교류를 돕기 위한 기술적 플랫폼 도구만을 제공하며, 
            각 동호회의 <strong>회비 징수, 사적 금전 거래, 오프라인 모임 활동 시 발생하는 일체의 사건·사고나 민형사상 분쟁에 대해 법적 책임을 지지 않습니다.</strong>
          </p>
          <p class="text-amber-800/80 text-xs">
            ※ 안전하고 건전한 커뮤니티 조성을 위해 사기, 불법 행위, 상업적 무단 광고, 성희롱 등 이용 가이드라인 위반 적발 시 사전 통보 없이 해당 룸은 즉각 <strong>제재(Flagged) 및 영구 폐쇄</strong> 처리됩니다. (신고 접수: <a href="mailto:njaccessportal@gmail.com" class="font-bold underline text-amber-950">njaccessportal@gmail.com</a>)
          </p>
        </div>
      </div>
    </div>

  </main>

  <!-- In-Room Post Writing Modal -->
  <div id="clubPostModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative animate-fade-in my-8 max-h-[90vh] overflow-y-auto">
      <button onclick="closeClubPostModal()" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <div class="flex items-center gap-2 mb-4">
        <span class="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
          <i class="fa-solid fa-pen-nib"></i>
        </span>
        <div>
          <h3 class="text-lg font-bold text-slate-900">룸 게시판 글쓰기</h3>
          <p class="text-xs text-slate-500"><?= htmlspecialchars($room['name']) ?></p>
        </div>
      </div>

      <form id="clubPostForm" onsubmit="handleClubPostSubmit(event)" class="space-y-4">
        <input type="hidden" name="roomId" value="<?= htmlspecialchars($roomId) ?>">

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">말머리 / 태그 <span class="text-red-500">*</span></label>
            <select name="tag" class="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white" required>
              <option value="자유">💬 자유토크</option>
              <option value="공지">📢 공지사항 (방장 전용)</option>
              <option value="정모/후기">📅 정모/후기</option>
              <option value="사진첩">📸 사진첩</option>
              <option value="Q&A">❓ Q&A</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">작성자 닉네임 <span class="text-red-500">*</span></label>
            <input type="text" name="author_name" placeholder="닉네임 입력" required class="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">제목 <span class="text-red-500">*</span></label>
          <input type="text" name="title" placeholder="글 제목을 입력하세요" required class="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">내용 <span class="text-red-500">*</span></label>
          <textarea name="body" rows="6" placeholder="회원들과 나누고 싶은 모임 이야기나 일정 등을 자유롭게 작성해주세요." required class="w-full text-xs rounded-xl border border-slate-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed"></textarea>
        </div>

        <!-- Leader Verification Toggle -->
        <div class="p-3 bg-amber-50 rounded-xl border border-amber-200">
          <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-900">
            <input type="checkbox" id="chkIsLeader" name="is_leader" value="1" onchange="toggleLeaderPinField(this.checked)" class="rounded text-amber-600 focus:ring-amber-500">
            <span>👑 이 룸의 방장으로 작성하기 (방장 뱃지 부여)</span>
          </label>
          <div id="leaderPinBox" class="hidden mt-2 pt-2 border-t border-amber-200/60">
            <label class="block text-[11px] text-amber-800 mb-1">개설 시 설정한 4자리 방장 비밀번호(PIN)</label>
            <input type="password" name="pin" maxlength="10" placeholder="PIN 번호 입력" class="w-36 text-xs rounded-lg border border-amber-300 p-2 focus:border-amber-500 bg-white">
          </div>
        </div>

        <!-- Image Upload -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">사진 첨부 (선택)</label>
          <input type="file" id="clubPostImageFile" accept="image/jpeg,image/png,image/webp" class="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
          <input type="hidden" name="image_url" id="clubPostImageUrl" value="">
          <div id="clubPostImgPreview" class="hidden mt-2">
            <img src="" alt="" class="h-20 w-auto rounded-lg object-cover border border-slate-200">
          </div>
        </div>

        <div class="pt-2 flex items-center justify-end gap-2">
          <button type="button" onclick="closeClubPostModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition">
            취소
          </button>
          <button type="submit" id="btnSubmitPost" class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition">
            등록하기
          </button>
        </div>
      </form>
    </div>
  </div>

  <?php render_forum_footer(); ?>

  <script>
    function openClubPostModal() {
      document.getElementById('clubPostModal').classList.remove('hidden');
    }
    function closeClubPostModal() {
      document.getElementById('clubPostModal').classList.add('hidden');
    }
    function toggleLeaderPinField(checked) {
      const box = document.getElementById('leaderPinBox');
      if (checked) {
        box.classList.remove('hidden');
      } else {
        box.classList.add('hidden');
      }
    }

    // Image Upload helper
    document.getElementById('clubPostImageFile')?.addEventListener('change', async function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await fetch('/api/forum.php?action=upload_club_banner', {
          method: 'POST',
          body: formData
        });
        const json = await res.json();
        if (json.success && json.url) {
          document.getElementById('clubPostImageUrl').value = json.url;
          const prev = document.getElementById('clubPostImgPreview');
          prev.querySelector('img').src = json.url;
          prev.classList.remove('hidden');
        } else {
          alert(json.error || '이미지 업로드에 실패했습니다.');
        }
      } catch (err) {
        alert('이미지 업로드 통신 오류가 발생했습니다.');
      }
    });

    // Handle post submission
    async function handleClubPostSubmit(e) {
      e.preventDefault();
      const form = e.target;
      const btn = document.getElementById('btnSubmitPost');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 등록 중...';

      const formData = new FormData(form);
      const payload = {
        roomId: formData.get('roomId'),
        tag: formData.get('tag'),
        author_name: formData.get('author_name'),
        title: formData.get('title'),
        body: formData.get('body'),
        is_leader: formData.get('is_leader') ? 1 : 0,
        pin: formData.get('pin') || '',
        images: formData.get('image_url') ? [formData.get('image_url')] : []
      };

      try {
        const res = await fetch('/api/forum.php?action=create_club_post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success) {
          alert('게시글이 성공적으로 등록되었습니다.');
          window.location.reload();
        } else {
          alert(json.error || '글 등록에 실패했습니다.');
          btn.disabled = false;
          btn.innerHTML = '등록하기';
        }
      } catch (err) {
        alert('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        btn.disabled = false;
        btn.innerHTML = '등록하기';
      }
    }

    function shareClubRoom() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        alert('룸 주소가 클립보드에 복사되었습니다.');
      } else {
        alert('주소: ' + window.location.href);
      }
    }
  </script>
</body>
</html>
