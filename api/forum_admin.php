<?php
/**
 * Healthcare Access Portal - Forum CMS Moderation API (/admin2 backend)
 * Strictly protected by the same admin session and credentials as /admin.
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

// 1. Strict Security Gatekeeper: Must match existing /admin session
if (empty($_SESSION['cms_logged_in']) || $_SESSION['cms_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => '관리자 인증이 만료되었거나 로그인되어 있지 않습니다.',
        'redirect' => '/admin2/login.php'
    ]);
    exit;
}

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

// -------------------------------------------------------------
// GET: Fetch Admin Analytics & Moderation Tables
// -------------------------------------------------------------
if ($method === 'GET') {
    // 1. Dashboard overall stats
    if ($action === 'stats' || empty($action)) {
        $stats = forum_get_stats();
        echo json_encode(['success' => true, 'data' => $stats]);
        exit;
    }

    // 2. Fetch all questions for moderation (including hidden & flagged)
    if ($action === 'questions') {
        $specialty = trim($_GET['specialty'] ?? '');
        $status = trim($_GET['status'] ?? 'all');
        $search = trim($_GET['search'] ?? ($_GET['q'] ?? ''));

        $questions = forum_get_questions($specialty, 'latest', $search, $status);
        echo json_encode(['success' => true, 'data' => $questions]);
        exit;
    }

    // 3. Fetch all answers for moderation
    if ($action === 'answers') {
        $data = get_forum_data();
        $answers = array_values($data['answers'] ?? []);
        $qMap = $data['questions'] ?? [];

        $search = trim($_GET['search'] ?? ($_GET['q'] ?? ''));
        $status = trim($_GET['status'] ?? 'all');
        $specialty = trim($_GET['specialty'] ?? '');

        if ($status !== 'all') {
            $answers = array_filter($answers, fn($a) => ($a['status'] ?? 'active') === $status);
        }

        if (!empty($search)) {
            $sLower = mb_strtolower($search);
            $answers = array_filter($answers, function($a) use ($sLower) {
                return str_contains(mb_strtolower($a['body'] ?? ''), $sLower) ||
                       str_contains(mb_strtolower($a['authorName'] ?? ''), $sLower);
            });
        }

        // Attach question title & specialty
        foreach ($answers as &$ans) {
            $q = $qMap[$ans['questionId'] ?? ''] ?? null;
            $ans['questionTitle'] = $q['title'] ?? '삭제된 질문';
            $ans['specialtyId'] = $q['specialtyId'] ?? '';
        }

        if (!empty($specialty) && $specialty !== 'all') {
            $answers = array_filter($answers, fn($a) => ($a['specialtyId'] ?? '') === $specialty);
        }

        usort($answers, fn($a, $b) => strcmp($b['createdAt'] ?? '', $a['createdAt'] ?? ''));
        echo json_encode(['success' => true, 'data' => array_values($answers)]);
        exit;
    }

    // 4. Fetch all user profiles (Google accounts & Clinicians)
    if ($action === 'users') {
        $data = get_forum_data();
        $users = array_values($data['users'] ?? []);
        $search = trim($_GET['search'] ?? ($_GET['q'] ?? ''));

        if (!empty($search)) {
            $sLower = mb_strtolower($search);
            $users = array_filter($users, function($u) use ($sLower) {
                return str_contains(mb_strtolower($u['name'] ?? ''), $sLower) ||
                       str_contains(mb_strtolower($u['email'] ?? ''), $sLower);
            });
        }

        usort($users, fn($a, $b) => strcmp($b['createdAt'] ?? '', $a['createdAt'] ?? ''));
        $doctorEmails = forum_get_doctor_emails();
        echo json_encode([
            'success' => true,
            'data' => array_values($users),
            'doctor_emails' => $doctorEmails
        ]);
        exit;
    }

    // 5. Fetch registered doctor emails directly
    if ($action === 'doctor_emails') {
        $doctorEmails = forum_get_doctor_emails();
        echo json_encode(['success' => true, 'data' => $doctorEmails]);
        exit;
    }

    // 6. Fetch events list
    if ($action === 'events') {
        $data = get_forum_data();
        $questions = array_values($data['questions'] ?? []);
        $events = array_filter($questions, fn($q) => ($q['specialtyId'] ?? '') === 'events');
        usort($events, fn($a, $b) => strcmp($b['createdAt'] ?? '', $a['createdAt'] ?? ''));
        echo json_encode(['success' => true, 'data' => array_values($events)]);
        exit;
    }
}

// -------------------------------------------------------------
// POST: Moderation Commands
// -------------------------------------------------------------
if ($method === 'POST') {
    // 0. Upload Event Poster (JPEG, PNG, WEBP)
    if ($action === 'upload_poster') {
        if (empty($_FILES['poster']) && empty($_FILES['file'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '업로드할 포스터 이미지 파일을 선택해주세요.']);
            exit;
        }

        $file = $_FILES['poster'] ?? $_FILES['file'];
        $uploadResult = forum_handle_image_upload($file, 'event_poster_');
        if (!$uploadResult['success']) {
            http_response_code(400);
            echo json_encode($uploadResult);
            exit;
        }

        echo json_encode([
            'success' => true,
            'message' => '포스터 이미지가 성공적으로 업로드되었습니다.',
            'url' => $uploadResult['url'],
            'data' => $uploadResult
        ]);
        exit;
    }

    // 0.1 Create New Event with optional poster and email broadcast
    if ($action === 'create_event') {
        $title = trim($input['title'] ?? '');
        $body = trim($input['body'] ?? '');
        $poster = trim($input['poster'] ?? ($input['poster_url'] ?? ''));
        $sendBroadcast = !isset($input['send_broadcast']) || !empty($input['send_broadcast']);

        if (mb_strlen($title) < 2) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '이벤트 제목을 입력해주세요.']);
            exit;
        }

        if (mb_strlen($body) < 5) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '이벤트 상세 내용을 5자 이상 입력해주세요.']);
            exit;
        }

        $adminUser = [
            'id' => 'hac_admin',
            'name' => 'Healthcare Access Portal (HAC)',
            'email' => 'contact@njaccessportal.com',
            'avatar' => '/logo-icon.svg',
            'isVerifiedClinician' => true,
            'clinicianTitle' => 'NJAP 포럼 공식 운영진'
        ];

        $images = [];
        if (!empty($poster)) {
            $images[] = $poster;
        }

        // Add additional images if provided
        if (!empty($input['images']) && is_array($input['images'])) {
            foreach ($input['images'] as $img) {
                if (is_string($img) && trim($img) !== '' && !in_array($img, $images)) {
                    $images[] = trim($img);
                }
            }
        }

        $eventQ = forum_add_question($title, $body, 'events', $adminUser, 'Healthcare Access Portal (HAC)', $images);

        $broadcastResult = null;
        if ($sendBroadcast) {
            $data = get_forum_data();
            $allUsers = array_values($data['users'] ?? []);
            $broadcastResult = forum_send_event_broadcast_email($eventQ, $allUsers, $poster ?: null);
        }

        echo json_encode([
            'success' => true,
            'message' => '이벤트가 성공적으로 등록되었습니다.' . ($broadcastResult ? " (포럼 가입 회원 {$broadcastResult['sent']}명에게 알림 발송)" : ''),
            'data' => $eventQ,
            'broadcast' => $broadcastResult
        ]);
        exit;
    }

    // 1. Moderate Question (toggle status: active / hidden / flagged)
    if ($action === 'moderate_question') {
        $id = trim($input['id'] ?? '');
        $status = trim($input['status'] ?? 'active');

        if (!in_array($status, ['active', 'hidden', 'flagged'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '올바른 상태값이 아닙니다.']);
            exit;
        }

        $res = forum_moderate_question($id, $status);
        echo json_encode(['success' => $res, 'message' => '질문 상태가 업데이트되었습니다.']);
        exit;
    }

    // 2. Delete Question
    if ($action === 'delete_question') {
        $id = trim($input['id'] ?? '');
        $res = forum_delete_question($id);
        echo json_encode(['success' => $res, 'message' => '질문 및 관련 답변이 삭제되었습니다.']);
        exit;
    }

    // 3. Moderate Answer (toggle status: active / hidden / flagged)
    if ($action === 'moderate_answer') {
        $id = trim($input['id'] ?? '');
        $status = trim($input['status'] ?? 'active');

        if (!in_array($status, ['active', 'hidden', 'flagged'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '올바른 상태값이 아닙니다.']);
            exit;
        }

        $res = forum_moderate_answer($id, $status);
        echo json_encode(['success' => $res, 'message' => '답변 상태가 업데이트되었습니다.']);
        exit;
    }

    // 4. Delete Answer
    if ($action === 'delete_answer') {
        $id = trim($input['id'] ?? '');
        $res = forum_delete_answer($id);
        echo json_encode(['success' => $res, 'message' => '답변이 삭제되었습니다.']);
        exit;
    }

    // 5. User Management: Toggle "Verified Clinician" Badge
    if ($action === 'toggle_verified_clinician') {
        $userId = trim($input['userId'] ?? '');
        $isVerified = !empty($input['isVerified']);
        $title = trim($input['clinicianTitle'] ?? '');

        $res = forum_toggle_user_badge($userId, $isVerified, $title);
        echo json_encode([
            'success' => $res,
            'message' => $isVerified ? '의료 전문가 인증 배지가 부여되었습니다.' : '의료 전문가 인증 배지가 해제되었습니다.'
        ]);
        exit;
    }

    // 6. User Management: Toggle Ban User
    if ($action === 'toggle_ban_user') {
        $userId = trim($input['userId'] ?? '');
        $isBanned = !empty($input['isBanned']);

        $res = forum_toggle_user_ban($userId, $isBanned);
        echo json_encode([
            'success' => $res,
            'message' => $isBanned ? '해당 사용자가 활동 정지(차단) 처리되었습니다.' : '해당 사용자의 이용 제한이 해제되었습니다.'
        ]);
        exit;
    }

    // 7. Doctor Gmail Management: Register Doctor Gmail for Automatic Badge
    if ($action === 'add_doctor_email') {
        $email = trim($input['email'] ?? '');
        $title = trim($input['title'] ?? '전문의 (MD)');

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '올바른 Gmail/이메일 주소를 입력해주세요.']);
            exit;
        }

        $res = forum_add_doctor_email($email, $title);
        echo json_encode([
            'success' => $res,
            'message' => "'{$email}' 주소가 전문의로 등록되었습니다. 해당 계정 로그인 시 의사 배지가 자동 부여됩니다."
        ]);
        exit;
    }

    // 8. Doctor Gmail Management: Remove Doctor Gmail
    if ($action === 'remove_doctor_email') {
        $email = trim($input['email'] ?? '');
        if (empty($email)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '삭제할 이메일 주소를 지정해주세요.']);
            exit;
        }

        $res = forum_remove_doctor_email($email);
        echo json_encode([
            'success' => $res,
            'message' => "'{$email}' 전문의 배지 등록이 취소/삭제되었습니다."
        ]);
        exit;
    }
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => '지원하지 않는 관리자 요청입니다.']);
