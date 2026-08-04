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
  // Confirmed by Sergio 2026-07-31. The Figma footer shows sergio@, that is
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
   */
  analytics: 'G-JQL9QJ5RTC',
} as const;

export const SOCIAL = {
  linkedin: 'https://www.linkedin.com/in/sgualda/',
  instagram: 'https://www.instagram.com/sgualda/',
  community: 'https://sgualda.substack.com/chat',
} as const;

/**
 * What the Person entity is about. `sameAs` is how a search engine reconciles
 * the string "Sergio Gualda" with a known person rather than treating it as
 * text; `knowsAbout` is what a language model reads to decide what he is an
 * authority on.
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
] as const;

/** Nav order taken from the Figma header component. */
export const NAV = [
  { label: 'Tools', href: '/tools/' },
  { label: 'Map', href: '/map/' },
  { label: 'Work', href: '/case-studies/' },
  { label: 'Writing', href: '/writing/' },
  { label: 'About', href: '/about/' },
] as const;

/** The dark pill in the header. */
export const CTA = { label: 'Hire me', href: '/work-with-me/' } as const;

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
/**
 * Read as text by scripts/check-urls.mjs rather than imported, so a tool that
 * scans for unused exports will report it. It is not unused.
 */
export const URL_MAP = {
  pages: [
    '/',
    '/about/',
    '/work-with-me/',
    '/work-with-me/brief/',
    '/case-studies/',
    '/case-studies/glintale/',
    '/case-studies/truvi/',
    '/case-studies/truvi-developer-portal/',
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
    '/glossary/',
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



/** Pages that belong in the footer sitemap, beyond the main nav. */
export const MORE = [
  { label: 'Work with me', href: '/work-with-me/' },
  { label: 'Work', href: '/case-studies/' },
  { label: 'Now', href: '/now/' },
  { label: 'Community', href: '/community/' },
] as const;
