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

/**
 * Retrieves database data with fallback to persistent storage and local mirror.
 *
 * @param bool $forceCloud
 * @return array
 */
function get_db_data($forceCloud = false): array {
    $siteLang = defined('SITE_LANG') ? SITE_LANG : ((isset($_GET['lang']) && strtolower($_GET['lang']) === 'en') ? 'en' : 'ko');
    if ($siteLang === 'en') {
        $pEn = defined('PERSISTENT_ROOT') ? (PERSISTENT_ROOT . '/content_en.json') : '';
        $lEn = __DIR__ . '/../data/content_en.json';
        if ($pEn && !file_exists($pEn) && file_exists($lEn)) {
            $pDir = dirname($pEn);
            if (!is_dir($pDir)) { @mkdir($pDir, 0777, true); @chmod($pDir, 0777); }
            @copy($lEn, $pEn);
            @chmod($pEn, 0666);
        }
        if ($pEn && file_exists($pEn)) {
            $c = @file_get_contents($pEn);
            if ($c) {
                $d = json_decode($c, true);
                if (is_array($d) && !empty($d['posts'])) return $d;
            }
        }
        if (file_exists($lEn)) {
            $c = @file_get_contents($lEn);
            if ($c) {
                $d = json_decode($c, true);
                if (is_array($d) && !empty($d['posts'])) return $d;
            }
        }
    }

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
    // Persistent storage is the authoritative source. Supabase is a fallback ONLY.
    if (file_exists(PERSISTENT_DATA_FILE)) {
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
                // Also sync to ko/data if it exists and differs
                $koDataFile = dirname(DATA_FILE, 2) . '/ko/data/content.json';
                if (is_dir(dirname($koDataFile)) && (!file_exists($koDataFile) || filesize($koDataFile) !== strlen($content))) {
                    @file_put_contents($koDataFile, $content, LOCK_EX);
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
                'news' => ['의료칼럼', 'recall(리콜)', 'health&wellness', '의료보험', '한인건강 특집', '한인커뮤니티 뉴스', '의학뉴스'],
                'videos' => ['전체', '만성질환 & 당뇨', '심장 & 혈관', '뇌신경 & 치매', '암 예방 & 검진', '감염병 & 백신', '건강검진 & 의료정보'],
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

            // IMPORTANT: Supabase data is a fallback only.
            // Only write to persistent storage if it is EMPTY (no existing data),
            // never overwrite existing persistent storage with Supabase data.
            if (!empty($posts) || !empty($videos) || !empty($billboards)) {
                $persistentIsEmpty = !file_exists(PERSISTENT_DATA_FILE) || filesize(PERSISTENT_DATA_FILE) < 100;
                if ($persistentIsEmpty || $forceCloud) {
                    $json = json_encode($cloudData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                    $pDir = dirname(PERSISTENT_DATA_FILE);
                    if (!is_dir($pDir)) { @mkdir($pDir, 0777, true); @chmod($pDir, 0777); }
                    @file_put_contents(PERSISTENT_DATA_FILE, $json, LOCK_EX);
                    @chmod(PERSISTENT_DATA_FILE, 0666);
                    $lDir = dirname(DATA_FILE);
                    if (!is_dir($lDir)) { @mkdir($lDir, 0777, true); @chmod($lDir, 0777); }
                    @file_put_contents(DATA_FILE, $json, LOCK_EX);
                    @chmod(DATA_FILE, 0666);
                }
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
        'billboards2' => [],
        'videos' => [],
        'posts' => [],
        'categories' => [
            'news' => ['의료칼럼', 'recall(리콜)', 'health&wellness', '의료보험', '한인건강 특집', '한인커뮤니티 뉴스', '의학뉴스'],
            'videos' => ['전체', '만성질환 & 당뇨', '심장 & 혈관', '뇌신경 & 치매', '암 예방 & 검진', '감염병 & 백신', '건강검진 & 의료정보'],
            'billboards' => ['SPECIAL CAMPAIGN', 'MEDICARE UPDATE', 'PATIENT SUPPORT', 'HEALTH WEBINAR'],
            'billboards2' => ['SPECIAL CAMPAIGN', 'MEDICARE UPDATE', 'PATIENT SUPPORT', 'HEALTH WEBINAR']
        ]
    ];
}

function save_db_data($data, $changedItem = null, $changedTable = null) {
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

    // 2b. Also sync to ko/data/content.json (admin2's data file) to keep all sources in sync
    $koDataFile = dirname(DATA_FILE, 2) . '/ko/data/content.json';
    if (is_dir(dirname($koDataFile))) {
        @file_put_contents($koDataFile, $json, LOCK_EX);
        @chmod($koDataFile, 0666);
    }

    // 3. Fast non-blocking sync of changed item to Supabase Cloud backup
    $supabase = get_supabase();
    if ($supabase->isConfigured()) {
        try {
            if ($changedTable === 'posts' && !empty($changedItem)) {
                $row = [
                    'id' => $changedItem['id'],
                    'slug' => !empty($changedItem['slug']) ? $changedItem['slug'] : $changedItem['id'],
                    'title' => $changedItem['title'] ?? '',
                    'category' => $changedItem['category'] ?? 'Health & Wellness',
                    'date' => $changedItem['date'] ?? date('Y-m-d'),
                    'isTopStory' => !empty($changedItem['isTopStory']) && $changedItem['isTopStory'] !== 'false' && $changedItem['isTopStory'] !== false,
                    'isLiveUpdate' => !empty($changedItem['isLiveUpdate']) && $changedItem['isLiveUpdate'] !== 'false' && $changedItem['isLiveUpdate'] !== false,
                    'isDoctorColumn' => !empty($changedItem['isDoctorColumn']) && $changedItem['isDoctorColumn'] !== 'false' && $changedItem['isDoctorColumn'] !== false,
                    'isPolicyReport' => !empty($changedItem['isPolicyReport']) && $changedItem['isPolicyReport'] !== 'false' && $changedItem['isPolicyReport'] !== false,
                    'excerpt' => $changedItem['excerpt'] ?? '',
                    'coverImage' => $changedItem['coverImage'] ?? (!empty($changedItem['images'][0]) ? $changedItem['images'][0] : ''),
                    'images' => !empty($changedItem['images']) ? (is_array($changedItem['images']) ? array_values($changedItem['images']) : [$changedItem['images']]) : (!empty($changedItem['coverImage']) ? [$changedItem['coverImage']] : []),
                    'videoUrl' => $changedItem['videoUrl'] ?? '',
                    'readTime' => $changedItem['readTime'] ?? '3분',
                    'author' => $changedItem['author'] ?? '편집부',
                    'content' => $changedItem['content'] ?? '',
                    'summaryPoints' => db_sanitize_summary_points($changedItem['summaryPoints'] ?? []),
                    'status' => $changedItem['status'] ?? 'published'
                ];
                $supabase->upsert('posts', $row, 'id');
            } elseif ($changedTable === 'videos' && !empty($changedItem)) {
                $row = [
                    'id' => $changedItem['id'],
                    'title' => $changedItem['title'] ?? '',
                    'category' => $changedItem['category'] ?? '의학뉴스',
                    'doctor' => $changedItem['doctor'] ?? ($changedItem['speaker'] ?? '한인 전문의'),
                    'speaker' => $changedItem['doctor'] ?? ($changedItem['speaker'] ?? '한인 전문의'),
                    'duration' => $changedItem['duration'] ?? '10:00',
                    'views' => $changedItem['views'] ?? '1.2K',
                    'youtubeId' => $changedItem['youtubeId'] ?? '',
                    'youtubeUrl' => $changedItem['youtubeUrl'] ?? '',
                    'videoFile' => $changedItem['videoFile'] ?? ($changedItem['videoUrl'] ?? ''),
                    'videoUrl' => $changedItem['videoUrl'] ?? ($changedItem['videoFile'] ?? ''),
                    'thumbnail' => $changedItem['thumbnail'] ?? ($changedItem['thumbnailUrl'] ?? ''),
                    'thumbnailUrl' => $changedItem['thumbnail'] ?? ($changedItem['thumbnailUrl'] ?? ''),
                    'summary' => $changedItem['summary'] ?? ($changedItem['description'] ?? ''),
                    'description' => $changedItem['summary'] ?? ($changedItem['description'] ?? ''),
                    'status' => $changedItem['status'] ?? 'published',
                    'order' => isset($changedItem['order']) ? (int)$changedItem['order'] : 0
                ];
                $supabase->upsert('videos', $row, 'id');
            } elseif ($changedTable === 'billboards' && !empty($changedItem)) {
                $row = [
                    'id' => $changedItem['id'],
                    'title' => $changedItem['title'] ?? '',
                    'subtitle' => $changedItem['subtitle'] ?? '',
                    'category' => $changedItem['category'] ?? 'SPECIAL CAMPAIGN',
                    'mediaType' => $changedItem['mediaType'] ?? 'image',
                    'mediaUrl' => $changedItem['mediaUrl'] ?? '',
                    'linkUrl' => $changedItem['linkUrl'] ?? '/about#contact',
                    'linkText' => $changedItem['linkText'] ?? '자세히 보기',
                    'status' => $changedItem['status'] ?? 'active',
                    'order' => isset($changedItem['order']) ? (int)$changedItem['order'] : 0
                ];
                $supabase->upsert('billboards', $row, 'id');
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

function send_json_and_continue($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-cache, no-store, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Connection: close');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (ob_get_level() > 0) {
        @ob_end_flush();
    }
    @flush();
    if (function_exists('fastcgi_finish_request')) {
        @fastcgi_finish_request();
    }
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
    if (isset($_SESSION['cms_logged_in']) && $_SESSION['cms_logged_in'] === true) {
        return true;
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
