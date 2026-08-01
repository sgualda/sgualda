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
export default defineConfig({
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
      // Internal pages stay out of search entirely.
      filter: (page) => !['/draft/', '/styleguide/'].some((x) => page.includes(x)),
      serialize(item) {
        // Essays and case studies change; the tools do not.
        if (item.url === 'https://sgualda.com/') item.priority = 1.0;
        else if (item.url.includes('/case-studies/')) item.priority = 0.9;
        else if (item.url.includes('/tools/')) item.priority = 0.7;
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
