<?php
/**
 * POST /api/brief.php — receives the project brief from /work-with-me/.
 *
 * PHP because Hostinger's shared hosting runs PHP, not JavaScript. Sends two
 * emails through the Resend HTTP API: the brief to Sergio, and a confirmation
 * to whoever sent it.
 *
 * Configuration lives in ../../.env-brief.php, OUTSIDE the public directory,
 * so the API key is never reachable over HTTP. See .env-brief.example.php.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function reply(array $body, int $status = 200): never {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    reply(['ok' => false, 'error' => 'Method not allowed.'], 405);
}

$configPath = __DIR__ . '/../../.env-brief.php';
if (!is_file($configPath)) {
    error_log('brief: missing .env-brief.php');
    reply(['ok' => false, 'error' => 'Something broke on my end. Email hello@sgualda.com directly.'], 500);
}
$cfg = require $configPath;

$data = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($data)) {
    reply(['ok' => false, 'error' => 'Malformed request.'], 400);
}

/* ── spam gates, cheapest first ──
   Bots get a success response. Telling them they failed only helps them. */
if (!empty($data['website'])) {
    reply(['ok' => true]);
}
if (isset($data['elapsed']) && is_numeric($data['elapsed']) && $data['elapsed'] < 3000) {
    reply(['ok' => true]);
}

/* ── validation ── */
$email   = trim((string)($data['email'] ?? ''));
$blocked = trim((string)($data['blocked'] ?? ''));

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    reply(['ok' => false, 'error' => 'That email address does not look right.'], 422);
}
if (mb_strlen($blocked) < 20) {
    reply(['ok' => false, 'error' => 'Tell me a little more about what is blocked.'], 422);
}

/* ── rate limit: 3 briefs per IP per hour, kept in a temp file ── */
$ip   = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$file = sys_get_temp_dir() . '/brief_' . hash('sha256', $ip) . '.txt';
$hits = array_filter(
    is_file($file) ? (array)json_decode((string)file_get_contents($file), true) : [],
    fn($t) => $t > time() - 3600
);
if (count($hits) >= 3) {
    reply(['ok' => false, 'error' => 'You have sent a few already. Email me directly instead.'], 429);
}
$hits[] = time();
@file_put_contents($file, json_encode(array_values($hits)));

/* ── compose ── */
$esc = fn(?string $s): string => nl2br(htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'));

$specifics = '';
foreach ((array)($data['specifics'] ?? []) as $label => $value) {
    if (trim((string)$value) !== '') {
        $specifics .= '<p><strong>' . $esc((string)$label) . '</strong><br>' . $esc((string)$value) . '</p>';
    }
}

$name = trim((string)($data['name'] ?? '')) ?: 'Someone';
$body = '<h2>' . $esc($name) . ' sent a brief</h2>'
    . '<p><strong>Email</strong> ' . $esc($email) . '</p>'
    . '<p><strong>Looking for</strong> ' . $esc((string)($data['kind'] ?? '—')) . '</p>'
    . (!empty($data['recommendation'])
        ? '<p><strong>Qualifier said</strong> ' . $esc((string)$data['recommendation']) . '</p>' : '')
    . '<hr>'
    . '<p><strong>Product</strong> ' . $esc((string)($data['product'] ?? '—')) . '</p>'
    . '<p><strong>Team</strong> ' . $esc((string)($data['team'] ?? '—')) . '</p>'
    . '<hr>'
    . '<p><strong>What is blocked</strong><br>' . $esc($blocked) . '</p>'
    . $specifics
    . '<hr><p style="color:#888;font-size:12px">IP ' . $esc($ip) . ' · ' . gmdate('c') . '</p>';

/** Returns true on success. */
function send(array $cfg, string $to, string $subject, string $html, ?string $replyTo = null): bool {
    $payload = [
        'from'    => 'Sergio Gualda <' . $cfg['MAIL_FROM'] . '>',
        'to'      => [$to],
        'subject' => $subject,
        'html'    => $html,
    ];
    if ($replyTo !== null) {
        $payload['reply_to'] = $replyTo;
    }

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $cfg['RESEND_API_KEY'],
            'Content-Type: application/json',
        ],
        CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_UNICODE),
    ]);
    $res  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($code < 200 || $code >= 300) {
        error_log("brief: resend $code $res");
        return false;
    }
    return true;
}

// If the brief itself cannot be delivered, the sender must know.
if (!send($cfg, $cfg['MAIL_TO'], "Brief — $name", $body, $email)) {
    reply(['ok' => false, 'error' => 'Something broke on my end. Email hello@sgualda.com directly.'], 502);
}

// Confirmation is best-effort. The brief already arrived, so a failure here
// must not tell the sender their message was lost.
send($cfg, $email, 'Got your brief',
    '<p>Thanks — your brief arrived and I read every one myself.</p>'
    . '<p>You will hear back within a day, with what fits, what it would involve and what it '
    . 'costs, or that none of it fits.</p><p>— Sergio</p>');

reply(['ok' => true]);
