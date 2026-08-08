/**
 * Approved marketing copy.
 *
 * Kept out of JSX so that wording can be reviewed and changed in one place, and
 * so that no section quietly invents a claim. Lines below are taken from
 * docs/design.md §26 / §10 or from the brochure's own voice.
 */

export const cta = {
  primary: 'Book a Private Site Visit',
  primaryShort: 'Book Site Visit',
  mobile: 'Book a Site Visit',
  secondary: 'Explore Residences',
  tertiary: 'Request Project Details',
  /** The drawer's own submit label lives with the rest of the form copy. */
  formSubmit: 'Send Enquiry',
} as const;

/**
 * The two secondary contact paths. Deliberately not in `cta`: those are the
 * conversion ladder, and Call and WhatsApp sit beside it, not on it.
 *
 * The labels are the accessible names for icon-only controls, so they name the
 * project rather than the verb — "Call" alone tells a screen-reader user
 * nothing about who they are calling.
 */
export const contactActions = {
  call: {
    label: 'Call',
    ariaLabel: 'Call ATS Kingston Heath',
  },
  whatsapp: {
    label: 'WhatsApp',
    ariaLabel: 'Chat with ATS Kingston Heath on WhatsApp',
    /**
     * Prefilled into the WhatsApp composer. States only what the visitor is
     * enquiring about — no offer, no price, nothing the page cannot support.
     */
    prefill: 'Hello, I would like to know more about ATS Kingston Heath, Sector 150, Noida.',
  },
  /** Introduces the pair in the footer. */
  footerHeading: 'Speak to the sales team',
} as const;

export const nav = [
  { id: 'overview', label: 'Overview' },
  { id: 'residences', label: 'Residences' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'location', label: 'Location' },
  { id: 'developer', label: 'ATS' },
] as const;

/**
 * The first viewport.
 *
 * The headline is the invitation rather than the brand line, because the form
 * now sits in the first screen and the two have to read as one sentence: an
 * editorial headline above an enquiry field asks the visitor to hold two ideas
 * at once. The brand line it replaced is not lost — it opens the Promise
 * section immediately below, which is where it always did its work.
 *
 * `support` is written to the content rules in this file: the project is
 * ADJACENT to a golf course, so the line names the residences, the greens and
 * the surroundings and lets the Lifestyle section state the relationship
 * precisely. No price, no travel time, no possession date, and no promise that
 * a visit is confirmed.
 */
export const hero = {
  eyebrow: 'Sector 150 · Noida',
  headline: 'Book your private site visit.',
  support:
    'Experience the residences, the greens and the surroundings of ATS Kingston Heath, Sector 150, Noida.',
  /** The brand line, kept for the Promise opener. */
  brandline: 'Your family deserves more space.',
  subhead: 'More green. More life.',
} as const;

/** docs/design.md §26 — the approved editorial headline set. */
export const headlines = {
  space: 'Space you can feel.',
  family: 'Room to grow together.',
  view: 'Some views change how home feels.',
  location: 'Well connected. Quietly placed.',
  closing: "Don't just imagine it. Experience it.",
  /**
   * Phase 3 additions, written to the same rule as the five above: an idea,
   * not a claim. "Thirty acres" is the one number in this set and it is the
   * brochure's own (see `greens`).
   */
  amenities: 'Thirty acres, put to use.',
  developer: 'A record you can look up.',
} as const;

/**
 * Section prose.
 *
 * Marketing voice, but every concrete claim inside it traces to the brochure
 * (areas, room dimensions, the 30 acres, the golf adjacency, the sports-sector
 * green cover). Nothing here asserts possession dates, travel times, unit
 * counts or tower spacing — none of which any source states.
 */
export const sections = {
  promise: {
    eyebrow: 'The proposition',
    headline: headlines.space,
    lead: 'Most homes are sold on a number. This one is better understood by standing in it.',
    body: 'A four-bedroom residence here carries 3,300 sq ft of super area, of which 2,251 sq ft is carpet. But the part that changes how a home feels is harder to put in a brochure: the width of the living room, the light along a balcony that runs the length of the plan, and thirty acres of green on the other side of the glass.',
    /**
     * The spaciousness story, said as consequences rather than as superlatives.
     * Every line points at something in the plans: the dimensions schedule,
     * the family lounge and study that both plans carry, the balconies drawn
     * on three sides, and the landscape on the site plan. Nothing here ranks
     * the project against anything else — no "largest", no "best in Noida".
     */
    aspects: [
      {
        title: 'Rooms with room in them',
        body: 'A living room measured in the high teens of feet, not the low tens. Bedrooms wide enough that the wardrobe wall is not also the walking route.',
      },
      {
        title: 'Somewhere to be together',
        body: 'Type A puts a family lounge at the centre of the plan, held apart from the living room — so the house can hold a quiet evening and a loud one at once.',
      },
      {
        title: 'Somewhere to be alone',
        body: 'Type B carries a separate study off the living volume. In Type A the master bedroom is drawn with its own dressing room and toilet, set at the far end of the plan from the other bedrooms.',
      },
      {
        title: 'Space that is not indoors',
        body: 'Balconies along more than one face of both plans — and a campus where the ground between the blocks is landscape rather than parking.',
      },
    ],
  },

  residences: {
    eyebrow: 'The residences',
    headline: headlines.family,
    lead: 'Two plans. Both designed around the rooms a family actually lives in — not the ones that photograph well.',
    typeB: {
      pitch: 'A single living and dining volume nearly twenty-two feet wide, a separate study for the work that follows you home, and three bedrooms that each open to a balcony.',
    },
    typeA: {
      pitch: 'Four bedrooms, and a family lounge that sits apart from the living room — so the house can hold a quiet evening and a loud one at the same time.',
    },
    /** Floor-plan dialog. */
    plans: {
      eyebrow: 'The drawings',
      trigger: 'Explore the plan',
      /** Announced to screen readers on the trigger, per residence. */
      triggerLabel: (headline: string) => `Explore the ${headline} floor plan`,
      note: 'The architect’s drawing, at full size. Every room is annotated with its dimensions.',
      close: 'Close',
    },
  },

  /**
   * Amenities.
   *
   * Composed as movements rather than as a grid: each has one image or one
   * statement and a short list drawn straight from the brochure's landscape
   * legend (p.19) and clubhouse specification (p.25). No item appears here
   * that is not on one of those two pages, and no adjective is applied to an
   * item that the source does not apply itself — the gym is "well-equipped"
   * because the brochure says so, and nothing is "world-class" because
   * nothing in the source says that.
   */
  amenities: {
    eyebrow: 'The campus',
    headline: headlines.amenities,
    lead: 'The ground between the buildings is the part of a development a family actually lives in. Here it is drawn as carefully as the apartments.',
    pool: {
      title: 'The pool, on an ordinary Tuesday',
      body: 'A swimming pool and timber deck sit at the centre of the campus, with a separate pool for children and a plunge pool alongside. Close enough to the blocks that an evening swim does not have to be an outing.',
    },
    club: {
      title: 'The clubhouse',
      body: 'The social side of the development, in one building: somewhere to gather, to celebrate, and to spend an afternoon without leaving the gates.',
    },
    fitness: {
      title: 'Fitness, indoors and out',
      body: 'A gym inside the clubhouse, an outdoor gym in the landscape, and a jogging track laid through the greens.',
    },
    family: {
      title: 'For the children',
      body: 'Play areas and a play lawn, a sand pit and a skating rink, an amphitheatre for the evenings the community turns out — and courts for the years after that.',
    },
    green: {
      title: 'Planted with intent',
      body: 'A Miyawaki forest, a fruit orchard, herb and medicinal gardens, a yoga and meditation lawn. The greens here are programmed, not merely mown.',
    },
    /** The visitor should know a legend exists rather than be handed all 51 items. */
    legendNote: (count: number) =>
      `Drawn from the ${count} numbered features on the brochure’s landscape layout plan.`,
  },

  /**
   * Location.
   *
   * NOTE FOR ANYONE EDITING: the brochure prints no distance and no travel
   * time, anywhere. Connectivity is therefore described by naming what is on
   * the map and in which direction — never by minutes. If marketing supplies
   * verified drive times later, they belong in src/content/location.ts behind
   * `publish()`, not in this file.
   */
  location: {
    eyebrow: 'The address',
    headline: headlines.location,
    lead: 'Sector 150 is Noida’s dedicated sports sector, and the road in from Jewar comes through it.',
    body: 'The brochure’s own map places Kingston Heath along the Noida–Greater Noida Expressway, with the Sector 148 metro station, a nine-hole golf course and the road towards Jewar International Airport close by, and the Faridabad–Noida–Ghaziabad Expressway carrying the rest of NCR from the north. Schools, hospitals and malls are marked along the same corridor.',
    mapCaption: 'Location map, as printed in the brochure. Not to scale.',
    /**
     * Transparency, published deliberately. A visitor who wants minutes will
     * ask on the site visit — which is the conversion we want anyway.
     */
    noTravelTimes:
      'We don’t publish drive times. The brochure states none, and an estimate typed into a landing page is not information. Ask us on the visit and you will get the real answer.',
  },

  /**
   * Developer.
   *
   * Restrained on purpose. The proof is the list itself: every project named
   * is named in the brochure, and every ongoing project carries its own RERA
   * number, which anyone can look up. No awards, no "years of experience", no
   * ranking — none of which the source supports.
   */
  developer: {
    eyebrow: 'The developer',
    headline: headlines.developer,
    lead: 'ATS has been building in this corridor long enough that you can go and look at the results.',
    body: 'Kingston Heath is developed by ATS Infrastructure Ltd. The projects below are the ones the brochure names as delivered. The ones still under construction each carry their own RERA registration, including this one.',
    deliveredLabel: 'Delivered',
    ongoingLabel: 'Under construction',
    regionsLabel: 'Regions',
    listLabel: 'Delivered projects',
    reraNote: 'Every ATS project under construction is separately registered with its state RERA authority.',
  },


  lifestyle: {
    eyebrow: 'The setting',
    headline: headlines.view,
    lead: 'Kingston Heath sits alongside a golf course, inside a sector that was planned around sport and open ground.',
    body: 'Sector 150 is Noida’s dedicated sports sector, and the approach from Jewar Airport comes through it. Within the campus: a swimming pool and deck, a Miyawaki forest, an orchard and herb gardens, a yoga lawn, courts for tennis and badminton. Beyond it, a nine-hole golf course among the sector’s recreation.',
    /** Guardrail for anyone editing this copy later. */
    _rule:
      'The project is ADJACENT to a golf course and does not contain one. Never write "our golf course". The 80% green cover figure belongs to Sector 150, not to Kingston Heath.',
  },

  closing: {
    eyebrow: 'The next step',
    headline: headlines.closing,
    body: 'Plans and photographs can only do so much. Walk the site, stand in the living room, and see the green for yourself.',
    /**
     * The one line that carries the whole page. No urgency, no scarcity, no
     * countdown: nothing in any source supports a claim about availability,
     * and inventing one is the fastest way to lose a family's trust.
     */
    invitation: 'A private visit, at a time that suits your family.',
  },

  /** The regulatory strip. Wording belongs to the sources, not to marketing. */
  regulatory: {
    eyebrow: 'Project information',
    reraLabel: 'RERA registration',
    reraSiteLabel: 'Registered at',
    entityLabel: 'Developer entity',
    groupLabel: 'Developer',
    siteLabel: 'Site address',
    officeLabel: 'Corporate office',
    startedLabel: 'Project start date',
    chargesLabel: 'Prices exclude',
    /** Shown beside the price — and therefore not shown at all today. */
    priceBasisNote: 'Indicative campaign rate. Confirm the current rate and its basis with the authorised sales team.',
  },
} as const;

/**
 * The enquiry form — in the first viewport, and in the drawer.
 *
 * NOTE ON SCOPE. docs/prd.md §11 specifies five fields — name, mobile,
 * configuration, preferred date, preferred time. The form asks for TWO: a name
 * and a contact number. Every other question has been removed outright rather
 * than hidden, made optional or collapsed behind a disclosure.
 *
 * That is a deliberate campaign decision, not an oversight. This page buys
 * traffic from people who have never heard of the project; the form is the
 * first thing they see, and its only job is to convert curiosity into a lead
 * the sales team can actually ring. Who you are and how to reach you is that
 * minimum. A configuration question, a preferred Saturday, or a message box
 * asked of a stranger in the first three seconds is a reason to close the tab.
 * `configurationOptions` in residences.ts is kept ready for the day the brief
 * calls for those questions again.
 *
 * The heading is the invitation itself — "Book your private site visit" — with
 * a short line beneath it that says how little is being asked for, so nobody
 * scrolls looking for the rest of the form.
 */
export const leadForm = {
  /**
   * The form's own heading, used by the first-viewport panel and by the drawer.
   * The first viewport's h1 carries the long form of the same invitation
   * ("Book your private site visit."), so this is the short one — the two sit
   * inches apart there and must not read as the same line twice.
   */
  formTitle: 'Book your site visit',
  intro: 'Leave your name and number, and our team will get in touch to arrange your visit.',
  privacy: 'Your details are used only to respond to your enquiry.',

  fields: {
    name: { label: 'Name', placeholder: 'Your name' },
    phone: { label: 'Contact number', placeholder: 'Your contact number' },
  },

  /**
   * Validation messages.
   *
   * Each says what to do, not that something is "invalid" — and each stands on
   * its own words rather than on a red rule, so the meaning survives for
   * anyone who cannot see the colour.
   */
  errors: {
    name: 'Please enter your name.',
    phoneRequired: 'Please enter a contact number.',
    /** Names the expected shape, and says the international form is fine too. */
    phoneInvalid:
      'Please enter a valid 10-digit mobile number, or include your country code (for example +971).',
  },

  submit: 'Send Enquiry',
  submitting: 'Sending Enquiry…',

  successTitle: 'Enquiry received',
  successBody:
    'Thank you for your interest in ATS Kingston Heath. Our team will get in touch with you shortly.',
  successClose: 'Close',

  /**
   * Failure copy. One message for every failure mode, on purpose: an
   * unconfigured key, a refused request and a dropped connection are all
   * "not your fault, try again" to the person at the keyboard, and naming the
   * provider to a stranger explains nothing and reveals plumbing.
   */
  errorTitle: 'Something went wrong',
  errorBody: 'We couldn’t submit your enquiry right now. Please try again.',

  /** Shapes the email that arrives. Web3Forms `subject` / `from_name`. */
  emailSubject: 'ATS Kingston Heath — New Enquiry',
  emailFromName: 'ATS Kingston Heath — Landing Page',
} as const;
