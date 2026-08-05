<?php
/**
 * Copy to .env-brief.php and put it ONE LEVEL ABOVE public_html on Hostinger,
 * so no URL can reach it. api/brief.php verifies that at runtime and refuses to
 * run if it finds the file inside the web root — a loud failure beats a working
 * form leaking an API key.
 *
 * Never commit the real file. Everything below is a placeholder.
 */
return [
    // Resend → API Keys. Permission "Sending access", scoped to the domain.
    'RESEND_API_KEY' => 're_xxxxxxxxxxxx',

    // Must sit on a domain verified in Resend, or every send is rejected.
    'MAIL_FROM' => 'hello@example.com',

    // Where the brief arrives.
    'MAIL_TO' => 'hello@example.com',

    // Optional. Blind copy of the brief only, never of the confirmation that
    // goes back to whoever wrote it — that would copy a stranger's own words to
    // an address they never wrote to, invisibly to the one person who would
    // want to know.
    'MAIL_BCC' => '',
];
