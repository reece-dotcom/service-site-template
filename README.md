# Local service site template — Astro + Netlify

Static site template for local service businesses. Zero JavaScript
shipped by default, all content in markdown, deployed to Netlify.

## Per-client setup

1. `cp -r` this repo, then edit **`src/site.config.mjs`** — this is the
   only config file. NAP, brand, schema type, hours, geo.
2. Edit the six colour and two font tokens in **`src/styles/global.css`**.
   Give each client a distinct palette and type pairing so builds don't
   read as the same starter kit.
3. Write content as markdown in `src/content/services/`, `areas/`, `blog/`.
4. `npm install && npm run dev`
5. Push to a Git repo, connect to Netlify. `netlify.toml` handles the rest.

## What's enforced automatically

- **Title tags capped at 60 characters, descriptions at 160** — the build
  fails if you exceed them, rather than shipping a truncated tag.
- **Area pages require a `localProof` field of 120+ characters.** An area
  page with no genuine local content will not build. This is the guardrail
  against doorway pages.
- Canonicals, Open Graph tags and sitemap generated from the real URL.
- LocalBusiness JSON-LD site-wide; Service and FAQPage schema per page.
- Images converted to WebP and resized at build time via Sharp.
- `robots.txt` generated with the correct sitemap reference.

## Before launch

Run the QA checklist in the SEO SOP. The two that bite hardest:
301 redirects for any migrated URLs (add to `netlify.toml`), and
NAP matching Google Business Profile character for character.

## Not yet built

Home, areas, blog and contact page templates. Same pattern as
`src/pages/services/[...slug].astro`.
