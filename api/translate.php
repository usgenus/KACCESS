<?php
/**
 * AI Translation Proxy — Gemini API
 * Translates Korean medical text to natural English.
 * API key is server-side only; never exposed to the browser.
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// --- Read & validate input ---
$body = file_get_contents('php://input');
$data = json_decode($body, true);

if (!isset($data['texts']) || !is_array($data['texts']) || empty($data['texts'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request: texts array required']);
    exit;
}

$texts = array_values($data['texts']);

// Limit to 500 strings per request for safety
if (count($texts) > 500) {
    $texts = array_slice($texts, 0, 500);
}

// --- Gemini API key ---
if (!defined('GEMINI_API_KEY') || empty(GEMINI_API_KEY)) {
    http_response_code(500);
    echo json_encode(['error' => 'Gemini API key not configured. Add GEMINI_API_KEY to api/config.php']);
    exit;
}

$apiKey = GEMINI_API_KEY;

// --- Build Gemini prompt ---
$textsJson = json_encode($texts, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

$prompt = 'You are a professional Korean-to-English medical translator for a Korean-American healthcare portal in New Jersey.' . "\n\n" .
'Translate the following JSON array of Korean strings into natural, conversational American English.' . "\n" .
'- Keep medical terms accurate but accessible (e.g., "메디케어" => "Medicare", "ACA 건강보험" => "ACA health insurance").' . "\n" .
'- Preserve proper nouns, brand names, URLs, email addresses, and numbers exactly as-is.' . "\n" .
'- If a string is already in English, return it unchanged.' . "\n" .
'- Return ONLY a valid JSON array of translated strings in the exact same order and count as the input.' . "\n" .
'- Do NOT include any explanation, markdown, or extra text — only the JSON array.' . "\n\n" .
'Input:' . "\n" . $textsJson;

// --- Call Gemini API ---
$endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=' . $apiKey;

$payload = json_encode([
    'contents' => [
        [
            'parts' => [
                ['text' => $prompt]
            ]
        ]
    ],
    'generationConfig' => [
        'temperature'     => 0.1,
        'maxOutputTokens' => 65536,
        'responseMimeType' => 'application/json'
    ]
]);

$ch = curl_init($endpoint);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_TIMEOUT        => 60,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(502);
    echo json_encode(['error' => 'API request failed: ' . $curlError]);
    exit;
}

if ($httpCode !== 200) {
    http_response_code(502);
    $geminiErr = json_decode($response, true);
    echo json_encode(['error' => 'Gemini API error', 'details' => $geminiErr]);
    exit;
}

// --- Parse Gemini response ---
$geminiData = json_decode($response, true);
$rawText = $geminiData['candidates'][0]['content']['parts'][0]['text'] ?? '';

// Strip potential markdown code fences
$rawText = trim($rawText);
if (strpos($rawText, '```') === 0) {
    $rawText = preg_replace('/^```(?:json)?\s*/i', '', $rawText);
    $rawText = preg_replace('/```\s*$/', '', $rawText);
    $rawText = trim($rawText);
}

$translations = json_decode($rawText, true);

if (!is_array($translations)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to parse Gemini response as JSON array', 'raw' => $rawText]);
    exit;
}

// Ensure output matches input length (fill with originals if Gemini returned fewer)
$out = [];
foreach ($texts as $i => $orig) {
    $out[] = $translations[$i] ?? $orig;
}

echo json_encode(['translations' => $out], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
