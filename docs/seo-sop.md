# Local SEO SOP — UK window & door installers

The playbook we run for every Glaze OS client site. Written for the installer market
(uPVC/aluminium windows, composite doors, conservatories, roofline, repairs).

Two rules that govern everything below:

1. **Google ranks the business, not the website.** For "windows near me" style searches the
   map pack is the prize, and the map pack is won by the Google Business Profile, reviews and
   proximity — not by the site. The site's job is to *support* the profile, then win the
   organic results underneath it.

2. **Never publish a page a human wouldn't want to read.** Spun town pages are the single
   fastest way to get a small installer site filtered out. Every rule about "unique content"
   below exists to enforce this.

---

## Stage 0 — Intake (before any page is written)

Collect from the client, into `clients/<slug>/site.config.mjs`:

| Item | Why it matters |
| --- | --- |
| Legal name, trading name | NAP consistency across every citation |
| Full address + postcode | Proximity is the strongest map-pack factor |
| Landline **and** mobile | Landline with local dialling code is a trust signal |
| FENSA or CERTASS number | The single biggest credibility marker in this trade |
| Insurance-backed guarantee provider | GGF, QANW, etc. |
| Trade memberships | TrustMark, Which? Trusted Traders, Checkatrade |
| Years trading, family-run? | Feeds the "local proof" copy |
| Top 3 revenue services | Determines which service pages get built first |
| Realistic travel radius | Determines the area pages — see the matrix rule |
| Existing GBP access | Almost always exists unclaimed; never create a duplicate |
| Existing site + domain | Redirect map, and preserving any existing authority |

**Do not skip the GBP audit.** Search the business name + postcode before anything else.
Unclaimed or duplicate profiles are extremely common in this trade and merging them later is
painful.

---

## Stage 1 — Google Business Profile

The highest-ROI work. Do this before, or in parallel with, the site build.

**Categories.** Primary category decides which searches you're eligible for:

- Primary: **Window installation service** (most installers) or **Double glazing installer**
- Secondary: Door supplier · Conservatory construction contractor · Window supplier ·
  Glass repair service · Door installation service · Conservatory supplier

Pick the primary that matches where the *money* comes from, not the widest one. One primary
category chosen correctly beats eight secondary ones.

**Service area.** Set the towns actually served — not the whole county. Over-broad service
areas dilute relevance. A service-area business (no customer-facing premises, common for
installers working out of a unit) should hide the street address; a showroom should show it.

**Completeness checklist**

- Services list populated, each with a real description (not the default stub)
- Products for headline items (uPVC casement, composite door, warm roof)
- Opening hours, including Saturday if genuinely open — plus special hours at Christmas
- Description mentioning FENSA/CERTASS number, years trading and the main towns
- Booking/quote link pointing at the site's `/contact/`
- Attributes: family-owned, free estimates, on-site services, wheelchair accessible if true

**Photos.** The most-neglected ranking and conversion lever. Target ~20 to start, then a
steady trickle:

- Exterior of installed jobs, **before and after** pairs
- Team and vans (vans carry the branding and phone number)
- Showroom if there is one
- Upload from the phone at the job, not in a bulk batch weeks later
- Real photos only. Stock imagery is obvious and it undermines the trust the whole page is
  trying to build.

**Google Posts.** One a fortnight, minimum. Completed jobs, seasonal offers, new product
lines. Low effort, keeps the profile active.

---

## Stage 2 — Reviews (the compounding asset)

Review count and velocity drive map-pack position more than anything the site can do.
This is where GHL earns its keep.

**The automation:** job marked complete in the pipeline → 2-hour delay → SMS with the direct
GBP review link → if no review after 3 days, one follow-up → then stop. Never a third chase.

**What makes it work**

- **SMS, not email.** Roughly triple the response rate in this trade.
- **Ask at peak delight** — the day the installation is finished and the house looks
  transformed, not a fortnight later.

- **The fitter asks in person first**, then the SMS lands as a reminder. Vastly outperforms a
  cold automated text.

- Use the **short review link** from the GBP dashboard; every extra tap loses people.
- **Reply to every review**, positive and negative, within 48 hours. Replies are visible to
  prospects and Google, and a calm reply under a bad review converts better than no bad
  reviews at all.

- Never gate reviews (filtering happy customers to Google and unhappy ones to a private form)
  — against Google's policy and grounds for losing the review set.

**Target:** 40+ reviews at 4.7★ or better. Below ~20 reviews an installer is invisible next
to established competitors regardless of how good the site is.

---

## Stage 3 — Site architecture (what the template already enforces)

```
/                          the town + service the client most wants
/services/                 hub
/services/<service>/       one per real service
/areas/                    hub
/areas/<town>/             one per genuinely served town
/blog/                     the trust and long-tail layer
/contact/                  the conversion page
```

**The service × town matrix rule.** The temptation is a page for every service in every town
— 8 services × 30 towns = 240 pages of near-identical text. That is a doorway-page pattern
and it gets sites filtered.

The rule we follow:

- **Area pages only for towns with real evidence of trading there** — completed jobs, reviews
  from residents, a genuine catchment. Start with 5–10, never 40.

- Each area page must carry the **`localProof` field: 120+ characters, specific to that town**
  — named streets or estates, a housing-stock observation (1930s bay fronts in Heaton Moor,
  new-build estates off the bypass), conservation-area rules, the actual number of jobs done
  there. The build **fails** if it's shorter than 120 characters. That guardrail exists
  specifically to make the lazy version impossible.

- Combined service+town pages (`/areas/stockport/composite-doors/`) **only** where the volume
  genuinely justifies it — the top 1–2 towns, top 1–2 services. Earn them, don't generate them.

- If you can swap the town name and the page still reads correctly, **it should not be
  published.**

**Handled automatically by the template** — no per-client work:
canonicals · sitemap · robots · `noindex` on `/thank-you/` · LocalBusiness/Service/FAQPage/
BlogPosting/ContactPage JSON-LD · Open Graph · title ≤60 and meta ≤160 enforced at build ·
zero client JS · 100/100 Lighthouse baseline.

---

## Stage 4 — On-page rules

**Titles** (≤60 chars, enforced): `Service in Town | Brand`
→ `Composite Doors in Stockport | Demo Glazing`

**H1** — one per page, matching intent, never stuffed. "Composite Doors in Stockport", not
"Composite Doors Stockport | Cheap Composite Doors Stockport Manchester".

**Every service page**

- What it is, in plain English — assume the reader is replacing windows for the first time
  in 25 years

- Materials and options actually offered (don't list aluminium if they don't fit aluminium)
- **Price guidance.** The most-searched, least-answered question in this trade. A range with
  honest caveats beats "prices from £X" and massively beats silence.

- Energy ratings explained (A++ to C, U-values in human terms)
- Guarantee and FENSA/CERTASS registration
- 3–6 FAQs — these feed the FAQPage schema and win People Also Ask placements
- Real photos of *their* work
- CTA at top and bottom

**Internal linking**

- Service pages ↔ the area pages where that service is sold
- Blog posts → the service page they support
- Every page → `/contact/`
- Avoid "click here"; the anchor text should say what's on the other end

**Images.** WebP, descriptive filenames (`composite-door-stockport-anthracite.webp`), alt text
that describes the image rather than repeating the keyword. Geotagging photos is not a ranking
factor — Google strips EXIF — so don't waste time on it.

---

## Stage 5 — Citations & NAP

Consistency matters more than volume. **Identical** name, address and phone everywhere —
"Ltd" vs "Limited" and a changed phone number are the two things that actually cause problems.

**Tier 1 — always do**
Google Business Profile · Bing Places · Apple Business Connect · Facebook · Yell ·
Checkatrade · **FENSA or CERTASS directory** (high-trust and trade-specific) · TrustMark

**Tier 2 — worth the hour**
Thomson Local · FreeIndex · Cylex · Scoot · Yelp UK · 192.com · Bark · Which? Trusted Traders
(paid, but converts well in this market)

**Tier 3 — local**
Chamber of commerce · town business directories · local news sponsorships · sponsored junior
football kit (a genuinely good local link, and it sells)

Skip paid citation-blasting services. Hundreds of junk listings add nothing and create NAP
inconsistencies that take longer to clean than they took to buy.

---

## Stage 6 — Content that actually earns links and trust

The blog is not for keyword volume. Three angles that work in this trade:

1. **Cost content.** "How much do new windows cost in [region] in 2026" — highest-intent
   search there is, and almost every competitor dodges it.

2. **Regulatory/explainer.** FENSA certificates, Building Regs Part L, what a conservation
   area means for your windows, trickle vents. Genuine confusion, genuine search volume,
   positions the installer as the expert.

3. **Local project write-ups.** "Sash-style uPVC on a 1930s semi in Heaton Moor" — photos,
   the problem, the solution, the cost bracket. These support the area pages with real
   evidence and are the natural home for the local specificity the template demands.

Cadence: one solid post a month beats four thin ones. Never publish AI-spun filler — this
market is small enough that credibility is the product.

---

## Stage 7 — Launch checklist

Run in order. Nothing gets skipped.

1. `CLIENT=<slug> npm run build` — passes (SEO guardrails are build-blocking)
2. `CLIENT=<slug> npm run qa` — passes (duplicate meta, H1 count, alt text, JSON-LD, broken
   links, orphan pages, cross-client duplicate content)

3. **Turn off Netlify site SSO** — `sso_login: false`. New sites are created behind a login
   wall by default and the team-level default can't be changed below Enterprise.
   **A site left locked returns 401 to Googlebot and will never index.** Blocking step.

4. Custom domain + SSL, `www` vs apex chosen and the other redirected
5. Live check: `/robots.txt`, `/sitemap-index.xml`, canonicals, `/thank-you/` noindex
6. Google Search Console — verify, submit sitemap, set the target country
7. Bing Webmaster Tools — import from GSC, 2 minutes
8. Plausible confirmed recording
9. GHL form tested end to end — submission → CRM → notification → thank-you page
10. Phone number tested from a mobile (click-to-call)
11. Rich Results Test on home, a service page and an area page
12. GBP website link updated to the new domain
13. If replacing an old site: 301 map for every old URL with traffic — **check before
    switching DNS, not after**

---

## Stage 8 — Ongoing (per client, per month)

- Search Console: impressions, clicks, average position, new queries
- GBP Insights: calls, direction requests, searches — the numbers the client actually cares
  about

- Review count and rating trend
- One blog post
- Two GBP posts
- Update `localProof` on area pages as real jobs accumulate — the area pages should get
  *more* specific over time, not stay frozen at launch

**Report to the client in their language:** calls, quote requests, jobs won. Not impressions.

---

## Realistic timeline

Set this expectation at the sale, in writing. Managing it is most of the account-management job.

| When | What to expect |
| --- | --- |
| Weeks 1–2 | Indexed, branded searches working |
| Weeks 3–8 | Long-tail and low-competition town rankings appear |
| Months 3–6 | Map pack movement — driven mostly by review velocity |
| Months 6–12 | Competitive head terms in the main town |

Anyone promising page one in a month is either lying or aiming at a term nobody searches.
