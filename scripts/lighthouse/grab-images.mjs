#!/usr/bin/env node
/**
 * Lighthouse helper: get a prospect's own photos into the demo.
 *
 *   node scripts/lighthouse/grab-images.mjs scan <page url>
 *       Lists the image URLs on a page (largest first, where the size is known).
 *
 *   node scripts/lighthouse/grab-images.mjs grab <slug> <name=url> [<name=url> ...]
 *       Downloads each image, resizes to max 1600px wide, saves as WebP at
 *       clients/<slug>/images/<name>.webp. Skips anything under 500px wide.
 *
 * Real photos of their work beat stock every time; a demo with the prospect's
 * own installs in it is the one they forward to their partner.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const [cmd, ...rest] = process.argv.slice(2);
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';

async function scan(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const html = await res.text();
  const base = res.url;
  const seen = new Map();
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    const src = tag.match(/\b(?:data-src|data-lazy-src|src)=["']([^"']+)/i)?.[1];
    const srcset = tag.match(/\bsrcset=["']([^"']+)/i)?.[1];
    let best = src;
    if (srcset) {
      const cands = srcset.split(',').map((s) => s.trim().split(/\s+/)).map(([u, w]) => [u, parseInt(w) || 0]).sort((a, b) => b[1] - a[1]);
      if (cands[0]) best = cands[0][0];
    }
    if (!best || /^data:/.test(best) || /\.svg(\?|$)/i.test(best)) continue;
    let abs;
    try { abs = new URL(best, base).href; } catch { continue; }
    const w = parseInt(tag.match(/\bwidth=["']?(\d+)/i)?.[1] ?? '0', 10);
    const alt = tag.match(/\balt=["']([^"']*)/i)?.[1] ?? '';
    if (!seen.has(abs)) seen.set(abs, { w, alt });
  }
  // CSS background images in inline styles
  for (const m of html.matchAll(/url\((['"]?)([^'")]+\.(?:jpe?g|png|webp))\1\)/gi)) {
    try { const abs = new URL(m[2], base).href; if (!seen.has(abs)) seen.set(abs, { w: 0, alt: '(background)' }); } catch {}
  }
  const rows = [...seen.entries()].sort((a, b) => b[1].w - a[1].w);
  if (!rows.length) return console.log('No images found on that page.');
  for (const [u, { w, alt }] of rows) console.log(`${w ? w + 'px' : '?'}\t${u}\t${alt}`);
}

async function grab(slug, pairs) {
  const dir = path.resolve('clients', slug, 'images');
  fs.mkdirSync(dir, { recursive: true });
  for (const pair of pairs) {
    const i = pair.indexOf('=');
    const name = pair.slice(0, i).replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    const url = pair.slice(i + 1);
    if (!name || !url) { console.error(`Skipping "${pair}" — use name=url`); continue; }
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, Referer: new URL(url).origin } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const img = sharp(buf);
      const meta = await img.metadata();
      if ((meta.width ?? 0) < 500) { console.log(`✗ ${name}: only ${meta.width}px wide, skipped`); continue; }
      const out = path.join(dir, `${name}.webp`);
      await img.rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
      const kb = Math.round(fs.statSync(out).size / 1024);
      console.log(`✓ ${name}.webp  ${Math.min(meta.width, 1600)}px  ${kb} KB`);
    } catch (e) {
      console.log(`✗ ${name}: ${e.message}`);
    }
  }
}

if (cmd === 'scan' && rest[0]) await scan(rest[0]);
else if (cmd === 'grab' && rest.length >= 2) await grab(rest[0], rest.slice(1));
else {
  console.error('Usage:\n  grab-images.mjs scan <url>\n  grab-images.mjs grab <slug> <name=url> ...');
  process.exit(1);
}
