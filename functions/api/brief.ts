/**
 * POST /api/brief — receives the project brief from /work-with-me/.
 *
 * Runs as a Cloudflare Pages Function, so it deploys with the site and needs
 * no separate server. Sends two emails through Resend: the brief to Sergio,
 * and a confirmation to whoever sent it.
 *
 * Required environment variables (Cloudflare dashboard → Settings → Env vars):
 *   RESEND_API_KEY   secret, from resend.com
 *   MAIL_TO          hello@sgualda.com
 *   MAIL_FROM        brief@sgualda.com  (must be a verified Resend domain)
 */

interface Env {
  RESEND_API_KEY: string;
  MAIL_TO: string;
  MAIL_FROM: string;
  RATE_LIMIT?: KVNamespace;
}

type Brief = {
  kind?: string;
  recommendation?: string;
  product?: string;
  team?: string;
  blocked?: string;
  specifics?: Record<string, string>;
  name?: string;
  email?: string;
  /** Honeypot. Real people never fill this — it is hidden. */
  website?: string;
  /** Milliseconds the form was open. Bots submit instantly. */
  elapsed?: number;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

const esc = (s = '') =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function send(env: Env, to: string, subject: string, html: string, replyTo?: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: `Sergio Gualda <${env.MAIL_FROM}>`,
      to: [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let data: Brief;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'Malformed request.' }, 400);
  }

  // ── spam gates, in order of cheapness ──
  // Silent success for bots: telling them they failed only helps them adapt.
  if (data.website) return json({ ok: true });
  if (typeof data.elapsed === 'number' && data.elapsed < 3000) return json({ ok: true });

  // ── validation ──
  const email = (data.email ?? '').trim();
  const blocked = (data.blocked ?? '').trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return json({ ok: false, error: 'That email address does not look right.' }, 422);
  }
  if (blocked.length < 20) {
    return json({ ok: false, error: 'Tell me a little more about what is blocked.' }, 422);
  }

  // ── rate limit: 3 briefs per IP per hour ──
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  if (env.RATE_LIMIT) {
    const key = `brief:${ip}`;
    const count = Number((await env.RATE_LIMIT.get(key)) ?? 0);
    if (count >= 3) {
      return json(
        { ok: false, error: 'You have sent a few already. Email me directly instead.' },
        429
      );
    }
    await env.RATE_LIMIT.put(key, String(count + 1), { expirationTtl: 3600 });
  }

  const specifics = Object.entries(data.specifics ?? {})
    .filter(([, v]) => v?.trim())
    .map(([k, v]) => `<p><strong>${esc(k)}</strong><br>${esc(v).replace(/\n/g, '<br>')}</p>`)
    .join('');

  const body = `
    <h2>${esc(data.name || 'Someone')} sent a brief</h2>
    <p><strong>Email</strong> ${esc(email)}</p>
    <p><strong>Looking for</strong> ${esc(data.kind ?? '—')}</p>
    ${data.recommendation ? `<p><strong>Qualifier said</strong> ${esc(data.recommendation)}</p>` : ''}
    <hr>
    <p><strong>Product</strong> ${esc(data.product ?? '—')}</p>
    <p><strong>Team</strong> ${esc(data.team ?? '—')}</p>
    <hr>
    <p><strong>What is blocked</strong><br>${esc(blocked).replace(/\n/g, '<br>')}</p>
    ${specifics}
    <hr>
    <p style="color:#888;font-size:12px">IP ${esc(ip)} · ${new Date().toISOString()}</p>`;

  try {
    await send(env, env.MAIL_TO, `Brief — ${data.name || email}`, body, email);
  } catch (err) {
    // If the brief itself cannot be delivered, the sender must know.
    console.error('brief delivery failed', err);
    return json(
      { ok: false, error: 'Something broke on my end. Email hello@sgualda.com directly.' },
      502
    );
  }

  // Confirmation is best-effort: the brief already arrived, so a failure here
  // must not tell the sender their message was lost.
  try {
    await send(
      env,
      email,
      'Got your brief',
      `<p>Thanks — your brief arrived and I read every one myself.</p>
       <p>You will hear back within a day, with what fits, what it would involve and what it
       costs, or that none of it fits.</p>
       <p>— Sergio</p>`
    );
  } catch (err) {
    console.error('confirmation failed', err);
  }

  return json({ ok: true });
};

/** Anything other than POST. */
export const onRequest: PagesFunction<Env> = () =>
  json({ ok: false, error: 'Method not allowed.' }, 405);
