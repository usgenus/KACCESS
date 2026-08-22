<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (empty($_SESSION['cms_logged_in']) || $_SESSION['cms_logged_in'] !== true) {
    header('Location: /admin/login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Healthcare Access Portal — 포털 콘텐츠 관리자 CMS</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="/admin/admin.css?v=<?= time() ?>">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              blue: '#1E3A8A',
              lightBlue: '#3B82F6',
              dark: '#0B192C',
              darker: '#070F1E',
              red: '#DC2626',
              accent: '#EF4444'
            }
          },
          fontFamily: {
            sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
          }
        }
      }
    }
  </script>
</head>
<body class="bg-[#0f172a] text-slate-100 font-sans antialiased min-h-screen flex flex-col">

  <!-- Top Navigation Bar -->
  <header class="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <a href="/admin/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700/80 flex items-center justify-center p-1.5 shadow-md group-hover:scale-105 transition-transform text-white">
            <img src="/logo-icon.svg" alt="NJAP Logo" class="w-full h-full object-contain filter invert brightness-200">
          </div>
          <div>
            <div class="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
              Healthcare Access Portal
              <span class="text-[10px] bg-red-600/90 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">CMS 2.0</span>
            </div>
            <p class="text-[11px] text-slate-400">포털 실시간 통합 콘텐츠 관리 · NJAP</p>
          </div>
        </a>
      </div>

      <!-- Center / Desktop Tabs -->
      <nav class="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/80 text-xs font-semibold">
        <button onclick="switchTab('dashboard')" id="nav-dashboard" class="tab-btn active px-3.5 py-2 rounded-xl transition-all flex items-center gap-2">
          <i class="fa-solid fa-chart-pie"></i>
          <span>대시보드</span>
        </button>
        <button onclick="switchTab('billboard')" id="nav-billboard" class="tab-btn px-3.5 py-2 rounded-xl transition-all flex items-center gap-2">
          <i class="fa-solid fa-panorama"></i>
          <span>갤러리 빌보드 (3~4개)</span>
        </button>
        <button onclick="switchTab('videos')" id="nav-videos" class="tab-btn px-3.5 py-2 rounded-xl transition-all flex items-center gap-2">
          <i class="fa-solid fa-play"></i>
          <span>의학비디오뉴스</span>
        </button>
        <button onclick="switchTab('posts')" id="nav-posts" class="tab-btn px-3.5 py-2 rounded-xl transition-all flex items-center gap-2">
          <i class="fa-solid fa-newspaper"></i>
          <span>건강 뉴스/블로그</span>
        </button>
        <button onclick="switchTab('media')" id="nav-media" class="tab-btn px-3.5 py-2 rounded-xl transition-all flex items-center gap-2">
          <i class="fa-solid fa-photo-film"></i>
          <span>미디어 보관함</span>
        </button>
      </nav>

      <!-- Right Action Tools -->
      <div class="flex items-center gap-3">
        <a href="/" target="_blank" class="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm">
          <span>사이트 보기</span>
          <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-400"></i>
        </a>
        <button onclick="handleLogout()" class="text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5">
          <i class="fa-solid fa-arrow-right-from-bracket text-[11px]"></i>
          <span class="hidden sm:inline">로그아웃</span>
        </button>
      </div>
    </div>

    <!-- Mobile Sub Tabs -->
    <div class="md:hidden flex overflow-x-auto px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 gap-2 scrollbar-none text-xs font-semibold">
      <button onclick="switchTab('dashboard')" id="nav-m-dashboard" class="mobile-tab-btn active whitespace-nowrap px-3 py-1.5 rounded-lg">대시보드</button>
      <button onclick="switchTab('billboard')" id="nav-m-billboard" class="mobile-tab-btn whitespace-nowrap px-3 py-1.5 rounded-lg">갤러리 빌보드</button>
      <button onclick="switchTab('videos')" id="nav-m-videos" class="mobile-tab-btn whitespace-nowrap px-3 py-1.5 rounded-lg">의학비디오</button>
      <button onclick="switchTab('posts')" id="nav-m-posts" class="mobile-tab-btn whitespace-nowrap px-3 py-1.5 rounded-lg">건강 뉴스</button>
      <button onclick="switchTab('media')" id="nav-m-media" class="mobile-tab-btn whitespace-nowrap px-3 py-1.5 rounded-lg">미디어</button>
    </div>
  </header>

  <!-- Main Content Container -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- ========================================================= -->
    <!-- TAB 1: DASHBOARD OVERVIEW -->
    <!-- ========================================================= -->
    <section id="tab-dashboard" class="tab-pane space-y-8">
      <!-- Welcome Banner -->
      <div class="bg-gradient-to-r from-blue-900/50 via-slate-800 to-red-950/40 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div class="relative z-10 max-w-3xl">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            CMS 시스템 정상 가동 중
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">환영합니다, 관리자 (hap)님!</h1>
          <p class="text-slate-300 text-sm mt-2 leading-relaxed">
            뉴저지 한인 의료 정보 포털의 <strong>갤러리 빌보드</strong>, <strong>의학비디오뉴스</strong>, 그리고 <strong>건강 뉴스(블로그)</strong>를 실시간으로 직접 작성하고 수정할 수 있습니다.
          </p>
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- Stat 1 -->
        <div onclick="switchTab('billboard')" class="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 rounded-2xl p-5 shadow-sm transition-all cursor-pointer group">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-blue-400">갤러리 빌보드</span>
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-panorama"></i>
            </div>
          </div>
          <div class="text-3xl font-extrabold text-white" id="stat-billboards-count">-</div>
          <p class="text-xs text-slate-400 mt-1">의학비디오 전면 3~4개 노출 배너</p>
        </div>

        <!-- Stat 2 -->
        <div onclick="switchTab('videos')" class="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-red-500/50 rounded-2xl p-5 shadow-sm transition-all cursor-pointer group">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-red-400">의학비디오뉴스</span>
            <div class="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-play"></i>
            </div>
          </div>
          <div class="text-3xl font-extrabold text-white" id="stat-videos-count">-</div>
          <p class="text-xs text-slate-400 mt-1">유튜브 & 직접 업로드 비디오</p>
        </div>

        <!-- Stat 3 -->
        <div onclick="switchTab('posts')" class="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl p-5 shadow-sm transition-all cursor-pointer group">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">건강 뉴스 포스트</span>
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-newspaper"></i>
            </div>
          </div>
          <div class="text-3xl font-extrabold text-white" id="stat-posts-count">-</div>
          <p class="text-xs text-slate-400 mt-1">메인 뉴스 및 블로그 아카이브</p>
        </div>

        <!-- Stat 4 -->
        <div onclick="switchTab('media')" class="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-purple-500/50 rounded-2xl p-5 shadow-sm transition-all cursor-pointer group">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-purple-400">미디어 업로드</span>
            <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-photo-film"></i>
            </div>
          </div>
          <div class="text-3xl font-extrabold text-white" id="stat-media-count">-</div>
          <p class="text-xs text-slate-400 mt-1">서버에 저장된 이미지/영상 파일</p>
        </div>
      </div>

      <!-- Quick Actions & Recent Updates -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Quick Action Card -->
        <div class="lg:col-span-4 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-bolt text-amber-400"></i>
            <span>빠른 콘텐츠 등록</span>
          </h2>
          <p class="text-xs text-slate-400">원하는 메뉴를 클릭하여 즉시 새 항목을 등록하세요.</p>

          <div class="space-y-3 pt-2">
            <button onclick="openBillboardModal()" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold p-3.5 rounded-2xl transition-all flex items-center justify-between text-xs shadow-md">
              <span class="flex items-center gap-2">
                <i class="fa-solid fa-plus-circle text-sm"></i>
                <span>새 갤러리 빌보드 추가</span>
              </span>
              <span>→</span>
            </button>

            <button onclick="openVideoModal()" class="w-full bg-red-600 hover:bg-red-500 text-white font-bold p-3.5 rounded-2xl transition-all flex items-center justify-between text-xs shadow-md">
              <span class="flex items-center gap-2">
                <i class="fa-solid fa-video text-sm"></i>
                <span>새 의학비디오 등록</span>
              </span>
              <span>→</span>
            </button>

            <button onclick="openPostModal()" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-3.5 rounded-2xl transition-all flex items-center justify-between text-xs shadow-md">
              <span class="flex items-center gap-2">
                <i class="fa-solid fa-pen-nib text-sm"></i>
                <span>새 건강 뉴스 기사 작성</span>
              </span>
              <span>→</span>
            </button>
          </div>
        </div>

        <!-- Recent Content Activity -->
        <div class="lg:col-span-8 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
              <h2 class="text-base font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-clock-rotate-left text-blue-400"></i>
                <span>실시간 콘텐츠 피드 미리보기</span>
              </h2>
              <span class="text-xs text-slate-400">Live Sync</span>
            </div>
            <div id="dash-recent-list" class="space-y-3">
              <div class="text-center py-8 text-slate-500 text-xs">데이터 로딩 중...</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- TAB 2: GALLERY BILLBOARDS (3~4 Different Billboards) -->
    <!-- ========================================================= -->
    <section id="tab-billboard" class="tab-pane hidden space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/90 border border-slate-700/80 p-6 rounded-3xl">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-2 bg-blue-500/10 text-blue-400 rounded-xl text-lg"><i class="fa-solid fa-panorama"></i></span>
            <h1 class="text-xl sm:text-2xl font-extrabold text-white">갤러리 빌보드 관리 (Gallery Billboard)</h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            홈페이지 <strong>'🎬 의학비디오뉴스' 섹션 바로 앞</strong>에 노출되는 3~4개의 대형 하이라이트 빌보드 배너를 관리합니다.
          </p>
        </div>
        <button onclick="openBillboardModal()" class="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-3 rounded-2xl transition-all flex items-center gap-2 text-xs shadow-lg shadow-blue-600/30 whitespace-nowrap self-start sm:self-auto">
          <i class="fa-solid fa-plus"></i>
          <span>새 빌보드 추가</span>
        </button>
      </div>

      <!-- Billboard Grid -->
      <div id="billboards-grid" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Rendered via JS -->
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- TAB 3: MEDICAL VIDEO NEWS (의학비디오뉴스) -->
    <!-- ========================================================= -->
    <section id="tab-videos" class="tab-pane hidden space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/90 border border-slate-700/80 p-6 rounded-3xl">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-2 bg-red-500/10 text-red-400 rounded-xl text-lg"><i class="fa-solid fa-play"></i></span>
            <h1 class="text-xl sm:text-2xl font-extrabold text-white">의학비디오뉴스 관리</h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            유튜브 영상 및 직접 업로드한 의학 강의 비디오를 카테고리별로 등록 및 관리합니다.
          </p>
        </div>
        <button onclick="openVideoModal()" class="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-3 rounded-2xl transition-all flex items-center gap-2 text-xs shadow-lg shadow-red-600/30 whitespace-nowrap self-start sm:self-auto">
          <i class="fa-solid fa-plus"></i>
          <span>새 의학비디오 등록</span>
        </button>
      </div>

      <!-- Filter Bar -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" id="video-category-filters">
        <!-- Rendered via JS -->
      </div>

      <!-- Videos Grid -->
      <div id="videos-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Rendered via JS -->
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- TAB 4: BLOG & NEWS POSTS (건강 뉴스 기사) -->
    <!-- ========================================================= -->
    <section id="tab-posts" class="tab-pane hidden space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/90 border border-slate-700/80 p-6 rounded-3xl">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-lg"><i class="fa-solid fa-newspaper"></i></span>
            <h1 class="text-xl sm:text-2xl font-extrabold text-white">건강 뉴스 및 블로그 관리</h1>
          </div>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            FDA 리콜, Health & Wellness, Medicare & ACA 등 주요 기사를 등록 및 편집합니다.
          </p>
        </div>
        <button onclick="openPostModal()" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-3 rounded-2xl transition-all flex items-center gap-2 text-xs shadow-lg shadow-emerald-600/30 whitespace-nowrap self-start sm:self-auto">
          <i class="fa-solid fa-pen-nib"></i>
          <span>새 기사 작성</span>
        </button>
      </div>

      <!-- Search & Filters -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none" id="post-category-filters">
          <!-- Rendered via JS -->
        </div>
        <div class="relative w-full sm:w-72">
          <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
          <input type="text" id="post-search-input" oninput="handlePostSearch(this.value)" placeholder="기사 제목 검색..."
            class="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all">
        </div>
      </div>

      <!-- Posts List / Grid -->
      <div id="posts-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Rendered via JS -->
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- TAB 5: MEDIA LIBRARY -->
    <!-- ========================================================= -->
    <section id="tab-media" class="tab-pane hidden space-y-6">
      <div class="bg-slate-800/90 border border-slate-700/80 p-6 rounded-3xl space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="p-2 bg-purple-500/10 text-purple-400 rounded-xl text-lg"><i class="fa-solid fa-photo-film"></i></span>
              <h1 class="text-xl sm:text-2xl font-extrabold text-white">미디어 보관함 & 파일 업로더</h1>
            </div>
            <p class="text-xs sm:text-sm text-slate-400 mt-1">
              이미지(JPG, PNG, WEBP) 및 영상(MP4, WEBM)을 안전하게 업로드하고 URL을 복사하여 사용하세요.
            </p>
          </div>
        </div>

        <!-- Drag & Drop Uploader Box -->
        <div id="media-dropzone" class="border-2 border-dashed border-slate-700 hover:border-purple-500 bg-slate-900/60 rounded-2xl p-8 text-center transition-all cursor-pointer">
          <input type="file" id="media-file-input" class="hidden" accept="image/*,video/*" multiple onchange="handleDirectFileUpload(this.files)">
          <div class="flex flex-col items-center justify-center gap-3">
            <div class="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-2xl">
              <i class="fa-solid fa-cloud-arrow-up"></i>
            </div>
            <div>
              <p class="text-sm font-bold text-white">클릭하거나 파일을 여기로 끌어다 놓으세요</p>
              <p class="text-xs text-slate-400 mt-1">JPG, PNG, WebP, GIF, SVG, MP4, WEBM (최대 100MB+)</p>
            </div>
            <button type="button" onclick="document.getElementById('media-file-input').click()" class="mt-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md">
              내 컴퓨터에서 파일 선택
            </button>
          </div>
        </div>
      </div>

      <!-- Media Grid -->
      <div id="media-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <!-- Rendered via JS -->
      </div>
    </section>

  </main>

  <!-- ========================================================= -->
  <!-- MODAL: BILLBOARD ADD / EDIT -->
  <!-- ========================================================= -->
  <div id="modal-billboard" class="modal-backdrop hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm items-center justify-center p-4 overflow-y-auto">
    <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between border-b border-slate-800 pb-4">
        <h3 id="modal-billboard-title" class="text-lg font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-panorama text-blue-400"></i>
          <span>갤러리 빌보드 등록</span>
        </h3>
        <button onclick="closeModal('modal-billboard')" class="text-slate-400 hover:text-white text-lg"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <form id="form-billboard" onsubmit="handleSaveBillboard(event)" class="space-y-4 text-xs">
        <input type="hidden" id="billboard-id" name="id">

        <div>
          <label class="block font-bold text-slate-300 mb-1.5">빌보드 제목 (Headline) *</label>
          <input type="text" id="billboard-title-input" name="title" required
            class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            placeholder="예: 2026년 뉴저지 한인 맞춤형 종합 건강검진 특별 지원">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-bold text-slate-300 mb-1.5">노출 순서 (Display Order)</label>
            <input type="number" id="billboard-order-input" name="order" value="1" min="1" max="100"
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1.5">버튼 표시 문구 (Button Text)</label>
            <input type="text" id="billboard-linktext-input" name="linkText" value="자세히 보기 →"
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500">
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-300 mb-1.5">메인 설명 문구 (Main Text / Subtitle) *</label>
          <textarea id="billboard-subtitle-input" name="subtitle" rows="3" required
            class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 leading-relaxed"
            placeholder="배너 하단에 들어갈 상세 설명 문구를 입력하세요."></textarea>
        </div>

        <!-- Media Upload / URL -->
        <div class="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
          <label class="block font-bold text-slate-200">배경 이미지 또는 비디오 업로드 (Image / Video)</label>
          <div class="flex gap-2">
            <input type="text" id="billboard-media-input" name="mediaUrl" required
              class="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              placeholder="이미지 또는 비디오 URL (https://... 또는 /uploads/...)">
            <label class="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap">
              <i class="fa-solid fa-arrow-up-from-bracket"></i>
              <span>파일 업로드</span>
              <input type="file" class="hidden" accept="image/*,video/*" onchange="uploadFieldFile(this, 'billboard-media-input', 'billboard-media-preview')">
            </label>
          </div>
          <!-- Preview container -->
          <div id="billboard-media-preview" class="relative h-36 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 hidden">
            <!-- image/video preview element inserted here -->
          </div>
        </div>

        <!-- CTA Link & Text -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-bold text-slate-300 mb-1.5">버튼 클릭 이동 링크 (Link URL)</label>
            <input type="text" id="billboard-linkurl-input" name="linkUrl" value="/about#contact"
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500">
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1.5">버튼 표시 문구 (Button Text)</label>
            <input type="text" id="billboard-linktext-input" name="linkText" value="자세히 보기 →"
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500">
          </div>
        </div>

        <div class="flex items-center gap-2 pt-2">
          <input type="checkbox" id="billboard-active-input" name="active" checked class="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700">
          <label for="billboard-active-input" class="font-semibold text-slate-300">활성 상태로 홈페이지에 즉시 노출</label>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button type="button" onclick="closeModal('modal-billboard')" class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold">취소</button>
          <button type="submit" class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30">저장하기</button>
        </div>
      </form>
    </div>
  </div>

  <!-- ========================================================= -->
  <!-- MODAL: MEDICAL VIDEO ADD / EDIT -->
  <!-- ========================================================= -->
  <div id="modal-video" class="modal-backdrop hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm items-center justify-center p-4 overflow-y-auto">
    <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between border-b border-slate-800 pb-4">
        <h3 id="modal-video-title" class="text-lg font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-video text-red-500"></i>
          <span>의학비디오뉴스 등록</span>
        </h3>
        <button onclick="closeModal('modal-video')" class="text-slate-400 hover:text-white text-lg"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <form id="form-video" onsubmit="handleSaveVideo(event)" class="space-y-4 text-xs">
        <input type="hidden" id="video-id" name="id">

        <div>
          <label class="block font-bold text-slate-300 mb-1.5">영상 제목 (Title) *</label>
          <input type="text" id="video-title-input" name="title" required
            class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
            placeholder="예: 심뇌혈관 질환 예방하려면… '혈압·혈당 관리해야'">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-bold text-slate-300 mb-1.5">카테고리 (Category) *</label>
            <input type="text" id="video-category-input" name="category" required list="video-categories-datalist"
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              placeholder="심장 & 혈관, 뇌신경 질환 등">
            <datalist id="video-categories-datalist"></datalist>
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1.5">유튜브 링크 또는 ID (YouTube URL/ID)</label>
            <input type="text" id="video-youtube-input" name="youtubeId" oninput="autoFetchYtThumb(this.value)"
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              placeholder="예: https://www.youtube.com/watch?v=84uvxJruMXM 또는 84uvxJruMXM">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-bold text-slate-300 mb-1.5">전문의 / 발표자 (Doctor)</label>
            <input type="text" id="video-doctor-input" name="doctor" value="연합뉴스TV 의학 리포트"
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500">
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1.5">병원 / 기관명 (Hospital)</label>
            <input type="text" id="video-hospital-input" name="hospital" value="Englewood Health Center for Korean Health"
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block font-bold text-slate-300 mb-1.5">영상 길이 (Duration)</label>
            <input type="text" id="video-duration-input" name="duration" value="05:20"
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500">
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1.5">조회수 표시 (Views)</label>
            <input type="text" id="video-views-input" name="views" value="10.2만회"
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500">
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1.5">노출 순서 (Order)</label>
            <input type="number" id="video-order-input" name="order" value="1" min="1"
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500">
          </div>
        </div>

        <!-- Thumbnail / Direct Video Upload -->
        <div class="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
          <label class="block font-bold text-slate-200">썸네일 이미지 및 비디오 파일 직접 업로드</label>
          <div>
            <label class="block text-slate-400 mb-1">썸네일 이미지 URL (Custom Thumbnail)</label>
            <div class="flex gap-2">
              <input type="text" id="video-thumbnail-input" name="thumbnail"
                class="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                placeholder="썸네일 이미지 URL">
              <label class="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-2 rounded-xl cursor-pointer transition-all flex items-center gap-1 text-xs">
                <i class="fa-solid fa-image"></i>
                <span>이미지 업로드</span>
                <input type="file" class="hidden" accept="image/*" onchange="uploadFieldFile(this, 'video-thumbnail-input', 'video-thumb-preview')">
              </label>
            </div>
          </div>
          <div id="video-thumb-preview" class="relative h-28 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 hidden"></div>

          <div>
            <label class="block text-slate-400 mb-1">직접 업로드 비디오 URL (옵션: MP4/WebM 파일)</label>
            <div class="flex gap-2">
              <input type="text" id="video-fileurl-input" name="videoUrl"
                class="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                placeholder="직접 업로드된 비디오 URL (/uploads/videos/...)">
              <label class="bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-2 rounded-xl cursor-pointer transition-all flex items-center gap-1 text-xs">
                <i class="fa-solid fa-video"></i>
                <span>비디오 업로드</span>
                <input type="file" class="hidden" accept="video/*" onchange="uploadFieldFile(this, 'video-fileurl-input')">
              </label>
            </div>
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-300 mb-1.5">영상 요약 및 설명 (Main Text / Summary)</label>
          <textarea id="video-summary-input" name="summary" rows="3"
            class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500 leading-relaxed"
            placeholder="비디오 설명 및 핵심 포인트를 입력하세요. (선택 사항)"></textarea>
        </div>

        <div class="flex items-center gap-2 pt-2">
          <input type="checkbox" id="video-active-input" name="active" checked class="w-4 h-4 rounded text-red-600 bg-slate-800 border-slate-700">
          <label for="video-active-input" class="font-semibold text-slate-300">활성 상태로 홈페이지에 노출</label>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button type="button" onclick="closeModal('modal-video')" class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold">취소</button>
          <button type="submit" class="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-600/30">저장하기</button>
        </div>
      </form>
    </div>
  </div>

  <!-- ========================================================= -->
  <!-- MODAL: NEWS / BLOG POST ADD / EDIT -->
  <!-- ========================================================= -->
  <div id="modal-post" class="modal-backdrop hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm items-center justify-center p-4 overflow-y-auto">
    <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between border-b border-slate-800 pb-4">
        <h3 id="modal-post-title" class="text-lg font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-pen-nib text-emerald-400"></i>
          <span>건강 뉴스 기사 작성</span>
        </h3>
        <button onclick="closeModal('modal-post')" class="text-slate-400 hover:text-white text-lg"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <form id="form-post" onsubmit="handleSavePost(event)" class="space-y-4 text-xs">
        <input type="hidden" id="post-id" name="id">

        <div>
          <label class="block font-bold text-slate-300 mb-1.5">기사 제목 (Title) *</label>
          <input type="text" id="post-title-input" name="title" required
            class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            placeholder="기사 제목을 입력하세요">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block font-bold text-slate-300 mb-1.5">카테고리 (Category) *</label>
            <input type="text" id="post-category-input" name="category" required list="post-categories-datalist"
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              placeholder="의료칼럼, FDA 리콜, Medicare & ACA 등">
            <datalist id="post-categories-datalist">
              <option value="의료칼럼">
              <option value="FDA 리콜">
              <option value="Health &amp; Wellness">
              <option value="Medicare &amp; ACA">
              <option value="리콜(Recalls and Food Safety)">
              <option value="병원 소식">
              <option value="건강 뉴스">
            </datalist>
            <!-- Quick Category Select Pills -->
            <div class="flex flex-wrap gap-1.5 mt-2">
              <button type="button" onclick="selectPostCategory('의료칼럼')" class="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-red-600/30 text-red-300 border border-red-500/50 hover:bg-red-600 hover:text-white transition-all cursor-pointer">🩺 의료칼럼</button>
              <button type="button" onclick="selectPostCategory('FDA 리콜')" class="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all cursor-pointer">FDA 리콜</button>
              <button type="button" onclick="selectPostCategory('Health & Wellness')" class="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all cursor-pointer">Health &amp; Wellness</button>
              <button type="button" onclick="selectPostCategory('Medicare & ACA')" class="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all cursor-pointer">Medicare &amp; ACA</button>
              <button type="button" onclick="selectPostCategory('리콜(Recalls and Food Safety)')" class="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all cursor-pointer">리콜(Recalls and Food Safety)</button>
            </div>
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1.5">작성일자 (Date)</label>
            <input type="date" id="post-date-input" name="date"
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500">
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1.5">작성자 / 부서 (Author)</label>
            <input type="text" id="post-author-input" name="author" value="편집부"
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500">
          </div>
        </div>

        <!-- Multi-Images Upload Manager & Video -->
        <div class="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label class="block font-bold text-slate-200 text-xs sm:text-sm">기사 다중 사진 관리 (Multiple Images)</label>
              <p class="text-[11px] text-slate-400 mt-0.5">
                <span class="text-emerald-400 font-bold">1번째 사진</span>은 대표 썸네일(Hero 커버 &amp; 목록 카드)로 자동 사용되며, <span class="text-blue-400 font-bold">2번째 이후 사진</span>들은 기사 본문 내 갤러리로 자동 배치됩니다.
              </p>
            </div>
            <label class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 whitespace-nowrap text-xs shadow-md self-start sm:self-auto">
              <i class="fa-solid fa-cloud-arrow-up"></i>
              <span>사진 일괄 추가</span>
              <input type="file" class="hidden" accept="image/*" multiple onchange="uploadMultiplePostImages(this)">
            </label>
          </div>

          <!-- Direct URL Add input -->
          <div class="flex gap-2">
            <input type="text" id="post-add-image-url-input"
              class="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              placeholder="이미지 URL 직접 입력 후 [+ URL 추가] (https://... 또는 /uploads/...)">
            <button type="button" onclick="addPostImageUrlManual()" class="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3.5 py-2 rounded-xl border border-slate-700 transition-all flex items-center gap-1 text-xs whitespace-nowrap">
              <i class="fa-solid fa-plus"></i> URL 추가
            </button>
          </div>

          <!-- Multi-Image Visual Gallery & Order Manager -->
          <div id="post-images-manager-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
            <!-- Dynamically populated image cards with Thumbnail badge, Reorder arrows, and Delete button -->
          </div>

          <input type="hidden" id="post-cover-input" name="coverImage">

          <!-- Optional Video Attachment -->
          <div class="pt-2 border-t border-slate-800/80">
            <label class="block text-slate-400 mb-1">첨부 비디오 URL (선택 사항: MP4 또는 유튜브 링크)</label>
            <div class="flex gap-2">
              <input type="text" id="post-videourl-input" name="videoUrl"
                class="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder="동영상 URL (예: https://www.youtube.com/watch?v=... 또는 /uploads/videos/...)">
              <label class="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-2 rounded-xl cursor-pointer transition-all flex items-center gap-1 text-xs whitespace-nowrap">
                <i class="fa-solid fa-video"></i>
                <span>비디오 업로드</span>
                <input type="file" class="hidden" accept="video/*" onchange="uploadFieldFile(this, 'post-videourl-input')">
              </label>
            </div>
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-300 mb-1.5">기사 한 줄 요약 (Excerpt / Summary) *</label>
          <input type="text" id="post-excerpt-input" name="excerpt" required
            class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            placeholder="카드 목록에 노출될 짧은 요약 문구">
        </div>

        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="block font-bold text-slate-300">기사 본문 내용 (Main Text Content) *</label>
            <div class="flex items-center gap-1">
              <button type="button" id="btn-toggle-post-preview" onclick="togglePostContentPreview()" class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-1">
                <i class="fa-regular fa-eye"></i>
                <span id="preview-toggle-text">미리보기</span>
              </button>
            </div>
          </div>

          <!-- Rich Formatting Toolbar -->
          <div class="flex flex-wrap items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 p-2 rounded-t-xl text-xs">
            <button type="button" onclick="insertPostFormat('bold')" title="굵은 글씨 (**텍스트**)" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700 flex items-center gap-1">
              <i class="fa-solid fa-bold"></i> <span>굵게</span>
            </button>
            <button type="button" onclick="insertPostFormat('h2')" title="큰 소제목 (## 제목)" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold border border-slate-700 flex items-center gap-1">
              <span>H2 대제목</span>
            </button>
            <button type="button" onclick="insertPostFormat('h3')" title="중간 소제목 (### 제목)" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold border border-slate-700 flex items-center gap-1">
              <span>H3 중제목</span>
            </button>
            <button type="button" onclick="insertPostFormat('large')" title="글자 크게 (++텍스트++)" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold border border-slate-700 flex items-center gap-1">
              <i class="fa-solid fa-text-height"></i> <span>크게</span>
            </button>
            <button type="button" onclick="insertPostFormat('small')" title="글자 작게 (--텍스트--)" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 font-medium border border-slate-700 flex items-center gap-1">
              <i class="fa-solid fa-font text-[10px]"></i> <span>작게</span>
            </button>
            <button type="button" onclick="insertPostFormat('mark')" title="형광펜 강조 (==텍스트==)" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-yellow-300 border border-slate-700 flex items-center gap-1">
              <i class="fa-solid fa-highlighter"></i> <span>형광펜</span>
            </button>
            <button type="button" onclick="insertPostFormat('list')" title="글머리 기호 목록 (- 항목)" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1">
              <i class="fa-solid fa-list-ul"></i> <span>목록</span>
            </button>
            <button type="button" onclick="insertPostFormat('quote')" title="인용 상자 (> 내용)" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1">
              <i class="fa-solid fa-quote-left"></i> <span>인용</span>
            </button>
            <button type="button" onclick="insertPostFormat('box')" title="특별 메시지 / 안내 박스 삽입" class="px-2.5 py-1 rounded-lg bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 font-bold border border-indigo-700/80 flex items-center gap-1">
              <i class="fa-solid fa-box-archive text-indigo-400"></i> <span>안내 박스</span>
            </button>
            <button type="button" onclick="openPhotoPickerModal()" title="본문 원하는 위치에 사진 박스 삽입" class="px-2.5 py-1 rounded-lg bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300 font-bold border border-emerald-700/80 flex items-center gap-1">
              <i class="fa-solid fa-camera text-emerald-400"></i> <span>사진 박스 삽입</span>
            </button>
          </div>

          <textarea id="post-content-input" name="content" rows="9" required
            oninput="updatePostContentPreview()"
            class="w-full bg-slate-800 border border-t-0 border-slate-700 rounded-b-xl p-3.5 text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
            placeholder="기사 상세 본문 내용을 자유롭게 입력하거나 복사하여 붙여넣으세요. 상단 툴바의 [사진 박스 삽입]을 눌러 원하는 위치에 사진을 배치할 수 있습니다. [사진1], [사진2]와 같은 단축 태그도 지원됩니다."></textarea>

          <!-- Live Preview Box -->
          <div id="post-content-preview-container" class="hidden mt-3 p-4 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-200 text-sm leading-relaxed max-h-60 overflow-y-auto">
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-800 pb-1">👁 실시간 본문 렌더링 미리보기</p>
            <div id="post-content-preview" class="space-y-3 font-sans"></div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div class="flex items-center gap-2">
            <input type="checkbox" id="post-doctorcolumn-input" name="isDoctorColumn" onchange="handleExposureCheckboxChange(this)" class="w-4 h-4 rounded text-red-600 bg-slate-800 border-slate-700 cursor-pointer">
            <label for="post-doctorcolumn-input" class="font-bold text-red-400 text-xs sm:text-sm cursor-pointer select-none">🩺 TOP 10 의료칼럼 노출</label>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" id="post-topstory-input" name="isTopStory" onchange="handleExposureCheckboxChange(this)" class="w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-700 cursor-pointer">
            <label for="post-topstory-input" class="font-bold text-amber-400 text-xs sm:text-sm cursor-pointer select-none">🔥 TOP STORY 헤드라인</label>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" id="post-liveupdate-input" name="isLiveUpdate" onchange="handleExposureCheckboxChange(this)" class="w-4 h-4 rounded text-blue-500 bg-slate-800 border-slate-700 cursor-pointer">
            <label for="post-liveupdate-input" class="font-semibold text-slate-300 text-xs sm:text-sm cursor-pointer select-none">실시간 주요 뉴스 노출</label>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" id="post-policyreport-input" name="isPolicyReport" onchange="handleExposureCheckboxChange(this)" class="w-4 h-4 rounded text-emerald-500 bg-slate-800 border-slate-700 cursor-pointer">
            <label for="post-policyreport-input" class="font-bold text-emerald-400 text-xs sm:text-sm cursor-pointer select-none">📋 리콜(Recalls and Food Safety)</label>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button type="button" onclick="closeModal('modal-post')" class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold">취소</button>
          <button type="submit" class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30">기사 발행하기</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Photo Placement Box Picker Modal -->
  <div id="modal-photo-picker" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden flex items-center justify-center p-4 modal-backdrop">
    <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4" onclick="event.stopPropagation()">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-camera text-emerald-400"></i>
          <span>본문 원하는 위치에 사진 박스 삽입</span>
        </h3>
        <button type="button" onclick="closeModal('modal-photo-picker')" class="text-slate-400 hover:text-white text-lg">✕</button>
      </div>

      <p class="text-xs text-slate-400 leading-relaxed">
        본문 커서 위치에 배치할 사진을 선택하고 캡션(설명)을 입력하세요. 기사 본문 내에서 중앙 정렬 표준 크기로 깔끔하게 렌더링됩니다.
      </p>

      <!-- Photos Selector Grid -->
      <div>
        <label class="block font-bold text-slate-300 text-xs mb-2">삽입할 사진 선택 (클릭하여 선택)</label>
        <div id="photo-picker-grid" class="grid grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1 bg-slate-950/60 rounded-xl border border-slate-800">
          <!-- Dynamically populated thumbnails -->
        </div>
      </div>

      <!-- Direct URL Input (Optional) -->
      <div>
        <label class="block font-semibold text-slate-400 text-xs mb-1">선택된 이미지 URL 또는 직접 입력</label>
        <input type="text" id="photo-picker-url-input" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" placeholder="https://... 또는 /uploads/images/...">
      </div>

      <!-- Caption Input -->
      <div>
        <label class="block font-bold text-slate-300 text-xs mb-1">사진 하단 캡션 (선택 사항)</label>
        <input type="text" id="photo-picker-caption-input" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" placeholder="예: 관련 보도 자료 사진 / 연구 결과 인포그래픽">
      </div>

      <div class="flex justify-end gap-2 pt-2 border-t border-slate-800">
        <button type="button" onclick="closeModal('modal-photo-picker')" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">취소</button>
        <button type="button" onclick="confirmInsertPhotoBox()" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5">
          <i class="fa-solid fa-check"></i> <span>본문 위치에 사진 박스 삽입</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Toast Notification System -->
  <div id="toast" class="fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 max-w-sm w-full bg-slate-800 border border-slate-700 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3">
    <div id="toast-icon" class="text-xl">✅</div>
    <div class="flex-1 text-xs font-semibold" id="toast-msg">작업이 완료되었습니다.</div>
  </div>

  <script src="/admin/admin.js?v=<?= time() ?>"></script>
</body>
</html>
