#!/usr/bin/env node
/**
 * Build-time URL check.
 *
 * Asserts that every URL declared in src/lib/site.ts exists in ./dist as a real
 * index.html, and that public/_redirects only points at URLs that exist.
 *
 *   npm run build && npm run audit:urls
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');

if (!existsSync(dist)) {
  console.error('✗ No dist/. Run `npm run build` first.');
  process.exit(1);
}

/**
 * iCloud conflict copies.
 *
 * This project lives under ~/Documents, which macOS syncs. When two devices
 * touch the same file, iCloud keeps both and names the loser "file 2.ext".
 * 55 of them had accumulated in dist/ — duplicate fonts, duplicate PHP
 * endpoints, duplicate pages — and dist/ is gitignored, so nothing caught it.
 * They would have been uploaded to Hostinger verbatim, including a second copy
 * of the brief endpoint with an older config path.
 */
const conflicts = [];
for (const dir of ['dist', 'public', 'src', 'scripts'])
  for (const f of readdirSync(join(root, dir), { recursive: true }))
    if (typeof f === 'string' && / \d+\.\w+$/.test(f)) conflicts.push(`${dir}/${f}`);

if (conflicts.length) {
  console.error(`\n✗ ${conflicts.length} iCloud conflict copies would ship:`);
  for (const c of conflicts.slice(0, 8)) console.error(`    ${c}`);
  if (conflicts.length > 8) console.error(`    …and ${conflicts.length - 8} more`);
  console.error('  Remove them: find dist public src -name "* [0-9].*" -delete\n');
  process.exit(1);
}

const src = readFileSync(join(root, 'src/lib/site.ts'), 'utf8');
// Handles both single-line and multi-line arrays. The earlier version only
// matched multi-line ones and silently swallowed everything up to the next
// closing bracket.
const section = (name) => {
  const m = src.match(new RegExp(`${name}:\\s*\\[([^\\]]*)\\]`));
  return m ? [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]) : [];
};

const groups = {
  pages: section('pages'),
  tools: section('tools'),
  topics: section('topics'),
  writing: section('writing'),
};
const urls = Object.values(groups).flat();

// A guard that checks nothing must not report success.
if (urls.length === 0) {
  console.error('✗ Parsed 0 URLs from src/lib/site.ts. The guard is broken — fix it before trusting a green run.');
  process.exit(1);
}

// An image with no alt text is invisible to a screen reader and wasted in
// image search. Cheap to catch here, tedious to find later.
const essayDir = join(root, 'src/content/essays');
const noAlt = readdirSync(essayDir)
  .filter((f) => f.endsWith('.md'))
  .filter((f) => readFileSync(join(essayDir, f), 'utf8').includes('![]('));
if (noAlt.length) {
  console.error(`\n✗ Images with no alt text in: ${noAlt.join(', ')}`);
  process.exit(1);
}

// Spacing drift is invisible until there are forty values and no rhythm.
// Warns rather than fails: the existing literals are being folded in as each
// area is touched, not in one risky sweep.
const SCALE = [4, 8, 12, 16, 20, 26, 34, 44, 56, 72];
/**
 * The four breakpoints declared in tokens.css. Custom properties do not work
 * inside @media, so the only way to keep the set from drifting back to eight
 * ad-hoc values is to check it here. This one is fatal, not a warning: an
 * off-scale breakpoint is invisible until somebody opens the site at exactly
 * that width, which is the definition of a bug nobody finds.
 */
const BREAKPOINTS = [480, 560, 720, 820];

let offScale = 0;
const badBreakpoints = [];
const sources = [];
for (const dir of ['src/pages', 'src/components', 'src/styles'])
  for (const f of readdirSync(join(root, dir), { recursive: true }))
    if (typeof f === 'string' && /\.(astro|css)$/.test(f)) sources.push([dir, f]);

for (const [dir, f] of sources) {
  const css = readFileSync(join(root, dir, f), 'utf8');
  if (dir === 'src/pages')
    for (const m of css.matchAll(/(?:margin|padding|gap)(?:-\w+)?:\s*([^;{}]+)/g))
      for (const px of m[1].matchAll(/\b(\d+)px\b/g))
        if (+px[1] > 3 && !SCALE.includes(+px[1])) offScale++;
  for (const m of css.matchAll(/@media[^{]*?\(\s*(min|max)-width:\s*(\d+)px/g))
    if (!BREAKPOINTS.includes(+m[2])) badBreakpoints.push(`${f} → ${m[1]}-width: ${m[2]}px`);
}

const G = '\x1b[32m', R = '\x1b[31m', Y = '\x1b[33m', X = '\x1b[0m';
// Directory routes are dist/<path>/index.html; endpoints like /rss.xml are
// written as literal files.
const built = (u) => existsSync(join(dist, u, 'index.html')) || existsSync(join(dist, u));

let missing = 0;
console.log(`\n  ${urls.length} URLs declared\n`);
if (offScale) console.log(`  \x1b[33m·\x1b[0m ${offScale} spacing values off the scale (see --space-* in tokens.css)\n`);
for (const [name, list] of Object.entries(groups)) {
  if (!list.length) continue;
  console.log(`  ${name}`);
  for (const u of list) {
    const ok = built(u);
    if (!ok) missing++;
    console.log(`    ${ok ? G + '✓' : R + '·'}${X} ${u}`);
  }
  console.log('');
}

// Redirect targets must resolve, or we 301 people into a 404.
const rPath = join(root, 'public/_redirects');
let badTargets = 0;
if (existsSync(rPath)) {
  const rules = readFileSync(rPath, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => l.split(/\s+/));

  const bad = rules.filter(([from, to]) => to?.startsWith('/') && !built(to) && !urls.includes(to));
  badTargets = bad.length;
  console.log(`  ${rules.length} redirects`);
  for (const [from, to] of bad) console.log(`    ${Y}!${X} ${from} → ${to} (target not built)`);
  if (!bad.length) console.log(`    ${G}✓${X} every target resolves`);
  console.log('');
}

// Publishing a legal notice with placeholder identification is worse than
// not publishing one at all. Loud, every single build.
// /privacy/ states, in writing, that there is no analytics and no cookies.
// If that stops being true the page has to change in the same commit.
const privacy = readFileSync(join(root, 'src/pages/privacy/index.astro'), 'utf8');
const analytics = readdirSync(join(root, 'src'), { recursive: true })
  .filter((f) => typeof f === 'string' && /\.(astro|ts)$/.test(f))
  .some((f) => /googletagmanager|plausible\.io|umami|gtag\(/.test(readFileSync(join(root, 'src', f), 'utf8')));
if (analytics && /No analytics\. No cookies\./.test(privacy)) {
  console.error('\n✗ Analytics is installed but /privacy/ still claims there is none (#Q-103)');
  process.exit(1);
}

if (badBreakpoints.length) {
  console.error(`\n✗ ${badBreakpoints.length} breakpoint(s) off the scale ${BREAKPOINTS.join('/')} (#Q-054)`);
  for (const b of badBreakpoints) console.error(`    ${b}`);
  console.error('  Round up to the next value, or change the scale in tokens.css and here.\n');
  process.exit(1);
}

if (/trading: true/.test(src) && /nif: ''/.test(src)) {
  console.log(`  ${Y}!${X} LEGAL.trading is on but the NIF is empty — /legal/ would be incomplete (#Q-104)`);
  console.log('');
}

if (missing) {
  console.log(`  ${urls.length - missing}/${urls.length} pages built. ${missing} to go.\n`);
} else if (badTargets) {
  console.error(`  ✗ ${badTargets} redirect(s) point nowhere.\n`);
  process.exit(1);
} else {
  console.log(`  ${G}✓ All ${urls.length} URLs built and every redirect resolves.${X}\n`);
}
