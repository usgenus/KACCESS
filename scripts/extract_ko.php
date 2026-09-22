<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: text/plain; charset=utf-8');

$zipFile = __DIR__ . '/deploy_ko.zip';
$targetDir = __DIR__ . '/ko';

if (!file_exists($zipFile)) {
    echo "ERROR: deploy_ko.zip not found\n";
    exit(1);
}

if (!is_dir($targetDir)) {
    mkdir($targetDir, 0755, true);
}

if (!class_exists('ZipArchive')) {
    echo "ERROR: ZipArchive class not found in PHP\n";
    exit(1);
}

$zip = new ZipArchive();
$res = $zip->open($zipFile);
if ($res === TRUE) {
    $ok = $zip->extractTo($targetDir);
    $zip->close();
    if ($ok) {
        @unlink($zipFile);
        @unlink(__DIR__ . '/deploy_ko.tar.gz');
        echo "SUCCESS: extracted to " . $targetDir . " at " . date('Y-m-d H:i:s') . "\n";
    } else {
        echo "ERROR: extractTo failed\n";
    }
} else {
    echo "ERROR: Zip open failed with code: " . $res . "\n";
}
