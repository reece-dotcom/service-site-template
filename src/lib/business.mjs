/**
 * Small normalisers over site.config.mjs business data.
 *
 * Config fields are allowed to be written the short way (a string) or the
 * full way (an object). Everything in src/ must go through these helpers so a
 * short-form value can never end up rendered as "[object Object]" — which is
 * exactly what happened when accreditations gained the object form in v1.2.
 */
import { site } from './client.mjs';

/**
 * Accreditations as a consistent { name, id, url } list.
 * Accepts 'FENSA registered' or { name, id, url }.
 */
export function accreditationList() {
  return (site.business.accreditations ?? [])
    .map((a) => (typeof a === 'string' ? { name: a } : a))
    .filter((a) => a && a.name);
}

/** Accreditation names only — for footers, strips and sentence copy. */
export function accreditationNames() {
  return accreditationList().map((a) => a.name);
}

/**
 * The current promotional offer, or null.
 *
 * `expires` (YYYY-MM-DD) is REQUIRED and must be in the future. An offer with
 * no end date, or one whose date has passed, is simply not rendered.
 *
 * This is deliberate, not fussiness. Evergreen "offer ends this month"
 * banners that never actually end are a misleading commercial practice under
 * the CPRs, and since the DMCC Act 2024 the CMA can fine directly for it.
 * If the client wants urgency, the deadline has to be real: change the date
 * and rebuild.
 */
export function activeOffer(now = new Date()) {
  const offer = site.business.offer;
  if (!offer || !offer.expires) return null;
  const end = new Date(`${offer.expires}T23:59:59Z`);
  if (Number.isNaN(end.getTime()) || end < now) return null;
  return { ...offer, endsAt: end };
}
