#!/usr/bin/env node
/**
 * Lighthouse step 1: pull everything we know about a prospect into one file.
 *
 *   node scripts/lighthouse/fetch.mjs <Close lead id | business name>
 *
 * Reads the Close lead (fields, contact, address, the latest "LIGHTHOUSE CALL"
 * note written by the call form), checks their current website the way a
 * customer would, runs Google Lighthouse on it through the local Chrome, and
 * writes clients/prospect-<slug>/lighthouse.json. It never writes anything
 * else — site.config.mjs, the content and lighthouse.mjs are written by hand
 * from this file (see ~/.claude/skills/lighthouse/SKILL.md).
 *
 * Needs CLOSE_API_KEY in the environment or in ~/.close.env.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const API = 'https://api.close.com/api/v1';
const CF = {
  owner: 'cf_5lAiKNASj4krhp4qSu99X9xesXhYYMKOwCeTJg7nW82',
  ownerMobile: 'cf_jVokw8GBhP3sTVRUKNlgIfiKEhA09vI7JRTPAYlOPDU',
  tradingName: 'cf_rrIURNhgNpozqJb75kuDK5fiG3VHLDIJ6v95FcW4HWY',
  products: 'cf_9HvPJhwdr3TWzGwBXGmBn7OJ5GFsmb90Y6i01800160',
  reviewCount: 'cf_FokursfuXXH3pShebDQ4qTfmAhmfiAzPjHM4BxgST9W',
  rating: 'cf_DfaAos5K2PpcSka4VNhSfYd3r3UhMgP3QW26h1wb6x7',
  gmb: 'cf_j8M6uXtowpUQt4lTbmyFlZdyD49I8H5eG0iMTGW4mmP',
  gmbStatus: 'cf_gXBuFHCIWiLJxTrHD3AcxiZKtCMszbYYX1mj9gO2dVj',
  facebook: 'cf_nPSDKA2a6DC5euBAmunItNQZ2dQNsbjQQZoJbufxh1X',
  instagram: 'cf_pnq2uFETeXA62cUvxS91hMu00Y1GrCVpV8hZwr72jTJ',
  installsMonth: 'cf_aAzBgDk7U62ricYvsKbtKFebIjL5idQNslmB35AhF6d',
  workFrom: 'cf_34nt2EgrWqhDuUeialK4aAkekANRRJ1rxVzyYPEqDMB',
  yearsTrading: 'cf_WDo00i5jBDhM1Ziau8C172IRf0eYTvHzhliCLhbbElk',
  cps: 'cf_2FzAxcYKc54LJ7rksaoxJ2FCoLZdJAbgmQXe8orSjWF',
  callNotes: 'cf_XUch1hQuhhGWf8TYP2YXyGdouZUgwvPs2tYX1CUgvZ0',
  towns: 'cf_BubvjkCuWzhsyf6x8P0gkBPQ4RWKej4oJeS5bzAlAJm',
  avgJob: 'cf_ySVEci9N1inwuZXVcRk6mX2vL66ZhmxA3qQpFwnR6K8',
  enquiries: 'cf_5sWLchL5wmu9NT48FLGDNt66xgVql1IVp8RWmIXESnY',
  rivals: 'cf_d1VQLBDIrngrEsNqHqPeryoB9n4PQeDB0C9Fu6WC7UV',
  keywords: 'cf_iQUIXDXrbxv1NyRMQisUptK4G9131TxUOBXAnZd8czj',
  websiteStatus: 'cf_PmGIHd09tBItznKzwqB5jTA589iYnqSbd3mO2lvKSMs',
  demoUrl: 'cf_ThWpw0j2hpWg0mZtf4IvnMPDp2BbfY2xEnzOFU1fV8X',
};

function loadKey() {
  if (process.env.CLOSE_API_KEY) return process.env.CLOSE_API_KEY;
  const envFile = path.join(os.homedir(), '.close.env');
  if (fs.existsSync(envFile)) {
    const m = fs.readFileSync(envFile, 'utf8').match(/^CLOSE_API_KEY=(.+)$/m);
    if (m) return m[1].trim();
  }
  throw new Error('No CLOSE_API_KEY in the environment or ~/.close.env');
}
const AUTH = 'Basic ' + Buffer.from(loadKey() + ':').toString('base64');

async function close(p) {
  const res = await fetch(API + p, { headers: { Authorization: AUTH } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Close ${p} ${res.status}: ${JSON.stringify(data).slice(0, 200)}`);
  return data;
}

const arg = process.argv.slice(2).join(' ').trim();
if (!arg) {
  console.error('Usage: node scripts/lighthouse/fetch.mjs <Close lead id | business name>');
  process.exit(1);
}

// ---------- 1. the lead ----------
let lead;
if (/^lead_[A-Za-z0-9]+$/.test(arg)) {
  lead = await close(`/lead/${arg}/`);
} else {
  const found = await close(`/lead/?query=${encodeURIComponent(arg)}&_limit=6`);
  if (!found.data?.length) throw new Error(`No Close lead matches "${arg}"`);
  if (found.data.length > 1) {
    console.log(`More than one lead matches "${arg}" — run again with the id:\n`);
    for (const l of found.data) console.log(`  ${l.id}  ${l.display_name}`);
    process.exit(2);
  }
  lead = found.data[0];
}
const cf = (k) => lead['custom.' + CF[k]] ?? null;
const contact = lead.contacts?.[0] ?? {};
const addr = lead.addresses?.[0] ?? {};

// ---------- 2. the call note ----------
const notes = await close(`/activity/note/?lead_id=${lead.id}&_limit=25`);
const callNote = (notes.data ?? []).find((n) => /^LIGHTHOUSE CALL/.test(n.note ?? ''));
const call = {};
if (callNote) {
  let section = 'header';
  for (const line of callNote.note.split('\n')) {
    if (/^[A-Z][A-Z &/]+$/.test(line.trim())) { section = line.trim(); continue; }
    const m = line.match(/^([^:]+):\s*(.*)$/);
    if (m) call[m[1].trim()] = m[2].trim();
    else if (section === 'NOTES' && line.trim()) call.Notes = ((call.Notes ?? '') + '\n' + line).trim();
  }
}
const list = (s) => String(s ?? '').split(/,|\|/).map((x) => x.trim()).filter(Boolean);
// Rivals carry commas inside each entry ("name, 212 reviews, 4.8"), so only | separates them.
const pipeList = (s) => String(s ?? '').split('|').map((x) => x.trim()).filter(Boolean);

// "Anglian, 180 reviews, 4.6" -> { name, count, rating }
const rival = (s) => {
  const name = s.split(',')[0].trim();
  const count = s.match(/(\d[\d,]*)\s*(reviews?|revs?)?/i);
  const rating = s.match(/(\d(?:\.\d)?)\s*(★|stars?|\/5)?$/i) ?? s.match(/\b([1-5](?:\.\d)?)\s*(★|stars?)/i);
  return {
    name,
    count: count ? parseInt(count[1].replace(/,/g, ''), 10) : null,
    rating: rating ? parseFloat(rating[1]) : null,
  };
};

// ---------- 3. their website, as a customer sees it ----------
const rawSite = call.Website || lead.url || '';
const siteUrl = rawSite ? (/^https?:\/\//i.test(rawSite) ? rawSite : 'https://' + rawSite) : null;
let website = null;
if (siteUrl) {
  website = { url: siteUrl };
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 20000);
    const res = await fetch(siteUrl, { redirect: 'follow', signal: ctrl.signal, headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1' } });
    clearTimeout(t);
    const html = await res.text();
    const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    website = {
      url: siteUrl,
      finalUrl: res.url,
      status: res.status,
      https: res.url.startsWith('https://'),
      title: html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? null,
      metaDescription: html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i)?.[1] ?? null,
      viewportMeta: /<meta[^>]+name=["']viewport["']/i.test(html),
      tapToCall: /href=["']tel:/i.test(html),
      hasForm: /<form\b/i.test(html),
      accreditationsMentioned: ['FENSA', 'Certass', 'CERTASS', 'TrustMark', 'Which? Trusted Trader', 'Checkatrade', 'GGF', 'Assure'].filter((a) => text.includes(a)),
      reviewsMentioned: /\b(reviews?|testimonials?|trustpilot|checkatrade)\b/i.test(text),
      wordCount: text.split(' ').filter(Boolean).length,
      imageCount: (html.match(/<img\b/gi) ?? []).length,
      builder: /wixstatic|wix\.com/i.test(html) ? 'Wix' : /wp-content/i.test(html) ? 'WordPress' : /squarespace/i.test(html) ? 'Squarespace' : /godaddy|websitebuilder/i.test(html) ? 'GoDaddy' : /leadconnectorhq|msgsndr/i.test(html) ? 'GoHighLevel' : null,
    };
  } catch (e) {
    website.error = e.name === 'AbortError' ? 'Timed out after 20s' : e.message;
  }

  // Google Lighthouse via the local Chrome (the public PageSpeed API quota is
  // shared and usually exhausted). Mobile is the default and the one that matters.
  const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (!website.error && fs.existsSync(chrome)) {
    process.stderr.write('Running Lighthouse on their site (30–60s)…\n');
    const out = spawnSync('npx', ['-y', 'lighthouse@12', siteUrl, '--only-categories=performance,seo,accessibility', '--output=json', '--output-path=stdout', '--quiet', '--chrome-flags=--headless=new --no-sandbox'], {
      encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 180000, env: { ...process.env, CHROME_PATH: chrome },
    });
    try {
      const json = JSON.parse(out.stdout.slice(out.stdout.indexOf('{')));
      const c = json.categories, a = json.audits;
      website.lighthouse = {
        performance: Math.round(c.performance.score * 100),
        seo: Math.round(c.seo.score * 100),
        accessibility: Math.round(c.accessibility.score * 100),
        lcp: a['largest-contentful-paint']?.displayValue ?? null,
        cls: a['cumulative-layout-shift']?.displayValue ?? null,
        tbt: a['total-blocking-time']?.displayValue ?? null,
        pageWeightKb: a['total-byte-weight']?.numericValue ? Math.round(a['total-byte-weight'].numericValue / 1024) : null,
      };
    } catch {
      website.lighthouse = null;
      website.lighthouseError = (out.stderr || '').split('\n').filter(Boolean).slice(-2).join(' ') || 'Lighthouse produced no result';
    }
  }
}

// ---------- 4. write it out ----------
const businessName = cf('tradingName') || call.Business || lead.display_name;
const slugBase = businessName.toLowerCase().replace(/\b(ltd|limited|llp|plc)\b\.?/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const slug = `prospect-${slugBase}`;
const dir = path.resolve('clients', slug);
fs.mkdirSync(dir, { recursive: true });

const data = {
  fetchedAt: new Date().toISOString(),
  slug,
  aliasUrl: `https://${slugBase}--glazeos-demos.netlify.app`,
  close: { leadId: lead.id, url: `https://app.close.com/lead/${lead.id}/`, name: lead.display_name, demoUrl: cf('demoUrl') },
  business: {
    name: businessName,
    legalName: lead.display_name,
    owner: cf('owner') || call.Name || contact.name || null,
    mobile: cf('ownerMobile') || call.Mobile || contact.phones?.[0]?.phone || null,
    email: call.Email || contact.emails?.[0]?.email || null,
    postcode: call.Postcode || addr.zipcode || null,
    town: addr.city || null,
    website: siteUrl,
    websiteStatus: cf('websiteStatus'),
    // The note keeps products and "most wanted" apart; the Close field merges them.
    products: list(call.Products || cf('products')),
    mostWanted: call['Most wanted / other'] || null,
    towns: list(cf('towns') || call.Towns),
    keywords: list(cf('keywords') || call.Keywords),
    customerWords: call['Customer words'] || null,
    startedTrading: call['Started trading'] || cf('yearsTrading') || null,
    guarantee: call.Guarantee || null,
    accreditations: list(call.Accreditations),
    otherClaims: call['Other claims'] || null,
    cps: cf('cps'),
  },
  reviews: {
    googleCount: call['Google reviews'] ? Number(call['Google reviews']) : cf('reviewCount'),
    googleRating: call['Google rating'] ? Number(call['Google rating']) : cf('rating'),
    jobsLastYear: call['Jobs last 12 months'] ? Number(call['Jobs last 12 months']) : null,
    elsewhere: call['Other reviews'] || null,
    howTheyAsk: call['How they ask now'] || null,
    gmbLink: call.GBP || cf('gmb') || null,
    gmbStatus: cf('gmbStatus'),
  },
  rivals: pipeList(call.Rivals || cf('rivals')).map(rival),
  social: { facebook: call.Facebook || cf('facebook') || null, instagram: call.Instagram || cf('instagram') || null },
  money: {
    avgJob: call['Avg job £'] ? Number(call['Avg job £']) : cf('avgJob'),
    enquiriesMonth: call['Enquiries / month'] ? Number(call['Enquiries / month']) : cf('enquiries'),
    jobsMonth: call['Jobs won / month'] ? Number(call['Jobs won / month']) : (cf('installsMonth') ? Number(cf('installsMonth')) : null),
    workComesFrom: list(call['Work comes from'] || cf('workFrom')),
  },
  testEnquiryOk: call['OK to send test enquiry'] || null,
  callNotes: call.Notes || cf('callNotes') || null,
  callStatus: callNote ? (callNote.note.split('\n')[0].split('·').pop() ?? '').trim() : 'no Lighthouse call note found',
  callDate: callNote?.date_created ?? null,
  website,
};

fs.writeFileSync(path.join(dir, 'lighthouse.json'), JSON.stringify(data, null, 2));

console.log(`\n${businessName}  →  clients/${slug}/lighthouse.json`);
console.log(`Close: ${data.close.url}`);
console.log(`Call:  ${data.callStatus}${callNote ? ` (${callNote.date_created.slice(0, 10)})` : ''}`);
console.log(`Towns: ${data.business.towns.join(', ') || '—'}`);
console.log(`Products: ${data.business.products.join(', ') || '—'}`);
console.log(`Reviews: ${data.reviews.googleCount ?? '—'} at ${data.reviews.googleRating ?? '—'}★  |  rivals: ${data.rivals.map((r) => `${r.name} ${r.count ?? '?'}/${r.rating ?? '?'}`).join(', ') || '—'}`);
if (website) {
  console.log(`Website: ${website.finalUrl ?? website.url}${website.error ? `  ✗ ${website.error}` : `  ${website.status} ${website.https ? 'https' : 'NO https'} · tel:${website.tapToCall ? 'yes' : 'no'} · form:${website.hasForm ? 'yes' : 'no'} · ${website.builder ?? 'builder unknown'}`}`);
  if (website.lighthouse) console.log(`Lighthouse mobile: performance ${website.lighthouse.performance} · SEO ${website.lighthouse.seo} · LCP ${website.lighthouse.lcp}`);
  else if (website.lighthouseError) console.log(`Lighthouse: ✗ ${website.lighthouseError}`);
} else console.log('Website: none');
console.log(`Demo alias: ${data.aliasUrl}\n`);
