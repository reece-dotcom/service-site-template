// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './src/lib/client.mjs';

// Translated pages stay out of the sitemap until a native speaker has reviewed
// them (see src/lib/i18n.mjs). Unreviewed machine translation that Google has
// indexed is worse than no translation at all.
const unreviewedPrefixes = (site.locales?.alternates ?? [])
  .filter((l) => !l.reviewed)
  .map((l) => `${l.prefix}/`);

// Multi-tenant: the active client comes from the CLIENT env var.
// One Netlify site per client, all building from this one repo.
export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // /lp/ is a noindex paid-traffic page: it must never enter the sitemap,
      // or it competes with the real home page for the same terms.
      filter: (page) =>
        !page.includes('/thank-you/') &&
        !page.includes('/lp/') &&
        !unreviewedPrefixes.some((p) => new URL(page).pathname.startsWith(p)),
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
