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
    /**
     * AEO direct answer (40-60 words, enforced in AnswerBlock). The passage an
     * AI answer engine quotes for "who does X in <town>".
     */
    answer: z.string().optional(),
    answerQuestion: z.string().optional(),
    faqs: faq,
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
    servicesOffered: z.array(z.string()).default([]),
    faqs: faq,
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

export const collections = { services, areas, blog };
