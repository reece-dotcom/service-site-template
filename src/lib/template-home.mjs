/**
 * HOME PAGE = the Glazing Master Template, verbatim.
 *
 * The artifact's markup (src/templates/master.html) and stylesheet
 * (src/styles/template.css) are used as-is. This module only drops the
 * client's facts into the obvious slots — name, phone, town, colours, nav,
 * photos, logos, services, areas, reviews, owner — and leaves the template's
 * own wording everywhere else, so the page always looks like the design and
 * the copy gets edited afterwards. Lives in a plain module because the Astro
 * compiler cannot parse raw HTML strings inside a page's frontmatter.
 *
 * Rule for placeholder CLAIMS (the template's 312 reviews, 91% stat, 0%
 * finance): a prospect demo shows them exactly as designed; a live client
 * site shows that block only when the client's config holds the real thing.
 */
import fs from 'node:fs';
import path from 'node:path';
import { getCollection } from 'astro:content';
import { site } from './client.mjs';
import { clientImage } from './images.mjs';
import { accreditationList } from './business.mjs';
import { isDemo } from './demo.mjs';
import { canonical, serviceSchema, faqSchema } from './seo.mjs';

const esc = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const swap = (html, re, replacement) => html.replace(re, () => replacement);
const NO = /^(no|rare|never|not)\b/i;

export async function buildHome() {
  const raw = fs.readFileSync(path.resolve(process.cwd(), 'src/templates/master.html'), 'utf8');
  const bits = raw.split(/<!-- ============ ([^=]+?) ============ -->/);
  const S = {};
  for (let i = 1; i < bits.length; i += 2) S[bits[i].trim()] = bits[i + 1];

  const b = site.business, c = site.contact, home = site.home ?? {}, lp = site.lp ?? {};
  const mock = isDemo();
  const services = (await getCollection('services')).filter((s) => !s.data.draft).sort((x, y) => x.data.order - y.data.order);
  const areas = (await getCollection('areas')).filter((a) => !a.data.draft);
  const first = b.owner?.name?.split(' ')[0];

  // SEO
  const title = (b.homeTitle ?? `${b.name} | Windows & Doors in ${c.address.locality}`).slice(0, 60);
  const description = b.description.slice(0, 160);
  const homeFaqs = b.homeFaqs ?? b.about?.faqs ?? [];
  const schemas = services.map((s) => serviceSchema({ name: s.data.name, description: s.data.summary, url: canonical(`/services/${s.id}/`) }));
  if (homeFaqs.length) schemas.push(faqSchema(homeFaqs));

  /* Facts that replace the template's bracketed placeholders everywhere. */
  const fill = (h) => h
    .replace(/\[Business Name\]/g, esc(b.name))
    .replace(/\[Company Ltd\]/g, esc(b.legalName ?? b.name))
    .replace(/\[Phone\]/g, esc(c.phone))
    .replace(/tel:\+440000000000/g, `tel:${esc(c.phoneHref)}`)
    .replace(/\[Town\]/g, esc(c.address.locality))
    .replace(/\[TOWN\]/g, esc(String(c.address.locality).toUpperCase()))
    .replace(/\[Area\]/g, esc(c.address.region))
    .replace(/\[Email\]/g, esc(c.email))
    .replace(/\[Address\]/g, esc(c.address.street ?? c.address.locality))
    .replace(/\[Postcode\]/g, esc(c.address.postcode ?? ''))
    .replace(/\[Owner full name\]/g, esc(b.owner?.name ?? '[Owner full name]'))
    .replace(/\[Owner\]/g, esc(first ?? '[Owner]'))
    .replace(/\[Year\]/g, esc(b.yearFounded ?? '[Year]'));

  /* ===== HERO ===== */
  let hero = S['HERO'];
  const h = home.hero ?? lp.hero;
  const announce = home.announce ?? lp.announce;
  if (announce) hero = swap(hero, /<div class="ec-announce">[\s\S]*?<\/div>/, `<div class="ec-announce">${esc(typeof announce === 'string' ? announce : announce.text)}</div>`);
  hero = swap(hero, /<ul class="ec-nav-links">[\s\S]*?<\/ul>/, `<ul class="ec-nav-links">
        <li><a href="/services/">Services</a></li>
        <li><a href="/areas/">Areas</a></li>
        <li><a href="/about/">About</a></li>
        <li><a href="/blog/">Advice</a></li>
        <li><a href="/contact/">Contact</a></li>
      </ul>`);
  const logo = clientImage(site.media?.logo);
  if (logo) hero = swap(hero, /<span class="ec-brand-mark">[\s\S]*?<\/span>\s*\[Business Name\]/, `<img src="${logo.src}" alt="" style="height:38px;width:auto;border-radius:8px;background:#fff;padding:3px"> [Business Name]`);
  if (h) {
    const words = h.rotate ?? [];
    hero = swap(hero, /<h1 class="ec-h1"[\s\S]*?<\/h1>/, words.length
      ? `<h1 class="ec-h1" aria-label="${esc(h.headline)} ${esc(words.join(', '))}">${esc(h.headline)}
      <span class="rot" aria-hidden="true"><span class="rot-track">${words.map((w, i) => `<span class="rot-w${i === 0 ? ' is-on' : ''}">${esc(w)}</span>`).join('')}</span></span></h1>`
      : `<h1 class="ec-h1">${esc(h.headline)}</h1>`);
    if (h.sub) hero = swap(hero, /<p class="ec-h2">[\s\S]*?<\/p>/, `<p class="ec-h2">${esc(h.sub)}</p>`);
    if (h.cta) hero = swap(hero, /<a class="btn ec-cta" href="#quote">[\s\S]*?<\/a>/, `<a class="btn ec-cta" href="#quote">${esc(h.cta)}</a>`);
    if (h.note) hero = swap(hero, /<p class="ec-cta-note">[\s\S]*?<\/p>/, `<p class="ec-cta-note">${esc(h.note)}<br>or call <a href="tel:${esc(c.phoneHref)}">${esc(c.phone)}</a>${h.hours ? ` &mdash; ${esc(h.hours)}` : ''}</p>`);
    const slides = (h.slides ?? []).map((s) => ({ ...s, img: clientImage(s.image) })).filter((s) => s.img);
    const bgRe = /<div class="hero-bg" aria-hidden="true">[\s\S]*?<\/div>\s*<div class="hero-bg-overlay">/;
    if (slides.length) {
      hero = swap(hero, bgRe, `<div class="hero-bg" aria-hidden="true">${slides.map((s, i) => `<div class="hero-bg-slide${i === 0 ? ' is-active' : ''}" style="--img:url('${s.img.src}')"></div>`).join('')}</div>
  <div class="hero-bg-overlay">`);
    } else if (words.length) {
      hero = swap(hero, bgRe, `<div class="hero-bg" aria-hidden="true">${words.map((w, i) => `<div class="hero-bg-slide${i === 0 ? ' is-active' : ''}"><span>Hero photo ${i + 1} &middot; ${esc(w)}</span></div>`).join('')}</div>
  <div class="hero-bg-overlay">`);
    }
  }
  // Stats: explicit config, else the template's four.
  if (home.stats?.length) hero = swap(hero, /<div class="stats stats--boxed">[\s\S]*?<\/ul>\s*<\/div>/, `<div class="stats stats--boxed">
    <ul>${home.stats.map((s) => `<li><b>${esc(s.value)}</b><span>${esc(s.label)}</span></li>`).join('')}</ul>
  </div>`);
  // Trust card: real accreditations when the client has any, else the template's.
  const LOGOS = [[/fensa/i, '/logos/fensa.jpg', 'FENSA Approved'], [/ggf|glazing federation/i, '/logos/ggf.png', 'GGF member'], [/installsure/i, '/logos/installsure.jpg', 'Installsure']];
  const accs = accreditationList();
  const agg = site.reviews?.aggregate;
  if (accs.length || agg) {
    const press = accs.map((a) => { const l = LOGOS.find((x) => x[0].test(a.name)); return l ? `<img src="${l[1]}" alt="${esc(l[2])}">` : `<span style="font-weight:600;font-size:15px">&#10003; ${esc(a.name)}</span>`; }).join('\n      ');
    const review = agg ? `<div class="ec-divider"></div>
    <div class="ec-review">
      <img src="/logos/google.png" alt="Google">
      <span><span class="platform">${esc(agg.source ?? 'Google')}</span> &middot; ${esc(agg.ratingValue)} from ${esc(agg.reviewCount)} reviews</span>
    </div>` : '';
    hero = swap(hero, /<div class="ec-trustcard">[\s\S]*<\/div>\s*<\/div>\s*$/, `<div class="ec-trustcard">
    <h3>Trusted by</h3>
    <div class="ec-press">
      ${press}
    </div>
    ${review}
  </div>
</div>
`);
  }

  /* ===== GOOGLE REVIEWS ===== */
  let reviews = S['GOOGLE REVIEWS'];
  const featured = site.reviews?.featured ?? [];
  if (featured.length) {
    reviews = swap(reviews, /<div class="google-reviews-head">[\s\S]*?<\/div>/, `<div class="google-reviews-head">
      <img src="/logos/google.png" alt="Google">
      <span>${agg ? `<b>${esc(agg.ratingValue)}</b> out of 5 &middot; ${esc(agg.reviewCount)} ${esc(agg.source ?? 'Google')} reviews` : 'What customers say on Google'}</span>
    </div>`);
    reviews = swap(reviews, /<div class="google-reviews-grid">[\s\S]*<\/section>/, `<div class="google-reviews-grid">${featured.slice(0, 3).map((r) => `
      <div class="google-review-card">
        <p class="stars" aria-label="Rated ${esc(r.rating ?? 5)} out of 5">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
        <blockquote>${esc(r.body)}</blockquote>
        <cite>${esc(r.author)}, posted on ${esc(r.source ?? agg?.source ?? 'Google')}</cite>
      </div>`).join('')}
    </div>
  </div>
</section>`);
  } else if (!mock) reviews = '';

  /* ===== PANES ===== */
  let panes = S['SELF-SELECT PANES'];
  const paneData = home.panes?.length ? home.panes : services.slice(0, 4).map((s) => ({ title: s.data.name, body: s.data.summary, href: `/services/${s.id}/`, cta: `Price my ${s.data.name.toLowerCase()}` }));
  const paneHtml = (p) => `<a class="pane" href="${esc(p.href)}">
        ${p.kicker ? `<div class="pane-kicker">${esc(p.kicker)}</div>` : ''}
        <h3>${esc(p.title)}</h3>
        ${p.body ? `<p>${esc(p.body)}</p>` : ''}
        <span class="pane-go">${esc(p.cta ?? 'Get a price')}</span>
      </a>`;
  if (paneData.length) panes = swap(panes, /<div class="panes">[\s\S]*<\/section>/, `<div class="panes">
      ${paneData.map(paneHtml).join('\n      ')}
    </div>
  </div>
</section>`);

  /* ===== PROOF ===== */
  let proof = S['PROOF'];
  const stat = home.stat ?? lp.stat;
  if (stat) {
    const max = Math.max(1, ...(stat.bars ?? []).map((x) => x.pct));
    proof = `<section class="proof pad">
  <div class="wrap">
    <div>
      <div class="bigstat">${esc(stat.value)}</div>
      <h2 class="dsp" style="font-size:clamp(21px,2.2vw,26px);margin-top:14px">${esc(stat.label)}</h2>
      <p class="src">Source: ${esc(stat.basis)}</p>
    </div>
    ${stat.bars?.length ? `<div class="chart">${stat.bars.map((x) => `<div class="bar-row"><span>${esc(x.label)}</span><div class="bar${x.late ? ' late' : ''}" style="width:${Math.round((x.pct / max) * 100)}%"></div><span>${esc(x.pct)}%</span></div>`).join('')}</div>` : ''}
  </div>
</section>`;
  } else if (!mock) proof = '';

  /* ===== PROCESS ===== */
  let processHtml = S['PROCESS'];
  if (b.process?.length) processHtml = swap(processHtml, /<div class="steps">[\s\S]*<\/section>/, `<div class="steps">${b.process.map((s, i) => `
    <div class="step"><div class="step-n">${i + 1}</div>
      <h3>${esc(s.title)}</h3>
      <p>${esc(s.body)}</p></div>`).join('')}
  </div>
</section>`);

  /* ===== GUARANTEE ===== */
  let guarantee = S['GUARANTEE'];
  const icons = [...S['GUARANTEE'].matchAll(/<svg class="guarantee-icon"[\s\S]*?<\/svg>/g)].map((m) => m[0]);
  const iconFor = (t = '') => { const s = t.toLowerCase(); return /reliab|time|date/.test(s) ? icons[0] : /clean|tidy/.test(s) ? icons[1] : /courte|respect|friendly/.test(s) ? icons[2] : /trust|insur|check/.test(s) ? icons[3] : /honest|straight|price/.test(s) ? icons[4] : /profession|skill|measure|fitter/.test(s) ? icons[5] : icons[6]; };
  const promises = home.promises ?? b.promises ?? lp.promises ?? [];
  if (promises.length) {
    const cards = promises.map((p) => `<article class="guarantee-card">
        <div class="guarantee-head">${iconFor(p.title)}<h3 class="guarantee-title">${esc(p.title)}</h3></div>
        <p>${esc(p.body)}</p>
      </article>`);
    if (b.guarantee) cards.push(`<article class="guarantee-card guarantee-card--wide">
        <div class="guarantee-head">${icons[6]}<h3 class="guarantee-title">${esc(b.guarantee.heading ?? 'Covered')}</h3></div>
        <p>${esc(b.guarantee.body)}</p>
      </article>`);
    const n = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][cards.length - 1] ?? cards.length;
    guarantee = swap(guarantee, /<h2 class="dsp">Our seven-point guarantee<\/h2>/, `<h2 class="dsp">Our ${n}-point guarantee</h2>`);
    guarantee = swap(guarantee, /<div class="guarantee-grid">[\s\S]*<\/section>/, `<div class="guarantee-grid">
      ${cards.join('\n      ')}
    </div>
  </div>
</section>`);
  }

  /* ===== JOBS ===== */
  let jobs = S['JOBS + REVIEWS'];
  const jobData = (home.jobs ?? lp.jobs ?? (site.media?.gallery ?? []).map((g) => ({ title: g.caption ?? g.alt, image: g.src, alt: g.alt }))).map((j) => ({ ...j, img: clientImage(j.image) })).filter((j) => j.img);
  if (jobData.length) {
    const anyQuote = jobData.some((j) => j.quote);
    jobs = swap(jobs, /<h2 class="dsp">[\s\S]*?<\/h2>/, `<h2 class="dsp">${anyQuote ? 'Recent jobs, and what the customer said afterwards.' : 'Recent jobs, and what they actually look like.'}</h2>`);
    jobs = swap(jobs, /<div class="jobs">[\s\S]*<\/section>/, `<div class="jobs">${jobData.slice(0, 6).map((j) => `
      <article class="job">
        <img class="job-img" src="${j.img.src}" alt="${esc(j.alt ?? j.title)}" loading="lazy" style="object-fit:cover">
        <div class="job-body">
          <div class="job-meta">${esc(j.meta ?? j.title)}</div>
          ${j.quote ? `<p class="stars" aria-label="Rated ${esc(j.rating ?? 5)} out of 5">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
          <blockquote>${esc(j.quote)}</blockquote>
          <cite>${esc(j.author ? j.author + ', ' : '')}verified ${esc(j.source)} review</cite>` : j.meta ? `<p style="margin:0">${esc(j.title)}</p>` : ''}
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>`);
  }

  /* ===== COMPARE ===== */
  let compare = S['COMPARE'];
  const cmp = b.comparison;
  if (cmp?.rows?.length) {
    compare = swap(compare, /<h2 class="dsp">[\s\S]*?<\/h2>/, `<h2 class="dsp">${esc(cmp.heading ?? 'Why local homeowners choose us over the rest')}</h2>`);
    compare = swap(compare, /<th>National chains<\/th>/, `<th>${esc(cmp.them ?? 'National chains')}</th>`);
    compare = swap(compare, /<tbody>[\s\S]*?<\/tbody>/, `<tbody>${cmp.rows.map((r) => `
          <tr><td>${esc(r.label)}</td><td class="compare-us">&#10003; ${esc(r.us)}</td><td${NO.test(r.them) ? ' class="compare-no"' : ''}>${NO.test(r.them) ? '&#10007; ' : ''}${esc(r.them)}</td></tr>`).join('')}
        </tbody>`);
  }

  /* ===== OWNER ===== */
  let owner = S['OWNER'];
  if (b.owner?.name) {
    const paras = home.ownerText ?? (b.about?.story ?? []).slice(0, 2);
    const photo = clientImage(home.ownerPhoto ?? b.about?.photo);
    if (photo) owner = swap(owner, /<div class="portrait">[\s\S]*?<\/div>/, `<img class="portrait" src="${photo.src}" alt="${esc(b.owner.name)}" style="object-fit:cover;padding:0;display:block">`);
    if (home.ownerHeading) owner = swap(owner, /<h2 class="dsp">[\s\S]*?<\/h2>/, `<h2 class="dsp">${esc(home.ownerHeading)}</h2>`);
    if (paras.length) owner = swap(owner, /<p class="lede" style="margin-top:16px">[\s\S]*?<p class="sig">/, `${paras.map((p, i) => `<p class="lede"${i === 0 ? ' style="margin-top:16px"' : ''}>${esc(p)}</p>`).join('\n      ')}
      <p class="sig">`);
    owner = swap(owner, /<p class="sig">[\s\S]*?<\/p>/, `<p class="sig">${esc(b.owner.name)}${b.owner.role ? `, ${esc(b.owner.role.toLowerCase())}` : ', owner'}</p>`);
  }

  /* ===== COVERAGE ===== */
  let coverage = S['COVERAGE'];
  {
    const q = c.googlePlaceId ? `place_id:${c.googlePlaceId}` : c.mapEmbedQuery;
    if (q) {
      const src = `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=${c.mapZoom ?? 12}&output=embed`;
      coverage = swap(coverage, /<div class="cover-map-embed">[\s\S]*?<\/div>/, `<iframe class="cover-map-embed" src="${src}" title="Map of ${esc(b.name)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" style="width:100%;border:0"></iframe>`);
      coverage = swap(coverage, /href="https:\/\/www\.google\.com\/maps"/, `href="${c.googlePlaceId ? `https://www.google.com/maps/place/?q=place_id:${c.googlePlaceId}` : `https://www.google.com/maps/search/${encodeURIComponent(q)}`}"`);
    }
    if (areas.length) {
      const homeArea = areas.find((a) => a.data.name.toLowerCase() === String(c.address.locality).toLowerCase());
      const nearby = areas.filter((a) => a !== homeArea);
      const chip = (a, label) => `<li><a href="/areas/${a.id}/">${esc(label)}</a></li>`;
      const townChips = homeArea ? (homeArea.data.postcodes.length ? homeArea.data.postcodes.map((pc) => chip(homeArea, `${pc} ${homeArea.data.name}`)) : [chip(homeArea, homeArea.data.name)]) : [];
      const nearChips = nearby.map((a) => chip(a, `${a.data.postcodes[0] ? a.data.postcodes[0] + ' ' : ''}${a.data.name}`));
      coverage = swap(coverage, /<div class="cover-areas">[\s\S]*<\/section>/, `<div class="cover-areas">
      ${townChips.length ? `<div>
        <h3>${esc(homeArea.data.name)}</h3>
        <ul class="districts">${townChips.join('')}</ul>
      </div>` : ''}
      <div>
        <h3>${townChips.length ? 'Nearby towns' : 'Areas we cover'}</h3>
        <ul class="districts">${nearChips.join('')}</ul>
      </div>
    </div>
  </div>
</section>`);
    }
  }

  /* ===== FINANCE ===== */
  let finance = S['FINANCE'];
  const fin = home.finance ?? lp.finance;
  if (fin) finance = `<section class="finance">
  <div class="wrap">
    <div class="finance-panel">
      <div>
        <h2 class="dsp">${esc(fin.heading ?? 'Spread the cost')}</h2>
        <p>${esc(fin.body)} ${esc(fin.representativeExample)} FCA firm reference ${esc(fin.fcaFirmRef)}.</p>
      </div>
      <a class="btn btn-light" href="${esc(fin.href ?? '/contact/')}">${esc(fin.cta ?? 'See the finance options')}</a>
    </div>
  </div>
</section>`;
  else if (!mock) finance = '';

  /* ===== FAQ ===== */
  let faq = S['FAQ'];
  if (homeFaqs.length) faq = swap(faq, /<div class="faq">[\s\S]*<\/section>/, `<div class="faq">${homeFaqs.map((f, i) => `
      <details${i === 0 ? ' open' : ''}>
        <summary>${esc(f.question)}</summary>
        <p>${esc(f.answer)}</p>
      </details>`).join('')}
    </div>
  </div>
</section>`);

  /* ===== FINAL CTA ===== */
  let final = S['FINAL CTA'];
  if (paneData.length) final = swap(final, /<div class="panes" style="margin-top:24px">[\s\S]*?<\/div>\s*<\/div>\s*<form/, `<div class="panes" style="margin-top:24px">${paneData.map((p) => `
        <a class="pane" href="${esc(p.href)}">
          <h3 style="font-size:16.5px;margin-bottom:10px">${esc(p.title)}</h3>
          <span class="pane-go">${esc(p.cta ?? 'Get a price')}</span></a>`).join('')}
      </div>
    </div>

    <form`);
  {
    const useGhl = site.forms.provider === 'ghl';
    final = swap(final, /<form name="quote" method="POST" data-netlify="true" netlify-honeypot="bot-field">/, useGhl
      ? `<form method="POST" action="${esc(site.forms.ghlEndpoint)}">${site.forms.ghlLocationId ? `<input type="hidden" name="location_id" value="${esc(site.forms.ghlLocationId)}">` : ''}`
      : `<form name="quote" method="POST" action="/thank-you/" data-netlify="true" netlify-honeypot="bot-field">`);
    if (useGhl) final = final.replace(/<input type="hidden" name="form-name" value="quote">\s*/, '');
    final = final.replace('id="name" name="name"', 'id="name" name="full_name"').replace('id="postcode" name="postcode"', 'id="postcode" name="postal_code"').replace('id="job" name="job"', 'id="job" name="enquiry_type"').replace('id="detail" name="detail"', 'id="detail" name="message"');
    if (b.enquiryOptions?.length) final = swap(final, /<option value="">Choose one&hellip;<\/option>[\s\S]*?<\/select>/, `<option value="">Choose one&hellip;</option>${b.enquiryOptions.map((o) => `<option>${esc(o)}</option>`).join('')}</select>`);
    final = final.replace('<label for="phone">Phone</label>', '<label for="email">Email</label>\n      <input id="email" name="email" type="email" autocomplete="email" required>\n      <label for="phone">Phone</label>');
  }

  /* ===== FOOTER ===== */
  let footer;
  {
    const hrs = (site.hours ?? []).map((x) => { const d = x.days.map((y) => y.slice(0, 3)); return `${d.length > 2 ? `${d[0]}&ndash;${d[d.length - 1]}` : d.join(' &amp; ')} ${x.opens}&ndash;${x.closes}`; }).join(' &middot; ');
    const legal = [`&copy; ${new Date().getFullYear()} ${esc(b.legalName ?? b.name)}`, ...accs.filter((a) => a.id).map((a) => `${esc(a.name.replace(/ (registered|member|approved)$/i, ''))} ${esc(a.id)}`)];
    const trade = esc((site.copy?.footerTrade ?? 'Windows & doors').toUpperCase());
    footer = `<footer>
  <div class="wrap">
    <div>
      <a class="logo" href="/">${esc(b.name)}<span>${trade} &middot; ${esc(String(c.address.locality).toUpperCase())}</span></a>
      <p style="margin-top:18px;max-width:38ch">${c.address.street ? esc(c.address.street) + ', ' : ''}${esc(c.address.locality)}${c.address.postcode ? ' ' + esc(c.address.postcode) : ''}<br>
        <a class="foot-phone" href="tel:${esc(c.phoneHref)}">${esc(c.phone)}</a><br>
        ${esc(c.email)}</p>
      ${hrs ? `<p style="font-size:14px">${hrs}</p>` : ''}
    </div>
    <div>
      <h4>What we fit</h4>
      <ul>${services.map((s) => `<li><a href="/services/${s.id}/">${esc(s.data.name)}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h4>Useful</h4>
      <ul>
        <li><a href="/areas/">Areas we cover</a></li>
        <li><a href="/about/">About us</a></li>
        <li><a href="/blog/">Advice</a></li>
        <li><a href="/contact/">Contact</a></li>
      </ul>
    </div>
  </div>
  <div class="wrap legal">
    <p style="margin:0">${legal.join(' &middot; ')}</p>
  </div>
</footer>
`;
  }

  /* ===== STICKY + MOTION ===== */
  const sticky = S['STICKY MOBILE BAR'].replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '');
  const motion = S['MOTION (plain browser APIs, no dependencies)'];

  const html = fill([hero, reviews, panes, proof, processHtml, guarantee, jobs, compare, owner, coverage, finance, faq, final, footer, sticky, motion].join('\n'));
  return { html, title, description, schemas };
}
