import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Ordered accessors for the two data collections.
 *
 * Both used to be TypeScript modules. Reading them through here means a page
 * never has to know they became YAML, and the ordering rule lives in one place
 * instead of being repeated by every caller.
 */

/** Checks, in the order they appear on /tools/. */
export async function getTools() {
  const tools = await getCollection('tools');
  return tools
    .map((t) => ({ slug: t.id, ...t.data }))
    .sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug));
}

const ORDER = [
  'why-is-nobody-using-your-product',
  'is-user-feedback-real-or-just-polite',
  'is-this-feature-worth-building',
  'should-you-decide-now-or-think-longer',
  'can-you-charge-for-your-product-yet',
  'why-your-team-keeps-redoing-the-same-work',
];

/** Stages, in map order, which is the order of the numbers on them. */
export async function getStages() {
  const stages = await getCollection('stages');
  return stages.map((s) => ({ slug: s.id, ...s.data })).sort((a, b) => a.n.localeCompare(b.n));
}

export type Tool = Awaited<ReturnType<typeof getTools>>[number];
export type Stage = Awaited<ReturnType<typeof getStages>>[number];

export const CATS: Record<string, string> = {
  growth: 'Launch & growth',
  users: 'Users & feedback',
  decisions: 'Decisions',
  team: 'Team & process',
};
