/**
 * Single source of truth for identity, navigation and the URL contract.
 *
 * URL map derived from the live sitemap of sgualda.com on 2026-07-31, then
 * rearchitected on 2026-08-20. Anything that was already indexed keeps working
 * — via this file where the URL survived, via public/_redirects where it did
 * not.
 */

export const SITE = {
  url: 'https://sgualda.com',
  name: 'Sergio Gualda',
  /**
   * The handle, not a second name.
   *
   * The site said "Sergio Gualda" everywhere and the brief was signed
   * "Sgualda", which is two strings for one person — the exact ambiguity that
   * stops an engine merging a set of pages into one entity. The person is
   * Sergio Gualda; sgualda is what he is called on every platform. It ships as
   * `alternateName` so both resolve to the same node instead of competing.
   */
  handle: 'sgualda',
  /**
   * Designer *and* developer, as of 2026-08-20.
   *
   * Everything here used to say "Product Designer", and web development is now
   * one of three things being sold. Selling development from an entity that
   * declares design is a claim the pages contradict, and it is the half of the
   * work that had no supporting signal anywhere in the markup.
   *
   * "Product designer" stays in front because it is the phrase the site
   * already ranks for; the addition extends the entity rather than replacing
   * it.
   */
  role: 'Product designer and developer',
  location: 'Barcelona, Spain',
  // Confirmed by Sergio 2026-07-31. The Figma footer shows sergio@, that is
  // the one that is wrong, not this.
  email: 'hello@sgualda.com',
  locale: 'en',
  tagline: 'I design and build things on the internet',
} as const;

/**
 * Identification for the legal notice.
 *
 * LSSI-CE art. 10 applies to those carrying out economic activity online.
 * Sergio is not registered as self-employed, publishes no prices and invoices
 * nothing from here, so the site is closer to informational than commercial
 * and the lighter version below is defensible.
 *
 * Flip `trading` to true on the day he registers. At that point the full NIF
 * and a fiscal address become required, and that address should be a
 * registered office, never a home address, which stays indexed forever.
 *
 * Not legal advice. Worth twenty minutes with a gestor before launch.
 */
export const LEGAL = {
  name: 'Sergio Gualda',
  /** Set to true once registered as autónomo. */
  trading: false,
  nif: '',        // DNI with its letter. Only published when trading.
  address: '',    // Registered office. Never the home address.
  city: 'Barcelona, Spain',
  /**
   * The GA4 measurement ID, and the single switch for everything that follows:
   * the consent banner, the analytics script, and the extra origins in the CSP.
   *
   * Set it to false and the site goes back to shipping no cookies at all, with
   * no banner and no third-party request. Nothing about analytics is loaded
   * before consent is given — not the script, not a cookie, not a DNS lookup.
   *
   * Kept on GA4 by Sergio's decision, 2026-08-20, against the recommendation
   * to move to a cookieless product and drop the consent banner with it.
   */
  analytics: 'G-JQL9QJ5RTC',
} as const;

export const SOCIAL = {
  linkedin: 'https://www.linkedin.com/in/sgualda/',
  instagram: 'https://www.instagram.com/sgualda/',
  /** Where the footer sends people. The chat tab, not the publication root. */
  community: 'https://sgualda.substack.com/chat',
} as const;

/**
 * Pages elsewhere that identify the same person. This is `sameAs`, and it is
 * not the same list as SOCIAL.
 *
 * `sameAs` means "a reference page that unambiguously indicates this item's
 * identity" — a page *about* him. The footer link goes to the Substack chat
 * tab, which is a place to talk rather than a page about anybody, so the
 * publication root goes here instead. Two lists because they answer two
 * different questions.
 *
 * What is deliberately absent matters as much as what is here:
 *
 *  · An empty Dribbble. A designer's portfolio profile with nothing in it is
 *    worse than no profile — it is a link that answers "what has he made?"
 *    with "nothing". Add it the day there is work on it.
 *  · Pinterest, Threads and YouTube, which the brief lists as future
 *    channels. They go in the day they are professional and active, not the
 *    day they are created. Every entry here is a page an engine may follow to
 *    decide who this is, and a dead one is a weak answer.
 *
 * uxerfy.com/about/ is the strongest entry: a real page about him on a
 * different domain, which already declares its own Person node pointing back
 * here with rel="me". Reciprocity is what lets an engine merge the two.
 *
 * Worth being straight about its limit, though: both domains are his, on one
 * hosting account. Cross-linking your own properties is a legitimate identity
 * declaration and helps disambiguation, but it is not third-party
 * corroboration and will not move Authority the way a client saying something
 * would.
 */
export const SAME_AS = [
  'https://www.linkedin.com/in/sgualda/',
  'https://www.instagram.com/sgualda/',
  'https://sgualda.substack.com',
  'https://uxerfy.com/about/',
] as const;

/**
 * What the Person entity is about. `sameAs` is how a search engine reconciles
 * the string "Sergio Gualda" with a known person rather than treating it as
 * text; `knowsAbout` is what a language model reads to decide what he is an
 * authority on.
 *
 * Nothing aspirational, because a `knowsAbout` claiming ground the pages do
 * not cover is a claim a model can check and find wanting. Everything below is
 * drawn from what the site actually contains: the six checks, the five stages,
 * the glossary, the essays and the projects.
 */
export const EXPERTISE = [
  'Product design',
  'Product strategy',
  'Product discovery',
  'User research',
  'Design systems',
  'SaaS',
  'Mobile apps',
  'Minimum viable products',
  'Design critique',
  // The specific ground the writing and the checks cover.
  'Jobs to be done',
  'Opportunity solution trees',
  'Continuous discovery',
  'Usability testing',
  'HEART framework',
  'Net Promoter Score',
  'Product analytics',
  'Feature prioritisation',
  'Design system governance',
  'Willingness to pay',
  'Product-market fit',
  'Interaction design',
  'Information architecture',
  'Design tokens',
  'Figma',
  'Prototyping',
  /**
   * The build half, added when web development became something being sold.
   *
   * Each of these is demonstrable from the site itself rather than asserted:
   * it is a static Astro build with hand-written tokens, a generated
   * structured-data graph, a URL contract enforced at build time and an
   * accessibility suite. That is the evidence, and it is public.
   */
  'Web design',
  'Web development',
  'Front-end development',
  'Astro',
  'Static site generation',
  'Web performance',
  'Core Web Vitals',
  'Web accessibility',
  'Technical SEO',
  'Structured data',
  'Website audits',
] as const;

/**
 * The main navigation. Four items.
 *
 * Tools and Map are back, and they belong here: they are the two things on
 * this site somebody can *use* rather than read, they are 11 pages of real
 * work, and demoting them to a line above the essay list meant nobody who did
 * not already know about them would ever find them. A menu is for the things
 * worth arriving for, and a diagnostic you can run in ninety seconds qualifies.
 *
 * Community moves to the footer. It is one link to a chat on somebody else's
 * platform plus a waitlist for a room that does not exist — real, worth having,
 * and not one of the four things this site is about.
 *
 * Two that stay out, and why:
 *
 *  · Work is linked from the home page and /about/, which are the two places
 *    somebody actually wants proof of it. A portfolio in the menu is what makes
 *    a personal site read as a portfolio.
 *  · Services existed for one day. Three landings with intent, deliverables
 *    and a page each was a catalogue, and this is not a shop — the way to work
 *    together is one banner and one short form, which is what it was before.
 */
export const NAV = [
  { label: 'Writing', href: '/writing/' },
  { label: 'Tools', href: '/tools/' },
  { label: 'Map', href: '/map/' },
  { label: 'About', href: '/about/' },
] as const;

/**
 * The dark pill in the header, and the label on every collaborate banner.
 *
 * Two words, and the same two everywhere. "Hire me" is about him; "Start a
 * project" and "Tell me about your project" were both accurate and both too
 * long to read at a glance on a phone. A control should say what happens next
 * in the fewest words that still mean something.
 */
export const CTA = { label: 'Let’s talk', href: '/collaborate/' } as const;

/**
 * The URL structure.
 *
 * Read as text by scripts/check-urls.mjs rather than imported, so a tool that
 * scans for unused exports will report it. It is not unused.
 *
 * Three deliberate breaks from the old site, all of them 301'd in
 * public/_redirects so nothing dangles:
 *
 * 1. Essays moved from the root (/good-product-design/) into /writing/.
 *    The root namespace belongs to pages, not posts.
 * 2. /blog/ became /writing/.
 * 3. /work/ became /work/ (2026-08-20). "Case study" is the
 *    vocabulary of an agency deliverable; these are project stories, and the
 *    shorter URL is the one that survives being read aloud.
 */
export const URL_MAP = {
  pages: [
    '/',
    '/about/',
    '/writing/',
    '/community/',
    '/now/',
    '/privacy/',
    '/glossary/',
    '/legal/',
    '/map/',
    '/map/worth-building/',
    '/map/first-version/',
    '/map/nobody-came/',
    '/map/make-it-repeatable/',
    '/map/charging-for-it/',
  ],

  /** Project stories. Renamed from /work/ on 2026-08-20. */
  work: [
    '/work/',
    '/work/glintale/',
    '/work/truvi/',
    '/work/truvi-developer-portal/',
    '/work/ecoco-mobile-app/',
  ],

  collaborate: ['/collaborate/', '/collaborate/sent/'],

  tools: [
    '/tools/',
    '/tools/why-is-nobody-using-your-product/',
    '/tools/is-user-feedback-real-or-just-polite/',
    '/tools/is-this-feature-worth-building/',
    '/tools/should-you-decide-now-or-think-longer/',
    '/tools/can-you-charge-for-your-product-yet/',
    '/tools/why-your-team-keeps-redoing-the-same-work/',
  ],

  /** Essays. Generated from the collection. */
  writing: [
    '/writing/claude-ai-product-design-review/',
    '/writing/designing-for-scalability/',
    '/writing/good-product-design/',
    '/writing/heart-framework-vs-nps-user-experience/',
    '/writing/learning-to-let-go-an-idea/',
    '/writing/mvp-vs-prototype/',
    '/writing/ux-certification-worth-it/',
  ],
} as const;

/**
 * Pages that belong in the footer sitemap, beyond the main nav.
 *
 * Work lives here rather than in NAV — reachable in one click from the footer
 * of every page, without occupying one of the four slots at the top.
 */
export const MORE = [
  { label: 'Work', href: '/work/' },
  { label: 'Community', href: '/community/' },
  { label: 'Let’s talk', href: '/collaborate/' },
  { label: 'Now', href: '/now/' },
  // Glossary is not here: the footer's first column already lists it, and one
  // link twice in one footer reads as an oversight rather than emphasis.
] as const;
