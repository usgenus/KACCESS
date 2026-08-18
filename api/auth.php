<?php
require_once __DIR__ . '/db.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$method = $_SERVER['REQUEST_METHOD'];

// Handle OPTIONS preflight
if ($method === 'OPTIONS') {
    send_json(['success' => true]);
}

$action = $_GET['action'] ?? '';

// Check current login status
if ($method === 'GET') {
    if ($action === 'check') {
        if (!empty($_SESSION['cms_logged_in']) && $_SESSION['cms_logged_in'] === true) {
            send_json([
                'success' => true,
                'logged_in' => true,
                'user' => $_SESSION['cms_user'] ?? 'hap'
            ]);
        } else {
            send_json([
                'success' => true,
                'logged_in' => false
            ]);
        }
    }
    
    if ($action === 'logout') {
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
        send_json(['success' => true, 'message' => '로그아웃되었습니다.']);
    }
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        $input = $_POST;
    }

    $username = trim($input['username'] ?? '');
    $password = trim($input['password'] ?? '');

    // Required credentials: user: hap, password: ethan
    if ($username === 'hap' && $password === 'ethan') {
        $_SESSION['cms_logged_in'] = true;
        $_SESSION['cms_user'] = 'hap';
        $_SESSION['cms_login_time'] = time();

        send_json([
            'success' => true,
            'message' => '로그인 성공',
            'user' => 'hap'
        ]);
    } else {
        send_json([
            'success' => false,
            'error' => '아이디 또는 비밀번호가 올바르지 않습니다.'
        ], 400);
    }
}

send_json(['success' => false, 'error' => '올바르지 않은 요청입니다.'], 400);
