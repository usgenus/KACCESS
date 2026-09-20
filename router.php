<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$fullPath = __DIR__ . $uri;

// 1. If physical file exists, serve it
if ($uri !== '/' && file_exists($fullPath) && !is_dir($fullPath)) {
    return false; // let built-in server serve static file
}

// 2. Custom rewrite rules matching .htaccess
if ($uri === '/' || $uri === '/index.php' || $uri === '/index.html') {
    require __DIR__ . '/index.php';
    exit;
}

if (preg_match('#^/admin2/?$#', $uri)) {
    require __DIR__ . '/admin2/index.php';
    exit;
}

if (preg_match('#^/admin/?$#', $uri)) {
    require __DIR__ . '/admin/index.php';
    exit;
}

if (preg_match('#^/forum/?$#', $uri)) {
    require __DIR__ . '/forum/index.php';
    exit;
}

if (preg_match('#^/forum/ask/?$#', $uri)) {
    require __DIR__ . '/forum/ask.php';
    exit;
}

if (preg_match('#^/forum/category/([^/]+)/?$#', $uri, $m)) {
    $_GET['specialty'] = $m[1];
    require __DIR__ . '/forum/index.php';
    exit;
}

if (preg_match('#^/forum/topic/([^/]+)/?$#', $uri, $m)) {
    $_GET['id'] = $m[1];
    require __DIR__ . '/forum/topic.php';
    exit;
}

if (preg_match('#^/blog/?$#', $uri)) {
    require __DIR__ . '/blog.php';
    exit;
}

if (preg_match('#^/blog/([^/]+)/?$#', $uri, $m)) {
    $_GET['slug'] = $m[1];
    require __DIR__ . '/blog-post.php';
    exit;
}

if (preg_match('#^/the-health-bridge/?$#', $uri)) {
    require __DIR__ . '/the-health-bridge.php';
    exit;
}

if (preg_match('#^/senior-care/?$#', $uri)) {
    require __DIR__ . '/senior-care.php';
    exit;
}

if (preg_match('#^/medicare/?$#', $uri)) {
    readfile(__DIR__ . '/medicare.html');
    exit;
}

if (preg_match('#^/tool/?$#', $uri)) {
    readfile(__DIR__ . '/tool.html');
    exit;
}

if (preg_match('#^/about/?$#', $uri)) {
    readfile(__DIR__ . '/about.html');
    exit;
}

if (preg_match('#^/calculator/?$#', $uri)) {
    readfile(__DIR__ . '/calculator.html');
    exit;
}

if (preg_match('#^/dictionary/?$#', $uri)) {
    readfile(__DIR__ . '/dictionary.html');
    exit;
}

if (preg_match('#^/matcher/?$#', $uri)) {
    readfile(__DIR__ . '/matcher.html');
    exit;
}

// Default fallback
if (file_exists($fullPath . '/index.php')) {
    require $fullPath . '/index.php';
    exit;
}
if (file_exists($fullPath . '/index.html')) {
    readfile($fullPath . '/index.html');
    exit;
}

http_response_code(404);
readfile(__DIR__ . '/404.html');
