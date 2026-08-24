import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import { site } from './src/site.config.mjs';

export default defineConfig({
  // Absolute URL is required for sitemap, canonicals and Open Graph tags.
  site: site.url,
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/thank-you'),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  image: {
    // Astro converts and resizes at build time — no manual WebP step.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
