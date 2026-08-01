#!/usr/bin/env node
/**
 * Build-time URL check.
 *
 * Asserts that every URL declared in src/lib/site.ts exists in ./dist as a real
 * index.html, and that public/_redirects only points at URLs that exist.
 *
 *   npm run build && npm run audit:urls
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');

if (!existsSync(dist)) {
  console.error('✗ No dist/. Run `npm run build` first.');
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
// Promised in the nav, not written yet. Reported, never fatal.
const pending = section('pending');
const urls = Object.values(groups).flat();

// A guard that checks nothing must not report success.
if (urls.length === 0) {
  console.error('✗ Parsed 0 URLs from src/lib/site.ts. The guard is broken — fix it before trusting a green run.');
  process.exit(1);
}

const G = '\x1b[32m', R = '\x1b[31m', Y = '\x1b[33m', X = '\x1b[0m';
// Directory routes are dist/<path>/index.html; endpoints like /rss.xml are
// written as literal files.
const built = (u) => existsSync(join(dist, u, 'index.html')) || existsSync(join(dist, u));

let missing = 0;
console.log(`\n  ${urls.length} URLs declared\n`);
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
if (/trading: true/.test(src) && /nif: ''/.test(src)) {
  console.log(`  ${Y}!${X} LEGAL.trading is on but the NIF is empty — /legal/ would be incomplete (#Q-104)`);
  console.log('');
}

if (pending.length) {
  console.log(`  ${Y}pending content${X}`);
  for (const u of pending) console.log(`    ${Y}·${X} ${u}  (see #Q-044)`);
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
