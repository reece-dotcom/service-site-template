/**
 * Lighthouse Review — Riverside Windows & Doors. Numbers from the call on
 * 13 Sep 2026 and the checks in lighthouse.json. Nothing here is estimated.
 */
export default {
  date: '2026-09-13',
  preparedFor: 'Dave',
  headline:
    'Your work is better than your Google presence. A homeowner in Chelmsford comparing installers sees 14 reviews next to 212 — and picks the 212.',

  areas: [
    {
      name: 'Website',
      rag: 'green',
      finding: 'Fast, secure and easy to ring from a phone. One claim on it needs changing.',
      points: [
        'Google mobile speed score 100/100, loads in 1.4 seconds',
        'Secure (https), tap-to-call number and a working enquiry form',
        'Says "over 20 years experience" — you started in 2011, so that is a claim a customer can catch',
      ],
    },
    {
      name: 'Google Business Profile',
      rag: 'amber',
      finding: 'The profile exists, but it is not doing the work it could for Chelmsford and Braintree.',
      points: [
        'Listed and reviewed, so the basics are there',
        'Chelmsford and Braintree are where you want more work — the profile needs to say so',
        'Fresh job photos every week are the cheapest ranking lever you have and are not being used',
      ],
    },
    {
      name: 'Reviews',
      rag: 'red',
      finding: '14 Google reviews from around 160 jobs a year. Your rivals have 96 to 1,400.',
      points: [
        '4.9 stars is excellent — the problem is volume, not quality',
        'Roughly one review for every eleven jobs; asking is not consistent',
        'Checkatrade 38 at 9.7 is strong but invisible to anyone searching on Google',
      ],
    },
    {
      name: 'Social',
      rag: 'amber',
      finding: 'A Facebook page that last posted at Christmas, and no Instagram.',
      points: [
        'The page exists and is linked, which is more than many installers have',
        'Nine months without a post reads as "might not be trading"',
        'Every job you photograph is a post you are not making',
      ],
    },
  ],

  reviews: {
    you: { name: 'Riverside Windows & Doors', count: 14, rating: 4.9 },
    rivals: [
      { name: 'Chelmsford Windows Ltd', count: 212, rating: 4.8 },
      { name: 'Essex Trade Frames', count: 96, rating: 4.7 },
      { name: 'Anglian Home Improvements', count: 1400, rating: 4.3 },
    ],
    note: 'Your rating beats all three. Nobody sees that, because the count is the first thing they compare.',
  },

  money: { avgJob: 5200, enquiriesMonth: 18, jobsMonth: 7, extraEnquiries: 5 },

  fixes: [
    {
      title: 'Turn the jobs you already do into Google reviews',
      why: 'You do 160 jobs a year and get 14 reviews. Sixty a year is realistic without changing anything about the work.',
      what: 'A text with your Google review link goes out automatically the day after every job is finished, with one polite reminder a week later. We set it up, you keep fitting windows.',
    },
    {
      title: 'Make the Google profile say Chelmsford and Braintree',
      why: 'The map results are what a homeowner sees first, and they are decided by the profile, not the website.',
      what: 'Set the service area, categories and services properly, add the FENSA and GGF details, and post a job photo every week from the van.',
    },
    {
      title: 'Post the work you already photograph, and fix the "20 years" line',
      why: 'A Facebook page that stopped at Christmas and a site claim that does not add up both cost trust with the customers who do check.',
      what: 'Same weekly job photo goes to Facebook as to Google. Change the site to "since 2011", which is a better line anyway because it is true.',
    },
  ],

  sources: [
    'Google Lighthouse (mobile), run 13 Sep 2026',
    'Google review counts and ratings as read on the call, 13 Sep 2026',
    'Job value, enquiry and job figures given by Dave on the call',
  ],

  /** Kept for the go-live before/after report. */
  before: { mobileScore: 100, seoScore: 100, reviews: 14, rating: 4.9 },
};
