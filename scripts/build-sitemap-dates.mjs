#!/usr/bin/env node
/**
 * Real `lastmod` dates in the sitemap.
 *
 * The sitemap integration runs before the content is available to it, so every
 * URL was getting the build date — which is technically true for a static site
 * and useless as a signal, because it says everything changed every time
 * anything did.
 *
 * This reads the actual `updated`/`published` from the frontmatter and writes
 * it back over the generated file. An essay revised in March now says March,
 * which is the only version of `lastmod` a crawler can do anything with.
 *
 * Runs after `astro build`.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const file = join(root, 'dist', 'sitemap-0.xml');
if (!existsSync(file)) {
  console.error('✗ No sitemap-0.xml. Run `npm run build` first.');
  process.exit(1);
}

/** `updated:` if present, otherwise `published:`. */
function dateOf(path) {
  const src = readFileSync(path, 'utf8');
  const grab = (k) => src.match(new RegExp(`^${k}:\\s*'?"?(\\d{4}-\\d{2}-\\d{2})`, 'm'))?.[1];
  const d = grab('updated') ?? grab('published');
  return d ? new Date(`${d}T00:00:00Z`).toISOString() : null;
}

const dates = new Map();
for (const [dir, prefix, ext] of [
  ['src/content/essays', '/writing/', '.md'],
  ['src/content/cases', '/case-studies/', '.md'],
]) {
  for (const f of readdirSync(join(root, dir))) {
    if (!f.endsWith(ext)) continue;
    const d = dateOf(join(root, dir, f));
    if (d) dates.set(`${prefix}${f.slice(0, -ext.length)}/`, d);
  }
}

// /now/ carries its own date and is the one page where staleness is the point.
const now = readFileSync(join(root, 'src/pages/now/index.astro'), 'utf8')
  .match(/UPDATED = new Date\('(\d{4}-\d{2}-\d{2})'\)/)?.[1];
if (now) dates.set('/now/', new Date(`${now}T00:00:00Z`).toISOString());

let xml = readFileSync(file, 'utf8');
let patched = 0;
xml = xml.replace(/<url>([\s\S]*?)<\/url>/g, (block) => {
  const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? '';
  const path = loc.replace(/^https?:\/\/[^/]+/, '');
  const d = dates.get(path);
  if (!d) return block;
  patched++;
  return block.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${d}</lastmod>`);
});

writeFileSync(file, xml);
console.log(`  ✓ sitemap: ${patched} real content dates, ${dates.size} known`);
