<?php
/**
 * POST /api/log.php — records JavaScript errors that happen in real browsers.
 *
 * Deliberately not Sentry: this site promises no third-party services and no
 * tracking, and honouring that is worth more than a dashboard. Writes a
 * capped, rotating log next to the config file, outside public_html.
 *
 * Records the error only. No IP, no cookie, no identifier, nothing that
 * could single a person out.
 */

declare(strict_types=1);
header('Content-Type: application/json');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    exit('{"ok":false}');
}

$raw = file_get_contents('php://input') ?: '';
if (strlen($raw) > 4000) {
    http_response_code(413);
    exit('{"ok":false}');
}

$in = json_decode($raw, true);
if (!is_array($in) || empty($in['message'])) {
    http_response_code(400);
    exit('{"ok":false}');
}

$clip = fn($v, int $n) => mb_substr(preg_replace('/[\x00-\x1F\x7F]/u', ' ', (string)$v), 0, $n);

$line = json_encode([
    't'    => gmdate('c'),
    'msg'  => $clip($in['message'] ?? '', 300),
    'src'  => $clip($in['source'] ?? '', 200),
    'line' => (int)($in['line'] ?? 0),
    'page' => $clip($in['page'] ?? '', 200),
    // Engine and major version only — enough to spot "broken in Safari",
    // not enough to recognise anyone.
    'ua'   => $clip(preg_replace('/[\d.]{3,}/', '', $_SERVER['HTTP_USER_AGENT'] ?? ''), 120),
], JSON_UNESCAPED_SLASHES);

$path = __DIR__ . '/../../js-errors.log';

// Keep the newest 500 lines. An unbounded log on shared hosting is a way to
// fill the disk quietly.
if (is_file($path) && filesize($path) > 512_000) {
    $keep = array_slice(file($path, FILE_IGNORE_NEW_LINES) ?: [], -500);
    file_put_contents($path, implode("\n", $keep) . "\n", LOCK_EX);
}

file_put_contents($path, $line . "\n", FILE_APPEND | LOCK_EX);
echo '{"ok":true}';
