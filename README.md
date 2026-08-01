# sgualda.com

Personal site of Sergio Gualda, product designer in Barcelona.
Astro, static output, hosted on Hostinger.

- **Quality backlog:** [QUALITY.md](./QUALITY.md) — 78 tickets, the single source of truth for what is left
- **Waiting on Sergio:** [CONTENT.md](./CONTENT.md) — every remaining blocker that needs him, with the questions to answer
- **Live site:** https://sgualda.com (still WordPress until the cutover)

---

## Running it

```bash
npm install
npm run dev          # http://localhost:4321
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Build, generate OG images, generate `.htaccess` |
| `npm run preview` | Serve the built site |
| `npm run audit:urls` | Check every promised URL exists |
| `npm test` | 124 Playwright tests, Chromium and WebKit |
| `npx astro check` | TypeScript |

Run `npm run build && npm run audit:urls && npm test` before any deploy. CI does
it on every push, but the habit costs nothing.

---

## Publishing content

### An essay

Create `src/content/essays/your-slug.md`:

```markdown
---
title: 'What I got wrong about onboarding'
description: 'Between 70 and 160 characters. This is what shows in Google, so write it like a promise.'
published: 2026-08-14
topics: ['launch', 'craft']
draft: false
---

Your text. Standard markdown.
```

**The filename is the URL.** `your-slug.md` becomes `/writing/your-slug/`.
Renaming it later breaks a live link, so choose it once.

Topics come from [`src/lib/topics.ts`](./src/lib/topics.ts). They are not
decoration: they drive the topic hubs, the related essays, and the cross-links
to the map stage and the free check that apply. An essay with no topic is an
orphan.

Images go in `src/assets/essays/` and are referenced relatively:

```markdown
![Describe what the image shows](../../assets/essays/name.jpg)
```

Astro optimises them on build. **The alt text is not optional** — an empty one
fails accessibility and wastes image search.

### A case study

Same shape, in `src/content/cases/`. See the schema in
[`src/content.config.ts`](./src/content.config.ts).

### Everything else

Tool questions and outcomes live in `src/lib/tools.ts`. Map stages live in
`src/lib/stages.ts`. Both are TypeScript rather than markdown — see `#Q-093`
for why that should change and why it has not yet.

---

## The rules that are not obvious

**Trailing slashes are load-bearing.** `astro.config.mjs` sets
`trailingSlash: 'always'` and `format: 'directory'`. That is what makes the 19
URLs indexed on the old WordPress site keep working. Changing either turns
every one of them into a redirect.

**The URL contract is enforced.** [`src/lib/site.ts`](./src/lib/site.ts) lists
every URL the site promises. `scripts/check-urls.mjs` fails the build if one is
missing. Adding a page means adding it there.

**Structured data is generated, never written twice.** The `FAQPage` schema is
parsed from the rendered FAQ markup. `llms.txt` is generated from the same
collections the pages use. Nothing is maintained in parallel, because parallel
copies drift.

**Design tokens are the only place values live.**
[`src/styles/tokens.css`](./src/styles/tokens.css) holds every colour, size and
spacing. A literal hex or px in a component is a bug.

**Privacy claims are code claims.** `/privacy/` describes exactly what the site
does. If you add analytics, a cookie, or anything that collects, that page
changes in the same commit. It has already been wrong twice.

---

## Architecture

```
src/
  content/essays/     13 markdown essays, migrated from WordPress
  content/cases/      empty — see #Q-044
  lib/site.ts         identity, nav, URL contract, legal details
  lib/tools.ts        the six checks: questions and outcomes
  lib/stages.ts       the five stages of the map
  lib/topics.ts       taxonomy, mapped onto the stages
  layouts/Base.astro  head, SEO, JSON-LD, fonts
  pages/              one file per route
  styles/tokens.css   every design value
public/
  api/brief.php       the brief form endpoint
  api/log.php         JavaScript error reporting
  fonts/              self-hosted woff2 — no Google request
  _redirects          source of truth for redirects → .htaccess
scripts/
  check-urls.mjs      URL contract guard
  build-og.mjs        one Open Graph image per page
  build-htaccess.mjs  Apache config from _redirects
```

### Why Astro

GPTBot, ClaudeBot and PerplexityBot do not execute JavaScript. Anything
rendered client-side is invisible to them, and being readable by models is half
the point of this site. Astro ships real HTML and hydrates only the six
questionnaires.

---

## Deploying to Hostinger

**Once, before the first deploy:**

1. Upload `.env-brief.php` **one level above `public_html`**, never inside it.
   Copy the shape from [`.env-brief.example.php`](./.env-brief.example.php).
2. Confirm PHP 8.1+ in hPanel.

**Every deploy:**

```bash
npm run build && npm run audit:urls && npm test
# upload the contents of dist/ to public_html/
```

`dist/.htaccess` is generated and must be uploaded with everything else. It
carries the redirects, the security headers and the 404.

---

## Launch checklist

Content, all of it blocked on Sergio:

- [ ] Two case studies written — `#Q-044`
- [ ] Real photograph — `#Q-056`
- [ ] Three testimonials with names — `#Q-097`
- [ ] Project images, no grey placeholders — `#Q-013`
- [ ] Glintale described on `/now/` — `#Q-015`
- [ ] The five map anecdotes reviewed — `#Q-062`
- [ ] `SOCIAL` filled in — `src/lib/site.ts`

Legal and technical:

- [ ] Twenty minutes with a gestor about `/legal/`
- [ ] `LEGAL.trading` set once registered as self-employed
- [ ] Resend API key rotated and set in `.env-brief.php`
- [ ] A real brief submitted end to end on the live server
- [ ] Analytics decided — `#Q-007`

Cutover, in this order:

- [ ] Full WordPress export archived somewhere outside this project
- [ ] Site uploaded and verified on a staging subdomain
- [ ] Domain verified in Google Search Console **before** the DNS change
- [ ] DNS switched
- [ ] All 19 old URLs spot-checked live
- [ ] Sitemap submitted
- [ ] `/api/brief.php` tested from the real domain

---

## Licence

Code is Sergio's. The writing is his too — quoting with a link is welcome,
including by language models. See `/legal/`.
