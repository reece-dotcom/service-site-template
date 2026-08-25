/**
 * Multi-tenant client resolution.
 *
 * One codebase, many clients. The client is selected with the CLIENT env var,
 * which each Netlify site sets to its own slug:
 *
 *   CLIENT=demo-glazing npm run build
 *
 * Never hardcode client values anywhere in src/. Everything comes from
 * clients/<slug>/site.config.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const CLIENT = process.env.CLIENT || 'demo-glazing';

export const clientDir = path.resolve(process.cwd(), 'clients', CLIENT);

if (!fs.existsSync(clientDir)) {
  const available = fs.existsSync(path.resolve(process.cwd(), 'clients'))
    ? fs.readdirSync(path.resolve(process.cwd(), 'clients')).join(', ')
    : '(none)';
  throw new Error(
    `Unknown CLIENT "${CLIENT}". No folder at clients/${CLIENT}. Available: ${available}`
  );
}

/** Absolute path to a subfolder of the active client's content. */
export const contentPath = (...parts) => path.join(clientDir, 'content', ...parts);

const configUrl = pathToFileURL(path.join(clientDir, 'site.config.mjs')).href;

/** @type {import('./site-config-schema.mjs').SiteConfig} */
export const site = (await import(/* @vite-ignore */ configUrl)).default;
