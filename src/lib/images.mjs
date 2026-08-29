/**
 * Per-client image resolution.
 *
 * Drop images in clients/<slug>/images/ and reference them by filename in
 * site.config.mjs or content frontmatter. Returns Astro ImageMetadata so
 * every image goes through <Image /> (WebP + width/height, no CLS).
 * Returns null when the client has no such image — every component that uses
 * images must render fine without them, because early demos often have none.
 */
import { CLIENT } from './client.mjs';

const all = import.meta.glob('/clients/*/images/*.{webp,jpg,jpeg,png,avif}', {
  eager: true,
});

export function clientImage(name) {
  if (!name) return null;
  const mod = all[`/clients/${CLIENT}/images/${name}`];
  return mod?.default ?? null;
}

export function clientImages(names = []) {
  return names.map((n) => ({ ...n, asset: clientImage(n.src) })).filter((n) => n.asset);
}
