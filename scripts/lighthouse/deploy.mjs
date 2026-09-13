#!/usr/bin/env node
/**
 * Lighthouse step 3: build, QA and publish a prospect demo, then tell Close.
 *
 *   node scripts/lighthouse/deploy.mjs prospect-<slug>
 *
 * Every demo is a branch-style alias on the one glazeos-demos Netlify site:
 *   https://<slug>--glazeos-demos.netlify.app
 * so there is never a new Netlify site per prospect. The alias is the slug
 * without its prospect- prefix, and site.config.mjs `url` must match it or the
 * canonical tags point at the wrong place — checked here before anything
 * is uploaded.
 *
 * On success the URL is written to the Close lead's "Demo Site URL" field and
 * a note is added, so the link is on the record when you ring them back.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const DEMOS_SITE_ID = 'f6dad870-a5c8-4453-bd5e-b2ccad9469fe'; // glazeos-demos
const CF_DEMO_URL = 'cf_ThWpw0j2hpWg0mZtf4IvnMPDp2BbfY2xEnzOFU1fV8X';    // Close: Demo Site URL

const slug = process.argv[2];
if (!slug || !slug.startsWith('prospect-')) {
  console.error('Usage: node scripts/lighthouse/deploy.mjs prospect-<slug>');
  process.exit(1);
}
const dir = path.resolve('clients', slug);
if (!fs.existsSync(path.join(dir, 'site.config.mjs'))) {
  console.error(`No clients/${slug}/site.config.mjs — write the demo first.`);
  process.exit(1);
}

const alias = slug.replace(/^prospect-/, '');
const expectedUrl = `https://${alias}--glazeos-demos.netlify.app`;
const cfg = (await import(pathToFileURL(path.join(dir, 'site.config.mjs')).href)).default;
if (cfg.url !== expectedUrl) {
  console.error(`site.config.mjs url is "${cfg.url}" but this demo will live at "${expectedUrl}". Fix the url first.`);
  process.exit(1);
}
if (!cfg.demo?.enabled) {
  console.error('site.config.mjs has no `demo: { enabled: true }` — refusing to publish a prospect demo that would be indexable.');
  process.exit(1);
}

const run = (label, cmd, args, opts = {}) => {
  process.stdout.write(`\n▶ ${label}\n`);
  const r = spawnSync(cmd, args, { stdio: 'inherit', env: { ...process.env, CLIENT: slug }, ...opts });
  if (r.status !== 0) { console.error(`\n${label} failed.`); process.exit(r.status ?? 1); }
};
run('Build', 'npm', ['run', 'build']);
run('QA', 'npm', ['run', 'qa']);

process.stdout.write(`\n▶ Deploy to ${expectedUrl}\n`);
// --no-build matters: the CLI otherwise re-runs `npm run build` itself, without
// CLIENT set, and uploads the default client instead of the one QA just passed.
const dep = spawnSync('npx', ['-y', 'netlify-cli', 'deploy', '--no-build', '--dir', 'dist', '--site', DEMOS_SITE_ID, '--alias', alias, '--json', '--message', `Lighthouse demo ${slug}`], {
  encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
});
let deployUrl;
try {
  const json = JSON.parse(dep.stdout.slice(dep.stdout.indexOf('{')));
  deployUrl = json.deploy_url;
} catch {
  console.error(dep.stdout, dep.stderr);
  console.error('Deploy did not return a URL.');
  process.exit(1);
}
if (deployUrl !== expectedUrl) console.warn(`Netlify returned ${deployUrl} (expected ${expectedUrl})`);

// ---------- Close ----------
const lh = fs.existsSync(path.join(dir, 'lighthouse.json')) ? JSON.parse(fs.readFileSync(path.join(dir, 'lighthouse.json'), 'utf8')) : null;
const leadId = lh?.close?.leadId;
if (leadId) {
  let key = process.env.CLOSE_API_KEY;
  if (!key) {
    const envFile = path.join(os.homedir(), '.close.env');
    key = fs.existsSync(envFile) ? fs.readFileSync(envFile, 'utf8').match(/^CLOSE_API_KEY=(.+)$/m)?.[1]?.trim() : null;
  }
  if (key) {
    const auth = 'Basic ' + Buffer.from(key + ':').toString('base64');
    const H = { Authorization: auth, 'Content-Type': 'application/json' };
    const put = await fetch(`https://api.close.com/api/v1/lead/${leadId}/`, { method: 'PUT', headers: H, body: JSON.stringify({ ['custom.' + CF_DEMO_URL]: deployUrl }) });
    const hasReview = fs.existsSync(path.join(dir, 'lighthouse.mjs'));
    await fetch('https://api.close.com/api/v1/activity/note/', {
      method: 'POST', headers: H,
      body: JSON.stringify({ lead_id: leadId, note: `LIGHTHOUSE DEMO BUILT\nDemo site: ${deployUrl}/${hasReview ? `\nReview: ${deployUrl}/lighthouse/` : ''}\nNext: record the Loom, send both links, move the deal to "Audit / Loom Sent".` }),
    });
    console.log(put.ok ? `\nClose updated: Demo Site URL set on ${lh.close.url}` : `\nCould not update Close (${put.status}) — set Demo Site URL by hand: ${deployUrl}`);
  } else console.log('\nNo Close key found — set Demo Site URL by hand.');
} else console.log('\nNo lighthouse.json with a Close lead id — Close not updated.');

console.log(`\n✓ Demo:   ${deployUrl}/`);
if (fs.existsSync(path.join(dir, 'lighthouse.mjs'))) console.log(`✓ Review: ${deployUrl}/lighthouse/`);
console.log('');
