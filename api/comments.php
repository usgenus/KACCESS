<?php
/**
 * Healthcare Access Portal - Comments API Endpoint
 * Handles reading, posting, liking, and deleting comments with persistent host storage.
 */
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    send_json(['success' => true]);
}

$commentsFile = PERSISTENT_ROOT . '/comments.json';
$localCommentsFile = __DIR__ . '/../data/comments.json';

// Helper to get comments store
function get_comments_store() {
    global $commentsFile, $localCommentsFile;
    if (file_exists($commentsFile)) {
        clearstatcache(true, $commentsFile);
        $content = @file_get_contents($commentsFile);
        if ($content) {
            $data = json_decode($content, true);
            if (is_array($data)) return $data;
        }
    }
    if (file_exists($localCommentsFile)) {
        $content = @file_get_contents($localCommentsFile);
        if ($content) {
            $data = json_decode($content, true);
            if (is_array($data)) return $data;
        }
    }
    return [];
}

function save_comments_store($store) {
    global $commentsFile, $localCommentsFile;
    $json = json_encode($store, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $pDir = dirname($commentsFile);
    if (!is_dir($pDir)) { @mkdir($pDir, 0777, true); @chmod($pDir, 0777); }
    @file_put_contents($commentsFile, $json, LOCK_EX);
    @chmod($commentsFile, 0666);

    $lDir = dirname($localCommentsFile);
    if (!is_dir($lDir)) { @mkdir($lDir, 0777, true); @chmod($lDir, 0777); }
    @file_put_contents($localCommentsFile, $json, LOCK_EX);
    @chmod($localCommentsFile, 0666);
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$slug = trim($_GET['slug'] ?? ($input['slug'] ?? ''));
if (!$slug) $slug = 'general';

$store = get_comments_store();

// GET: Fetch comments for a post
if ($method === 'GET') {
    $comments = $store[$slug] ?? [];
    if (!is_array($comments)) $comments = [];
    // Filter out seed comments if present
    $comments = array_values(array_filter($comments, function($c) {
        return is_array($c) && (!isset($c['id']) || strpos((string)$c['id'], 'seed-') !== 0);
    }));
    send_json([
        'success' => true,
        'slug' => $slug,
        'comments' => $comments
    ]);
}

// POST actions
if ($method === 'POST') {
    $action = $_GET['action'] ?? ($input['action'] ?? 'add');
    $comments = $store[$slug] ?? [];
    if (!is_array($comments)) $comments = [];
    $comments = array_values(array_filter($comments, function($c) {
        return is_array($c) && (!isset($c['id']) || strpos((string)$c['id'], 'seed-') !== 0);
    }));

    // 1. ADD COMMENT
    if ($action === 'add') {
        $nickname = trim($input['nickname'] ?? '');
        $password = trim($input['password'] ?? '');
        $content = trim($input['content'] ?? '');
        $parentId = trim($input['parentId'] ?? '');

        if (!$nickname || !$content) {
            send_json(['success' => false, 'error' => '닉네임과 내용을 입력해주세요.'], 400);
        }

        $maskedNickname = mb_strlen($nickname) > 2 ? (mb_substr($nickname, 0, 3) . '***') : ($nickname . '***');
        $newId = 'c_' . time() . '_' . substr(md5(uniqid()), 0, 4);
        $dateStr = date('Y-m-d H:i');

        if ($parentId) {
            // Reply to an existing comment
            $found = false;
            foreach ($comments as &$c) {
                if ($c['id'] === $parentId) {
                    if (!isset($c['replies']) || !is_array($c['replies'])) {
                        $c['replies'] = [];
                    }
                    $c['replies'][] = [
                        'id' => $newId,
                        'nickname' => $maskedNickname,
                        'password' => $password,
                        'content' => $content,
                        'createdAt' => $dateStr,
                        'likes' => 0,
                        'dislikes' => 0
                    ];
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                send_json(['success' => false, 'error' => '부모 댓글을 찾을 수 없습니다.'], 404);
            }
        } else {
            // Root comment
            array_unshift($comments, [
                'id' => $newId,
                'nickname' => $maskedNickname,
                'password' => $password,
                'content' => $content,
                'createdAt' => $dateStr,
                'likes' => 0,
                'dislikes' => 0,
                'replies' => []
            ]);
        }

        $store[$slug] = $comments;
        save_comments_store($store);

        send_json([
            'success' => true,
            'message' => '댓글이 등록되었습니다.',
            'comments' => $comments
        ]);
    }

    // 2. LIKE / DISLIKE
    if ($action === 'like' || $action === 'dislike') {
        $commentId = trim($input['commentId'] ?? '');
        $isReply = !empty($input['isReply']);
        $parentId = trim($input['parentId'] ?? '');
        $isUnlike = !empty($input['unlike']);

        foreach ($comments as &$c) {
            if ($isReply && $c['id'] === $parentId && !empty($c['replies'])) {
                foreach ($c['replies'] as &$r) {
                    if ($r['id'] === $commentId) {
                        if ($action === 'like') {
                            $r['likes'] = max(0, ($r['likes'] ?? 0) + ($isUnlike ? -1 : 1));
                        } else {
                            $r['dislikes'] = max(0, ($r['dislikes'] ?? 0) + ($isUnlike ? -1 : 1));
                        }
                    }
                }
            } elseif (!$isReply && $c['id'] === $commentId) {
                if ($action === 'like') {
                    $c['likes'] = max(0, ($c['likes'] ?? 0) + ($isUnlike ? -1 : 1));
                } else {
                    $c['dislikes'] = max(0, ($c['dislikes'] ?? 0) + ($isUnlike ? -1 : 1));
                }
            }
        }

        $store[$slug] = $comments;
        save_comments_store($store);

        send_json(['success' => true, 'comments' => $comments]);
    }

    // 3. DELETE
    if ($action === 'delete') {
        $commentId = trim($input['commentId'] ?? '');
        $password = trim($input['password'] ?? '');

        $deleted = false;
        $newComments = [];

        foreach ($comments as $c) {
            if ($c['id'] === $commentId) {
                if (!empty($c['password']) && $c['password'] !== $password) {
                    send_json(['success' => false, 'error' => '비밀번호가 일치하지 않습니다.'], 403);
                }
                $deleted = true;
                continue;
            }
            if (!empty($c['replies'])) {
                $newReplies = [];
                foreach ($c['replies'] as $r) {
                    if ($r['id'] === $commentId) {
                        if (!empty($r['password']) && $r['password'] !== $password) {
                            send_json(['success' => false, 'error' => '비밀번호가 일치하지 않습니다.'], 403);
                        }
                        $deleted = true;
                        continue;
                    }
                    $newReplies[] = $r;
                }
                $c['replies'] = $newReplies;
            }
            $newComments[] = $c;
        }

        if (!$deleted) {
            send_json(['success' => false, 'error' => '삭제할 댓글을 찾을 수 없습니다.'], 404);
        }

        $store[$slug] = $newComments;
        save_comments_store($store);

        send_json([
            'success' => true,
            'message' => '댓글이 삭제되었습니다.',
            'comments' => $newComments
        ]);
    }
}

send_json(['success' => false, 'error' => '올바르지 않은 요청입니다.'], 400);
