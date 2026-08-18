<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    send_json(['success' => true]);
}

$db = get_db_data();
$posts = $db['posts'] ?? [];

// Helper to make slug
function make_slug($text) {
    $slug = preg_replace('~[^\pL\d]+~u', '-', $text);
    $slug = iconv('utf-8', 'us-ascii//TRANSLIT//IGNORE', $slug);
    $slug = preg_replace('~[^-\w]+~', '', $slug);
    $slug = trim($slug, '-');
    $slug = strtolower($slug);
    if (empty($slug)) {
        return 'post-' . time();
    }
    return $slug;
}

// GET: List or Single Post
if ($method === 'GET') {
    // Single post by slug or id
    $slug = $_GET['slug'] ?? '';
    $id = $_GET['id'] ?? '';
    if ($slug || $id) {
        foreach ($posts as $item) {
            if (($slug && ($item['slug'] ?? '') === $slug) || ($id && ($item['id'] ?? '') === $id)) {
                send_json(['success' => true, 'data' => $item]);
            }
        }
        send_json(['success' => false, 'error' => '게시글을 찾을 수 없습니다.'], 404);
    }

    $q = mb_strtolower(trim($_GET['q'] ?? ''));
    $category = $_GET['category'] ?? '';
    $status = $_GET['status'] ?? ''; // 'published' default for public

    $result = [];
    foreach ($posts as $item) {
        if ($status && ($item['status'] ?? 'published') !== $status) {
            continue;
        }
        if ($category && $category !== '전체' && ($item['category'] ?? '') !== $category) {
            continue;
        }
        if ($q) {
            $title = mb_strtolower($item['title'] ?? '');
            $excerpt = mb_strtolower($item['excerpt'] ?? '');
            $content = mb_strtolower($item['content'] ?? '');
            if (mb_strpos($title, $q) === false && mb_strpos($excerpt, $q) === false && mb_strpos($content, $q) === false) {
                continue;
            }
        }
        $result[] = $item;
    }

    // Sort by date DESC
    usort($result, function($a, $b) {
        $t1 = strtotime($a['date'] ?? $a['createdAt'] ?? '1970-01-01');
        $t2 = strtotime($b['date'] ?? $b['createdAt'] ?? '1970-01-01');
        return $t2 <=> $t1;
    });

    send_json([
        'success' => true,
        'data' => $result,
        'total' => count($result),
        'categories' => $db['categories']['news'] ?? []
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
        send_json(['success' => false, 'error' => '제목을 입력해주세요.'], 400);
    }

    $newId = 'p_' . time() . '_' . substr(md5(uniqid()), 0, 4);
    $slug = trim($input['slug'] ?? '');
    if (!$slug) {
        $slug = make_slug($title);
    }
    // ensure slug uniqueness
    $slugBase = $slug;
    $counter = 1;
    while (true) {
        $conflict = false;
        foreach ($posts as $p) {
            if (($p['slug'] ?? '') === $slug) {
                $conflict = true;
                break;
            }
        }
        if (!$conflict) break;
        $slug = $slugBase . '-' . $counter;
        $counter++;
    }

    $summaryPoints = $input['summaryPoints'] ?? [];
    if (is_string($summaryPoints)) {
        $summaryPoints = array_filter(array_map('trim', explode("\n", $summaryPoints)));
    }

    $newItem = [
        'id' => $newId,
        'slug' => $slug,
        'title' => $title,
        'category' => trim($input['category'] ?? 'Health & Wellness'),
        'date' => trim($input['date'] ?? date('Y-m-d')),
        'isTopStory' => !empty($input['isTopStory']),
        'isLiveUpdate' => !empty($input['isLiveUpdate']),
        'excerpt' => trim($input['excerpt'] ?? ''),
        'coverImage' => trim($input['coverImage'] ?? ''),
        'videoUrl' => trim($input['videoUrl'] ?? ''),
        'readTime' => trim($input['readTime'] ?? '3분'),
        'author' => trim($input['author'] ?? '편집부'),
        'content' => trim($input['content'] ?? ''),
        'summaryPoints' => $summaryPoints,
        'status' => trim($input['status'] ?? 'published'),
        'createdAt' => date('Y-m-d H:i:s')
    ];

    // If new item is top story, reset others if desired
    if ($newItem['isTopStory']) {
        foreach ($posts as &$p) {
            $p['isTopStory'] = false;
        }
    }

    array_unshift($posts, $newItem);
    $db['posts'] = $posts;

    // Update categories
    if (!empty($newItem['category'])) {
        if (!isset($db['categories']['news'])) {
            $db['categories']['news'] = [];
        }
        if (!in_array($newItem['category'], $db['categories']['news'])) {
            $db['categories']['news'][] = $newItem['category'];
        }
    }

    save_db_data($db);
    send_json(['success' => true, 'message' => '기사가 등록되었습니다.', 'data' => $newItem]);
}

// PUT: Update
if ($method === 'PUT') {
    $id = $input['id'] ?? ($_GET['id'] ?? '');
    if (!$id) {
        send_json(['success' => false, 'error' => 'ID가 필요합니다.'], 400);
    }

    $found = false;
    $isTop = !empty($input['isTopStory']);

    if ($isTop) {
        foreach ($posts as &$p) {
            if ($p['id'] !== $id) {
                $p['isTopStory'] = false;
            }
        }
    }

    foreach ($posts as &$item) {
        if ($item['id'] === $id) {
            if (isset($input['title'])) $item['title'] = trim($input['title']);
            if (isset($input['slug']) && trim($input['slug'])) $item['slug'] = trim($input['slug']);
            if (isset($input['category'])) $item['category'] = trim($input['category']);
            if (isset($input['date'])) $item['date'] = trim($input['date']);
            if (isset($input['isTopStory'])) $item['isTopStory'] = (bool)$input['isTopStory'];
            if (isset($input['isLiveUpdate'])) $item['isLiveUpdate'] = (bool)$input['isLiveUpdate'];
            if (isset($input['excerpt'])) $item['excerpt'] = trim($input['excerpt']);
            if (isset($input['coverImage'])) $item['coverImage'] = trim($input['coverImage']);
            if (isset($input['videoUrl'])) $item['videoUrl'] = trim($input['videoUrl']);
            if (isset($input['readTime'])) $item['readTime'] = trim($input['readTime']);
            if (isset($input['author'])) $item['author'] = trim($input['author']);
            if (isset($input['content'])) $item['content'] = trim($input['content']);
            if (isset($input['summaryPoints'])) {
                $pts = $input['summaryPoints'];
                if (is_string($pts)) {
                    $pts = array_filter(array_map('trim', explode("\n", $pts)));
                }
                $item['summaryPoints'] = $pts;
            }
            if (isset($input['status'])) $item['status'] = trim($input['status']);
            $item['updatedAt'] = date('Y-m-d H:i:s');
            $found = true;
            break;
        }
    }

    if (!$found) {
        send_json(['success' => false, 'error' => '기사를 찾을 수 없습니다.'], 404);
    }

    $db['posts'] = $posts;
    save_db_data($db);
    send_json(['success' => true, 'message' => '기사가 수정되었습니다.']);
}

// DELETE: Delete
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? ($input['id'] ?? '');
    if (!$id) {
        send_json(['success' => false, 'error' => 'ID가 필요합니다.'], 400);
    }

    $newPosts = [];
    $found = false;
    foreach ($posts as $item) {
        if ($item['id'] === $id) {
            $found = true;
        } else {
            $newPosts[] = $item;
        }
    }

    if (!$found) {
        send_json(['success' => false, 'error' => '기사를 찾을 수 없습니다.'], 404);
    }

    $db['posts'] = $newPosts;
    save_db_data($db);
    send_json(['success' => true, 'message' => '기사가 삭제되었습니다.']);
}
