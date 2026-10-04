<?php
/**
 * Healthcare Access Portal - Medical Forum Google Auth & Session Controller
 */
require_once __DIR__ . '/forum_db.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') {
    echo json_encode(['success' => true]);
    exit;
}

$action = $_GET['action'] ?? '';

// 1. Check current authenticated user session
if ($method === 'GET' && ($action === 'me' || empty($action))) {
    $userId = $_SESSION['forum_user_id'] ?? null;
    if ($userId) {
        $user = forum_get_user($userId);
        if ($user && empty($user['isBanned'])) {
            echo json_encode([
                'success' => true,
                'logged_in' => true,
                'user' => $user
            ]);
            exit;
        }
    }
    echo json_encode([
        'success' => true,
        'logged_in' => false,
        'user' => null
    ]);
    exit;
}

// 2. Logout
if ($action === 'logout') {
    unset($_SESSION['forum_user_id']);
    echo json_encode(['success' => true, 'message' => '로그아웃되었습니다.']);
    exit;
}

// 3. Update User Nickname / Display Name
if ($method === 'POST' && ($action === 'update_name' || $action === 'nickname')) {
    $userId = $_SESSION['forum_user_id'] ?? null;
    if (!$userId) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => '로그인이 필요합니다.']);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $newName = trim($input['name'] ?? ($input['nickname'] ?? ''));

    if (empty($newName)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => '변경할 닉네임 또는 성함을 입력해주세요.']);
        exit;
    }

    $ok = forum_update_user_name($userId, $newName);
    if ($ok) {
        $user = forum_get_user($userId);
        echo json_encode(['success' => true, 'message' => '닉네임이 성공적으로 변경되었습니다.', 'user' => $user]);
        exit;
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => '닉네임 변경에 실패했습니다.']);
        exit;
    }
}

// 4. Authenticate with Google Credential or Profile
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    
    // Support Google Identity Services JWT credential payload
    if (!empty($input['credential'])) {
        $jwt = $input['credential'];
        $parts = explode('.', $jwt);
        if (count($parts) === 3) {
            $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);
            if (!empty($payload['sub'])) {
                $userProfile = [
                    'id' => 'g_' . $payload['sub'],
                    'email' => $payload['email'] ?? '',
                    'name' => $payload['name'] ?? ($payload['given_name'] ?? '구글 사용자'),
                    'avatar' => $payload['picture'] ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80'
                ];
                $user = forum_upsert_user($userProfile);
                if (!empty($user['isBanned'])) {
                    http_response_code(403);
                    echo json_encode(['success' => false, 'error' => '이 계정은 관리자에 의해 이용이 제한되었습니다.']);
                    exit;
                }
                $_SESSION['forum_user_id'] = $user['id'];
                echo json_encode(['success' => true, 'user' => $user]);
                exit;
            }
        }
    }

    // Support 1-Click Google Sign-In Profile payload (e.g. from popup or local test simulator)
    if (!empty($input['google_id']) || !empty($input['email'])) {
        $userProfile = [
            'id' => !empty($input['google_id']) ? ('g_' . $input['google_id']) : ('u_' . substr(md5($input['email']), 0, 10)),
            'email' => trim($input['email'] ?? ''),
            'name' => trim($input['name'] ?? '구글 회원'),
            'avatar' => !empty($input['avatar']) ? $input['avatar'] : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80'
        ];

        $user = forum_upsert_user($userProfile);
        if (!empty($user['isBanned'])) {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => '이 계정은 관리자에 의해 이용이 제한되었습니다.']);
            exit;
        }

        $_SESSION['forum_user_id'] = $user['id'];
        echo json_encode(['success' => true, 'user' => $user]);
        exit;
    }

    http_response_code(400);
    echo json_encode(['success' => false, 'error' => '올바른 사용자 인증 정보가 전달되지 않았습니다.']);
    exit;
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => '잘못된 요청입니다.']);
