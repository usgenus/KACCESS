<?php
/**
 * Healthcare Access Portal - Persistent File Upload & Media Library Handler
 * Stores all uploads in Hostinger Persistent Storage (outside public_html)
 * and mirrors into public_html for instant CDN delivery.
 */
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    send_json(['success' => true]);
}

require_auth();

$action = $_GET['action'] ?? '';

// GET: List uploaded files for Media Library (Merges Persistent Storage and Local Mirror)
if ($method === 'GET' && $action === 'list') {
    $type = $_GET['type'] ?? 'all'; // 'images', 'videos', or 'all'
    $filesMap = [];

    // Helper to scan a directory
    $scanFolder = function($dir, $fileType, $urlPrefix) use (&$filesMap) {
        if (!is_dir($dir)) return;
        foreach (scandir($dir) as $f) {
            if ($f === '.' || $f === '..' || $f === '.htaccess') continue;
            $path = $dir . '/' . $f;
            if (is_file($path)) {
                if (!isset($filesMap[$f])) {
                    $filesMap[$f] = [
                        'name' => $f,
                        'type' => $fileType,
                        'url' => $urlPrefix . '/' . $f,
                        'size' => filesize($path),
                        'mtime' => filemtime($path)
                    ];
                }
            }
        }
    };

    if ($type === 'all' || $type === 'images') {
        $scanFolder(PERSISTENT_IMAGES_DIR, 'image', '/uploads/images');
        $scanFolder(LOCAL_IMAGES_DIR, 'image', '/uploads/images');
    }

    if ($type === 'all' || $type === 'videos') {
        $scanFolder(PERSISTENT_VIDEOS_DIR, 'video', '/uploads/videos');
        $scanFolder(LOCAL_VIDEOS_DIR, 'video', '/uploads/videos');
    }

    $files = array_values($filesMap);
    usort($files, function($a, $b) {
        return $b['mtime'] <=> $a['mtime'];
    });

    send_json(['success' => true, 'files' => $files]);
}

// DELETE: Remove an uploaded file from both Persistent and Local stores
if ($method === 'DELETE' || ($method === 'POST' && $action === 'delete')) {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $url = trim($input['url'] ?? ($_GET['url'] ?? ''));
    if (!$url) {
        send_json(['success' => false, 'error' => '삭제할 파일 URL이 필요합니다.'], 400);
    }

    $filename = basename($url);
    $subDir = (strpos($url, '/videos/') !== false) ? 'videos' : 'images';

    $pPath = ($subDir === 'videos' ? PERSISTENT_VIDEOS_DIR : PERSISTENT_IMAGES_DIR) . '/' . $filename;
    $lPath = ($subDir === 'videos' ? LOCAL_VIDEOS_DIR : LOCAL_IMAGES_DIR) . '/' . $filename;

    if (file_exists($pPath)) @unlink($pPath);
    if (file_exists($lPath)) @unlink($lPath);

    // Remove from persistent media store
    if (file_exists(PERSISTENT_MEDIA_STORE)) {
        $store = json_decode(@file_get_contents(PERSISTENT_MEDIA_STORE), true) ?: [];
        if (isset($store[$filename])) {
            unset($store[$filename]);
            @file_put_contents(PERSISTENT_MEDIA_STORE, json_encode($store, JSON_UNESCAPED_SLASHES));
        }
    }

    send_json(['success' => true, 'message' => '파일이 삭제되었습니다.']);
}

// POST: Upload File
if ($method === 'POST') {
    if (empty($_FILES['file'])) {
        send_json(['success' => false, 'error' => '업로드할 파일이 없습니다.'], 400);
    }

    $file = $_FILES['file'];
    if ($file['error'] !== UPLOAD_ERR_OK) {
        send_json(['success' => false, 'error' => '파일 업로드 오류 코드: ' . $file['error']], 400);
    }

    $filename = $file['name'];
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

    $allowedImages = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    $allowedVideos = ['mp4', 'webm', 'ogg', 'mov', 'm4v'];

    $isImage = in_array($ext, $allowedImages);
    $isVideo = in_array($ext, $allowedVideos);

    if (!$isImage && !$isVideo) {
        send_json(['success' => false, 'error' => '지원하지 않는 파일 형식입니다. (지원 형식: JPG, PNG, WEBP, GIF, SVG, MP4, WEBM, MOV)'], 400);
    }

    $targetSubdir = $isImage ? 'images' : 'videos';

    // Generate safe clean filename
    $rawBase = pathinfo($filename, PATHINFO_FILENAME);
    $cleanBase = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $rawBase);
    $safeName = $targetSubdir . '_' . date('Ymd_His') . '_' . substr(md5(uniqid()), 0, 6) . '.' . $ext;

    $lTargetDir = $isImage ? LOCAL_IMAGES_DIR : LOCAL_VIDEOS_DIR;
    $pTargetDir = $isImage ? PERSISTENT_IMAGES_DIR : PERSISTENT_VIDEOS_DIR;
    $koTargetDir = $isImage ? (defined('KO_IMAGES_DIR') ? KO_IMAGES_DIR : (dirname(LOCAL_IMAGES_DIR) . '/uploads/images')) : (defined('KO_VIDEOS_DIR') ? KO_VIDEOS_DIR : (dirname(LOCAL_VIDEOS_DIR) . '/uploads/videos'));

    if (!is_dir($lTargetDir)) { @mkdir($lTargetDir, 0777, true); @chmod($lTargetDir, 0777); }
    if (!is_dir($pTargetDir)) { @mkdir($pTargetDir, 0777, true); @chmod($pTargetDir, 0777); }
    if (!is_dir($koTargetDir)) { @mkdir($koTargetDir, 0777, true); @chmod($koTargetDir, 0777); }

    $lTargetPath = $lTargetDir . '/' . $safeName;
    $pTargetPath = $pTargetDir . '/' . $safeName;
    $koTargetPath = $koTargetDir . '/' . $safeName;

    // 1. Primary Move to Local web-accessible directory
    $saved = false;
    if (is_uploaded_file($file['tmp_name'])) {
        $saved = @move_uploaded_file($file['tmp_name'], $lTargetPath);
    }
    if (!$saved) {
        $saved = @copy($file['tmp_name'], $lTargetPath);
    }
    if (!$saved) {
        // Fallback to persistent directory if local was blocked
        $saved = @move_uploaded_file($file['tmp_name'], $pTargetPath) || @copy($file['tmp_name'], $pTargetPath);
        if ($saved && file_exists($pTargetPath)) {
            @copy($pTargetPath, $lTargetPath);
        }
    }

    if (!$saved && !file_exists($lTargetPath)) {
        send_json(['success' => false, 'error' => '파일 저장에 실패했습니다. 폴더 쓰기 권한을 확인해주세요.'], 500);
    }

    @chmod($lTargetPath, 0666);

    // 2. Mirror into Persistent Storage & ko/ directory
    $sourceFile = file_exists($lTargetPath) ? $lTargetPath : $pTargetPath;
    if (file_exists($sourceFile)) {
        if (!file_exists($pTargetPath)) {
            @copy($sourceFile, $pTargetPath);
            @chmod($pTargetPath, 0666);
        }
        if (!file_exists($koTargetPath)) {
            @copy($sourceFile, $koTargetPath);
            @chmod($koTargetPath, 0666);
        }
    }

    // 3. Persistent Media Store Record (Metadata only, avoiding memory exhaustion)
    $relativeUrl = '/uploads/' . $targetSubdir . '/' . $safeName;
    $fileSize = file_exists($sourceFile) ? filesize($sourceFile) : 0;

    $mediaRecord = [
        'name' => $safeName,
        'type' => $isImage ? 'image' : 'video',
        'url' => $relativeUrl,
        'size' => $fileSize,
        'mtime' => time()
    ];

    $pStore = file_exists(PERSISTENT_MEDIA_STORE) ? (json_decode(@file_get_contents(PERSISTENT_MEDIA_STORE), true) ?: []) : [];
    $pStore[$safeName] = $mediaRecord;
    @file_put_contents(PERSISTENT_MEDIA_STORE, json_encode($pStore, JSON_UNESCAPED_SLASHES));
    @chmod(PERSISTENT_MEDIA_STORE, 0666);

    $lStore = file_exists(LOCAL_MEDIA_STORE) ? (json_decode(@file_get_contents(LOCAL_MEDIA_STORE), true) ?: []) : [];
    $lStore[$safeName] = $mediaRecord;
    @file_put_contents(LOCAL_MEDIA_STORE, json_encode($lStore, JSON_UNESCAPED_SLASHES));
    @chmod(LOCAL_MEDIA_STORE, 0666);

    send_json([
        'success' => true,
        'message' => '업로드가 안전하게 완료되었습니다.',
        'url' => $relativeUrl,
        'name' => $safeName,
        'type' => $isImage ? 'image' : 'video',
        'size' => $fileSize
    ]);
}

send_json(['success' => false, 'error' => '올바르지 않은 요청입니다.'], 400);
