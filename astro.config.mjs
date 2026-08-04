// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// The CMS needs a server to run; the public site does not. Only `npm run cms`
// turns this on, so a production build stays fully static.
const CMS = process.env.CMS === '1';

/**
 * CRITICAL — do not change these two lines without planning redirects.
 *
 * The existing WordPress site serves every URL with a trailing slash
 * (/about/, /good-product-design/). Matching that exactly is what lets us
 * migrate 19 indexed URLs with zero 301s. `format: 'directory'` writes
 * about/index.html rather than about.html, which is what makes /about/ work.
 */
import { rehypeTableScroll } from './src/lib/rehype-table-scroll.ts';

export default defineConfig({
  markdown: { rehypePlugins: [rehypeTableScroll] },
  site: 'https://sgualda.com',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },

  // Static output. Every page is real HTML on disk, so crawlers that do not
  // run JavaScript — Googlebot's first pass, GPTBot, ClaudeBot, PerplexityBot —
  // see the full content. Interactive parts are islands, loaded per page.
  output: CMS ? 'server' : 'static',

  // Hover, not viewport: prefetchAll pulled a dozen pages the moment anyone
  // scrolled to the footer. Opt high-intent links in with data-astro-prefetch.
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },

  integrations: [
    ...(CMS
      ? [
          react(),
          keystatic(),
        ]
      : []),
    sitemap({
      /**
       * Out of the sitemap: internal pages, and anything carrying `noindex`.
       *
       * /work-with-me/brief/ was in both — announced in the sitemap and told
       * not to index itself in the same breath. Two opposite instructions for
       * one URL is not just a wasted crawl of that page; it is a reason to
       * trust the rest of the file less.
       */
      filter: (page) =>
        !['/draft/', '/styleguide/', '/work-with-me/brief/'].some((x) => page.includes(x)),
      serialize(item) {
        /**
         * lastmod, and no priority.
         *
         * Google has ignored `priority` for years, and it was set on 15 of 38
         * URLs — which reads as a half-finished file rather than a decision.
         * `lastmod` is the opposite: one of the few signals that tells a
         * crawler what has actually changed since it last came. The real dates
         * come from the content collections and are injected by a build step;
         * everything else gets the build date, which is true for a static site.
         */
        delete item.priority;
        delete item.changefreq;
        item.lastmod = item.lastmod ?? new Date().toISOString();
        return item;
      },
    }),
  ],

  image: {
    // Astro's built-in image pipeline: AVIF/WebP, correct width/height
    // attributes, so no layout shift.
    responsiveStyles: true,
  },

  vite: {
    build: { cssCodeSplit: true },
  },
});
