<?php
/**
 * Admin3 Management API (/api/admin3_manage.php)
 * Handles CRUD for Hero Slides (max 3 visible) and Partners, plus image upload.
 * Strictly requires active admin3 session.
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

if (empty($_SESSION['admin3_logged_in']) || $_SESSION['admin3_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => '관리자 로그인이 필요합니다.']);
    exit;
}

require_once __DIR__ . '/partners_db.php';

$action = $_GET['action'] ?? '';
$data = get_partners_data();
$credentials = get_partner_credentials();

// List of 12 approved categories
$validCategories = [
    '종합병원', '의원·클리닉', '약국', '물리치료·재활',
    '보험·브로커', '시니어 케어', '커뮤니티 센터', '학원/교육',
    '식당', '자동차', '쇼핑', '법률·회계·부동산'
];

// List of 11 approved towns
$validTowns = [
    'Fort Lee', 'Palisades Park', 'Leonia', 'Englewood',
    'Englewood Cliffs', 'Ridgefield', 'Ridgefield Park',
    'Teaneck', 'Hackensack', 'Flushing', 'Bayside'
];

// -------------------------------------------------------------
// 1. Image Upload
// -------------------------------------------------------------
if ($action === 'upload' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => '파일 업로드 중 오류가 발생했습니다.']);
        exit;
    }

    $file = $_FILES['file'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    if (!in_array($ext, $allowed)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => '이미지 파일만 업로드할 수 있습니다 (jpg, png, webp, gif).']);
        exit;
    }

    $destName = 'p_' . time() . '_' . substr(md5(uniqid()), 0, 8) . '.' . $ext;
    $targetDir = LOCAL_ROOT . '/uploads/images/partners';
    if (!is_dir($targetDir)) {
        @mkdir($targetDir, 0777, true);
        @chmod($targetDir, 0777);
    }
    $targetPath = $targetDir . '/' . $destName;

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => '파일 저장에 실패했습니다.']);
        exit;
    }
    @chmod($targetPath, 0666);

    // Also mirror to persistent storage if different
    $pTargetDir = PERSISTENT_ROOT . '/uploads/images/partners';
    if ($pTargetDir !== $targetDir) {
        if (!is_dir($pTargetDir)) { @mkdir($pTargetDir, 0777, true); @chmod($pTargetDir, 0777); }
        @copy($targetPath, $pTargetDir . '/' . $destName);
        @chmod($pTargetDir . '/' . $destName, 0666);
    }

    $relUrl = '/uploads/images/partners/' . $destName;
    echo json_encode([
        'success' => true,
        'url' => $relUrl,
        'filename' => $destName
    ]);
    exit;
}

// -------------------------------------------------------------
// 2. HERO SLIDES
// -------------------------------------------------------------
if ($action === 'get_slides') {
    $slides = $data['hero_slides'] ?? [];
    usort($slides, function($a, $b) {
        return ($a['order'] ?? 1) <=> ($b['order'] ?? 1);
    });
    echo json_encode(['success' => true, 'slides' => $slides]);
    exit;
}

if ($action === 'save_slide' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $id = trim($input['id'] ?? '');
    $title = trim($input['title'] ?? '');
    $subtitle = trim($input['subtitle'] ?? '');
    $tag = trim($input['tag'] ?? '');
    $imageUrl = trim($input['imageUrl'] ?? '');
    $buttonText = trim($input['buttonText'] ?? '자세히 보기 →');
    $buttonLink = trim($input['buttonLink'] ?? '#');
    $order = intval($input['order'] ?? 1);
    $visible = !empty($input['visible']);

    if (!$title) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => '슬라이드 제목을 입력해주세요.']);
        exit;
    }

    $slides = $data['hero_slides'] ?? [];

    // Check Max 3 visible slides rule
    if ($visible) {
        $visibleCount = 0;
        foreach ($slides as $s) {
            if (!empty($s['visible']) && ($s['id'] ?? '') !== $id) {
                $visibleCount++;
            }
        }
        if ($visibleCount >= 3) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => '히어로 슬라이드는 최대 3개까지만 활성화(공개)할 수 있습니다.'
            ]);
            exit;
        }
    }

    if (!$id) {
        $id = 'hero-' . time() . '-' . substr(md5(uniqid()), 0, 4);
        $slides[] = [
            'id' => $id,
            'title' => $title,
            'subtitle' => $subtitle,
            'tag' => $tag ?: '프리미엄 샘플 · 가상 상호 · 종합병원',
            'imageUrl' => $imageUrl,
            'buttonText' => $buttonText,
            'buttonLink' => $buttonLink,
            'order' => $order,
            'visible' => $visible,
            'createdAt' => date('c')
        ];
    } else {
        $found = false;
        foreach ($slides as &$s) {
            if ($s['id'] === $id) {
                $s['title'] = $title;
                $s['subtitle'] = $subtitle;
                $s['tag'] = $tag;
                if ($imageUrl) $s['imageUrl'] = $imageUrl;
                $s['buttonText'] = $buttonText;
                $s['buttonLink'] = $buttonLink;
                $s['order'] = $order;
                $s['visible'] = $visible;
                $s['updatedAt'] = date('c');
                $found = true;
                break;
            }
        }
        if (!$found) {
            $slides[] = [
                'id' => $id,
                'title' => $title,
                'subtitle' => $subtitle,
                'tag' => $tag,
                'imageUrl' => $imageUrl,
                'buttonText' => $buttonText,
                'buttonLink' => $buttonLink,
                'order' => $order,
                'visible' => $visible,
                'createdAt' => date('c')
            ];
        }
    }

    $data['hero_slides'] = $slides;
    save_partners_data($data);

    echo json_encode(['success' => true, 'message' => '히어로 슬라이드가 저장되었습니다.']);
    exit;
}

if ($action === 'delete_slide' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $id = trim($input['id'] ?? '');
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => '삭제할 슬라이드 ID가 필요합니다.']);
        exit;
    }

    $slides = $data['hero_slides'] ?? [];
    $filtered = array_values(array_filter($slides, function($s) use ($id) {
        return ($s['id'] ?? '') !== $id;
    }));
    $data['hero_slides'] = $filtered;
    save_partners_data($data);

    echo json_encode(['success' => true, 'message' => '슬라이드가 삭제되었습니다.']);
    exit;
}

// -------------------------------------------------------------
// 3. PARTNERS
// -------------------------------------------------------------
if ($action === 'get_partners') {
    $partners = $data['partners'] ?? [];
    // Attach private credentials for admin display
    foreach ($partners as &$p) {
        $pid = $p['id'] ?? '';
        $p['kakaoJsKey'] = $credentials[$pid]['kakaoJsKey'] ?? '';
    }
    usort($partners, function($a, $b) {
        return ($a['order'] ?? 1) <=> ($b['order'] ?? 1);
    });
    echo json_encode([
        'success' => true,
        'partners' => $partners,
        'categories' => $validCategories,
        'towns' => $validTowns
    ]);
    exit;
}

if ($action === 'save_partner' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $id = trim($input['id'] ?? '');
    $name = trim($input['name'] ?? '');
    $category = trim($input['category'] ?? '');
    $town = trim($input['town'] ?? '');
    $imageUrl = trim($input['imageUrl'] ?? '');
    $intro = trim($input['intro'] ?? '');
    $content = trim($input['content'] ?? '');
    $tagsInput = $input['tags'] ?? [];
    $minisiteUrl = trim($input['minisiteUrl'] ?? '');
    $contactMethod = trim($input['contactMethod'] ?? 'kakao');
    $email = trim($input['email'] ?? '');
    $kakaoChannelId = trim($input['kakaoChannelId'] ?? '');
    $kakaoJsKey = trim($input['kakaoJsKey'] ?? '');
    $featured = !empty($input['featured']);
    $order = intval($input['order'] ?? 1);
    $visible = !empty($input['visible']);
    $isSample = trim($input['isSample'] ?? '가상 상호');

    // Validation rules
    if (!$name) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => '상호명(비즈니스명)을 입력해주세요.']);
        exit;
    }
    if (!$imageUrl) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => '파트너 대표 사진은 필수 등록 항목입니다.']);
        exit;
    }
    if (!in_array($category, $validCategories)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => '유효한 12개 카테고리 중 하나를 선택해주세요.']);
        exit;
    }
    if (!in_array($town, $validTowns)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => '유효한 11개 지역 중 하나를 선택해주세요.']);
        exit;
    }
    if ($contactMethod !== 'kakao' && $contactMethod !== 'email') {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => '연락 방법은 카카오톡 또는 이메일 중 하나를 선택해야 합니다.']);
        exit;
    }
    if ($contactMethod === 'kakao' && !$kakaoChannelId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => '카카오톡 연락 방식을 선택한 경우 카카오 채널 공개 ID는 필수입니다.']);
        exit;
    }
    if ($contactMethod === 'email' && !$email) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => '이메일 연락 방식을 선택한 경우 이메일 주소를 입력해주세요.']);
        exit;
    }

    // Sanitize tags
    $tags = [];
    if (is_array($tagsInput)) {
        $tags = array_values(array_filter(array_map('trim', $tagsInput)));
    } elseif (is_string($tagsInput)) {
        $tags = array_values(array_filter(array_map('trim', explode(',', $tagsInput))));
    }

    $partners = $data['partners'] ?? [];

    if (!$id) {
        $id = 'partner-' . time() . '-' . substr(md5(uniqid()), 0, 4);
        $partners[] = [
            'id' => $id,
            'name' => $name,
            'category' => $category,
            'town' => $town,
            'imageUrl' => $imageUrl,
            'intro' => $intro,
            'content' => $content,
            'tags' => $tags,
            'minisiteUrl' => $minisiteUrl,
            'contactMethod' => $contactMethod,
            'email' => $email,
            'kakaoChannelId' => $kakaoChannelId,
            'featured' => $featured,
            'order' => $order,
            'visible' => $visible,
            'isSample' => $isSample,
            'createdAt' => date('c')
        ];
    } else {
        $found = false;
        foreach ($partners as &$p) {
            if ($p['id'] === $id) {
                $p['name'] = $name;
                $p['category'] = $category;
                $p['town'] = $town;
                $p['imageUrl'] = $imageUrl;
                $p['intro'] = $intro;
                $p['content'] = $content;
                $p['tags'] = $tags;
                $p['minisiteUrl'] = $minisiteUrl;
                $p['contactMethod'] = $contactMethod;
                $p['email'] = $email;
                $p['kakaoChannelId'] = $kakaoChannelId;
                $p['featured'] = $featured;
                $p['order'] = $order;
                $p['visible'] = $visible;
                $p['isSample'] = $isSample;
                $p['updatedAt'] = date('c');
                $found = true;
                break;
            }
        }
        if (!$found) {
            $partners[] = [
                'id' => $id,
                'name' => $name,
                'category' => $category,
                'town' => $town,
                'imageUrl' => $imageUrl,
                'intro' => $intro,
                'content' => $content,
                'tags' => $tags,
                'minisiteUrl' => $minisiteUrl,
                'contactMethod' => $contactMethod,
                'email' => $email,
                'kakaoChannelId' => $kakaoChannelId,
                'featured' => $featured,
                'order' => $order,
                'visible' => $visible,
                'isSample' => $isSample,
                'createdAt' => date('c')
            ];
        }
    }

    $data['partners'] = $partners;
    save_partners_data($data);

    // Save private credentials separately
    $credentials[$id] = [
        'kakaoJsKey' => $kakaoJsKey
    ];
    save_partner_credentials($credentials);

    echo json_encode(['success' => true, 'message' => '파트너 정보가 성공적으로 저장되었습니다.', 'id' => $id]);
    exit;
}

if ($action === 'delete_partner' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $id = trim($input['id'] ?? '');
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => '삭제할 파트너 ID가 필요합니다.']);
        exit;
    }

    $partners = $data['partners'] ?? [];
    $filtered = array_values(array_filter($partners, function($p) use ($id) {
        return ($p['id'] ?? '') !== $id;
    }));
    $data['partners'] = $filtered;
    save_partners_data($data);

    // Remove private credentials
    if (isset($credentials[$id])) {
        unset($credentials[$id]);
        save_partner_credentials($credentials);
    }

    echo json_encode(['success' => true, 'message' => '파트너가 삭제되었습니다.']);
    exit;
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => '유효하지 않은 관리 작업입니다.']);
