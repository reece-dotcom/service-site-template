import { site } from './client.mjs';

/**
 * Template copy that is NOT safe to hardcode.
 *
 * The template was written for replacement-window installers, so strings like
 * "What we install" leaked into pages for clients who do not install anything
 * — a glass repair specialist reading "What we install in Holyhead" above a
 * list of repairs looks like a template, and reads wrong to the customer and
 * to Google, which is matching that page against "glass repair holyhead".
 *
 * Defaults below stay installer-flavoured so existing clients are unchanged.
 * Override any of them per client with a `copy` block in site.config.mjs.
 * `{area}` is substituted; `{region}`, `{locality}` and `{business}` too.
 */
const DEFAULTS = {
  servicesHeading: 'What we install',
  servicesLede: 'Every job surveyed properly, quoted in writing and fitted by our own installers.',
  servicesDescription:
    'Everything {business} installs across {region} — windows, doors and conservatories, surveyed and fitted by our own team.',
  areasDescription:
    'Where {business} works — towns and postcodes across {region}, with local installers and a local number.',
  areaServicesHeading: 'What we install in {area}',
  areaCtaHeading: 'Getting windows or doors done in {area}?',
  serviceAreasHeading: '{service} near you',
  nearbyHeading: 'Nearby areas we cover',
};

export function copy(key, vars = {}) {
  const raw = site.copy?.[key] ?? DEFAULTS[key];
  if (raw === undefined) throw new Error(`[copy] unknown key "${key}"`);
  return raw.replace(/\{(\w+)\}/g, (m, name) => {
    const table = {
      business: site.business.name,
      region: site.contact.address.region,
      locality: site.contact.address.locality,
      ...vars,
    };
    if (table[name] === undefined) throw new Error(`[copy] "${key}" needs {${name}}`);
    return table[name];
  });
}
