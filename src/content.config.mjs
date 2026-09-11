import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { contentPath } from './lib/client.mjs';

/**
 * SEO guardrails are enforced HERE, at build time.
 * A page that would ship a truncated title or a doorway-page area page
 * fails the build instead of going live. Never relax these caps to make
 * a build pass — fix the content.
 */
const seo = {
  title: z.string().max(60, 'Title tag must be 60 characters or fewer'),
  description: z
    .string()
    .max(160, 'Meta description must be 160 characters or fewer')
    .min(50, 'Meta description is too short to be useful'),
};

const faq = z
  .array(z.object({ question: z.string(), answer: z.string() }))
  .optional();

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: contentPath('services') }),
  schema: z.object({
    ...seo,
    name: z.string(),
    heading: z.string(),
    summary: z.string(),
    order: z.number().default(99),
    image: z.string().optional(),
    benefits: z.array(z.string()).default([]),
    /** Search terms this page must contain; QA fails the build if they are missing. */
    targets: z.array(z.string()).default([]),
    /**
     * AEO direct answer (40-60 words, enforced in AnswerBlock). The passage an
     * AI answer engine quotes for "who does X in <town>".
     */
    answer: z.string().optional(),
    answerQuestion: z.string().optional(),
    faqs: faq,
    /** Shown as "Last reviewed" — a real freshness signal, so only set it when the page was genuinely reviewed. */
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

const areas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: contentPath('areas') }),
  schema: z.object({
    ...seo,
    name: z.string(),
    heading: z.string(),
    summary: z.string(),
    /**
     * ANTI-DOORWAY GUARDRAIL — do not remove, do not lower.
     * An area page with no genuine, specific local content has no right to
     * exist and will get the whole network penalised. 120 chars minimum.
     */
    localProof: z
      .string()
      .min(120, 'localProof must be 120+ characters of genuinely local content'),
    postcodes: z.array(z.string()).default([]),
    /** Search terms this page must contain; QA fails the build if they are missing. */
    targets: z.array(z.string()).default([]),
    /** Town coordinates. Used to order the nearby-areas links and nothing else. */
    geo: z.object({ lat: z.number(), lng: z.number() }).optional(),
    /** Wikidata entity URL for this town, e.g. https://www.wikidata.org/wiki/Q1234. Disambiguates same-named UK towns in schema. */
    wikidata: z.string().url().optional(),
    servicesOffered: z.array(z.string()).default([]),
    /**
     * Opt-in service x area pages (/services/<service>/in/<this area>/).
     * These rank for the real money queries, so they carry the strictest
     * guards in the codebase — see src/lib/intersect.mjs. Only add an entry
     * when there is something true and specific to say about that service in
     * that town.
     */
    serviceDetail: z
      .array(
        z.object({
          service: z.string(),
          title: z.string().max(60).optional(),
          description: z.string().max(160).optional(),
          heading: z.string().optional(),
          intro: z
            .string()
            .min(220, 'serviceDetail.intro needs 220+ characters specific to this service in this town'),
          points: z.array(z.string()).default([]),
          faqs: faq,
        })
      )
      .default([]),
    faqs: faq,
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: contentPath('blog') }),
  schema: z.object({
    ...seo,
    heading: z.string(),
    category: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.string(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

/**
 * Translated pages (currently Welsh). One file per page, authored as plain
 * markdown so a native-speaker reviewer can edit it without touching code.
 *
 * `enPath` is the English page this one is the translation of — it drives the
 * reciprocal hreflang pair and is validated against real routes at build time.
 * `targets` are the search terms this page must actually contain; QA fails the
 * build if the rendered page does not include them, in either language.
 */
const translations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: contentPath('cy') }),
  schema: z.object({
    ...seo,
    locale: z.string().default('cy'),
    name: z.string(),
    heading: z.string(),
    summary: z.string(),
    /** Overrides the closing CTA heading on this page. */
    ctaHeading: z.string().optional(),
    /** Shorter label for the nav, if the page name is long. */
    navLabel: z.string().optional(),
    /** English counterpart, e.g. /services/misted-double-glazing/ */
    enPath: z.string().startsWith('/'),
    /** Search terms that must appear on this page (checked by QA). First one is primary. */
    targets: z.array(z.string()).default([]),
    faqs: faq,
    order: z.number().default(99),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { services, areas, blog, translations };
