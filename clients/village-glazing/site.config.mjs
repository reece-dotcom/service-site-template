/**
 * PER-CLIENT CONFIG — Village Glazing Repairs (Wallasey, Wirral)
 * DEMO build for sales pitch. Facts sourced from the business's Facebook page
 * (facebook.com/villageglazingrepairs) on 2026-08-27. Anything not on that page
 * is marked TODO and must be confirmed with the owner before go-live.
 */
export default {
  slug: 'village-glazing',

  business: {
    name: 'Village Glazing Repairs',
    legalName: 'Village Glazing Repairs',
    schemaType: 'HomeAndConstructionBusiness',
    tagline: 'Repair the windows you have — don’t replace the frames',
    description:
      'Window and door repairs across Wallasey and the Wirral: locks, hinges, handles, multipoint mechanisms, misted double glazed units and lead lights. 21 years experience.',
    yearFounded: 2005,
    priceRange: '£',
    accreditations: [],
    yearsLabel: 'repairing windows and doors on the Wirral',
    process: [
      { title: 'Tell us what it does', body: 'Sticking, dropped, misted, will not lock — describe it and we can usually price it on the phone.' },
      { title: 'We diagnose the real fault', body: 'The handle is rarely the problem. We find what is actually worn so the repair holds.' },
      { title: 'Repaired, not replaced', body: 'Parts fitted, door or window adjusted, and you keep the frames you already have.' },
    ],
    usps: [
      'Repairs, not replacements — the frames you have, working properly again',
      'Locks, hinges, handles and multipoint mechanisms replaced in place',
      'Misted and blown sealed units swapped without touching the frame',
      'Wallasey based, covering the whole Wirral — 21 years in the trade',
    ],
  },

  contact: {
    phone: '07708 132985',
    phoneHref: '+447708132985',
    email: 'Villageglazing@gmail.com',
    address: {
      street: '',
      locality: 'Wallasey',
      region: 'Merseyside',
      postcode: '',
      country: 'GB',
    },
    geo: { lat: 53.4239, lng: -3.0686 },
    googlePlaceId: '',
    mapEmbedQuery: 'Wallasey, Wirral',
  },

  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' },
  ],

  social: {
    facebook: 'https://www.facebook.com/villageglazingrepairs',
    instagram: '',
  },

  url: 'https://glazeos-village-glazing.netlify.app',

  forms: {
    provider: 'netlify',
    ghlEndpoint: '',
    ghlLocationId: '',
  },

  analytics: {
    plausibleDomain: '',
    ga4Id: '',
  },

  // Real reviews only. Facebook shows "100% recommend (11 reviews)" but that is
  // a recommendation count, not a star rating — no aggregateRating schema.
  reviews: {
    aggregate: null,
    featured: [],
  },

  /**
   * Images live in clients/<slug>/images/ and are referenced by filename.
   * DEMO NOTE: these are AI-generated placeholders standing in for the owner's
   * own job photos — swap them for his real work before this goes live.
   */
  media: {
    hero: 'hero.webp',
    gallery: [
      { src: 'gallery1.webp', alt: 'Repaired uPVC front door with new handle and lock', caption: 'New multipoint mechanism, cylinder and handle — same door.' },
      { src: 'gallery2.webp', alt: 'Traditional leaded light window panel being repaired', caption: 'Lead light repaired in place rather than replaced.' },
      { src: 'units.webp', alt: 'Misted double glazed unit next to a clear one', caption: 'Blown unit swapped, frame untouched.' },
    ],
  },

  theme: {
    brand: '#15616d',
    brandDark: '#0d3b43',
    accent: '#ff8a3d',
    ink: '#14211f',
    muted: '#5c6f6d',
    surface: '#f4f8f7',
    fontHeading: "'Bricolage Grotesque', system-ui, sans-serif",
    fontBody: "system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
};
