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

/**
 * The six free checks. YAML rather than TypeScript so the copy can be edited
 * without opening code, validated by the schema below, and reached by a CMS.
 */
const tools = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/tools' }),
  schema: z.object({
    cat: z.enum(['growth', 'users', 'decisions', 'team']),
    n: z.string(),
    time: z.string(),
    count: z.string(),
    title: z.string(),
    meta: z.string().min(70).max(200),
    lead: z.string(),
    out: z.string(),
    answers: z.array(z.tuple([z.string(), z.string()])),
    faqs: z.array(z.tuple([z.string(), z.string()])),
    /** [question, [[label, score], …]] */
    q: z.array(z.tuple([z.string(), z.array(z.tuple([z.string(), z.number()]))])).min(1),
    b: z
      .array(
        z.object({
          max: z.number(),
          name: z.string(),
          sub: z.string(),
          body: z.string(),
          next: z.array(z.string()).min(1),
        })
      )
      .min(2),
  }),
});

/** The five stages of the map. */
const stages = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/stages' }),
  schema: z.object({
    n: z.string(),
    name: z.string(),
    lead: z.string(),
    question: z.string(),
    /** Percentage position on the route diagram. */
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
    tools: z.array(z.string()),
    body: z.array(z.string()).min(1),
    traps: z.array(z.string()).min(1),
    signal: z.string(),
    cta: z.object({ title: z.string(), body: z.string() }),
  }),
});

export const collections = { essays, cases, tools, stages };
