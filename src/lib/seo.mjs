import { site } from './client.mjs';

/** Hard caps, enforced everywhere a title/description is produced. */
export function assertSeo(title, description, where) {
  if (!title || title.length > 60) {
    throw new Error(`[SEO] ${where}: title must be 1-60 chars, got ${title?.length ?? 0}: "${title}"`);
  }
  if (!description || description.length > 160) {
    throw new Error(
      `[SEO] ${where}: meta description must be 1-160 chars, got ${description?.length ?? 0}`
    );
  }
  return { title, description };
}

export const canonical = (pathname) =>
  new URL(pathname.endsWith('/') ? pathname : `${pathname}/`, site.url).href;

const addr = () => ({
  '@type': 'PostalAddress',
  streetAddress: site.contact.address.street,
  addressLocality: site.contact.address.locality,
  addressRegion: site.contact.address.region,
  postalCode: site.contact.address.postcode,
  addressCountry: site.contact.address.country,
});

/**
 * Primary business entity. `services` and `areas` are the live content
 * collections: passing them turns the entity into a full service catalogue
 * with an explicit service area, which is what Google and the AI answer
 * engines read to decide what this business does and where. Never hand-write
 * these lists per client — they come from the client's own content.
 */
export function localBusinessSchema({ services = [], areas = [] } = {}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': site.business.schemaType,
    '@id': `${site.url}/#business`,
    name: site.business.name,
    legalName: site.business.legalName,
    description: site.business.description,
    url: `${site.url}/`,
    telephone: site.contact.phone,
    email: site.contact.email,
    priceRange: site.business.priceRange,
    address: addr(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.contact.geo.lat,
      longitude: site.contact.geo.lng,
    },
    openingHoursSpecification: site.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: Object.values(site.social).filter(Boolean),
  };

  if (services.length) {
    schema.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: `${site.business.name} services`,
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.name,
          description: s.description,
          url: canonical(`/services/${s.slug}/`),
        },
      })),
    };
  }

  // A service-area business must state its area explicitly; the postal address
  // alone makes Google guess, and for installers with no shopfront it guesses
  // badly.
  const served = areas.length
    ? areas.map((a) => ({ '@type': 'Place', name: a.name }))
    : [{ '@type': 'Place', name: site.contact.address.region }].filter(
        () => site.contact.address.region
      );
  if (served.length) schema.areaServed = served;
  // Only emit ratings that actually exist. Never fabricate.
  if (site.reviews?.aggregate) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: site.reviews.aggregate.ratingValue,
      reviewCount: site.reviews.aggregate.reviewCount,
    };
  }
  return schema;
}

export function serviceSchema({ name, description, url, areaServed }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    provider: { '@id': `${site.url}/#business` },
    areaServed: areaServed
      ? { '@type': 'Place', name: areaServed }
      : { '@type': 'Place', name: site.contact.address.region },
  };
}

export function faqSchema(faqs) {
  if (!faqs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function blogPostingSchema({ headline, description, url, published, updated, author }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    url,
    datePublished: published.toISOString(),
    dateModified: (updated ?? published).toISOString(),
    author: { '@type': 'Person', name: author },
    publisher: { '@id': `${site.url}/#business` },
    mainEntityOfPage: url,
  };
}

export function contactPageSchema(url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url,
    mainEntity: { '@id': `${site.url}/#business` },
  };
}

/**
 * BreadcrumbList for a page. `trail` is ordered, excluding the home entry,
 * e.g. [{ name: 'Services', path: '/services/' }, { name: 'Lock repairs' }].
 * The last item is the current page and needs no path.
 */
export function breadcrumbSchema(trail = []) {
  const items = [{ name: 'Home', path: '/' }, ...trail];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: canonical(item.path) } : {}),
    })),
  };
}
