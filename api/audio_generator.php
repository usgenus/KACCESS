<?php
/**
 * Professional News Audio Generator for Blog Posts
 * Generates natural female anchor audio narration (Microsoft Edge SunHi Neural)
 * adhering strictly to editorial reading rules:
 * 1. Female voice model: ko-KR-SunHiNeural (or en-US-AriaNeural for English)
 * 2. Start strictly from article body (skips title and excerpt)
 * 3. Skip words inside parentheses ( ) and （ ） without breaking Korean particles
 * 4. Strip photo/figure captions, markdown, URLs, and HTML tags
 * 5. Saves directly to uploads/audio/{slug}.mp3
 */

if (!defined('AUDIO_GENERATOR_LOADED')) {
    define('AUDIO_GENERATOR_LOADED', true);
}

function clean_text_for_audio_tts($text) {
    if (empty($text)) return '';

    // Strip photo & figure captions
    $text = preg_replace('/\[(?:사진|PHOTO|이미지|그림)[^\]]*\]/iu', '', $text);
    $text = preg_replace('/!\[.*?\]\(.*?\)/su', '', $text);

    // Convert markdown links [text](url) -> text
    $text = preg_replace('/\[([^\]]+)\]\([^)]+\)/u', '$1', $text);

    // Extract custom box content
    $text = preg_replace('/:::box\s*([\s\S]*?)\s*:::/u', '$1', $text);

    // Strip HTML tags
    $text = strip_tags($text);

    // Strip markdown formatting symbols
    $text = preg_replace('/(\*\*|__|\+\+|--|==|~~)/u', '', $text);
    $text = preg_replace('/[#*`]/u', '', $text);

    // Strip URLs
    $text = preg_replace('/https?:\/\/\S+/u', '', $text);

    // Skip words and translations in parentheses without breaking trailing Korean particles
    $particles = '(?:은|는|이|가|을|를|의|에|에서|에서는|에도|에만|에의|에게|으로|로|으로는|로는|으로도|로도|와|과|도|만|뿐|부터|까지|이나|나|이며|며|이란|란|이라|라|라서|이라서|처럼|같이|마저|조차)';
    $text = preg_replace('/\s*\([^)]*\)(?=' . $particles . ')/u', '', $text);
    $text = preg_replace('/\s*（[^）]*）(?=' . $particles . ')/u', '', $text);
    $text = preg_replace('/\s*\([^)]*\)/u', ' ', $text);
    $text = preg_replace('/\s*（[^）]*）/u', ' ', $text);

    // Sanitize quotes and entities for clean SSML
    $text = str_replace(['《', '》'], '"', $text);
    $text = str_replace('&', ' 그리고 ', $text);
    $text = preg_replace('/\s+/u', ' ', $text);
    return trim($text);
}

function synthesize_edge_tts_audio($cleanText, $voice = 'ko-KR-SunHiNeural') {
    if (empty($cleanText)) return false;

    $trustedClientToken = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
    $ticks = (int)(time() + 11644473600);
    $rounded = $ticks - ($ticks % 300);
    $windowsTicks = $rounded * 10000000;
    $strToHash = $windowsTicks . $trustedClientToken;
    $secMsGec = strtoupper(hash('sha256', $strToHash));
    $connId = bin2hex(random_bytes(16));

    $path = "/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken={$trustedClientToken}&Sec-MS-GEC={$secMsGec}&Sec-MS-GEC-Version=1-143.0.3650.96&ConnectionId={$connId}";

    $sp = @stream_socket_client("ssl://speech.platform.bing.com:443", $errno, $errstr, 12, STREAM_CLIENT_CONNECT);
    if (!$sp) return false;
    stream_set_timeout($sp, 25);

    $key = base64_encode(random_bytes(16));
    $headers = [
        "GET {$path} HTTP/1.1",
        "Host: speech.platform.bing.com",
        "Upgrade: websocket",
        "Connection: Upgrade",
        "Sec-WebSocket-Key: {$key}",
        "Sec-WebSocket-Version: 13",
        "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0",
        "Origin: chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
        "\r\n"
    ];
    fwrite($sp, implode("\r\n", $headers));

    $response = '';
    while (!feof($sp)) {
        $line = fgets($sp, 1024);
        $response .= $line;
        if (trim($line) === '') break;
    }
    if (!strpos($response, '101')) {
        fclose($sp);
        return false;
    }

    $sendFrame = function($sock, $payload) {
        $len = strlen($payload);
        $mask = random_bytes(4);
        $hdr = chr(0x81);
        if ($len <= 125) {
            $hdr .= chr(0x80 | $len);
        } elseif ($len <= 65535) {
            $hdr .= chr(0x80 | 126) . pack('n', $len);
        } else {
            $hdr .= chr(0x80 | 127) . pack('J', $len);
        }
        $hdr .= $mask;
        $masked = '';
        for ($i = 0; $i < $len; $i++) {
            $masked .= $payload[$i] ^ $mask[$i % 4];
        }
        fwrite($sock, $hdr . $masked);
    };

    // 1. Send speech.config
    $speechConfig = "Content-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{\"context\":{\"synthesis\":{\"audio\":{\"metadataoptions\":{\"sentenceBoundaryEnabled\":\"false\",\"wordBoundaryEnabled\":\"false\"},\"outputFormat\":\"audio-24khz-48kbitrate-mono-mp3\"}}}}";
    $sendFrame($sp, $speechConfig);

    // 2. Send SSML request
    $reqId = bin2hex(random_bytes(16));
    $escaped = htmlspecialchars($cleanText, ENT_XML1, 'UTF-8');
    $langLocale = strpos($voice, 'en-') === 0 ? 'en-US' : 'ko-KR';
    $ssml = "<speak version=\"1.0\" xmlns=\"http://www.w3.org/2001/10/synthesis\" xmlns:mstts=\"https://www.w3.org/2001/mstts\" xml:lang=\"{$langLocale}\"><voice name=\"{$voice}\"><prosody pitch=\"+0Hz\" rate=\"+0%\" volume=\"+0%\">{$escaped}</prosody></voice></speak>";
    $msg = "X-RequestId:{$reqId}\r\nContent-Type:application/ssml+xml\r\nPath:ssml\r\n\r\n" . $ssml;
    $sendFrame($sp, $msg);

    // 3. Receive audio stream
    $audioData = '';
    $turnEnded = false;
    while (!feof($sp) && !$turnEnded) {
        $hdr = fread($sp, 2);
        if (strlen($hdr) < 2) break;
        $b1 = ord($hdr[0]);
        $b2 = ord($hdr[1]);
        $opcode = $b1 & 0x0F;
        $isMasked = ($b2 & 0x80) !== 0;
        $payLen = $b2 & 0x7F;

        if ($payLen === 126) {
            $ext = fread($sp, 2);
            $payLen = unpack('n', $ext)[1];
        } elseif ($payLen === 127) {
            $ext = fread($sp, 8);
            $payLen = unpack('J', $ext)[1];
        }

        $maskKey = $isMasked ? fread($sp, 4) : '';
        $data = '';
        $rem = $payLen;
        while ($rem > 0) {
            $chunk = fread($sp, min($rem, 8192));
            if ($chunk === false || strlen($chunk) === 0) break;
            $data .= $chunk;
            $rem -= strlen($chunk);
        }
        if ($isMasked) {
            for ($i = 0; $i < strlen($data); $i++) {
                $data[$i] = $data[$i] ^ $maskKey[$i % 4];
            }
        }

        if ($opcode === 0x01 && strpos($data, 'Path:turn.end') !== false) {
            $turnEnded = true;
        } elseif ($opcode === 0x02) {
            $delim = "Path:audio\r\n";
            $dPos = strpos($data, $delim);
            if ($dPos !== false) {
                $audioData .= substr($data, $dPos + strlen($delim));
            }
        } elseif ($opcode === 0x08) {
            break;
        }
    }
    fclose($sp);
    return (strlen($audioData) > 500) ? $audioData : false;
}

function generate_post_audio_file($slug, $title, $excerpt = '', $content = '', $lang = 'ko') {
    if (empty($slug)) return false;

    // Target directories
    $possibleRoots = [
        dirname(__DIR__),
        dirname(__DIR__, 2),
        __DIR__ . '/..'
    ];
    $dirs = [];
    foreach ($possibleRoots as $pr) {
        $d = $pr . '/uploads/audio';
        if (!in_array($d, $dirs)) $dirs[] = $d;
    }
    if (defined('PERSISTENT_ROOT') && !empty(PERSISTENT_ROOT)) {
        $pDir = PERSISTENT_ROOT . '/uploads/audio';
        if (!in_array($pDir, $dirs)) $dirs[] = $pDir;
    }
    foreach ($dirs as $d) {
        if (!is_dir($d)) {
            @mkdir($d, 0755, true);
        }
    }

    // Standard rule: start strictly from article body (skip title and excerpt)
    $readingBody = !empty(trim($content)) ? $content : $title;
    $cleanText = clean_text_for_audio_tts($readingBody);
    if (empty($cleanText)) return false;

    // Female anchor voice: SunHi for Korean, Aria for English
    $voice = ($lang === 'en') ? 'en-US-AriaNeural' : 'ko-KR-SunHiNeural';

    // If text is extremely long (>2500 chars), chunk by sentences to keep socket fast
    $totalLen = mb_strlen($cleanText, 'UTF-8');
    $audioData = '';

    if ($totalLen <= 2500) {
        $audioData = synthesize_edge_tts_audio($cleanText, $voice);
    } else {
        // Split on sentences
        $sentences = preg_split('/(?<=[.?!;\n])\s+/u', $cleanText, -1, PREG_SPLIT_NO_EMPTY);
        $chunk = '';
        foreach ($sentences as $s) {
            if (mb_strlen($chunk . ' ' . $s, 'UTF-8') > 1800) {
                if (!empty($chunk)) {
                    $piece = synthesize_edge_tts_audio(trim($chunk), $voice);
                    if ($piece) $audioData .= $piece;
                    $chunk = $s;
                }
            } else {
                $chunk = empty($chunk) ? $s : $chunk . ' ' . $s;
            }
        }
        if (!empty($chunk)) {
            $piece = synthesize_edge_tts_audio(trim($chunk), $voice);
            if ($piece) $audioData .= $piece;
        }
    }

    if (!empty($audioData) && strlen($audioData) > 500) {
        $saved = false;
        foreach ($dirs as $d) {
            if (is_dir($d)) {
                $filePath = $d . '/' . $slug . '.mp3';
                if (@file_put_contents($filePath, $audioData) !== false) {
                    $saved = true;
                }
            }
        }
        return $saved;
    }

    return false;
}

// Direct invocation via HTTP GET / POST
if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === basename(__FILE__)) {
    header('Content-Type: application/json; charset=utf-8');
    require_once __DIR__ . '/db.php';

    $slug = trim($_GET['slug'] ?? ($_POST['slug'] ?? ''));
    $force = !empty($_GET['force']) || !empty($_POST['force']);

    if (!$slug) {
        echo json_encode(['success' => false, 'error' => 'Slug is required']);
        exit;
    }

    $candidates = [
        __DIR__ . '/../uploads/audio/' . $slug . '.mp3',
        __DIR__ . '/../ko/uploads/audio/' . $slug . '.mp3',
        dirname(__DIR__, 2) . '/uploads/audio/' . $slug . '.mp3'
    ];
    if (defined('PERSISTENT_ROOT') && !empty(PERSISTENT_ROOT)) {
        $candidates[] = PERSISTENT_ROOT . '/uploads/audio/' . $slug . '.mp3';
    }

    $audioExists = false;
    foreach ($candidates as $c) {
        if (file_exists($c) && filesize($c) > 500) {
            $audioExists = true;
            break;
        }
    }

    if ($audioExists && !$force) {
        echo json_encode([
            'success' => true,
            'message' => 'Audio already exists',
            'audioUrl' => '/uploads/audio/' . rawurlencode($slug) . '.mp3'
        ]);
        exit;
    }

    $db = get_db_data();
    $posts = $db['posts'] ?? [];
    $targetPost = null;
    foreach ($posts as $p) {
        if (($p['slug'] ?? '') === $slug || ($p['id'] ?? '') === $slug) {
            $targetPost = $p;
            break;
        }
    }

    if (!$targetPost) {
        echo json_encode(['success' => false, 'error' => 'Post not found']);
        exit;
    }

    $lang = (isset($_GET['lang']) && $_GET['lang'] === 'en') ? 'en' : 'ko';
    $title = $targetPost['title'] ?? '';
    $excerpt = $targetPost['excerpt'] ?? '';
    $content = $targetPost['content'] ?? '';

    $success = generate_post_audio_file($slug, $title, $excerpt, $content, $lang);

    echo json_encode([
        'success' => $success,
        'slug' => $slug,
        'voice' => ($lang === 'en') ? 'en-US-AriaNeural' : 'ko-KR-SunHiNeural',
        'audioUrl' => $success ? ('/uploads/audio/' . rawurlencode($slug) . '.mp3') : ''
    ]);
    exit;
}
