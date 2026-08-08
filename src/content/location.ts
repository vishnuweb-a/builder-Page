import { brochure } from './_source.ts';

/**
 * Location — brochure p.14 ("because location matters") and the location map
 * on p.15.
 *
 * NOTE: the brochure states no travel times or distances anywhere, and the map
 * is marked "map not to scale". `travelTimes` is therefore deliberately absent
 * from this model rather than left as an empty field to be filled in with a
 * plausible guess. docs/prd.md §25 lists airport and expressway travel time as
 * requiring verification before production.
 */

export interface LandmarkCategory {
  readonly id: string;
  readonly title: string;
  readonly items: readonly string[];
}

export const positioning = brochure(
  'Sector 150 is the gateway to Noida when coming from Jewar Airport. A dedicated sports sector with 80% green cover, well connected with Delhi and Greater Noida.',
  'Brochure p.14, near-verbatim. The 80% green cover figure describes SECTOR 150, not the project — it must never be attributed to Kingston Heath.',
);

export const landmarks: readonly LandmarkCategory[] = [
  {
    id: 'connectivity',
    title: 'Connectivity',
    items: ['Jewar Airport', 'Sector 148 Metro Station', 'Noida Expressway', 'Faridabad–Noida–Ghaziabad Expressway'],
  },
  {
    id: 'education',
    title: 'Education',
    items: ['GD Goenka Public School', 'Genesis Global School', 'Shiv Nadar School', 'Gyanshree School', 'KR Mangalam World School'],
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    items: ['Kailash Hospital', 'Yatharth Super Speciality Hospital', 'Max Hospital'],
  },
  {
    id: 'recreation',
    title: 'Recreation',
    items: ['9-Hole Golf Course', 'Cricket Stadium', 'Night Safari', 'Bird Sanctuary', 'World of Wonder'],
  },
  {
    id: 'retail',
    title: 'Retail',
    items: ['Mall of India', 'Great India Place', 'Grand Venice Mall', 'Logix Mall', 'Connaught Place Mall', 'ATS Kingshood Drive (upcoming)'],
  },
];

/**
 * The golf relationship, stated precisely.
 * The brochure says the project is "nestled alongside a Golf Course" and lists
 * a 9-hole course under nearby recreation. The project does not contain a golf
 * course, and copy must never imply that it does.
 */
export const golf = brochure(
  {
    relationship: 'adjacent',
    phrasing: 'Nestled alongside a golf course',
    nearbyFacility: '9-Hole Golf Course',
  },
  'Brochure p.4 and p.14. Use "alongside" / "overlooking" — never "our golf course".',
);

/** Brochure p.4. */
export const greens = brochure('30 acres of greens', 'Brochure p.4: "spread across 30 acres of greens".');
