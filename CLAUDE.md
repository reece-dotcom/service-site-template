# Project — service-site-template (master template)

## What this is
Master/base template for local service-business marketing sites — not a
client project itself. Client sites are created by cloning this repo once
it's frozen at v1.0 (see Stage 6 of the kickoff checklist). Zero JS shipped
by default, content authored in markdown, deployed to Netlify.

## Stack
- Astro 5, Tailwind CSS 4, MDX, Sharp (image processing at build time)
- Hosting: Netlify (`netlify.toml` present)
- Assets: [Figma link — fill in if used]

## Commands
- Dev/preview: `npm run dev`
- Build: `npm run build`
- Preview built output: `npm run preview`
- Deploy: handled by Netlify on push — don't deploy manually without asking

## Structure
- `src/site.config.mjs` — the only file a client build edits: NAP, brand, schema type, hours, geo
- `src/content.config.mjs` — Astro content collections config
- `src/content/services/`, `areas/`, `blog/` — markdown content (not yet created)
- `src/components/` — `Schema.astro` (JSON-LD), `Seo.astro` (meta/OG/canonical)
- `src/layouts/Base.astro` — base page layout
- `src/pages/[...slug].astro` — dynamic route for services pages
- `src/styles/global.css` — six colour tokens + two font tokens per client
- `public/robots.txt.js` — generates robots.txt with sitemap reference

## Conventions
- NAP in `site.config.mjs` must match the client's Google Business Profile character for character.
- Title tags capped at 60 characters, meta descriptions at 160 — build fails if exceeded.
- Area pages require a `localProof` field of 120+ characters (guardrail against doorway pages).
- Never fabricate the `rating` field in `site.config.mjs` — leave `null` until real reviews exist.
- Give each client a distinct colour palette and font pairing — don't ship builds that look identical.

## Never do without asking
- Don't deploy or publish to production
- Don't push to a client's repo/remote
- Don't add a new dependency or plugin without checking first
- Don't invent review/rating data

## Gotchas
- (none yet — this is the master template, not a live client build)

## Open questions
- Home, area, blog and contact page templates aren't built yet (per README "Not yet built") — these are Stage 3 of the kickoff checklist.
