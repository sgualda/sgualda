import { writeFileSync, mkdirSync } from 'node:fs';
import { stringify } from 'yaml';
import { TOOLS } from '../src/lib/tools.ts';
import { STAGES } from '../src/lib/stages.ts';

const opts = { lineWidth: 92, defaultStringType: 'QUOTE_DOUBLE', defaultKeyType: 'PLAIN' };

mkdirSync('src/content/tools', { recursive: true });
for (const t of TOOLS) {
  const { slug, id, ...rest } = t;
  writeFileSync(
    `src/content/tools/${slug}.yaml`,
    `# ${t.n}\n# Questions, outcomes and FAQs for one free check.\n\n` + stringify(rest, opts)
  );
}

mkdirSync('src/content/stages', { recursive: true });
for (const s of STAGES) {
  const { slug, ...rest } = s;
  writeFileSync(
    `src/content/stages/${slug}.yaml`,
    `# Stage ${s.n} — ${s.name}\n\n` + stringify(rest, opts)
  );
}
console.log(`${TOOLS.length} tools + ${STAGES.length} stages`);
