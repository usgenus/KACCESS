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
    return [
        'default' => [
            [
                'id' => 'seed-1',
                'nickname' => '포트리한인***',
                'content' => '좋은 정보 감사합니다! 미국 와서 의료 용어도 어렵고 메디케어 신청 방법도 막막했는데 한국어로 자세히 설명해주셔서 이해가 쏙쏙 되네요.',
                'createdAt' => '2026-08-08 14:20',
                'likes' => 15,
                'dislikes' => 1,
                'replies' => [
                    [
                        'id' => 'seed-1-1',
                        'nickname' => 'NJ센터답변***',
                        'content' => '도움이 되셨다니 다행입니다. 추가로 궁금하신 사항은 1-800-999-7200 무료 상담 전화로 편하게 문의해주세요!',
                        'createdAt' => '2026-08-08 15:05',
                        'likes' => 6,
                        'dislikes' => 0
                    ]
                ]
            ],
            [
                'id' => 'seed-2',
                'nickname' => '펠팍주민***',
                'content' => '부모님 메디케어 파트D 약 보험 가입 때문에 고민 많았는데 관련 기사 내용이 아주 유용합니다. 공유해둘게요.',
                'createdAt' => '2026-08-07 09:45',
                'likes' => 9,
                'dislikes' => 0,
                'replies' => []
            ]
        ]
    ];
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

$slug = trim($_GET['slug'] ?? ($_POST['slug'] ?? 'default'));
if (!$slug) $slug = 'default';

$store = get_comments_store();

// GET: Fetch comments for a post
if ($method === 'GET') {
    $comments = $store[$slug] ?? ($store['default'] ?? []);
    send_json([
        'success' => true,
        'slug' => $slug,
        'comments' => $comments
    ]);
}

// POST actions
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$action = $_GET['action'] ?? ($input['action'] ?? 'add');

if ($method === 'POST') {
    $comments = $store[$slug] ?? ($store['default'] ?? []);

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
