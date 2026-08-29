/**
 * PER-CLIENT CONFIG — the only place client values are allowed to live.
 * Copy this file into a new clients/<slug>/ folder for each installer.
 */
export default {
  slug: 'demo-glazing',

  // --- Business identity (NAP must match Google Business Profile exactly) ---
  business: {
    name: 'Demo Glazing',
    legalName: 'Demo Glazing Ltd',
    schemaType: 'HomeAndConstructionBusiness', // LocalBusiness subtype
    tagline: 'Windows & doors fitted properly, first time',
    description:
      'A-rated uPVC and aluminium windows, composite doors and conservatories, installed across South Manchester by a FENSA-registered family team.',
    yearFounded: 2009,
    priceRange: '££',
    // AEO direct answer — 40-60 words, quoted verbatim by AI answer engines.
    directAnswerQuestion: 'Who fits windows and doors in South Manchester?',
    directAnswer:
      'Demo Glazing is a FENSA-registered family installer fitting A-rated uPVC and aluminium windows, composite doors and conservatories across South Manchester. Every job is surveyed and priced in writing before any work starts, and the installation is done by our own fitters rather than subcontractors. Call 0161 000 0000 for a quote.',
    // Strings are fine, but the object form is better: an ID and a link to the
    // issuing body's own register turn a decorative badge into a checkable one.
    accreditations: [
      { name: 'FENSA registered', id: '00000', url: 'https://www.fensa.org.uk/fensa-approved-installer-search' },
      { name: 'Which? Trusted Trader' },
      { name: 'Checkatrade' },
    ],

    /**
     * The named human who does the work. Drives the About page and the
     * founder/employee schema. Leave the whole block out if the client has not
     * told you — never invent a person.
     */
    owner: {
      name: 'Sample Owner',
      role: 'Owner and installer',
      since: 2009,
    },

    /** About page content. Every field optional; omitted blocks disappear. */
    about: {
      title: 'About Demo Glazing — who turns up at your door',
      description:
        'Family-run window and door installer covering Demo Town since 2009. Meet the person who quotes the job and does the work.',
      heading: 'A two-van firm, not a call centre',
      lede: 'You will deal with the same person from the quote to the last bit of trim.',
      photo: 'hero.webp',
      answerQuestion: 'Who is Demo Glazing?',
      answer:
        'Demo Glazing is a family-run window and door installer based in Demo Town, working across the county since 2009. Windows, doors and conservatories are fitted by the owner and one employed installer, not subcontracted out. FENSA registered. Call 01234 567890 for a quote.',
      story: [
        'The business started in 2009 with one van and a reputation built entirely on word of mouth from the first dozen jobs in Demo Town.',
        'It has deliberately stayed small. Two vans, no subcontractors, and the person who prices your job is the person who fits it.',
      ],
      faqs: [
        {
          question: 'Do you subcontract the work out?',
          answer: 'No. Every installation is done by the owner and one employed installer.',
        },
      ],
    },
  },

  contact: {
    phone: '0161 000 0000',
    phoneHref: '+441610000000', // tel: format, no spaces
    email: 'hello@demoglazing.co.uk',
    address: {
      street: 'Unit 4, Example Business Park',
      locality: 'Stockport',
      region: 'Greater Manchester',
      postcode: 'SK1 1AA',
      country: 'GB',
    },
    geo: { lat: 53.4084, lng: -2.1494 },
    // https://www.google.com/maps/place/?q=place_id:...
    googlePlaceId: '',
    mapEmbedQuery: 'Stockport, Greater Manchester',
  },

  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:30' },
    { days: ['Saturday'], opens: '09:00', closes: '13:00' },
  ],

  social: {
    facebook: '',
    instagram: '',
    // Used for sameAs in schema — only include profiles that really exist.
  },

  // --- Deployment ---
  url: 'https://glazeos-demo-glazing.netlify.app', // production URL, no trailing slash

  // --- Conversion ---
  forms: {
    /**
     * GHL is the default: leads must land in the CRM to trigger follow-up and
     * review-request workflows. Set provider to 'netlify' only as a fallback.
     */
    provider: 'ghl', // 'ghl' | 'netlify'
    ghlEndpoint: 'https://services.leadconnectorhq.com/forms/submit/REPLACE_ME',
    ghlLocationId: '',
  },

  analytics: {
    plausibleDomain: 'demoglazing.co.uk', // '' to disable
    ga4Id: '', // leave empty — GA4 costs page weight and needs a consent banner
  },

  /**
   * Real reviews only. Never invent ratings or testimonials — fabricated
   * review schema is a manual-action risk and it is not worth it.
   */
  reviews: {
    aggregate: null, // e.g. { ratingValue: 4.9, reviewCount: 127, source: 'Google' }
    featured: [],
  },

  // Six colour tokens + two fonts. Give every client a distinct palette so
  // builds don't read as the same starter kit.
  theme: {
    brand: '#0f4c81',
    brandDark: '#0a3459',
    accent: '#f6a01a',
    ink: '#16202b',
    muted: '#5b6b7c',
    surface: '#f5f7fa',
    fontHeading: "'Bricolage Grotesque', system-ui, sans-serif",
    fontBody: "system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
};
