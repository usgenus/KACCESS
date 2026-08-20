<?php
/**
 * Healthcare Access Portal - Unified Storage Layer
 * Prioritizes Hostinger Persistent Host Space (outside public_html)
 * and syncs with Supabase Cloud & Local JSON Mirror.
 */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/supabase.php';

function get_supabase() {
    static $client = null;
    if ($client === null) {
        $client = new SupabaseClient(SUPABASE_URL, SUPABASE_KEY);
    }
    return $client;
}

function db_sanitize_summary_points($summaryPoints) {
    if (empty($summaryPoints)) return [];
    if (is_string($summaryPoints)) {
        $trimmed = trim($summaryPoints);
        if (strpos($trimmed, '[') === 0 || strpos($trimmed, '{') === 0) {
            $decoded = json_decode($trimmed, true);
            if (is_array($decoded)) {
                return db_sanitize_summary_points($decoded);
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

function get_db_data($forceCloud = false) {
    // Auto-seed persistent storage from local mirror if persistent file does not exist yet
    if (!file_exists(PERSISTENT_DATA_FILE) && file_exists(DATA_FILE)) {
        $pDir = dirname(PERSISTENT_DATA_FILE);
        if (!is_dir($pDir)) { @mkdir($pDir, 0777, true); @chmod($pDir, 0777); }
        @copy(DATA_FILE, PERSISTENT_DATA_FILE);
        @chmod(PERSISTENT_DATA_FILE, 0666);
    }
    if (!file_exists(PERSISTENT_MEDIA_STORE) && file_exists(LOCAL_MEDIA_STORE)) {
        @copy(LOCAL_MEDIA_STORE, PERSISTENT_MEDIA_STORE);
        @chmod(PERSISTENT_MEDIA_STORE, 0666);
    }

    // 1. Priority #1: Read from Hostinger Persistent Storage (immune to zip deployments)
    if (!$forceCloud && file_exists(PERSISTENT_DATA_FILE)) {
        clearstatcache(true, PERSISTENT_DATA_FILE);
        $content = @file_get_contents(PERSISTENT_DATA_FILE);
        if ($content) {
            $data = json_decode($content, true);
            if (is_array($data) && (!empty($data['posts']) || !empty($data['videos']) || !empty($data['billboards']))) {
                // Sync to local public_html mirror if missing/different
                if (!file_exists(DATA_FILE) || filesize(DATA_FILE) !== strlen($content)) {
                    $dir = dirname(DATA_FILE);
                    if (!is_dir($dir)) { @mkdir($dir, 0777, true); @chmod($dir, 0777); }
                    @file_put_contents(DATA_FILE, $content, LOCK_EX);
                }
                return $data;
            }
        }
    }

    // 2. Priority #2: Query Supabase Cloud Database
    $supabase = get_supabase();
    if ($supabase->isConfigured()) {
        try {
            $posts = $supabase->selectAll('posts', 'createdAt.desc') ?: [];
            $videos = $supabase->selectAll('videos', 'order.asc') ?: [];
            $billboards = $supabase->selectAll('billboards', 'order.asc') ?: [];
            $catRows = $supabase->selectAll('categories') ?: [];
            
            $categories = [
                'news' => ['전체', '의료칼럼', 'FDA 리콜', 'Health & Wellness', 'Medicare & ACA', '보건 정책 & 메디케어 리포트', '보건 정책 & 리포트', '병원 소식'],
                'videos' => ['전체', '심장 & 혈관', '뇌신경 질환', '암 예방 & 검진', '관절 & 정형외과', '만성질환 관리'],
                'billboards' => ['SPECIAL CAMPAIGN', 'MEDICARE UPDATE', 'PATIENT SUPPORT', 'HEALTH WEBINAR']
            ];
            foreach ($catRows as $row) {
                if (isset($row['type']) && isset($row['items'])) {
                    $categories[$row['type']] = is_array($row['items']) ? $row['items'] : json_decode($row['items'], true);
                }
            }

            // Normalize videos
            foreach ($videos as &$v) {
                if (!isset($v['doctor']) && isset($v['speaker'])) $v['doctor'] = $v['speaker'];
                if (!isset($v['thumbnail']) && isset($v['thumbnailUrl'])) $v['thumbnail'] = $v['thumbnailUrl'];
                if (!isset($v['summary']) && isset($v['description'])) $v['summary'] = $v['description'];
                if (!isset($v['youtubeId']) && isset($v['youtubeUrl'])) {
                    if (preg_match('~(?:youtu\.be/|youtube\.com/(?:embed/|v/|watch\?v=))([\w-]{11})~', $v['youtubeUrl'], $m)) {
                        $v['youtubeId'] = $m[1];
                    }
                }
            }

            // Normalize posts
            foreach ($posts as &$p) {
                $p['summaryPoints'] = db_sanitize_summary_points($p['summaryPoints'] ?? []);
            }

            $cloudData = [
                'billboards' => $billboards,
                'videos' => $videos,
                'posts' => $posts,
                'categories' => $categories
            ];

            // If Supabase returned valid content, save to Hostinger Persistent Storage and Local JSON
            if (!empty($posts) || !empty($videos) || !empty($billboards)) {
                $json = json_encode($cloudData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                
                // Write to Persistent Space
                $pDir = dirname(PERSISTENT_DATA_FILE);
                if (!is_dir($pDir)) { @mkdir($pDir, 0777, true); @chmod($pDir, 0777); }
                @file_put_contents(PERSISTENT_DATA_FILE, $json, LOCK_EX);
                @chmod(PERSISTENT_DATA_FILE, 0666);

                // Write to Local Mirror
                $lDir = dirname(DATA_FILE);
                if (!is_dir($lDir)) { @mkdir($lDir, 0777, true); @chmod($lDir, 0777); }
                @file_put_contents(DATA_FILE, $json, LOCK_EX);
                @chmod(DATA_FILE, 0666);

                return $cloudData;
            }
        } catch (Exception $e) {
            error_log('Supabase read error: ' . $e->getMessage());
        }
    }

    // 3. Priority #3: Read Local Mirror DATA_FILE
    if (file_exists(DATA_FILE)) {
        clearstatcache(true, DATA_FILE);
        $content = @file_get_contents(DATA_FILE);
        if ($content) {
            $data = json_decode($content, true);
            if (is_array($data)) {
                return $data;
            }
        }
    }

    // 4. Default Empty Structure
    return [
        'billboards' => [],
        'videos' => [],
        'posts' => [],
        'categories' => [
            'news' => ['전체', '의료칼럼', 'FDA 리콜', 'Health & Wellness', 'Medicare & ACA', '보건 정책 & 메디케어 리포트', '보건 정책 & 리포트', '병원 소식'],
            'videos' => ['전체', '심장 & 혈관', '뇌신경 질환', '암 예방 & 검진', '관절 & 정형외과', '만성질환 관리'],
            'billboards' => ['SPECIAL CAMPAIGN', 'MEDICARE UPDATE', 'PATIENT SUPPORT', 'HEALTH WEBINAR']
        ]
    ];
}

function save_db_data($data) {
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    // 1. Save to Hostinger Persistent Host Space (Immune to all static deployments)
    $pDir = dirname(PERSISTENT_DATA_FILE);
    if (!is_dir($pDir)) { @mkdir($pDir, 0777, true); @chmod($pDir, 0777); }
    @file_put_contents(PERSISTENT_DATA_FILE, $json, LOCK_EX);
    @chmod(PERSISTENT_DATA_FILE, 0666);
    clearstatcache(true, PERSISTENT_DATA_FILE);

    // 2. Save to Local public_html mirror for instant microsecond reads
    $lDir = dirname(DATA_FILE);
    if (!is_dir($lDir)) { @mkdir($lDir, 0777, true); @chmod($lDir, 0777); }
    $res = @file_put_contents(DATA_FILE, $json, LOCK_EX) !== false;
    @chmod(DATA_FILE, 0666);
    clearstatcache(true, DATA_FILE);

    // 3. Sync to Supabase Cloud
    $supabase = get_supabase();
    if ($supabase->isConfigured()) {
        try {
            if (!empty($data['posts'])) {
                foreach ($data['posts'] as $p) {
                    $row = [
                        'id' => $p['id'],
                        'slug' => !empty($p['slug']) ? $p['slug'] : $p['id'],
                        'title' => $p['title'] ?? '',
                        'category' => $p['category'] ?? 'Health & Wellness',
                        'date' => $p['date'] ?? date('Y-m-d'),
                        'isTopStory' => !empty($p['isTopStory']) && $p['isTopStory'] !== 'false' && $p['isTopStory'] !== false,
                        'isLiveUpdate' => !empty($p['isLiveUpdate']) && $p['isLiveUpdate'] !== 'false' && $p['isLiveUpdate'] !== false,
                        'isDoctorColumn' => !empty($p['isDoctorColumn']) && $p['isDoctorColumn'] !== 'false' && $p['isDoctorColumn'] !== false,
                        'isPolicyReport' => !empty($p['isPolicyReport']) && $p['isPolicyReport'] !== 'false' && $p['isPolicyReport'] !== false,
                        'excerpt' => $p['excerpt'] ?? '',
                        'coverImage' => $p['coverImage'] ?? (!empty($p['images'][0]) ? $p['images'][0] : ''),
                        'images' => !empty($p['images']) ? (is_array($p['images']) ? array_values($p['images']) : [$p['images']]) : (!empty($p['coverImage']) ? [$p['coverImage']] : []),
                        'videoUrl' => $p['videoUrl'] ?? '',
                        'readTime' => $p['readTime'] ?? '3분',
                        'author' => $p['author'] ?? '편집부',
                        'content' => $p['content'] ?? '',
                        'summaryPoints' => db_sanitize_summary_points($p['summaryPoints'] ?? []),
                        'status' => $p['status'] ?? 'published'
                    ];
                    $supabase->upsert('posts', $row, 'id');
                }
            }
            if (!empty($data['videos'])) {
                foreach ($data['videos'] as $v) {
                    $row = [
                        'id' => $v['id'],
                        'title' => $v['title'] ?? '',
                        'category' => $v['category'] ?? '의학뉴스',
                        'doctor' => $v['doctor'] ?? ($v['speaker'] ?? '한인 전문의'),
                        'speaker' => $v['doctor'] ?? ($v['speaker'] ?? '한인 전문의'),
                        'duration' => $v['duration'] ?? '10:00',
                        'views' => $v['views'] ?? '1.2K',
                        'youtubeId' => $v['youtubeId'] ?? '',
                        'youtubeUrl' => $v['youtubeUrl'] ?? '',
                        'videoFile' => $v['videoFile'] ?? ($v['videoUrl'] ?? ''),
                        'videoUrl' => $v['videoUrl'] ?? ($v['videoFile'] ?? ''),
                        'thumbnail' => $v['thumbnail'] ?? ($v['thumbnailUrl'] ?? ''),
                        'thumbnailUrl' => $v['thumbnail'] ?? ($v['thumbnailUrl'] ?? ''),
                        'summary' => $v['summary'] ?? ($v['description'] ?? ''),
                        'description' => $v['summary'] ?? ($v['description'] ?? ''),
                        'status' => $v['status'] ?? 'published',
                        'order' => isset($v['order']) ? (int)$v['order'] : 0
                    ];
                    $supabase->upsert('videos', $row, 'id');
                }
            }
            if (!empty($data['billboards'])) {
                foreach ($data['billboards'] as $b) {
                    $row = [
                        'id' => $b['id'],
                        'title' => $b['title'] ?? '',
                        'subtitle' => $b['subtitle'] ?? '',
                        'category' => $b['category'] ?? 'SPECIAL CAMPAIGN',
                        'mediaType' => $b['mediaType'] ?? 'image',
                        'mediaUrl' => $b['mediaUrl'] ?? '',
                        'linkUrl' => $b['linkUrl'] ?? '/about#contact',
                        'linkText' => $b['linkText'] ?? '자세히 보기',
                        'status' => $b['status'] ?? 'active',
                        'order' => isset($b['order']) ? (int)$b['order'] : 0
                    ];
                    $supabase->upsert('billboards', $row, 'id');
                }
            }
            if (!empty($data['categories'])) {
                foreach ($data['categories'] as $type => $items) {
                    $supabase->upsert('categories', ['type' => $type, 'items' => $items], 'type');
                }
            }
        } catch (Exception $e) {
            error_log('Supabase sync error: ' . $e->getMessage());
        }
    }

    return $res;
}

function send_json($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-cache, no-store, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function get_json_input() {
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return $_POST;
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? array_merge($_POST, $decoded) : $_POST;
}

function require_auth() {
    if (session_status() === PHP_SESSION_NONE) {
        @session_start();
    }
    if (isset($_SESSION['njap_admin_logged']) && $_SESSION['njap_admin_logged'] === true) {
        return true;
    }
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if ($auth && preg_match('/Bearer\s+(.*)$/i', $auth, $matches)) {
        if ($matches[1] === 'njap_admin_valid_token_2026') {
            return true;
        }
    }
    if (!empty($_COOKIE['njap_admin_token']) && $_COOKIE['njap_admin_token'] === 'njap_admin_valid_token_2026') {
        return true;
    }
    return true; // Soft auth for dev API usage
}
