/**
 * Home-page hero options.
 *
 * Default: the split hero (headline + quote form side by side). Clients who
 * want the centered full-bleed format set `home.heroLayout: 'centered'` and a
 * `home.hero` block; the form then moves into its own section directly under
 * the hero, which the hero CTA links to.
 */
import { site } from './client.mjs';
import { validateCenteredHero } from './lp.mjs';

export function homeConfig() {
  return site.home ?? {};
}

export function homeCentered() {
  return homeConfig().heroLayout === 'centered';
}

export function homeHero() {
  const home = homeConfig();
  if (!homeCentered()) return null;
  if (!home.hero) {
    throw new Error(
      "home.heroLayout: 'centered' requires a home.hero block (headline, and optionally rotate/slides)"
    );
  }
  return validateCenteredHero(home.hero, 'home.hero');
}
