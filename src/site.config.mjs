// ─────────────────────────────────────────────────────────────
// THE ONLY FILE YOU EDIT PER CLIENT.
// Everything downstream — schema, meta, NAP, colours — reads from here.
// NAP must match Google Business Profile character for character.
// ─────────────────────────────────────────────────────────────

export const site = {
  url: 'https://example.co.uk',
  brand: 'Example Trades',
  tagline: 'Bathroom fitting across Greater Manchester',

  // Used in LocalBusiness schema. Pick the most specific schema.org
  // subtype that fits: Plumber, Electrician, Dentist, RoofingContractor…
  schemaType: 'Plumber',

  nap: {
    name: 'Example Trades Ltd',
    street: '12 Example Street',
    locality: 'Manchester',
    region: 'Greater Manchester',
    postcode: 'M1 1AA',
    country: 'GB',
    phone: '+441611234567',
    phoneDisplay: '0161 123 4567',
    email: 'hello@example.co.uk',
  },

  geo: { lat: 53.4808, lng: -2.2426 },

  hours: [
    { days: ['Monday','Tuesday','Wednesday','Thursday','Friday'], open: '08:00', close: '17:30' },
    { days: ['Saturday'], open: '09:00', close: '13:00' },
  ],

  social: [],

  // Set once real reviews exist. Never invent these — fabricated
  // rating markup is a manual-action risk.
  rating: null, // { value: 4.9, count: 87 }
};
