<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (empty($_SESSION['admin3_logged_in']) || $_SESSION['admin3_logged_in'] !== true) {
    header('Location: /admin3/login.php');
    exit;
}
if (!empty($_SESSION['admin3_needs_pw_change'])) {
    header('Location: /admin3/login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NJ Access Portal · 뉴저지 파트너즈 CMS 대시보드 (/admin3)</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              forest: '#0D4B37',
              darkGreen: '#0B3B2B',
              sage: '#F0F5F2',
              orange: '#E65127',
              yellow: '#FEE500'
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
    .tab-btn.active {
      background-color: #0D4B37;
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(13, 75, 55, 0.35);
    }
    .tab-btn:not(.active) {
      color: #94a3b8;
    }
    .tab-btn:not(.active):hover {
      color: #ffffff;
      background-color: rgba(255, 255, 255, 0.05);
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen font-sans antialiased selection:bg-emerald-500 selection:text-white">

  <!-- Top Navigation Header -->
  <header class="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <a href="/admin3/" class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md">
            <span class="text-lg">🤝</span>
          </div>
          <div>
            <span class="font-extrabold text-base sm:text-lg text-white tracking-tight">NJ Partners CMS</span>
            <span class="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">/admin3</span>
          </div>
        </a>
      </div>

      <!-- Navigation Tabs -->
      <nav class="hidden md:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
        <button type="button" onclick="switchTab('partners')" id="tab-partners" class="tab-btn active px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5">
          <i class="fa-solid fa-store"></i> 분야별 파트너 관리
        </button>
        <button type="button" onclick="switchTab('slides')" id="tab-slides" class="tab-btn px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5">
          <i class="fa-solid fa-images"></i> 히어로 슬라이드 (최대 3개)
        </button>
      </nav>

      <div class="flex items-center gap-2 sm:gap-3">
        <a href="/partners" target="_blank" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5">
          <span>공개 페이지 보기</span>
          <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
        </a>
        <button type="button" onclick="handleLogout()" class="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors text-xs font-bold" title="로그아웃">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Tab Switcher -->
  <div class="md:hidden flex items-center bg-slate-900 border-b border-slate-800 px-4 py-2 gap-2">
    <button type="button" onclick="switchTab('partners')" id="m-tab-partners" class="flex-1 py-2 text-center rounded-lg text-xs font-bold bg-emerald-700 text-white">
      분야별 파트너
    </button>
    <button type="button" onclick="switchTab('slides')" id="m-tab-slides" class="flex-1 py-2 text-center rounded-lg text-xs font-bold text-slate-400 bg-slate-800">
      히어로 슬라이드
    </button>
  </div>

  <!-- Main Container -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

    <!-- KPI Summary Row -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">등록된 총 파트너</span>
          <div id="stat-total-partners" class="text-2xl font-black text-white mt-1">12</div>
        </div>
        <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
          <i class="fa-solid fa-users"></i>
        </div>
      </div>

      <div class="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">활성 히어로 슬라이드</span>
          <div id="stat-active-slides" class="text-2xl font-black text-emerald-400 mt-1">3 / 3</div>
        </div>
        <div class="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xl">
          <i class="fa-solid fa-panorama"></i>
        </div>
      </div>

      <div class="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">프리미엄 스포트라이트</span>
          <div id="stat-spotlight-partners" class="text-2xl font-black text-amber-400 mt-1">3</div>
        </div>
        <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl">
          <i class="fa-solid fa-star"></i>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- TAB 1: PARTNERS MANAGEMENT -->
    <!-- ======================================================== -->
    <section id="section-partners" class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>분야별 파트너 관리</span>
            <span id="badge-partner-count" class="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">12개</span>
          </h2>
          <p class="text-xs sm:text-sm text-slate-400 mt-0.5">12개 카테고리 및 11개 지역 파트너 비즈니스를 관리합니다. 각 파트너별 개별 카카오톡 채널과 연동됩니다.</p>
        </div>

        <button type="button" onclick="openPartnerModal()" class="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/40 transition-all cursor-pointer shrink-0">
          <i class="fa-solid fa-plus"></i> 새 파트너 등록
        </button>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div class="flex flex-wrap items-center gap-2 flex-1">
          <!-- Text Search -->
          <div class="relative flex-1 min-w-[200px]">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
              <i class="fa-solid fa-magnifying-glass text-xs"></i>
            </span>
            <input type="text" id="admin-search-input" oninput="renderPartnersTable()" placeholder="상호명, 소개 검색..."
                   class="w-full pl-9 pr-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <!-- Category Filter -->
          <select id="admin-category-filter" onchange="renderPartnersTable()"
                  class="px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">모든 카테고리 (12개)</option>
          </select>

          <!-- Town Filter -->
          <select id="admin-town-filter" onchange="renderPartnersTable()"
                  class="px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">모든 지역 (전체)</option>
          </select>
        </div>
      </div>

      <!-- Partners Table / Grid -->
      <div class="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-800/70 border-b border-slate-700/80 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <tr>
                <th class="py-3.5 px-4">사진 / 상호명</th>
                <th class="py-3.5 px-3">카테고리 / 지역</th>
                <th class="py-3.5 px-3">연락 방식 (개별 연동)</th>
                <th class="py-3.5 px-3">스포트라이트</th>
                <th class="py-3.5 px-3 text-center">정렬순서</th>
                <th class="py-3.5 px-3 text-center">공개</th>
                <th class="py-3.5 px-4 text-right">관리</th>
              </tr>
            </thead>
            <tbody id="partners-tbody" class="divide-y divide-slate-800/60 font-medium">
              <!-- Loaded via JavaScript -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ======================================================== -->
    <!-- TAB 2: HERO SLIDES MANAGEMENT -->
    <!-- ======================================================== -->
    <section id="section-slides" class="space-y-6 hidden">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>히어로 슬라이드 관리</span>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">최대 3개 활성화</span>
          </h2>
          <p class="text-xs sm:text-sm text-slate-400 mt-0.5">뉴저지 파트너즈 최상단에 롤링되는 대형 히어로 슬라이드입니다 (최대 3개 엄격 제한).</p>
        </div>

        <button type="button" onclick="openSlideModal()" class="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/40 transition-all cursor-pointer shrink-0">
          <i class="fa-solid fa-plus"></i> 새 슬라이드 추가
        </button>
      </div>

      <!-- Slides Grid -->
      <div id="slides-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Loaded via JavaScript -->
      </div>
    </section>

  </main>

  <!-- ======================================================== -->
  <!-- MODAL: ADD / EDIT PARTNER -->
  <!-- ======================================================== -->
  <div id="partner-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4 overflow-y-auto">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl relative">
      <div class="px-6 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
        <h3 id="partner-modal-title" class="text-base font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-store text-emerald-400"></i> 새 파트너 등록
        </h3>
        <button type="button" onclick="closePartnerModal()" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
          ✕
        </button>
      </div>

      <form id="partner-form" onsubmit="handleSavePartner(event)" class="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
        <input type="hidden" id="p-id" />

        <!-- Photo Upload (Required) -->
        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>대표 사진 (Photo) <span class="text-red-400">*필수</span></span>
            <span class="text-[11px] text-slate-400 font-normal">권장 16:10 비율 (jpg, png, webp)</span>
          </label>
          <div class="flex items-start gap-4">
            <div id="p-img-preview" class="w-28 h-20 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center text-slate-500">
              <i class="fa-solid fa-image text-2xl"></i>
            </div>
            <div class="flex-1 space-y-2">
              <input type="file" id="p-file-input" accept="image/*" onchange="uploadPartnerImage(this)" class="hidden" />
              <button type="button" onclick="document.getElementById('p-file-input').click()"
                      class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-upload"></i> 컴퓨터에서 사진 선택...
              </button>
              <input type="text" id="p-image-url" required placeholder="또는 사진 이미지 URL 직접 입력"
                     oninput="updateImagePreview(this.value)"
                     class="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </div>

        <!-- Business Name & Badge -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1.5">상호명 (Business Name) <span class="text-red-400">*필수</span></label>
            <input type="text" id="p-name" required placeholder="예: 버겐 한인 메디컬센터"
                   class="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1.5">사진 배지 라벨</label>
            <input type="text" id="p-is-sample" placeholder="가상 상호" value="가상 상호"
                   class="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>

        <!-- Category (12) & Town (11) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1.5">카테고리 (12개 분야) <span class="text-red-400">*필수</span></label>
            <select id="p-category" required
                    class="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <!-- populated by JS -->
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1.5">지역 (Town) <span class="text-red-400">*필수</span></label>
            <input type="text" id="p-town" required list="p-town-suggestions" placeholder="예: Fort Lee, Palisades Park, Closter 등 직접 입력"
                   class="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <datalist id="p-town-suggestions"></datalist>
          </div>
        </div>

        <!-- One-line Intro -->
        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1.5">한 줄 소개 (One-line Intro) <span class="text-red-400">*필수</span></label>
          <input type="text" id="p-intro" required placeholder="예: 검진부터 전문 진료까지 한국어로 이어지는 지역 의료 네트워크"
                 class="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1.5">태그 (쉼표로 구분)</label>
          <input type="text" id="p-tags" placeholder="예: 전문가 칼럼 18개, 영상 6개"
                 class="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>

        <!-- Long Content (내용) -->
        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1.5">상세 소개 내용</label>
          <textarea id="p-content" rows="3" placeholder="파트너의 서비스 및 전문 안내 사항을 작성해 주세요."
                    class="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
        </div>

        <!-- Linked Full Website URL -->
        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1.5">연결 웹사이트 주소 (Full Webpage URL)</label>
          <input type="text" id="p-minisite-url" placeholder="https://... 또는 /partners/... (자세히보기 클릭 시 이동할 전체 웹페이지 링크)"
                 class="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <p class="text-[11px] text-slate-400 mt-1">새 사이트는 CMS 대신 직접 전체 웹페이지로 제작되므로, 자세히보기 클릭 시 이동할 웹사이트 링크를 입력합니다.</p>
        </div>

        <!-- Contact Method Selector (카카오톡 OR 이메일) -->
        <div class="p-4 bg-slate-850 rounded-2xl border border-slate-800 space-y-3">
          <label class="block text-xs font-bold text-slate-200">연락 방식 선택 (카드에 해당하는 버튼 1개만 렌더링) <span class="text-red-400">*필수</span></label>
          
          <div class="flex items-center gap-6">
            <label class="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
              <input type="radio" name="contact-method" value="kakao" checked onchange="toggleContactFields('kakao')" class="text-emerald-500" />
              <span>카카오톡 1:1 상담</span>
            </label>
            <label class="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
              <input type="radio" name="contact-method" value="email" onchange="toggleContactFields('email')" class="text-emerald-500" />
              <span>이메일 문의</span>
            </label>
          </div>

          <!-- KakaoTalk Fields -->
          <div id="field-kakao-box" class="space-y-3 pt-2">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">
                카카오 채널 공개 ID <span class="text-red-400">*필수</span>
              </label>
              <input type="text" id="p-kakao-channel-id" placeholder="예: _AbCdEf"
                     class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <p class="text-[11px] text-amber-400/90 mt-1 flex items-center gap-1">
                <i class="fa-solid fa-circle-info"></i> 카카오톡 채널 관리자센터 → 채널 공개 ID 복사
              </p>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">
                카카오 JavaScript 키 <span class="text-slate-400 font-normal">(선택사항 - 미입력 시 시스템 기본 키 적용)</span>
              </label>
              <input type="text" id="p-kakao-js-key" placeholder="해당 비즈니스의 Kakao Developers JS 키"
                     class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <p class="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <i class="fa-solid fa-shield-halved"></i> developers.kakao.com → 내 애플리케이션 → JavaScript 키 (서버에 안전 보관되며 외부 노출되지 않습니다)
              </p>
            </div>
          </div>

          <!-- Email Field -->
          <div id="field-email-box" class="hidden pt-2">
            <label class="block text-xs font-bold text-slate-300 mb-1">
              담당자 이메일 주소 <span class="text-red-400">*필수</span>
            </label>
            <input type="email" id="p-email" placeholder="contact@example.com"
                   class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>

        <!-- Toggles: Featured, Order, Visible -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <label class="flex items-center gap-2 p-3 bg-slate-850 rounded-xl border border-slate-800 cursor-pointer">
            <input type="checkbox" id="p-featured" class="w-4 h-4 rounded text-amber-500 focus:ring-0" />
            <span class="text-xs font-bold text-amber-300">스포트라이트 (Featured)</span>
          </label>

          <div class="flex items-center gap-2 p-3 bg-slate-850 rounded-xl border border-slate-800">
            <span class="text-xs font-bold text-slate-400 shrink-0">정렬순서:</span>
            <input type="number" id="p-order" value="1" min="1"
                   class="w-16 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-center text-white" />
          </div>

          <label class="flex items-center gap-2 p-3 bg-slate-850 rounded-xl border border-slate-800 cursor-pointer">
            <input type="checkbox" id="p-visible" checked class="w-4 h-4 rounded text-emerald-500 focus:ring-0" />
            <span class="text-xs font-bold text-emerald-400">공개 (Visible)</span>
          </label>
        </div>

        <!-- Submit & Cancel -->
        <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
          <button type="button" onclick="closePartnerModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors">
            취소
          </button>
          <button type="submit" id="btn-save-partner" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5">
            <i class="fa-solid fa-check"></i> 저장하기
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- ======================================================== -->
  <!-- MODAL: ADD / EDIT HERO SLIDE -->
  <!-- ======================================================== -->
  <div id="slide-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4 overflow-y-auto">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl my-8 overflow-hidden shadow-2xl relative">
      <div class="px-6 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
        <h3 id="slide-modal-title" class="text-base font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-images text-emerald-400"></i> 새 히어로 슬라이드
        </h3>
        <button type="button" onclick="closeSlideModal()" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
          ✕
        </button>
      </div>

      <form id="slide-form" onsubmit="handleSaveSlide(event)" class="p-6 space-y-4">
        <input type="hidden" id="s-id" />

        <!-- Slide Image Upload -->
        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>슬라이드 이미지 (Image) <span class="text-red-400">*필수</span></span>
            <span class="text-[11px] text-slate-400 font-normal">권장 가로형 이미지</span>
          </label>
          <div class="flex items-start gap-4">
            <div id="s-img-preview" class="w-28 h-20 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center text-slate-500">
              <i class="fa-solid fa-image text-2xl"></i>
            </div>
            <div class="flex-1 space-y-2">
              <input type="file" id="s-file-input" accept="image/*" onchange="uploadSlideImage(this)" class="hidden" />
              <button type="button" onclick="document.getElementById('s-file-input').click()"
                      class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-upload"></i> 컴퓨터에서 이미지 선택...
              </button>
              <input type="text" id="s-image-url" required placeholder="또는 이미지 URL 직접 입력"
                     oninput="updateSlideImagePreview(this.value)"
                     class="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1.5">상단 배지 태그 (Tag Pill)</label>
          <input type="text" id="s-tag" placeholder="프리미엄 샘플 · 가상 상호 · 종합병원" value="프리미엄 샘플 · 가상 상호 · 종합병원"
                 class="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1.5">제목 (Title) <span class="text-red-400">*필수</span></label>
          <input type="text" id="s-title" required placeholder="예: 버겐 한인 메디컬센터"
                 class="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1.5">소제목 / 설명 (Subtitle)</label>
          <input type="text" id="s-subtitle" placeholder="예: 검진부터 전문 진료까지 한국어로 이어지는 지역 의료 네트워크"
                 class="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1.5">버튼 텍스트</label>
            <input type="text" id="s-button-text" value="자세히 보기 →"
                   class="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1.5">버튼 링크</label>
            <input type="text" id="s-button-link" placeholder="#" value="#"
                   class="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 pt-2">
          <div class="flex items-center gap-2 p-3 bg-slate-850 rounded-xl border border-slate-800">
            <span class="text-xs font-bold text-slate-400 shrink-0">정렬순서:</span>
            <input type="number" id="s-order" value="1" min="1"
                   class="w-16 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-center text-white" />
          </div>

          <label class="flex items-center gap-2 p-3 bg-slate-850 rounded-xl border border-slate-800 cursor-pointer">
            <input type="checkbox" id="s-visible" checked class="w-4 h-4 rounded text-emerald-500 focus:ring-0" />
            <span class="text-xs font-bold text-emerald-400">공개 (최대 3개 제한)</span>
          </label>
        </div>

        <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
          <button type="button" onclick="closeSlideModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors">
            취소
          </button>
          <button type="submit" id="btn-save-slide" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5">
            <i class="fa-solid fa-check"></i> 저장하기
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Toast Notification Container -->
  <div id="toast" class="fixed bottom-6 right-6 z-50 transform translate-y-24 opacity-0 transition-all duration-300 px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2.5"></div>

  <script src="/admin3/admin3.js"></script>
</body>
</html>
