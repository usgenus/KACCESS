<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (!empty($_SESSION['cms_logged_in']) && $_SESSION['cms_logged_in'] === true) {
    header('Location: /admin/');
    exit;
}
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NJ Access Center CMS 관리자 로그인</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              blue: '#1E3A8A',
              dark: '#0B192C',
              red: '#DC2626'
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
<body class="bg-slate-900 text-slate-100 min-h-screen flex items-center justify-center p-4 font-sans antialiased selection:bg-red-500 selection:text-white">

  <div class="w-full max-w-md">
    <!-- Header Box -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-950/90 border border-slate-700/80 text-white shadow-2xl mb-4 p-3.5 ring-4 ring-blue-500/20">
        <img src="/logo-icon.svg" alt="NJAP Logo" class="w-full h-full object-contain filter invert brightness-200">
      </div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">NJ Access Center</h1>
      <p class="text-sm text-slate-400 mt-1">의료 포털 통합 콘텐츠 관리 시스템 · NJAP</p>
    </div>

    <!-- Login Card -->
    <div class="bg-slate-800/90 border border-slate-700/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      <div class="absolute -right-12 -top-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -left-12 -bottom-12 w-40 h-40 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="mb-6">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          관리자 인증 로그인
        </h2>
        <p class="text-xs text-slate-400 mt-1">포털 콘텐츠(뉴스, 의학비디오, 빌보드)를 관리하려면 로그인하세요.</p>
      </div>

      <div id="loginError" class="hidden mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
        <span>⚠️</span>
        <span id="loginErrorText">아이디 또는 비밀번호가 올바르지 않습니다.</span>
      </div>

      <form id="loginForm" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2" for="username">관리자 아이디 (User)</label>
          <div class="relative">
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">👤</span>
            <input type="text" id="username" name="username" required autocomplete="username"
              class="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
              placeholder="아이디를 입력하세요">
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2" for="password">비밀번호 (Password)</label>
          <div class="relative">
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔒</span>
            <input type="password" id="password" name="password" required autocomplete="current-password"
              class="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
              placeholder="비밀번호를 입력하세요">
          </div>
        </div>

        <button type="submit" id="submitBtn"
          class="w-full mt-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all flex items-center justify-center gap-2 text-sm">
          <span>관리자 대시보드 접속</span>
          <span>→</span>
        </button>
      </form>

      <div class="mt-6 pt-5 border-t border-slate-700/60 text-center">
        <a href="/" class="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-1">
          <span>←</span>
          <span>포털 메인 홈페이지로 돌아가기</span>
        </a>
      </div>
    </div>

    <p class="text-center text-[11px] text-slate-500 mt-6">
      © 2026 NJ Access Center Portal CMS Engine. All rights reserved.
    </p>
  </div>

  <script>
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const errBox = document.getElementById('loginError');
      const errText = document.getElementById('loginErrorText');
      const btn = document.getElementById('submitBtn');
      
      errBox.classList.add('hidden');
      btn.disabled = true;
      btn.innerHTML = '<span class="animate-spin text-lg">⚙️</span> <span>인증 확인 중...</span>';

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      try {
        const res = await fetch('/api/auth.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (data.success) {
          btn.innerHTML = '<span>✅ 로그인 완료! 이동 중...</span>';
          setTimeout(() => {
            window.location.href = '/admin/';
          }, 300);
        } else {
          errBox.classList.remove('hidden');
          errText.textContent = data.error || '로그인에 실패했습니다.';
          btn.disabled = false;
          btn.innerHTML = '<span>관리자 대시보드 접속</span> <span>→</span>';
        }
      } catch (err) {
        errBox.classList.remove('hidden');
        errText.textContent = '서버 통신 오류가 발생했습니다.';
        btn.disabled = false;
        btn.innerHTML = '<span>관리자 대시보드 접속</span> <span>→</span>';
      }
    });
  </script>
</body>
</html>
