<?php
/**
 * Public NJ Partners API (/api/partners.php)
 * Serves visible hero slides and visible partners to the public directory.
 * Never exposes private credentials or API keys.
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/partners_db.php';

$data = get_partners_data();

// 1. Process Hero Slides: visible only, max 3, sorted by order
$rawSlides = $data['hero_slides'] ?? [];
$slides = [];
foreach ($rawSlides as $s) {
    if (!empty($s['visible'])) {
        $slides[] = [
            'id' => $s['id'] ?? '',
            'title' => $s['title'] ?? '',
            'subtitle' => $s['subtitle'] ?? '',
            'tag' => $s['tag'] ?? '',
            'imageUrl' => $s['imageUrl'] ?? '',
            'buttonText' => $s['buttonText'] ?? '자세히 보기 →',
            'buttonLink' => $s['buttonLink'] ?? '#',
            'order' => intval($s['order'] ?? 1)
        ];
    }
}
usort($slides, function($a, $b) {
    return $a['order'] <=> $b['order'];
});
$slides = array_slice($slides, 0, 3); // Enforce max 3

// 2. Process Partners: visible only, sorted by order
$rawPartners = $data['partners'] ?? [];
$partners = [];
foreach ($rawPartners as $p) {
    if (!empty($p['visible'])) {
        $partners[] = [
            'id' => $p['id'] ?? '',
            'name' => $p['name'] ?? '',
            'category' => $p['category'] ?? '',
            'town' => $p['town'] ?? '',
            'imageUrl' => $p['imageUrl'] ?? '',
            'intro' => $p['intro'] ?? '',
            'content' => $p['content'] ?? '',
            'tags' => is_array($p['tags'] ?? null) ? $p['tags'] : [],
            'minisiteUrl' => $p['minisiteUrl'] ?? '',
            'contactMethod' => $p['contactMethod'] ?? 'kakao',
            'email' => $p['email'] ?? '',
            'kakaoChannelId' => $p['kakaoChannelId'] ?? '',
            'featured' => !empty($p['featured']),
            'isSample' => $p['isSample'] ?? '가상 상호',
            'order' => intval($p['order'] ?? 1)
        ];
    }
}
usort($partners, function($a, $b) {
    return $a['order'] <=> $b['order'];
});

echo json_encode([
    'success' => true,
    'hero_slides' => $slides,
    'partners' => $partners,
    'total' => count($partners)
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
