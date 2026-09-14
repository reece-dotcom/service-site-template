/**
 * Home-page config readers.
 *
 * The home page follows the "Glazing Master Template" (Reece's artifact,
 * 2026-09-11) section for section. Every section reads from `site.home.*`,
 * falls back to the matching `site.lp.*` block where one exists (so a client
 * whose landing page already carries promises or jobs does not repeat them),
 * and renders nothing when there is no data. The claim guards live in lp.mjs
 * and apply equally here: a statistic needs a basis, a quote needs a source,
 * finance needs an FCA reference.
 */
import { getCollection } from 'astro:content';
import { site } from './client.mjs';
import {
  validateCenteredHero,
  validateStat,
  validateJobs,
  validateAnnounce,
  validateFinance,
  validatePromises,
} from './lp.mjs';

export function homeConfig() {
  return site.home ?? {};
}
const lp = () => site.lp ?? {};

/**
 * The centered hero is the default for every site now. `heroLayout: 'split'`
 * keeps the old side-by-side hero for a client who wants it.
 */
export function homeCentered() {
  return homeConfig().heroLayout !== 'split';
}

/** Hero content; a client with no home.hero gets the tagline as the headline. */
export function homeHero() {
  if (!homeCentered()) return null;
  const hero = homeConfig().hero ?? { headline: site.business.tagline };
  return validateCenteredHero(hero, 'home.hero');
}

export const homeAnnounce = () => validateAnnounce(homeConfig().announce, 'home.announce');

/** Up to four figures in the glass panel under the hero. Real numbers only. */
export function homeStats() {
  const stats = homeConfig().stats ?? [];
  if (stats.length > 4) throw new Error('[home] home.stats supports at most 4 figures');
  for (const s of stats) {
    if (!s.value || !s.label) throw new Error('[home] every home.stats entry needs `value` and `label`');
  }
  return stats;
}

export const homeStat = () => validateStat(homeConfig().stat ?? lp().stat, 'home.stat');
export const homeFinance = () => validateFinance(homeConfig().finance ?? lp().finance, 'home.finance');
export const homePromises = () => validatePromises(homeConfig().promises ?? site.business.promises ?? lp().promises ?? [], 'home.promises');

/**
 * Recent jobs. Explicit `home.jobs` / `lp.jobs` first; otherwise the gallery
 * photos become jobs with no quote, which is the honest version for a client
 * with no published reviews yet.
 */
export function homeJobs() {
  const explicit = homeConfig().jobs ?? lp().jobs;
  if (explicit) return validateJobs(explicit, 'home.jobs');
  return (site.media?.gallery ?? []).map((g) => ({ title: g.caption ?? g.alt, image: g.src, alt: g.alt }));
}

/**
 * "Tell us what the job is" panes. Explicit `home.panes`, else one pane per
 * service (top four by order), which is always true for the client.
 */
export async function homePanes() {
  const explicit = homeConfig().panes;
  if (explicit?.length) {
    for (const p of explicit) {
      if (!p.title || !p.href) throw new Error('[home] every home.panes entry needs `title` and `href`');
    }
    return explicit;
  }
  const services = (await getCollection('services'))
    .filter((s) => !s.data.draft)
    .sort((a, b) => a.data.order - b.data.order)
    .slice(0, 4);
  return services.map((s) => ({
    title: s.data.name,
    body: s.data.summary,
    href: `/services/${s.id}/`,
    cta: 'Get a price',
  }));
}
