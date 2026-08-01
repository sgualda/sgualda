import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Essays.
 *
 * IMPORTANT — the 13 posts migrated from WordPress live at the ROOT of the
 * site (/good-product-design/), not under /blog/. That is how they are
 * indexed today, so that is where they stay. The `id` of each entry IS the
 * live URL slug; renaming a file breaks a live URL.
 */
const essays = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/essays' }),
  schema: ({ image }) =>
    z.object({
      /** The <h1>. No length limit — three migrated posts run long and
       *  their titles are what Google already ranks. */
      title: z.string(),
      /** Optional shorter <title> for the browser tab and search results.
       *  Use when `title` is over ~70 chars, which Google truncates. */
      seoTitle: z.string().max(70).optional(),
      description: z.string().min(70).max(160, 'Meta descriptions cut off after ~160'),
      published: z.coerce.date(),
      updated: z.coerce.date().optional(),
      // Was this post live on WordPress? If so its slug is load-bearing.
      migrated: z.boolean().default(false),
      draft: z.boolean().default(false),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      // Free-form, but keep the list short — tags with one post each are noise.
      topics: z.array(z.string()).default([]),
      // Shown in the essay index; the hook, not a summary.
      hook: z.string().optional(),
    }),
});

/**
 * Case studies. These live under /case-studies/{slug}/ — the two existing
 * ones (truvi, ecoco-mobile-app) keep their URLs exactly.
 */
const cases = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/cases' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().min(70).max(160),
      client: z.string(),
      role: z.string(),
      year: z.string(),
      // 'alive' | 'shipped' | 'buried' — honest status, not marketing status.
      status: z.enum(['alive', 'shipped', 'buried', 'in-progress']),
      published: z.coerce.date(),
      migrated: z.boolean().default(false),
      draft: z.boolean().default(false),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      summary: z.string(),
      // What it cost / what went wrong. The part that makes it worth reading.
      order: z.number().default(99),
    }),
});

export const collections = { essays, cases };
