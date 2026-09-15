<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (!empty($_SESSION['cms_logged_in']) && $_SESSION['cms_logged_in'] === true) {
    header('Location: /admin2/');
    exit;
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    // Shared credentials: user: hap, password: ethan
    if ($username === 'hap' && $password === 'ethan') {
        $_SESSION['cms_logged_in'] = true;
        $_SESSION['cms_user'] = 'hap';
        $_SESSION['cms_login_time'] = time();

        header('Location: /admin2/');
        exit;
    } else {
        $error = '아이디 또는 비밀번호가 올바르지 않습니다.';
    }
}
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Healthcare Access Portal — 메디컬 포럼 CMS 관리자 로그인</title>
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
      <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Healthcare Access Portal</h1>
      <p class="text-sm text-slate-400 mt-1">메디컬 포럼 &amp; 전문의 Q&amp;A 관리자 CMS · /admin2</p>
    </div>

    <!-- Login Card -->
    <div class="bg-slate-800/90 border border-slate-700/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      <div class="absolute -right-12 -top-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -left-12 -bottom-12 w-40 h-40 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="mb-6">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
          포럼 CMS 관리자 인증
        </h2>
        <p class="text-xs text-slate-400 mt-1">기존 /admin 관리자 계정과 동일한 계정으로 로그인할 수 있습니다.</p>
      </div>

      <?php if (!empty($error)): ?>
        <div class="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span><?= htmlspecialchars($error) ?></span>
        </div>
      <?php endif; ?>

      <form action="/admin2/login.php" method="POST" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1.5">관리자 아이디</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <i class="fa-solid fa-user text-xs"></i>
            </span>
            <input type="text" name="username" required placeholder="관리자 ID (hap)" 
              class="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all">
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1.5">비밀번호</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <i class="fa-solid fa-lock text-xs"></i>
            </span>
            <input type="password" name="password" required placeholder="비밀번호" 
              class="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all">
          </div>
        </div>

        <button type="submit" 
          class="w-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg hover:shadow-blue-600/30 flex items-center justify-center gap-2 mt-2">
          <i class="fa-solid fa-shield-halved"></i>
          <span>포럼 관리자 로그인</span>
        </button>
      </form>

      <div class="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
        <a href="/admin/" class="hover:text-white transition-colors">기존 뉴스 CMS로 가기 →</a>
        <a href="/forum" class="hover:text-white transition-colors">포럼 사이트 가기</a>
      </div>
    </div>
  </div>

</body>
</html>
