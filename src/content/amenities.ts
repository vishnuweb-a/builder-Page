import { brochure } from './_source.ts';

/**
 * Amenities — grouped from the brochure's 51-item landscape legend (p.19),
 * the wellness spread (p.8), the green-programme spread (p.11) and the
 * clubhouse specification (p.25).
 *
 * Grouped rather than dumped: docs/design.md §3 explicitly rejects "a grid of
 * generic amenity icons". Later phases pick a curated subset per section.
 */

export interface AmenityGroup {
  readonly id: string;
  readonly title: string;
  /** One line explaining why this group matters to a family. */
  readonly promise: string;
  readonly items: readonly string[];
}

export const amenityGroups: readonly AmenityGroup[] = [
  {
    id: 'water',
    title: 'Water & Pool',
    promise: 'A resort pool deck at the centre of the campus.',
    items: ['Swimming pool', "Kids' pool", 'Plunge pool', 'Pool deck', 'Pool view deck', 'Hydro-therapy seating', 'Tree bosque with pool view'],
  },
  {
    id: 'wellness',
    title: 'Wellness',
    promise: 'Spaces designed around rest, not just recreation.',
    items: ['Yoga / meditation lawn', 'Acupressure garden', 'Reflexology garden', 'Aromatic garden', 'Bamboo garden', 'Outdoor gym', 'Jogging track'],
  },
  {
    id: 'sport',
    title: 'Sport',
    promise: 'Courts and pitches inside the gates.',
    items: ['Tennis court', 'Basketball court', 'Badminton court', 'Cricket practice pitch', 'Skating rink'],
  },
  {
    id: 'family',
    title: 'Family & Children',
    promise: 'Somewhere for children to be children.',
    items: ['Kids play area', 'Kids play lawn', 'Sand pit', 'Youth plaza', 'Celebration lawn', 'Amphitheater', 'Seating plaza'],
  },
  {
    id: 'green',
    title: 'Green & Growing',
    promise: 'Thirty acres of greens, planted with intent.',
    items: ['Miyawaki forest', 'Fruit orchard', 'Herb garden', 'Medicinal garden', 'Hydroponic garden', 'Colour garden', 'Texture garden', 'Palm court', 'Palm avenue', 'Private greens', 'Vantage garden'],
  },
  {
    id: 'gather',
    title: 'Gathering',
    promise: 'Room to host, outdoors.',
    items: ['Outdoor kitchen', 'Community dining area', 'Barbeque lawn', 'Vantage garden pavilion', 'Paved plaza'],
  },
];

export const findAmenityGroup = (id: string): AmenityGroup => {
  const group = amenityGroups.find((g) => g.id === id);
  if (!group) throw new Error(`Unknown amenity group: ${id}`);
  return group;
};

/**
 * The landscape legend is numbered 1–51 on brochure p.19. The count is stated
 * so the page can say where its amenity list came from instead of implying the
 * six groups above are everything.
 */
export const legendItemCount = brochure(51, 'Landscape layout plan legend, p.19, items 1–51.');

/**
 * Fitness, assembled from the two pages that mention it — and from nothing
 * else. The brochure calls the gym "well-equipped"; it does not call anything
 * "state-of-the-art", so neither does the page.
 */
export const fitness = brochure(
  ['Well-equipped gym', 'Outdoor gym', 'Jogging track'],
  'Gym: clubhouse specification, p.25. Outdoor gym (#50) and jogging track (#18): landscape legend, p.19.',
);

/** Brochure p.25, "Clubhouse & Sports Facilities". */
export const clubhouse = brochure({
  items: [
    'Swimming pool',
    'His / her change rooms',
    'Well-equipped gym',
    'Indoor & outdoor games areas',
    'Multi-purpose hall',
    'Jogging track',
  ],
});

/** Brochure p.11 — the biophilic programme, in the brochure's own words. */
export const greenProgramme = brochure({
  organicFarming: ['banana', 'pomegranate', 'guava', 'sapota', 'drumsticks', 'okra', 'brinjal', 'tomato'],
  herbAndMedicinal: ['coriander', 'lemongrass', 'henna', 'thyme', 'peppermint', 'tulsi', 'vajradanti', 'aloe vera', 'turmeric', 'rosemary', 'lavender', 'chamomile'],
  airPurifying: ['spider plant', 'peace lily', 'boston fern', 'snake plant', 'weeping fig'],
});

/** Brochure pp.24–25. Grouped for a restrained specifications block. */
export const specifications = brochure([
  { title: 'Flooring', detail: 'Imported / engineered marble in living, dining & family lounge. Wooden flooring in all bedrooms. Premium vitrified tiles in kitchen, vitrified in utility. Antiskid ceramic tile in wooden finish on balconies.' },
  { title: 'Washrooms', detail: 'Premium glazed tiles, engineered-marble basin counters, premium sanitary fixtures and chrome-plated fittings. Glass cubicles segregate wet and dry areas.' },
  { title: 'Kitchen', detail: 'Full-body surface counters, premium-brand chimney & hob, modular cabinets, electrical points for washing machine and refrigerator.' },
  { title: 'Doors & Windows', detail: 'Engineered main door, premium laminated flush internal doors, stainless-steel / brass hardware, aluminium / UPVC frames, wire-mesh door for bug protection.' },
  { title: 'Security & FTTH', detail: 'Video door phone and biometric door lock on the entry door. Optical-fibre CCTV surveillance, perimeter and entrance-lobby security. Fire prevention, suppression, detection & alarm as per fire norms.' },
  { title: 'HVAC', detail: 'Split ACs in living, dining and all bedrooms.' },
  { title: 'Electrical', detail: 'Concealed conduits, telephone & TV outlets in drawing, dining and all bedrooms, moulded modular switches and protective MCBs.' },
  { title: 'Plumbing & Water', detail: 'GI / CPVC / composite internal plumbing, CI / UPVC external, automated irrigation. Underground water tank with pump house and dual plumbing for all toilets.' },
  { title: 'Structure', detail: 'Earthquake-resistant RCC framed structure as per the applicable seismic zone.' },
  { title: 'Finishes', detail: 'Premium anti-bacterial paint internally, exterior-grade waterproof texture paint externally. False ceiling as per the architect’s design, including lights.' },
  { title: 'Power Backup', detail: 'Generator backup for emergency facilities — lifts and common areas.' },
]);
