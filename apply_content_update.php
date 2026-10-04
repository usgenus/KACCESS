<?php
require_once __DIR__ . '/api/config.php';
require_once __DIR__ . '/api/db.php';

header('Content-Type: text/plain; charset=utf-8');

$targets = [
    PERSISTENT_DATA_FILE,
    DATA_FILE,
    dirname(DATA_FILE, 2) . '/ko/data/content.json'
];

foreach ($targets as $f) {
    if (file_exists($f)) {
        $str = file_get_contents($f);
        if ($str) {
            $json = json_decode($str, true);
            if (is_array($json) && !empty($json['billboards2'])) {
                foreach ($json['billboards2'] as &$b) {
                    if (($b['id'] ?? '') === 'b2_1787754156_cdbe') {
                        $b['subtitle'] = '한국어로 맘편하게 상담하세요. 카카오톡 실시간 상담으로 궁금하신 점을 문의하세요.';
                        $b['linkUrl'] = 'http://pf.kakao.com/_hdxmxaX/chat';
                        $b['linkText'] = '카카오톡 1:1 상담 바로가기 →';
                    }
                    if (($b['id'] ?? '') === 'b2_1788289616_6355') {
                        $b['subtitle'] = '스마트 의료 도구';
                        $b['linkUrl'] = '/calculator';
                        $b['linkText'] = '보조금 계산기 바로가기 →';
                    }
                    if (($b['linkUrl'] ?? '') === '/tool' || strpos($b['linkUrl'] ?? '', '/tool') !== false) {
                        $b['linkUrl'] = '/calculator';
                    }
                    if (($b['linkText'] ?? '') === '환자도우미 바로가기 →') {
                        $b['linkText'] = '바로가기 →';
                    }
                }
                unset($b);
                file_put_contents($f, json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX);
                clearstatcache(true, $f);
                echo "UPDATED: $f\n";
            }
        }
    } else {
        echo "NOT_EXISTS: $f\n";
    }
}
@unlink(__FILE__);
