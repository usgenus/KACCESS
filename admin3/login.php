<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (!empty($_SESSION['admin3_logged_in']) && $_SESSION['admin3_logged_in'] === true && empty($_SESSION['admin3_needs_pw_change'])) {
    header('Location: /admin3/');
    exit;
}
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NJ Access Portal · 뉴저지 파트너즈 관리자 CMS (/admin3)</title>
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
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4 font-sans antialiased selection:bg-emerald-500 selection:text-white">

  <div class="w-full max-w-md">
    <!-- Header Box -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-900 border border-slate-700 text-white shadow-2xl mb-4 p-4 ring-4 ring-emerald-500/20">
        <span class="text-3xl">🤝</span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">NJ Partners CMS</h1>
      <p class="text-xs sm:text-sm text-slate-400 mt-1">뉴저지 파트너즈 &amp; 히어로 슬라이드 관리자 시스템 · /admin3</p>
    </div>

    <!-- Login Card -->
    <div id="login-box" class="bg-slate-900/95 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      <div class="absolute -right-12 -top-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -left-12 -bottom-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="mb-6">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          파트너즈 CMS 관리자 로그인
        </h2>
        <p class="text-xs text-slate-400 mt-1">발급된 CMS 관리자 계정으로 로그인해 주세요.</p>
      </div>

      <div id="alert-msg" class="hidden mb-4 p-3.5 rounded-xl text-xs font-semibold"></div>

      <form id="login-form" onsubmit="handleLogin(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1.5">아이디 (Username)</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <i class="fa-solid fa-user text-xs"></i>
            </span>
            <input type="text" id="username" name="username" required autocomplete="username" value="ha"
                   class="w-full pl-9 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                   placeholder="아이디 입력" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1.5">비밀번호 (Password)</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <i class="fa-solid fa-lock text-xs"></i>
            </span>
            <input type="password" id="password" name="password" required autocomplete="current-password" value="ethan"
                   class="w-full pl-9 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                   placeholder="비밀번호 입력" />
          </div>
        </div>

        <button type="submit" id="btn-login"
                class="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-900/30 transition-all cursor-pointer flex items-center justify-center gap-2">
          <span>CMS 로그인</span>
          <i class="fa-solid fa-arrow-right text-xs"></i>
        </button>
      </form>
    </div>

    <!-- Password Change Card (Mandatory on First Login) -->
    <div id="pw-change-box" class="hidden bg-slate-900/95 border border-amber-600/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      <div class="mb-5">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
          <i class="fa-solid fa-shield-halved"></i> 최초 로그인 보안 설정
        </span>
        <h2 class="text-lg font-bold text-white">비밀번호 변경 필수</h2>
        <p class="text-xs text-slate-400 mt-1">초기 임시 비밀번호로 로그인하셨습니다. 보안을 위해 앞으로 사용할 새로운 비밀번호를 설정해주세요.</p>
      </div>

      <div id="pw-alert-msg" class="hidden mb-4 p-3.5 rounded-xl text-xs font-semibold"></div>

      <form id="pw-form" onsubmit="handlePasswordChange(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1.5">새 비밀번호</label>
          <input type="password" id="new-password" required minlength="5"
                 class="w-full px-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                 placeholder="최소 5자 이상 입력" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1.5">새 비밀번호 확인</label>
          <input type="password" id="confirm-password" required minlength="5"
                 class="w-full px-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                 placeholder="새 비밀번호 재입력" />
        </div>

        <button type="submit" id="btn-pw-change"
                class="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-amber-900/30 transition-all cursor-pointer flex items-center justify-center gap-2">
          <span>새 비밀번호 저장 및 대시보드 이동</span>
          <i class="fa-solid fa-check text-xs"></i>
        </button>
      </form>
    </div>

    <!-- Footer link -->
    <div class="text-center mt-6">
      <a href="/partners" class="text-xs text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1">
        <i class="fa-solid fa-arrow-left text-[10px]"></i> 뉴저지 파트너즈 공개 페이지 바로가기
      </a>
    </div>
  </div>

  <script>
    async function handleLogin(e) {
      e.preventDefault();
      const btn = document.getElementById('btn-login');
      const alertBox = document.getElementById('alert-msg');
      alertBox.classList.add('hidden');

      const u = document.getElementById('username').value.trim();
      const p = document.getElementById('password').value.trim();

      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> 확인 중...';

      try {
        const res = await fetch('/api/admin3_auth.php?action=login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: u, password: p })
        });
        const data = await res.json();

        if (res.ok && data.success) {
          if (data.force_password_change) {
            document.getElementById('login-box').classList.add('hidden');
            document.getElementById('pw-change-box').classList.remove('hidden');
          } else {
            window.location.href = '/admin3/';
          }
        } else {
          alertBox.className = 'mb-4 p-3.5 rounded-xl text-xs font-semibold bg-red-950/80 border border-red-800 text-red-200';
          alertBox.textContent = data.error || '아이디 또는 비밀번호가 올바르지 않습니다.';
          alertBox.classList.remove('hidden');
        }
      } catch (err) {
        alertBox.className = 'mb-4 p-3.5 rounded-xl text-xs font-semibold bg-red-950/80 border border-red-800 text-red-200';
        alertBox.textContent = '네트워크 연결 오류가 발생했습니다.';
        alertBox.classList.remove('hidden');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>CMS 로그인</span> <i class="fa-solid fa-arrow-right text-xs"></i>';
      }
    }

    async function handlePasswordChange(e) {
      e.preventDefault();
      const btn = document.getElementById('btn-pw-change');
      const alertBox = document.getElementById('pw-alert-msg');
      alertBox.classList.add('hidden');

      const np = document.getElementById('new-password').value.trim();
      const cp = document.getElementById('confirm-password').value.trim();

      if (np !== cp) {
        alertBox.className = 'mb-4 p-3.5 rounded-xl text-xs font-semibold bg-red-950/80 border border-red-800 text-red-200';
        alertBox.textContent = '비밀번호 확인이 일치하지 않습니다.';
        alertBox.classList.remove('hidden');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> 저장 중...';

      try {
        const res = await fetch('/api/admin3_auth.php?action=change_password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ new_password: np, confirm_password: cp })
        });
        const data = await res.json();

        if (res.ok && data.success) {
          window.location.href = '/admin3/';
        } else {
          alertBox.className = 'mb-4 p-3.5 rounded-xl text-xs font-semibold bg-red-950/80 border border-red-800 text-red-200';
          alertBox.textContent = data.error || '비밀번호 변경에 실패했습니다.';
          alertBox.classList.remove('hidden');
        }
      } catch (err) {
        alertBox.className = 'mb-4 p-3.5 rounded-xl text-xs font-semibold bg-red-950/80 border border-red-800 text-red-200';
        alertBox.textContent = '네트워크 오류가 발생했습니다.';
        alertBox.classList.remove('hidden');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>새 비밀번호 저장 및 대시보드 이동</span> <i class="fa-solid fa-check text-xs"></i>';
      }
    }
  </script>
</body>
</html>
