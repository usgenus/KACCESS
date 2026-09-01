<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    send_json(['success' => true]);
}

$db = get_db_data();
$posts = $db['posts'] ?? [];

// Canonical news categories
$canonicalCats = ['의료칼럼', 'recall(리콜)', 'health&wellness', '의료보험', '한인건강 특집', '한인커뮤니티 뉴스', '의학뉴스'];

function normalize_news_category($cat) {
    $c = trim($cat ?? '');
    if (!$c) return '의료칼럼';
    $lower = mb_strtolower($c, 'UTF-8');
    if ($c === '의료칼럼' || $c === '의사칼럼' || mb_strpos($lower, '칼럼') !== false) return '의료칼럼';
    if ($c === 'recall(리콜)' || $c === 'FDA 리콜' || mb_strpos($lower, 'recall') !== false || mb_strpos($lower, '리콜') !== false) return 'recall(리콜)';
    if ($c === 'health&wellness' || $c === 'Health & Wellness' || mb_strpos($lower, 'health') !== false || mb_strpos($lower, 'wellness') !== false) return 'health&wellness';
    if ($c === '의료보험' || $c === 'Medicare & ACA' || mb_strpos($lower, 'medicare') !== false || mb_strpos($lower, '보험') !== false) return '의료보험';
    if ($c === '한인건강 특집' || mb_strpos($lower, '한인건강') !== false || mb_strpos($lower, '특집') !== false) return '한인건강 특집';
    if ($c === '한인커뮤니티 뉴스' || mb_strpos($lower, '한인커뮤니티') !== false || mb_strpos($lower, '커뮤니티') !== false) return '한인커뮤니티 뉴스';
    if ($c === '의학뉴스' || mb_strpos($lower, '의학뉴스') !== false || mb_strpos($lower, '의학') !== false) return '의학뉴스';
    return in_array($c, ['의료칼럼', 'recall(리콜)', 'health&wellness', '의료보험', '한인건강 특집', '한인커뮤니티 뉴스', '의학뉴스']) ? $c : '의료칼럼';
}

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

function sanitize_summary_points($summaryPoints) {
    if (empty($summaryPoints)) return [];
    if (is_string($summaryPoints)) {
        $trimmed = trim($summaryPoints);
        if (strpos($trimmed, '[') === 0 || strpos($trimmed, '{') === 0) {
            $decoded = json_decode($trimmed, true);
            if (is_array($decoded)) {
                return sanitize_summary_points($decoded);
            }
        }
        $summaryPoints = explode("\n", $summaryPoints);
    }
    if (is_array($summaryPoints)) {
        $clean = [];
        foreach ($summaryPoints as $pt) {
            if (is_array($pt)) {
                $pt = implode(' ', array_filter($pt, 'is_string'));
            }
            if (is_string($pt)) {
                $t = trim($pt);
                if ($t !== '' && $t !== '[object Object]' && strpos($t, '[object Object]') === false) {
                    $clean[] = $t;
                }
            }
        }
        return array_values($clean);
    }
    return [];
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

    // Canonical news categories
    $canonicalCats = ['의료칼럼', 'recall(리콜)', 'health&wellness', '의료보험', '한인건강 특집', '한인커뮤니티 뉴스', '의학뉴스'];

    // Normalize category for all output posts
    foreach ($result as &$rItem) {
        $rItem['category'] = normalize_news_category($rItem['category'] ?? '');
    }
    unset($rItem);

    send_json([
        'success' => true,
        'data' => $result,
        'total' => count($result),
        'categories' => $canonicalCats
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

    $summaryPoints = sanitize_summary_points($input['summaryPoints'] ?? []);

    // Process multiple images
    $images = $input['images'] ?? [];
    if (is_string($images)) {
        $images = array_filter(array_map('trim', explode("\n", $images)));
    }
    if (!is_array($images)) {
        $images = [];
    }
    $coverImage = trim($input['coverImage'] ?? '');
    if (!empty($images)) {
        $coverImage = $images[0];
    } elseif ($coverImage) {
        $images = [$coverImage];
    }

    $newItem = [
        'id' => $newId,
        'slug' => $slug,
        'title' => $title,
        'category' => normalize_news_category($input['category'] ?? '의료칼럼'),
        'date' => trim($input['date'] ?? date('Y-m-d')),
        'isTopStory' => !empty($input['isTopStory']) && $input['isTopStory'] !== 'false' && $input['isTopStory'] !== false,
        'isLiveUpdate' => !empty($input['isLiveUpdate']) && $input['isLiveUpdate'] !== 'false' && $input['isLiveUpdate'] !== false,
        'isDoctorColumn' => !empty($input['isDoctorColumn']) && $input['isDoctorColumn'] !== 'false' && $input['isDoctorColumn'] !== false,
        'isPolicyReport' => !empty($input['isPolicyReport']) && $input['isPolicyReport'] !== 'false' && $input['isPolicyReport'] !== false,
        'excerpt' => trim($input['excerpt'] ?? ''),
        'coverImage' => $coverImage,
        'images' => $images,
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
    $db['categories']['news'] = $canonicalCats;

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
        if ((string)$item['id'] === (string)$id || (isset($item['slug']) && (string)$item['slug'] === (string)$id)) {
            if (isset($input['title'])) $item['title'] = trim($input['title']);
            if (isset($input['slug']) && trim($input['slug'])) $item['slug'] = trim($input['slug']);
            if (isset($input['category'])) $item['category'] = normalize_news_category($input['category']);
            if (isset($input['date'])) $item['date'] = trim($input['date']);
            if (isset($input['isTopStory'])) {
                $item['isTopStory'] = ($input['isTopStory'] === true || $input['isTopStory'] === 'true' || $input['isTopStory'] === 1 || $input['isTopStory'] === '1');
            }
            if (isset($input['isLiveUpdate'])) {
                $item['isLiveUpdate'] = ($input['isLiveUpdate'] === true || $input['isLiveUpdate'] === 'true' || $input['isLiveUpdate'] === 1 || $input['isLiveUpdate'] === '1');
            }
            if (isset($input['isDoctorColumn'])) {
                $item['isDoctorColumn'] = ($input['isDoctorColumn'] === true || $input['isDoctorColumn'] === 'true' || $input['isDoctorColumn'] === 1 || $input['isDoctorColumn'] === '1');
            }
            if (isset($input['isPolicyReport'])) {
                $item['isPolicyReport'] = ($input['isPolicyReport'] === true || $input['isPolicyReport'] === 'true' || $input['isPolicyReport'] === 1 || $input['isPolicyReport'] === '1');
            }
            if (isset($input['excerpt'])) $item['excerpt'] = trim($input['excerpt']);
            
            // Multiple images handling on update
            if (isset($input['images'])) {
                $imgs = $input['images'];
                if (is_string($imgs)) {
                    $imgs = array_filter(array_map('trim', explode("\n", $imgs)));
                }
                if (is_array($imgs)) {
                    $item['images'] = array_values($imgs);
                    if (!empty($item['images'])) {
                        $item['coverImage'] = $item['images'][0];
                    }
                }
            }
            if (isset($input['coverImage']) && (!isset($item['images']) || empty($item['images']))) {
                $item['coverImage'] = trim($input['coverImage']);
                $item['images'] = [$item['coverImage']];
            }

            if (isset($input['videoUrl'])) $item['videoUrl'] = trim($input['videoUrl']);
            if (isset($input['readTime'])) $item['readTime'] = trim($input['readTime']);
            if (isset($input['author'])) $item['author'] = trim($input['author']);
            if (isset($input['content'])) $item['content'] = trim($input['content']);
            if (isset($input['summaryPoints'])) {
                $item['summaryPoints'] = sanitize_summary_points($input['summaryPoints']);
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
    $deletedId = null;
    foreach ($posts as $item) {
        if ((string)$item['id'] === (string)$id || (isset($item['slug']) && (string)$item['slug'] === (string)$id)) {
            $found = true;
            $deletedId = $item['id'];
        } else {
            $newPosts[] = $item;
        }
    }

    if (!$found) {
        send_json(['success' => false, 'error' => '기사를 찾을 수 없습니다.'], 404);
    }

    // 1. Delete from Supabase first (primary source of truth)
    $supabase = get_supabase();
    if ($supabase->isConfigured() && $deletedId) {
        try {
            $supabase->delete('posts', $deletedId, 'id');
        } catch (Exception $e) {
            error_log('Supabase delete error: ' . $e->getMessage());
        }
    }

    // 2. Update and save via unified storage layer
    $db['posts'] = $newPosts;
    save_db_data($db);

    send_json(['success' => true, 'message' => '기사가 삭제되었습니다.']);
}
