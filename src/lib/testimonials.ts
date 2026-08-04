import { getCollection } from 'astro:content';
import { SITE } from './site';

/**
 * The testimonials, and their Review schema, from one place.
 *
 * Both the rendered quotes and the structured data have to come from the same
 * call. The first version exported the schema from the component itself, which
 * Astro evaluates outside the render scope — it failed the build outright,
 * which was the good outcome. The bad outcome is the one this shape prevents:
 * a page marking up a review it does not display, or displaying one it does not
 * mark up, and nobody noticing because both halves look fine alone.
 */
export const getTestimonials = async () =>
  (await getCollection('testimonials')).sort((a, b) => a.data.order - b.data.order);

/**
 * One `Review` per person, each author a `Person` carrying `sameAs`.
 *
 * The author is an entity with a profile URL rather than a bare string, so a
 * knowledge graph can resolve the reviewer instead of reading a name that
 * happens to appear on a page. That is the difference between a quote and a
 * corroborated quote, and corroboration is the whole reason this exists.
 *
 * Worth stating plainly so nobody expects the wrong thing: this will not put
 * stars in a search result. Google's self-serving review policy removes rich
 * results when a business marks up reviews about itself. The value is in the
 * knowledge graph, the models that read the page, and human quality raters.
 */
export const reviewSchema = (items: Awaited<ReturnType<typeof getTestimonials>>) =>
  items.map((t) => ({
    '@type': 'Review',
    reviewBody: t.data.quote,
    datePublished: undefined,
    author: {
      '@type': 'Person',
      name: t.data.name,
      jobTitle: t.data.role,
      worksFor: { '@type': 'Organization', name: t.data.company },
      sameAs: [t.data.linkedin],
    },
    itemReviewed: { '@id': `${SITE.url}/#person` },
  }));
