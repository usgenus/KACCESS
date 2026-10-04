<?php
/**
 * Healthcare Access Portal - Public Medical Forum API Endpoint
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
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

// Helper to get currently logged in forum user
function get_current_forum_user() {
    $userId = $_SESSION['forum_user_id'] ?? null;
    if (!$userId) return null;
    $user = forum_get_user($userId);
    if ($user && empty($user['isBanned'])) return $user;
    return null;
}

// -------------------------------------------------------------
// -------------------------------------------------------------
// GET ACTIONS (Public read-only, no authentication required)
// -------------------------------------------------------------
if ($method === 'GET') {
    // 1. Get all 5 categories & 19 sub-specialties
    if ($action === 'categories' || $action === 'specialties') {
        $categories = forum_get_categories();
        $subSpecialties = forum_get_sub_specialties();
        $disclaimer = forum_get_disclaimer();
        echo json_encode([
            'success' => true,
            'data' => $categories,
            'categories' => $categories,
            'sub_specialties' => $subSpecialties,
            'disclaimer' => $disclaimer
        ]);
        exit;
    }

    // 1.5 Get sub-specialties list directly
    if ($action === 'sub_specialties') {
        $subs = forum_get_sub_specialties();
        echo json_encode(['success' => true, 'data' => $subs]);
        exit;
    }

    // 1.6 Get disclaimer
    if ($action === 'disclaimer') {
        echo json_encode(['success' => true, 'disclaimer' => forum_get_disclaimer()]);
        exit;
    }

    // 2. Get single question thread and answers
    if ($action === 'thread' || $action === 'topic') {
        $id = trim($_GET['id'] ?? '');
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '질문 ID가 지정되지 않았습니다.']);
            exit;
        }

        $thread = forum_get_question($id, true);
        if (!$thread || (($thread['status'] ?? '') === 'hidden')) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => '해당 의료 질문/정보 나눔 게시물을 찾을 수 없거나 비공개 상태입니다.']);
            exit;
        }

        // Check if current user has upvoted any answers
        $curUser = get_current_forum_user();
        if ($curUser) {
            foreach ($thread['answers'] as &$ans) {
                $upvotedBy = $ans['upvotedBy'] ?? [];
                $ans['hasUpvoted'] = in_array($curUser['id'], $upvotedBy);
            }
        }

        echo json_encode(['success' => true, 'data' => $thread, 'disclaimer' => forum_get_disclaimer()]);
        exit;
    }

    // 3. Get questions list (default action)
    $specialty = trim($_GET['specialty'] ?? ($_GET['category'] ?? ''));
    $subSpecialty = trim($_GET['sub'] ?? ($_GET['sub_specialty'] ?? ($_GET['subSpecialty'] ?? '')));
    $sort = trim($_GET['sort'] ?? 'latest');
    $search = trim($_GET['q'] ?? ($_GET['search'] ?? ''));

    $questions = forum_get_questions($specialty, $sort, $search, 'active', $subSpecialty);
    echo json_encode([
        'success' => true,
        'count' => count($questions),
        'disclaimer' => forum_get_disclaimer(),
        'data' => $questions
    ]);
    exit;
}

// -------------------------------------------------------------
// POST ACTIONS (Require authenticated Google user)
// -------------------------------------------------------------
if ($method === 'POST') {
    // 0. Image Upload Endpoint (Supports JPEG, PNG, WEBP)
    if ($action === 'upload_image') {
        $user = get_current_forum_user();
        $isAdmin = !empty($_SESSION['cms_logged_in']) || !empty($_SESSION['admin_logged_in']);
        if (!$user && !$isAdmin) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'require_auth' => true,
                'error' => '이미지 첨부는 1초 구글 로그인 후 가능합니다.'
            ]);
            exit;
        }

        if (empty($_FILES['image']) && empty($_FILES['file'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '업로드할 이미지 파일을 선택해주세요.']);
            exit;
        }

        $file = $_FILES['image'] ?? $_FILES['file'];
        $uploadResult = forum_handle_image_upload($file, 'forum_img_');
        if (!$uploadResult['success']) {
            http_response_code(400);
            echo json_encode($uploadResult);
            exit;
        }

        echo json_encode([
            'success' => true,
            'message' => '이미지가 성공적으로 업로드되었습니다.',
            'url' => $uploadResult['url'],
            'data' => $uploadResult
        ]);
        exit;
    }

    $user = get_current_forum_user();
    if (!$user) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'require_auth' => true,
            'error' => '질문 등록, 답변 작성 및 추천은 1초 구글 로그인 후 가능합니다.'
        ]);
        exit;
    }

    // 1. Submit a question
    if ($action === 'ask' || $action === 'create_thread') {
        $title = trim($input['title'] ?? '');
        $body = trim($input['body'] ?? '');
        $specialtyId = trim($input['specialty_id'] ?? ($input['specialtyId'] ?? ($input['category_id'] ?? 'general_community')));
        $subSpecialtyId = trim($input['sub_specialty_id'] ?? ($input['subSpecialtyId'] ?? '')) ?: null;

        // Admin-only gate for "events" / "announcements" category
        $isAdmin = !empty($_SESSION['cms_logged_in']) || !empty($_SESSION['admin_logged_in']);
        if (($specialtyId === 'events' || $specialtyId === 'announcements') && !$isAdmin) {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'error' => '이벤트 섹션은 공식 운영진(HAC) 전용 등록 공간입니다. 관리자 CMS(/ko/admin2)에서 등록해주세요.'
            ]);
            exit;
        }

        if (mb_strlen($title) < 5) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '질문 제목을 5자 이상 입력해주세요.']);
            exit;
        }

        if (mb_strlen($body) < 10) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '상담받으실 증상 또는 내용을 10자 이상 구체적으로 적어주세요.']);
            exit;
        }

        // Parse images
        $images = $input['images'] ?? [];
        if (is_string($images)) {
            $decoded = json_decode($images, true);
            $images = is_array($decoded) ? $decoded : ($images ? [$images] : []);
        }

        $authorName = trim($input['author_name'] ?? ($input['name'] ?? ($input['nickname'] ?? '')));
        $question = forum_add_question($title, $body, $specialtyId, $user, $authorName ?: null, $images, $subSpecialtyId);
        echo json_encode([
            'success' => true,
            'message' => '질문/정보 나눔 게시물이 성공적으로 등록되었습니다.',
            'data' => $question
        ]);
        exit;
    }

    // 2. Submit an answer / reply
    if ($action === 'reply' || $action === 'answer') {
        $questionId = trim($input['question_id'] ?? ($input['questionId'] ?? ''));
        $body = trim($input['body'] ?? '');
        $authorName = trim($input['author_name'] ?? ($input['name'] ?? ($input['nickname'] ?? '')));

        if (!$questionId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '질문 ID가 지정되지 않았습니다.']);
            exit;
        }

        if (mb_strlen($body) < 5) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '답변 내용을 5자 이상 작성해주세요.']);
            exit;
        }

        // Parse images
        $images = $input['images'] ?? [];
        if (is_string($images)) {
            $decoded = json_decode($images, true);
            $images = is_array($decoded) ? $decoded : ($images ? [$images] : []);
        }

        $answer = forum_add_answer($questionId, $body, $user, $authorName ?: null, $images);
        if (!$answer) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => '대상 질문을 찾을 수 없습니다.']);
            exit;
        }

        echo json_encode([
            'success' => true,
            'message' => '답변이 성공적으로 등록되었습니다.',
            'data' => $answer
        ]);
        exit;
    }

    // 3. Upvote an answer
    if ($action === 'upvote') {
        $answerId = trim($input['answer_id'] ?? ($input['answerId'] ?? ''));
        if (!$answerId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '답변 ID가 지정되지 않았습니다.']);
            exit;
        }

        $result = forum_toggle_upvote($answerId, $user['id']);
        echo json_encode($result);
        exit;
    }
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => '지원하지 않는 API 요청입니다.']);
