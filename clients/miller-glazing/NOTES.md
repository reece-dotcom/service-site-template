# Miller Glazing — working notes

Handover state as of commit `bdb46e1` (2026-09-13). Read this before editing
anything in this folder.

## The business (verified, do not "improve" these)
- Miller Glazing Ltd, Companies House **15428989**, incorporated 21 Jan 2024.
  Directors **Liam William Hales** and **Kai Hales** — two brothers.
- Because it incorporated in 2024, **it is not allowed to claim years of
  experience.** The preview site said "over 5 years of industry experience";
  that was removed and must not come back.
- Phone **07411 290295**. Email Millerglazing@gmail.com.
- Checkatrade member since March 2025, **0 reviews**.
- **No Google Business Profile yet.** No FENSA, no CERTASS, no reviews, no
  finance offering, no completed-job counts. Anything of that shape is a
  fabricated claim — leave it out until Liam supplies evidence.
- Registered office (49 Hedingham Road, Dagenham RM8 2NA) is **residential**
  and is deliberately not published. `googlePlaceId` is empty and the contact
  page shows a coverage map, not a pin on the house.

## Positioning
Steel-look (Crittall-style) **internal** doors first — that is what the photos
show and what the business actually sells. The old preview's "sliding glass
door repair" angle is superseded.

## Hero
Both `/` and `/lp/` use `src/components/CenteredHero.astro`: centered headline
with a rotating word and a background photo carousel synced to it, on a shared
12s CSS cycle, no client-side JS.

- `/lp/` reads `lp.hero`, the home page reads `home.hero` with
  `home.heroLayout: 'centered'`. Omit the `home` block and the site falls back
  to the split hero, which is what the other clients still use.
- **Photo N pairs with word N.** The build fails on a count mismatch — that is
  intentional, don't work around it by deleting the check.
- The home H1 is "In east London we fit …" rather than "We fit …" so the H1
  still carries a location and a service. Keep a place name in it.
- The rotating pill animates the **word inside** the pill; the pill background
  stays still. Animating the pill itself looks broken.
- Max 5 slides — the CSS keyframes only exist up to 5.

## Open items (need Liam, not code)
1. Confirm phone 07411 290295 and real opening hours (currently placeholder
   Mon–Sat 8am–8pm, Sun 8am–5pm).
2. Confirm the towns: Barking, Brentwood, Dagenham, Hornchurch, Ilford,
   Rainham, Romford.
3. Does he fit windows / external doors, and under which scheme?
4. Photo of Liam and Kai + 2–3 sentences on how they started, for the owner
   section.
5. Google Business Profile must be created **in his name**; we take Manager
   access. Search Console once a domain points here.
6. `millerglazing.co.uk` is registered (Squarespace, expired) — establish
   whether it is his before buying anything else.
7. Forms still post to Netlify Forms; swap to the GHL endpoint for his
   sub-account.

## Deploy
Netlify site `glazeos-miller-glazing`, id `693773ee-37fb-4e48-beda-12be624c74dd`,
https://glazeos-miller-glazing.netlify.app. Currently **manual zip deploys**.
To deploy from git instead, link this repo in the Netlify UI with build command
`CLIENT=miller-glazing npm run build` and publish directory `dist`.

Always run `rm -rf dist && CLIENT=miller-glazing npm run build && CLIENT=miller-glazing npm run qa`
before shipping — without `CLIENT` set, both commands silently operate on
`demo-glazing`.
