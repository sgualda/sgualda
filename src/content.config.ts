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
      /**
       * Questions a reader actually types, answered in full on the page.
       * Rendered as real markup and mirrored as FAQPage, which is what a
       * language model quotes when somebody asks the question directly —
       * an essay paragraph is prose, an answer here is an answer.
       */
      faqs: z
        .array(z.object({ q: z.string(), a: z.string().min(120) }))
        .optional(),
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
      /**
       * Honest status, not marketing status.
       *
       * 'alive' is gone: it meant the same as 'in-progress' in practice, and two
       * words for one state is how a filter ends up with a bucket nobody can
       * explain. 'paused' is new — stopped without being dead, which is a real
       * thing that was not expressible.
       */
      status: z.enum(['in-progress', 'shipped', 'paused', 'buried']),
      published: z.coerce.date(),
      migrated: z.boolean().default(false),
      draft: z.boolean().default(false),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /**
       * Which part of the cover survives the square crop. A square tile shows
       * about 55% of a 16:9 screenshot, so this is the difference between
       * seeing the product and seeing half of it: wide dashboards want their
       * left-hand navigation, a centred phone mock wants the middle.
       */
      coverPosition: z.string().default('left center'),
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
    /** Written by hand. Concatenating fields produced five near-identical ones. */
    meta: z.string().min(70).max(160),
    /**
     * The <title>, written towards the query rather than the position in the
     * sequence. All five used to be "Stage 0N: {name} — building a product",
     * which competes with itself four times over and targets a phrase — "stage
     * 03" — that nobody has ever searched for.
     */
    seoTitle: z.string().max(60),
    /** Percentage position on the route diagram. */
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
    tools: z.array(z.string()),
    body: z.array(z.string()).min(1),
    traps: z.array(z.string()).min(1),
    signal: z.string(),
    /**
     * Three questions per stage. The stage pages were the longest thing on the
     * site without a block of directly answered questions, which is the format
     * that feeds People Also Ask and gets quoted by a model verbatim.
     */
    faqs: z.array(z.object({ q: z.string(), a: z.string().min(100) })).length(3),
    cta: z.object({ title: z.string(), body: z.string() }),
  }),
});

/**
 * The vocabulary this site uses with a specific meaning. Defined terms are what
 * a language model quotes when somebody asks what something means, and they
 * turn house vocabulary into citable entities rather than jargon.
 */
const glossary = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/glossary' }),
  schema: z.object({
    name: z.string(),
    definition: z.string().min(80),
    /** The line that makes it stick. */
    note: z.string(),
    topics: z.array(z.string()),
    tool: z.string().optional(),
    stage: z.string().optional(),
  }),
});

/**
 * Testimonials.
 *
 * Every field except `order` is required, and that is the point of the schema
 * rather than an oversight: an unattributed quote is worth nothing. "Great
 * designer — Marketing Manager" is something anybody can type, and everybody
 * knows it. A name, a role, a company and a link to the person's real profile
 * is a claim a reader can check in one click, and a claim that can be checked
 * is the only kind that moves the Authority half of E-E-A-T.
 *
 * `linkedin` is mandatory for the same reason. If the recommendation is already
 * published on a third-party platform, this page stops being Sergio's word
 * about what a client said and becomes a pointer to the client saying it.
 *
 * The build fails rather than rendering a quote with a missing attribution.
 */
const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/testimonials' }),
  schema: z.object({
    /** Their words, verbatim. Never paraphrased, never tightened. */
    quote: z.string().min(40),
    name: z.string(),
    role: z.string(),
    company: z.string(),
    /** Their profile, so the claim is checkable. */
    linkedin: z.string().url(),
    /** What we worked on, if it maps to a case study. */
    project: z.string().optional(),
    order: z.number().default(99),
  }),
});

export const collections = { essays, cases, tools, stages, glossary, testimonials };
