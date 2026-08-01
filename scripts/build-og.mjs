#!/usr/bin/env node
/**
 * Generates one Open Graph image per page, at build time, into dist/og/.
 *
 * Every shared link becomes a small ad instead of a blank card. Titles are
 * read from the built HTML, so an image can never describe the wrong page.
 *
 * Rendered as SVG then rasterised with sharp, which is already a dependency.
 * Type is Helvetica rather than Zalando Sans Expanded because the SVG
 * rasteriser only reaches system fonts — the layout is built to look
 * deliberate in it rather than like a failed substitution.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const outDir = join(dist, 'og');

if (!existsSync(dist)) {
  console.error('✗ No dist/. Run `astro build` first.');
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

const W = 1200;
const H = 630;
const INK = '#1e1c1c';
const PAPER = '#ffffff';
const DIM = '#8f8d8a';

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Greedy wrap by estimated advance width — good enough at this size. */
function wrap(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > maxChars && line) {
      lines.push(line.trim());
      line = w;
    } else {
      line = (line + ' ' + w).trim();
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function svg(title, eyebrow) {
  const size = title.length > 46 ? 62 : title.length > 30 ? 74 : 86;
  const lines = wrap(title, title.length > 46 ? 30 : 24);
  const lh = size * 1.14;
  const blockTop = H / 2 - ((lines.length - 1) * lh) / 2 - 10;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  <rect x="0" y="0" width="${W}" height="10" fill="${INK}"/>
  <text x="80" y="96" font-family="Helvetica,Arial,sans-serif" font-size="20"
        letter-spacing="4" fill="${DIM}">${esc(eyebrow.toUpperCase())}</text>
  ${lines
    .map(
      (l, i) =>
        `<text x="80" y="${blockTop + i * lh}" font-family="Helvetica,Arial,sans-serif"
        font-size="${size}" font-weight="700" letter-spacing="-3" fill="${INK}">${esc(l)}</text>`
    )
    .join('\n  ')}
  <circle cx="98" cy="${H - 82}" r="18" fill="${INK}"/>
  <text x="98" y="${H - 75}" font-family="Helvetica,Arial,sans-serif" font-size="15"
        font-weight="700" fill="${PAPER}" text-anchor="middle">SG</text>
  <text x="130" y="${H - 76}" font-family="Helvetica,Arial,sans-serif" font-size="22"
        fill="${INK}">Sergio Gualda</text>
  <text x="${W - 80}" y="${H - 76}" font-family="Helvetica,Arial,sans-serif" font-size="20"
        fill="${DIM}" text-anchor="end">sgualda.com</text>
</svg>`;
}

/** Every built page, as a site path. */
function pages(dir = dist, found = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (['_astro', 'og', 'fonts', 'img', 'api'].includes(name)) continue;
      pages(full, found);
    } else if (name === 'index.html') {
      found.push(full);
    }
  }
  return found;
}

/** Section label from the URL, so the card says where it lives. */
const eyebrowFor = (url) => {
  if (url === '/') return 'Product designer, Barcelona';
  const first = url.split('/').filter(Boolean)[0];
  return { tools: 'Free check', writing: 'Journal', map: 'The map', 'case-studies': 'Work' }[first] ?? 'sgualda.com';
};

let n = 0;
const jobs = [];

for (const file of pages()) {
  const html = readFileSync(file, 'utf8');
  const url = '/' + relative(dist, file).replace(/index\.html$/, '');
  const raw = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? html.match(/<title>([^<]*)</)?.[1] ?? '';
  const title = raw
    .replace(/<br[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!title) continue;

  const slug = url === '/' ? 'home' : url.replace(/^\/|\/$/g, '').replace(/\//g, '-');
  jobs.push(
    sharp(Buffer.from(svg(title, eyebrowFor(url))))
      .png({ compressionLevel: 9 })
      .toFile(join(outDir, `${slug}.png`))
      .then(() => n++)
  );
}

// The fallback every page falls back to.
jobs.push(
  sharp(Buffer.from(svg('I help teams skip the expensive mistakes', 'Product designer, Barcelona')))
    .png({ compressionLevel: 9 })
    .toFile(join(dist, 'og-default.png'))
);

await Promise.all(jobs);
console.log(`  ✓ ${n} Open Graph images + og-default.png`);
