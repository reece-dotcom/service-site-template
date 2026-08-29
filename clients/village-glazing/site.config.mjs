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
    directAnswerQuestion: 'Who repairs windows and doors in Wallasey and the Wirral?',
    directAnswer:
      'Village Glazing Repairs is a Wallasey-based window and door repair service covering the whole of the Wirral. We fix locks, hinges, handles, multipoint mechanisms, misted double glazed units and lead lights in the frames you already have, rather than replacing them. Twenty-one years in the trade. Call 07708 132985 for a price.',
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
    // Deliberately NOT using the Place ID here: his GBP pin sits on his home
    // address. Service-area businesses get a coverage-area map instead.
    googlePlaceId: '',
    mapEmbedQuery: 'Wallasey, Wirral, Merseyside',
    mapZoom: 12,
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
  // Real Google Business Profile data, read off his live listing 2026-08-27.
  // 5.0 from 13 reviews. Facebook's "100% recommend (11)" is a recommendation
  // count, not a rating — not used anywhere.
  reviews: {
    profileUrl: 'https://www.google.com/maps/place/?q=place_id:ChIJ9X6Y-eU9q24RIfyZJ3Gwc-0',
    aggregate: { ratingValue: '5.0', reviewCount: 13, source: 'Google' },
    featured: [
      {
        author: 'Eve & Isaac',
        when: '2 months ago',
        rating: 5,
        body: 'Excellent service, sent a message with what was needed. Came out first thing and fixed both windows within 10 minutes. Would definitely recommend.',
      },
      {
        author: 'Lauren Clewes',
        when: '5 months ago',
        rating: 5,
        body: 'Great experience! Same day service, was so helpful. Best around I\u2019d say. Would 100% recommend.',
      },
      {
        author: 'Google review',
        when: '',
        rating: 5,
        body: 'He came out to repair straight away so the property could be made secure.',
      },
    ],
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
      // REAL photo — his own Facebook profile picture, a cracked sealed unit
      // lifted out at a Wallasey terrace. The other two are placeholders.
      { src: 'real-blown-unit.webp', alt: 'Cracked double glazed unit removed from a bay window in Wallasey', caption: 'Cracked unit out, new sealed unit in — his own photo.' },
    ],
  },

  theme: {
    // Sampled from his own Google Business Profile logo banner (navy + blue
    // + glass-blue highlight). Do not invent colours when the client has a logo.
    brand: '#0b2d5c',
    brandDark: '#061d3d',
    accent: '#2f7fe0',
    accentInk: '#ffffff',
    ink: '#121a26',
    muted: '#5a6675',
    surface: '#f2f6fb',
    fontHeading: "'Bricolage Grotesque', system-ui, sans-serif",
    fontBody: "system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
};
