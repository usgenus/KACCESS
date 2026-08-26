<?php
require_once __DIR__ . '/api/db.php';

$slug = $_GET['slug'] ?? '';
$id = $_GET['id'] ?? '';

$db = get_db_data();
$posts = $db['posts'] ?? [];

$post = null;
$prevPost = null;
$nextPost = null;
$relatedPosts = [];

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

// Find 2 related articles
foreach ($posts as $p) {
    if (($p['id'] ?? '') !== ($post['id'] ?? '') && count($relatedPosts) < 2) {
        $relatedPosts[] = $p;
    }
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
$summaryPoints = $post['summaryPoints'] ?? [];
if (is_string($summaryPoints)) {
    $trimmed = trim($summaryPoints);
    if (strpos($trimmed, '[') === 0 || strpos($trimmed, '{') === 0) {
        $decoded = json_decode($trimmed, true);
        if (is_array($decoded)) $summaryPoints = $decoded;
        else $summaryPoints = explode("\n", $summaryPoints);
    } else {
        $summaryPoints = explode("\n", $summaryPoints);
    }
}
if (is_array($summaryPoints)) {
    $cleanPoints = [];
    foreach ($summaryPoints as $pt) {
        if (is_array($pt)) {
            $pt = implode(' ', array_filter($pt, 'is_string'));
        }
        if (is_string($pt)) {
            $t = trim($pt);
            if ($t !== '' && $t !== '[object Object]' && strpos($t, '[object Object]') === false) {
                $cleanPoints[] = $t;
            }
        }
    }
    $summaryPoints = $cleanPoints;
} else {
    $summaryPoints = [];
}
$videoUrl = $post['videoUrl'] ?? '';
$content = $post['content'] ?? '';
$postSlug = htmlspecialchars($post['slug'] ?? ($post['id'] ?? 'default'));

function render_article_content($content, $allImages = [], &$usedImages = []) {
    if (empty($content)) return '';

    // Standardize newlines
    $content = str_replace(["\r\n", "\r"], "\n", $content);

    // If it contains existing full HTML block tags
    $hasBlockHtml = preg_match('~<(p|div|h1|h2|h3|h4|ul|ol|blockquote|table|figure)[^>]*>~i', $content);
    if ($hasBlockHtml) {
        return strip_tags($content, '<h1><h2><h3><h4><h5><h6><p><br><hr><strong><b><em><i><u><strike><del><s><span><mark><big><small><blockquote><ul><ol><li><a><img><div><figure><figcaption><table><thead><tbody><tr><th><td><code><pre>');
    }

    $formatInline = function($str) {
        $str = strip_tags($str, '<strong><b><em><i><u><mark><big><small><span><a><code><del><strike>');
        
        // Markdown bold **text** or __text__
        $str = preg_replace('~\*\*(.+?)\*\*~s', '<strong class="font-bold text-slate-950">$1</strong>', $str);
        $str = preg_replace('~__(.+?)__~s', '<strong class="font-bold text-slate-950">$1</strong>', $str);
        
        // Markdown highlight ==text==
        $str = preg_replace('~==(.+?)==~s', '<mark class="bg-yellow-200 text-slate-950 px-1.5 py-0.5 rounded font-bold shadow-2xs">$1</mark>', $str);
        
        // Markdown large text ++text++
        $str = preg_replace('~\+\+(.+?)\+\+~s', '<span class="text-lg sm:text-xl font-bold text-slate-950 leading-relaxed">$1</span>', $str);

        // Markdown small text --text--
        $str = preg_replace('~--(.+?)--~s', '<span class="text-xs sm:text-sm text-slate-500 font-normal leading-normal">$1</span>', $str);
        
        // Markdown italic (single asterisk only)
        $str = preg_replace('~(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)~s', '<em class="italic text-slate-700">$1</em>', $str);

        // Normalize mark, big, and small tags if present
        $str = preg_replace('~<mark(?:\s+[^>]*)?>~i', '<mark class="bg-yellow-200 text-slate-950 px-1.5 py-0.5 rounded font-bold shadow-2xs">', $str);
        $str = preg_replace('~<big>~i', '<span class="text-lg sm:text-xl font-bold text-slate-950">', $str);
        $str = preg_replace('~</big>~i', '</span>', $str);
        $str = preg_replace('~<small>~i', '<span class="text-xs sm:text-sm text-slate-500 font-normal">', $str);
        $str = preg_replace('~</small>~i', '</span>', $str);

        return $str;
    };

    // Pre-process Special Box (:::box ... :::)
    $content = preg_replace_callback('~:::box\s*(.*?)\s*:::~s', function($matches) use ($formatInline) {
        $inner = trim($matches[1]);
        $lines = explode("\n", $inner);
        $formattedLines = array_map(function($l) use ($formatInline) {
            return $formatInline(trim($l));
        }, $lines);
        $body = implode('<br>', $formattedLines);
        return "\n\n<DIV_BOX>" . $body . "</DIV_BOX>\n\n";
    }, $content);

    // Resolve shorthand [사진1], [사진 1], [사진1: 캡션] or [PHOTO1]
    $content = preg_replace_callback('~\[(?:사진|PHOTO)\s*([0-9]+)(?:\s*:\s*([^\]]+))?\]~u', function($matches) use ($allImages, &$usedImages) {
        $idx = intval($matches[1]) - 1;
        $url = $allImages[$idx] ?? '';
        $caption = isset($matches[2]) ? trim($matches[2]) : ('관련 사진 #' . ($idx + 1));
        if (!empty($url)) {
            $usedImages[] = $url;
            return '![' . $caption . '](' . $url . ')';
        }
        return '';
    }, $content);

    // Pre-process In-text Centered Images (![caption](url))
    $content = preg_replace_callback('~!\[(.*?)\]\((.*?)\)~s', function($matches) use (&$usedImages) {
        $caption = htmlspecialchars(trim($matches[1]));
        $url = htmlspecialchars(trim($matches[2]));
        $usedImages[] = $url;
        $captionHtml = !empty($caption) ? '<figcaption class="text-xs text-slate-500 font-medium mt-2.5 text-center">▲ ' . $caption . '</figcaption>' : '';
        $fig = '<figure class="my-8 mx-auto max-w-2xl text-center flex flex-col items-center"><div class="rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-50 w-full"><img src="' . $url . '" alt="' . $caption . '" class="w-full h-auto max-h-[460px] object-cover mx-auto"></div>' . $captionHtml . '</figure>';
        return "\n\n<DIV_FIG>" . $fig . "</DIV_FIG>\n\n";
    }, $content);

    $lines = explode("\n", $content);
    $html = '';
    $inList = false;
    $inQuote = false;
    $quoteBuffer = [];
    $paraBuffer = [];

    $flushPara = function() use (&$paraBuffer, &$html, $formatInline) {
        if (!empty($paraBuffer)) {
            $joined = implode('<br>', $paraBuffer);
            $formatted = $formatInline($joined);
            $html .= '<p class="leading-relaxed text-slate-800 text-base sm:text-lg mb-5">' . $formatted . '</p>';
            $paraBuffer = [];
        }
    };

    $flushQuote = function() use (&$quoteBuffer, &$html, $formatInline) {
        if (!empty($quoteBuffer)) {
            $joined = implode('<br>', $quoteBuffer);
            $formatted = $formatInline($joined);
            $html .= '<blockquote class="border-l-4 border-brand-blue pl-4 py-3 my-6 bg-blue-50/70 rounded-r-2xl font-medium text-slate-800 italic text-base sm:text-lg shadow-2xs">' . $formatted . '</blockquote>';
            $quoteBuffer = [];
        }
    };

    foreach ($lines as $line) {
        $trimmed = trim($line);
        if ($trimmed === '') {
            if ($inList) { $html .= '</ul>'; $inList = false; }
            if ($inQuote) { $flushQuote(); $inQuote = false; }
            $flushPara();
            continue;
        }

        // Check for pre-processed Box
        if (strpos($trimmed, '<DIV_BOX>') !== false) {
            if ($inList) { $html .= '</ul>'; $inList = false; }
            if ($inQuote) { $flushQuote(); $inQuote = false; }
            $flushPara();
            $boxContent = str_replace(['<DIV_BOX>', '</DIV_BOX>'], '', $trimmed);
            $html .= '<div class="my-8 p-6 rounded-2xl bg-gradient-to-br from-blue-50/90 via-slate-50 to-indigo-50/70 border-2 border-brand-blue/30 shadow-sm text-slate-800"><div class="flex items-center gap-2 mb-2.5 text-brand-blue font-extrabold text-sm tracking-wide"><span class="w-2.5 h-2.5 rounded-full bg-brand-blue animate-pulse"></span><span>📢 특별 안내 / 중요 공지</span></div><div class="text-base sm:text-lg leading-relaxed font-medium text-slate-800">' . $boxContent . '</div></div>';
            continue;
        }

        // Check for pre-processed Figure
        if (strpos($trimmed, '<DIV_FIG>') !== false) {
            if ($inList) { $html .= '</ul>'; $inList = false; }
            if ($inQuote) { $flushQuote(); $inQuote = false; }
            $flushPara();
            $figContent = str_replace(['<DIV_FIG>', '</DIV_FIG>'], '', $trimmed);
            $html .= $figContent;
            continue;
        }

        // Heading 3 (###)
        if (preg_match('~^###\s+(.*)$~', $trimmed, $m)) {
            if ($inList) { $html .= '</ul>'; $inList = false; }
            if ($inQuote) { $flushQuote(); $inQuote = false; }
            $flushPara();
            $html .= '<h3 class="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-3">' . $formatInline($m[1]) . '</h3>';
            continue;
        }
        // Heading 2 (##)
        if (preg_match('~^##\s+(.*)$~', $trimmed, $m)) {
            if ($inList) { $html .= '</ul>'; $inList = false; }
            if ($inQuote) { $flushQuote(); $inQuote = false; }
            $flushPara();
            $html .= '<h2 class="font-serif text-2xl sm:text-3xl font-extrabold text-slate-950 mt-10 mb-4 pb-2 border-b border-slate-200">' . $formatInline($m[1]) . '</h2>';
            continue;
        }
        // Heading 1 (#)
        if (preg_match('~^#\s+(.*)$~', $trimmed, $m)) {
            if ($inList) { $html .= '</ul>'; $inList = false; }
            if ($inQuote) { $flushQuote(); $inQuote = false; }
            $flushPara();
            $html .= '<h2 class="font-serif text-2xl sm:text-3xl font-black text-slate-950 mt-10 mb-4 pb-2 border-b border-slate-200">' . $formatInline($m[1]) . '</h2>';
            continue;
        }

        // Quote
        if (strpos($trimmed, '>') === 0) {
            if ($inList) { $html .= '</ul>'; $inList = false; }
            $flushPara();
            $inQuote = true;
            $quoteBuffer[] = trim(substr($trimmed, 1));
            continue;
        } elseif ($inQuote) {
            $flushQuote();
            $inQuote = false;
        }

        // Bullet List
        if (preg_match('~^[-*•]\s+(.*)$~', $trimmed, $m)) {
            if ($inQuote) { $flushQuote(); $inQuote = false; }
            $flushPara();
            if (!$inList) {
                $html .= '<ul class="space-y-2.5 my-5 pl-2">';
                $inList = true;
            }
            $html .= '<li class="flex items-start gap-3 text-slate-800 text-base sm:text-lg"><span class="text-red-600 font-black leading-none mt-1.5 text-base">•</span><span class="flex-1">' . $formatInline($m[1]) . '</span></li>';
            continue;
        } elseif ($inList) {
            $html .= '</ul>';
            $inList = false;
        }

        $paraBuffer[] = $trimmed;
    }

    if ($inList) { $html .= '</ul>'; }
    if ($inQuote) { $flushQuote(); }
    $flushPara();

    return $html;
}
?>
<!DOCTYPE html>
<html lang="ko" class="h-full antialiased">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title><?= $title ?> | Healthcare Access Portal</title>
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
    .bg-brand-gradient {
      background: linear-gradient(135deg, #0f3a9e 0%, #5e0f73 100%) !important;
    }
  </style>
</head>
<body class="min-h-full flex flex-col bg-brand-light">

  <!-- Header Nav -->
  <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-brand-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <a class="flex items-center gap-3 group flex-shrink-0 cursor-pointer njap-brand-link" href="/" onclick="navigateToHome(event); return false;">
          <div class="w-8 h-8 text-brand-blue flex-shrink-0">
            <img src="/logo-icon.svg" alt="NJAP Logo" class="w-full h-full object-contain">
          </div>
          <div>
            <span class="font-serif text-xl font-bold text-brand-dark group-hover:text-brand-blue transition-colors duration-200 block leading-tight">Healthcare Access Portal</span>
            <span class="block text-[10px] font-sans text-brand-muted leading-tight">뉴저지 한인 의료 접근 포털 · NJAP</span>
          </div>
        </a>
        <div class="hidden md:flex items-center gap-8">
          <a class="nav-link pb-0.5 font-medium text-sm text-slate-700 hover:text-brand-blue cursor-pointer" href="/" onclick="navigateToHome(event); return false;">홈</a>
          <a class="nav-link pb-0.5 font-medium text-sm text-brand-blue font-bold" href="/blog">뉴스</a>
          <a class="nav-link pb-0.5 font-medium text-sm text-slate-700 hover:text-brand-blue" href="/medicare">메디케어 &amp; ACA</a>
          <a class="nav-link pb-0.5 font-medium text-sm text-slate-700 hover:text-brand-blue" href="/tool">환자도우미</a>
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
      <!-- Hero Banner -->
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

        <?php
          $usedImages = [];
          $renderedContentHtml = render_article_content($content, $images, $usedImages);
          $remainingGalleryImages = array_values(array_filter($articleImages, function($img) use ($usedImages) {
              return !in_array($img, $usedImages);
          }));
        ?>
        <div class="prose prose-lg max-w-none font-sans text-slate-800 leading-relaxed space-y-5 text-base sm:text-lg">
          <?= $renderedContentHtml ?>
        </div>

        <!-- In-Article Photos Gallery (Displays remaining photos not embedded in text) -->
        <?php if (!empty($remainingGalleryImages)): ?>
        <div class="my-12 pt-8 border-t border-slate-200/80 space-y-6">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-brand-blue"></span>
            <h3 class="text-sm font-extrabold uppercase tracking-wider text-slate-700">
              관련 보도 사진 &amp; 의학 인포그래픽 자료 (<?= count($remainingGalleryImages) ?>장)
            </h3>
          </div>

          <?php if (count($remainingGalleryImages) === 1): ?>
            <figure class="rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-50">
              <img src="<?= htmlspecialchars($remainingGalleryImages[0]) ?>" alt="<?= $title ?> 상세 이미지" class="w-full h-auto object-cover max-h-[520px]">
            </figure>
          <?php else: ?>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <?php foreach ($remainingGalleryImages as $idx => $imgUrl): ?>
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

        <!-- ================================================================= -->
        <!-- COMMENT SECTION (댓글 섹션)                                        -->
        <!-- ================================================================= -->
        <section id="comments-section" class="mt-16 pt-10 border-t-2 border-brand-dark font-sans text-brand-dark" data-post-slug="<?= $postSlug ?>">
          
          <!-- Header Bar: Title + Count Badge + Sort Buttons -->
          <div class="flex items-center justify-between mb-6 pb-3 border-b border-brand-border">
            <div class="flex items-center gap-2">
              <h2 class="font-serif font-bold text-2xl text-brand-dark">댓글</h2>
              <span id="comment-total-badge" class="text-sm font-bold text-brand-blue bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">3</span>
            </div>
            <div class="flex items-center gap-3 text-xs font-medium text-brand-muted">
              <button id="sort-likes" onclick="setCommentSort('likes')" class="transition-colors text-brand-blue font-bold underline cursor-pointer">순공감순</button>
              <span>·</span>
              <button id="sort-newest" onclick="setCommentSort('newest')" class="transition-colors hover:text-brand-dark cursor-pointer text-slate-500">최신순</button>
              <span>·</span>
              <button id="sort-oldest" onclick="setCommentSort('oldest')" class="transition-colors hover:text-brand-dark cursor-pointer text-slate-500">과거순</button>
            </div>
          </div>

          <!-- Information Notice -->
          <div class="mb-6 p-3.5 rounded-lg bg-gray-50 border border-gray-200 text-xs text-brand-muted flex items-center gap-2.5">
            <span class="text-brand-blue text-sm font-bold">ⓘ</span>
            <span class="leading-relaxed">로그인 없이 닉네임만으로 자유롭게 의견을 남기실 수 있습니다. 타인을 배려하는 따뜻한 댓글을 부탁드립니다.</span>
          </div>

          <!-- Main Comment Input Form Box -->
          <form id="main-comment-form" onsubmit="handleMainCommentSubmit(event)" class="mb-10 p-5 rounded-2xl border border-brand-border bg-white shadow-sm">
            <div class="flex flex-col sm:flex-row gap-3 mb-3">
              <input type="text" id="comment-nickname" required maxlength="12" placeholder="닉네임 (예: 포트리한인)" class="text-xs p-2.5 rounded-lg border border-brand-border bg-brand-light outline-none focus:border-brand-blue w-full sm:w-48">
              <input type="password" id="comment-password" maxlength="4" placeholder="비밀번호 4자리 (선택: 삭제용)" class="text-xs p-2.5 rounded-lg border border-brand-border bg-brand-light outline-none focus:border-brand-blue w-full sm:w-52">
            </div>
            <div class="relative mb-3">
              <textarea id="comment-content" required rows="3" maxlength="500" placeholder="따뜻한 댓글을 남겨주세요. (최대 500자)" oninput="updateCommentCharCount(this)" class="w-full text-sm p-3.5 rounded-xl border border-brand-border outline-none focus:border-brand-blue resize-none leading-relaxed"></textarea>
              <span id="comment-char-count" class="absolute right-3 bottom-3 text-xs text-brand-muted">0 / 500자</span>
            </div>
            <div class="flex justify-end">
              <button type="submit" class="text-xs font-semibold px-6 py-2.5 rounded-full bg-brand-gradient text-white hover:opacity-90 transition-opacity shadow-sm cursor-pointer">댓글 등록</button>
            </div>
          </form>

          <!-- Comment List Container -->
          <div id="comments-list-container" class="space-y-6">
            <!-- Dynamic comments rendered here via JS -->
          </div>

        </section>

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

        <!-- Related Articles (관련 기사) -->
        <?php if (!empty($relatedPosts)): ?>
        <div class="mt-12">
          <h2 class="font-serif text-2xl text-brand-dark mb-6 font-bold">관련 기사</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <?php foreach ($relatedPosts as $rp): ?>
              <?php 
                $rpCover = !empty($rp['coverImage']) ? $rp['coverImage'] : (!empty($rp['images'][0]) ? $rp['images'][0] : 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80&auto=format');
                $rpDate = htmlspecialchars($rp['date'] ?? date('Y-m-d'));
                $rpTitle = htmlspecialchars($rp['title'] ?? '');
                $rpSlug = htmlspecialchars($rp['slug'] ?? ($rp['id'] ?? ''));
              ?>
              <a class="group card-hover block" href="/blog/<?= $rpSlug ?>">
                <div class="bg-white border border-brand-border rounded-xl overflow-hidden flex gap-4 p-4 hover:shadow-md transition-shadow">
                  <div class="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                    <img src="<?= htmlspecialchars($rpCover) ?>" alt="<?= $rpTitle ?>" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                  </div>
                  <div class="min-w-0 flex flex-col justify-center">
                    <p class="text-xs font-sans text-brand-muted mb-1"><?= $rpDate ?></p>
                    <h3 class="font-serif text-sm text-brand-dark line-clamp-2 group-hover:text-brand-blue transition-colors font-semibold leading-snug"><?= $rpTitle ?></h3>
                  </div>
                </div>
              </a>
            <?php endforeach; ?>
          </div>
        </div>
        <?php endif; ?>

        <div class="mt-12 text-center">
          <a href="/blog" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors shadow">
            <span>← 모든 건강 뉴스 목록으로</span>
          </a>
        </div>

      </div>
    </article>
  </main>

  <!-- Footer -->
  <footer class="bg-brand-darker text-white mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        <div class="lg:col-span-2">
          <a class="inline-flex items-center gap-3 mb-4 group cursor-pointer njap-brand-link" href="/" onclick="navigateToHome(event); return false;">
            <img src="/logo-icon.svg" alt="NJAP Logo" style="width: 36px; height: 36px; object-fit: contain; filter: invert(1) brightness(2); flex-shrink: 0;" class="transition-transform group-hover:scale-105">
            <div>
              <span class="font-serif text-2xl text-white group-hover:text-blue-300 transition-colors block">Healthcare Access Portal</span>
              <span class="block text-xs text-white/50 mt-0.5 font-sans">뉴저지 한인 의료 정보 포털</span>
            </div>
          </a>
          <p class="text-sm text-white/60 font-sans leading-relaxed max-w-xs mb-6">뉴저지 한인 커뮤니티를 위한 의료 접근 및 건강 정보 포털. 메디케어, ACA, 의료 상담을 한국어로 제공합니다.</p>
        </div>
        <div>
          <p class="text-xs font-sans font-semibold uppercase tracking-widest text-white/40 mb-4">정보</p>
          <ul class="space-y-2.5">
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200 cursor-pointer" href="/" onclick="navigateToHome(event); return false;">홈</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/about">소개</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/blog">건강 뉴스</a></li>
          </ul>
        </div>
        <div>
          <p class="text-xs font-sans font-semibold uppercase tracking-widest text-white/40 mb-4">의료 가이드</p>
          <ul class="space-y-2.5">
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/medicare">메디케어 안내</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/medicare#aca">ACA 보험</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/medicare#faq">자주 묻는 질문</a></li>
          </ul>
        </div>
        <div>
          <p class="text-xs font-sans font-semibold uppercase tracking-widest text-white/40 mb-4">환자도우미</p>
          <ul class="space-y-2.5">
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/tool">보험 자격 진단</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/tool">보조금 계산기</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/tool">의학 용어 사전</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="text-xs font-sans text-white/30 max-w-2xl leading-relaxed">
          <span class="font-semibold text-white/40">⚠ 의료 면책 조항:</span> 이 웹사이트의 정보는 교육 목적으로만 제공됩니다. 의료 결정은 반드시 자격을 갖춘 의료 전문가와 상담하십시오.
        </div>
        <p class="text-xs font-sans text-white/30 whitespace-nowrap">© 2026 Healthcare Access Portal</p>
      </div>
    </div>
  </footer>

  <script src="/js/cms-client.js?v=3.5.0"></script>

  <!-- Interactive Comments Script -->
  <script>
    (function () {
      'use strict';

      const postSlug = '<?= $postSlug ?>';
      const storageKey = 'njaccess_comments_' + postSlug;
      let currentSort = 'likes';
      let activeReplyId = null;

      // Default seed comments matching original application
      const defaultSeeds = [
        {
          id: "seed-1",
          nickname: "포트리한인***",
          content: "좋은 정보 감사합니다! 미국 와서 의료 용어도 어렵고 메디케어 신청 방법도 막막했는데 한국어로 자세히 설명해주셔서 이해가 쏙쏙 되네요.",
          createdAt: "2026-08-08 14:20",
          likes: 15,
          dislikes: 1,
          replies: [
            {
              id: "seed-1-1",
              nickname: "NJ센터답변***",
              content: "도움이 되셨다니 다행입니다. 추가로 궁금하신 사항은 1-800-999-7200 무료 상담 전화로 편하게 문의해주세요!",
              createdAt: "2026-08-08 15:05",
              likes: 6,
              dislikes: 0
            }
          ]
        },
        {
          id: "seed-2",
          nickname: "펠팍주민***",
          content: "부모님 메디케어 파트D 약 보험 가입 때문에 고민 많았는데 관련 기사 내용이 아주 유용합니다. 공유해둘게요.",
          createdAt: "2026-08-07 09:45",
          likes: 9,
          dislikes: 0,
          replies: []
        }
      ];

      let commentsData = [];

      // Initial load: local storage first, then sync with API
      function loadComments() {
        try {
          const cached = localStorage.getItem(storageKey);
          if (cached) {
            commentsData = JSON.parse(cached);
          } else {
            commentsData = JSON.parse(JSON.stringify(defaultSeeds));
          }
        } catch (e) {
          commentsData = JSON.parse(JSON.stringify(defaultSeeds));
        }

        renderComments();

        // Fetch from API in background
        fetch('/api/comments.php?slug=' + encodeURIComponent(postSlug))
          .then(res => res.json())
          .then(res => {
            if (res.success && Array.isArray(res.comments) && res.comments.length > 0) {
              commentsData = res.comments;
              saveCommentsLocal(commentsData);
              renderComments();
            }
          })
          .catch(err => console.log('Comments API offline, using local store'));
      }

      function saveCommentsLocal(data) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(data));
        } catch (e) {}
      }

      window.updateCommentCharCount = function(textarea) {
        const counter = document.getElementById('comment-char-count');
        if (counter) {
          counter.textContent = textarea.value.length + ' / 500자';
        }
      };

      window.setCommentSort = function(sortType) {
        currentSort = sortType;
        ['likes', 'newest', 'oldest'].forEach(st => {
          const btn = document.getElementById('sort-' + st);
          if (btn) {
            if (st === sortType) {
              btn.className = 'transition-colors text-brand-blue font-bold underline cursor-pointer';
            } else {
              btn.className = 'transition-colors hover:text-brand-dark cursor-pointer text-slate-500';
            }
          }
        });
        renderComments();
      };

      window.handleMainCommentSubmit = function(e) {
        e.preventDefault();
        const nickInput = document.getElementById('comment-nickname');
        const passInput = document.getElementById('comment-password');
        const contentInput = document.getElementById('comment-content');

        const nickname = nickInput.value.trim();
        const password = passInput.value.trim();
        const content = contentInput.value.trim();

        if (!nickname || !content) return;

        const maskedNick = nickname.length > 2 ? (nickname.substring(0, 3) + '***') : (nickname + '***');
        const now = new Date();
        const dateStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

        const newComment = {
          id: 'c_' + Date.now(),
          nickname: maskedNick,
          password: password,
          content: content,
          createdAt: dateStr,
          likes: 0,
          dislikes: 0,
          replies: []
        };

        commentsData.unshift(newComment);
        saveCommentsLocal(commentsData);
        renderComments();

        // Reset form
        nickInput.value = '';
        passInput.value = '';
        contentInput.value = '';
        updateCommentCharCount(contentInput);

        // Sync to API
        fetch('/api/comments.php?action=add&slug=' + encodeURIComponent(postSlug), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nickname, password, content })
        }).catch(() => {});
      };

      window.toggleReplyBox = function(commentId) {
        activeReplyId = (activeReplyId === commentId) ? null : commentId;
        renderComments();
      };

      window.handleReplySubmit = function(e, parentId) {
        e.preventDefault();
        const nickInput = document.getElementById('reply-nick-' + parentId);
        const passInput = document.getElementById('reply-pass-' + parentId);
        const contentInput = document.getElementById('reply-content-' + parentId);

        const nickname = nickInput.value.trim();
        const password = passInput ? passInput.value.trim() : '';
        const content = contentInput.value.trim();

        if (!nickname || !content) return;

        const maskedNick = nickname.length > 2 ? (nickname.substring(0, 3) + '***') : (nickname + '***');
        const now = new Date();
        const dateStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

        const newReply = {
          id: 'r_' + Date.now(),
          nickname: maskedNick,
          password: password,
          content: content,
          createdAt: dateStr,
          likes: 0,
          dislikes: 0
        };

        commentsData.forEach(c => {
          if (c.id === parentId) {
            if (!c.replies) c.replies = [];
            c.replies.push(newReply);
          }
        });

        activeReplyId = null;
        saveCommentsLocal(commentsData);
        renderComments();

        // Sync to API
        fetch('/api/comments.php?action=add&slug=' + encodeURIComponent(postSlug), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parentId, nickname, password, content })
        }).catch(() => {});
      };

      window.toggleLikeComment = function(commentId, isReply, parentId) {
        commentsData.forEach(c => {
          if (isReply && c.id === parentId && c.replies) {
            c.replies.forEach(r => {
              if (r.id === commentId) {
                const userLiked = !r.userLiked;
                r.likes = Math.max(0, (r.likes || 0) + (userLiked ? 1 : -1));
                r.userLiked = userLiked;
              }
            });
          } else if (!isReply && c.id === commentId) {
            const userLiked = !c.userLiked;
            c.likes = Math.max(0, (c.likes || 0) + (userLiked ? 1 : -1));
            c.userLiked = userLiked;
          }
        });
        saveCommentsLocal(commentsData);
        renderComments();

        fetch('/api/comments.php?action=like&slug=' + encodeURIComponent(postSlug), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ commentId, isReply, parentId })
        }).catch(() => {});
      };

      window.toggleDislikeComment = function(commentId) {
        commentsData.forEach(c => {
          if (c.id === commentId) {
            const userDisliked = !c.userDisliked;
            c.dislikes = Math.max(0, (c.dislikes || 0) + (userDisliked ? 1 : -1));
            c.userDisliked = userDisliked;
          }
        });
        saveCommentsLocal(commentsData);
        renderComments();

        fetch('/api/comments.php?action=dislike&slug=' + encodeURIComponent(postSlug), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ commentId })
        }).catch(() => {});
      };

      window.deleteCommentPrompt = function(commentId) {
        const pass = prompt('댓글 삭제를 위해 작성 시 입력한 4자리 비밀번호를 입력해주세요:');
        if (!pass) return;

        let target = null;
        commentsData.forEach(c => {
          if (c.id === commentId) target = c;
          if (c.replies) {
            c.replies.forEach(r => {
              if (r.id === commentId) target = r;
            });
          }
        });

        if (target && target.password && target.password !== pass.trim()) {
          alert('비밀번호가 일치하지 않습니다.');
          return;
        }

        // Delete from local
        commentsData = commentsData.filter(c => c.id !== commentId);
        commentsData.forEach(c => {
          if (c.replies) {
            c.replies = c.replies.filter(r => r.id !== commentId);
          }
        });

        saveCommentsLocal(commentsData);
        renderComments();
        alert('댓글이 삭제되었습니다.');

        fetch('/api/comments.php?action=delete&slug=' + encodeURIComponent(postSlug), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ commentId, password: pass.trim() })
        }).catch(() => {});
      };

      function renderComments() {
        const container = document.getElementById('comments-list-container');
        const badge = document.getElementById('comment-total-badge');
        if (!container) return;

        // Calculate total count including replies
        let totalCount = 0;
        commentsData.forEach(c => {
          totalCount += 1 + (c.replies ? c.replies.length : 0);
        });
        if (badge) badge.textContent = totalCount;

        if (commentsData.length === 0) {
          container.innerHTML = '<p class="text-center py-10 text-xs text-brand-muted">첫 번째 댓글을 작성해 보세요!</p>';
          return;
        }

        // Sort comments
        let sorted = [...commentsData];
        if (currentSort === 'likes') {
          sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        } else if (currentSort === 'newest') {
          sorted.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
        } else {
          sorted.sort((a, b) => (a.id || '').localeCompare(b.id || ''));
        }

        let html = '';
        sorted.forEach(c => {
          const initial = (c.nickname || '한').charAt(0);
          const hasReplies = c.replies && c.replies.length > 0;
          const repliesCountText = hasReplies ? `(${c.replies.length})` : '';

          html += `
            <div class="pb-6 border-b border-brand-border/60 last:border-b-0">
              <!-- Comment Header -->
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-blue-100 text-brand-blue text-[11px] font-bold flex items-center justify-center">${escapeHtml(initial)}</span>
                  <span class="font-bold text-xs text-brand-dark">${escapeHtml(c.nickname)}</span>
                  <span class="text-[11px] text-brand-muted">${escapeHtml(c.createdAt || '')}</span>
                </div>
                ${c.password ? `<button onclick="deleteCommentPrompt('${c.id}')" class="text-[11px] text-brand-muted hover:text-red-500 transition-colors cursor-pointer">삭제</button>` : ''}
              </div>

              <!-- Comment Body -->
              <p class="text-sm text-brand-dark leading-relaxed mb-3 pl-8">${escapeHtml(c.content)}</p>

              <!-- Comment Actions -->
              <div class="flex items-center justify-between pl-8 text-xs font-medium text-brand-muted">
                <button onclick="toggleReplyBox('${c.id}')" class="hover:text-brand-blue transition-colors flex items-center gap-1 cursor-pointer">
                  💬 답글 ${repliesCountText}
                </button>
                <div class="flex items-center gap-3">
                  <button onclick="toggleLikeComment('${c.id}', false)" class="flex items-center gap-1 px-2.5 py-1 rounded-full border transition-all cursor-pointer ${c.userLiked ? 'bg-blue-50 border-brand-blue text-brand-blue font-bold' : 'border-brand-border hover:border-brand-blue hover:text-brand-blue'}">
                    👍 공감 ${c.likes || 0}
                  </button>
                  <button onclick="toggleDislikeComment('${c.id}')" class="flex items-center gap-1 px-2.5 py-1 rounded-full border transition-all cursor-pointer ${c.userDisliked ? 'bg-gray-100 border-gray-400 text-gray-700 font-bold' : 'border-brand-border hover:border-gray-400'}">
                    👎 비공감 ${c.dislikes || 0}
                  </button>
                </div>
              </div>

              <!-- Reply Input Box (When clicked) -->
              ${activeReplyId === c.id ? `
                <div class="mt-4 ml-8 p-4 rounded-xl bg-gray-50 border border-brand-border">
                  <p class="text-xs font-bold text-brand-muted mb-2">답글 작성하기</p>
                  <form onsubmit="handleReplySubmit(event, '${c.id}')">
                    <div class="flex gap-2 mb-2">
                      <input type="text" id="reply-nick-${c.id}" required placeholder="닉네임" class="text-xs p-2 rounded-lg border border-brand-border bg-white w-44 block outline-none focus:border-brand-blue">
                      <input type="password" id="reply-pass-${c.id}" maxlength="4" placeholder="비밀번호 4자리 (선택)" class="text-xs p-2 rounded-lg border border-brand-border bg-white w-44 block outline-none focus:border-brand-blue">
                    </div>
                    <textarea id="reply-content-${c.id}" required rows="2" maxlength="300" placeholder="답글 내용을 입력하세요." class="w-full text-xs p-2.5 rounded-lg border border-brand-border bg-white outline-none focus:border-brand-blue mb-2 resize-none"></textarea>
                    <div class="flex gap-2 justify-end">
                      <button type="button" onclick="toggleReplyBox('${c.id}')" class="text-xs px-3 py-1.5 rounded-full border border-brand-border hover:bg-gray-200 cursor-pointer">취소</button>
                      <button type="submit" class="text-xs font-semibold px-4 py-1.5 rounded-full bg-brand-blue text-white hover:bg-blue-700 cursor-pointer">답글 등록</button>
                    </div>
                  </form>
                </div>
              ` : ''}

              <!-- Replies List -->
              ${hasReplies ? `
                <div class="mt-4 ml-8 space-y-3 pl-4 border-l-2 border-brand-blue/30">
                  ${c.replies.map(r => `
                    <div class="pt-2">
                      <div class="flex items-center justify-between mb-1">
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-xs text-brand-dark">${escapeHtml(r.nickname)}</span>
                          <span class="text-[10px] text-brand-muted">${escapeHtml(r.createdAt || '')}</span>
                        </div>
                        ${r.password ? `<button onclick="deleteCommentPrompt('${r.id}')" class="text-[10px] text-brand-muted hover:text-red-500 transition-colors cursor-pointer">삭제</button>` : ''}
                      </div>
                      <p class="text-xs text-brand-dark leading-relaxed mb-2">${escapeHtml(r.content)}</p>
                      <div class="flex items-center justify-end gap-2 text-[11px] text-brand-muted">
                        <button onclick="toggleLikeComment('${r.id}', true, '${c.id}')" class="flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] cursor-pointer ${r.userLiked ? 'bg-blue-50 border-brand-blue text-brand-blue font-bold' : 'border-brand-border hover:border-brand-blue hover:text-brand-blue'}">
                          👍 ${r.likes || 0}
                        </button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `;
        });

        container.innerHTML = html;
      }

      function escapeHtml(str) {
        if (!str) return '';
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      }

      // Initialize on load
      document.addEventListener('DOMContentLoaded', loadComments);
    })();
  </script>
  <script src="/js/cms-client.js?v=3.5.0"></script>
  <script src="/js/fixes.js?v=1.2"></script>
</body>
</html>
