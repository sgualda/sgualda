/**
 * The collaborate form — the questions and the copy around them.
 *
 * It has been three things in three days: a four-question qualifier that
 * recommended a shape of engagement, a six-step intake branching by service,
 * and now this. Sergio's call, and the right one: the site is not a shop, and
 * a form that interrogates somebody before they have met you is a shop's
 * instinct.
 *
 * Four questions, one screen, no steps. Enough to know whether there is
 * something here and to reply properly; everything else is what the reply is
 * for.
 */

/** [id, label, type, hint] — `type` is 'input', 'textarea', or 'select|A|B'. */
export type Field = [string, string, string, string];

export const FIELDS: Field[] = [
  ['name', 'Your name', 'input', ''],
  ['email', 'Email', 'input', ''],
  [
    'about',
    'What are you working on?',
    'textarea',
    'A link is worth more than a description. Do not polish it.',
  ],
  [
    'help',
    'Where do I come in?',
    'textarea',
    'However roughly. “I do not know yet” is a real answer.',
  ],
];

/**
 * Budget, as ranges, and optional.
 *
 * It is the one question that used to sit behind five other screens, and it is
 * the only one that decides early whether there is a conversation. An open box
 * asks somebody to name a number first, which is a negotiating move dressed as
 * a form field. A range is answerable in one click and honest.
 */
export const BUDGET: Field = [
  'budget',
  'Rough budget, if you have one',
  'select|Not sure yet|Under €2,000|€2,000 – €5,000|€5,000 – €10,000|€10,000 – €25,000|More than €25,000',
  '',
];
