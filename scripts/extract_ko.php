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
        
        // Mirror js/ to root so /js/* requests succeed directly without 404
        if (is_dir($targetDir . '/js')) {
            @mkdir(__DIR__ . '/js', 0755, true);
            $jFiles = scandir($targetDir . '/js');
            foreach ($jFiles as $jf) {
                if ($jf != '.' && $jf != '..') {
                    @copy($targetDir . '/js/' . $jf, __DIR__ . '/js/' . $jf);
                }
            }
        }

        // Mirror and sync uploads/audio to both /ko/uploads/audio and /uploads/audio
        $kor2Audio = '/home/u738358110/domains/kor2.njaccessportal.com/public_html/uploads/audio';
        $koAudio = $targetDir . '/uploads/audio';
        $rootAudio = __DIR__ . '/uploads/audio';
        @mkdir($koAudio, 0755, true);
        @mkdir($rootAudio, 0755, true);
        if (is_dir($kor2Audio)) {
            $aFiles = scandir($kor2Audio);
            foreach ($aFiles as $af) {
                if ($af != '.' && $af != '..') {
                    if (!file_exists($koAudio . '/' . $af)) @copy($kor2Audio . '/' . $af, $koAudio . '/' . $af);
                    if (!file_exists($rootAudio . '/' . $af)) @copy($kor2Audio . '/' . $af, $rootAudio . '/' . $af);
                }
            }
        }

        echo "SUCCESS: extracted to " . $targetDir . " at " . date('Y-m-d H:i:s') . "\n";
    } else {
        echo "ERROR: extractTo failed\n";
    }
} else {
    echo "ERROR: Zip open failed with code: " . $res . "\n";
}
