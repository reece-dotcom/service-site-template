#!/usr/bin/env node
/**
 * Pre-launch QA. Run after `CLIENT=<slug> npm run build`.
 *
 *   CLIENT=demo-glazing npm run qa
 *
 * Checks the things that silently cost rankings: duplicate or missing meta,
 * multiple H1s, orphan pages, broken internal links, invalid JSON-LD,
 * stray client-side JS, and — the big one for a shared template —
 * duplicate content across clients.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { themeIssues } from '../src/lib/theme.mjs';

const dist = path.resolve(process.cwd(), 'dist');
const fails = [];
const warns = [];

if (!fs.existsSync(dist)) {
  console.error('No dist/ — run the build first.');
  process.exit(1);
}

const htmlFiles = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) htmlFiles.push(p);
  }
})(dist);

const routeOf = (f) => '/' + path.relative(dist, f).replace(/index\.html$/, '');
// Google measures the decoded text: "&amp;" is one character, not five. A
// business with "&" in its name was failing the title cap on every page.
const decode = (s) => s?.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const pages = htmlFiles.map((f) => ({ route: routeOf(f), html: fs.readFileSync(f, 'utf8') }));

const titles = new Map();
const descs = new Map();
const linked = new Set(['/']);

for (const { route, html } of pages) {
  const noindex = /name="robots"[^>]*noindex/.test(html);

  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1]);
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1]);
  const canon = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const h1s = html.match(/<h1[\s>]/g)?.length ?? 0;

  if (!title) fails.push(`${route}: missing <title>`);
  else if (title.length > 60) fails.push(`${route}: title ${title.length} chars (max 60)`);
  if (!desc) fails.push(`${route}: missing meta description`);
  else if (desc.length > 160) fails.push(`${route}: meta description ${desc.length} chars (max 160)`);
  if (!canon) fails.push(`${route}: missing canonical`);
  if (h1s !== 1) fails.push(`${route}: ${h1s} <h1> elements (must be exactly 1)`);

  if (!noindex) {
    if (title) titles.set(title, [...(titles.get(title) ?? []), route]);
    if (desc) descs.set(desc, [...(descs.get(desc) ?? []), route]);
  }

  // Alt text on every image
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
    if (!/\balt=/.test(img)) fails.push(`${route}: <img> without alt attribute`);
  }

  // JSON-LD must parse
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch {
      fails.push(`${route}: invalid JSON-LD`);
    }
  }

  // No client-side JS beyond the allowed analytics snippet
  for (const s of html.match(/<script\b[^>]*>/g) ?? []) {
    if (/application\/ld\+json/.test(s)) continue;
    if (/plausible\.io|googletagmanager\.com/.test(s)) continue;
    warns.push(`${route}: unexpected <script> — justify or remove: ${s.slice(0, 90)}`);
  }

  // Internal links
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) linked.add(m[1]);
}

// Short-form config values rendered as objects. This shipped live once when
// accreditations gained the { name, id, url } object form and the trust strip
// was still printing the raw value.
for (const { route, html } of pages) {
  if (html.includes('[object Object]')) fails.push(`${route}: "[object Object]" in the HTML — a config object rendered directly`);
}

// A promotional offer must carry a real, future end date. An evergreen
// countdown is a misleading commercial practice (CPRs / DMCC Act 2024) and
// the client carries the liability, so it fails the build rather than warns.
{
  const offer = (await import('../clients/' + (process.env.CLIENT || 'demo-glazing') + '/site.config.mjs')).default.business.offer;
  if (offer) {
    if (!offer.expires) fails.push('business.offer has no `expires` date — offers must end on a real date');
    else if (new Date(`${offer.expires}T23:59:59Z`) < new Date()) warns.push(`business.offer expired on ${offer.expires} — it is no longer rendered; update or remove it`);
    if (!offer.items?.length) fails.push('business.offer has no items');
  }
}

// A numeric claim rendered with no number. This shipped once as a bare "+"
// above "years installing locally" on a client with no yearFounded set.
for (const { route, html } of pages) {
  if (/>\s*\+\s*<\/strong>/.test(html) || /NaN/.test(html)) {
    fails.push(`${route}: a statistic rendered with no value (empty "+" or NaN)`);
  }
}

// Installer-specific template copy leaking onto a client who does not install
// anything. The copy layer (src/lib/copy.mjs) exists to prevent this; this
// check catches the next hardcoded string someone adds.
{
  const cfg = (await import('../clients/' + (process.env.CLIENT || 'demo-glazing') + '/site.config.mjs')).default;
  const installs = cfg.copy?.installs !== false;
  if (!installs) {
    for (const { route, html } of pages) {
      const body = html.replace(/<script[\s\S]*?<\/script>/g, '');
      const hit = body.match(/\b(we install|installers|installed by|what we install)\b/i);
      if (hit) fails.push(`${route}: installer wording "${hit[0]}" on a client with copy.installs === false`);
    }
  }
}

/**
 * KEYWORD COVERAGE.
 *
 * "Is the term we are targeting actually on the page?" is the one on-page
 * question that is worth automating, because it is the one that silently goes
 * wrong: copy gets rewritten, a heading gets tightened, and the phrase the
 * page was built to rank for quietly disappears. It matters twice as much on
 * translated pages, where nobody editing the English side can read the Welsh.
 *
 * Declare terms in the page's `targets:` frontmatter. The first is primary and
 * should appear in the title or the H1. Matching ignores case and accents so
 * "Ynys Mon" matches "Ynys Môn".
 */
{
  const fold = (t) =>
    t
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\u2018\u2019]/g, "'")
      .toLowerCase()
      .replace(/\s+/g, ' ');
  const textOf = (html) =>
    fold(
      html
        .replace(/<script[\s\S]*?<\/script>/g, ' ')
        .replace(/<style[\s\S]*?<\/style>/g, ' ')
        .replace(/<[^>]+>/g, ' ')
    );

  const clientsRoot = path.resolve(process.cwd(), 'clients');
  const activeSlug = process.env.CLIENT || 'demo-glazing';
  const contentRoot = path.join(clientsRoot, activeSlug, 'content');
  const routeFor = (rel) => {
    const noExt = rel.replace(/\.md$/, '');
    const [dir, ...rest] = noExt.split(path.sep);
    const tail = rest.join('/');
    if (dir === 'services') return `/services/${tail}/`;
    if (dir === 'areas') return `/areas/${tail}/`;
    if (dir === 'cy') return tail === 'index' ? '/cy/' : `/cy/${tail}/`;
    return null;
  };
  const mdFiles = [];
  if (fs.existsSync(contentRoot))
    (function walk(dir) {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p2 = path.join(dir, e.name);
        if (e.isDirectory()) walk(p2);
        else if (e.name.endsWith('.md')) mdFiles.push(path.relative(contentRoot, p2));
      }
    })(contentRoot);

  const byRoute = new Map(pages.map((p2) => [p2.route, p2.html]));
  for (const rel of mdFiles) {
    const route = routeFor(rel);
    if (!route) continue;
    const raw = fs.readFileSync(path.join(contentRoot, rel), 'utf8');
    const fm = raw.match(/^---\n([\s\S]*?)\n---/)?.[1];
    if (!fm) continue;
    const block = fm.match(/^targets:\n((?:\s+-\s+.*\n?)+)/m)?.[1];
    if (!block) continue;
    const terms = [...block.matchAll(/-\s+"?([^"\n]+?)"?\s*$/gm)].map((m) => m[1]);
    const html = byRoute.get(route);
    if (!html) {
      warns.push(`${rel}: declares targets but no page was built at ${route}`);
      continue;
    }
    const body = textOf(html);
    for (const term of terms) {
      if (!body.includes(fold(term))) {
        fails.push(`${route}: target term "${term}" is not on the page (declared in ${rel})`);
      }
    }
    // Primary term belongs in the title or the H1, not just buried in body copy.
    const head = fold(
      (html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '') +
        ' ' +
        (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '').replace(/<[^>]+>/g, ' ')
    );
    if (terms[0] && !head.includes(fold(terms[0]))) {
      warns.push(`${route}: primary target "${terms[0]}" is in neither the title nor the H1`);
    }
  }
}

/**
 * A language the business cannot actually speak must not be promised.
 * Dawelen's owner does not speak Welsh — the site is translated, the phone is
 * answered in English — so "Welsh spoken" anywhere on it would be a claim that
 * fails on the first call. Only allowed when the client states the capability
 * in business.languages.
 */
{
  const cfg = (await import('../clients/' + (process.env.CLIENT || 'demo-glazing') + '/site.config.mjs')).default;
  const speaks = (cfg.business?.languages ?? []).map((l) => l.toLowerCase());
  if (!speaks.includes('cy') && !speaks.includes('welsh')) {
    const claims = /(welsh spoken|siarad cymraeg|croeso i chi siarad cymraeg|yn gymraeg ar y ff[oô]n|we speak welsh)/i;
    for (const { route, html } of pages) {
      const body = html.replace(/<script[\s\S]*?<\/script>/g, '');
      const hit = body.match(claims);
      if (hit) fails.push(`${route}: claims Welsh-speaking service ("${hit[0]}") but business.languages does not include it`);
    }
  }
}

const areaRoutes = pages.filter((p) => /^\/areas\/[^/]+\/$/.test(p.route)).length;
// Area pages must link sideways. An area page that links only to services is a
// dead end for a crawler and for the visitor in the next village along.
for (const { route, html } of pages) {
  if (!/^\/areas\/[^/]+\/$/.test(route)) continue;
  const others = new Set(
    [...html.matchAll(/href="\/areas\/([^"/]+)\/"/g)].map((m) => m[1])
  );
  others.delete(route.split('/')[2]);
  // A client with only two towns cannot link to two others.
  if (others.size < Math.min(2, areaRoutes - 1)) warns.push(`${route}: links to only ${others.size} other area page(s) — nearby-area links missing?`);
}

// Service x area pages: each one must be reachable and must not be a near-copy
// of its own parents (the build guards the intro; this guards the rendered page).
for (const { route, html } of pages) {
  if (!/^\/services\/[^/]+\/in\/[^/]+\/$/.test(route)) continue;
  const [, , svc, , area] = route.split('/');
  if (!html.includes(`href="/services/${svc}/"`)) fails.push(`${route}: no link back to the parent service page`);
  if (!html.includes(`href="/areas/${area}/"`)) fails.push(`${route}: no link back to the area page`);
}

// Broken internal links + orphan pages
const routes = new Set(pages.map((p) => p.route));

/**
 * hreflang must be reciprocal, or Google ignores it entirely. The build pairs
 * the pages; this confirms the pairing survived into the HTML on both sides.
 */
for (const { route, html } of pages) {
  const tags = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
  if (!tags.length) continue;
  if (!tags.some(([, lang]) => lang === 'x-default')) {
    fails.push(`${route}: hreflang set with no x-default`);
  }
  for (const [, , href] of tags) {
    const p2 = new URL(href).pathname;
    if (!routes.has(p2)) {
      fails.push(`${route}: hreflang points at ${p2}, which is not a page on this site`);
      continue;
    }
    const other = pages.find((x) => x.route === p2);
    if (other && other.route !== route && !other.html.includes(`href="${new URL(href).origin}${route}"`)) {
      fails.push(`${route}: hreflang to ${p2} is not reciprocated — Google ignores one-way hreflang`);
    }
  }
}

for (const href of linked) {
  if (href.startsWith('/_astro/') || /\.[a-z0-9]+$/i.test(href)) continue;
  if (!routes.has(href)) fails.push(`broken internal link: ${href}`);
}
for (const route of routes) {
  // '/404.html' is deliberately unlinked (Netlify serves it on a miss) and
  // '/thank-you/' is reached by form redirect only.
  // '/lp/' is reached from paid ads only and is deliberately unlinked.
  if (route === '/' || route === '/thank-you/' || route === '/404.html' || route === '/lp/') continue;
  if (!linked.has(route)) fails.push(`orphan page (nothing links to it): ${route}`);
}

for (const [t, rs] of titles) if (rs.length > 1) fails.push(`duplicate title "${t}" on ${rs.join(', ')}`);
for (const [d, rs] of descs) if (rs.length > 1) fails.push(`duplicate meta description on ${rs.join(', ')}`);

// Sitemap + robots
if (!fs.existsSync(path.join(dist, 'sitemap-index.xml'))) fails.push('sitemap-index.xml not generated');
if (!fs.existsSync(path.join(dist, 'robots.txt'))) fails.push('robots.txt not generated');

// Sitemap priorities: without serialize() every page ships weighted the same,
// which wastes the one signal a small site has for saying what matters.
{
  const smFile = fs
    .readdirSync(dist)
    .find((f) => /^sitemap-\d+\.xml$/.test(f));
  if (!smFile) fails.push('no sitemap-0.xml — sitemap integration produced no URL set');
  else {
    const sm = fs.readFileSync(path.join(dist, smFile), 'utf8');
    if (!sm.includes('<priority>')) fails.push('sitemap has no <priority> values (serialize() missing from astro.config.mjs)');
    if (!sm.includes('<priority>1.0</priority>')) fails.push('sitemap does not give the home page priority 1.0');
    if (!sm.includes('<changefreq>')) fails.push('sitemap has no <changefreq> values');
  }
}

// Pages every local service site must have. The 404 keeps mistyped and
// migrated URLs alive; /about/ is the E-E-A-T page and the only place a real
// named human appears.
for (const required of ['/about/', '/404.html']) {
  if (!routes.has(required)) fails.push(`required page missing: ${required}`);
}

/**
 * Cross-client duplicate content — the defining risk of a shared template.
 * Compares this client's markdown body text against every other client's.
 */
const clientsDir = path.resolve(process.cwd(), 'clients');
const active = process.env.CLIENT || 'demo-glazing';
const bodies = (slug) => {
  const out = [];
  const root = path.join(clientsDir, slug, 'content');
  if (!fs.existsSync(root)) return out;
  (function w(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) w(p);
      else if (e.name.endsWith('.md')) {
        const raw = fs.readFileSync(p, 'utf8').replace(/^---[\s\S]*?---/, '');
        out.push({ file: `${slug}/${path.relative(root, p)}`, text: raw });
      }
    }
  })(root);
  return out;
};
const shingles = (t) => {
  const w = t.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  return new Set(w.slice(0, -6).map((_, i) => w.slice(i, i + 7).join(' ')));
};
const mine = bodies(active).map((b) => ({ ...b, s: shingles(b.text) }));
for (const slug of fs.readdirSync(clientsDir)) {
  if (slug === active) continue;
  // Prospect demos are never live, so they cannot duplicate anything on the
  // web. They are still checked as the ACTIVE client, so a demo built by
  // copying a real client's copy is caught before it is ever promoted.
  if (slug.startsWith('prospect-')) continue;
  for (const other of bodies(slug)) {
    const os = shingles(other.text);
    for (const m of mine) {
      if (!m.s.size || !os.size) continue;
      let shared = 0;
      for (const s of m.s) if (os.has(s)) shared++;
      const pct = Math.round((shared / m.s.size) * 100);
      if (pct > 25) fails.push(`duplicate content ${pct}% between ${m.file} and ${other.file}`);
      else if (pct > 12) warns.push(`${pct}% content overlap: ${m.file} vs ${other.file}`);
    }
  }
}

// Structured-data + AEO checks. These are the things that are invisible in the
// browser, so nothing else catches them if a page or component regresses.
{
  const schemaOf = (html) => {
    const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (!m) return null;
    try {
      return JSON.parse(m[1]);
    } catch {
      return 'invalid';
    }
  };
  for (const { route, html } of pages) {
    // The landing page carries no business schema on purpose: it is noindex,
    // so emitting a second LocalBusiness graph would only give Google a
    // competing entity for the same NAP.
    if (route === '/lp/') continue;
    const j = schemaOf(html);
    if (j === null) {
      fails.push(`${route}: no JSON-LD block`);
      continue;
    }
    if (j === 'invalid') {
      fails.push(`${route}: JSON-LD does not parse`);
      continue;
    }
    const types = j.map((x) => x['@type']);
    const biz = j[0];
    if (!biz?.areaServed) fails.push(`${route}: business schema has no areaServed`);
    if (route === '/' && !biz?.hasOfferCatalog) {
      fails.push('/: business schema has no hasOfferCatalog');
    }
    // Every page below the top level should say where it sits.
    const depth = route.split('/').filter(Boolean).length;
    if (depth > 1 && !types.includes('BreadcrumbList')) {
      fails.push(`${route}: nested page with no BreadcrumbList schema`);
    }
    if (route === '/about/' && !types.includes('AboutPage')) {
      fails.push('/about/: no AboutPage schema');
    }
    // A service page that links to no sibling service is a dead end for both
    // crawlers and customers.
    if (/^\/services\/.+\//.test(route)) {
      // Footer links to every service on every page, so only count links in
      // the body — that is what actually passes context between pages.
      const body = html.split(/<footer\b/)[0];
      const siblings = new Set(
        [...body.matchAll(/href="(\/services\/[^"\/]+\/)"/g)].map((m) => m[1])
      );
      siblings.delete(route);
      if (siblings.size < 2) {
        fails.push(`${route}: links to only ${siblings.size} other service page(s) — internal link network too thin`);
      }
    }
  }

  const robots = fs.existsSync(path.join(dist, 'robots.txt'))
    ? fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8')
    : '';
  for (const bot of ['GPTBot', 'ClaudeBot', 'Google-Extended']) {
    if (!new RegExp(`User-agent: ${bot}\\nDisallow: /`).test(robots)) {
      fails.push(`robots.txt: training crawler ${bot} is not blocked`);
    }
  }
  for (const bot of ['OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot']) {
    if (!new RegExp(`User-agent: ${bot}\\nAllow: /`).test(robots)) {
      fails.push(`robots.txt: answer engine ${bot} is not explicitly allowed`);
    }
  }
}


/**
 * /lp/ advertising landing page.
 *
 * It only exists to convert paid clicks, so the failure modes are different
 * from the rest of the site: it must stay out of the index and the sitemap
 * (or it cannibalises the home page), and it must not quietly ship the
 * high-pressure claims the design ships with unless the client's config
 * supplied the evidence. The evidence guards throw at build time in
 * src/lib/lp.mjs; these are the checks on the built HTML.
 */
{
  const lpPage = pages.find((p) => p.route === '/lp/');
  if (lpPage) {
    const { html } = lpPage;
    if (!/name="robots"[^>]*noindex/.test(html)) {
      fails.push('/lp/: landing page is not noindex — it will compete with the home page');
    }
    const smFile = fs.readdirSync(dist).find((f) => /^sitemap-\d+\.xml$/.test(f));
    if (smFile && fs.readFileSync(path.join(dist, smFile), 'utf8').includes('/lp/')) {
      fails.push('/lp/: noindex landing page is listed in the sitemap');
    }
    const robotsTxt = fs.existsSync(path.join(dist, 'robots.txt'))
      ? fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8')
      : '';
    if (!/Disallow: \/lp\//.test(robotsTxt)) {
      fails.push('/lp/: not disallowed in robots.txt');
    }
    // A star rating or a quotation mark with no named platform next to it is
    // the fabricated-testimonial pattern we refuse to ship.
    if (/★/.test(html) && !/(Google|Checkatrade|Which\?|Trustpilot|Facebook)/.test(html)) {
      fails.push('/lp/: star rating with no named review platform — unsourced rating');
    }
    // Escape hatches: the landing page should offer the phone, the form and
    // nothing else. Links back into the site dilute the one job it has.
    const leaks = [...html.matchAll(/href="(\/[^"#?]*)"/g)]
      .map((m) => m[1])
      .filter((h) => h !== '/lp/' && !h.startsWith('/_astro/') && !/\.[a-z0-9]+$/i.test(h));
    if (leaks.length) {
      warns.push(`/lp/: links off the landing page to ${[...new Set(leaks)].join(', ')} — intentional?`);
    }
  }
}

// Theme contrast: a black-on-black hover or an invisible footer heading is
// something the owner spots in the first ten seconds.
{
  const cfgPath = path.resolve(process.cwd(), 'clients', active, 'site.config.mjs');
  if (fs.existsSync(cfgPath)) {
    const { default: cfg } = await import(pathToFileURL(cfgPath).href);
    fails.push(...themeIssues(cfg.theme));
  }
}

console.log(`\nQA: ${pages.length} pages, client "${active}"\n`);
for (const w of warns) console.log(`  ⚠  ${w}`);
if (fails.length) {
  console.log('');
  for (const f of fails) console.log(`  ✗  ${f}`);
  console.log(`\n${fails.length} failure(s).\n`);
  process.exit(1);
}
console.log(`  ✓ all checks passed${warns.length ? ` (${warns.length} warning(s))` : ''}\n`);
