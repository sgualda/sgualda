import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '@lib/site';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const essays = (await getCollection('essays', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf()
  );

  return rss({
    title: `${SITE.name} — writing`,
    description:
      'Essays on product design, discovery and the decisions that cost me something.',
    site: context.site ?? SITE.url,
    trailingSlash: true,
    items: essays.map((e) => ({
      title: e.data.title,
      description: e.data.description,
      pubDate: e.data.published,
      link: `/writing/${e.id}/`,
    })),
    customData: `<language>en</language>`,
  });
}
