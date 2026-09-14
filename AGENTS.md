# Project rules

Astro static site template for UK local service businesses (window & door
installers). Deployed to Netlify. No CMS — content is markdown in the repo.
Only our team edits content.

**This is a multi-tenant template.** One codebase serves every client.
Client is selected by the `CLIENT` env var; per-client data lives in
`clients/<slug>/`. Never fork this repo per client — a fix must reach every
site from one commit.

## Priorities, in order
1. SEO ceiling — highest possible
2. Build speed for new client sites
3. Low maintenance
4. Client self-service (lowest — do not add a CMS)

## Non-negotiable SEO rules
- Title tags max 60 characters. Meta descriptions max 160. Enforced in
  `src/content.config.mjs` and again in `src/lib/seo.mjs` — never relax
  these caps to make a build pass. Fix the content.
- Exactly one H1 per page.
- Every page needs a canonical URL and unique meta description.
- Area pages require a real `localProof` field, min 120 chars, rendered
  directly under the H1. This is the guardrail against doorway pages.
  Never remove it, never lower it, never bury it at the bottom.
- All images through Astro's `<Image />` component. WebP output. Never
  raw `<img>` tags with unoptimised sources.
- Alt text on every meaningful image. Empty alt on decorative ones.
- Zero client-side JavaScript unless a feature genuinely requires it.
  Justify any hydration directive in a comment.
- Schema: LocalBusiness site-wide, Service on service pages, FAQPage
  where real FAQs exist, BlogPosting on posts, ContactPage on contact.
- **Never generate fake reviews, ratings or testimonials in schema.**
  `site.reviews.aggregate` stays null until real numbers exist.

## Style rules
- All per-client values come from `clients/<slug>/site.config.mjs`. Never
  hardcode a business name, phone number or address in a component.
- All colour and type from tokens in `src/styles/global.css`, injected from
  the client's `theme` block. No arbitrary hex values in components.
- Semantic HTML. Visible focus states. Respect `prefers-reduced-motion`.

## Before saying a task is done
```
CLIENT=<slug> npm run build   # must pass
CLIENT=<slug> npm run qa      # must pass
```
`npm run qa` checks duplicate/missing meta, H1 count, orphan pages, broken
internal links, JSON-LD validity, stray client JS, and cross-client
duplicate content.

## The home page IS the Glazing Master Template (decided 14 Sep 2026)
- `src/templates/master.html` + `src/styles/template.css` are Reece's design
  artifact ("Glazing Master Template", claude.ai/code/artifact/c4f1a5ad-…),
  exported verbatim. **Never redesign it.** Design changes happen in the
  artifact, then re-export those two files.
- `src/lib/template-home.mjs` drops a client's facts into the slots (name,
  phone, town, nav, logo, hero words + photos, stats, accreditations, reviews,
  services → panes, promises, jobs, comparison, owner, areas, FAQ, form,
  footer) and keeps the template's own wording everywhere else. Copy edits
  come from Reece afterwards, section by section.
- Placeholder CLAIMS (312 reviews, 91% stat, 0% finance) show on prospect
  demos only; a live site shows them only when the client's config holds the
  real thing. Everything else placeholder is fine until edited.
- Type: Nunito (free stand-in for Museo Sans Rounded, the Entrepreneurs Circle
  face Reece wants). Swap to Museo when he has an Adobe Fonts kit.
- Inner pages (services, areas, about, contact, blog) still use the component
  layout in `src/components/` with the same tokens.

## Working with Reece
- He is not technical: run everything from the chat, never send him to
  Terminal. Publishing needs his explicit yes each time (Netlify prod deploy).
- Per-client facts live in `clients/<slug>/site.config.mjs` and a short
  `clients/<slug>/BRIEF.md` (what we know, what's unverified, what he said).
  Put new facts there, not in chat, so any session can build the site.
- Prospect demos: `clients/prospect-<slug>/` + `~/.claude/skills/lighthouse`.
- Netlify: one site per client (Miller `693773ee-…`, demos on `glazeos-demos`
  aliases). Deploy with `netlify deploy --prod --no-build --dir dist --site <id>`
  after `CLIENT=<slug> npm run build && npm run qa`.
