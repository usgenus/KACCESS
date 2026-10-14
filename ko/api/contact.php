<?php
/**
 * Healthcare Access Portal - Contact Form & Inquiries API
 * Handles saving submissions to CMS and sending email notifications to njaccessportal@gmail.com
 */
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    send_json(['success' => true]);
}

$inquiriesFile = PERSISTENT_ROOT . '/inquiries.json';
$localInquiriesFile = __DIR__ . '/../data/inquiries.json';

function get_inquiries_store() {
    global $inquiriesFile, $localInquiriesFile;
    if (file_exists($inquiriesFile)) {
        clearstatcache(true, $inquiriesFile);
        $content = @file_get_contents($inquiriesFile);
        if ($content) {
            $data = json_decode($content, true);
            if (is_array($data)) return $data;
        }
    }
    if (file_exists($localInquiriesFile)) {
        $content = @file_get_contents($localInquiriesFile);
        if ($content) {
            $data = json_decode($content, true);
            if (is_array($data)) return $data;
        }
    }
    return [];
}

function save_inquiries_store($store) {
    global $inquiriesFile, $localInquiriesFile;
    $json = json_encode(array_values($store), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
    $pDir = dirname($inquiriesFile);
    if (!is_dir($pDir)) { @mkdir($pDir, 0777, true); @chmod($pDir, 0777); }
    @file_put_contents($inquiriesFile, $json, LOCK_EX);
    @chmod($inquiriesFile, 0666);

    $lDir = dirname($localInquiriesFile);
    if (!is_dir($lDir)) { @mkdir($lDir, 0777, true); @chmod($lDir, 0777); }
    @file_put_contents($localInquiriesFile, $json, LOCK_EX);
    @chmod($localInquiriesFile, 0666);
}

// Function to send email notification to njaccessportal@gmail.com
function send_contact_notification_email($item) {
    $to = 'njaccessportal@gmail.com';
    $name = htmlspecialchars($item['name'] ?? '고객', ENT_QUOTES, 'UTF-8');
    $businessName = htmlspecialchars($item['businessName'] ?? '', ENT_QUOTES, 'UTF-8');
    $email = htmlspecialchars($item['email'] ?? '미기재', ENT_QUOTES, 'UTF-8');
    $phone = htmlspecialchars($item['phone'] ?? '미기재', ENT_QUOTES, 'UTF-8');
    $methodKey = strtolower($item['contactMethod'] ?? 'phone');
    $methodLabel = '전화 통화';
    if ($methodKey === 'text') $methodLabel = '문자 (SMS)';
    else if ($methodKey === 'email') $methodLabel = '이메일';
    else if ($methodKey === 'phone') $methodLabel = '전화 통화';
    $category = htmlspecialchars($item['category'] ?? '일반 문의', ENT_QUOTES, 'UTF-8');
    $createdAt = htmlspecialchars($item['createdAt'] ?? date('Y-m-d H:i:s'), ENT_QUOTES, 'UTF-8');
    $rawMsg = $item['rawMessage'] ?? ($item['message'] ?? '');
    $message = nl2br(htmlspecialchars($rawMsg, ENT_QUOTES, 'UTF-8'));

    $isPartner = !empty($businessName) || (($item['type'] ?? '') === 'partner') || (strpos($category, '파트너') !== false);

    if ($isPartner) {
        $subjectRaw = '[NJ Access Portal] 파트너 등록 및 제휴 문의: ' . ($businessName ? $businessName . ' (' . $name . ')' : $name . ' (' . $category . ')');
    } else {
        $subjectRaw = '[NJ Access Portal] 새로운 문의/상담 접수: ' . $item['name'] . ' (' . $item['category'] . ')';
    }
    $subject = '=?UTF-8?B?' . base64_encode($subjectRaw) . '?=';

    $fromName = 'Healthcare Access Portal';
    $fromEmail = 'no-reply@njaccessportal.com';
    $fromEncoded = '=?UTF-8?B?' . base64_encode($fromName) . '?= <' . $fromEmail . '>';

    $headers = [];
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: text/html; charset=UTF-8';
    $headers[] = 'From: ' . $fromEncoded;
    if (!empty($item['email']) && filter_var($item['email'], FILTER_VALIDATE_EMAIL)) {
        $replyName = '=?UTF-8?B?' . base64_encode($item['name']) . '?=';
        $headers[] = 'Reply-To: ' . $replyName . ' <' . $item['email'] . '>';
    }
    $headers[] = 'X-Mailer: PHP/' . phpversion() . ' (NJ Access Portal)';

    $bannerGradient = $isPartner ? 'linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #9a3412 100%)' : 'linear-gradient(135deg, #0f3a9e 0%, #5e0f73 100%)';
    $bannerSub = $isPartner ? '뉴저지 파트너즈 · 비즈니스 파트너 등록 및 제휴 문의 알림' : 'NJ Access Portal · 뉴저지 한인 의료접근포털 온라인 문의/상담 접수 알림';
    $badgeText = $isPartner ? '파트너 제휴' : '신규 접수';
    $headTitle = $isPartner ? '새로운 파트너 등록 및 제휴 문의가 도착했습니다.' : '홈페이지를 통해 새로운 상담 및 문의가 도착했습니다.';
    $headDesc = $isPartner ? '뉴저지 파트너즈 등록 신청 내역입니다. 아래 정보를 확인하시고 제휴 담당자분께 연락 부탁드립니다.' : '아래 접수 내역을 확인하시고, 신청 고객님께 빠른 시일 내에 연락 부탁드립니다.';

    $businessRow = '';
    if (!empty($businessName)) {
        $businessRow = '
                <tr>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #475569; width: 28%; border-bottom: 1px solid #e2e8f0; background-color: #f1f5f9;">상호명 (비즈니스)</td>
                  <td style="padding: 12px 16px; font-size: 15px; font-weight: 800; color: #c2410c; border-bottom: 1px solid #e2e8f0;">' . $businessName . '</td>
                </tr>';
    }

    $emailRow = '';
    if (!empty($item['email']) && $email !== '미기재') {
        $emailRow = '
                <tr>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #475569; border-bottom: 1px solid #e2e8f0; background-color: #f1f5f9;">이메일 (Email)</td>
                  <td style="padding: 12px 16px; font-size: 13px; color: #1e40af; border-bottom: 1px solid #e2e8f0;">
                    <a href="mailto:' . $email . '" style="color: #1e40af; text-decoration: none; font-weight: 600;">' . $email . '</a>
                  </td>
                </tr>';
    }

    $htmlBody = '
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>NJ Access Portal · 뉴저지 한인 포털</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color: #334155;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
          <!-- Header Banner -->
          <tr>
            <td style="background: ' . $bannerGradient . '; padding: 25px 30px; text-align: left;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">NJ Access Portal</div>
                    <div style="font-size: 12px; color: rgba(255,255,255,0.9); margin-top: 4px;">' . $bannerSub . '</div>
                  </td>
                  <td align="right">
                    <span style="background-color: rgba(255,255,255,0.25); color: #ffffff; font-size: 11px; font-weight: bold; padding: 5px 12px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.4);">' . $badgeText . '</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="font-size: 18px; color: #0f172a; margin: 0 0 15px 0; font-weight: 700;">
                ' . $headTitle . '
              </h2>
              <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin: 0 0 25px 0;">
                ' . $headDesc . '
              </p>

              <!-- Information Table -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 25px;">
                ' . $businessRow . '
                <tr>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #475569; width: 28%; border-bottom: 1px solid #e2e8f0; background-color: #f1f5f9;">' . ($isPartner ? '담당자 성함' : '성함 (Name)') . '</td>
                  <td style="padding: 12px 16px; font-size: 14px; font-weight: 600; color: #0f172a; border-bottom: 1px solid #e2e8f0;">' . $name . '</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #475569; border-bottom: 1px solid #e2e8f0; background-color: #f1f5f9;">연락처 (Phone)</td>
                  <td style="padding: 12px 16px; font-size: 14px; font-weight: 700; color: #059669; border-bottom: 1px solid #e2e8f0;">
                    <a href="tel:' . $phone . '" style="color: #059669; text-decoration: none;">' . $phone . '</a>
                  </td>
                </tr>
                ' . $emailRow . '
                <tr>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #475569; border-bottom: 1px solid #e2e8f0; background-color: #f1f5f9;">' . ($isPartner ? '업종 / 분야' : '문의 유형') . '</td>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #0f766e; border-bottom: 1px solid #e2e8f0;">
                    <span style="display: inline-block; background-color: ' . ($isPartner ? '#ffedd5' : '#ccfbf1') . '; color: ' . ($isPartner ? '#c2410c' : '#0f766e') . '; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold;">' . $category . '</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #475569; background-color: #f1f5f9;">접수 일시</td>
                  <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">' . $createdAt . ' (EST)</td>
                </tr>
              </table>

              <!-- Message Box -->
              <div style="margin-bottom: 25px;">
                <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">문의 내용 (Inquiry Message):</div>
                <div style="background-color: #f8fafc; border-left: 4px solid ' . ($isPartner ? '#ea580c' : '#3b82f6') . '; border-radius: 0 8px 8px 0; padding: 16px; font-size: 13px; color: #1e293b; line-height: 1.7; word-break: break-word;">
                  ' . $message . '
                </div>
              </div>

              <!-- Action Links -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px;">
                <tr>
                  <td align="center" style="padding: 10px 0;">
                    <a href="tel:' . $phone . '" style="display: inline-block; background-color: #ea580c; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-right: 10px;">전화 바로 걸기 (' . $phone . ')</a>
                    <a href="https://njaccessportal.com/admin3/" style="display: inline-block; background-color: #f1f5f9; color: #334155; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 20px; border-radius: 8px; border: 1px solid #cbd5e1;">CMS 관리자 바로가기</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 30px; text-align: center;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0; line-height: 1.5;">
                본 메일은 <strong>NJ Access Portal</strong> ' . ($isPartner ? '뉴저지 파트너즈 제휴' : '온라인 상담') . ' 접수 시스템에서 자동으로 발송되었습니다.<br>
                수신처: njaccessportal@gmail.com · © ' . date('Y') . ' NJ Access Portal. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
';

    return @mail($to, $subject, $htmlBody, implode("\r\n", $headers));
}

// GET: List all inquiries
if ($method === 'GET') {
    $store = get_inquiries_store();
    // Sort newest first
    usort($store, function($a, $b) {
        return strcmp($b['createdAt'] ?? '', $a['createdAt'] ?? '');
    });
    send_json([
        'success' => true,
        'total' => count($store),
        'unresolved' => count(array_filter($store, function($i) { return empty($i['resolved']); })),
        'data' => $store
    ]);
}

// POST actions
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true) ?? $_POST;
$action = $_GET['action'] ?? ($input['action'] ?? 'submit');

$store = get_inquiries_store();

if ($action === 'submit') {
    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $phone = trim($input['phone'] ?? ($input['contact'] ?? ''));
    $businessName = trim($input['businessName'] ?? ($input['business'] ?? ''));
    $contactMethod = trim($input['contactMethod'] ?? 'phone');
    $category = trim($input['category'] ?? ($businessName !== '' ? '파트너 제휴' : '일반 문의'));
    $rawMessage = trim($input['message'] ?? '');
    $type = trim($input['type'] ?? ($businessName !== '' ? 'partner' : 'general'));

    if ($businessName !== '' && $rawMessage === '') {
        $message = "파트너 등록 및 제휴 문의 신청 접수 (업종: {$category})";
    } else {
        $message = $rawMessage;
    }

    $contactProvided = ($phone !== '') ? $phone : $email;
    if ($name === '' || $contactProvided === '' || $message === '') {
        send_json(['success' => false, 'error' => '상호명, 성함, 연락처 등 필수 항목을 입력해 주세요.'], 400);
    }

    $newInquiry = [
        'id' => 'inq_' . time() . '_' . substr(md5(uniqid((string)mt_rand(), true)), 0, 6),
        'name' => $name,
        'businessName' => $businessName,
        'email' => $email,
        'phone' => $phone,
        'contactMethod' => $contactMethod,
        'category' => $category,
        'message' => $businessName !== '' ? "[상호명: {$businessName}] " . $message : $message,
        'rawMessage' => $rawMessage ?: $message,
        'type' => $type,
        'resolved' => false,
        'createdAt' => date('Y-m-d H:i:s'),
        'resolvedAt' => null,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? ''
    ];

    // Prepend new inquiry
    array_unshift($store, $newInquiry);
    save_inquiries_store($store);

    // Send email notification to njaccessportal@gmail.com
    $mailSent = send_contact_notification_email($newInquiry);

    send_json([
        'success' => true,
        'message' => '상담 및 제휴 문의가 성공적으로 접수되었습니다. 확인 후 빠른 시일 내에 연락드리겠습니다.',
        'mailSent' => $mailSent,
        'data' => $newInquiry
    ]);
}

if ($action === 'toggle_resolved') {
    $id = trim($input['id'] ?? ($_GET['id'] ?? ''));
    if (!$id) {
        send_json(['success' => false, 'error' => 'Inquiry ID is required'], 400);
    }

    $found = false;
    $updatedItem = null;
    foreach ($store as &$item) {
        if (($item['id'] ?? '') === $id) {
            $item['resolved'] = empty($item['resolved']) ? true : false;
            $item['resolvedAt'] = $item['resolved'] ? date('Y-m-d H:i:s') : null;
            $updatedItem = $item;
            $found = true;
            break;
        }
    }

    if (!$found) {
        send_json(['success' => false, 'error' => 'Inquiry not found'], 404);
    }

    save_inquiries_store($store);
    send_json([
        'success' => true,
        'message' => $updatedItem['resolved'] ? '해결 완료로 변경되었습니다.' : '미해결 상태로 변경되었습니다.',
        'item' => $updatedItem
    ]);
}

if ($action === 'delete') {
    $id = trim($input['id'] ?? ($_GET['id'] ?? ''));
    if (!$id) {
        send_json(['success' => false, 'error' => 'Inquiry ID is required'], 400);
    }

    $initialCount = count($store);
    $store = array_values(array_filter($store, function($item) use ($id) {
        return ($item['id'] ?? '') !== $id;
    }));

    if (count($store) === $initialCount) {
        send_json(['success' => false, 'error' => 'Inquiry not found'], 404);
    }

    save_inquiries_store($store);
    send_json([
        'success' => true,
        'message' => '문의 내역이 성공적으로 삭제되었습니다.'
    ]);
}

send_json(['success' => false, 'error' => 'Invalid action'], 400);
