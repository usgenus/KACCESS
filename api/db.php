<?php
/**
 * Simple, thread-safe JSON/SQLite Data Store Helper
 */

define('DATA_FILE', __DIR__ . '/../data/content.json');

function get_db_data() {
    if (!file_exists(DATA_FILE)) {
        return [
            'billboards' => [],
            'videos' => [],
            'posts' => [],
            'categories' => [
                'news' => ['전체', 'FDA 리콜', 'Health & Wellness', 'Medicare & ACA'],
                'videos' => ['전체', '심장 & 혈관', '뇌신경 질환', '암 예방 & 검진', '관절 & 정형외과', '만성질환 관리'],
                'billboards' => ['SPECIAL CAMPAIGN', 'MEDICARE UPDATE', 'PATIENT SUPPORT', 'HEALTH WEBINAR']
            ]
        ];
    }

    $content = file_get_contents(DATA_FILE);
    $data = json_decode($content, true);
    if (!$data || !is_array($data)) {
        return [
            'billboards' => [],
            'videos' => [],
            'posts' => [],
            'categories' => []
        ];
    }
    return $data;
}

function save_db_data($data) {
    $dir = dirname(DATA_FILE);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    return file_put_contents(DATA_FILE, $json, LOCK_EX) !== false;
}

function send_json($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function require_auth() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (empty($_SESSION['cms_logged_in']) || $_SESSION['cms_logged_in'] !== true) {
        send_json(['success' => false, 'error' => '인증이 필요합니다. (Unauthorized)'], 401);
    }
}
