/**
 * Gwydr Dawelen Glass — Benllech, Ynys Môn / Anglesey.
 * Built from /work/projects/client-briefs/dawelen-glass.md (researched 2026-08-29).
 *
 * WHAT IS DELIBERATELY MISSING, AND WHY
 * -------------------------------------
 * Everything below is either verified or absent. This client is a glass
 * repair specialist with a small footprint, so several blocks that the
 * template supports are switched off on purpose:
 *
 *  - `reviews`: EMPTY. There is no Google Business Profile (checked on Maps,
 *    no partial match) and the Facebook page is "not yet rated". His current
 *    website shows a fabricated "G 5.0 Based on Local Customer Feedback"
 *    badge; that does not come across to this build.
 *  - `owner`: OMITTED. We have not been told the owner's name. Never invent
 *    a person for the E-E-A-T page — ask at intake.
 *  - `accreditations`: GGF only, with the real membership number, which is
 *    checkable on the GGF register. No FENSA claim: FENSA covers replacement
 *    windows and doors and he has not told us he is registered.
 *  - `address.street` / `postcode`: OMITTED until confirmed. The address on
 *    Facebook is a guest house on Beach Road; publishing it and pinning a map
 *    on it is the classic sole-trader mistake.
 *  - `lp.stat`, `lp.jobs`, `lp.finance`: OMITTED. No measured figures, no
 *    photographed jobs with published reviews, no FCA-authorised finance.
 *
 * OPEN WITH THE OWNER (from the brief): DNS control for dawelenglass.co.uk,
 * English-only vs bilingual headings, vector logo, 6-10 job photos,
 * whether the Beach Road address should be public, owner's name.
 */
export default {
  slug: 'dawelen-glass',

  business: {
    name: 'Dawelen Glass',
    legalName: 'Gwydr Dawelen Glass',
    schemaType: 'HomeAndConstructionBusiness',
    tagline: 'Misted windows and broken glass, sorted on Anglesey',
    description:
      'Glass repair and replacement across Anglesey — misted double glazed units, broken windows, doors, mirrors, splashbacks and shower screens. GGF member, based in Benllech.',
    priceRange: '££',

    directAnswerQuestion: 'Who repairs double glazing on Anglesey?',
    directAnswer:
      'Dawelen Glass is a Benllech-based glass and glazing specialist working across Anglesey. We replace misted and failed double glazed units, board up and reglaze broken windows and doors, and cut mirrors, splashbacks and shower screens to size. We are a GGF member. Call 07921 252768.',

    /** The only badge we can prove. Number and register link both checked. */
    accreditations: [
      {
        name: 'GGF member',
        id: 'A3571',
        url: 'https://www.ggf.org.uk/members/gwydr-dawelen-glass/',
        blurb:
          'Member of the Glass and Glazing Federation, membership A3571. The GGF vets its members and publishes the register, so you can look us up before you let anyone into the house.',
      },
    ],

    /**
     * Hero bullets. The template defaults assume a replacement-window
     * installer, which this business is not — so they are set explicitly.
     */
    usps: [
      'Misted and failed double glazed units replaced — usually without a new frame',
      'Broken glass made safe quickly, across the island',
      'Mirrors, splashbacks and shower screens cut to your sizes',
      'GGF member A3571 — checkable on their own register',
    ],

    enquiryOptions: [
      'Misted or failed double glazed unit',
      'Broken window or door glass',
      'Emergency — glass broken now',
      'Mirror, splashback or shower screen',
      'Shopfront or commercial glass',
      'Something else',
    ],

    problems: [
      { title: 'A window you can no longer see out of', body: 'The seal has gone, moisture is sitting between the panes, and it never clears.' },
      { title: 'Broken glass, and the house is open', body: 'A pane goes through and suddenly it is a security problem, not a glazing problem.' },
      { title: 'Quoted for a whole new window', body: 'Told the frame has to go when it is the sealed unit inside it that failed.' },
      { title: 'Nobody will come out this far', body: 'Plenty of firms quote for Anglesey and then never make the drive.' },
    ],
    outcomes: [
      { title: 'A clear window again', body: 'A new sealed unit into the frame you already have, at a fraction of a replacement window.' },
      { title: 'Made safe the same day where we can', body: 'Boarded up if the glass has to be ordered, then glazed properly when it lands.' },
      { title: 'Glass cut to your sizes', body: 'Mirrors, splashbacks, shelves and shower screens measured and cut, not ordered from a standard list.' },
    ],

    comparison: {
      heading: 'Replacing the glass vs replacing the window',
      them: 'A new window',
      rows: [
        { label: 'What actually failed', us: 'The sealed unit — replaceable on its own', them: 'Frame, hardware and glass, all renewed' },
        { label: 'Typical time on site', us: 'Under an hour per unit', them: 'Half a day upwards' },
        { label: 'Disruption inside', us: 'Glass out, glass in, beads back', them: 'Frame out, making good, decorating after' },
        { label: 'When it is the right answer', us: 'Frame and hardware still sound', them: 'Rotten, distorted or badly fitted frames' },
      ],
    },

    homeFaqs: [
      {
        question: 'Can a misted double glazed unit be fixed without a new window?',
        answer:
          'Almost always, yes. The frame is usually fine — what has failed is the seal around the sealed unit inside it. We measure the unit, order the glass and swap it into the existing frame.',
      },
      {
        question: 'How quickly can you come out to broken glass?',
        answer:
          'Ring and tell us where you are on the island. If the glass has to be ordered we will board the opening up first so the house is secure overnight.',
      },
      {
        question: 'Do you cover the whole of Anglesey?',
        answer:
          'Yes — Benllech, Llangefni, Menai Bridge, Amlwch, Beaumaris, Pentraeth, Holyhead and the villages in between. If you are not sure, ring and ask.',
      },
      {
        question: 'Do you do mirrors and splashbacks as well as windows?',
        answer:
          'Yes. Mirrors, glass splashbacks, shelves, shower screens and table tops, cut and polished to your measurements.',
      },
    ],

    about: {
      title: 'About Dawelen Glass — glass and glazing on Anglesey',
      description:
        'Gwydr Dawelen Glass is a glass and glazing specialist based in Benllech, working across Anglesey. GGF member A3571.',
      heading: 'A glass specialist, not a double glazing salesman',
      lede: 'Most of what we do is repair: the unit that misted, the pane that went through, the shower screen that needs cutting to fit.',
      answerQuestion: 'Who is Dawelen Glass?',
      answer:
        'Gwydr Dawelen Glass is a glass and glazing business based in Benllech on Anglesey, trading as Dawelen Glass. The work is mainly repair and replacement: misted double glazed units, broken window and door glass, mirrors, splashbacks and shower screens, cut to size. GGF member A3571.',
      story: [
        'The business works across Ynys Môn from a base in Benllech, covering the coastal villages as readily as the island towns.',
        'The bulk of the work is glass rather than frames — sealed units that have misted, panes that have been broken, and made-to-measure mirrors and splashbacks.',
      ],
      faqs: [
        {
          question: 'Are you a member of a trade body?',
          answer:
            'Yes — the Glass and Glazing Federation, membership number A3571. You can look the membership up on the GGF register rather than taking our word for it.',
        },
      ],
    },
  },

  /**
   * /lp/ — advertising landing page. Only the blocks we can stand behind:
   * no statistic, no testimonials, no finance. That is the honest version of
   * the design, and it still has a hero, a job picker, the process, the
   * promises, coverage, FAQs and two forms.
   */
  lp: {
    enabled: true,
    title: 'Misted or broken glass on Anglesey? | Dawelen Glass',
    description:
      'Misted double glazed units, broken windows and doors, mirrors and splashbacks — repaired and replaced across Anglesey. GGF member. Call 07921 252768.',
    hero: {
      eyebrow: 'Ynys Môn · Anglesey',
      headline: 'We replace',
      rotate: ['misted units', 'broken glass', 'shower screens', 'mirrors'],
      sub: 'In most cases the frame stays exactly where it is — it is the sealed unit inside it that has failed.',
      points: [
        'Misted and failed units swapped into your existing frames',
        'Broken glass boarded up and made safe, then glazed properly',
        'Mirrors, splashbacks and shower screens cut to your sizes',
        'GGF member A3571 — checkable on their register',
      ],
    },
    jobTypesHeading: 'Tell us what the glass is doing and we will price that job.',
    jobTypes: [
      { label: 'Misted double glazing', note: 'Condensation sitting between the panes' },
      { label: 'Broken window or door', note: 'Boarded up first if the glass has to come in' },
      { label: 'Mirror or splashback', note: 'Cut and polished to your measurements' },
      { label: 'Shower screen or glass shelf', note: 'Toughened glass, measured on site' },
    ],
    steps: [
      { title: 'Ring or message', body: 'Tell us what has happened and roughly where you are on the island.' },
      { title: 'Measure', body: 'We measure the unit or the opening. For most repairs that is a short visit.' },
      { title: 'Price', body: 'A price for that job, before anything is ordered.' },
      { title: 'Fit', body: 'Glass in, beads back, old unit taken away with us.' },
    ],
    promises: [
      { title: 'We say if it does not need replacing', body: 'If the frame and hardware are sound, you need a sealed unit, not a new window, and we will tell you so.' },
      { title: 'Made safe first', body: 'If the glass has to be ordered, the opening is boarded up so the property is secure in the meantime.' },
      { title: 'Cleared up', body: 'Broken glass, the old unit and the packaging all leave with us.' },
      { title: 'Checkable', body: 'GGF membership A3571 is published on the federation register. Look it up before you book anyone.' },
    ],
    faqs: [
      {
        question: 'Is it cheaper to replace the glass than the window?',
        answer:
          'Substantially, when the frame is sound. You are paying for a sealed unit and the labour to fit it, not a new frame, new hardware and the making good afterwards.',
      },
      {
        question: 'How long does a misted unit take to sort?',
        answer:
          'The glass is made to measure, so there is a wait between measuring and fitting. The fitting itself is usually under an hour per unit.',
      },
      {
        question: 'Do you charge to come and look?',
        answer: 'Ring and describe the job. We will tell you on the phone whether it needs a visit to measure.',
      },
    ],
    quoteHeading: 'Send us the job.',
    quoteBody:
      'Tell us what the glass is doing, and where you are on the island. If you can, take a photo of the window and bring a rough size.',
    formHeading: 'Tell us about the glass',
  },

  /**
   * Template copy overrides. This business repairs and cuts glass; it does not
   * install replacement windows, so the installer-flavoured template defaults
   * ("What we install", "fitted by our own installers") would be untrue here.
   * `installs: false` also turns on the QA check that catches installer
   * wording creeping back in.
   */
  copy: {
    installs: false,
    servicesHeading: 'What we do',
    servicesLede:
      'Mostly repair and made-to-measure glass: the unit that misted, the pane that went through, the mirror that has to fit an alcove.',
    servicesDescription:
      'Glass repair and replacement across {region} — misted sealed units, broken window and door glass, mirrors, splashbacks and shower screens.',
    areasDescription:
      'Where {business} works — towns, villages and postcodes across {region}, from a base in {locality}. One number, answered locally.',
    areaServicesHeading: 'What we do in {area}',
    areaCtaHeading: 'Glass to sort in {area}?',
    serviceAreasHeading: '{service} across Anglesey',
    nearbyHeading: 'Nearby places we cover',
  },

  contact: {
    phone: '07921 252768',
    phoneHref: '+447921252768',
    email: 'enquiries@dawelenglass.co.uk',
    address: {
      // Street and postcode intentionally omitted until the owner confirms
      // what he wants public — the Facebook address is a guest house.
      locality: 'Benllech',
      region: 'Isle of Anglesey',
      country: 'GB',
    },
    geo: { lat: 53.3167, lng: -4.2333 },
    /**
     * Service radius in km, emitted as a GeoCircle in the LocalBusiness
     * schema. 30km from Benllech covers the whole island including Holyhead
     * and Rhosneigr, and stops just short of Bangor — which is honest, and
     * keeps the entity anchored to Anglesey rather than the mainland.
     */
    serviceRadiusKm: 30,
    /**
     * No googlePlaceId: there is no Google Business Profile yet, and pinning
     * a home or guest-house address is the wrong answer for a service-area
     * business. Coverage-area embed instead.
     */
    googlePlaceId: '',
    mapEmbedQuery: 'Benllech, Isle of Anglesey',
    mapZoom: 11,
  },

  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:30' },
    { days: ['Saturday'], opens: '09:00', closes: '13:00' },
  ],

  social: {
    facebook: 'https://www.facebook.com/dawelenglass',
  },

  url: 'https://glazeos-dawelen-glass.netlify.app',

  forms: {
    // TODO: swap to the GHL endpoint for this client's sub-account before launch.
    provider: 'netlify',
    ghlEndpoint: '',
    ghlLocationId: '',
  },

  analytics: {
    plausibleDomain: '',
    ga4Id: '',
  },

  /**
   * NO REVIEWS. No GBP, Facebook not yet rated. Nothing goes in here until
   * there are real, published reviews to point at — which is exactly the
   * argument for the Google Business Profile upsell.
   */
  reviews: {
    aggregate: null,
    featured: [],
  },

  /** Palette sampled from his own DG monogram logo (see brief). */
  theme: {
    brand: '#004BA6',
    brandDark: '#00337A',
    // Logo blues. The pale glass cyan from the logo (#A8E8F2) is too weak
    // for a primary button against white, so it is not the accent — the
    // logo's mid blue is, with white text.
    accent: '#0564C2',
    accentInk: '#FFFFFF',
    ink: '#0E1116',
    muted: '#5A6672',
    surface: '#F1F6FB',
    fontHeading: "'Bricolage Grotesque', system-ui, sans-serif",
    fontBody: "system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
};
