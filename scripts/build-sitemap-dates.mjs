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
import { execFileSync } from 'node:child_process';
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

/**
 * For every other page: the date of the last commit that touched its source.
 *
 * The 22 URLs without frontmatter — the hubs, /about/, /tools/*, /map/* — kept
 * whatever the sitemap integration wrote, which is the build instant with
 * milliseconds. Two builds three seconds apart produced two different sitemaps,
 * and every one of those URLs claimed to have changed both times.
 *
 * That is worse than it sounds. Google's documented behaviour is to stop
 * trusting `lastmod` across the whole site once it finds the value unreliable,
 * so 22 lying URLs were devaluing the 14 honest ones. Git already knows when
 * each page really changed, and it is the same answer a human would give.
 */
const gitDate = (rel) => {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', rel], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return out ? new Date(out).toISOString() : null;
  } catch {
    return null; // Sin git, o fichero sin historial.
  }
};

/** `/tools/x/` → the page or content file that produces it. */
const sourceFor = (path) => {
  const clean = path.replace(/^\/|\/$/g, '');
  return [
    `src/pages/${clean || 'index'}/index.astro`,
    `src/pages/${clean || 'index'}.astro`,
    `src/content/tools/${clean.replace('tools/', '')}.yaml`,
    // /map/ is served from the "stages" collection, not a "map" one. Naming
    // the wrong folder here is silent: the file simply is not found and the
    // URL loses its date, which is how the five stage pages ended up without
    // one on the first run.
    `src/content/stages/${clean.replace('map/', '')}.yaml`,
    `src/content/stages/${clean.replace('map/', '')}.md`,
  ].find((p) => existsSync(join(root, p)));
};

let xml = readFileSync(file, 'utf8');
let patched = 0;
let fromGit = 0;
let dropped = 0;
xml = xml.replace(/<url>([\s\S]*?)<\/url>/g, (block) => {
  const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? '';
  const path = loc.replace(/^https?:\/\/[^/]+/, '');

  let d = dates.get(path);
  if (d) {
    patched++;
  } else {
    const src = sourceFor(path);
    d = src ? gitDate(src) : null;
    if (d) fromGit++;
  }

  // No date we can stand behind: drop the element rather than invent one.
  // An absent lastmod costs nothing; a wrong one costs the whole file's
  // credibility.
  if (!d) {
    dropped++;
    return block.replace(/\s*<lastmod>[^<]*<\/lastmod>/, '');
  }
  return block.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${d}</lastmod>`);
});

writeFileSync(file, xml);

/**
 * sitemap-index.xml carries its own build-time lastmod, with the same problem.
 * It becomes the newest date in the sitemap it points at, which is what the
 * field is supposed to mean.
 */
const indexFile = join(root, 'dist', 'sitemap-index.xml');
if (existsSync(indexFile)) {
  const newest = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)]
    .map((m) => m[1])
    .sort()
    .pop();
  if (newest) {
    writeFileSync(
      indexFile,
      readFileSync(indexFile, 'utf8').replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${newest}</lastmod>`)
    );
  }
}

console.log(
  `  ✓ sitemap: ${patched} from frontmatter, ${fromGit} from git history, ${dropped} without a date`
);
