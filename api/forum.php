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
// -------------------------------------------------------------
// GET ACTIONS (Public read-only, no authentication required)
// -------------------------------------------------------------
if ($method === 'GET') {
    // 1. Get all 7 categories & sub-boards & board settings
    if ($action === 'categories' || $action === 'specialties') {
        $categories = forum_get_categories();
        $subBoards = forum_get_sub_boards();
        $subSpecialties = forum_get_sub_specialties();
        $boardSettings = forum_get_board_settings();
        $disclaimer = forum_get_disclaimer();
        echo json_encode([
            'success' => true,
            'data' => $categories,
            'categories' => $categories,
            'sub_boards' => $subBoards,
            'sub_specialties' => $subSpecialties,
            'board_settings' => $boardSettings,
            'disclaimer' => $disclaimer
        ]);
        exit;
    }

    // 1.5 Get sub-boards directly
    if ($action === 'sub_boards') {
        $catId = trim($_GET['category'] ?? ($_GET['category_id'] ?? ''));
        $subs = forum_get_sub_boards($catId);
        echo json_encode(['success' => true, 'data' => $subs]);
        exit;
    }

    // 1.6 Get sub-specialties list directly
    if ($action === 'sub_specialties') {
        $subs = forum_get_sub_specialties();
        echo json_encode(['success' => true, 'data' => $subs]);
        exit;
    }

    // 1.7 Get disclaimer
    if ($action === 'disclaimer') {
        echo json_encode(['success' => true, 'disclaimer' => forum_get_disclaimer()]);
        exit;
    }

    // 2. Get single question thread and answers
    if ($action === 'thread' || $action === 'topic') {
        $id = trim($_GET['id'] ?? '');
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '게시물 ID가 지정되지 않았습니다.']);
            exit;
        }

        $thread = forum_get_question($id, true);
        if (!$thread || (($thread['status'] ?? '') === 'hidden')) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => '해당 게시물을 찾을 수 없거나 비공개 상태입니다.']);
            exit;
        }

        // Check if current user has upvoted any answers or liked this thread
        $curUser = get_current_forum_user();
        if ($curUser) {
            $thread['hasLiked'] = in_array($curUser['id'], $thread['likedBy'] ?? []);
            foreach ($thread['answers'] as &$ans) {
                $upvotedBy = $ans['upvotedBy'] ?? [];
                $ans['hasUpvoted'] = in_array($curUser['id'], $upvotedBy);
            }
        }

        echo json_encode(['success' => true, 'data' => $thread, 'disclaimer' => forum_get_disclaimer()]);
        exit;
    }

    // 2.6 Get club rooms
    if ($action === 'club_rooms' || $action === 'get_club_rooms') {
        $type = trim($_GET['type'] ?? '');
        $search = trim($_GET['search'] ?? ($_GET['q'] ?? ''));
        $status = trim($_GET['status'] ?? 'active');
        $isAdmin = !empty($_SESSION['cms_logged_in']) || !empty($_SESSION['admin_logged_in']);
        if (!$isAdmin && $status !== 'all') {
            $status = 'active';
        }
        $rooms = forum_get_club_rooms($type ?: null, $search, $status);
        echo json_encode([
            'success' => true,
            'data' => $rooms,
            'count' => count($rooms)
        ]);
        exit;
    }

    // 2.7 Get single club room and its posts
    if ($action === 'club_room' || $action === 'get_club_room') {
        $roomId = trim($_GET['id'] ?? ($_GET['room_id'] ?? ''));
        if (!$roomId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '룸 ID가 필요합니다.']);
            exit;
        }
        $room = forum_get_club_room($roomId);
        if (!$room) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => '존재하지 않는 동호회/동문회 룸입니다.']);
            exit;
        }
        $tag = trim($_GET['tag'] ?? '');
        $search = trim($_GET['search'] ?? ($_GET['q'] ?? ''));
        $posts = forum_get_club_posts($roomId, $tag ?: null, $search);
        echo json_encode([
            'success' => true,
            'room' => $room,
            'posts' => $posts
        ]);
        exit;
    }

    // 2.8 Get posts for a club room
    if ($action === 'club_posts' || $action === 'get_club_posts') {
        $roomId = trim($_GET['room_id'] ?? ($_GET['id'] ?? ''));
        $tag = trim($_GET['tag'] ?? '');
        $search = trim($_GET['search'] ?? ($_GET['q'] ?? ''));
        $posts = forum_get_club_posts($roomId, $tag ?: null, $search);
        echo json_encode([
            'success' => true,
            'data' => $posts
        ]);
        exit;
    }

    // 3. Get questions list (default action)
    $specialty = trim($_GET['specialty'] ?? ($_GET['category'] ?? ''));
    $subBoard = trim($_GET['sub'] ?? ($_GET['sub_board'] ?? ($_GET['sub_specialty'] ?? ($_GET['subSpecialty'] ?? ''))));
    $sort = trim($_GET['sort'] ?? 'latest');
    $search = trim($_GET['q'] ?? ($_GET['search'] ?? ''));
    $limit = (int)($_GET['limit'] ?? 0);

    $questions = forum_get_questions($specialty, $sort, $search, 'active', $subBoard, $limit);
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
    // 0.0 Upload Club Room Banner (Open to visitors creating rooms)
    if ($action === 'upload_club_banner') {
        if (empty($_FILES['banner']) && empty($_FILES['image']) && empty($_FILES['file'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '업로드할 배너 이미지 파일을 선택해주세요.']);
            exit;
        }
        $file = $_FILES['banner'] ?? ($_FILES['image'] ?? $_FILES['file']);
        $uploadResult = forum_handle_image_upload($file, 'club_banner_');
        if (!$uploadResult['success']) {
            http_response_code(400);
            echo json_encode($uploadResult);
            exit;
        }
        echo json_encode([
            'success' => true,
            'message' => '배너 이미지가 성공적으로 업로드되었습니다.',
            'url' => $uploadResult['url']
        ]);
        exit;
    }

    // 0.01 Create New Club Room (Visitors can create a room)
    if ($action === 'create_club_room') {
        try {
            $newRoom = forum_create_club_room($input);
            echo json_encode([
                'success' => true,
                'message' => '동호회/동문회 룸이 성공적으로 개설되었습니다!',
                'data' => $newRoom,
                'roomId' => $newRoom['id']
            ]);
            exit;
        } catch (InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            exit;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => '룸 개설 중 오류가 발생했습니다: ' . $e->getMessage()]);
            exit;
        }
    }

    // 0.02 Add Post inside Club Room (In-room forum posting)
    if ($action === 'create_club_post') {
        $roomId = trim($input['roomId'] ?? ($input['room_id'] ?? ''));
        if (!$roomId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '룸 ID가 필요합니다.']);
            exit;
        }
        try {
            $post = forum_add_club_post($roomId, $input);
            echo json_encode([
                'success' => true,
                'message' => '룸 게시판에 글이 등록되었습니다.',
                'data' => $post
            ]);
            exit;
        } catch (InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            exit;
        } catch (RuntimeException $e) {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            exit;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => '글 등록 중 오류가 발생했습니다: ' . $e->getMessage()]);
            exit;
        }
    }

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

    // Marketplace In-App Email Contact (Craigslist Style Reply Relay)
    if ($action === 'market_contact') {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        
        // Honeypot check
        if (!empty($input['hp']) || !empty($input['hp_phone_fake'])) {
            echo json_encode(['success' => true, 'message' => '문의가 전송되었습니다.']);
            exit;
        }

        // Rate limit: max 5 messages per IP per hour
        if (!forum_check_rate_limit('market_contact', 5, $ip)) {
            http_response_code(429);
            echo json_encode(['success' => false, 'error' => '시간당 문의 발송 횟수(최대 5건)를 초과했습니다. 잠시 후 다시 시도해 주세요.']);
            exit;
        }

        $listingId = trim($input['listing_id'] ?? '');
        $senderName = trim($input['sender_name'] ?? '');
        $senderEmail = trim($input['sender_email'] ?? '');
        $message = trim($input['message'] ?? '');

        if (!$listingId || !$senderName || !$senderEmail || !$message) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '모든 필수 항목(이름, 이메일, 메시지)을 입력해 주세요.']);
            exit;
        }

        if (!filter_var($senderEmail, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '올바른 이메일 형식을 입력해 주세요.']);
            exit;
        }

        $data = get_forum_data();
        $q = $data['questions'][$listingId] ?? null;
        if (!$q) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => '해당 매물 게시글을 찾을 수 없습니다.']);
            exit;
        }

        $authorId = $q['authorId'] ?? '';
        $author = $data['users'][$authorId] ?? null;
        $recipientEmail = $author['email'] ?? '';

        if (empty($recipientEmail) || !filter_var($recipientEmail, FILTER_VALIDATE_EMAIL)) {
            $recipientEmail = 'njaccessportal@gmail.com';
        }

        $isWantedItem = (($q['categoryId'] ?? '') === 'wanted' || ($q['categoryId'] ?? '') === 'services');
        $subjectPrefix = $isWantedItem ? '서비스 문의' : '중고거래 문의';
        $subject = '[뉴저지 한인 광장] ' . $subjectPrefix . ': ' . ($q['title'] ?? '게시글 문의');
        $subjectEncoded = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $greetingRole = $isWantedItem ? '서비스 작성자님' : '중고거래 판매자님';
        $emailBody = "안녕하세요, 뉴저지 한인 광장 {$greetingRole}.\r\n\r\n"
            . "회원님의 게시글에 새로운 직거래/지원 문의가 도착했습니다.\r\n\r\n"
            . "────────────────────────────────\r\n"
            . "■ 게시글: " . ($q['title'] ?? '') . "\r\n"
            . "■ 문의자 이름: " . $senderName . "\r\n"
            . "■ 문의자 이메일: " . $senderEmail . "\r\n"
            . "■ 문의 일시: " . date('Y-m-d H:i:s T') . "\r\n"
            . "────────────────────────────────\r\n\r\n"
            . "■ 문의 내용:\r\n" . $message . "\r\n\r\n"
            . "────────────────────────────────\r\n"
            . "※ 회신 방법: 본 이메일에 바로 '답장(Reply)'하시면 문의자({$senderEmail})에게 직접 전달됩니다.\r\n"
            . "※ 안전 거래 주의: 선입금 요구, 수표 송금 사기 등에 주의하시고 사람이 많은 공공장소에서 직거래/미팅하세요.\r\n\r\n"
            . "- NJ Access Portal · 뉴저지 한인 광장 드림";

        $headers = [
            'From: NJ Access Portal <noreply@njaccessportal.com>',
            'Reply-To: ' . $senderName . ' <' . $senderEmail . '>',
            'X-Mailer: PHP/' . phpversion(),
            'Content-Type: text/plain; charset=UTF-8'
        ];

        @mail($recipientEmail, $subjectEncoded, $emailBody, implode("\r\n", $headers));

        echo json_encode([
            'success' => true,
            'message' => '판매자에게 문의 메일이 성공적으로 전송되었습니다.'
        ]);
        exit;
    }

    // Marketplace Listing Reporting
    if ($action === 'report_listing') {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

        // Honeypot check
        if (!empty($input['hp']) || !empty($input['hp_name_fake'])) {
            echo json_encode(['success' => true, 'message' => '신고가 접수되었습니다.']);
            exit;
        }

        // Rate limit: max 3 reports per IP per hour
        if (!forum_check_rate_limit('report_listing', 3, $ip)) {
            http_response_code(429);
            echo json_encode(['success' => false, 'error' => '시간당 신고 접수 횟수(최대 3건)를 초과했습니다. 잠시 후 다시 시도해 주세요.']);
            exit;
        }

        $listingId = trim($input['listing_id'] ?? '');
        $reason = trim($input['reason'] ?? '');
        $details = trim($input['details'] ?? '');
        $reporterContact = trim($input['reporter_contact'] ?? '');

        if (!$listingId || !$reason || !$details) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '신고 사유와 상세 내용을 입력해 주세요.']);
            exit;
        }

        $data = get_forum_data();
        $q = $data['questions'][$listingId] ?? null;
        $listingTitle = $q['title'] ?? '(알 수 없는 게시글)';
        $listingUrl = 'https://njaccessportal.com/forum/topic/' . urlencode($listingId);
        $timestamp = date('Y-m-d H:i:s T');

        // Store report in database
        $report = forum_add_report($listingId, $reason, $details, $reporterContact, $ip);

        // Send email to njaccessportal@gmail.com (Destination address NOT exposed to client)
        $reportDest = 'njaccessportal@gmail.com';
        $reportSubject = '[게시글 신고] ' . $reason . ' - ' . $listingTitle;
        $reportSubjectEncoded = '=?UTF-8?B?' . base64_encode($reportSubject) . '?=';
        $reportContent = "뉴저지 한인 광장 중고거래 게시글에 대한 신고가 접수되었습니다.\r\n\r\n"
            . "■ 게시글 ID: " . $listingId . "\r\n"
            . "■ 게시글 제목: " . $listingTitle . "\r\n"
            . "■ 게시글 URL: " . $listingUrl . "\r\n"
            . "■ 신고 사유: " . $reason . "\r\n"
            . "■ 신고 상세 내용:\r\n" . $details . "\r\n\r\n"
            . "■ 신고자 연락처: " . ($reporterContact ?: '(미입력)') . "\r\n"
            . "■ 접수 일시: " . $timestamp . "\r\n"
            . "■ 접수 IP (해시): " . ($report['hashedIp'] ?? '') . "\r\n\r\n"
            . "관리자 관제 센터(/admin2/)에서 해당 매물 검토 및 조치(기각/삭제/회원정지)를 진행할 수 있습니다.";

        $reportHeaders = [
            'From: NJ Access Portal Alerts <noreply@njaccessportal.com>',
            'X-Mailer: PHP/' . phpversion(),
            'Content-Type: text/plain; charset=UTF-8'
        ];

        @mail($reportDest, $reportSubjectEncoded, $reportContent, implode("\r\n", $reportHeaders));

        echo json_encode([
            'success' => true,
            'message' => '신고가 정상 접수되었습니다. 운영진이 신속히 확인 및 조치하겠습니다.'
        ]);
        exit;
    }

    $user = get_current_forum_user();
    if (!$user) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'require_auth' => true,
            'error' => '게시글 등록, 답변 작성 및 공감은 1초 구글 로그인 후 이용하실 수 있습니다.'
        ]);
        exit;
    }

    // 1. Submit a thread (Frictionless: 3 taps from forum home)
    if ($action === 'ask' || $action === 'create_thread') {
        $title = trim($input['title'] ?? '');
        $body = preg_replace('/^[\r\n\s]+/', '', trim($input['body'] ?? ''));
        $specialtyId = trim($input['specialty_id'] ?? ($input['specialtyId'] ?? ($input['category_id'] ?? 'community')));
        $subBoardId = trim($input['sub_board_id'] ?? ($input['subBoardId'] ?? ($input['sub_specialty_id'] ?? ($input['subSpecialtyId'] ?? '')))) ?: null;
        $price = trim($input['price'] ?? '');
        $location = trim($input['location'] ?? '');
        $itemCondition = trim($input['item_condition'] ?? ($input['condition'] ?? ''));

        // Admin-only gate for "events" category
        $isAdmin = !empty($_SESSION['cms_logged_in']) || !empty($_SESSION['admin_logged_in']);
        if ($specialtyId === 'events' && !$isAdmin) {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'error' => '이벤트 섹션은 공식 운영진 전용 등록 공간입니다. 관리자 CMS에서 등록해주세요.'
            ]);
            exit;
        }

        if (mb_strlen($title) < 2) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '제목을 2자 이상 입력해주세요.']);
            exit;
        }

        if (mb_strlen($body) < 2) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '내용을 2자 이상 입력해주세요.']);
            exit;
        }

        // Market Category Validations
        $contactMethods = $input['contact_methods'] ?? [];
        if (is_string($contactMethods)) {
            $contactMethods = json_decode($contactMethods, true) ?: [$contactMethods];
        }
        $contactPhone = trim($input['contact_phone'] ?? '');
        $phoneVisible = isset($input['phone_visible']) ? (int)$input['phone_visible'] : 1;
        $disclaimerAgreed = isset($input['disclaimer_agreed']) ? (int)$input['disclaimer_agreed'] : 0;

        if (in_array($specialtyId, ['market', 'wanted']) || in_array($input['category_id'] ?? '', ['market', 'wanted'])) {
            if (empty($contactMethods)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => '연락 방법(전화, 문자, 이메일) 중 최소 1개 이상을 선택해 주세요.']);
                exit;
            }
            if (in_array('tel', $contactMethods) || in_array('sms', $contactMethods)) {
                $cleanPhone = preg_replace('/[^\d]/', '', $contactPhone);
                if (strlen($cleanPhone) < 10) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'error' => '올바른 연락처 전화번호를 입력해 주세요.']);
                    exit;
                }
            }
            if (!$disclaimerAgreed) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => '거래 및 서비스 주의 안내에 동의하셔야 등록이 가능합니다.']);
                exit;
            }
        }

        // Parse images
        $images = $input['images'] ?? [];
        if (is_string($images)) {
            $decoded = json_decode($images, true);
            $images = is_array($decoded) ? $decoded : ($images ? [$images] : []);
        }

        $videoUrl = trim($input['video_url'] ?? ($input['videoUrl'] ?? ''));
        $webLink = trim($input['web_link'] ?? ($input['webLink'] ?? ''));
        $authorName = trim($input['author_name'] ?? ($input['name'] ?? ($input['nickname'] ?? '')));
        $authorAvatar = trim($input['author_avatar'] ?? '');
        if (!preg_match('#^/assets/avatars/avatar_\d{2}\.svg$#', $authorAvatar)) $authorAvatar = '';

        $rating = (isset($input['rating']) && $input['rating'] !== '' && $input['rating'] !== null) ? floatval($input['rating']) : null;

        try {
            $question = forum_add_question(
                $title,
                $body,
                $specialtyId,
                $user,
                $authorName ?: null,
                $images,
                $subBoardId,
                $videoUrl ?: null,
                $webLink ?: null,
                $price ?: null,
                $location ?: null,
                $itemCondition ?: null,
                false,
                $authorAvatar ?: null,
                $rating,
                $contactMethods,
                $contactPhone,
                $phoneVisible,
                $disclaimerAgreed
            );

            echo json_encode([
                'success' => true,
                'message' => '게시물이 성공적으로 등록되었습니다.',
                'data' => $question
            ]);
            exit;
        } catch (Exception $e) {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            exit;
        }
    }

    // 2. Submit an answer / reply
    if ($action === 'reply' || $action === 'answer') {
        $questionId = trim($input['question_id'] ?? ($input['questionId'] ?? ''));
        $body = preg_replace('/^[\r\n\s]+/', '', trim($input['body'] ?? ''));
        $authorName = trim($input['author_name'] ?? ($input['name'] ?? ($input['nickname'] ?? '')));

        if (!$questionId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '게시물 ID가 지정되지 않았습니다.']);
            exit;
        }

        if (mb_strlen($body) < 2) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '댓글 내용을 2자 이상 작성해주세요.']);
            exit;
        }

        // Parse images
        $images = $input['images'] ?? [];
        if (is_string($images)) {
            $decoded = json_decode($images, true);
            $images = is_array($decoded) ? $decoded : ($images ? [$images] : []);
        }

        $authorAvatar = trim($input['author_avatar'] ?? '');
        if (!preg_match('#^/assets/avatars/avatar_\d{2}\.svg$#', $authorAvatar)) $authorAvatar = '';
        $answer = forum_add_answer($questionId, $body, $user, $authorName ?: null, $images, $authorAvatar ?: null);
        if (!$answer) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => '대상 게시물을 찾을 수 없습니다.']);
            exit;
        }

        echo json_encode([
            'success' => true,
            'message' => '댓글이 성공적으로 등록되었습니다.',
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

    // 4. Like / 공감 a thread
    if ($action === 'like' || $action === 'toggle_like') {
        $questionId = trim($input['question_id'] ?? ($input['questionId'] ?? ($input['id'] ?? '')));
        if (!$questionId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '게시물 ID가 지정되지 않았습니다.']);
            exit;
        }

        $result = forum_toggle_question_like($questionId, $user['id']);
        echo json_encode($result);
        exit;
    }
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => '지원하지 않는 API 요청입니다.']);
