# Local service site template — Astro + Netlify

Multi-tenant static site platform for UK window & door installers.
Zero JavaScript shipped by default, all content in markdown, deployed to
Netlify. One codebase, many client sites.

## The model

```
src/                      shared code — one copy, forever
clients/
  demo-glazing/
    site.config.mjs       the only place client values live
    content/{services,areas,blog}/*.md
  next-client/
    ...
```

The active client comes from the `CLIENT` env var:

```bash
CLIENT=demo-glazing npm run dev
CLIENT=demo-glazing npm run build
CLIENT=demo-glazing npm run qa
```

**Do not fork this repo per client.** Every client is a folder, and every
client gets its own Netlify site pointing at this repo with its own `CLIENT`
env var and its own domain. That is what makes an SEO fix ship to 300 sites
in one commit instead of 300 pull requests.

## Adding a client

1. `cp -r clients/demo-glazing clients/<slug>` and delete the sample content.
2. Edit `site.config.mjs` — NAP, brand, schema type, hours, geo, GHL endpoint.
   NAP must match the Google Business Profile character for character.
3. Set the six colour tokens and two font tokens in `theme`. Give each client
   a distinct palette so builds don't read as the same starter kit.
4. Write markdown into `content/services/`, `areas/`, `blog/`.
5. In Netlify: New site → this repo → add env var `CLIENT=<slug>` → add domain.
6. `CLIENT=<slug> npm run build && CLIENT=<slug> npm run qa` before launch.

## What's enforced automatically

- **Title tags capped at 60 characters, descriptions at 160** — the build
  fails rather than shipping a truncated tag.
- **Area pages require a `localProof` field of 120+ characters.** An area page
  with no genuine local content will not build. This is the guardrail against
  doorway pages, and it renders directly under the H1.
- Canonicals, Open Graph tags and sitemap generated from the real URL.
- LocalBusiness JSON-LD site-wide; Service, FAQPage, BlogPosting and
  ContactPage schema per page type. Ratings only emitted when real.
- `robots.txt` generated with the correct sitemap reference; `/thank-you/`
  is noindex and excluded from the sitemap.
- Images converted to WebP and resized at build time via Sharp.

## `npm run qa`

Pre-launch QA. Fails on: missing/duplicate/oversized titles and descriptions,
missing canonicals, H1 count ≠ 1, images without alt, invalid JSON-LD, broken
internal links, orphan pages, missing sitemap/robots, and **cross-client
duplicate content** (the defining risk of a shared template).

Warns on unexpected `<script>` tags so stray client JS can't creep in.

## Page types

Home · services index + detail · areas index + detail · blog index + post ·
contact (GHL or Netlify forms) · thank-you (noindex).

## Before launch

Two that bite hardest: **301 redirects** for any migrated URLs (add to
`netlify.toml`, per client) and **NAP matching Google Business Profile
character for character**.
