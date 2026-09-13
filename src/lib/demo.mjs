/**
 * Prospect demo mode.
 *
 * A prospect demo is a full client site built from the Lighthouse call, before
 * they have signed. It lives in clients/prospect-<slug>/ with `demo.enabled`
 * set in site.config.mjs, and it differs from a live client site in three ways:
 *
 *   1. Every page is noindex and robots.txt disallows everything. A demo that
 *      Google indexes competes with the prospect's real site and, worse, ranks
 *      a page carrying their NAP on a netlify.app subdomain.
 *   2. A strip above the header says it is a preview built by Glaze OS.
 *   3. /lighthouse/ exists — the one-page review that goes with the demo,
 *      read from clients/<slug>/lighthouse.mjs.
 *
 * When the prospect signs, rename the folder (drop the prospect- prefix),
 * delete the `demo` block and lighthouse.mjs, and it is a normal client.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { site, clientDir } from './client.mjs';

export const isDemo = () => Boolean(site.demo?.enabled);

/** Who the review is from. Override per client with site.demo.agency. */
export const agency = () => ({
  name: 'Glaze OS',
  person: 'Reece',
  phone: '07547 445057',
  phoneHref: '+447547445057',
  email: 'reece@glazeos.io',
  ...(site.demo?.agency ?? {}),
});

const lighthousePath = path.join(clientDir, 'lighthouse.mjs');

export const hasLighthouse = () => isDemo() && fs.existsSync(lighthousePath);

export async function lighthouseReview() {
  if (!hasLighthouse()) return null;
  return (await import(/* @vite-ignore */ pathToFileURL(lighthousePath).href)).default;
}
