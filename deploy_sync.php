<?php
/**
 * Automated deploy sync for SEO and sitemap updates
 */
$targetDir = '/home/u738358110/domains/kor2.njaccessportal.com/public_html';
$tarUrl = 'https://raw.githubusercontent.com/usgenus/KACCESS/main/deploy_seo.tar.gz';
$tarFile = $targetDir . '/deploy_seo.tar.gz';

$data = @file_get_contents($tarUrl);
if (!$data || strlen($data) < 1000) {
    file_put_contents($targetDir . '/deploy_log.txt', "Failed to download tar: " . strlen($data));
    exit(1);
}

file_put_contents($tarFile, $data);

try {
    $phar = new PharData($tarFile);
    $phar->extractTo($targetDir, null, true);
    @unlink($tarFile);
    file_put_contents($targetDir . '/deploy_log.txt', "SUCCESS: extracted " . strlen($data) . " bytes at " . date('Y-m-d H:i:s'));
} catch (Exception $e) {
    file_put_contents($targetDir . '/deploy_log.txt', "ERROR: " . $e->getMessage());
}
