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
      {
        name: 'FENSA registered',
        id: '00000',
        url: 'https://www.fensa.org.uk/fensa-approved-installer-search',
        // One plain sentence: what the body is, and what the customer gets.
        blurb:
          'Every window and door we fit is registered with FENSA, so the work is certified against Building Regulations and you get the certificate for your file.',
      },
      { name: 'Which? Trusted Trader', blurb: 'Assessed on customer service and trading practice, and re-checked, not a badge bought once.' },
      { name: 'Checkatrade' },
    ],

    /**
     * Insurance-backed guarantee paragraph. Only include it if the client
     * genuinely holds one — check the policy, do not assume.
     */
    guarantee: {
      heading: 'Your guarantee is insurance-backed',
      body: 'The workmanship guarantee is underwritten by an independent insurer, so if this business ever stopped trading your cover would still be honoured. You get the certificate with the paperwork, at no extra cost.',
    },

    /** Dropdown on the quote form. Match what the client actually sells. */
    enquiryOptions: [
      'New windows',
      'New doors or bi-folds',
      'Double glazing repairs',
      'Conservatory',
      'Fascias, soffits and guttering',
      'Not sure yet',
    ],

    /** Problem/outcome pair. Use their customers' words, not marketing words. */
    problems: [
      { title: 'Heat and money escaping', body: 'Failed units and worn seals let the heating you paid for straight back out.' },
      { title: 'Draughts and condensation', body: 'Wet sills every morning and a cold edge to every room facing the weather.' },
      { title: 'Traffic noise', body: 'Single glazing on a main road makes the front of the house unusable in the evening.' },
      { title: 'Security worries', body: 'Old locks and tired frames are the easiest thing on the street to get through.' },
      { title: 'Dread of the sales visit', body: 'Two hours in your front room, a discount that appears when you stand up, a price nobody can explain.' },
    ],
    outcomes: [
      { title: 'A warmer house, lower bills', body: 'A-rated units and proper installation, so the heat stays where you put it.' },
      { title: 'Quiet rooms', body: 'Acoustic glass on the road side where it earns its money, standard units elsewhere.' },
      { title: 'Secure and better looking', body: 'Multi-point locking, and frames that suit the house rather than fighting it.' },
    ],

    /**
     * Comparison table. Every row must be defensible — if the client does
     * subcontract sometimes, do not tick that row.
     */
    comparison: {
      heading: 'Buying from us vs buying from a national chain',
      them: 'National chains',
      rows: [
        { label: 'Who quotes the job', us: 'The owner, on site', them: 'Commission salesperson' },
        { label: 'Who fits the job', us: 'Our own installers', them: 'Often subcontracted' },
        { label: 'Pricing', us: 'Fixed, in writing', them: 'Discount that drops if you hesitate' },
        { label: 'Sales visit length', us: 'About 30 minutes', them: 'Two hours plus' },
        { label: 'Who you ring if something goes wrong', us: 'The person who fitted it', them: 'Call centre' },
      ],
    },

    /**
     * Optional promotion. `expires` is required and enforced at build time —
     * the block disappears once the date passes. Never run an evergreen
     * "ends this month" banner: false urgency is illegal under the CPRs and
     * the DMCC Act 2024, and it is the client who gets fined.
     */
    offer: {
      name: 'The survey-and-quote package',
      items: [
        'Free, no-obligation survey — about 30 minutes',
        'Fixed written price, itemised',
        'Fitted by our own team, cleared up before we leave',
      ],
      expires: '2026-12-31',
      terms: 'Terms confirmed in writing at the point of quote.',
    },

    /** Home-page FAQs. Falls back to about.faqs if omitted. */
    homeFaqs: [
      { question: 'Is the quote really free?', answer: 'Yes. We survey, measure and send a fixed written price. There is no charge and no obligation.' },
      { question: 'What areas do you cover?', answer: 'Stockport and the surrounding parts of Greater Manchester. If you are on the edge of that, ring and ask.' },
      { question: 'Do you subcontract the work?', answer: 'No. The people who fit your windows are the people who work here.' },
      { question: 'How long does an installation take?', answer: 'A typical whole-house replacement is two to three days. We tell you the days before you commit.' },
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

  /**
   * /lp/ — noindex advertising landing page (design ported 2026-09-11).
   * Optional per client. Everything here is a claim someone could be asked
   * to prove, so the risky blocks refuse to render without their evidence
   * field: see src/lib/lp.mjs.
   */
  lp: {
    enabled: true,
    title: 'Demo Glazing | Free window and door quote',
    description:
      'Fixed written quotes for windows, doors and conservatories across South Manchester. Surveyed and fitted by our own team, never subcontracted.',
    hero: {
      eyebrow: 'South Manchester',
      headline: 'New',
      rotate: ['windows', 'doors', 'conservatories'],
      sub: 'Surveyed properly, priced in writing, fitted by the people who quoted it.',
      points: [
        'Fixed written price after a 30-minute survey',
        'Our own fitters, never subcontracted',
        'FENSA registered — your certificate comes with the job',
      ],
    },
    // A statistic needs a stated basis or the build fails. This is what makes
    // the number persuasive as well as legal.
    stat: {
      value: '94%',
      label: 'of jobs were fitted within six weeks of the survey.',
      basis: 'the 108 installations completed between January and August 2026',
    },
    steps: [
      { title: 'You ring or message', body: 'Tell us the job. Most things we can talk through in five minutes.' },
      { title: 'Survey', body: 'About 30 minutes, at a time that suits you. We measure and check the reveals.' },
      { title: 'Fixed price', body: 'An itemised written quote. It does not move, and it does not expire on the doorstep.' },
      { title: 'Fitting day', body: 'Dust sheets down, old units away with us, everything cleaned before we leave.' },
      { title: 'Paperwork', body: 'FENSA certificate and guarantee documents, sent to you the same week.' },
    ],
    promises: [
      { title: 'Reliable', body: 'A confirmed fitting date the week before, and a call the morning we set off.' },
      { title: 'Clean', body: 'Dust sheets before the first frame comes out. Offcuts and packaging leave with us the same day.' },
      { title: 'Courteous', body: 'Shoe covers indoors, every opening secured while we are on site, nothing left unsealed overnight.' },
      { title: 'Honest', body: 'If we find rotten timber or a failed lintel, we stop, show you, and price it before carrying on.' },
    ],
    faqs: [
      { question: 'Is the survey really free?', answer: 'Yes, and there is no obligation. You get the written price whether you use us or not.' },
      { question: 'How soon can you start?', answer: 'Survey usually within a week. Fitting depends on the frames — we tell you the lead time before you commit.' },
    ],
    quoteHeading: 'Start with the job you have got.',
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
