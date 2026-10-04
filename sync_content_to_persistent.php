<?php
require_once __DIR__ . '/api/config.php';
require_once __DIR__ . '/api/db.php';

header('Content-Type: text/plain; charset=utf-8');

$source = __DIR__ . '/data/content.json';
if (file_exists($source)) {
    $content = file_get_contents($source);
    if ($content) {
        $pDataFile = PERSISTENT_DATA_FILE;
        $pDir = dirname($pDataFile);
        if (!is_dir($pDir)) {
            @mkdir($pDir, 0777, true);
        }
        file_put_contents($pDataFile, $content, LOCK_EX);
        clearstatcache(true, $pDataFile);
        echo "COPIED_TO_PERSISTENT: " . strlen($content) . " bytes\n";
    }
} else {
    echo "SOURCE_NOT_FOUND\n";
}
@unlink(__FILE__);
