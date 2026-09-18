<?php
/**
 * Healthcare Access Portal - Permanent Media Recovery & Streaming Endpoint
 * Serves media from Hostinger Persistent Storage, decodes from Media Store if missing,
 * and streams with permanent caching.
 */
require_once __DIR__ . '/config.php';

$requestedFile = $_GET['file'] ?? '';
$filename = basename($requestedFile);

if (!$filename || $filename === '.' || $filename === '..') {
    http_response_code(400);
    exit('Invalid filename');
}

$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
$subDir = in_array($ext, ['mp4', 'webm', 'ogg', 'mov', 'm4v']) ? 'videos' : 'images';

$localFilePath = ($subDir === 'videos' ? LOCAL_VIDEOS_DIR : LOCAL_IMAGES_DIR) . '/' . $filename;
$persistentFilePath = ($subDir === 'videos' ? PERSISTENT_VIDEOS_DIR : PERSISTENT_IMAGES_DIR) . '/' . $filename;

// 1. If physical file exists in Persistent Storage but not in local mirror, restore local mirror
if (!file_exists($localFilePath) && file_exists($persistentFilePath)) {
    $dir = dirname($localFilePath);
    if (!is_dir($dir)) { @mkdir($dir, 0777, true); @chmod($dir, 0777); }
    @copy($persistentFilePath, $localFilePath);
    @chmod($localFilePath, 0666);
}

// 2. If physical file does not exist anywhere, try recovering from Persistent Media Store or Local Store
if (!file_exists($localFilePath) && !file_exists($persistentFilePath)) {
    $recovered = false;
    $stores = [PERSISTENT_MEDIA_STORE, LOCAL_MEDIA_STORE];

    foreach ($stores as $storeFile) {
        if (file_exists($storeFile)) {
            $store = json_decode(@file_get_contents($storeFile), true) ?: [];
            if (!empty($store[$filename])) {
                $dataUrl = $store[$filename];
                if (preg_match('/^data:([^;]+);base64,(.+)$/', $dataUrl, $matches)) {
                    $binary = base64_decode($matches[2]);
                    if ($binary !== false) {
                        // Write to Persistent Space
                        $pDir = dirname($persistentFilePath);
                        if (!is_dir($pDir)) { @mkdir($pDir, 0777, true); @chmod($pDir, 0777); }
                        @file_put_contents($persistentFilePath, $binary);
                        @chmod($persistentFilePath, 0666);

                        // Write to Local Space
                        $lDir = dirname($localFilePath);
                        if (!is_dir($lDir)) { @mkdir($lDir, 0777, true); @chmod($lDir, 0777); }
                        @file_put_contents($localFilePath, $binary);
                        @chmod($localFilePath, 0666);

                        $recovered = true;
                        break;
                    }
                }
            }
        }
    }
}

// 3. Determine the best source file to stream
$streamPath = file_exists($localFilePath) ? $localFilePath : (file_exists($persistentFilePath) ? $persistentFilePath : null);

if ($streamPath && file_exists($streamPath)) {
    $mime = mime_content_type($streamPath);
    if (!$mime) {
        $mimeTypes = [
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'webp' => 'image/webp',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            'mp4' => 'video/mp4',
            'webm' => 'video/webm'
        ];
        $mime = $mimeTypes[$ext] ?? 'application/octet-stream';
    }

    // Set permanent caching headers
    header('Content-Type: ' . $mime);
    header('Cache-Control: public, max-age=31536000, immutable');
    header('Access-Control-Allow-Origin: *');
    header('Accept-Ranges: bytes');
    header('X-Media-Source: hostinger-persistent');

    $size = filesize($streamPath);
    $start = 0;
    $end = $size - 1;

    // Handle HTTP Range header for HTML5 video streaming
    if (isset($_SERVER['HTTP_RANGE'])) {
        if (preg_match('/bytes=\h*(\d+)-(\d*)[\D.*]?/i', $_SERVER['HTTP_RANGE'], $matches)) {
            $start = intval($matches[1]);
            if (!empty($matches[2])) {
                $end = intval($matches[2]);
            }
        }
        if ($start > $end || $start >= $size || $end >= $size) {
            header('HTTP/1.1 416 Requested Range Not Satisfiable');
            header("Content-Range: bytes */$size");
            exit;
        }
        header('HTTP/1.1 206 Partial Content');
        header("Content-Range: bytes $start-$end/$size");
        $length = $end - $start + 1;
        header("Content-Length: $length");
    } else {
        header("Content-Length: $size");
    }

    // Clear any output buffers to ensure uncompressed, direct binary streaming
    // CRITICAL for Safari: must stream actual bytes after headers for BOTH range and full requests
    while (ob_get_level() > 0) {
        @ob_end_clean();
    }

    $fp = fopen($streamPath, 'rb');
    if ($fp) {
        fseek($fp, $start);
        $remaining = ($end - $start + 1);
        while (!feof($fp) && $remaining > 0) {
            $chunk = min($remaining, 65536);
            $data = fread($fp, $chunk);
            if ($data === false) break;
            echo $data;
            flush();
            $remaining -= strlen($data);
        }
        fclose($fp);
    }
    exit;
}

// 4. Graceful Fallback for missing images
if ($subDir === 'images') {
    header('Location: https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80&auto=format', true, 302);
    exit;
}

http_response_code(404);
echo 'Media file not found';
exit;
