<?php
require_once __DIR__ . '/api/db.php';

$slug = $_GET['slug'] ?? '';
$id = $_GET['id'] ?? '';

$db = get_db_data();
$posts = $db['posts'] ?? [];

$post = null;
$prevPost = null;
$nextPost = null;

if ($slug || $id) {
    foreach ($posts as $idx => $p) {
        if (($slug && ($p['slug'] ?? '') === $slug) || ($id && ($p['id'] ?? '') === $id)) {
            $post = $p;
            $prevPost = $posts[$idx + 1] ?? null;
            $nextPost = $posts[$idx - 1] ?? null;
            break;
        }
    }
}

if (!$post) {
    http_response_code(404);
    include __DIR__ . '/404.html';
    exit;
}

$title = htmlspecialchars($post['title'] ?? '건강 의료 뉴스');
$category = htmlspecialchars($post['category'] ?? 'Health & Wellness');
$date = htmlspecialchars($post['date'] ?? date('Y-m-d'));
$author = htmlspecialchars($post['author'] ?? '편집부');
$readTime = htmlspecialchars($post['readTime'] ?? '3분');
$excerpt = htmlspecialchars($post['excerpt'] ?? '');
$images = $post['images'] ?? [];
if (empty($images) && !empty($post['coverImage'])) {
    $images = [$post['coverImage']];
}
$coverImage = htmlspecialchars(!empty($images[0]) ? $images[0] : ($post['coverImage'] ?: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80&auto=format'));
$articleImages = array_slice($images, 1);
$content = $post['content'] ?? '';
$summaryPoints = $post['summaryPoints'] ?? [];
$videoUrl = $post['videoUrl'] ?? '';

// Convert newlines in content to paragraphs
$paragraphs = array_filter(array_map('trim', explode("\n", $content)));
?>
<!DOCTYPE html>
<html lang="ko" class="h-full antialiased">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title><?= $title ?> | NJ Access Center</title>
  <meta name="description" content="<?= $excerpt ?>" />
  <meta property="og:title" content="<?= $title ?>" />
  <meta property="og:description" content="<?= $excerpt ?>" />
  <meta property="og:image" content="<?= $coverImage ?>" />
  <meta name="twitter:card" content="summary_large_image" />
  
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/_next/static/chunks/1fosv8xgmgdeu.css" />
  <link rel="icon" href="/favicon.ico" sizes="256x256" type="image/x-icon" />

  <style>
    :root, html, body {
      font-family: "Pretendard Variable", Pretendard, "Noto Sans KR", -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif !important;
    }
  </style>
</head>
<body class="min-h-full flex flex-col bg-brand-light">

  <!-- Header Nav -->
  <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-brand-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <a class="flex items-center gap-3 group flex-shrink-0" href="/">
          <div class="w-8 h-8 text-brand-blue flex-shrink-0">
            <img src="/logo-icon.svg" alt="NJAP Logo" class="w-full h-full object-contain">
          </div>
          <div>
            <span class="font-serif text-xl font-bold text-brand-dark group-hover:text-brand-blue transition-colors duration-200 block leading-tight">NJ Access Center</span>
            <span class="block text-[10px] font-sans text-brand-muted leading-tight">의료시스템 접근센터 · NJAP</span>
          </div>
        </a>
        <div class="hidden md:flex items-center gap-8">
          <a class="nav-link pb-0.5 font-medium text-sm text-slate-700 hover:text-brand-blue" href="/">홈</a>
          <a class="nav-link pb-0.5 font-medium text-sm text-brand-blue font-bold" href="/blog">뉴스</a>
          <a class="nav-link pb-0.5 font-medium text-sm text-slate-700 hover:text-brand-blue" href="/medicare">메디케어 &amp; ACA</a>
          <a class="nav-link pb-0.5 font-medium text-sm text-slate-700 hover:text-brand-blue" href="/tool">환자 도구</a>
          <a class="nav-link pb-0.5 font-medium text-sm text-slate-700 hover:text-brand-blue" href="/about">소개</a>
        </div>
        <div class="flex items-center gap-3">
          <a href="/admin" class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">CMS 관리자</a>
        </div>
      </div>
    </div>
  </nav>

  <div class="h-16"></div>

  <!-- Main Article Content -->
  <main class="flex-1">
    <article>
      <!-- Hero Banner (1st Image as Cover Thumbnail) -->
      <div class="bg-brand-darker text-white">
        <div class="relative w-full h-72 sm:h-96 overflow-hidden bg-slate-950">
          <img src="<?= $coverImage ?>" alt="<?= $title ?>" class="object-cover w-full h-full opacity-40">
          <div class="absolute inset-0 bg-gradient-to-t from-brand-darker via-brand-darker/60 to-transparent"></div>
        </div>
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 -mt-20 relative z-10">
          <div class="flex items-center gap-3 mb-5">
            <span class="tag-pill bg-brand-blue text-white font-bold text-xs px-3.5 py-1 rounded-full shadow"><?= $category ?></span>
          </div>
          <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6 text-white font-extrabold tracking-tight">
            <?= $title ?>
          </h1>
          <div class="flex items-center gap-4 text-sm font-sans text-white/70">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-xs font-bold text-white shadow">편</span>
              <span><?= $author ?></span>
            </div>
            <span>·</span>
            <span><?= $date ?></span>
            <span>·</span>
            <span>⏱ <?= $readTime ?> 읽기</span>
          </div>
        </div>
      </div>

      <!-- Body Content -->
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <?php if (!empty($excerpt)): ?>
        <div class="mb-10 p-5 rounded-xl bg-blue-50 border-l-4 border-brand-blue shadow-xs">
          <p class="font-sans text-brand-dark font-medium leading-relaxed text-base"><?= $excerpt ?></p>
        </div>
        <?php endif; ?>

        <?php if (!empty($summaryPoints)): ?>
        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-10">
          <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">핵심 포인트 &amp; 주요 요약</p>
          <ul class="space-y-2 text-sm text-slate-800 font-medium">
            <?php foreach ($summaryPoints as $pt): ?>
              <?php if (trim($pt)): ?>
                <li class="flex items-start gap-2.5">
                  <span class="text-red-600 font-bold">•</span>
                  <span><?= htmlspecialchars($pt) ?></span>
                </li>
              <?php endif; ?>
            <?php endforeach; ?>
          </ul>
        </div>
        <?php endif; ?>

        <?php if (!empty($videoUrl)): ?>
        <div class="mb-10 rounded-2xl overflow-hidden shadow-lg bg-black aspect-video">
          <?php if (strpos($videoUrl, '.mp4') !== false): ?>
            <video src="<?= htmlspecialchars($videoUrl) ?>" controls class="w-full h-full"></video>
          <?php elseif (preg_match('~(?:youtu\.be/|youtube\.com/(?:embed/|v/|watch\?v=))([\w-]{11})~', $videoUrl, $m)): ?>
            <iframe src="https://www.youtube.com/embed/<?= $m[1] ?>" class="w-full h-full border-0" allowfullscreen></iframe>
          <?php endif; ?>
        </div>
        <?php endif; ?>

        <div class="prose prose-lg max-w-none font-sans text-slate-800 leading-relaxed space-y-5 text-base sm:text-lg">
          <?php foreach ($paragraphs as $para): ?>
            <p><?= nl2br(htmlspecialchars($para)) ?></p>
          <?php endforeach; ?>
        </div>

        <!-- In-Article Photos Gallery (Remaining Images) -->
        <?php if (!empty($articleImages)): ?>
        <div class="my-12 pt-8 border-t border-slate-200/80 space-y-6">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-brand-blue"></span>
            <h3 class="text-sm font-extrabold uppercase tracking-wider text-slate-700">
              관련 보도 사진 &amp; 의학 인포그래픽 자료 (<?= count($articleImages) ?>장)
            </h3>
          </div>

          <?php if (count($articleImages) === 1): ?>
            <figure class="rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-50">
              <img src="<?= htmlspecialchars($articleImages[0]) ?>" alt="<?= $title ?> 상세 이미지" class="w-full h-auto object-cover max-h-[520px]">
            </figure>
          <?php else: ?>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <?php foreach ($articleImages as $idx => $imgUrl): ?>
                <figure class="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 bg-slate-50 transition-all duration-300">
                  <div class="relative aspect-4/3 sm:aspect-16/10 overflow-hidden bg-slate-100">
                    <img src="<?= htmlspecialchars($imgUrl) ?>" alt="<?= $title ?> 관련 사진 <?= $idx + 1 ?>" class="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500">
                    <div class="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md">
                      사진 #<?= $idx + 2 ?>
                    </div>
                  </div>
                </figure>
              <?php endforeach; ?>
            </div>
          <?php endif; ?>
        </div>
        <?php endif; ?>

        <!-- Prev / Next Navigation -->
        <div class="mt-16 pt-8 border-t border-brand-border grid grid-cols-1 sm:grid-cols-2 gap-4">
          <?php if ($prevPost): ?>
          <a class="group flex flex-col gap-1 p-5 rounded-xl bg-brand-light border border-brand-border hover:border-brand-blue hover:bg-white transition-all" href="/blog/<?= htmlspecialchars($prevPost['slug'] ?? $prevPost['id']) ?>">
            <span class="text-xs font-sans text-brand-muted">← 이전 글</span>
            <span class="font-serif text-base text-brand-dark line-clamp-2 group-hover:text-brand-blue transition-colors"><?= htmlspecialchars($prevPost['title']) ?></span>
          </a>
          <?php endif; ?>
          <?php if ($nextPost): ?>
          <a class="group flex flex-col gap-1 p-5 rounded-xl bg-brand-light border border-brand-border hover:border-brand-blue hover:bg-white transition-all text-right sm:col-start-2" href="/blog/<?= htmlspecialchars($nextPost['slug'] ?? $nextPost['id']) ?>">
            <span class="text-xs font-sans text-brand-muted">다음 글 →</span>
            <span class="font-serif text-base text-brand-dark line-clamp-2 group-hover:text-brand-blue transition-colors"><?= htmlspecialchars($nextPost['title']) ?></span>
          </a>
          <?php endif; ?>
        </div>

        <div class="mt-12 text-center">
          <a href="/blog" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors">
            <span>← 모든 건강 뉴스 목록으로</span>
          </a>
        </div>

      </div>
    </article>
  </main>

  <!-- Footer -->
  <footer class="bg-brand-darker text-white mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
      <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="text-xs font-sans text-white/30 max-w-2xl leading-relaxed">
          <span class="font-semibold text-white/40">⚠ 의료 면책 조항:</span> 이 웹사이트의 정보는 교육 목적으로만 제공됩니다. 의료 결정은 반드시 자격을 갖춘 의료 전문가와 상담하십시오.
        </div>
        <p class="text-xs font-sans text-white/30 whitespace-nowrap">© 2026 NJ Access Center</p>
      </div>
    </div>
  </footer>

</body>
</html>
