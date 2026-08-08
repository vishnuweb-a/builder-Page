import type { FeetInches } from '@/lib/format.ts';

/**
 * Residence data — transcribed from the brochure floor plans (pp. 20 & 22).
 *
 * Both the metric figure (the architect's dimension) and the brochure's own
 * feet-inches conversion are kept. Feet and inches are stored as separate
 * numbers; see src/lib/format.ts for why.
 */

export interface Room {
  /** Brochure label, unchanged. */
  readonly label: string;
  /** Marketing label where it differs from the drawing. Optional and honest. */
  readonly displayLabel?: string;
  /** Width × depth in metres, as printed. */
  readonly metres: readonly [number, number];
  readonly width: FeetInches;
  readonly depth: FeetInches;
}

export interface Areas {
  readonly superAreaSqM: number;
  readonly superAreaSqFt: number;
  readonly builtUpSqM: number;
  readonly builtUpSqFt: number;
  readonly commonServicesSqM: number;
  readonly commonServicesSqFt: number;
  readonly carpetSqM: number;
  readonly carpetSqFt: number;
}

export interface Residence {
  readonly id: 'type-a' | 'type-b';
  /** Brochure designation. */
  readonly planName: string;
  /** Full designation. Accurate, and stronger than a bare "4 BHK". */
  readonly label: string;
  /** Headline form. The utility room is real but does not belong in 48pt type. */
  readonly headline: string;
  /** Short form for the lead-form configuration selector. */
  readonly formValue: string;
  readonly bedrooms: number;
  readonly areas: Areas;
  readonly rooms: readonly Room[];
  /** Rooms worth featuring as evidence of space. */
  readonly highlightRooms: readonly string[];
}

export const TYPE_A: Residence = {
  id: 'type-a',
  planName: 'Floor Plan — Type A',
  label: '4 BHK + Family Lounge + Utility',
  headline: '4 BHK + Family Lounge',
  formValue: '4 BHK',
  bedrooms: 4,
  areas: {
    superAreaSqM: 306.58,
    superAreaSqFt: 3300,
    builtUpSqM: 265.7,
    builtUpSqFt: 2860,
    commonServicesSqM: 40.87,
    commonServicesSqFt: 440,
    carpetSqM: 209.12,
    carpetSqFt: 2251,
  },
  rooms: [
    { label: 'Master Bedroom', metres: [4.5, 5.0], width: [14, 9], depth: [16, 4] },
    { label: 'Living Room', metres: [4.0, 5.715], width: [13, 1], depth: [18, 9] },
    { label: 'Dining', metres: [3.83, 4.785], width: [12, 6], depth: [15, 8] },
    { label: 'Family Lounge', metres: [3.6, 4.475], width: [11, 9], depth: [14, 8] },
    { label: 'Kitchen', metres: [3.15, 4.36], width: [10, 4], depth: [14, 3] },
    { label: 'Bedroom-1', metres: [3.75, 4.625], width: [12, 3], depth: [15, 2] },
    {
      label: 'Bedroom-2',
      // docs/prd.md calls this the "Kids Bedroom". That is marketing language,
      // not a brochure label — kept separate so the two never get confused.
      displayLabel: "Kids' Bedroom",
      metres: [3.6, 4.71],
      width: [11, 9],
      depth: [15, 5],
    },
    { label: 'Bedroom-4', metres: [3.665, 4.3], width: [12, 0], depth: [14, 1] },
    { label: 'Entrance Lobby', metres: [3.115, 2.03], width: [10, 2], depth: [6, 7] },
    { label: 'Puja', metres: [2.2, 1.5], width: [7, 2], depth: [4, 11] },
    { label: 'Utility Room', metres: [2.2, 2.75], width: [7, 2], depth: [9, 0] },
  ],
  highlightRooms: ['Living Room', 'Master Bedroom', 'Family Lounge', 'Bedroom-2'],
};

export const TYPE_B: Residence = {
  id: 'type-b',
  planName: 'Floor Plan — Type B',
  label: '3 BHK + Study + Utility',
  headline: '3 BHK + Study',
  formValue: '3 BHK',
  bedrooms: 3,
  areas: {
    superAreaSqM: 218.32,
    superAreaSqFt: 2350,
    builtUpSqM: 179.86,
    builtUpSqFt: 1936,
    commonServicesSqM: 38.46,
    commonServicesSqFt: 414,
    carpetSqM: 141.11,
    carpetSqFt: 1519,
  },
  rooms: [
    { label: 'Living / Dining', metres: [6.65, 5.35], width: [21, 9], depth: [17, 6] },
    { label: 'Bedroom-2', metres: [3.715, 5.0], width: [12, 2], depth: [16, 4] },
    { label: 'Bedroom-3', metres: [3.6, 4.5], width: [11, 9], depth: [14, 9] },
    { label: 'Bedroom-1', metres: [3.45, 4.2], width: [11, 3], depth: [13, 9] },
    { label: 'Kitchen', metres: [2.55, 3.65], width: [8, 4], depth: [11, 11] },
    { label: 'Study', metres: [2.4, 3.0], width: [7, 10], depth: [9, 10] },
    { label: 'Utility Room', metres: [1.8, 2.7], width: [5, 10], depth: [8, 10] },
  ],
  highlightRooms: ['Living / Dining', 'Bedroom-2', 'Study'],
};

export const residences = [TYPE_B, TYPE_A] as const;

/** Options for the lead form's configuration control (Phase 2+). */
export const configurationOptions = residences.map((r) => ({
  value: r.formValue,
  label: r.label,
}));

export const findRoom = (residence: Residence, label: string): Room | undefined =>
  residence.rooms.find((r) => r.label === label);
