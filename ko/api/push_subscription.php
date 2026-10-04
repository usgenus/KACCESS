<?php
/**
 * Push Subscription Endpoint
 * Manages Web Push subscribers for New Blog News & Emergency Recalls.
 */
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/push_notify.php';

function get_subscriptions_file() {
    $pRoot = defined('PERSISTENT_ROOT') ? PERSISTENT_ROOT : (__DIR__ . '/../data');
    if (!is_dir($pRoot)) {
        @mkdir($pRoot, 0777, true);
    }
    return $pRoot . '/push_subscriptions.json';
}

function load_all_subscriptions() {
    $file = get_subscriptions_file();
    if (file_exists($file)) {
        $json = @file_get_contents($file);
        $data = json_decode($json, true);
        if (is_array($data)) return $data;
    }
    // Fallback to local mirror
    $local = __DIR__ . '/../data/push_subscriptions.json';
    if (file_exists($local)) {
        $json = @file_get_contents($local);
        $data = json_decode($json, true);
        if (is_array($data)) return $data;
    }
    return [];
}

function save_all_subscriptions($subs) {
    $file = get_subscriptions_file();
    $data = json_encode(array_values($subs), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    @file_put_contents($file, $data);
    @chmod($file, 0666);

    // Sync to local data directory
    $local = __DIR__ . '/../data/push_subscriptions.json';
    if ($local !== $file) {
        $dir = dirname($local);
        if (!is_dir($dir)) @mkdir($dir, 0777, true);
        @file_put_contents($local, $data);
        @chmod($local, 0666);
    }
}

$action = $_GET['action'] ?? ($_POST['action'] ?? 'status');

if ($action === 'vapid_key') {
    echo json_encode([
        'success' => true,
        'publicKey' => VAPID_PUBLIC_KEY
    ]);
    exit;
}

if ($action === 'subscribe') {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true);

    if (empty($body['endpoint'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Endpoint is required']);
        exit;
    }

    $endpoint = trim($body['endpoint']);
    $keys = $body['keys'] ?? [];
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? ($body['userAgent'] ?? '');

    $subs = load_all_subscriptions();
    $existingIndex = -1;
    foreach ($subs as $i => $s) {
        if (($s['endpoint'] ?? '') === $endpoint) {
            $existingIndex = $i;
            break;
        }
    }

    $subRecord = [
        'endpoint' => $endpoint,
        'keys' => [
            'p256dh' => $keys['p256dh'] ?? '',
            'auth' => $keys['auth'] ?? ''
        ],
        'userAgent' => $userAgent,
        'subscribedAt' => date('Y-m-d H:i:s'),
        'lastActiveAt' => date('Y-m-d H:i:s'),
        'ip' => $_SERVER['REMOTE_ADDR'] ?? ''
    ];

    if ($existingIndex >= 0) {
        $subs[$existingIndex] = $subRecord;
    } else {
        $subs[] = $subRecord;
    }

    save_all_subscriptions($subs);

    echo json_encode([
        'success' => true,
        'message' => 'Subscription registered successfully',
        'totalSubscribers' => count($subs)
    ]);
    exit;
}

if ($action === 'unsubscribe') {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true);
    $endpoint = trim($body['endpoint'] ?? '');

    if ($endpoint) {
        $subs = load_all_subscriptions();
        $filtered = array_filter($subs, function($s) use ($endpoint) {
            return ($s['endpoint'] ?? '') !== $endpoint;
        });
        save_all_subscriptions($filtered);
    }

    echo json_encode(['success' => true, 'message' => 'Unsubscribed successfully']);
    exit;
}

if ($action === 'test_broadcast') {
    $subs = load_all_subscriptions();
    $testItem = [
        'id' => 'test_' . time(),
        'title' => '새로운 의료 뉴스 알림 테스트',
        'excerpt' => '뉴저지 한인 의료접근센터 실시간 알림 서비스가 정상 작동 중입니다.',
        'slug' => 'test-notification',
        'coverImage' => '/favicon-192.png'
    ];
    $result = send_new_post_notification($testItem);
    echo json_encode([
        'success' => true,
        'subscribersCount' => count($subs),
        'broadcastResult' => $result
    ]);
    exit;
}

// Default: status
$subs = load_all_subscriptions();
$latestFile = (defined('PERSISTENT_ROOT') ? PERSISTENT_ROOT : (__DIR__ . '/../data')) . '/latest_broadcast.json';
$latest = file_exists($latestFile) ? json_decode(file_get_contents($latestFile), true) : null;

echo json_encode([
    'success' => true,
    'totalSubscribers' => count($subs),
    'publicKey' => VAPID_PUBLIC_KEY,
    'latestBroadcast' => $latest
]);
