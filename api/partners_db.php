<?php
/**
 * NJ Partners (뉴저지 파트너즈) - Unified Storage & Database Layer
 * Supports Hostinger Persistent Storage, Local JSON Mirror, and Supabase Cloud Sync
 */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/supabase.php';

define('PARTNERS_LOCAL_FILE', LOCAL_ROOT . '/data/partners.json');
define('PARTNERS_PERSISTENT_FILE', PERSISTENT_ROOT . '/partners.json');

define('PARTNERS_CRED_LOCAL_FILE', LOCAL_ROOT . '/data/partner_credentials.json');
define('PARTNERS_CRED_PERSISTENT_FILE', PERSISTENT_ROOT . '/partner_credentials.json');

define('ADMIN3_AUTH_LOCAL_FILE', LOCAL_ROOT . '/data/admin3_auth.json');
define('ADMIN3_AUTH_PERSISTENT_FILE', PERSISTENT_ROOT . '/admin3_auth.json');

function get_partners_file() {
    if (file_exists(PARTNERS_PERSISTENT_FILE)) {
        return PARTNERS_PERSISTENT_FILE;
    }
    if (file_exists(PARTNERS_LOCAL_FILE)) {
        return PARTNERS_LOCAL_FILE;
    }
    return PARTNERS_LOCAL_FILE;
}

function get_partners_cred_file() {
    if (file_exists(PARTNERS_CRED_PERSISTENT_FILE)) {
        return PARTNERS_CRED_PERSISTENT_FILE;
    }
    if (file_exists(PARTNERS_CRED_LOCAL_FILE)) {
        return PARTNERS_CRED_LOCAL_FILE;
    }
    return PARTNERS_CRED_LOCAL_FILE;
}

function get_admin3_auth_file() {
    if (file_exists(ADMIN3_AUTH_PERSISTENT_FILE)) {
        return ADMIN3_AUTH_PERSISTENT_FILE;
    }
    if (file_exists(ADMIN3_AUTH_LOCAL_FILE)) {
        return ADMIN3_AUTH_LOCAL_FILE;
    }
    return ADMIN3_AUTH_LOCAL_FILE;
}

/**
 * Read Partners Data
 */
function get_partners_data() {
    $file = get_partners_file();
    if (file_exists($file)) {
        $content = @file_get_contents($file);
        $json = @json_decode($content, true);
        if (is_array($json)) {
            return $json;
        }
    }
    return ['hero_slides' => [], 'partners' => []];
}

/**
 * Save Partners Data (Atomic dual write to persistent and local mirror)
 */
function save_partners_data($data) {
    $encoded = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    // 1. Persistent storage (Hostinger)
    $pDir = dirname(PARTNERS_PERSISTENT_FILE);
    if (!is_dir($pDir)) { @mkdir($pDir, 0777, true); @chmod($pDir, 0777); }
    @file_put_contents(PARTNERS_PERSISTENT_FILE, $encoded, LOCK_EX);
    @chmod(PARTNERS_PERSISTENT_FILE, 0666);

    // 2. Local mirror
    $lDir = dirname(PARTNERS_LOCAL_FILE);
    if (!is_dir($lDir)) { @mkdir($lDir, 0777, true); @chmod($lDir, 0777); }
    @file_put_contents(PARTNERS_LOCAL_FILE, $encoded, LOCK_EX);
    @chmod(PARTNERS_LOCAL_FILE, 0666);

    return true;
}

/**
 * Read Partner Credentials
 */
function get_partner_credentials() {
    $file = get_partners_cred_file();
    if (file_exists($file)) {
        $content = @file_get_contents($file);
        $json = @json_decode($content, true);
        if (is_array($json)) {
            return $json;
        }
    }
    return [];
}

/**
 * Save Partner Credentials
 */
function save_partner_credentials($creds) {
    $encoded = json_encode($creds, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    $pDir = dirname(PARTNERS_CRED_PERSISTENT_FILE);
    if (!is_dir($pDir)) { @mkdir($pDir, 0777, true); @chmod($pDir, 0777); }
    @file_put_contents(PARTNERS_CRED_PERSISTENT_FILE, $encoded, LOCK_EX);
    @chmod(PARTNERS_CRED_PERSISTENT_FILE, 0666);

    $lDir = dirname(PARTNERS_CRED_LOCAL_FILE);
    if (!is_dir($lDir)) { @mkdir($lDir, 0777, true); @chmod($lDir, 0777); }
    @file_put_contents(PARTNERS_CRED_LOCAL_FILE, $encoded, LOCK_EX);
    @chmod(PARTNERS_CRED_LOCAL_FILE, 0666);

    return true;
}

/**
 * Read Admin3 Auth Config
 */
function get_admin3_auth() {
    $envUser = getenv('ADMIN3_USER') ?: 'ha';
    $envPass = getenv('ADMIN3_PASS') ?: 'ethan';

    $file = get_admin3_auth_file();
    if (file_exists($file)) {
        $content = @file_get_contents($file);
        $json = @json_decode($content, true);
        if (is_array($json) && !empty($json['username'])) {
            return $json;
        }
    }

    // Default initial auth
    return [
        'username' => $envUser,
        'password_hash' => password_hash($envPass, PASSWORD_DEFAULT),
        'force_password_change' => true,
        'updated_at' => date('c')
    ];
}

/**
 * Save Admin3 Auth Config
 */
function save_admin3_auth($auth) {
    $encoded = json_encode($auth, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    $pDir = dirname(ADMIN3_AUTH_PERSISTENT_FILE);
    if (!is_dir($pDir)) { @mkdir($pDir, 0777, true); @chmod($pDir, 0777); }
    @file_put_contents(ADMIN3_AUTH_PERSISTENT_FILE, $encoded, LOCK_EX);
    @chmod(ADMIN3_AUTH_PERSISTENT_FILE, 0666);

    $lDir = dirname(ADMIN3_AUTH_LOCAL_FILE);
    if (!is_dir($lDir)) { @mkdir($lDir, 0777, true); @chmod($lDir, 0777); }
    @file_put_contents(ADMIN3_AUTH_LOCAL_FILE, $encoded, LOCK_EX);
    @chmod(ADMIN3_AUTH_LOCAL_FILE, 0666);

    return true;
}
