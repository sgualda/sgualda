#!/usr/bin/env node
/**
 * Keeps QUALITY.md honest about itself.
 *
 * The backlog had drifted into three disagreeing status mechanisms: a ✅ in the
 * ticket heading, ticked acceptance criteria inside the ticket, and a checklist
 * at the end of the file. They said 37, 6 and 6. A tracking document that
 * cannot state its own progress is worse than no tracking document, because it
 * still gets quoted.
 *
 * One source of truth from here on: the ✅ in the `## #Q-NNN` heading. This
 * script rebuilds the closing checklist and the progress line from it, and
 * moves any resolution note that ended up in the wrong place — an earlier
 * substitution dropped several of them between `### Severidad` and its value.
 *
 *   node scripts/sync-quality.mjs         check, exit 1 if out of date
 *   node scripts/sync-quality.mjs --fix   rewrite the file
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const file = join(dirname(fileURLToPath(import.meta.url)), '..', 'QUALITY.md');
const fix = process.argv.includes('--fix');
let md = readFileSync(file, 'utf8');
const before = md;

// ── 1 · every resolution note belongs directly under its heading ──
// Split on the headings first. A regex spanning from one heading to a note
// cannot see ticket boundaries, so it happily pairs ticket N's heading with
// ticket N+1's note and walks every note one ticket up the file on each run.
// Operating inside a single ticket at a time makes that impossible.
const NOTE = /^> [✅⛔] \*\*(?:Resuelto|Descartado)[^\n]*$/m;
md = md
  .split(/\n(?=## #Q-\d+)/)
  .map((block) => {
    if (!/^## #Q-\d+/.test(block)) return block;
    const note = block.match(NOTE);
    if (!note) return block;
    const head = block.slice(0, block.indexOf('\n'));
    const body = block.slice(block.indexOf('\n') + 1).replace(NOTE, '');
    return `${head}\n\n${note[0]}\n${body.replace(/^\n+/, '\n')}`.replace(/\n{3,}/g, '\n\n');
  })
  .join('\n');

// ── 2 · read the truth ──
// A ticket is settled either way: ✅ done, or ⛔ deliberately dropped. Both are
// decisions; only an unmarked heading is still open.
const tickets = [...md.matchAll(/^## #Q-(\d+)(?: (✅ Resuelto|⛔ Descartado))? — (.+)$/gm)].map((m) => ({
  id: m[1],
  done: !!m[2],
  dropped: m[2] === '⛔ Descartado',
  title: m[3],
}));
if (tickets.length < 100) {
  console.error(`✗ Only parsed ${tickets.length} tickets — the heading format changed.`);
  process.exit(1);
}
const done = tickets.filter((t) => t.done);

// ── 3 · rebuild the closing checklist, keeping its section headings ──
md = md.replace(/^(### .+\n)((?:- \[[ x]\] #Q-\d+(?: · )?)+)$/gm, (_, heading, list) => {
  const ids = [...list.matchAll(/#Q-(\d+)/g)].map((m) => m[1]);
  const rebuilt = ids
    .map((id) => `- [${tickets.find((t) => t.id === id)?.done ? 'x' : ' '}] #Q-${id}`)
    .join(' · ');
  return `${heading}${rebuilt}`;
});

// ── 4 · the progress line, generated so it cannot be stale ──
const dropped = done.filter((t) => t.dropped).length;
const pct = Math.round((done.length / tickets.length) * 100);
const line =
  `> **Progreso — ${done.length} de ${tickets.length} tickets resueltos (${pct}%)` +
  `${dropped ? `, ${dropped} de ellos descartados a propósito` : ''}.** ` +
  'Generado por `scripts/sync-quality.mjs`; no editar a mano.';
md = /^> \*\*Progreso —.*$/m.test(md)
  ? md.replace(/^> \*\*Progreso —.*$/m, line)
  : md.replace(/^(## Resumen Ejecutivo\n)/m, `${line}\n\n$1`);

if (md === before) {
  console.log(`  ✓ QUALITY.md in sync — ${done.length}/${tickets.length} closed (${pct}%)`);
  process.exit(0);
}
if (!fix) {
  console.error('\n✗ QUALITY.md is out of sync with its own ticket headings.');
  console.error('  Run: node scripts/sync-quality.mjs --fix\n');
  process.exit(1);
}
writeFileSync(file, md);
console.log(`  ✓ QUALITY.md rewritten — ${done.length}/${tickets.length} closed (${pct}%)`);
