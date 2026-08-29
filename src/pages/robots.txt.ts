import type { APIRoute } from 'astro';
import { site } from '../lib/client.mjs';

/**
 * Two different kinds of AI crawler, deliberately treated differently:
 *
 *   TRAINING crawlers scrape the site to train a model. The client gets
 *   nothing back, so they are blocked.
 *   ANSWER crawlers fetch a page to cite it in a live answer (ChatGPT search,
 *   Claude, Perplexity). That is a referral channel, so they are allowed.
 *
 * Blocking the second group by accident is the common mistake — the usual
 * "block all AI bots" snippets take the installer out of AI search results
 * entirely.
 */
const TRAINING_BOTS = [
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
  'CCBot',
  'anthropic-ai',
  'Applebot-Extended',
  'Bytespider',
  'meta-externalagent',
];

const ANSWER_BOTS = ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'PerplexityBot'];

export const GET: APIRoute = () => {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /thank-you/',
    '',
    '# Answer engines: allowed — these send referral traffic.',
    ...ANSWER_BOTS.flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', '']),
    '# Model-training crawlers: blocked — no benefit to the client.',
    ...TRAINING_BOTS.flatMap((bot) => [`User-agent: ${bot}`, 'Disallow: /', '']),
    `Sitemap: ${site.url}/sitemap-index.xml`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
