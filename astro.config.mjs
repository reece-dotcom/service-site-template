// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './src/lib/client.mjs';

// Multi-tenant: the active client comes from the CLIENT env var.
// One Netlify site per client, all building from this one repo.
export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/thank-you/'),
      // Priorities tell Google what matters on a small site where every page
      // is otherwise weighted the same. Money pages first, blog last.
      serialize(item) {
        const path = new URL(item.url).pathname;
        if (path === '/') {
          item.changefreq = 'weekly';
          item.priority = 1.0;
        } else if (path.startsWith('/services/') || path.startsWith('/areas/')) {
          item.changefreq = 'monthly';
          item.priority = 0.9;
        } else if (path.startsWith('/contact/') || path.startsWith('/about/')) {
          item.changefreq = 'yearly';
          item.priority = 0.8;
        } else {
          item.changefreq = 'monthly';
          item.priority = 0.6;
        }
        return item;
      },
    }),
  ],
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
  prefetch: false,
});
