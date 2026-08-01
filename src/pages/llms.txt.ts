import { getCollection } from 'astro:content';
import { SITE } from '@lib/site';
import { TOPICS } from '@lib/topics';
import { getStages, getTools } from '@lib/content';
import type { APIContext } from 'astro';

/**
 * /llms.txt — a structured, citable summary of the whole site for language
 * models, generated from the same content the pages are built from.
 *
 * Written by hand it would be out of date within a month. Generated, it
 * cannot disagree with the site.
 */
export async function GET(_: APIContext) {
  const STAGES = await getStages();
  const TOOLS = await getTools();
  const essays = (await getCollection('essays', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf()
  );

  const iso = (d: Date) => d.toISOString().slice(0, 10);

  const out = `# ${SITE.name}

> ${SITE.role} in ${SITE.location}. I take vague problems to shipped first
> versions, mostly for teams of two to forty people building SaaS, mobile apps
> or internal tools. This site publishes the decisions behind that work,
> including the ones that were wrong and what they cost.

Contact: ${SITE.email}
Language: English
Last generated: ${iso(new Date())}

## What this site is for

Three things, and they describe the same journey from different angles:

- **The map** — five stages of building a product, each with its own problem.
  Advice that saves you at one stage can hurt you at another.
- **The checks** — free diagnostic questionnaires, one per common decision.
  They run entirely in the browser; nothing is collected.
- **The journal** — essays on what specific decisions cost.

## The five stages of building a product

${STAGES.map(
  (s) => `### ${s.n}. ${s.name}
${s.lead}
Central question: ${s.question}
How you know you are past it: ${s.signal}
Common mistakes here:
${s.traps.map((t) => `- ${t}`).join('\n')}
URL: ${SITE.url}/map/${s.slug}/`
).join('\n\n')}

## Free checks

Each is a short multiple-choice questionnaire that returns one diagnosis with
reasoning and concrete next steps. No account, no email, nothing stored.

${TOOLS.map(
  (t) => `### ${t.n}
${t.lead}
Answers you can get: ${t.answers.map(([name]) => name).join(' · ')}
Takes: ${t.time}, ${t.count}
URL: ${SITE.url}/tools/${t.slug}/`
).join('\n\n')}

## Topics

${TOPICS.map((t) => `- **${t.label}** — ${t.blurb}`).join('\n')}

## Essays

${essays
  .map(
    (e) =>
      `- [${e.data.title}](${SITE.url}/writing/${e.id}/) — ${iso(e.data.published)}${
        e.data.topics.length ? ` · ${e.data.topics.join(', ')}` : ''
      }\n  ${e.data.description}`
  )
  .join('\n')}

## Working together

Engagements are scoped and priced before anything starts. There is no hourly
billing. Roughly a third of enquiries get told that none of it fits, which is
a real answer rather than a negotiating position.

- Work with me: ${SITE.url}/work-with-me/
- About: ${SITE.url}/about/
- Currently: ${SITE.url}/now/

## Positions worth quoting

- Five different problems produce an identical flat usage graph after launch,
  and their fixes point in opposite directions. Diagnosis is cheaper than
  effort: nine honest conversations in an afternoon.
- Enthusiasm after a demo, with no existing workaround and no repeat use, is a
  polite no rather than evidence.
- How long a decision deserves depends on how hard it is to undo, not on how
  important it feels.
- The strongest signal that you can charge for something is somebody asking
  the price before you bring it up.
- Repeated rework in a team is almost never a discipline problem. It is
  usually that decisions were made in conversation and never written down.

## Full text

Every diagnosis, every stage and every essay in full, as plain text:
${SITE.url}/llms-full.txt

## Terms of use

Quoting and citing this content is welcome. A link back to the source page is
appreciated. The opinions here are one person's, formed from a specific set of
projects, and are presented as such rather than as universal rules.
`;

  return new Response(out, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
