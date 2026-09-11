/**
 * Service × area pages (/services/<service>/in/<area>/).
 *
 * These are the pages that actually rank for the money queries — "misted
 * double glazing repair holyhead" — and they are also the single fastest way
 * to get a small site classified as a doorway network. So they are opt-in per
 * area file and refuse to build without real, page-specific content.
 *
 * Rules, enforced at build time:
 *   1. `intro` must be 220+ characters written for THIS service in THIS town.
 *   2. `intro` must not be a rewrite of the parent service page or of the
 *      area page's localProof (7-word shingle overlap capped at 25%).
 *   3. The page must add something beyond the intro: points or faqs.
 *
 * If a guard throws, the answer is to write the page properly or to delete the
 * entry — never to relax the threshold.
 */
const shingles = (text, n = 7) => {
  const w = String(text).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const out = new Set();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(' '));
  return out;
};

export function overlapPct(a, b) {
  const sa = shingles(a);
  const sb = shingles(b);
  if (!sa.size || !sb.size) return 0;
  let shared = 0;
  for (const s of sa) if (sb.has(s)) shared++;
  return Math.round((shared / sa.size) * 100);
}

export function assertIntersection({ detail, area, service, serviceBody }) {
  const where = `serviceDetail "${detail.service}" in areas/${area.id}`;
  if (!service) {
    throw new Error(
      `[intersect] ${where}: no service with id "${detail.service}". Check the slug.`
    );
  }
  const intro = detail.intro ?? '';
  if (intro.length < 220) {
    throw new Error(
      `[intersect] ${where}: intro is ${intro.length} chars. A service-in-town page needs 220+ characters specific to this town, or it is a doorway page — write it or remove the entry.`
    );
  }
  if (!detail.points?.length && !detail.faqs?.length) {
    throw new Error(
      `[intersect] ${where}: add points or faqs. An intro alone does not justify a separate URL.`
    );
  }
  const vsArea = overlapPct(intro, area.data.localProof);
  if (vsArea > 25) {
    throw new Error(
      `[intersect] ${where}: intro is ${vsArea}% the same as the area page's localProof. Say something new or drop the page.`
    );
  }
  const vsService = overlapPct(intro, serviceBody ?? '');
  if (vsService > 25) {
    throw new Error(
      `[intersect] ${where}: intro is ${vsService}% the same as the parent service page. Say something new or drop the page.`
    );
  }
  return true;
}

/** Title/description for the pair, honouring per-entry overrides, capped at the SEO limits. */
export function intersectionSeo({ detail, area, service, business }) {
  const title = detail.title ?? `${service.data.name} in ${area.data.name} | ${business.name}`;
  const description =
    detail.description ??
    `${service.data.name} in ${area.data.name} — ${service.data.summary}`;
  if (title.length > 60) {
    throw new Error(
      `[intersect] ${service.id}/in/${area.id}: title is ${title.length} chars. Set a shorter \`title\` on the serviceDetail entry.`
    );
  }
  if (description.length > 160) {
    throw new Error(
      `[intersect] ${service.id}/in/${area.id}: description is ${description.length} chars. Set a shorter \`description\` on the serviceDetail entry.`
    );
  }
  return { title, description };
}
