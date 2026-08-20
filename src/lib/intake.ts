/**
 * The project intake — the questions, the options, and the copy around them.
 *
 * Renamed from intake.ts on 2026-08-20, when the funnel stopped being
 * "work out which kind of engagement you want" and became "which of the three
 * services is this". What survived is the shape: one module of data, one form
 * engine that renders it, so adding a service does not mean touching the form.
 *
 * The specific questions per service are NOT here. They live in the service's
 * own content file, next to the copy that promises them, because a service
 * page and the questions it triggers going out of sync is the failure this
 * split prevents.
 */

/** [id, label, type, hint] — the tuple the form engine renders.
 *  `type` is 'input', 'textarea', or 'select|Option A|Option B|…'. */
export type Field = [string, string, string, string];

/**
 * The three services, plus the honest fourth option.
 *
 * "Something else" is not a catch-all for laziness — it is there because the
 * alternative is somebody with a real project picking the nearest wrong box,
 * which produces a brief I answer incorrectly.
 */
export const KIND: [string, string][] = [
  ['web-design', 'Design the site'],
  ['web-development', 'Build the site'],
  ['website-audit', 'Tell me what is wrong with the site I have'],
  ['unsure', 'Something else, or I am not sure yet'],
];

/** Slug → the label shown once it is chosen. */
export const KIND_LABEL: Record<string, string> = Object.fromEntries(KIND);

/**
 * Where the product is, which changes the answer more than the service does.
 *
 * An idea and a five-year-old site with traffic are different problems even
 * when the request is worded identically.
 */
export const STAGE: Field = [
  'stage',
  'Where is it right now?',
  'select|An idea, nothing built|A prototype or a first version|Live, early days|Live, with real usage|Live, and being rebuilt',
  '',
];

/**
 * Timing, in the words people actually use.
 *
 * "Just looking" is a real and welcome answer. Removing it does not make
 * anybody more urgent, it makes them lie, and then I plan around a date that
 * was never true.
 */
export const TIMING: Field = [
  'timing',
  'When would you want to start?',
  'select|As soon as possible|This month|In the next one to three months|Later than that|Just exploring for now',
  '',
];

/**
 * Ranges, never an open field.
 *
 * An open box asks somebody to name a number first, which is a negotiation
 * tactic dressed as a form field, and most people either leave it blank or
 * write "depends". A range is a question about which conversation we are in,
 * and it is answerable honestly in one click.
 *
 * "I do not know yet" stays. Plenty of good projects genuinely do not have a
 * figure yet, and forcing one produces a number nobody meant.
 */
export const BUDGET: Field = [
  'budget',
  'Rough budget',
  'select|Under €2,000|€2,000 – €5,000|€5,000 – €10,000|€10,000 – €25,000|More than €25,000|I do not know yet',
  'A range, so I can tell you early if we are not in the same conversation.',
];

/** The common blocks, in the order they are asked. */
export const ABOUT_YOU: Field[] = [
  ['name', 'Your name', 'input', ''],
  ['email', 'Email', 'input', ''],
  ['company', 'Company or project', 'input', ''],
  ['website', 'Website, if there is one', 'input', 'A link is worth more than a description.'],
];

export const EXTRA: Field = [
  'extra',
  'Anything else you would like me to know?',
  'textarea',
  'Optional. Constraints, history, the thing you have not told anyone.',
];

/**
 * The step titles, which double as the progress labels.
 *
 * Six, and the order is deliberate: what you need, then what it is, then what
 * is wrong, then the details, then money and time, then how to reach you.
 * Contact details last because asking for an email before anything has been
 * established is the single most common reason a form is abandoned on step one.
 */
export const STEPS = [
  'What you need',
  'The project',
  'What is in the way',
  'Specifics',
  'Time and budget',
  'Where I reply',
] as const;
