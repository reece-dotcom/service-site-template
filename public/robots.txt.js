import { site } from '../site.config.mjs';

export function GET() {
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap-index.xml\n`,
    { headers: { 'Content-Type': 'text/plain' } }
  );
}
