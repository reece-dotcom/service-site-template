/**
 * Second-language support (Welsh, and anything after it).
 *
 * THE RULE THAT MATTERS: the English site never moves. Translated pages are
 * added alongside it under a prefix (/cy/...), and each pair cross-declares
 * hreflang. Google then treats them as two language versions of one page
 * instead of duplicates, and nothing that ranks today can lose its URL.
 *
 * Why a subfolder and not cy.domain.co.uk or a .cymru domain: a subfolder
 * inherits the authority the main domain has already earned. A subdomain or a
 * separate domain starts from zero, which for a one-van local business means
 * it never really starts at all.
 *
 * THE SAFETY VALVE: a locale is only indexable once `reviewed: true`. Machine
 * translation is fine as a drafting tool, but unreviewed machine Welsh that
 * Google has indexed is worse than no Welsh at all — it advertises to the
 * exact audience you are courting that you could not be bothered. Until a
 * native speaker has signed the pages off, they build, they are visible on a
 * live URL for that reviewer to read, and they carry noindex + stay out of
 * the sitemap.
 */
import { site } from './client.mjs';

/** @returns {{code:string,prefix:string,label:string,reviewed:boolean,htmlLang:string}[]} */
export function alternateLocales() {
  return (site.locales?.alternates ?? []).map((l) => ({
    reviewed: false,
    htmlLang: l.code,
    ...l,
  }));
}

export const defaultLocale = () => site.locales?.default ?? 'en-GB';

export function localeByCode(code) {
  return alternateLocales().find((l) => l.code === code);
}

/** Normalise to a trailing-slash path so English and translated sides always compare equal. */
export const normalisePath = (p) => {
  if (!p) return '/';
  let out = p.startsWith('/') ? p : `/${p}`;
  if (!out.endsWith('/')) out += '/';
  return out.replace(/\/{2,}/g, '/');
};

/**
 * Build the hreflang set for a page from the English path it corresponds to.
 * Emitted on BOTH sides — an hreflang that is not reciprocated is ignored by
 * Google, which is the single most common way this gets implemented wrongly.
 *
 * @param {string} enPath English path of this page pair
 * @param {{code:string,path:string}[]} translations available translated paths
 */
export function hreflangSet(enPath, translations) {
  const en = normalisePath(enPath);
  const out = [
    { hreflang: defaultLocale(), path: en },
    { hreflang: 'x-default', path: en },
  ];
  for (const t of translations) {
    const loc = localeByCode(t.code);
    if (!loc) continue;
    out.push({ hreflang: loc.code, path: normalisePath(t.path) });
  }
  return out;
}

/**
 * Guard: a translated page must point at an English page that exists.
 * A dangling enPath produces a one-way hreflang, which is silently ignored —
 * so it fails the build instead.
 */
export function assertPairing(cyRoute, enPath, englishRoutes) {
  const en = normalisePath(enPath);
  if (!englishRoutes.has(en)) {
    throw new Error(
      `[i18n] ${cyRoute} declares enPath "${en}", which is not an English page on this site.\n` +
        `Translated pages must pair with a real English URL or the hreflang is ignored.\n` +
        `Known English routes include: ${[...englishRoutes].slice(0, 8).join(', ')}...`
    );
  }
}
