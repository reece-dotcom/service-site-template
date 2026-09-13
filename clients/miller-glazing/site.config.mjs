/**
 * Miller Glazing Ltd — Dagenham, east London / Essex border.
 * Built from /work/projects/client-briefs/miller-glazing.md (2026-09-12/13).
 *
 * WHAT IS VERIFIED, WHAT IS ABSENT, AND WHY
 * -----------------------------------------
 *  - Company: Companies House 15428989, incorporated 21 Jan 2024, SIC 43342
 *    Glazing, directors Liam William Hales and Kai Hales (a third family
 *    director resigned May 2024). "Family-run" is therefore true; "over
 *    5 years experience" from the old preview site is NOT — the company is
 *    under two years old, so nothing here claims years in trade until the
 *    owner tells us his personal history.
 *  - Checkatrade: member since March 2025, owner "Mr Liam Hales", category
 *    Windows / Doors / Conservatories, 0 reviews, public liability
 *    UNVERIFIED on their side. Listed as an accreditation with the profile
 *    URL because it is checkable; no rating or review count anywhere.
 *  - Phone: taken from the Checkatrade "show phone number" reveal
 *    (07411 290295). The old preview site had a 12-digit US-formatted
 *    number that cannot be real. CONFIRM WITH THE OWNER before launch.
 *  - `reviews`: EMPTY. No Google Business Profile exists, Checkatrade has 0.
 *  - `address.street` / `postcode`: OMITTED. The registered office is a
 *    residential street (RM8); it stays off the site and off the map.
 *  - FENSA / CERTASS: NO CLAIM. Not stated anywhere we can check.
 *  - `lp.stat`, `lp.jobs` quotes, `lp.finance`: OMITTED — no evidence.
 *
 * POSITIONING: the six job photos supplied by the client are all
 * steel-look (Crittall-style) internal glazed doors, bifolds, sliders and a
 * glazed cabinet, so that is the lead service. Double glazing repair and
 * windows/external doors come from his Checkatrade skill list and the old
 * site; the owner should confirm the fourth service before launch.
 *
 * OPEN WITH THE OWNER: phone number, hours, which of the 8 preview towns he
 * genuinely covers (Basildon and Chelmsford held back for now), whether he
 * fits replacement windows / external doors and under which scheme, who
 * owns millerglazing.co.uk, GBP creation, a couple of sentences on how he
 * and Kai started.
 */
export default {
  slug: 'miller-glazing',

  business: {
    name: 'Miller Glazing',
    legalName: 'Miller Glazing Ltd',
    schemaType: 'HomeAndConstructionBusiness',
    tagline: 'Steel-look internal doors and glazing, fitted across east London and Essex',
    description:
      'Steel-look internal glass doors, bifolds and sliders, double glazing repairs and glass replacement across Dagenham, Romford, Barking, Ilford and Essex. Family-run, Checkatrade member.',
    yearFounded: 2024,
    priceRange: '££',

    directAnswerQuestion: 'Who fits steel-look internal glass doors in east London?',
    directAnswer:
      'Miller Glazing is a family-run glazing company based in Dagenham, working across east London and south Essex. We measure, supply and fit steel-look internal glass doors, bifolds and sliders, and repair misted or broken double glazing in existing frames. Checkatrade member. Call 07411 290295 for a fixed price.',

    /** Only badges we can point at. Checkatrade profile is public. */
    accreditations: [
      {
        name: 'Checkatrade member',
        url: 'https://www.checkatrade.com/trades/millerglazingltd',
        blurb:
          'Listed on Checkatrade since March 2025 under Windows, Doors and Conservatories. The profile is public, so you can see exactly what is there before you book.',
      },
      {
        name: 'Registered limited company',
        id: '15428989',
        url: 'https://find-and-update.company-information.service.gov.uk/company/15428989',
        blurb:
          'Miller Glazing Ltd, company number 15428989, registered at Companies House with named directors. A trading name you can look up, not just a mobile number.',
      },
    ],

    usps: [
      'Steel-look internal doors, bifolds and sliders measured and fitted by us',
      'Misted and broken double glazing replaced in your existing frames',
      'Family-run — you deal with Liam or Kai from quote to fitting',
      'Fixed price in writing before anything is ordered',
    ],

    enquiryOptions: [
      'Steel-look internal door or partition',
      'Internal bifold or sliding doors',
      'Misted or broken double glazing',
      'Window or door glass replacement',
      'New windows or external doors',
      'Not sure yet',
    ],

    problems: [
      { title: 'Two rooms that should be one — but not quite', body: 'A kitchen and living room you want connected for light and separate for noise, and a stud wall giving you neither.' },
      { title: 'A dark hallway', body: 'Solid internal doors keep every bit of daylight in the room it came from.' },
      { title: 'A window you can no longer see out of', body: 'Condensation between the panes, and a quote for a whole new window when only the glass has failed.' },
      { title: 'Quotes that arrive as a range', body: 'Two figures, a discount if you sign today, and no drawing of what you are actually buying.' },
    ],
    outcomes: [
      { title: 'Light through, noise out', body: 'Glazed steel-look doors and screens open the room up visually and still close.' },
      { title: 'A door that suits the house', body: 'Slim black frames work in a 1930s semi and a new build alike — the bar layout and glass are chosen to fit yours.' },
      { title: 'The glass fixed, the frame kept', body: 'A new sealed unit into the existing window, at a fraction of a replacement.' },
    ],

    comparison: {
      heading: 'Buying from us vs buying from a national door company',
      them: 'National door companies',
      rows: [
        { label: 'Who measures', us: 'Liam or Kai, at your house', them: 'A surveyor after the sale' },
        { label: 'Who fits', us: 'The same people who measured', them: 'Subcontracted fitting teams' },
        { label: 'Pricing', us: 'One fixed figure in writing', them: 'List price, then a discount, then a deadline' },
        { label: 'Bar layout and glass', us: 'Set out for your opening', them: 'Standard configurations' },
        { label: 'Repairs to what you already have', us: 'Yes — misted units, broken glass', them: 'Replacement only' },
      ],
    },

    homeFaqs: [
      {
        question: 'What are steel-look internal doors?',
        answer:
          'Slim-framed glazed doors and screens in the style of the original Crittall steel windows, usually with black frames and horizontal glazing bars. Most modern ones are made in aluminium, which is lighter and does not rust, and we fit them as single doors, French pairs, bifolds, sliders and fixed screens.',
      },
      {
        question: 'Can you fit them into an existing opening?',
        answer:
          'Usually, yes. We measure the opening as it is, and the frame is made to that size. Where a wall is being opened up we work to the builder\'s structural opening once it is formed.',
      },
      {
        question: 'Do you repair double glazing as well?',
        answer:
          'Yes. Misted or broken sealed units are replaced in the frame you already have — the frame, hinges and handles stay where they are.',
      },
      {
        question: 'Which areas do you cover?',
        answer:
          'We are based in Dagenham and work across Barking, Ilford, Romford, Rainham, Hornchurch and out to Brentwood. If you are a little further out, ring and ask.',
      },
    ],

    owner: {
      name: 'Liam Hales',
      role: 'Director',
      since: 2024,
    },

    about: {
      title: 'About Miller Glazing — family-run glaziers in Dagenham',
      description:
        'Miller Glazing Ltd is run by brothers Liam and Kai Hales from Dagenham. Steel-look internal doors, glazing and repairs across east London and Essex.',
      heading: 'Two brothers, one van, and the doors we would put in our own house',
      lede: 'Miller Glazing is Liam and Kai Hales. We measure, we fit, and we answer the phone — there is nobody between you and the people doing the work.',
      answerQuestion: 'Who is Miller Glazing?',
      answer:
        'Miller Glazing Ltd is a family-run glazing company in Dagenham, east London, directed by brothers Liam and Kai Hales and registered at Companies House in January 2024. The work is steel-look internal glass doors, bifolds and sliders, plus double glazing repairs and glass replacement across east London and south Essex. Checkatrade member.',
      story: [
        'Miller Glazing Ltd was set up in January 2024 and is run by two brothers, Liam and Kai Hales, from Dagenham. It is a small company by design: the person who measures your opening is the person who fits the door.',
        'Most of the work is steel-look internal glazing — single doors, French pairs, bifolds, sliders and fixed screens with slim black frames — along with the everyday glazing jobs around it: misted units, broken panes and glass replacement in existing frames.',
        'We are listed on Checkatrade under Windows, Doors and Conservatories, and the company is registered at Companies House under number 15428989. Both are public, so you can check us before you book us.',
      ],
      faqs: [
        {
          question: 'Are you a real company or a one-man band?',
          answer:
            'A registered limited company — Miller Glazing Ltd, number 15428989 — run by two brothers. Small enough that you deal with us directly, registered so that you know who you are dealing with.',
        },
        {
          question: 'Do you subcontract the fitting?',
          answer: 'No. Liam and Kai measure and fit. If we ever need an extra pair of hands on a large screen, we tell you who is coming.',
        },
      ],
    },
  },

  /**
   * /lp/ — advertising landing page. Only the blocks we can stand behind:
   * no statistic, no testimonials, no finance.
   */
  /* Home page uses the centered hero (same format as /lp/) so the site and the
     ad landing page look like one business. The H1 keeps the location and the
     service in it — the rotator is inside the headline, not instead of it. */
  home: {
    heroLayout: 'centered',
    hero: {
      headline: 'In east London we fit',
      rotate: ['steel-look doors', 'internal bifolds', 'glass sliders', 'glazed screens'],
      sub: 'Slim black frames, glass chosen for the room, measured and fitted by the two brothers who run the company. Dagenham, Romford, Barking, Ilford and across Essex.',
      cta: 'Get a free quote',
      note: 'One fixed price in writing before anything is ordered. No salesman, no pressure.',
      slides: [
        { image: 'job-1.webp', alt: 'Single steel-look internal door with four horizontal panes, fitted off a hallway' },
        { image: 'job-5.webp', alt: 'Four-leaf steel-look bifold doors between a living room and a kitchen' },
        { image: 'job-6.webp', alt: 'Top-hung sliding steel-look doors with bronze-tinted glass' },
        { image: 'job-3.webp', alt: 'Glazed steel-look display cabinet with a lit oak interior and matching doors along the hall' },
      ],
    },
  },

  lp: {
    enabled: true,
    title: 'Steel-Look Internal Doors, East London | Miller Glazing',
    description:
      'Steel-look internal glass doors, bifolds and sliders measured and fitted across east London and Essex by a family-run glazing company. Fixed price in writing.',
    /**
     * Centered dark hero, the artifact's format. `announce` is deliberately a
     * checkable fact rather than the artifact's "only installer offering a
     * 15-year guarantee" — he has no such guarantee, and a superlative there
     * needs substantiation the client does not have.
     */
    heroLayout: 'centered',
    announce: 'Steel-look internal doors, measured and fitted by the two brothers who own the company',
    hero: {
      image: 'job-6.webp',
      imageAlt: 'Top-hung sliding steel-look doors with bronze-tinted glass, fitted by Miller Glazing',
      /* One photo per rotating word, in the same order, so the picture always
         shows the job the headline is naming. All six are Liam and Kai's own
         work; no stock. */
      slides: [
        { image: 'job-1.webp', alt: 'Single steel-look internal door with four horizontal panes, fitted off a hallway' },
        { image: 'job-5.webp', alt: 'Four-leaf steel-look bifold doors between a living room and a kitchen' },
        { image: 'job-6.webp', alt: 'Top-hung sliding steel-look doors with bronze-tinted glass' },
        { image: 'job-3.webp', alt: 'Glazed steel-look display cabinet with a lit oak interior and matching doors along the hall' },
      ],
      cta: 'Book a free survey',
      note: 'One fixed price in writing before anything is ordered. No salesman, no pressure.',
      eyebrow: 'Dagenham · east London · Essex',
      headline: 'We fit',
      rotate: ['steel-look doors', 'internal bifolds', 'glass sliders', 'glazed screens'],
      sub: 'Slim black frames, glass chosen for the room, measured and fitted by the two brothers who run the company.',
      points: [
        'Single doors, French pairs, bifolds, sliders and fixed screens',
        'Measured to your opening, not picked from a standard size list',
        'Fitted by Liam and Kai — never a subcontracted team',
        'One fixed price in writing before anything is ordered',
      ],
    },
    jobTypesHeading: 'Tell us what you are opening up and we will price that job.',
    jobTypes: [
      { label: 'Single steel-look door', note: 'Hallway to kitchen, study, utility' },
      { label: 'French pair or bifold', note: 'Kitchen to living room, wide openings' },
      { label: 'Sliding doors or fixed screen', note: 'Where a swing would eat the room' },
      { label: 'Misted or broken glass', note: 'New sealed unit in your existing frame' },
    ],
    steps: [
      { title: 'Send a photo', body: 'A photo of the opening and a rough width and height is enough to talk sensibly about options and price.' },
      { title: 'Measure', body: 'We come out, measure properly and agree the bar layout, glass and handles.' },
      { title: 'Price', body: 'One fixed figure in writing. It does not change when you say yes.' },
      { title: 'Fit', body: 'The frame is made to your sizes; we fit it, clean up and take the packaging away.' },
    ],
    promises: [
      { title: 'Measured by the fitter', body: 'The person who measures is the person who fits. Sizes do not get lost between a salesman and a subcontractor.' },
      { title: 'Set out for your house', body: 'Bar heights lined through with the window or the worktop, not wherever the standard door puts them.' },
      { title: 'Repairs, not just replacements', body: 'If what you have can be fixed with a new sealed unit, we say so.' },
      { title: 'Checkable', body: 'Checkatrade profile and Companies House record are both public. Look us up before you book anyone.' },
    ],
    faqs: [
      {
        question: 'Are steel-look doors actually steel?',
        answer:
          'Ours are aluminium made to look like the original steel Crittall windows — slimmer, lighter, no rust, and easier to keep. Genuine steel is available for the right job at a different price.',
      },
      {
        question: 'How long from measuring to fitting?',
        answer:
          'Frames are made to your sizes, so there is a lead time between measuring and fitting. We give you the real one when we price the job rather than a vague fortnight.',
      },
      {
        question: 'Can the glass be tinted or obscured?',
        answer: 'Yes — clear, grey or bronze tint, reeded and satin glass are all options, and toughened as standard for doors.',
      },
    ],
    /**
     * Real work only: the six photos the client supplied. NO customer quotes,
     * ratings or dates — he has none published anywhere yet, and the `lp.jobs`
     * guard would (correctly) refuse an unsourced testimonial. Add quotes here
     * the moment there are real Google or Checkatrade reviews to point at.
     */
    jobsHeading: 'Recent work, and what it actually looks like.',
    jobs: [
      { title: 'Four-leaf bifold, living room to kitchen', image: 'job-5.webp', alt: 'Black steel-look bifold doors, four leaves, between a living room and a kitchen with herringbone flooring', meta: 'Steel-look bifold · folds flat to the reveal' },
      { title: 'Top-hung sliders, bronze-tinted glass', image: 'job-6.webp', alt: 'Top-hung sliding steel-look double doors with bronze-tinted glass', meta: 'Sliding pair · where a swing door would have eaten the room' },
      { title: 'Single four-pane door off a hallway', image: 'job-1.webp', alt: 'Single steel-look internal door with four horizontal panes in a hallway', meta: 'Single door · bar heights lined through with the frame beyond' },
      { title: 'French pair, hallway to living room', image: 'job-4.webp', alt: 'Pair of steel-look French doors open onto a living room', meta: 'French pair · clear toughened glass' },
      { title: 'Glazed drinks cabinet and matching doors', image: 'job-3.webp', alt: 'Glazed steel-look display cabinet with lit oak interior and matching internal doors along the hall', meta: 'Cabinet · same frame section as the doors down the hall' },
      { title: 'Full-height pivot door, commercial fit-out', image: 'job-2.webp', alt: 'Full-height steel-look pivot door with a single vertical bar in a commercial interior', meta: 'Pivot door · commercial interior' },
    ],

    quoteHeading: 'Send us the opening.',
    quoteBody:
      'A photo, a rough width and height, and which rooms it sits between. We will come back with options and a straight answer on price.',
    formHeading: 'Tell us about the job',
  },

  /**
   * Copy overrides. Miller does install, so the installer defaults are mostly
   * right; the wording is narrowed to doors and glazing rather than the
   * "windows, doors and conservatories" default.
   */
  copy: {
    servicesHeading: 'What we fit and repair',
    servicesLede: 'Steel-look internal doors first, then the glazing jobs around them — every one measured by the person who fits it.',
    servicesDescription:
      'Everything {business} fits and repairs across east London and Essex — steel-look internal doors, bifolds and sliders, double glazing repairs and glass replacement.',
    areasDescription:
      'Where {business} works — Dagenham, Barking, Ilford, Romford, Rainham and out to Brentwood, from a base in {locality}. One number, answered by the people who do the work.',
    areaServicesHeading: 'What we fit and repair in {area}',
    areaCtaHeading: 'Doors or glazing to sort in {area}?',
    serviceAreasHeading: '{service} across east London and Essex',
    nearbyHeading: 'Nearby areas we cover',
  },

  contact: {
    // From the Checkatrade profile phone reveal — CONFIRM with the owner.
    phone: '07411 290295',
    phoneHref: '+447411290295',
    email: 'Millerglazing@gmail.com',
    address: {
      // Street and postcode intentionally omitted: the registered office is a
      // residential address. Coverage-area map instead of a pin.
      locality: 'Dagenham',
      region: 'Greater London',
      country: 'GB',
    },
    geo: { lat: 51.5397, lng: 0.1422 },
    /**
     * 15km from Dagenham reaches Ilford, Romford, Hornchurch, Rainham and
     * Brentwood's western edge without claiming the whole of Essex.
     */
    serviceRadiusKm: 15,
    googlePlaceId: '',
    mapEmbedQuery: 'Dagenham, London',
    mapZoom: 11,
  },

  // From the old preview site — CONFIRM with the owner.
  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '20:00' },
    { days: ['Sunday'], opens: '08:00', closes: '17:00' },
  ],

  social: {},

  url: 'https://glazeos-miller-glazing.netlify.app',

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

  /** NO REVIEWS: no GBP, Checkatrade shows 0. Nothing goes here until there are real ones. */
  reviews: {
    aggregate: null,
    featured: [],
  },

  /** Real job photos supplied by the client 2026-09-13 (six steel-look installs). */
  media: {
    logo: 'logo.png',
    hero: 'job-5.webp',
    heroAlt: 'Four-leaf steel-look bifold doors with grey-tinted glass between a living room and kitchen',
    gallery: [
      { src: 'job-5.webp', alt: 'Black steel-look bifold doors, four leaves, opening a living room onto a kitchen with herringbone flooring', caption: 'Four-leaf bifold between living room and kitchen — folds flat to the reveal.' },
      { src: 'job-6.webp', alt: 'Top-hung sliding steel-look double doors with bronze-tinted glass', caption: 'Top-hung sliders with bronze-tinted glass where a swing door would have eaten the room.' },
      { src: 'job-1.webp', alt: 'Single steel-look internal door with four horizontal panes in a hallway', caption: 'Single four-pane door from a hallway — bar heights lined through with the frame beyond.' },
      { src: 'job-4.webp', alt: 'Pair of steel-look French doors open onto a living room', caption: 'French pair, open, hallway to living room.' },
      { src: 'job-3.webp', alt: 'Glazed steel-look display cabinet with lit oak interior, and matching internal doors along the hall', caption: 'Glazed drinks cabinet in the same frame section as the doors down the hall.' },
      { src: 'job-2.webp', alt: 'Full-height steel-look pivot door with a single vertical bar in a commercial interior', caption: 'Full-height pivot door, commercial fit-out.' },
    ],
  },

  /**
   * Palette from the client's own logo: a black monogram on white. The logo
   * has no secondary colour, so the accent is the same near-black with white
   * text — a deliberate choice that matches the black frames in every photo.
   */
  theme: {
    brand: '#111111',
    brandDark: '#000000',
    accent: '#111111',
    accentInk: '#FFFFFF',
    ink: '#111111',
    muted: '#5B6169',
    surface: '#F4F4F2',
    fontHeading: "'Bricolage Grotesque', system-ui, sans-serif",
    fontBody: "system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
};
