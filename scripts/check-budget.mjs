#!/usr/bin/env node
/**
 * Performance budget.
 *
 * The site is fast today because it was built that way, not because anything
 * enforces it. One video, one analytics tag or one component library added
 * without thinking would pass review and nobody would notice for months.
 *
 * Budgets are per page, measured on the built output.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
if (!existsSync(dist)) {
  console.error('✗ No dist/. Run `npm run build` first.');
  process.exit(1);
}

const BUDGET = {
  js: 40 * 1024,      // per page, uncompressed
  css: 40 * 1024,
  html: 120 * 1024,
  fonts: 140 * 1024,  // total, all pages share them
};

const size = (p) => (existsSync(p) ? statSync(p).size : 0);
const walk = (dir, out = []) => {
  for (const f of readdirSync(dir)) {
    const full = join(dir, f);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (f === 'index.html') out.push(full);
  }
  return out;
};

const G = '\x1b[32m', R = '\x1b[31m', Y = '\x1b[33m', X = '\x1b[0m';
let worst = { js: 0, css: 0, html: 0 };
const over = [];

for (const file of walk(dist)) {
  const html = readFileSync(file, 'utf8');
  const url = '/' + file.slice(dist.length + 1).replace(/index\.html$/, '');

  const assets = (re) => [...html.matchAll(re)].map((m) => join(dist, m[1]));
  const js = assets(/<script[^>]+src="(\/_astro\/[^"]+)"/g).reduce((n, p) => n + size(p), 0);
  const css = assets(/<link[^>]+href="(\/_astro\/[^"]+\.css)"/g).reduce((n, p) => n + size(p), 0);
  const bytes = Buffer.byteLength(html);

  worst.js = Math.max(worst.js, js);
  worst.css = Math.max(worst.css, css);
  worst.html = Math.max(worst.html, bytes);

  if (js > BUDGET.js) over.push([url, 'JS', js, BUDGET.js]);
  if (css > BUDGET.css) over.push([url, 'CSS', css, BUDGET.css]);
  if (bytes > BUDGET.html) over.push([url, 'HTML', bytes, BUDGET.html]);
}

const fonts = existsSync(join(dist, 'fonts'))
  ? readdirSync(join(dist, 'fonts')).reduce((n, f) => n + size(join(dist, 'fonts', f)), 0)
  : 0;
if (fonts > BUDGET.fonts) over.push(['/fonts/', 'FONTS', fonts, BUDGET.fonts]);

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const row = (label, value, budget) => {
  const ok = value <= budget;
  console.log(`  ${ok ? G + '✓' : R + '✗'}${X} ${label.padEnd(22)} ${kb(value).padStart(9)}  of ${kb(budget)}`);
};

console.log('\n  Performance budget — worst page\n');
row('JavaScript', worst.js, BUDGET.js);
row('CSS', worst.css, BUDGET.css);
row('HTML', worst.html, BUDGET.html);
row('Fonts (total)', fonts, BUDGET.fonts);
console.log('');

if (over.length) {
  for (const [url, kind, value, budget] of over)
    console.error(`  ${R}✗${X} ${url} ${kind} ${kb(value)} over the ${kb(budget)} budget`);
  console.error('');
  process.exit(1);
}
console.log(`  ${G}✓ Every page is within budget.${X}\n`);
