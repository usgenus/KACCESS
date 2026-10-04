<?php
header('Content-Type: text/plain; charset=utf-8');

$domainRoot = '/home/u738358110/domains/njaccessportal.com';
$publicRoot = $domainRoot . '/public_html';
$pStorage = $domainRoot . '/persistent_storage';

$koImages = $publicRoot . '/uploads/images';
$rootImages = $publicRoot . '/uploads/images';
$pImages = $pStorage . '/uploads/images';

if (!is_dir($rootImages)) { @mkdir($rootImages, 0777, true); @chmod($rootImages, 0777); }
if (!is_dir($pImages)) { @mkdir($pImages, 0777, true); @chmod($pImages, 0777); }

$copiedRoot = 0;
$copiedP = 0;

if (is_dir($koImages)) {
    $files = scandir($koImages);
    foreach ($files as $f) {
        if ($f === '.' || $f === '..' || $f === '.htaccess' || is_dir($koImages . '/' . $f)) continue;
        $src = $koImages . '/' . $f;
        $dstRoot = $rootImages . '/' . $f;
        $dstP = $pImages . '/' . $f;

        if (!file_exists($dstRoot) || filesize($dstRoot) !== filesize($src)) {
            if (@copy($src, $dstRoot)) {
                @chmod($dstRoot, 0666);
                $copiedRoot++;
                echo "Copied to root: $f (" . filesize($src) . " bytes)\n";
            }
        }
        if (!file_exists($dstP) || filesize($dstP) !== filesize($src)) {
            if (@copy($src, $dstP)) {
                @chmod($dstP, 0666);
                $copiedP++;
                echo "Copied to persistent: $f\n";
            }
        }
    }
}

echo "\nSummary: Copied $copiedRoot files to root uploads/images, $copiedP files to persistent storage.\n";

// Sync content.json
$pContent = $pStorage . '/content.json';
$rootContent = $publicRoot . '/data/content.json';
$koContent = $publicRoot . '/ko/data/content.json';

if (file_exists($pContent)) {
    $pData = @file_get_contents($pContent);
    if ($pData && strlen($pData) > 1000) {
        if (!file_exists($rootContent) || filesize($rootContent) !== strlen($pData)) {
            @file_put_contents($rootContent, $pData, LOCK_EX);
            echo "Synced persistent content.json to root data/content.json (" . strlen($pData) . " bytes)\n";
        }
        if (!file_exists($koContent) || filesize($koContent) !== strlen($pData)) {
            @file_put_contents($koContent, $pData, LOCK_EX);
            echo "Synced persistent content.json to ko/data/content.json\n";
        }
    }
}
