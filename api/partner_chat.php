<?php
/**
 * Partner KakaoTalk Chat Link Resolver (/api/partner_chat.php)
 * Resolves the 1:1 chat channel link server-side.
 * Returns public channelId and direct Kakao chat URL.
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/partners_db.php';

$partnerId = trim($_GET['id'] ?? '');
if (!$partnerId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => '파트너 ID가 필요합니다.']);
    exit;
}

$data = get_partners_data();
$partners = $data['partners'] ?? [];

$target = null;
foreach ($partners as $p) {
    if (($p['id'] ?? '') === $partnerId) {
        $target = $p;
        break;
    }
}

if (!$target) {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => '파트너를 찾을 수 없습니다.']);
    exit;
}

$channelId = trim($target['kakaoChannelId'] ?? '');
if (!$channelId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => '등록된 카카오 채널 정보가 없습니다.']);
    exit;
}

// Clean channel ID (remove leading @ if present)
$cleanId = ltrim($channelId, '@');
$chatUrl = 'https://pf.kakao.com/' . $cleanId . '/chat';

echo json_encode([
    'success' => true,
    'partner_name' => $target['name'] ?? '',
    'channel_id' => $cleanId,
    'chat_url' => $chatUrl
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
