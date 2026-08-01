/**
 * Content taxonomy.
 *
 * Deliberately mapped onto the five stages of the map, so the three content
 * systems on this site — essays, stages and free checks — describe the same
 * journey instead of three unrelated ones. That mapping is what turns a pile
 * of pages into topical authority.
 */
export type Topic = {
  slug: string;
  label: string;
  /** One line, used as the H1 subtitle and the meta description. */
  blurb: string;
  /** The stage of the map this belongs to, if any. */
  stage?: string;
  /** The free check that applies to this topic. */
  tool?: string;
};

export const TOPICS: Topic[] = [
  {
    slug: 'discovery',
    label: 'Discovery',
    blurb: 'Working out whether a problem is real before spending a quarter on it.',
    stage: 'worth-building',
    tool: 'is-user-feedback-real-or-just-polite',
  },
  {
    slug: 'scope',
    label: 'Scope',
    blurb: 'Deciding how much to build, and what to leave out of the first version.',
    stage: 'first-version',
    tool: 'is-this-feature-worth-building',
  },
  {
    slug: 'launch',
    label: 'Launch',
    blurb: 'What happens after you ship, and why the graph stays flat.',
    stage: 'nobody-came',
    tool: 'why-is-nobody-using-your-product',
  },
  {
    slug: 'measurement',
    label: 'Measurement',
    blurb: 'Telling a real signal from a number that only looks like one.',
    stage: 'nobody-came',
    tool: 'is-user-feedback-real-or-just-polite',
  },
  {
    slug: 'process',
    label: 'Process',
    blurb: 'How teams decide, and why the same work keeps coming back.',
    stage: 'make-it-repeatable',
    tool: 'why-your-team-keeps-redoing-the-same-work',
  },
  {
    slug: 'craft',
    label: 'Craft',
    blurb: 'The actual work of designing a product, and what it is not.',
  },
];

