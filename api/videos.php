<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    send_json(['success' => true]);
}

$db = get_db_data();
$videos = $db['videos'] ?? [];

// Helper to extract YouTube ID from URL or return string
function extract_youtube_id($urlOrId) {
    $urlOrId = trim($urlOrId);
    if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i', $urlOrId, $match)) {
        return $match[1];
    }
    if (preg_match('/^[a-zA-Z0-9_-]{11}$/', $urlOrId)) {
        return $urlOrId;
    }
    return $urlOrId;
}

// GET: List videos
if ($method === 'GET') {
    $id = $_GET['id'] ?? '';
    if ($id) {
        foreach ($videos as $item) {
            if ($item['id'] === $id) {
                send_json(['success' => true, 'data' => $item]);
            }
        }
        send_json(['success' => false, 'error' => '영상을 찾을 수 없습니다.'], 404);
    }

    $category = $_GET['category'] ?? '';
    $activeOnly = isset($_GET['active_only']) && $_GET['active_only'] == '1';

    $result = [];
    foreach ($videos as $item) {
        if ($activeOnly && empty($item['active'])) {
            continue;
        }
        if ($category && $category !== '전체' && ($item['category'] ?? '') !== $category) {
            continue;
        }
        $result[] = $item;
    }

    // Sort by order ascending
    usort($result, function($a, $b) {
        return ($a['order'] ?? 0) <=> ($b['order'] ?? 0);
    });

    send_json([
        'success' => true,
        'data' => $result,
        'categories' => $db['categories']['videos'] ?? []
    ]);
}

// Write actions require auth
require_auth();

$input = json_decode(file_get_contents('php://input'), true);
if (!$input && !empty($_POST)) {
    $input = $_POST;
}

// POST: Create
if ($method === 'POST') {
    $title = trim($input['title'] ?? '');
    if (!$title) {
        send_json(['success' => false, 'error' => '영상 제목을 입력해주세요.'], 400);
    }

    $rawYt = trim($input['youtubeId'] ?? '');
    $ytId = extract_youtube_id($rawYt);
    $videoUrl = trim($input['videoUrl'] ?? '');

    $newId = 'v_' . time() . '_' . substr(md5(uniqid()), 0, 4);

    $thumbnail = trim($input['thumbnail'] ?? '');
    if (!$thumbnail && $ytId) {
        $thumbnail = "https://img.youtube.com/vi/{$ytId}/maxresdefault.jpg";
    }

    $newItem = [
        'id' => $newId,
        'youtubeId' => $ytId,
        'videoUrl' => $videoUrl,
        'title' => $title,
        'doctor' => trim($input['doctor'] ?? '의학 리포트'),
        'hospital' => trim($input['hospital'] ?? 'Englewood Health Center for Korean Health'),
        'category' => trim($input['category'] ?? '심장 & 혈관'),
        'views' => trim($input['views'] ?? '1.2만회'),
        'duration' => trim($input['duration'] ?? '05:00'),
        'date' => trim($input['date'] ?? date('Y.m.d')),
        'summary' => trim($input['summary'] ?? ''),
        'thumbnail' => $thumbnail,
        'order' => isset($input['order']) ? (int)$input['order'] : 1,
        'active' => isset($input['active']) ? (bool)$input['active'] : true,
        'createdAt' => date('Y-m-d H:i:s')
    ];

    // If order is 1 (default for newly uploaded video), increment order of existing items
    if ($newItem['order'] === 1) {
        foreach ($videos as &$existing) {
            $existing['order'] = ($existing['order'] ?? 1) + 1;
        }
        array_unshift($videos, $newItem);
    } else {
        $videos[] = $newItem;
    }

    $db['videos'] = $videos;

    // Update categories
    if (!empty($newItem['category'])) {
        if (!isset($db['categories']['videos'])) {
            $db['categories']['videos'] = [];
        }
        if (!in_array($newItem['category'], $db['categories']['videos'])) {
            $db['categories']['videos'][] = $newItem['category'];
        }
    }

    save_db_data($db);
    send_json(['success' => true, 'message' => '의학 비디오가 추가되었습니다.', 'data' => $newItem]);
}

// PUT: Update
if ($method === 'PUT') {
    $id = $input['id'] ?? ($_GET['id'] ?? '');
    if (!$id) {
        send_json(['success' => false, 'error' => 'ID가 필요합니다.'], 400);
    }

    $found = false;
    foreach ($videos as &$item) {
        if ($item['id'] === $id) {
            if (isset($input['title'])) $item['title'] = trim($input['title']);
            if (isset($input['youtubeId'])) $item['youtubeId'] = extract_youtube_id($input['youtubeId']);
            if (isset($input['videoUrl'])) $item['videoUrl'] = trim($input['videoUrl']);
            if (isset($input['doctor'])) $item['doctor'] = trim($input['doctor']);
            if (isset($input['hospital'])) $item['hospital'] = trim($input['hospital']);
            if (isset($input['category'])) $item['category'] = trim($input['category']);
            if (isset($input['views'])) $item['views'] = trim($input['views']);
            if (isset($input['duration'])) $item['duration'] = trim($input['duration']);
            if (isset($input['date'])) $item['date'] = trim($input['date']);
            if (isset($input['summary'])) $item['summary'] = trim($input['summary']);
            if (isset($input['thumbnail'])) {
                $item['thumbnail'] = trim($input['thumbnail']);
            } elseif (!empty($item['youtubeId']) && empty($item['thumbnail'])) {
                $item['thumbnail'] = "https://img.youtube.com/vi/{$item['youtubeId']}/maxresdefault.jpg";
            }
            if (isset($input['order'])) $item['order'] = (int)$input['order'];
            if (isset($input['active'])) $item['active'] = (bool)$input['active'];
            $item['updatedAt'] = date('Y-m-d H:i:s');
            $found = true;
            break;
        }
    }

    if (!$found) {
        send_json(['success' => false, 'error' => '영상을 찾을 수 없습니다.'], 404);
    }

    $db['videos'] = $videos;
    save_db_data($db);
    send_json(['success' => true, 'message' => '의학 비디오가 수정되었습니다.']);
}

// DELETE: Delete
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? ($input['id'] ?? '');
    if (!$id) {
        send_json(['success' => false, 'error' => 'ID가 필요합니다.'], 400);
    }

    $newVideos = [];
    $found = false;
    foreach ($videos as $item) {
        if ($item['id'] === $id) {
            $found = true;
        } else {
            $newVideos[] = $item;
        }
    }

    if (!$found) {
        send_json(['success' => false, 'error' => '영상을 찾을 수 없습니다.'], 404);
    }

    $db['videos'] = $newVideos;
    save_db_data($db);
    send_json(['success' => true, 'message' => '의학 비디오가 삭제되었습니다.']);
}
