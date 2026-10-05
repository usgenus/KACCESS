<?php
/**
 * Web Push Notification Dispatcher
 * Broadcasts real-time notifications to subscribers via standard VAPID Web Push protocol.
 */
require_once __DIR__ . '/config.php';

define('VAPID_PUBLIC_KEY', 'BJpQ9Wxw10X-8ODi78gIo2j2heFmIhHK5VqhxgIN_NJ6c0GJxIgNF6CCZQgH-X9W7oPu_PsxYqDhJ1PKRWFxbkQ');
define('VAPID_PRIVATE_KEY', 'HfgadWxf2RlpPNSzq14VuxsJTyKaBfAx-Pqj8zwIRN4');
define('VAPID_SUBJECT', 'mailto:njaccessportal@gmail.com');

// PKCS#8 PEM private key for standard OpenSSL ES256 signing
define('VAPID_PRIVATE_PEM', "-----BEGIN PRIVATE KEY-----\n"
. "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgHfgadWxf2RlpPNSz\n"
. "q14VuxsJTyKaBfAx+Pqj8zwIRN6hRANCAASaUPVscNdF/vDg4u/ICKNo9oXhZiIR\n"
. "yuVaocYCDfzSenNBicSIDReggmUIB/l/Vu6D7vz7MWKg4SdTykVhcW5E\n"
. "-----END PRIVATE KEY-----");

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

/**
 * Convert DER signature from OpenSSL into raw IEEE P1363 (R||S) format
 */
function der_to_p1363($der) {
    $pos = 2;
    if (ord($der[1]) & 0x80) {
        $pos += (ord($der[1]) & 0x7f);
    }
    // R integer
    $pos++;
    $rLen = ord($der[$pos++]);
    $r = substr($der, $pos, $rLen);
    $pos += $rLen;
    // S integer
    $pos++;
    $sLen = ord($der[$pos++]);
    $s = substr($der, $pos, $sLen);

    $r = str_pad(ltrim($r, "\x00"), 32, "\x00", STR_PAD_LEFT);
    $s = str_pad(ltrim($s, "\x00"), 32, "\x00", STR_PAD_LEFT);
    return $r . $s;
}

/**
 * Generate standard RFC 8292 VAPID JWT token
 */
function create_vapid_jwt($aud) {
    $header = base64url_encode(json_encode(['typ' => 'JWT', 'alg' => 'ES256']));
    $claims = base64url_encode(json_encode([
        'aud' => $aud,
        'exp' => time() + 86400,
        'sub' => VAPID_SUBJECT
    ]));
    $payload = $header . '.' . $claims;

    $privKey = openssl_pkey_get_private(VAPID_PRIVATE_PEM);
    if (!$privKey) {
        return null;
    }

    $signature = '';
    if (!openssl_sign($payload, $signature, $privKey, OPENSSL_ALGO_SHA256)) {
        return null;
    }

    $rawSig = der_to_p1363($signature);
    return $payload . '.' . base64url_encode($rawSig);
}

/**
 * Send Web Push to single subscriber endpoint
 */
function send_single_push($endpoint, $payloadJson, $keys = []) {
    $urlParts = parse_url($endpoint);
    $aud = ($urlParts['scheme'] ?? 'https') . '://' . ($urlParts['host'] ?? '');

    $jwt = create_vapid_jwt($aud);
    if (!$jwt) {
        return ['success' => false, 'error' => 'JWT generation failed'];
    }

    $headers = [
        'TTL: 86400',
        'Urgency: high',
        'Topic: njap-news',
        'Authorization: vapid t=' . $jwt . ', k=' . VAPID_PUBLIC_KEY
    ];

    // Check if endpoint is Apple APNs (Safari) or Mozilla (Firefox)
    $isAppleOrMozilla = (strpos($endpoint, 'push.apple.com') !== false || strpos($endpoint, 'mozilla.com') !== false);
    
    // For Apple Safari and Mozilla Firefox, send empty ping/tickle which causes SW to fetch latest news
    $postBody = $isAppleOrMozilla ? '' : $payloadJson;
    if ($isAppleOrMozilla) {
        $headers[] = 'Content-Length: 0';
    }

    $ch = curl_init($endpoint);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postBody);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    // If initial payload failed on 400 (e.g. strict push service rejecting unencrypted body), retry with empty ping
    if ($httpCode === 400 && !empty($postBody)) {
        $ch2 = curl_init($endpoint);
        $headers2 = $headers;
        $headers2[] = 'Content-Length: 0';
        curl_setopt($ch2, CURLOPT_POST, true);
        curl_setopt($ch2, CURLOPT_HTTPHEADER, $headers2);
        curl_setopt($ch2, CURLOPT_POSTFIELDS, '');
        curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch2, CURLOPT_TIMEOUT, 10);
        $response = curl_exec($ch2);
        $httpCode = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
        curl_close($ch2);
    }

    // 200, 201, 202 are success responses
    $isSuccess = ($httpCode >= 200 && $httpCode < 300);
    $isExpired = ($httpCode === 404 || $httpCode === 410);

    return [
        'success' => $isSuccess,
        'httpCode' => $httpCode,
        'expired' => $isExpired,
        'response' => $response,
        'error' => $err
    ];
}

/**
 * Broadcast notification when a new blog post is published
 */
function send_new_post_notification($postItem) {
    $pRoot = defined('PERSISTENT_ROOT') ? PERSISTENT_ROOT : (__DIR__ . '/../data');
    if (!is_dir($pRoot)) @mkdir($pRoot, 0777, true);

    $title = trim($postItem['title'] ?? '새로운 건강 뉴스');
    $excerpt = trim($postItem['excerpt'] ?? '');
    if (!$excerpt && !empty($postItem['content'])) {
        $excerpt = mb_substr(strip_tags($postItem['content']), 0, 100);
    }
    $slug = trim($postItem['slug'] ?? '');
    $cover = trim($postItem['coverImage'] ?? '/favicon-192.png');
    $postId = $postItem['id'] ?? ('p_' . time());

    $cleanTitle = preg_replace('/[\x{1F300}-\x{1F9FF}\x{2600}-\x{26FF}\x{2700}-\x{27BF}]/u', '', $title);
    $cleanTitle = preg_replace('/^\s*(\[속보\]|\[긴급\]|\[안내\]|\[Notice\]|\[Breaking\])\s*/iu', '', $cleanTitle);
    $cleanTitle = trim($cleanTitle);

    $siteOrigin = 'https://njaccessportal.com';
    $coverUrl = $cover;
    if ($coverUrl && strpos($coverUrl, 'http') !== 0) {
        $coverUrl = $siteOrigin . '/' . ltrim($coverUrl, '/');
    }
    $badgeUrl = $siteOrigin . '/favicon-192.png';

    $broadcastPayload = [
        'id' => $postId,
        'title' => '[NJ 한인의료포털] ' . $cleanTitle,
        'body' => $excerpt,
        'icon' => $coverUrl ?: $badgeUrl,
        'badge' => $badgeUrl,
        'url' => '/blog/' . $slug,
        'tag' => 'post-' . $postId,
        'timestamp' => time() * 1000
    ];

    $payloadJson = json_encode($broadcastPayload, JSON_UNESCAPED_UNICODE);

    // 1. Save to persistent and local latest_broadcast.json
    $latestFiles = [
        $pRoot . '/latest_broadcast.json',
        __DIR__ . '/../data/latest_broadcast.json'
    ];
    foreach ($latestFiles as $lf) {
        $d = dirname($lf);
        if (!is_dir($d)) @mkdir($d, 0777, true);
        @file_put_contents($lf, $payloadJson);
        @chmod($lf, 0666);
    }

    // 2. Load subscribers
    $subsFile = $pRoot . '/push_subscriptions.json';
    if (!file_exists($subsFile)) {
        $subsFile = __DIR__ . '/../data/push_subscriptions.json';
    }
    $subs = [];
    if (file_exists($subsFile)) {
        $subs = json_decode(@file_get_contents($subsFile), true) ?: [];
    }

    if (empty($subs)) {
        return [
            'sent' => 0,
            'total' => 0,
            'broadcast' => $broadcastPayload,
            'note' => 'No push subscribers registered yet'
        ];
    }

    $sent = 0;
    $failed = 0;
    $cleaned = [];

    foreach ($subs as $sub) {
        $endpoint = $sub['endpoint'] ?? '';
        if (!$endpoint) continue;

        $res = send_single_push($endpoint, $payloadJson, $sub['keys'] ?? []);
        if ($res['success']) {
            $sent++;
            $cleaned[] = $sub;
        } elseif ($res['expired']) {
            // Drop expired/unregistered subscription
            $failed++;
        } else {
            // Keep on transient failure
            $cleaned[] = $sub;
            $failed++;
        }
    }

    // 3. Save pruned subscriber list if any expired were removed
    if (count($cleaned) !== count($subs)) {
        $cleanedJson = json_encode(array_values($cleaned), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        @file_put_contents($pRoot . '/push_subscriptions.json', $cleanedJson);
        @file_put_contents(__DIR__ . '/../data/push_subscriptions.json', $cleanedJson);
    }

    return [
        'sent' => $sent,
        'failed' => $failed,
        'total' => count($subs),
        'broadcast' => $broadcastPayload
    ];
}
