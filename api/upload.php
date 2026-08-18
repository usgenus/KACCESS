<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    send_json(['success' => true]);
}

require_auth();

$action = $_GET['action'] ?? '';

// GET: List uploaded files for Media Library
if ($method === 'GET' && $action === 'list') {
    $type = $_GET['type'] ?? 'all'; // 'images', 'videos', or 'all'
    $files = [];

    $imgDir = __DIR__ . '/../uploads/images';
    $vidDir = __DIR__ . '/../uploads/videos';

    if (($type === 'all' || $type === 'images') && is_dir($imgDir)) {
        foreach (scandir($imgDir) as $f) {
            if ($f === '.' || $f === '..' || $f === '.htaccess') continue;
            $path = $imgDir . '/' . $f;
            if (is_file($path)) {
                $files[] = [
                    'name' => $f,
                    'type' => 'image',
                    'url' => '/uploads/images/' . $f,
                    'size' => filesize($path),
                    'mtime' => filemtime($path)
                ];
            }
        }
    }

    if (($type === 'all' || $type === 'videos') && is_dir($vidDir)) {
        foreach (scandir($vidDir) as $f) {
            if ($f === '.' || $f === '..' || $f === '.htaccess') continue;
            $path = $vidDir . '/' . $f;
            if (is_file($path)) {
                $files[] = [
                    'name' => $f,
                    'type' => 'video',
                    'url' => '/uploads/videos/' . $f,
                    'size' => filesize($path),
                    'mtime' => filemtime($path)
                ];
            }
        }
    }

    usort($files, function($a, $b) {
        return $b['mtime'] <=> $a['mtime'];
    });

    send_json(['success' => true, 'files' => $files]);
}

// DELETE: Remove an uploaded file
if ($method === 'DELETE' || ($method === 'POST' && $action === 'delete')) {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $url = trim($input['url'] ?? ($_GET['url'] ?? ''));
    if (!$url) {
        send_json(['success' => false, 'error' => '삭제할 파일 URL이 필요합니다.'], 400);
    }

    // sanitize path
    $url = ltrim($url, '/');
    if (strpos($url, 'uploads/') !== 0) {
        send_json(['success' => false, 'error' => '올바르지 않은 파일 경로입니다.'], 400);
    }

    $fullPath = realpath(__DIR__ . '/../' . $url);
    $baseUploads = realpath(__DIR__ . '/../uploads');

    if ($fullPath && strpos($fullPath, $baseUploads) === 0 && file_exists($fullPath)) {
        unlink($fullPath);
        send_json(['success' => true, 'message' => '파일이 삭제되었습니다.']);
    } else {
        send_json(['success' => false, 'error' => '파일을 찾을 수 없습니다.'], 404);
    }
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
    $targetDir = __DIR__ . '/../uploads/' . $targetSubdir;

    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0755, true);
    }

    // Generate safe clean filename
    $rawBase = pathinfo($filename, PATHINFO_FILENAME);
    $cleanBase = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $rawBase);
    $safeName = $targetSubdir . '_' . date('Ymd_His') . '_' . substr(md5(uniqid()), 0, 6) . '.' . $ext;
    $targetPath = $targetDir . '/' . $safeName;

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        send_json(['success' => false, 'error' => '파일 저장에 실패했습니다. 권한을 확인해주세요.'], 500);
    }

    $relativeUrl = '/uploads/' . $targetSubdir . '/' . $safeName;

    send_json([
        'success' => true,
        'message' => '업로드가 완료되었습니다.',
        'url' => $relativeUrl,
        'name' => $safeName,
        'type' => $isImage ? 'image' : 'video',
        'size' => filesize($targetPath)
    ]);
}

send_json(['success' => false, 'error' => '올바르지 않은 요청입니다.'], 400);
