<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (empty($_SESSION['cms_logged_in']) || $_SESSION['cms_logged_in'] !== true) {
    header('Location: /admin2/login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Healthcare Access Portal — 메디컬 포럼 관리자 CMS (/admin2)</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <script src="https://cdn.tailwindcss.com"></script>
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
  <style>
    .tab-btn.active {
      background-color: #2563eb;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
    .tab-btn:not(.active) {
      color: #94a3b8;
    }
    .tab-btn:not(.active):hover {
      color: #ffffff;
      background-color: rgba(255, 255, 255, 0.05);
    }
    .mobile-tab-btn.active {
      background-color: #2563eb;
      color: #ffffff;
    }
    .mobile-tab-btn:not(.active) {
      color: #94a3b8;
    }
  </style>
</head>
<body class="bg-[#0f172a] text-slate-100 font-sans antialiased min-h-screen flex flex-col">

  <!-- Top Navigation Bar -->
  <header class="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <a href="/admin2/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700/80 flex items-center justify-center p-1.5 shadow-md group-hover:scale-105 transition-transform text-white">
            <img src="/logo-icon.svg" alt="NJAP Logo" class="w-full h-full object-contain filter invert brightness-200">
          </div>
          <div>
            <div class="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
              Healthcare Access Portal
              <span class="text-[10px] bg-blue-600/90 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">FORUM CMS 2.0</span>
            </div>
            <p class="text-[11px] text-slate-400">메디컬 포럼 &amp; 전문의 Q&amp;A 통합 관제 · NJAP</p>
          </div>
        </a>
      </div>

      <!-- Desktop Tabs -->
      <nav class="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/80 text-xs font-semibold">
        <button onclick="switchTab('dashboard')" id="nav-dashboard" class="tab-btn active px-3 py-2 rounded-xl transition-all flex items-center gap-1.5">
          <i class="fa-solid fa-chart-pie"></i>
          <span>대시보드</span>
        </button>
        <button onclick="switchTab('questions')" id="nav-questions" class="tab-btn px-3 py-2 rounded-xl transition-all flex items-center gap-1.5">
          <i class="fa-solid fa-circle-question"></i>
          <span>의료 질문/정보 나눔</span>
        </button>
        <button onclick="switchTab('answers')" id="nav-answers" class="tab-btn px-3 py-2 rounded-xl transition-all flex items-center gap-1.5">
          <i class="fa-solid fa-comments"></i>
          <span>답변 관리</span>
        </button>
        <button onclick="switchTab('users')" id="nav-users" class="tab-btn px-3 py-2 rounded-xl transition-all flex items-center gap-1.5">
          <i class="fa-solid fa-users-gear"></i>
          <span>전문가 &amp; 회원</span>
        </button>
        <button onclick="switchTab('events')" id="nav-events" class="tab-btn px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 text-rose-400 hover:text-rose-300">
          <i class="fa-solid fa-calendar-star"></i>
          <span>이벤트 관리</span>
        </button>
        <button onclick="switchTab('specialties')" id="nav-specialties" class="tab-btn px-3 py-2 rounded-xl transition-all flex items-center gap-1.5">
          <i class="fa-solid fa-stethoscope"></i>
          <span>전문 진료과·케어</span>
        </button>
      </nav>

      <!-- Right Action Tools -->
      <div class="flex items-center gap-2 sm:gap-3">
        <a href="/admin/" class="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm" title="기존 뉴스 CMS로 이동">
          <i class="fa-solid fa-newspaper text-slate-400"></i>
          <span class="hidden lg:inline">뉴스 CMS (/admin)</span>
        </a>
        <a href="/forum" target="_blank" class="text-xs font-semibold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm">
          <span>포럼 사이트</span>
          <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
        </a>
        <button onclick="handleLogout()" class="text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5">
          <i class="fa-solid fa-arrow-right-from-bracket text-[11px]"></i>
          <span class="hidden sm:inline">로그아웃</span>
        </button>
      </div>
    </div>

    <!-- Mobile Tabs -->
    <div class="md:hidden flex overflow-x-auto px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 gap-2 scrollbar-none text-xs font-semibold">
      <button onclick="switchTab('dashboard')" id="nav-m-dashboard" class="mobile-tab-btn active whitespace-nowrap px-3 py-1.5 rounded-lg">대시보드</button>
      <button onclick="switchTab('questions')" id="nav-m-questions" class="mobile-tab-btn whitespace-nowrap px-3 py-1.5 rounded-lg">의료 질문/정보 나눔</button>
      <button onclick="switchTab('answers')" id="nav-m-answers" class="mobile-tab-btn whitespace-nowrap px-3 py-1.5 rounded-lg">답변 관리</button>
      <button onclick="switchTab('users')" id="nav-m-users" class="mobile-tab-btn whitespace-nowrap px-3 py-1.5 rounded-lg">전문가 &amp; 회원</button>
      <button onclick="switchTab('events')" id="nav-m-events" class="mobile-tab-btn whitespace-nowrap px-3 py-1.5 rounded-lg text-rose-400">이벤트 관리</button>
      <button onclick="switchTab('specialties')" id="nav-m-specialties" class="mobile-tab-btn whitespace-nowrap px-3 py-1.5 rounded-lg">전문 진료과·케어</button>
    </div>
  </header>

  <!-- Main Content Area -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- TAB 1: DASHBOARD OVERVIEW -->
    <section id="tab-dashboard" class="tab-pane space-y-8">
      <!-- Welcome Banner -->
      <div class="bg-gradient-to-r from-blue-900/60 via-slate-800 to-indigo-950/50 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div class="relative z-10 max-w-3xl">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            포럼 CMS 관제 시스템 정상 가동 중
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">메디컬 포럼 CMS 관제 센터</h1>
          <p class="text-slate-300 text-sm mt-2 leading-relaxed">
            전문 진료과 및 시니어 케어 분야별 의료 질문/정보 나눔 및 전문의 인증 답변을 실시간으로 모니터링하고, 부적절한 게시글 삭제/숨김 및 전문의 인증 배지를 관리할 수 있습니다.
          </p>
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1: Questions -->
        <div onclick="switchTab('questions')" class="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 rounded-2xl p-5 shadow-sm transition-all cursor-pointer group">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-blue-400">의료 질문/정보 나눔</span>
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-circle-question"></i>
            </div>
          </div>
          <div class="text-3xl font-black text-white" id="stat-total-questions">-</div>
          <p class="text-[11px] text-slate-400 mt-1">공개 상태: <span id="stat-active-questions" class="text-emerald-400 font-bold">-</span>건</p>
        </div>

        <!-- Card 2: Answers -->
        <div onclick="switchTab('answers')" class="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl p-5 shadow-sm transition-all cursor-pointer group">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">등록된 답변</span>
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-comments"></i>
            </div>
          </div>
          <div class="text-3xl font-black text-white" id="stat-total-answers">-</div>
          <p class="text-[11px] text-slate-400 mt-1">답변 활성율 우수</p>
        </div>

        <!-- Card 3: Verified Clinicians -->
        <div onclick="switchTab('users')" class="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 rounded-2xl p-5 shadow-sm transition-all cursor-pointer group">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-amber-400">인증 의료진 수</span>
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-user-doctor"></i>
            </div>
          </div>
          <div class="text-3xl font-black text-white" id="stat-verified-clinicians">-</div>
          <p class="text-[11px] text-slate-400 mt-1">전문의 배지 부여 회원</p>
        </div>

        <!-- Card 4: Flagged Queue -->
        <div onclick="switchTab('questions')" class="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-red-500/50 rounded-2xl p-5 shadow-sm transition-all cursor-pointer group">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-red-400">검토/신고 대기</span>
            <div class="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-flag"></i>
            </div>
          </div>
          <div class="text-3xl font-black text-white" id="stat-flagged-questions">-</div>
          <p class="text-[11px] text-slate-400 mt-1">숨김 처리: <span id="stat-hidden-questions" class="text-slate-400 font-bold">-</span>건</p>
        </div>
      </div>

      <!-- Specialties Discussion Breakdown Grid -->
      <div class="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-stethoscope text-blue-400"></i>
            <span>전문 진료과 및 시니어 케어 분야별 현황</span>
          </h2>
          <span class="text-xs text-slate-400">실시간 집계</span>
        </div>
        <div id="specialties-dashboard-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <!-- Populated by JS -->
        </div>
      </div>
    </section>

    <!-- TAB 2: QUESTIONS MANAGEMENT -->
    <section id="tab-questions" class="tab-pane hidden space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-circle-question text-blue-400"></i>
            <span>전체 의료 질문/정보 나눔</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1">질문 상태를 숨김/게시로 변경하거나 부적절한 게시물을 영구 삭제할 수 있습니다.</p>
        </div>
        <button onclick="loadQuestionsTable()" class="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-2 rounded-xl flex items-center gap-1.5 self-start sm:self-auto">
          <i class="fa-solid fa-rotate-right"></i>
          <span>새로고침</span>
        </button>
      </div>

      <!-- Filters & Search Bar -->
      <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <!-- Specialty Select -->
          <select id="q-filter-specialty" onchange="loadQuestionsTable()" class="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500">
            <option value="all">전체 진료과 및 케어 분야</option>
            <!-- Injected by JS -->
          </select>

          <!-- Status Select -->
          <select id="q-filter-status" onchange="loadQuestionsTable()" class="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500">
            <option value="all">전체 상태</option>
            <option value="active">공개 (Active)</option>
            <option value="flagged">신고/검토 (Flagged)</option>
            <option value="hidden">숨김 (Hidden)</option>
          </select>
        </div>

        <div class="w-full md:w-72 relative">
          <input type="text" id="q-search" oninput="debounceQuestionsSearch()" placeholder="제목 또는 작성자 검색..." 
            class="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-2.5 text-slate-500 text-xs"></i>
        </div>
      </div>

      <!-- Questions Table -->
      <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-900/90 text-slate-400 uppercase font-bold text-[11px] border-b border-slate-700">
              <tr>
                <th class="py-3 px-4">진료과</th>
                <th class="py-3 px-4">질문 제목</th>
                <th class="py-3 px-4">작성자</th>
                <th class="py-3 px-4">답변/조회</th>
                <th class="py-3 px-4">상태</th>
                <th class="py-3 px-4">작성일</th>
                <th class="py-3 px-4 text-right">관리 작업</th>
              </tr>
            </thead>
            <tbody id="questions-tbody" class="divide-y divide-slate-700/60 font-medium">
              <!-- Rendered via JS -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- TAB 3: ANSWERS MANAGEMENT -->
    <section id="tab-answers" class="tab-pane hidden space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-comments text-emerald-400"></i>
            <span>답변 및 전문의 코멘트 관리</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1">등록된 답변의 상태를 변경하거나 스팸/부적절한 답변을 삭제합니다.</p>
        </div>
        <button onclick="loadAnswersTable()" class="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-2 rounded-xl flex items-center gap-1.5 self-start sm:self-auto">
          <i class="fa-solid fa-rotate-right"></i>
          <span>새로고침</span>
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div class="flex items-center gap-2 w-full md:w-auto">
          <select id="a-filter-status" onchange="loadAnswersTable()" class="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500">
            <option value="all">전체 상태</option>
            <option value="active">공개 (Active)</option>
            <option value="hidden">숨김 (Hidden)</option>
          </select>
        </div>
        <div class="w-full md:w-72 relative">
          <input type="text" id="a-search" oninput="debounceAnswersSearch()" placeholder="답변 내용 또는 작성자 검색..." 
            class="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-2.5 text-slate-500 text-xs"></i>
        </div>
      </div>

      <!-- Answers Table -->
      <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-900/90 text-slate-400 uppercase font-bold text-[11px] border-b border-slate-700">
              <tr>
                <th class="py-3 px-4">대상 질문</th>
                <th class="py-3 px-4">답변 요약</th>
                <th class="py-3 px-4">작성자</th>
                <th class="py-3 px-4">추천(Upvotes)</th>
                <th class="py-3 px-4">상태</th>
                <th class="py-3 px-4">작성일</th>
                <th class="py-3 px-4 text-right">작업</th>
              </tr>
            </thead>
            <tbody id="answers-tbody" class="divide-y divide-slate-700/60 font-medium">
              <!-- Rendered via JS -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- TAB 4: USERS & CLINICIANS MANAGEMENT -->
    <section id="tab-users" class="tab-pane hidden space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-users-gear text-amber-400"></i>
            <span>전문가 및 회원 관리</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1">구글 인증 회원을 관리하고 의료 전문가(전문의) 인증 배지를 부여/해제하거나 불량 회원을 차단합니다.</p>
        </div>
        <button onclick="loadUsersTable()" class="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-2 rounded-xl flex items-center gap-1.5 self-start sm:self-auto">
          <i class="fa-solid fa-rotate-right"></i>
          <span>새로고침</span>
        </button>
      </div>

      <!-- Special Doctor Gmail Registration Card -->
      <div class="bg-gradient-to-r from-slate-800 to-slate-800/90 border border-emerald-500/30 rounded-3xl p-6 shadow-md">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-700/60">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold mb-1 border border-emerald-500/30">
              <i class="fa-solid fa-user-doctor"></i>
              <span>전문의 Gmail 배지 자동 부여 시스템</span>
            </div>
            <h3 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>전문의 Gmail 등록 관리</span>
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              등록된 Gmail로 로그인하는 사용자는 메디컬 포럼에서 <strong>공인 전문의(Verified Clinician)</strong> 배지가 자동으로 활성화됩니다.
            </p>
          </div>
          <span class="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-xl self-start md:self-auto">
            등록된 전문의: <span id="doc-emails-count" class="font-extrabold text-white">-</span>명
          </span>
        </div>

        <!-- Add Doctor Gmail Form -->
        <form id="add-doctor-email-form" onsubmit="handleAddDoctorEmail(event)" class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div class="sm:col-span-5">
            <label class="block text-[11px] font-bold text-slate-300 mb-1.5">
              전문의 구글 이메일 (Gmail) <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <input type="email" id="doc-email-input" required placeholder="예: doctor.kim@gmail.com"
                class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono" />
              <i class="fa-brands fa-google absolute right-3 top-3 text-slate-500 text-xs"></i>
            </div>
          </div>
          <div class="sm:col-span-4">
            <label class="block text-[11px] font-bold text-slate-300 mb-1.5">
              전문의 직함 / 진료과 <span class="text-slate-400 font-normal">(선택)</span>
            </label>
            <input type="text" id="doc-title-input" placeholder="예: 순환기내과 전문의 (MD)"
              class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
          </div>
          <div class="sm:col-span-3">
            <button type="submit" id="btn-add-doctor" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5">
              <i class="fa-solid fa-plus"></i>
              <span>전문의 Gmail 등록</span>
            </button>
          </div>
        </form>

        <!-- Registered Doctor Emails List / Table -->
        <div class="mt-6 pt-5 border-t border-slate-700/60">
          <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <i class="fa-solid fa-clipboard-check text-emerald-400"></i>
            <span>현재 배지 부여 등록된 전문의 명단</span>
          </h4>
          <div id="doctor-emails-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            <!-- Populated via JS -->
          </div>
        </div>
      </div>

      <!-- Users Table Header -->
      <div class="flex items-center justify-between pt-2">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-users text-blue-400"></i>
          <span>포럼 전체 가입 회원 및 활동 상태</span>
        </h3>
        <span class="text-xs text-slate-400">구글 로그인 동기화</span>
      </div>

      <!-- Users Table -->
      <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-900/90 text-slate-400 uppercase font-bold text-[11px] border-b border-slate-700">
              <tr>
                <th class="py-3 px-4">회원명</th>
                <th class="py-3 px-4">이메일</th>
                <th class="py-3 px-4">의료진 인증 여부</th>
                <th class="py-3 px-4">전문과목/직함</th>
                <th class="py-3 px-4">계정 상태</th>
                <th class="py-3 px-4 text-right">배지 및 계정 관리</th>
              </tr>
            </thead>
            <tbody id="users-tbody" class="divide-y divide-slate-700/60 font-medium">
              <!-- Rendered via JS -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- TAB 5: SPECIALTIES OVERVIEW -->
    <section id="tab-specialties" class="tab-pane hidden space-y-6">
      <div>
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-stethoscope text-cyan-400"></i>
          <span>전문 진료과 및 시니어 케어 체계</span>
        </h2>
        <p class="text-xs text-slate-400 mt-1">포털에 등록된 전문 진료과 및 시니어 케어 분야 목록과 게시물 통계입니다.</p>
      </div>

      <div id="specialties-full-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Rendered via JS -->
      </div>
    </section>

    <!-- TAB 6: EVENTS MANAGEMENT & BROADCAST -->
    <section id="tab-events" class="tab-pane hidden space-y-6">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-calendar-star text-rose-400"></i>
            <span>포럼 공식 이벤트 &amp; 회원 전체 알림 발송</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            공식 이벤트 및 건강 세미나를 등록하고, 포럼에 가입한 모든 회원(구글 계정 연동자)에게 이메일 공지를 일괄 발송합니다.
          </p>
        </div>
      </div>

      <!-- Create Event Composer Card -->
      <div class="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h3 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <i class="fa-solid fa-plus-circle text-rose-400"></i>
          <span>새 이벤트 등록 및 이메일 발송</span>
        </h3>

        <form id="event-form" onsubmit="handleCreateEvent(event)" class="space-y-4">
          
          <!-- Event Title -->
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1.5">
              이벤트 / 세미나 제목 <span class="text-rose-400">*</span>
            </label>
            <input type="text" id="event-title" required minlength="2"
              placeholder="예: [NJAP 무료 건강검진의 날] 포트리 한인 시니어 혈압·혈당 측정 및 무료 상담 세미나"
              class="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500 font-medium placeholder-slate-500" />
          </div>

          <!-- Event Poster Image Upload -->
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>🖼️ 이벤트 포스터 이미지 (JPEG / PNG)</span>
              <span class="text-[11px] text-slate-400">포스터 등록 시 이메일 본문 및 포럼 게시글 상단에 고화질로 노출됩니다</span>
            </label>

            <input type="file" id="event-poster-file" accept="image/jpeg,image/png,image/webp" class="hidden" onchange="handlePosterUpload(this)">
            
            <div class="border-2 border-dashed border-slate-700 hover:border-rose-500/60 rounded-2xl p-5 bg-slate-900/50 transition-all text-center">
              <div id="poster-drop-area" class="flex flex-col items-center justify-center gap-2">
                <button type="button" onclick="document.getElementById('event-poster-file').click()" 
                        class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-sm">
                  <i class="fa-solid fa-cloud-arrow-up text-rose-400"></i>
                  <span>포스터 이미지 파일 선택 (JPEG, PNG)</span>
                </button>
                <p class="text-[11px] text-slate-400">드래그 앤 드롭 또는 버튼 클릭으로 포스터를 첨부하세요 (최대 12MB)</p>
              </div>

              <!-- Uploading Spinner -->
              <div id="poster-upload-spinner" class="hidden my-3 text-xs text-rose-400 font-semibold flex items-center justify-center gap-2">
                <i class="fa-solid fa-spinner fa-spin"></i>
                <span>포스터 업로드 중...</span>
              </div>

              <!-- Poster Preview -->
              <div id="poster-preview-box" class="hidden mt-3 max-w-sm mx-auto relative rounded-xl overflow-hidden border border-slate-700 shadow-md">
                <img id="poster-preview-img" src="" class="w-full max-h-72 object-contain bg-slate-950" alt="포스터 미리보기">
                <button type="button" onclick="removeEventPoster()" 
                        class="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600 text-white text-xs flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
            <input type="hidden" id="event-poster-url" value="">
          </div>

          <!-- Event Body / Description -->
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1.5">
              상세 안내 및 본문 내용 <span class="text-rose-400">*</span>
            </label>
            <textarea id="event-body" rows="6" required minlength="5"
              placeholder="• 일시: 2026년 9월 25일 (토) 오후 2시 - 5시&#10;• 장소: 뉴저지 한인 의료접근센터 대강당 (Fort Lee, NJ)&#10;• 대상: 뉴저지 거주 한인 시니어 및 동포 누구나&#10;• 프로그램: 전문의 건강강좌, 1:1 건강상담, 영양 가이드&#10;• 참가비: 무료 (사전 등록 권장)"
              class="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500 leading-relaxed font-sans placeholder-slate-500"></textarea>
          </div>

          <!-- Broadcast Email Checkbox -->
          <div class="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/40 flex items-start gap-3">
            <input type="checkbox" id="event-broadcast" checked 
                   class="mt-1 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-slate-900 border-slate-700 cursor-pointer">
            <div>
              <label for="event-broadcast" class="text-xs font-bold text-rose-300 block cursor-pointer">
                📧 포럼 가입 회원 전체에게 이메일 안내장 발송 (권장)
              </label>
              <p class="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                체크 시 구글 계정으로 로그인/가입한 모든 활성 회원에게 포스터 이미지와 상세 일정 및 바로가기 버튼이 포함된 브랜딩 이메일이 자동 발송됩니다.
              </p>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex items-center justify-end gap-3 pt-2">
            <button type="submit" id="btn-submit-event" 
                    class="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-rose-900/30 flex items-center gap-2 cursor-pointer">
              <i class="fa-solid fa-bullhorn"></i>
              <span>이벤트 등록 및 전체 알림 발송</span>
            </button>
          </div>

        </form>
      </div>

      <!-- Published Events List -->
      <div class="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-list-check text-rose-400"></i>
            <span>등록된 이벤트 목록</span>
          </h3>
          <button onclick="loadEventsSection()" class="text-xs text-slate-400 hover:text-white flex items-center gap-1">
            <i class="fa-solid fa-rotate-right"></i> 새로고침
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-900/90 text-slate-400 uppercase font-bold text-[11px] border-b border-slate-700">
              <tr>
                <th class="py-3 px-4">포스터</th>
                <th class="py-3 px-4">이벤트 제목</th>
                <th class="py-3 px-4">작성자</th>
                <th class="py-3 px-4">조회 / 댓글</th>
                <th class="py-3 px-4">등록일</th>
                <th class="py-3 px-4 text-right">관리</th>
              </tr>
            </thead>
            <tbody id="events-tbody" class="divide-y divide-slate-700/60 font-medium">
              <!-- Rendered via JS -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

  </main>

  <!-- Question Detail & Moderation Modal -->
  <div id="modal-q-detail" class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs hidden items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
      <button onclick="closeQModal()" class="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl">
        <i class="fa-solid fa-xmark text-lg"></i>
      </button>

      <div class="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
        <div class="flex items-center gap-2">
          <span id="modal-q-specialty" class="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30"></span>
          <span id="modal-q-status" class="text-xs font-bold px-2.5 py-1 rounded-lg"></span>
        </div>
        <div class="flex items-center gap-2">
          <label for="modal-q-specialty-select" class="text-[11px] font-bold text-slate-400">진료과/카테고리 변경:</label>
          <select id="modal-q-specialty-select" class="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-blue-500 font-semibold">
            <!-- Dynamically populated with all specialties including 약국, 한의학 -->
          </select>
          <button id="modal-q-specialty-save-btn" onclick="saveQuestionSpecialty()" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer">
            <i class="fa-solid fa-check"></i>
            <span>변경 저장</span>
          </button>
        </div>
      </div>

      <h3 id="modal-q-title" class="text-xl font-bold text-white mb-2"></h3>
      <div class="flex items-center gap-2 text-xs text-slate-400 pb-4 mb-4 border-b border-slate-800">
        <span id="modal-q-author"></span>
        <span>•</span>
        <span id="modal-q-date"></span>
      </div>

      <div id="modal-q-body" class="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed mb-6 bg-slate-950/60 p-4 rounded-2xl border border-slate-800"></div>

      <div class="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
        <button onclick="closeQModal()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300">
          닫기
        </button>
      </div>
    </div>
  </div>

  <script src="/admin2/admin2.js"></script>
</body>
</html>
