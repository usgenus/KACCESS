<?php
/**
 * Global CMS Database, Persistent Storage & Cloud Configuration
 */

// 1. Supabase Project Settings
define('SUPABASE_URL', 'https://hjswqohhrrgclosqsikw.supabase.co');
define('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqc3dxb2hocnJnY2xvc3FzaWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNjMxMTMsImV4cCI6MjEwMTkzOTExM30.cIaGtw9CSLvPib5V6WbB7nM5_AnGg0Iz_rd2ccO52UI');

// 3. Gemini AI Translation API Key
define('GEMINI_API_KEY', getenv('GEMINI_API_KEY') ?: '');

// Resolve canonical public_html root directory
function get_public_html_root() {
    $dir = __DIR__;
    // If inside /ko/api, go up 2 levels
    if (basename(dirname($dir)) === 'ko') {
        return dirname($dir, 2);
    }
    // If inside /api, go up 1 level
    return dirname($dir, 1);
}

$publicRoot = get_public_html_root();
define('LOCAL_ROOT', $publicRoot);

// 2. Resolve Hostinger Persistent Host Space (Outside public_html so static deployments NEVER wipe data)
function get_persistent_root() {
    $publicRoot = defined('LOCAL_ROOT') ? LOCAL_ROOT : get_public_html_root();
    $domainRoot = dirname($publicRoot); // e.g. /home/u738358110/domains/njaccessportal.com
    $candidates = [
        $domainRoot . '/persistent_storage',
        $publicRoot . '/../persistent_storage',
        dirname($domainRoot) . '/persistent_storage',
        $publicRoot . '/data'
    ];
    foreach ($candidates as $dir) {
        if (!is_dir($dir)) {
            @mkdir($dir, 0777, true);
            @chmod($dir, 0777);
        }
        if (is_dir($dir) && is_writable($dir)) {
            return realpath($dir) ?: $dir;
        }
    }
    return realpath($publicRoot . '/data') ?: ($publicRoot . '/data');
}

$persistentRoot = get_persistent_root();
define('PERSISTENT_ROOT', $persistentRoot);
define('PERSISTENT_DATA_FILE', PERSISTENT_ROOT . '/content.json');
define('PERSISTENT_MEDIA_STORE', PERSISTENT_ROOT . '/media_store.json');
define('PERSISTENT_IMAGES_DIR', PERSISTENT_ROOT . '/uploads/images');
define('PERSISTENT_VIDEOS_DIR', PERSISTENT_ROOT . '/uploads/videos');
define('PERSISTENT_AUDIO_DIR', PERSISTENT_ROOT . '/uploads/audio');

// Ensure persistent folders exist
if (!is_dir(PERSISTENT_IMAGES_DIR)) { @mkdir(PERSISTENT_IMAGES_DIR, 0777, true); @chmod(PERSISTENT_IMAGES_DIR, 0777); }
if (!is_dir(PERSISTENT_VIDEOS_DIR)) { @mkdir(PERSISTENT_VIDEOS_DIR, 0777, true); @chmod(PERSISTENT_VIDEOS_DIR, 0777); }
if (!is_dir(PERSISTENT_AUDIO_DIR)) { @mkdir(PERSISTENT_AUDIO_DIR, 0777, true); @chmod(PERSISTENT_AUDIO_DIR, 0777); }

// Local public_html mirrors (ALWAYS pointing to canonical public_html)
define('DATA_FILE', $publicRoot . '/data/content.json');
define('LOCAL_MEDIA_STORE', $publicRoot . '/data/media_store.json');
define('LOCAL_IMAGES_DIR', $publicRoot . '/uploads/images');
define('LOCAL_VIDEOS_DIR', $publicRoot . '/uploads/videos');
define('LOCAL_AUDIO_DIR', $publicRoot . '/uploads/audio');

// Secondary mirrors (ko/ directory)
define('KO_IMAGES_DIR', $publicRoot . '/ko/uploads/images');
define('KO_VIDEOS_DIR', $publicRoot . '/ko/uploads/videos');

if (!is_dir(LOCAL_IMAGES_DIR)) { @mkdir(LOCAL_IMAGES_DIR, 0777, true); @chmod(LOCAL_IMAGES_DIR, 0777); }
if (!is_dir(LOCAL_VIDEOS_DIR)) { @mkdir(LOCAL_VIDEOS_DIR, 0777, true); @chmod(LOCAL_VIDEOS_DIR, 0777); }
if (!is_dir(LOCAL_AUDIO_DIR)) { @mkdir(LOCAL_AUDIO_DIR, 0777, true); @chmod(LOCAL_AUDIO_DIR, 0777); }
if (!is_dir(KO_IMAGES_DIR)) { @mkdir(KO_IMAGES_DIR, 0777, true); @chmod(KO_IMAGES_DIR, 0777); }
if (!is_dir(KO_VIDEOS_DIR)) { @mkdir(KO_VIDEOS_DIR, 0777, true); @chmod(KO_VIDEOS_DIR, 0777); }
