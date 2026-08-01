/**
 * Single source of truth for identity, navigation and the URL contract.
 *
 * URL map derived from the live sitemap of sgualda.com on 2026-07-31.
 * Anything under `existing` is already indexed by Google and MUST keep its
 * exact path, trailing slash included.
 */

export const SITE = {
  url: 'https://sgualda.com',
  name: 'Sergio Gualda',
  role: 'Product Designer',
  location: 'Barcelona, Spain',
  // Confirmed by Sergio 2026-07-31. The Figma footer shows sergio@ — that is
  // the one that is wrong, not this.
  email: 'hello@sgualda.com',
  locale: 'en',
  tagline: 'Product designer in Barcelona',
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
 * and a fiscal address become required — and that address should be a
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
} as const;

export const SOCIAL = {
  linkedin: '',  // TODO(sergio)
  instagram: '', // TODO(sergio)
  community: 'https://sgualda.substack.com/chat',
} as const;

/** Nav order taken from the Figma header component. */
export const NAV = [
  { label: 'Tools', href: '/tools/' },
  { label: 'Map', href: '/map/' },
  { label: 'Work', href: '/case-studies/' },
  { label: 'Writing', href: '/writing/' },
  { label: 'About', href: '/about/' },
] as const;

/** The dark pill in the header. */
export const CTA = { label: 'Start here', href: '/work-with-me/' } as const;

/**
 * The URL structure, decided for what the site is becoming rather than what
 * WordPress happened to do.
 *
 * Two deliberate breaks from the old site:
 *
 * 1. Essays move from the root (/good-product-design/) into /writing/.
 *    The root namespace should belong to pages, not posts — otherwise every
 *    new page we ever add has to check it does not collide with an essay
 *    slug. It also matches the nav in Figma, which says WRITING.
 *
 * 2. /blog/ becomes /writing/. Same reason: the design says Writing.
 *
 * Both old shapes 301 from public/_redirects, so nothing dangles.
 */
export const URL_MAP = {
  pages: [
    '/',
    '/about/',
    '/work-with-me/',
    '/case-studies/',
    '/case-studies/glintale/',
    '/case-studies/truvi/',
    '/case-studies/ecoco-mobile-app/',
    '/case-studies/weeknotes/',
    '/case-studies/rangos/',
    '/writing/',
    '/map/',
    '/map/worth-building/',
    '/map/first-version/',
    '/map/nobody-came/',
    '/map/make-it-repeatable/',
    '/map/charging-for-it/',
    '/community/',
    '/now/',
    '/privacy/',
    '/legal/',
  ],
  tools: [
    '/tools/',
    '/tools/why-is-nobody-using-your-product/',
    '/tools/is-user-feedback-real-or-just-polite/',
    '/tools/is-this-feature-worth-building/',
    '/tools/should-you-decide-now-or-think-longer/',
    '/tools/can-you-charge-for-your-product-yet/',
    '/tools/why-your-team-keeps-redoing-the-same-work/',
  ],
  /**
   * Topic hubs. Only topics that actually have an essay get a page — an empty
   * hub is thin content and a dead end. 'launch' is defined in topics.ts and
   * deliberately absent here until something is written for it.
   */
  topics: [
    '/writing/topic/craft/',
    '/writing/topic/discovery/',
    '/writing/topic/measurement/',
    '/writing/topic/process/',
    '/writing/topic/scope/',
  ],

  /** Essays. Generated from the collection. */
  writing: [
    '/writing/claude-ai-product-design-review/',
    '/writing/designing-for-scalability/',
    '/writing/getting-things-done-transformed-my-life/',
    '/writing/good-product-design/',
    '/writing/heart-framework-vs-nps-user-experience/',
    '/writing/intuitive-design-new-standard/',
    '/writing/learning-to-let-go-an-idea/',
    '/writing/nps-outdated-user-experience/',
    '/writing/product-design-challenges/',
    '/writing/product-discovery-make-or-break-idea/',
    '/writing/ux-certification-worth-it/',
    '/writing/ux-design-principles-manifesto/',
    '/writing/what-is-mvp-and-how-it-drives-growth/',
  ],
} as const;

/** Flat list for the build-time URL check. */
export const ALL_URLS = [...URL_MAP.pages, ...URL_MAP.tools, ...URL_MAP.writing];

/** Tool pages, with the short labels used in the footer sitemap. */
export const TOOLS = [
  { label: 'Why nobody uses your product', href: '/tools/why-is-nobody-using-your-product/' },
  { label: 'Is that feedback real?', href: '/tools/is-user-feedback-real-or-just-polite/' },
  { label: 'Is this feature worth building?', href: '/tools/is-this-feature-worth-building/' },
  { label: 'Decide now, or wait?', href: '/tools/should-you-decide-now-or-think-longer/' },
  { label: 'Can you charge yet?', href: '/tools/can-you-charge-for-your-product-yet/' },
  { label: 'Why work gets redone', href: '/tools/why-your-team-keeps-redoing-the-same-work/' },
] as const;

/** Pages that belong in the footer sitemap, beyond the main nav. */
export const MORE = [
  { label: 'Work with me', href: '/work-with-me/' },
  { label: 'Case studies', href: '/case-studies/' },
  { label: 'Now', href: '/now/' },
  { label: 'Community', href: '/community/' },
] as const;
