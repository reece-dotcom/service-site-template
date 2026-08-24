import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Shared SEO fields. Enforced at build time — a missing title or
// description fails the build rather than shipping a blank tag.
const seo = {
  title: z.string().max(60),        // hard cap: 60 chars
  description: z.string().max(160), // hard cap: 160 chars
  primaryKeyword: z.string(),
  noindex: z.boolean().default(false),
};

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    ...seo,
    h1: z.string(),
    summary: z.string(),
    order: z.number().default(99),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

const areas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/areas' }),
  schema: z.object({
    ...seo,
    h1: z.string(),
    areaName: z.string(),
    // Forces genuine local content. An area page with no real proof
    // is a doorway page — the build refuses to publish it.
    localProof: z.string().min(120),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    ...seo,
    h1: z.string(),
    published: z.date(),
    updated: z.date().optional(),
    author: z.string(),
    category: z.string(),
  }),
});

export const collections = { services, areas, blog };
