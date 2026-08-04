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

/**
 * The config, and proof that it is where it is supposed to be.
 *
 * `../../` from public_html/api/ lands one level above the web root, which is
 * the whole point: the Resend key must never be fetchable over HTTP. But that
 * is only true if the file was actually put there. Copy it into public_html by
 * mistake — the single easiest deployment error to make — and the key is one
 * GET away, silently, with the form still working perfectly.
 *
 * So the location is verified rather than assumed. If the config resolves to
 * anywhere inside the document root, this refuses to run and says why in the
 * log. A loud failure beats a working form leaking an API key.
 */
$configPath = realpath(__DIR__ . '/../../.env-brief.php');
if ($configPath === false) {
    error_log('brief: .env-brief.php not found — it belongs one level ABOVE public_html');
    reply(['ok' => false, 'error' => 'Something broke on my end. Email hello@sgualda.com directly.'], 500);
}

$docRoot = realpath($_SERVER['DOCUMENT_ROOT'] ?? '');
if ($docRoot !== false && str_starts_with($configPath, $docRoot . DIRECTORY_SEPARATOR)) {
    error_log("brief: REFUSING TO RUN — .env-brief.php is inside the web root at $configPath");
    reply(['ok' => false, 'error' => 'Something broke on my end. Email hello@sgualda.com directly.'], 500);
}

$cfg = require $configPath;

/**
 * The config is placed by hand over FTP, which is where typos happen, and a
 * missing key would otherwise surface as a PHP warning followed by a 401 from
 * Resend — a 502 to the sender, and nothing in the log that says which of the
 * three values was wrong. Checked here instead, by name, before any work.
 *
 * MAIL_BCC is deliberately not on this list: it is optional, and the form has
 * to keep working for somebody who has not set one.
 */
if (!is_array($cfg)) {
    error_log('brief: .env-brief.php did not return an array');
    reply(['ok' => false, 'error' => 'Something broke on my end. Email hello@sgualda.com directly.'], 500);
}
foreach (['RESEND_API_KEY', 'MAIL_FROM', 'MAIL_TO'] as $key) {
    if (empty($cfg[$key])) {
        error_log("brief: .env-brief.php is missing $key");
        reply(['ok' => false, 'error' => 'Something broke on my end. Email hello@sgualda.com directly.'], 500);
    }
}

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

/**
 * Returns true on success.
 *
 * $bcc is opt-in per call rather than applied to every send. The brief that
 * comes to me gets a blind copy to a second address, so a mailbox problem on
 * one of them cannot lose an enquiry. The confirmation that goes back to the
 * sender must never carry it: that would copy a stranger's own words to an
 * address they never wrote to, and a bcc is invisible to exactly the person
 * who would want to know.
 */
function send(array $cfg, string $to, string $subject, string $html, ?string $replyTo = null, bool $bcc = false): bool {
    $payload = [
        'from'    => 'Sergio Gualda <' . $cfg['MAIL_FROM'] . '>',
        'to'      => [$to],
        'subject' => $subject,
        'html'    => $html,
    ];
    if ($replyTo !== null) {
        $payload['reply_to'] = $replyTo;
    }
    if ($bcc && !empty($cfg['MAIL_BCC'])) {
        $payload['bcc'] = [$cfg['MAIL_BCC']];
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
if (!send($cfg, $cfg['MAIL_TO'], "Brief — $name", $body, $email, true)) {
    reply(['ok' => false, 'error' => 'Something broke on my end. Email hello@sgualda.com directly.'], 502);
}

// Confirmation is best-effort. The brief already arrived, so a failure here
// must not tell the sender their message was lost.
/**
 * A copy of what they wrote, sent back to them.
 *
 * It is the only record the sender has of their own brief, it gives them
 * something to reply to, and returning somebody's own words is the cheapest
 * trust available after a form submission. Built from the same escaped values
 * as the brief that comes to me, so the two can never disagree.
 */
$copy = '<hr><p style="color:#6b6b6b;font-size:14px">What you sent:</p>'
    . '<p><strong>Looking for</strong><br>' . $esc((string)($data['kind'] ?? '—')) . '</p>'
    . '<p><strong>Product</strong><br>' . $esc((string)($data['product'] ?? '—')) . '</p>'
    . '<p><strong>What is blocked</strong><br>' . $esc($blocked) . '</p>'
    . $specifics;

send($cfg, $email, 'Got your brief',
    '<p>Thanks — your brief arrived and I read every one myself.</p>'
    . '<p>You will hear back within five working days, with what fits, what it would involve and '
    . 'costs, or that none of it fits. That reply is an email: there is no call to book and '
    . 'nothing to schedule.</p><p>— Sergio</p>'
    . $copy);

reply(['ok' => true]);
