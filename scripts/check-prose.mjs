#!/usr/bin/env node
/**
 * The mechanically checkable half of BRAND.md.
 *
 * The voice guide ended with "enforced by reading it before committing", which
 * is a weaker mechanism than a test and was immediately proved so: a regex pass
 * applying the contraction rule produced "when I'd a hard design problem" and
 * shipped it, plus the same break in a case study description — the text Google
 * shows under the title.
 *
 * Only rules with no judgement in them live here. Tone is not checkable and is
 * not attempted.
 *
 *   npm run audit:prose
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const G = '\x1b[32m', R = '\x1b[31m', X = '\x1b[0m';

/**
 * Determiners. `I’ve`/`I’d` are auxiliaries and must be followed by a verb, so
 * an article or possessive straight after one means a main verb was eaten:
 * "I had a problem" became "I’d a problem". Listing what is wrong is far more
 * reliable than trying to list every participle that is right.
 */
const DETERMINER = String.raw`a|an|the|my|your|his|her|their|our|its|this|that|these|those|no|some|any|one|two|three|four|five|six|seven|eight|nine|ten|most|both|each|every`;

const RULES = [
  {
    id: 'negation contracted',
    // BRAND.md: contract everything except a negation.
    rx: /\b(is|are|was|were|do|does|did|will|would|could|should|has|have|had|ca|wo)n’t\b/gi,
    say: 'write the negation out in full (BRAND.md)',
  },
  {
    id: 'auxiliary swallowed a verb',
    // "I’d a hard problem" — the contraction expanded a main verb, not an auxiliary.
    rx: new RegExp(String.raw`\bI’(?:d|ve)\s+(?:${DETERMINER})\b`, 'g'),
    say: 'I’d / I’ve only contract an auxiliary — "I had a problem", not "I’d a problem"',
  },
  {
    id: 'clause-final contraction',
    // "find out what it’s, not to defend" — the verb ends the clause.
    rx: /\b(?:it|that|there|he|she|who|you|they|we)’(?:s|re)(?=\s*[,.;:!?]|\s+(?:to|and|or|than)\b)/g,
    say: 'a verb that ends its clause cannot contract',
  },
  {
    id: 'straight apostrophe',
    rx: /(?<=[A-Za-z])'(?=[A-Za-z])/g,
    say: 'use the curly apostrophe ’',
  },
  {
    id: 'exclamation mark',
    rx: /[a-z]!(?:\s|$)/g,
    say: 'the site has none in its own voice (BRAND.md)',
  },
];

/** Prose only — not code, not comments, not URLs. */
const FILES = [];
for (const dir of ['src/content', 'src/pages', 'src/lib'])
  for (const f of readdirSync(join(root, dir), { recursive: true }))
    if (typeof f === 'string' && /\.(md|yaml|astro|ts)$/.test(f)) FILES.push(join(dir, f));

const findings = [];
for (const f of FILES) {
  const lines = readFileSync(join(root, f), 'utf8').split('\n');
  /**
   * Block comments are tracked across lines, not matched per line.
   *
   * The skip list caught lines opening with `//`, `*` or `/*`, but Astro's
   * comments open with `{/*` and run for paragraphs, and every line after the
   * first starts with ordinary prose. So a comment explaining why some copy was
   * written a certain way was itself checked as copy — the rule fired on
   * "Sergio's wording" inside a note nobody will ever read on the page.
   *
   * These rules are about what a reader sees. A comment is not that.
   */
  let inBlock = false;
  lines.forEach((line, i) => {
    const t = line.trim();

    const opens = /\{?\/\*/.test(t);
    const closes = /\*\/\}?/.test(t);
    if (inBlock) {
      if (closes) inBlock = false;
      return;
    }
    if (opens && !closes) {
      inBlock = true;
      return;
    }
    if (opens) return; // opened and closed on one line

    // Skip code, imports, URLs and quoted product copy — a quotation of
    // somebody else's interface is not the site speaking.
    if (/^(\/\/|\*|import |export |const |let |#|<)/.test(t)) return;
    if (/https?:\/\//.test(line) || /\breads\b.*!/.test(line)) return;
    for (const rule of RULES)
      for (const m of line.matchAll(rule.rx))
        findings.push({ f, line: i + 1, id: rule.id, hit: m[0].trim(), say: rule.say });
  });
}

/**
 * CTA vocabulary.
 *
 * Six labels had accumulated for /work-with-me/ — "Hire me", "Work with me",
 * "See if I can help", "Book a call", "Book an intro call", "Four questions" —
 * each one correct on the day it was written and collectively meaning the
 * visitor never learns what the primary action is called. Repetition is the
 * only advantage a CTA has on a small site.
 *
 * Two labels per destination: one for the site chrome, one for the end of a
 * page. Inline links inside a sentence are exempt — they are prose, not
 * controls, and they read from a `.btn` class or an `arrow-link`.
 */
const CTA_MAX = 2;
const ctas = {};
for (const f of readdirSync(join(root, 'dist'), { recursive: true })) {
  if (typeof f !== 'string' || !f.endsWith('index.html')) continue;
  const html = readFileSync(join(root, 'dist', f), 'utf8');
  for (const m of html.matchAll(/<a[^>]*class="[^"]*\bbtn\b[^"]*"[^>]*href="(\/[^"#]*)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const label = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (label) (ctas[m[1]] ??= new Set()).add(label);
  }
  for (const m of html.matchAll(/<a[^>]*href="(\/[^"#]*)"[^>]*class="[^"]*\bbtn\b[^"]*"[^>]*>([\s\S]*?)<\/a>/g)) {
    const label = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (label) (ctas[m[1]] ??= new Set()).add(label);
  }
}
const drifted = Object.entries(ctas).filter(([, set]) => set.size > CTA_MAX);
if (drifted.length) {
  console.error(`\n  ${R}✗ CTA labels have drifted${X}\n`);
  for (const [href, set] of drifted)
    console.error(`  ${href} has ${set.size} labels: ${[...set].map((l) => `«${l}»`).join(', ')}`);
  console.error(`\n  Two per destination. Pick one for the chrome and one for the end of a page.\n`);
  process.exit(1);
}

if (!findings.length) {
  console.log(`\n  ${G}✓ Prose follows BRAND.md${X} — ${FILES.length} files checked\n`);
  process.exit(0);
}

console.error(`\n  ${R}✗ ${findings.length} prose issues${X}\n`);
const byRule = {};
for (const x of findings) (byRule[x.id] ??= []).push(x);
for (const [id, list] of Object.entries(byRule)) {
  console.error(`  ${id} — ${list[0].say}`);
  for (const x of list.slice(0, 6)) console.error(`    ${x.f}:${x.line}  «${x.hit}»`);
  if (list.length > 6) console.error(`    …and ${list.length - 6} more`);
  console.error('');
}
process.exit(1);
