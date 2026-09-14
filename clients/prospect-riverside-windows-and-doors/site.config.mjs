/**
 * PROSPECT DEMO — Riverside Windows & Doors, Chelmsford. Built from the
 * Lighthouse call on 13 Sep 2026 (Close lead lead_WamwFlEnNKdnrjoQ5iItkTTyUItUdsHwCO1vJUV6bsI).
 *
 * Everything here came from Dave on the call or from checks we ran; nothing is
 * invented. Not verified yet: the FENSA number, the Checkatrade profile URL and
 * the "over 20 years" claim on his current site (he started in 2011).
 */
export default {
  slug: 'prospect-riverside-windows-and-doors',
  demo: { enabled: true },

  business: {
    name: 'Riverside Windows & Doors',
    legalName: 'Riverside Windows & Doors',
    homeTitle: 'Riverside Windows & Doors | Chelmsford Installer',
    schemaType: 'HomeAndConstructionBusiness',
    tagline: 'Windows, doors and bi-folds fitted across Chelmsford by the man who surveyed them',
    description:
      'uPVC windows, composite doors, bi-fold doors and conservatories across Chelmsford, Braintree, Witham and Maldon. FENSA registered, GGF member, ten-year insurance-backed guarantee.',
    yearFounded: 2011,
    priceRange: '££',
    directAnswerQuestion: 'Who fits windows and doors in Chelmsford?',
    directAnswer:
      'Riverside Windows & Doors is a FENSA-registered installer based in Chelmsford, fitting uPVC windows, composite doors, bi-fold doors and conservatories across mid Essex since 2011. Dave Riley surveys every job himself and one fitting team does the work. Every quote is a fixed price in writing, backed by a ten-year insurance-backed guarantee.',
    accreditations: [
      { name: 'FENSA registered', blurb: 'Replacement windows and doors are self-certified against Building Regulations and you receive the FENSA certificate for your file.' },
      { name: 'GGF member', blurb: 'A member of the Glass and Glazing Federation, the trade body for the industry, which sets the standards the work is done to.' },
    ],
    guarantee: {
      heading: 'Ten years, insurance-backed',
      body: 'The workmanship guarantee runs for ten years and is underwritten by an independent insurer, so the cover stands whatever happens to the business. The certificate comes with the paperwork.',
    },
    usps: [
      'Dave surveys every job himself — the price is right first time',
      'One fitting team, no subcontractors',
      'Fixed written quote, no sales visit that drags on',
      'FENSA registered, GGF member, ten-year insurance-backed guarantee',
    ],
    enquiryOptions: ['New uPVC windows', 'Composite front or back door', 'Bi-fold doors', 'Conservatory', 'Not sure yet'],
    problems: [
      { title: 'A two-hour sales visit', body: 'A salesman on the sofa, a price that only exists if you sign tonight, and no idea what the job should really cost.' },
      { title: 'Draughts and misted glass', body: 'Sealed units that have failed, seals gone hard, and the heating bill going up every winter.' },
      { title: 'A back wall that keeps the garden out', body: 'A patio door you never use because it opens onto a step and half the width is frame.' },
    ],
    outcomes: [
      { title: 'A fixed price from the person who fits it', body: 'Dave measures, Dave prices, and the same figure is on the invoice at the end.' },
      { title: 'A warmer, quieter house', body: 'A-rated units, properly sealed, by a team that does this every day.' },
      { title: 'The whole back wall open', body: 'Bi-folds that stack flat to one side and a threshold you can step straight over.' },
    ],
    comparison: {
      heading: 'Riverside vs the national companies',
      them: 'National companies',
      rows: [
        { label: 'Who surveys the job', us: 'Dave, the owner', them: 'A salesperson on commission' },
        { label: 'Who fits it', us: 'Our own team of three', them: 'Often subcontracted' },
        { label: 'The price', us: 'Fixed, in writing, first visit', them: 'A discount that expires tonight' },
        { label: 'Guarantee', us: 'Ten years, insurance-backed', them: 'Varies — read the small print' },
      ],
    },
    homeFaqs: [
      { question: 'Do you charge for the survey?', answer: 'No. Dave comes out, measures up and sends a fixed written price. No charge and no obligation.' },
      { question: 'Which areas do you cover?', answer: 'Chelmsford, Braintree, Witham and Maldon, and the villages in between. If you are a little further out, ring and ask.' },
      { question: 'Is the work guaranteed?', answer: 'Yes. Ten years, insurance-backed, so the guarantee is honoured even if the business stopped trading.' },
      { question: 'Who actually turns up?', answer: 'The same fitting team every time. We do not subcontract.' },
    ],
    owner: { name: 'Dave Riley', role: 'Owner and surveyor', since: 2011 },
    about: {
      title: 'About Riverside Windows & Doors, Chelmsford',
      description: 'Dave Riley has run Riverside Windows & Doors since 2011. He surveys every job and one fitting team does the work across Chelmsford and mid Essex.',
      heading: 'One owner, one fitting team, since 2011',
      lede: 'Dave Riley started Riverside in 2011. He still surveys every job, and the three-man team that fits it has been with him for years.',
      answerQuestion: 'Who is Riverside Windows & Doors?',
      answer:
        'Riverside Windows & Doors is a Chelmsford-based installer run by Dave Riley since 2011. It fits uPVC windows, composite doors, bi-fold doors and conservatories across Chelmsford, Braintree, Witham and Maldon with a single employed fitting team. FENSA registered and a GGF member, with a ten-year insurance-backed guarantee on the work.',
      story: [
        'Dave set the business up in 2011 and has kept it deliberately small: he surveys every job himself, and one team of three fitters does the installing.',
        'Most of the work comes by recommendation and through Checkatrade, and Dave hears the same thing from customers who have had the national companies round — they wanted a straight price from someone who would actually be doing the job.',
      ],
      faqs: [
        { question: 'Do you subcontract?', answer: 'No. One fitting team, employed by us, on every job.' },
      ],
    },
  },

  /** Centered full-bleed hero (the Miller format). Photos go in `slides` once
   *  the prospect sends some — one per rotating word, same order. */
  home: {
    heroLayout: 'centered',
    /* No superlative: the guard would (rightly) refuse "the only installer…". */
    announce: 'Surveyed by the owner, fitted by our own team, priced in writing before anything is ordered',
    /* Only figures Dave gave us on the call. */
    stats: [
      { value: '15+', label: 'years fitting in Chelmsford and mid Essex' },
      { value: '4.9★', label: 'from 14 Google reviews' },
      { value: '10 yrs', label: 'insurance-backed guarantee' },
      { value: '1 team', label: 'our own fitters, never subcontracted' },
    ],
    hero: {
      headline: 'In Chelmsford we fit',
      rotate: ['uPVC windows', 'composite doors', 'bi-fold doors', 'conservatories'],
      sub: 'Surveyed by Dave, fitted by the same three-man team every time, priced in writing before anything is ordered. Chelmsford, Braintree, Witham and Maldon.',
      cta: 'Get a free quote',
      note: 'One fixed price from the person who fits it. No sales visit, no pressure.',
    },
  },

  contact: {
    phone: '07700 900321',
    phoneHref: '+447700900321',
    email: 'dave@riversidewindows.example',
    address: { locality: 'Chelmsford', region: 'Essex', postcode: 'CM2', country: 'GB' },
    geo: { lat: 51.7343, lng: 0.4691 },
    serviceRadiusKm: 20,
    googlePlaceId: '',
    mapEmbedQuery: 'Chelmsford, Essex',
    mapZoom: 10,
  },

  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:30' },
    { days: ['Saturday'], opens: '09:00', closes: '13:00' },
  ],

  social: { facebook: 'https://facebook.com/riversidewindows' },

  url: 'https://riverside-windows-and-doors--glazeos-demos.netlify.app',

  forms: { provider: 'netlify', ghlEndpoint: '', ghlLocationId: '' },
  analytics: { plausibleDomain: '', ga4Id: '' },

  /** Real figures from the call: 14 Google reviews at 4.9. */
  reviews: { aggregate: { ratingValue: 4.9, reviewCount: 14, source: 'Google' }, featured: [] },

  theme: {
    brand: '#1F5F7A',
    brandDark: '#143F52',
    accent: '#F2B134',
    accentInk: '#16202B',
    ink: '#172026',
    muted: '#5A6A73',
    surface: '#F3F6F7',
  },
};
