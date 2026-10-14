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
        $unresolvedReports = forum_get_unresolved_report_counts();
        echo json_encode([
            'success' => true,
            'data' => $questions,
            'unresolved_reports' => $unresolvedReports
        ]);
        exit;
    }

    // 2.5 Fetch reported listings for dedicated CMS tab
    if ($action === 'reported_listings') {
        $reported = forum_get_reported_listings();
        echo json_encode(['success' => true, 'data' => $reported]);
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
        $events = array_filter($questions, fn($q) => in_array($q['specialtyId'] ?? '', ['events', 'announcements']) || in_array($q['categoryId'] ?? '', ['events', 'announcements']));
        usort($events, fn($a, $b) => strcmp($b['createdAt'] ?? '', $a['createdAt'] ?? ''));
        echo json_encode(['success' => true, 'data' => array_values($events)]);
        exit;
    }

    // 6.5 Fetch club rooms list
    if ($action === 'club_rooms') {
        $search = trim($_GET['search'] ?? ($_GET['q'] ?? ''));
        $status = trim($_GET['status'] ?? 'all');
        $type = trim($_GET['type'] ?? '');
        $rooms = forum_get_club_rooms($type ?: null, $search, $status);
        echo json_encode(['success' => true, 'data' => $rooms]);
        exit;
    }

    // 7. Fetch categories tree & board settings
    if ($action === 'board_settings' || $action === 'categories_tree') {
        $categories = forum_get_categories();
        $subBoards = forum_get_sub_boards();
        $settings = forum_get_board_settings();
        echo json_encode([
            'success' => true,
            'data' => [
                'categories' => $categories,
                'subBoards' => $subBoards,
                'settings' => $settings
            ]
        ]);
        exit;
    }

    // 8. Fetch featured ads
    if ($action === 'featured_ads') {
        $ads = forum_get_featured_ads(false);
        echo json_encode(['success' => true, 'data' => $ads]);
        exit;
    }
}

// -------------------------------------------------------------
// POST: Moderation Commands
// -------------------------------------------------------------
if ($method === 'POST') {
    // 0.0 Update Board Settings
    if ($action === 'update_board_settings') {
        $boardId = trim($input['boardId'] ?? ($input['board_id'] ?? ''));
        $settings = $input['settings'] ?? [];
        if (empty($boardId) || !is_array($settings)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '보드 ID와 설정값을 확인해주세요.']);
            exit;
        }
        $res = forum_update_board_settings($boardId, $settings);
        echo json_encode(['success' => $res, 'message' => '게시판 설정이 업데이트되었습니다.']);
        exit;
    }

    // 0.01 Move Question / Change category & sub-board
    if ($action === 'move_question' || $action === 'update_question_category') {
        $id = trim($input['id'] ?? '');
        $categoryId = trim($input['categoryId'] ?? ($input['category_id'] ?? ($input['specialty_id'] ?? '')));
        $subBoardId = trim($input['subBoardId'] ?? ($input['sub_board_id'] ?? '')) ?: null;

        if (empty($id) || empty($categoryId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '게시물 ID와 카테고리를 지정해주세요.']);
            exit;
        }

        $res = forum_update_question_specialty($id, $categoryId, $subBoardId);
        echo json_encode(['success' => $res, 'message' => '게시물이 성공적으로 이동되었습니다.']);
        exit;
    }

    // 0.02 Moderate Club Room (Close/Flag or Re-open)
    if ($action === 'toggle_club_room_status') {
        $roomId = trim($input['room_id'] ?? ($input['roomId'] ?? ''));
        $status = trim($input['status'] ?? 'closed');
        $closeReason = trim($input['close_reason'] ?? '운영 정책 위반으로 제재(Flagged) 처리되었습니다. 문의: njaccessportal@gmail.com');
        if (!$roomId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '룸 ID가 필요합니다.']);
            exit;
        }
        $updated = forum_set_club_room_status($roomId, $status, $closeReason);
        if (!$updated) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => '해당 룸을 찾을 수 없습니다.']);
            exit;
        }
        echo json_encode([
            'success' => true,
            'message' => ($status === 'closed' ? '룸이 제재(Flagged) 및 폐쇄 처리되었습니다.' : '룸 제재가 해제되고 정상 복구되었습니다.'),
            'data' => $updated
        ]);
        exit;
    }

    // 0.03 Delete Club Room
    if ($action === 'delete_club_room') {
        $roomId = trim($input['room_id'] ?? ($input['roomId'] ?? ''));
        if (!$roomId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '룸 ID가 필요합니다.']);
            exit;
        }
        $deleted = forum_delete_club_room($roomId);
        if (!$deleted) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => '해당 룸을 찾을 수 없습니다.']);
            exit;
        }
        echo json_encode([
            'success' => true,
            'message' => '룸 및 소속 게시물이 영구 삭제되었습니다.'
        ]);
        exit;
    }
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
            'name' => 'NJ Access Portal',
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

        $eventQ = forum_add_question($title, $body, 'events', $adminUser, 'NJ Access Portal', $images);

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

    // 1.4 Update Forum Disclaimer
    if ($action === 'update_disclaimer') {
        $disclaimer = trim($input['disclaimer'] ?? '');
        if (mb_strlen($disclaimer) < 5) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '면책 조항 문구를 5자 이상 입력해주세요.']);
            exit;
        }
        $res = forum_update_disclaimer($disclaimer);
        echo json_encode(['success' => $res, 'message' => '포럼 의료 면책 조항이 업데이트되었습니다.', 'disclaimer' => $disclaimer]);
        exit;
    }

    // 1.5 Update Question Specialty / Category
    if ($action === 'update_question_specialty') {
        $id = trim($input['id'] ?? '');
        $specialtyId = trim($input['specialty_id'] ?? ($input['specialtyId'] ?? ''));

        if (empty($id) || empty($specialtyId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '질문 ID와 변경할 진료과/카테고리를 선택해주세요.']);
            exit;
        }

        $res = forum_update_question_specialty($id, $specialtyId);
        if (!$res) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '카테고리 변경에 실패했습니다. 유효한 카테고리인지 확인해주세요.']);
            exit;
        }

        echo json_encode(['success' => true, 'message' => '질문의 카테고리가 성공적으로 변경되었습니다.']);
        exit;
    }

    // 2. Delete Question
    if ($action === 'delete_question') {
        $id = trim($input['id'] ?? '');
        $res = forum_delete_question($id);
        echo json_encode(['success' => $res, 'message' => '질문 및 관련 답변이 삭제되었습니다.']);
        exit;
    }

    // 2.1 Dismiss Reports (Clears reported status for listing)
    if ($action === 'dismiss_reports') {
        $listingId = trim($input['listing_id'] ?? ($input['id'] ?? ''));
        if (!$listingId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '게시글 ID가 필요합니다.']);
            exit;
        }
        $res = forum_dismiss_reports($listingId);
        echo json_encode(['success' => true, 'message' => '신고가 성공적으로 기각(처리 완료)되었습니다.']);
        exit;
    }

    // 2.2 Suspend Member
    if ($action === 'suspend_user') {
        $userId = trim($input['user_id'] ?? ($input['id'] ?? ''));
        if (!$userId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '회원 ID가 필요합니다.']);
            exit;
        }
        $res = forum_suspend_user($userId);
        echo json_encode(['success' => true, 'message' => '해당 회원의 이용이 제한되었습니다.']);
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

    // 6.1 User Management: Permanently Delete User
    if ($action === 'delete_user') {
        $userId = trim($input['userId'] ?? ($input['id'] ?? ''));
        if (empty($userId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '삭제할 회원 ID를 지정해주세요.']);
            exit;
        }

        $res = forum_delete_user($userId);
        echo json_encode([
            'success' => $res,
            'message' => $res ? '회원이 성공적으로 영구 삭제되었습니다.' : '회원 삭제에 실패했습니다.'
        ]);
        exit;
    }

    // 7. Expert Management: Register Expert Gmail with Badge Type Choice
    if ($action === 'add_doctor_email' || $action === 'add_expert_email') {
        $email = trim($input['email'] ?? '');
        $title = trim($input['title'] ?? '');
        $badgeType = trim($input['badge_type'] ?? ($input['badgeType'] ?? 'doctor'));

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '올바른 Gmail/이메일 주소를 입력해주세요.']);
            exit;
        }

        $res = forum_add_doctor_email($email, $title, $badgeType);
        $bInfo = forum_get_badge_info($badgeType);
        echo json_encode([
            'success' => $res,
            'message' => "'{$email}' 주소가 [{$bInfo['label']}] 전문가로 등록되었습니다. 해당 계정 로그인 시 공인 배지가 자동 부여됩니다."
        ]);
        exit;
    }

    // 8. Doctor / Expert Gmail Management: Remove Registered Email
    if ($action === 'remove_doctor_email' || $action === 'remove_expert_email') {
        $email = trim($input['email'] ?? '');
        if (empty($email)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '삭제할 이메일 주소를 지정해주세요.']);
            exit;
        }

        $res = forum_remove_doctor_email($email);
        echo json_encode([
            'success' => $res,
            'message' => "'{$email}' 전문가 배지 등록이 취소/삭제되었습니다."
        ]);
        exit;
    }

    // 9. Featured Services & Ads Management
    if ($action === 'save_featured_ad') {
        $ad = $input['ad'] ?? $input;
        if (empty($ad['title'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '서비스/광고 제목을 입력해주세요.']);
            exit;
        }
        $res = forum_save_featured_ad($ad);
        echo json_encode(['success' => $res, 'message' => '추천 서비스/광고가 저장되었습니다.']);
        exit;
    }

    if ($action === 'toggle_featured_ad') {
        $id = trim($input['id'] ?? '');
        $active = !empty($input['active']);
        $res = forum_toggle_featured_ad($id, $active);
        echo json_encode(['success' => $res, 'message' => '광고 노출 상태가 변경되었습니다.']);
        exit;
    }

    if ($action === 'delete_featured_ad') {
        $id = trim($input['id'] ?? '');
        $res = forum_delete_featured_ad($id);
        echo json_encode(['success' => $res, 'message' => '추천 서비스/광고가 삭제되었습니다.']);
        exit;
    }
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => '지원하지 않는 관리자 요청입니다.']);
