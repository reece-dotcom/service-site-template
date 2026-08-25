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
  if (route === '/' || route === '/thank-you/') continue;
  if (!linked.has(route)) fails.push(`orphan page (nothing links to it): ${route}`);
}

for (const [t, rs] of titles) if (rs.length > 1) fails.push(`duplicate title "${t}" on ${rs.join(', ')}`);
for (const [d, rs] of descs) if (rs.length > 1) fails.push(`duplicate meta description on ${rs.join(', ')}`);

// Sitemap + robots
if (!fs.existsSync(path.join(dist, 'sitemap-index.xml'))) fails.push('sitemap-index.xml not generated');
if (!fs.existsSync(path.join(dist, 'robots.txt'))) fails.push('robots.txt not generated');

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

console.log(`\nQA: ${pages.length} pages, client "${active}"\n`);
for (const w of warns) console.log(`  ⚠  ${w}`);
if (fails.length) {
  console.log('');
  for (const f of fails) console.log(`  ✗  ${f}`);
  console.log(`\n${fails.length} failure(s).\n`);
  process.exit(1);
}
console.log(`  ✓ all checks passed${warns.length ? ` (${warns.length} warning(s))` : ''}\n`);
