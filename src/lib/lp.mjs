/**
 * /lp/ ad-landing mode — config reader and claim guards.
 *
 * The landing page exists to convert paid traffic, so it carries the
 * highest-pressure claims on the whole site: hit rates, guarantees,
 * testimonials, finance. Those are exactly the claims that get the CLIENT
 * fined, not us, if they are decorative rather than true.
 *
 * So every block here is opt-in per client, and the risky ones will not
 * render without their evidence field. A missing evidence field throws at
 * build time rather than warning — a warning scrolls past, a thrown build
 * does not.
 *
 * Legal backdrop, short version:
 *  - CPRs / DMCC Act 2024: misleading claims and fake urgency, CMA can fine
 *    the trader directly.
 *  - Fake or unsourced reviews: banned outright, and a Google manual-action
 *    risk on top.
 *  - Consumer credit ("0% over 2 years"): a regulated activity. An installer
 *    who is not FCA-authorised, or an appointed representative of a broker,
 *    may not advertise finance at all.
 */
import { site } from './client.mjs';

const fail = (msg) => {
  throw new Error(`[lp] ${msg}`);
};

/** The whole /lp/ page is opt-in: no `lp` block, no page. */
export function lpEnabled() {
  return Boolean(site.lp?.enabled);
}

export function lpConfig() {
  return site.lp ?? {};
}

/**
 * Hero. `rotate` drives the animated word list; keep it to the services the
 * client actually sells, in the order they want to sell them.
 */
export function lpHero() {
  const hero = lpConfig().hero;
  if (!hero) fail('lp.hero is required when lp.enabled is true');
  if (!hero.headline) fail('lp.hero.headline is required');
  if (hero.rotate && hero.rotate.length < 2) {
    fail('lp.hero.rotate needs at least two words, or omit it');
  }
  /**
   * Optional hero carousel: one photo per rotating word, in the same order,
   * so the picture always shows the thing the headline is naming. The CSS
   * keyframes only exist for 2-5 slides, and a mismatched count would show a
   * bifold photo above the word "sliders", so both are hard failures.
   */
  if (hero.slides) {
    if (!hero.rotate) {
      fail('lp.hero.slides needs lp.hero.rotate — each slide pairs with one word');
    }
    if (hero.slides.length !== hero.rotate.length) {
      fail(
        `lp.hero.slides has ${hero.slides.length} photo(s) but lp.hero.rotate has ` +
          `${hero.rotate.length} word(s) — the carousel is synced to the words, ` +
          'so the counts must match'
      );
    }
    if (hero.slides.length > 5) {
      fail('lp.hero.slides supports at most 5 photos');
    }
    hero.slides.forEach((slide, i) => {
      if (!slide.image) fail(`lp.hero.slides[${i}].image is required`);
      if (!slide.alt) {
        fail(
          `lp.hero.slides[${i}].alt is required — describe the work in the photo`
        );
      }
    });
  }
  return hero;
}

/**
 * Headline statistic ("98% of jobs fitted within six weeks").
 *
 * `basis` is REQUIRED and is printed under the number. A percentage with no
 * stated basis is an unsubstantiated claim; making the basis visible is both
 * the compliance fix and the more persuasive version.
 */
export function lpStat() {
  const stat = lpConfig().stat;
  if (!stat) return null;
  if (!stat.value || !stat.label) fail('lp.stat needs both `value` and `label`');
  if (!stat.basis) {
    fail(
      'lp.stat.basis is required — state what the figure is measured from ' +
        '(e.g. "112 installations completed in 2026"). An unsubstantiated ' +
        'statistic is a misleading commercial practice under the CPRs.'
    );
  }
  return stat;
}

/**
 * Recent jobs with customer quotes.
 *
 * A quote must name its platform in `source`, so the reader can go and check
 * it. Anonymous testimonials that only exist on the client's own website are
 * the single most common fabrication in this trade, and we do not ship them.
 */
export function lpJobs() {
  const jobs = lpConfig().jobs ?? [];
  for (const job of jobs) {
    if (!job.title) fail('every lp.jobs entry needs a `title`');
    if (job.quote && !job.source) {
      fail(
        `lp.jobs "${job.title}" has a customer quote with no \`source\` — ` +
          'name the platform it is published on (Google, Checkatrade, Which? ' +
          'Trusted Trader). Never ship a testimonial that cannot be checked.'
      );
    }
    if (job.rating && !job.source) {
      fail(`lp.jobs "${job.title}" has a rating with no \`source\``);
    }
  }
  return jobs;
}

/**
 * Announcement strip above the header (the artifact's green bar).
 *
 * That strip is the most-read line on the page, and the artifact fills it with
 * "The only [Town] installer offering a 15-year guarantee" — a superlative and
 * a comparative claim in nine words. Under the CPRs the trader must be able to
 * substantiate both, so a superlative here needs a `basis`, which is printed as
 * the small print beneath it.
 */
const SUPERLATIVES = /\b(only|best|cheapest|number one|no\.?\s?1|leading|largest|fastest|most trusted)\b/i;

export function lpAnnounce() {
  const a = lpConfig().announce;
  if (!a) return null;
  const text = typeof a === 'string' ? a : a.text;
  if (!text) fail('lp.announce needs `text`');
  const basis = typeof a === 'string' ? null : a.basis;
  if (SUPERLATIVES.test(text) && !basis) {
    fail(
      `lp.announce "${text}" makes a superlative or comparative claim. Supply ` +
        '`basis` with the evidence (and be ready to show it), or reword it. ' +
        'The CMA can fine the trader directly for an unsubstantiated "only ' +
        'installer in town" line.'
    );
  }
  return { text, basis };
}

/**
 * Consumer-credit block. Requires the FCA firm reference number of the
 * authorised lender or broker, plus the representative example — without
 * both, advertising finance is a regulated-activity breach.
 */
export function lpFinance() {
  const fin = lpConfig().finance;
  if (!fin) return null;
  if (!fin.fcaFirmRef) {
    fail(
      'lp.finance.fcaFirmRef is required — advertising consumer credit is a ' +
        'regulated activity. Supply the FCA firm reference number of the ' +
        'authorised broker or lender, or remove the finance block.'
    );
  }
  if (!fin.representativeExample) {
    fail('lp.finance.representativeExample is required alongside any APR claim');
  }
  return fin;
}

/**
 * Promise/guarantee list (the artifact's "seven-point guarantee").
 * Free-form, but each point needs a body: a bare adjective promises nothing.
 */
export function lpPromises() {
  const promises = lpConfig().promises ?? [];
  for (const p of promises) {
    if (!p.title || !p.body) fail('every lp.promises entry needs `title` and `body`');
  }
  return promises;
}

/** Job-type picker. Falls back to the CRM enquiry options. */
export function lpJobTypes() {
  return lpConfig().jobTypes ?? site.business.enquiryOptions ?? [];
}
