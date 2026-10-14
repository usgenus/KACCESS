<?php
/**
 * Admin3 Authentication Controller (/api/admin3_auth.php)
 * Manages admin3 login sessions, password verification, and mandatory first-login password change.
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/partners_db.php';

$action = $_GET['action'] ?? '';
$auth = get_admin3_auth();

// 1. Session Status Check
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'check') {
    $isLoggedIn = !empty($_SESSION['admin3_logged_in']) && $_SESSION['admin3_logged_in'] === true;
    echo json_encode([
        'success' => true,
        'logged_in' => $isLoggedIn,
        'username' => $isLoggedIn ? ($_SESSION['admin3_user'] ?? 'ha') : null,
        'force_password_change' => !empty($auth['force_password_change'])
    ]);
    exit;
}

// 2. Logout
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'logout') {
    unset($_SESSION['admin3_logged_in']);
    unset($_SESSION['admin3_user']);
    unset($_SESSION['admin3_needs_pw_change']);
    echo json_encode(['success' => true, 'message' => '로그아웃되었습니다.']);
    exit;
}

// 3. Login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($action === 'login' || empty($action))) {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $username = trim($input['username'] ?? '');
    $password = trim($input['password'] ?? '');

    $expectedUser = getenv('ADMIN3_USER') ?: ($auth['username'] ?? 'ha');
    $expectedPass = getenv('ADMIN3_PASS') ?: 'ethan';

    $isUserMatch = ($username === $expectedUser);
    $isPassMatch = false;

    // Verify hash or initial env default
    if (!empty($auth['password_hash'])) {
        $isPassMatch = password_verify($password, $auth['password_hash']);
    }
    if (!$isPassMatch && !empty($auth['force_password_change']) && $password === $expectedPass) {
        $isPassMatch = true;
    }

    if ($isUserMatch && $isPassMatch) {
        $_SESSION['admin3_logged_in'] = true;
        $_SESSION['admin3_user'] = $username;
        $_SESSION['admin3_login_time'] = time();

        $forceChange = !empty($auth['force_password_change']);
        if ($forceChange) {
            $_SESSION['admin3_needs_pw_change'] = true;
        } else {
            unset($_SESSION['admin3_needs_pw_change']);
        }

        echo json_encode([
            'success' => true,
            'message' => '로그인 성공',
            'user' => $username,
            'force_password_change' => $forceChange
        ]);
        exit;
    } else {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => '아이디 또는 비밀번호가 올바르지 않습니다.'
        ]);
        exit;
    }
}

// 4. Change Password (Mandatory on first login or user requested)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'change_password') {
    if (empty($_SESSION['admin3_logged_in'])) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => '로그인이 필요합니다.']);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $newPassword = trim($input['new_password'] ?? '');
    $confirmPassword = trim($input['confirm_password'] ?? '');

    if (strlen($newPassword) < 5) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => '비밀번호는 최소 5자 이상이어야 합니다.']);
        exit;
    }

    if ($newPassword !== $confirmPassword) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => '비밀번호 확인이 일치하지 않습니다.']);
        exit;
    }

    // Save new password hash and clear force flag
    $auth['password_hash'] = password_hash($newPassword, PASSWORD_DEFAULT);
    $auth['force_password_change'] = false;
    $auth['updated_at'] = date('c');
    save_admin3_auth($auth);

    unset($_SESSION['admin3_needs_pw_change']);

    echo json_encode([
        'success' => true,
        'message' => '비밀번호가 성공적으로 변경되었습니다.'
    ]);
    exit;
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => '유효하지 않은 요청입니다.']);
