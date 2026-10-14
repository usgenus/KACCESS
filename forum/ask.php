<?php
require_once __DIR__ . '/../api/forum_db.php';
require_once __DIR__ . '/components.php';

$rawCategory = trim($_GET['category'] ?? ($_GET['specialty'] ?? ''));
$rawSub = trim($_GET['sub'] ?? '');

$categories = forum_get_categories();
$allSubBoards = forum_get_sub_boards();
$clinicalSubSpecialties = forum_get_default_sub_specialties();

// Pre-selection mapping
$selectedCatId = 'community';
$selectedSubBoardId = '';

if (!empty($rawCategory)) {
    $cat = forum_get_category_by_id($rawCategory);
    if ($cat) {
        $selectedCatId = $cat['id'];
        $selectedSubBoardId = $rawSub;
    } else {
        $mapped = forum_map_specialty_to_category($rawCategory, $rawSub);
        $selectedCatId = $mapped['categoryId'];
        $selectedSubBoardId = $rawSub ?: ($mapped['subBoardId'] ?? '');
    }
}
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>새 글 및 질문 작성하기 | 뉴저지 한인 광장 (NJAP)</title>
  <meta name="robots" content="noindex, follow" />
  <link rel="canonical" href="https://njaccessportal.com/forum/ask" />
  <link rel="icon" href="/favicon.ico">
  
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
    body.senior-mode input, body.senior-mode textarea, body.senior-mode select {
      font-size: 1.15rem !important;
    }
    .header-spacer {
      height: 148px !important;
      min-height: 148px !important;
      display: block !important;
      width: 100% !important;
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
  </style>
</head>
<body class="bg-[#F8FAFC] text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-[#1B6FA8] selection:text-white">

  <!-- Top Global Header -->
  <?php render_forum_header('', null, $selectedCatId); ?>

  <!-- Main Forum Layout: Sidebar + Ask Form -->
  <div class="flex-1 flex w-full max-w-[1560px] mx-auto">
    
    <!-- Left Sidebar -->
    <?php render_forum_sidebar($categories, $selectedCatId, 'latest', 'topics'); ?>

    <!-- Main Content Area -->
    <main class="flex-1 min-w-0 p-3 sm:p-5 lg:p-7">

      <!-- Breadcrumbs -->
      <div class="flex items-center gap-2 mb-4 text-xs sm:text-sm font-bold text-slate-500">
        <a href="/forum" class="hover:text-[#1B6FA8] transition-colors">포럼 홈</a>
        <span class="text-slate-300">›</span>
        <span class="text-slate-800">새 글 및 질문 작성</span>
      </div>

      <!-- Frictionless New Topic Composer Card (MissyUSA simplicity) -->
      <div class="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-2xs max-w-4xl">
        
        <div class="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div>
            <h1 class="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>글 작성하기</span>
              <span class="text-xs font-bold bg-blue-100 text-[#1B6FA8] px-2.5 py-0.5 rounded-full">3초 간편 등록</span>
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">
              궁금한 점, 병원 후기, 중고 물품, 구인구직 정보를 이웃들과 자유롭게 나누어보세요.
            </p>
          </div>
          <a href="/forum" class="text-slate-400 hover:text-slate-600 p-2 font-bold text-lg" title="취소하고 돌아가기">
            ✕
          </a>
        </div>

        <form id="ask-form" onsubmit="handleAskSubmit(event)" class="space-y-5">
          
          <!-- 1. Category & Sub-board Selectors -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <!-- Category Dropdown -->
            <div>
              <label for="category_id" class="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                게시판 선택 <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select id="category_id" name="category_id" required onchange="handleCategoryChange(this.value)"
                  class="w-full p-3 pr-10 rounded-xl border border-slate-300 text-sm sm:text-base bg-white font-bold text-slate-900 focus:outline-none focus:border-[#1B6FA8] appearance-none shadow-2xs">
                  <?php foreach ($categories as $cat): 
                    $selected = ($cat['id'] === $selectedCatId) ? 'selected' : '';
                  ?>
                    <option value="<?= htmlspecialchars($cat['id']) ?>" <?= $selected ?>>
                      <?= htmlspecialchars($cat['name_ko']) ?> (<?= htmlspecialchars($cat['name_en']) ?>)
                    </option>
                  <?php endforeach; ?>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <i class="fa-solid fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>

            <!-- Dynamic Sub-Board Dropdown -->
            <div id="sub-board-container">
              <label for="sub_board_id" class="block text-xs sm:text-sm font-bold text-[#1B6FA8] mb-1.5 flex items-center justify-between">
                <span>세부 게시판 선택</span>
                <span id="expert-notice" class="text-[11px] text-amber-700 font-normal hidden">※ 전문가 인증 회원만 작성 가능</span>
              </label>
              <div class="relative">
                <select id="sub_board_id" name="sub_board_id" onchange="handleSubBoardChange(this.value)"
                  class="w-full p-3 pr-10 rounded-xl border border-blue-300 bg-blue-50/40 text-sm sm:text-base font-bold text-slate-900 focus:outline-none focus:border-[#1B6FA8] appearance-none shadow-2xs">
                  <!-- Populated via JS based on selected category -->
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#1B6FA8]">
                  <i class="fa-solid fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>

          </div>

          <!-- Dynamic Clinical Sub-specialty (for 의학 Q&A) -->
          <div id="clin-specialty-container" class="hidden">
            <label for="clin_specialty_id" class="block text-xs sm:text-sm font-bold text-[#1B6FA8] mb-1.5">
              <span>진료과목 선택 (19대 전문 진료과)</span>
            </label>
            <div class="relative">
              <select id="clin_specialty_id" name="clin_specialty_id"
                class="w-full p-3 pr-10 rounded-xl border border-blue-300 bg-blue-50/30 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#1B6FA8] appearance-none shadow-2xs">
                <option value="">일반 / 전문의 배정 (진료과 미지정)</option>
                <?php foreach ($clinicalSubSpecialties as $cs): ?>
                  <option value="<?= htmlspecialchars($cs['id']) ?>">
                    <?= htmlspecialchars($cs['name_ko']) ?> (<?= htmlspecialchars($cs['name_en']) ?>)
                  </option>
                <?php endforeach; ?>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#1B6FA8]">
                <i class="fa-solid fa-chevron-down text-xs"></i>
              </div>
            </div>
          </div>

          <!-- Extra Services Wanted / Requests Fields (Budget / Pay & Location) -->
          <div id="wanted-fields-container" class="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/90 space-y-3 hidden">
            <div class="flex items-center gap-2 text-teal-950 font-bold text-xs">
              <i class="fa-solid fa-handshake-angle text-teal-600"></i>
              <span>서비스 (구해요·교육·수리) 상세 옵션</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label for="wanted_budget" class="block text-xs font-bold text-teal-900 mb-1">
                  희망 사례비 / 시급 (예: $25/시간, 협의)
                </label>
                <input type="text" id="wanted_budget" placeholder="예: $25/시간 또는 협의"
                  class="w-full p-2.5 rounded-xl border border-teal-300 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-teal-600" />
              </div>
              <div>
                <label for="wanted_location" class="block text-xs font-bold text-teal-900 mb-1">
                  서비스 희망 지역 (예: 포트리, 팰팍)
                </label>
                <input type="text" id="wanted_location" placeholder="예: Fort Lee, NJ"
                  class="w-full p-2.5 rounded-xl border border-teal-300 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-teal-600" />
              </div>
              <div>
                <label for="wanted_schedule" class="block text-xs font-bold text-teal-900 mb-1">
                  희망 일정 / 주기 (예: 주 2회, 10/15)
                </label>
                <input type="text" id="wanted_schedule" placeholder="예: 평일 오후 2~5시"
                  class="w-full p-2.5 rounded-xl border border-teal-300 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-teal-600" />
              </div>
            </div>
          </div>

          <!-- Extra Market / Buy & Sell Fields (Price, Location, Condition) -->
          <div id="market-fields-container" class="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/90 space-y-4 hidden">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label for="price" class="block text-xs font-bold text-amber-900 mb-1">
                  가격 (예: $350)
                </label>
                <input type="text" id="price" name="price" placeholder="예: $350"
                  class="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-600" />
              </div>
              <div>
                <label for="location" class="block text-xs font-bold text-amber-900 mb-1">
                  지역 / 타운명 (예: Fort Lee, Palisades Park)
                </label>
                <input type="text" id="location" name="location" placeholder="예: Fort Lee, NJ"
                  class="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-600" />
              </div>
              <div>
                <label for="item_condition" class="block text-xs font-bold text-amber-900 mb-1">
                  상태 / 옵션 (예: 상태 최상, 네고 가능)
                </label>
                <input type="text" id="item_condition" name="item_condition" placeholder="예: 상태 최상"
                  class="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-600" />
              </div>
            </div>
          </div>

          <!-- 연락 방법 (Craigslist Style Contact Methods - For Market & Wanted) -->
          <div id="trade-contact-container" class="p-4 rounded-2xl bg-amber-50/70 border border-amber-300/80 space-y-3 hidden">
            <label class="block text-xs font-extrabold text-amber-950 mb-1.5">
              연락 방법 <span class="text-red-500">*</span> <span class="text-[11px] font-normal text-amber-800">(최소 1개 이상 필수 선택)</span>
            </label>
            <div class="flex items-center gap-4 sm:gap-6 flex-wrap text-xs sm:text-sm font-bold text-slate-800 mb-3">
              <label class="inline-flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" id="contact_method_tel" name="contact_methods[]" value="tel" onchange="togglePhoneRequirements()" class="rounded border-amber-400 text-[#1B6FA8] focus:ring-[#1B6FA8]">
                <span>전화</span>
              </label>
              <label class="inline-flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" id="contact_method_sms" name="contact_methods[]" value="sms" onchange="togglePhoneRequirements()" class="rounded border-amber-400 text-[#1B6FA8] focus:ring-[#1B6FA8]">
                <span>문자</span>
              </label>
              <label class="inline-flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" id="contact_method_email" name="contact_methods[]" value="email" checked onchange="togglePhoneRequirements()" class="rounded border-amber-400 text-[#1B6FA8] focus:ring-[#1B6FA8]">
                <span>이메일</span>
              </label>
            </div>

            <!-- Phone Input & Visibility (Shown/Required when 전화 or 문자 checked) -->
            <div id="market-phone-box" class="p-3 bg-white/95 rounded-xl border border-amber-200/90 space-y-2.5 hidden">
              <div>
                <label for="contact_phone" class="block text-xs font-bold text-slate-800 mb-1">
                  연락처 전화번호 <span class="text-red-500">*</span> <span class="text-[11px] font-normal text-slate-500">(010-XXXX-XXXX 또는 XXX-XXX-XXXX)</span>
                </label>
                <input type="tel" id="contact_phone" name="contact_phone" placeholder="예: 201-555-0123 또는 010-1234-5678"
                  class="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans text-slate-900 focus:outline-none focus:border-[#1B6FA8]" />
              </div>
              <div>
                <span class="block text-xs font-bold text-slate-700 mb-1">전화번호 공개 설정:</span>
                <div class="flex items-center gap-4 text-xs font-semibold text-slate-800">
                  <label class="inline-flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="phone_visible" value="1" checked class="text-[#1B6FA8] focus:ring-[#1B6FA8]">
                    <span>번호 공개</span>
                  </label>
                  <label class="inline-flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="phone_visible" value="0" class="text-[#1B6FA8] focus:ring-[#1B6FA8]">
                    <span>번호 비공개 (이메일로만 연락)</span>
                  </label>
                </div>
              </div>
            </div>

            <div id="market-email-info" class="text-[11px] text-amber-900 bg-amber-100/70 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <i class="fa-solid fa-shield-halved text-amber-700"></i>
              <span>이메일 문의는 가입 계정 이메일로 안전 전달되며, 구매자/지원자에게 실제 이메일 주소가 직접 노출되지 않습니다.</span>
            </div>
          </div>

          <!-- 10-Star Rating Picker: 10 stars the best, 0 stars worst (0 ~ 10점 만점) -->
          <div id="review-rating-container" class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 hidden">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <label class="block text-xs sm:text-sm font-extrabold text-amber-900 mb-1 flex items-center gap-1.5">
                  <i class="fa-solid fa-star text-amber-500"></i>
                  <span>만족도 평점 (0 ~ 10점 만점)</span>
                </label>
                <p class="text-xs text-amber-700">10점이 최고 (Best ⭐), 0점이 최악 (Worst)입니다.</p>
              </div>
              <div class="flex items-center gap-3">
                <input type="range" id="rating-slider" min="0" max="10" step="0.5" value="10" 
                       oninput="updateRatingDisplay(this.value)"
                       class="w-32 sm:w-40 accent-amber-500 cursor-pointer">
                <div class="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-amber-300 shadow-2xs">
                  <span id="rating-stars" class="text-amber-400 text-xs tracking-tight"></span>
                  <span id="rating-display-text" class="font-black text-amber-600 text-sm">10</span>
                  <span class="text-slate-400 text-xs">/ 10점</span>
                </div>
              </div>
            </div>
            <input type="hidden" id="rating_val" name="rating_val" value="10">
          </div>

          <!-- Author Nickname & Title -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="author_name" class="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                <span>작성자 닉네임 / 성함 <span class="text-red-500">*</span></span>
                <span id="author-badge-indicator" class="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md hidden">
                  <span id="author-badge-text">공인 전문가 인증 계정</span>
                </span>
              </label>
              <input type="text" id="author_name" name="author_name" required minlength="2"
                placeholder="예: 포트리주민, 행복맘 (익명 가능)" value="익명 이웃"
                class="w-full p-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#1B6FA8] shadow-2xs" />
            </div>

            <div>
              <label for="location_opt" class="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                거주 타운 / 지역 (선택 사항)
              </label>
              <input type="text" id="location_opt" name="location_opt"
                placeholder="예: 버겐카운티, 팰리세이즈 파크" 
                class="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-[#1B6FA8] shadow-2xs" />
            </div>
          </div>

          <!-- Profile Emoticon Avatar Picker -->
          <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/60">
            <?php render_avatar_picker('ask'); ?>
          </div>

          <!-- Title Input -->
          <div>
            <label for="title" class="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
              제목 <span class="text-red-500">*</span>
            </label>
            <input type="text" id="title" name="title" required minlength="4"
              placeholder="제목을 입력해 주세요 (예: 포트리 1베드 아파트 서브리스 놓습니다 / 메디케어 Part B 신청 질문)" 
              class="w-full p-3.5 rounded-xl border border-slate-300 text-sm sm:text-base font-bold text-slate-900 focus:outline-none focus:border-[#1B6FA8] shadow-2xs" />
          </div>

          <!-- Body Textarea -->
          <div>
            <label for="body" class="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
              상세 내용 <span class="text-red-500">*</span>
            </label>
            <textarea id="body" name="body" rows="8" required minlength="5"
              placeholder="궁금하신 내용이나 나누고 싶은 이야기를 자유롭게 작성해 주세요.&#10;&#10;• 중고거래/부동산: 거래 장소, 상세 규격, 연락 방법 등&#10;• 병원후기/의료질문: 증상 발생 시기, 보험 유무, 진료 경험 등" 
              class="w-full p-3.5 rounded-xl border border-slate-300 text-sm leading-relaxed text-slate-900 focus:outline-none focus:border-[#1B6FA8] shadow-2xs"></textarea>
          </div>

          <!-- Photo Attachment Strip (Craigslist-style, required for Buy & Sell / Real Estate) -->
          <div class="p-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 hover:bg-blue-50/20 transition-all">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <span class="text-xs sm:text-sm font-bold text-slate-800 block">📸 사진 첨부 (최대 5장)</span>
                <span class="text-[11px] text-slate-400">부동산/렌트, 중고거래 매물은 사진을 첨부하시면 포럼 홈 메인 카드에 노출됩니다</span>
              </div>
              <button type="button" onclick="triggerAskImageUpload()" class="px-4 py-2 bg-white border border-slate-300 hover:border-[#1B6FA8] text-xs font-bold text-slate-700 hover:text-[#1B6FA8] rounded-xl shadow-2xs transition-all self-start sm:self-auto cursor-pointer">
                <i class="fa-regular fa-image mr-1 text-[#1B6FA8]"></i>사진 추가하기
              </button>
            </div>
            
            <input type="file" id="ask-image-input" accept="image/jpeg,image/png,image/webp" multiple class="hidden" onchange="handleAskImageSelect(this)">

            <!-- Uploading Spinner -->
            <div id="ask-upload-spinner" class="hidden my-2 text-xs text-[#1B6FA8] font-semibold flex items-center gap-2">
              <i class="fa-solid fa-spinner fa-spin"></i>
              <span>사진 업로드 중...</span>
            </div>

            <!-- Preview Grid -->
            <div id="ask-images-preview" class="flex flex-wrap gap-2.5 empty:hidden mt-2"></div>
          </div>

          <!-- YouTube Video Attachment Strip -->
          <div class="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/70">
            <div class="flex items-center justify-between gap-3 mb-2">
              <label for="video_url" class="block text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <i class="fa-brands fa-youtube text-red-600 text-base"></i>
                <span>YouTube 동영상 링크 첨부</span>
                <span class="text-[11px] font-normal text-slate-500">(선택 사항)</span>
              </label>
              <span class="text-[11px] text-[#1B6FA8] font-bold hidden sm:inline-block">게시글 본문에 동영상 창 자동 생성</span>
            </div>
            
            <div class="relative">
              <input type="url" id="video_url" name="video_url"
                oninput="handleYoutubeUrlInput(this.value)"
                placeholder="YouTube 동영상 링크를 붙여넣으세요 (예: https://www.youtube.com/watch?v=... 또는 https://youtu.be/...)" 
                class="w-full p-3 pl-3.5 pr-10 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans text-slate-800 bg-white focus:outline-none focus:border-[#1B6FA8] shadow-2xs" />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <i class="fa-brands fa-youtube text-red-600 text-base"></i>
              </div>
            </div>

            <!-- Live YouTube Video Preview Window -->
            <div id="youtube-preview-container" class="hidden mt-3 pt-3 border-t border-slate-200">
              <div class="text-[11px] font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-red-600 inline-block"></span>
                <span>동영상 재생 화면 미리보기:</span>
              </div>
              <div class="relative w-full aspect-video max-w-lg rounded-2xl overflow-hidden border border-slate-200 bg-black shadow-sm">
                <iframe id="youtube-preview-iframe" class="w-full h-full" src="" title="YouTube 동영상 미리보기" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            </div>
          </div>

          <!-- Marketplace & Wanted Disclaimer Checkbox (Required for Market and Wanted category) -->
          <div id="market-disclaimer-box" class="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-xs space-y-2.5 hidden">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5 font-black text-xs sm:text-sm">
                <i id="market-disclaimer-icon" class="fa-solid fa-triangle-exclamation text-amber-600"></i>
                <span id="market-disclaimer-title">거래 및 서비스 요청 주의 안내</span>
              </div>
              <button type="button" id="market-disclaimer-modal-btn" onclick="openMarketDisclaimerModal()" class="text-[11px] font-bold underline hover:text-black cursor-pointer">
                약관 전문 보기
              </button>
            </div>
            <p id="market-disclaimer-desc" class="text-xs leading-relaxed">
              뉴저지 한인 광장 중고거래 및 구해요는 회원 간 직거래와 맞춤 생활 도움 요청을 위한 게시판입니다. NJ Access Portal은 거래의 당사자가 아니며, 게시글의 진위·상품 상태·서비스 제공·거래 안전을 보증하지 않습니다. 금전 거래, 사기, 분쟁, 손해에 대해 당사는 책임을 지지 않습니다. 자세한 내용은 약관 및 면책 안내를 확인하세요.
            </p>
            <label class="flex items-start gap-2 pt-2 border-t border-slate-200/80 cursor-pointer font-bold text-slate-900 select-none">
              <input type="checkbox" id="market_disclaimer_agree" name="market_disclaimer_agree" class="mt-0.5 rounded border-amber-400 text-[#1B6FA8] focus:ring-[#1B6FA8]">
              <span id="market-disclaimer-agree-label" class="leading-snug">위 주의 안내를 읽었으며, 거래 및 서비스 관련 분쟁·손해에 대해 NJ Access Portal에 책임을 묻지 않겠습니다. <span class="text-red-500">*</span></span>
            </label>
          </div>

          <!-- Submit Action Button (Frictionless: 1 click to post) -->
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
            <a href="/forum" class="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs sm:text-sm font-bold transition-colors">
              취소
            </a>

            <button type="submit" id="btn-submit-ask"
              class="px-6 py-3 rounded-xl bg-[#1B6FA8] hover:bg-[#155A8A] text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer">
              <i class="fa-solid fa-paper-plane text-xs"></i>
              <span>게시글 등록하기</span>
            </button>
          </div>

        </form>

      </div>

      <!-- Section Specific Safety & Policy Disclaimer Strip (At bottom of site) -->
      <?php render_forum_disclaimer_banner('mt-8', $selectedCategory); ?>

    </main>

  </div>

  <!-- Global Footer -->
  <?php render_forum_footer(); ?>

  <!-- Modals & Auth Scripts -->
  <?php render_forum_modals(); ?>
  <?php render_forum_auth_scripts(); ?>

  <script>
    const subBoardsData = <?= json_encode($allSubBoards, JSON_UNESCAPED_UNICODE) ?>;
    const selectedSubPreload = <?= json_encode($selectedSubBoardId) ?>;
    let uploadedImages = [];

    function handleCategoryChange(catId) {
      const subContainer = document.getElementById('sub-board-container');
      const subSelect = document.getElementById('sub_board_id');
      const clinContainer = document.getElementById('clin-specialty-container');
      const marketContainer = document.getElementById('market-fields-container');
      const expertNotice = document.getElementById('expert-notice');

      const subs = subBoardsData[catId] || [];

      if (subs.length > 0) {
        subContainer.classList.remove('hidden');
        subSelect.innerHTML = subs.map(sb => `
          <option value="${sb.id}" ${(sb.id === selectedSubPreload) ? 'selected' : ''}>
            ${sb.name_ko}
          </option>
        `).join('');
      } else {
        subContainer.classList.add('hidden');
        subSelect.innerHTML = '<option value="">(세부 게시판 없음)</option>';
      }

      // Show/Hide Wanted Specific Fields
      const wantedContainer = document.getElementById('wanted-fields-container');
      if (catId === 'wanted') {
        wantedContainer?.classList.remove('hidden');
      } else {
        wantedContainer?.classList.add('hidden');
      }

      // Show/Hide Market Specific Fields (price, location, condition)
      if (catId === 'market') {
        marketContainer.classList.remove('hidden');
      } else {
        marketContainer.classList.add('hidden');
      }

      // Show/Hide Contact Methods & Disclaimer (for BOTH Market and Wanted)
      const tradeContactContainer = document.getElementById('trade-contact-container');
      const marketDisclaimerBox = document.getElementById('market-disclaimer-box');
      if (catId === 'market' || catId === 'wanted') {
        tradeContactContainer?.classList.remove('hidden');
        marketDisclaimerBox?.classList.remove('hidden');
        togglePhoneRequirements();

        if (catId === 'wanted') {
          marketDisclaimerBox.className = 'p-4 rounded-2xl bg-teal-50/90 border border-teal-300 text-xs space-y-2.5';
          const icon = document.getElementById('market-disclaimer-icon');
          if (icon) icon.className = 'fa-solid fa-handshake-angle text-teal-600';
          const title = document.getElementById('market-disclaimer-title');
          if (title) title.innerText = '생활·교육·커뮤니티 서비스 이용 주의 및 면책 안내';
          const btn = document.getElementById('market-disclaimer-modal-btn');
          if (btn) {
            btn.setAttribute('onclick', 'openServiceDisclaimerModal()');
            btn.className = 'text-[11px] font-bold text-teal-800 underline hover:text-black cursor-pointer';
            btn.innerText = '서비스 약관 전문 보기';
          }
          const desc = document.getElementById('market-disclaimer-desc');
          if (desc) {
            desc.className = 'text-teal-900 text-xs leading-relaxed';
            desc.innerText = '뉴저지 한인 광장 서비스는 회원 상호 간 맞춤 생활 편의, 교육/레슨, 심부름 등 서비스 요청 및 제공에 관한 자율적 정보 교류 공간입니다. NJ Access Portal은 서비스 계약의 당사자 또는 고용주가 아니며, 업무 조건·자격·안전을 보증하지 않습니다. 당사자 간 계약 불이행, 금전 거래, 사고, 분쟁, 손해에 대해 당사는 법적 책임을 지지 않습니다.';
          }
          const agreeLabel = document.getElementById('market-disclaimer-agree-label');
          if (agreeLabel) {
            agreeLabel.innerHTML = '위 서비스 이용 주의 및 면책 안내를 읽었으며, 서비스 거래 및 제공 관련 분쟁·손해에 대해 NJ Access Portal에 책임을 묻지 않겠습니다. <span class="text-red-500">*</span>';
          }
        } else {
          marketDisclaimerBox.className = 'p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-xs space-y-2.5';
          const icon = document.getElementById('market-disclaimer-icon');
          if (icon) icon.className = 'fa-solid fa-triangle-exclamation text-amber-600';
          const title = document.getElementById('market-disclaimer-title');
          if (title) title.innerText = '중고거래 안전 주의 및 면책 안내';
          const btn = document.getElementById('market-disclaimer-modal-btn');
          if (btn) {
            btn.setAttribute('onclick', 'openMarketDisclaimerModal()');
            btn.className = 'text-[11px] font-bold text-amber-900 underline hover:text-black cursor-pointer';
            btn.innerText = '약관 전문 보기';
          }
          const desc = document.getElementById('market-disclaimer-desc');
          if (desc) {
            desc.className = 'text-amber-900 text-xs leading-relaxed';
            desc.innerText = '뉴저지 한인 광장 중고거래는 회원 간 직거래를 위한 게시판입니다. NJ Access Portal은 거래의 당사자가 아니며, 게시글의 진위·상품 상태·거래 안전을 보증하지 않습니다. 금전 거래, 사기, 분쟁, 손해에 대해 당사는 책임을 지지 않습니다. 자세한 내용은 약관 및 면책 안내를 확인하세요.';
          }
          const agreeLabel = document.getElementById('market-disclaimer-agree-label');
          if (agreeLabel) {
            agreeLabel.innerHTML = '위 중고거래 주의 안내를 읽었으며, 거래 관련 분쟁 및 손해에 대해 NJ Access Portal에 책임을 묻지 않겠습니다. <span class="text-red-500">*</span>';
          }
        }
      } else {
        tradeContactContainer?.classList.add('hidden');
        marketDisclaimerBox?.classList.add('hidden');
      }

      // Update bottom disclaimer banner dynamically for selected category
      updateAskDisclaimerBanner(catId);

      // Show/Hide Review Rating Container (for food or reviews)
      const reviewContainer = document.getElementById('review-rating-container');
      if (catId === 'food' || catId === 'restaurants') {
        reviewContainer?.classList.remove('hidden');
      } else {
        reviewContainer?.classList.add('hidden');
      }

      // Show/Hide Expert Warning
      if (catId === 'columns') {
        expertNotice.classList.remove('hidden');
      } else {
        expertNotice.classList.add('hidden');
      }

      // Check Clinical Subspecialty
      handleSubBoardChange(subSelect.value);
    }

    function updateAskDisclaimerBanner(catId) {
      const tagElem = document.getElementById('forum-disclaimer-tag');
      const headlineElem = document.getElementById('forum-disclaimer-headline');
      const subtextElem = document.getElementById('forum-disclaimer-subtext');
      if (!tagElem || !headlineElem || !subtextElem) return;

      const mapping = {
        'medical': {
          tag: '의료 면책 안내',
          headline: '본 포럼의 정보는 교육 및 일반 정보 제공 목적이며 전문 진료를 대체하지 않습니다',
          subtext: '본 포럼의 모든 질문·답변, 상담 및 후기는 비대면 정보 나눔 및 교육 목적이며 개별 의학적 진단을 대신하지 않습니다. 긴급을 요하는 응급 증상은 즉시 911에 연락하십시오.'
        },
        'market': {
          tag: '중고거래 안전 안내',
          headline: '뉴저지 한인 광장 중고거래는 회원 간 직거래를 위한 게시판입니다',
          subtext: 'NJ Access Portal은 거래의 당사자가 아니며 물품 상태나 거래 안전을 보증하지 않습니다. 안전 거래 수칙을 준수하시고 하단의 이용약관 및 면책 안내를 확인하세요.'
        },
        'wanted': {
          tag: '서비스 및 커뮤니티 면책 안내',
          headline: '뉴저지 한인 광장 서비스는 회원 간 자율 생활 도움, 과외·교육, 심부름 및 커뮤니티 정보 나눔 공간입니다',
          subtext: 'NJ Access Portal은 서비스 계약의 당사자 또는 고용주가 아니며, 업무 조건·자격·안전을 보증하지 않습니다. 당사자 간 계약 불이행, 금전 거래, 사고, 분쟁, 손해에 대해 당사는 법적 책임을 지지 않으므로, 사전에 구체적인 조건과 신원을 직접 확인하시기 바랍니다.'
        },
        'jobs': {
          tag: '구인·구직 안내',
          headline: '구인·구직 게시글의 근로 조건, 급여 및 직무 내용에 대한 책임은 해당 작성자에게 있습니다',
          subtext: 'NJ Access Portal은 고용 계약의 당사자가 아니며 채용 관련 분쟁에 대해 책임을 지지 않습니다. 계약 전 급여 지급 조건 및 신원을 직접 확인하시기 바랍니다.'
        },
        'food': {
          tag: '맛집 정보 안내',
          headline: '맛집 추천 및 식당 후기는 작성 회원의 개인적 경험과 주관적 평가에 기반합니다',
          subtext: '식당의 영업시간, 메뉴 가격 및 서비스 정책은 사전 고지 없이 변경될 수 있으므로 방문 전 해당 매장에 직접 확인하시기 바랍니다.'
        },
        'columns': {
          tag: '전문가 칼럼 안내',
          headline: '본 전문가 칼럼의 내용은 기고자의 전문적 소견이며 일반적 정보 제공 목적입니다',
          subtext: '개별 상황에 따른 구체적 법률, 세무, 보험, 의료 상담은 관련 공인 전문가와의 정식 대면 상담을 권장합니다.'
        }
      };

      const info = mapping[catId] || {
        tag: '커뮤니티 이용 안내',
        headline: '뉴저지 한인 광장은 동포 사회의 따뜻한 정보 나눔과 열린 소통을 위한 공간입니다',
        subtext: '게시글 및 댓글에 대한 책임은 작성자에게 있으며, 건전한 커뮤니티 조성을 위해 상호 존중과 배려의 에티켓을 지켜주시기 바랍니다.'
      };

      tagElem.textContent = info.tag;
      headlineElem.textContent = info.headline;
      subtextElem.textContent = info.subtext;
    }

    function handleSubBoardChange(subId) {
      const clinContainer = document.getElementById('clin-specialty-container');
      if (subId === 'medical_qa') {
        clinContainer.classList.remove('hidden');
      } else {
        clinContainer.classList.add('hidden');
      }

      if (subId === 'medical_reviews' || subId === 'food_reviews' || subId === 'food_recommend') {
        document.getElementById('review-rating-container')?.classList.remove('hidden');
      }
    }

    function updateRatingDisplay(val) {
      val = parseFloat(val);
      const inputHidden = document.getElementById('rating_val');
      if (inputHidden) inputHidden.value = val;
      const textElem = document.getElementById('rating-display-text');
      if (textElem) textElem.textContent = val;
      const starsBox = document.getElementById('rating-stars');
      if (starsBox) {
        let starsHtml = '';
        for (let s = 1; s <= 10; s++) {
          if (s <= Math.floor(val)) {
            starsHtml += '<i class="fa-solid fa-star"></i>';
          } else if (s - 0.5 <= val) {
            starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
          } else {
            starsHtml += '<i class="fa-regular fa-star text-slate-300"></i>';
          }
        }
        starsBox.innerHTML = starsHtml;
      }
    }

    function triggerAskImageUpload() {
      document.getElementById('ask-image-input').click();
    }

    async function handleAskImageSelect(input) {
      const files = Array.from(input.files || []);
      if (files.length === 0) return;

      if (!currentUser) {
        openGoogleAuthModal();
        input.value = '';
        return;
      }

      if (uploadedImages.length + files.length > 5) {
        alert('사진은 최대 5장까지 첨부할 수 있습니다.');
        input.value = '';
        return;
      }

      const spinner = document.getElementById('ask-upload-spinner');
      spinner.classList.remove('hidden');

      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);

        try {
          const res = await fetch('/api/forum.php?action=upload_image', {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          if (data.success && data.url) {
            uploadedImages.push(data.url);
            renderAskImagePreviews();
          } else if (res.status === 401 || data.require_auth) {
            openGoogleAuthModal();
            break;
          } else {
            alert(data.error || '이미지 업로드에 실패했습니다.');
          }
        } catch(err) {
          alert('이미지 업로드 통신 오류가 발생했습니다.');
        }
      }

      spinner.classList.add('hidden');
      input.value = '';
    }

    function removeAskImage(idx) {
      uploadedImages.splice(idx, 1);
      renderAskImagePreviews();
    }

    function renderAskImagePreviews() {
      const previewBox = document.getElementById('ask-images-preview');
      if (!previewBox) return;

      previewBox.innerHTML = uploadedImages.map((url, idx) => `
        <div class="relative group w-18 h-18 rounded-xl overflow-hidden border border-slate-200 shadow-2xs bg-white">
          <img src="${url}" class="w-full h-full object-cover" alt="첨부 이미지">
          <button type="button" onclick="removeAskImage(${idx})" 
                  class="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center shadow-md hover:bg-red-700 transition-colors">
            ✕
          </button>
        </div>
      `).join('');
    }

    function extractYoutubeId(url) {
      if (!url) return '';
      const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
      const match = url.match(regExp);
      return (match && match[1]) ? match[1] : '';
    }

    function handleYoutubeUrlInput(val) {
      const container = document.getElementById('youtube-preview-container');
      const iframe = document.getElementById('youtube-preview-iframe');
      if (!container || !iframe) return;

      const ytId = extractYoutubeId(val.trim());
      if (ytId) {
        iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(ytId);
        container.classList.remove('hidden');
      } else {
        iframe.src = '';
        container.classList.add('hidden');
      }
    }

    function togglePhoneRequirements() {
      const telChecked = document.getElementById('contact_method_tel')?.checked;
      const smsChecked = document.getElementById('contact_method_sms')?.checked;
      const phoneBox = document.getElementById('market-phone-box');
      if (phoneBox) {
        if (telChecked || smsChecked) {
          phoneBox.classList.remove('hidden');
        } else {
          phoneBox.classList.add('hidden');
        }
      }
    }

    async function handleAskSubmit(e) {
      e.preventDefault();

      const categoryId = document.getElementById('category_id').value;
      const subBoardId = document.getElementById('sub_board_id')?.value || '';
      const clinSpecialtyId = document.getElementById('clin_specialty_id')?.value || '';
      const authorName = document.getElementById('author_name')?.value.trim() || '익명 이웃';
      let locationVal = document.getElementById('location')?.value.trim() || document.getElementById('location_opt')?.value.trim() || '';
      let priceVal = document.getElementById('price')?.value.trim() || '';
      let conditionVal = document.getElementById('item_condition')?.value.trim() || '';
      const videoUrlVal = document.getElementById('video_url')?.value.trim() || '';
      const title = (document.getElementById('title')?.value || '').trim();
      const body = (document.getElementById('body')?.value || '').trim().replace(/^[\r\n\s]+/, '');

      if (categoryId === 'wanted') {
        const wantedBudget = document.getElementById('wanted_budget')?.value.trim() || '';
        const wantedLoc = document.getElementById('wanted_location')?.value.trim() || '';
        const wantedSched = document.getElementById('wanted_schedule')?.value.trim() || '';
        if (wantedBudget) priceVal = wantedBudget;
        if (wantedLoc) locationVal = wantedLoc;
        if (wantedSched) conditionVal = wantedSched;
      }

      const isRatingVisible = !document.getElementById('review-rating-container')?.classList.contains('hidden');
      const ratingVal = isRatingVisible ? parseFloat(document.getElementById('rating_val')?.value || 10) : null;

      if (!title || !body) {
        alert('제목과 상세 내용을 입력해 주세요.');
        return;
      }

      // Market & Wanted Category Specific Validations (연락 방법 & 면책 동의)
      let contactMethods = [];
      let contactPhone = '';
      let phoneVisible = 1;
      let disclaimerAgreed = false;

      if (categoryId === 'market' || categoryId === 'wanted') {
        const telChecked = document.getElementById('contact_method_tel')?.checked;
        const smsChecked = document.getElementById('contact_method_sms')?.checked;
        const emailChecked = document.getElementById('contact_method_email')?.checked;

        if (telChecked) contactMethods.push('tel');
        if (smsChecked) contactMethods.push('sms');
        if (emailChecked) contactMethods.push('email');

        if (contactMethods.length === 0) {
          alert('연락 방법(전화, 문자, 이메일) 중 최소 1개 이상을 선택해 주세요.');
          return;
        }

        if (telChecked || smsChecked) {
          contactPhone = (document.getElementById('contact_phone')?.value || '').trim();
          const cleanPhone = contactPhone.replace(/[\s\-\(\)\.]/g, '');
          const phoneRegex = /^(?:01[016789]\d{7,8}|\+?1?[2-9]\d{2}[2-9]\d{6}|\d{10,11})$/;
          if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
            alert('올바른 연락처 전화번호를 입력해 주세요. (예: 201-555-0123 또는 010-1234-5678)');
            document.getElementById('contact_phone')?.focus();
            return;
          }
          const visibleRadio = document.querySelector('input[name="phone_visible"]:checked');
          phoneVisible = visibleRadio ? parseInt(visibleRadio.value, 10) : 1;
        }

        disclaimerAgreed = document.getElementById('market_disclaimer_agree')?.checked;
        if (!disclaimerAgreed) {
          const catName = categoryId === 'wanted' ? '서비스' : '중고거래';
          alert(catName + ' 주의 안내를 읽고 동의 체크박스에 동의해 주세요.');
          document.getElementById('market_disclaimer_agree')?.focus();
          return;
        }
      }

      // Check login status: if not logged in, pop Google login window directly instead of alert!
      if (!currentUser) {
        pendingAutoSubmit = true;
        openGoogleAuthModal();
        return;
      }

      const btn = document.getElementById('btn-submit-ask');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 등록 중...';

      // Assign specialty ID compatible with backend mapping
      let specialtyId = categoryId;
      if (subBoardId) {
        specialtyId = subBoardId;
      }

      try {
        const res = await fetch('/api/forum.php?action=ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title,
            body: body,
            category_id: categoryId,
            sub_board_id: subBoardId,
            sub_specialty_id: clinSpecialtyId,
            specialty_id: specialtyId,
            author_name: authorName,
            author_avatar: (typeof getForumAvatar === 'function') ? getForumAvatar('ask') : '',
            price: priceVal,
            location: locationVal,
            rating: ratingVal,
            item_condition: conditionVal,
            video_url: videoUrlVal,
            images: uploadedImages,
            contact_methods: contactMethods,
            contact_phone: contactPhone,
            phone_visible: phoneVisible,
            disclaimer_agreed: disclaimerAgreed ? 1 : 0
          })
        });
        const data = await res.json();
        const createdId = data.data?.id || data.question?.id;
        if (data.success && createdId) {
          window.location.href = '/forum/topic/' + encodeURIComponent(createdId);
        } else if (res.status === 401 || data.require_auth) {
          // If server rejects with 401 require_auth, pop Google login modal directly!
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-paper-plane text-xs"></i> <span>게시글 등록하기</span>';
          pendingAutoSubmit = true;
          openGoogleAuthModal();
        } else {
          alert(data.error || '게시글 등록에 실패했습니다.');
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-paper-plane text-xs"></i> <span>게시글 등록하기</span>';
        }
      } catch(err) {
        alert('게시글 등록 중 통신 오류가 발생했습니다.');
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane text-xs"></i> <span>게시글 등록하기</span>';
      }
    }

    let pendingAutoSubmit = false;

    function syncAuthorFields() {
      if (!currentUser) return;
      const authorInput = document.getElementById('author_name');
      if (authorInput && (authorInput.value === '익명 이웃' || !authorInput.value.trim())) {
        authorInput.value = currentUser.name || '';
      }
      const badgeIndicator = document.getElementById('author-badge-indicator');
      const badgeText = document.getElementById('author-badge-text');
      if (currentUser.isVerifiedClinician && badgeIndicator) {
        badgeIndicator.classList.remove('hidden');
        if (badgeText && currentUser.clinicianTitle) {
          badgeText.innerText = `${currentUser.clinicianTitle} 인증 계정`;
        }
      } else if (currentUser.isVerifiedExpert && badgeIndicator) {
        badgeIndicator.classList.remove('hidden');
        if (badgeText) badgeText.innerText = '공인 전문가 인증 계정';
      }
    }

    function onForumLoginSuccess(user) {
      syncAuthorFields();
      if (pendingAutoSubmit) {
        pendingAutoSubmit = false;
        const form = document.getElementById('ask-form');
        if (form) {
          handleAskSubmit(new Event('submit'));
        }
      }
    }

    function onForumLoginDismissed() {
      pendingAutoSubmit = false;
      const btn = document.getElementById('btn-submit-ask');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane text-xs"></i> <span>게시글 등록하기</span>';
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      const initialCat = document.getElementById('category_id').value;
      handleCategoryChange(initialCat);
      updateRatingDisplay(10);
    });
  </script>
</body>
</html>
