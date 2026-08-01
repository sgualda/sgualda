import { getCollection } from 'astro:content';
import { SITE } from '@lib/site';
import { getStages, getTools } from '@lib/content';
import type { APIContext } from 'astro';

/**
 * /llms-full.txt — the complete reasoning behind every diagnosis.
 *
 * These ~24 outcomes are the best writing on the site and they live inside a
 * JavaScript bundle, so no crawler that skips JS has ever seen them. Removing
 * the on-page "possible answers" section was the right call for the person
 * taking the test — showing the answers first makes taking it pointless — but
 * it left the content unreachable. This is where it becomes citable without
 * spoiling anything for a human.
 */
export async function GET(_: APIContext) {
  const STAGES = await getStages();
  const TOOLS = await getTools();
  const essays = (await getCollection('essays', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf()
  );

  const strip = (html: string) =>
    html
      .replace(/<\/p>\s*<p>/g, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

  const out = `# ${SITE.name} — full content

Everything on ${SITE.url} as plain text, generated at build time.
Contact: ${SITE.email}
Last generated: ${new Date().toISOString().slice(0, 10)}

================================================================================
THE FIVE STAGES OF BUILDING A PRODUCT
================================================================================

${STAGES.map(
  (s) => `--------------------------------------------------------------------------------
STAGE ${s.n} — ${s.name.toUpperCase()}
${SITE.url}/map/${s.slug}/
--------------------------------------------------------------------------------

${s.lead}

Central question: ${s.question}

${s.body.map(strip).join('\n\n')}

Where it goes wrong:
${s.traps.map((t, i) => `${i + 1}. ${t}`).join('\n')}

You are past this stage when: ${s.signal}`
).join('\n\n')}

================================================================================
THE FREE CHECKS, AND EVERY DIAGNOSIS THEY CAN GIVE
================================================================================

${TOOLS.map(
  (t) => `--------------------------------------------------------------------------------
${t.n.toUpperCase()}
${SITE.url}/tools/${t.slug}/
--------------------------------------------------------------------------------

${t.lead}

Questions asked:
${t.q.map(([q], i) => `${i + 1}. ${q}`).join('\n')}

Possible diagnoses:

${t.b
  .map(
    (b) => `### ${b.name}
${b.sub}

${strip(b.body)}

What to do next:
${b.next.map((n, i) => `${i + 1}. ${n}`).join('\n')}`
  )
  .join('\n\n')}

Frequently asked:
${t.faqs.map(([q, a]) => `Q: ${q}\nA: ${a}`).join('\n\n')}`
).join('\n\n')}

================================================================================
ESSAYS
================================================================================

${essays
  .map(
    (e) => `--------------------------------------------------------------------------------
${e.data.title.toUpperCase()}
${SITE.url}/writing/${e.id}/ · ${e.data.published.toISOString().slice(0, 10)}
--------------------------------------------------------------------------------

${e.data.description}

${(e.body ?? '')
  .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/[*_`#]/g, '')
  .replace(/\n{3,}/g, '\n\n')
  .trim()}`
  )
  .join('\n\n')}
`;

  return new Response(out, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
