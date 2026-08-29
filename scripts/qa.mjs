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
const pages = htmlFiles.map((f) => ({ route: routeOf(f), html: fs.readFileSync(f, 'utf8') }));

const titles = new Map();
const descs = new Map();
const linked = new Set(['/']);

for (const { route, html } of pages) {
  const noindex = /name="robots"[^>]*noindex/.test(html);

  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
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

// Broken internal links + orphan pages
const routes = new Set(pages.map((p) => p.route));
for (const href of linked) {
  if (href.startsWith('/_astro/') || /\.[a-z0-9]+$/i.test(href)) continue;
  if (!routes.has(href)) fails.push(`broken internal link: ${href}`);
}
for (const route of routes) {
  // '/404.html' is deliberately unlinked (Netlify serves it on a miss) and
  // '/thank-you/' is reached by form redirect only.
  if (route === '/' || route === '/thank-you/' || route === '/404.html') continue;
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

console.log(`\nQA: ${pages.length} pages, client "${active}"\n`);
for (const w of warns) console.log(`  ⚠  ${w}`);
if (fails.length) {
  console.log('');
  for (const f of fails) console.log(`  ✗  ${f}`);
  console.log(`\n${fails.length} failure(s).\n`);
  process.exit(1);
}
console.log(`  ✓ all checks passed${warns.length ? ` (${warns.length} warning(s))` : ''}\n`);
