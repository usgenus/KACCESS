<?php
/**
 * Automated deploy sync for KACCESS portal and forum updates
 */
$rootDir = '/home/u738358110/domains/njaccessportal.com/public_html';
$koDir = $rootDir . '/ko';
$pStorageDir = '/home/u738358110/domains/njaccessportal.com/persistent_storage';
$tarUrl = 'https://raw.githubusercontent.com/usgenus/KACCESS/main/deploy_bundle.tar.gz';
$tarFile = $koDir . '/deploy_bundle.tar.gz';
$logFile = $koDir . '/deploy_log.txt';

$data = @file_get_contents($tarUrl);
if (!$data || strlen($data) < 1000) {
    file_put_contents($logFile, "Failed to download tar: " . strlen($data));
    exit(1);
}

file_put_contents($tarFile, $data);

try {
    $phar = new PharData($tarFile);
    // Extract to ko
    $phar->extractTo($koDir, null, true);
    // Also extract to root
    $phar->extractTo($rootDir, null, true);
    @unlink($tarFile);

    // Sync forum.json to persistent_storage and ensure 100% Korean
    if (file_exists($koDir . '/data/forum.json')) {
        @copy($koDir . '/data/forum.json', $pStorageDir . '/forum.json');
        @copy($koDir . '/data/forum.json', $rootDir . '/data/forum.json');
    }
    if (file_exists($koDir . '/data/forum_en.json')) {
        @copy($koDir . '/data/forum_en.json', $pStorageDir . '/forum_en.json');
        @copy($koDir . '/data/forum_en.json', $rootDir . '/data/forum_en.json');
        if (is_dir($rootDir . '/en/data')) {
            @copy($koDir . '/data/forum_en.json', $rootDir . '/en/data/forum_en.json');
        }
    }

    file_put_contents($logFile, "SUCCESS: extracted and synced " . strlen($data) . " bytes at " . date('Y-m-d H:i:s'));
    echo "SUCCESS\n";
} catch (Exception $e) {
    file_put_contents($logFile, "ERROR: " . $e->getMessage());
    echo "ERROR: " . $e->getMessage() . "\n";
}
