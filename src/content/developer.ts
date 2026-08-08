import { brochure } from './_source.ts';

/**
 * ATS track record — brochure pp.26–27.
 *
 * This is the trust block's raw material and it is entirely verifiable: every
 * project below is named in the brochure, and every ongoing project carries its
 * own RERA registration. docs/design.md §28 forbids decorative trust badges, so
 * the page earns trust with this list instead.
 */

export interface DeliveredProject {
  readonly name: string;
  readonly location: string;
}

export interface OngoingProject extends DeliveredProject {
  readonly rera: string;
}

export const delivered = brochure<readonly DeliveredProject[]>([
  { name: 'ATS Greens I', location: 'Sector-50, Noida' },
  { name: 'ATS Greens II', location: 'Sector-50, Noida' },
  { name: 'ATS Village', location: 'Sector-93A, Noida Expressway' },
  { name: 'One Hamlet', location: 'Sector-104, Noida' },
  { name: 'Paradiso', location: 'Sector Chi-04, Greater Noida' },
  { name: 'ATS Advantage', location: 'Phase I & II, Indirapuram' },
  { name: 'ATS Haciendas', location: 'Indirapuram, Ghaziabad' },
  { name: 'Golf Meadows Prelude', location: 'Dera Bassi, Punjab' },
  { name: 'Kocoon', location: 'Sector-109, Gurugram' },
  { name: 'Nobility', location: 'Sector-4, Greater Noida (W)' },
  { name: 'Casa España — Phase I', location: 'Sector-121, Mohali' },
  { name: 'Pristine — Phase I & II', location: 'Sector-150, Noida Expressway' },
  { name: 'Heavenly Foothills', location: 'Sahastradhara Road, Dehradun' },
  { name: 'ATS Bouquet', location: 'Sector-132, Noida Expressway' },
  { name: 'Dolce — Phase I', location: 'Zeta 1, Greater Noida' },
  { name: 'Golf Meadows Lifestyle — Phase I', location: 'Dera Bassi, Punjab' },
  { name: 'Triumph', location: 'Sector-104, Dwarka Expressway, Gurugram' },
  { name: 'Tourmaline', location: 'Sector-109, Dwarka Expressway, Gurugram' },
  { name: 'Marigold', location: 'Sector-89A, Dwarka Expressway, Gurugram' },
  { name: 'Allure', location: 'Sector-22D, Yamuna Expressway' },
  { name: 'ATS Le Grandiose', location: 'Sector-150, Noida Expressway' },
  { name: 'Happy Trails', location: 'Sector-10, Greater Noida (W)' },
  { name: 'Pragya', location: 'GIFT City — SEZ, Gujarat' },
]);

export const ongoing = brochure<readonly OngoingProject[]>([
  { name: 'Kingston Heath', location: 'Sector-150, Noida', rera: 'UPRERAPRJ180413' },
  { name: 'Picturesque Reprieves — Phase I & II', location: 'Sector-152, Noida Expressway', rera: 'UPRERAPRJ396176' },
  { name: 'Knightsbridge', location: 'Sector-124, Noida', rera: 'UPRERAPRJ3574' },
  { name: 'Pristine Golf Villas', location: 'Sector-150, Noida Expressway', rera: 'UPRERAPRJ3796' },
  { name: 'Dolce — Phase II', location: 'Zeta 1, Greater Noida', rera: 'UPRERAPRJ3774' },
  { name: 'Rhapsody', location: 'Sector-1, Greater Noida (W)', rera: 'UPRERAPRJ4115' },
  { name: 'Casa España — Phase II', location: 'Sector-121, Mohali', rera: 'PBRERA-SAS80-PR0086' },
  { name: 'Destinaire', location: 'Sector-1, Greater Noida (W)', rera: 'UPRERAPRJ417134' },
  { name: 'Pious Hideaways', location: 'Sector-150, Noida', rera: 'UPRERAPRJ442430' },
  { name: 'Kinghood Drive', location: 'Sector-152, Noida Expressway', rera: 'UPRERAPRJ2575' },
  { name: 'Kabana High', location: 'Sector-4, Greater Noida (W)', rera: 'UPRERAPRJ697894' },
  { name: 'Khyber Range', location: 'NH-24, Ghaziabad', rera: 'UPRERAPRJ904685' },
  { name: 'Golf Meadows Lifestyle', location: 'Dera Bassi, Punjab', rera: 'PBRERA-SAS79-PR0007' },
  { name: 'Golf Meadows V', location: 'Dera Bassi, Punjab', rera: 'PBRERA-SAS79-PR0543' },
]);

/**
 * Derived counts. Computed from the lists above rather than hard-coded, so the
 * headline figure can never drift away from the evidence backing it.
 */
export const trackRecord = {
  deliveredCount: delivered.value.length,
  ongoingCount: ongoing.value.length,
  /** States delivery scope without inventing a "years of experience" figure. */
  regions: ['NCR', 'Punjab', 'Uttarakhand', 'Gujarat'] as const,
} as const;
