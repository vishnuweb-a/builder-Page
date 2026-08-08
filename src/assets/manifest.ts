/**
 * Image registry.
 *
 * Intrinsic dimensions are recorded here so <Figure> can reserve layout space
 * and the page never shifts as images decode.
 *
 * Formats are declared per image rather than assumed. These renders are
 * re-encodes of already-JPEG brochure artwork, and WebP does not beat JPEG on
 * them (dense foliage; at matched quality WebP came out 5–10% *larger*). The
 * line-art isometrics compress 27% better as WebP. So renders ship JPEG-only
 * and plans ship both — measured, not assumed.
 */

export type ImageProvenance =
  /** An ATS render, plan or drawing. May be shown as the project. */
  | 'project'
  /** Not the project. Requires a visible caption saying so. */
  | 'illustrative';

export interface ImageAsset {
  readonly id: string;
  /** Widths available, ascending. The last is the intrinsic width of `src`. */
  readonly widths: readonly number[];
  /** Intrinsic size of the largest variant. Drives the aspect ratio box. */
  readonly width: number;
  readonly height: number;
  readonly alt: string;
  readonly provenance: ImageProvenance;
  /** Where it came from. Rendered as a credit line where appropriate. */
  readonly credit: string;
  /** True when a WebP source is worth offering ahead of the JPEG. */
  readonly webp: boolean;
  /** Path under src/assets/images, without the width suffix or extension. */
  readonly base: string;
}

/**
 * Vite resolves every variant at build time and content-hashes it. A missing
 * file throws loudly at module load rather than rendering a broken image.
 */
const files = import.meta.glob('./images/**/*.{jpg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export function variantUrl(base: string, width: number, ext: 'jpg' | 'webp'): string {
  const key = `./images/${base}-${width}.${ext}`;
  const url = files[key];
  if (!url) throw new Error(`Missing image variant: ${key}`);
  return url;
}

export const srcSet = (asset: ImageAsset, ext: 'jpg' | 'webp'): string =>
  asset.widths.map((w) => `${variantUrl(asset.base, w, ext)} ${w}w`).join(', ');

/**
 * REGISTERED PROJECT VISUALS.
 *
 * Only low-rise renders, drawings and plans are registered. The brochure also
 * contains high-rise tower renders (pp. 6, 7, 16) which are deliberately NOT
 * here: the brochure is titled "Low rise" and its site plan shows low-rise
 * blocks, so presenting a 20-storey tower as this product would risk
 * misrepresentation until ATS confirms which phase the campaign sells.
 *
 * The brochure's lifestyle photography (pp. 1–5, 8–11, 28) is licensed stock
 * for print and is excluded — see src/assets/README.md.
 *
 * Phase 3 adds four drawings. The renders were already raster in the PDF; the
 * plans and the map are vector artwork, so they were rasterised from the
 * source page geometry rather than from an embedded bitmap, which is why they
 * are sharp enough to be inspected at 1600px inside the floor-plan dialog.
 * Their white paper ground was flattened onto --ivory-raised so a plan sits on
 * the page instead of inside a white box.
 */
export const images = {
  campusAerial: {
    id: 'campusAerial',
    base: 'project/renders/campus-aerial',
    widths: [640, 960, 1395],
    width: 1395,
    height: 925,
    alt: 'Aerial view of the Kingston Heath campus: a rectangular swimming pool and timber deck enclosed by low-rise residences with green tile roofs, surrounded by lawns, flowering trees and a children’s play area.',
    provenance: 'project',
    credit: 'ATS Kingston Heath brochure, p.17',
    webp: false,
  },
  greenLawns: {
    id: 'greenLawns',
    base: 'project/renders/green-lawns',
    widths: [640, 960, 1395],
    width: 1395,
    height: 920,
    alt: 'Landscaped green between residential blocks, with a curved walkway, mature trees in blossom, an open lawn and a children’s play structure.',
    provenance: 'project',
    credit: 'ATS Kingston Heath brochure, p.13',
    webp: false,
  },
  poolDeck: {
    id: 'poolDeck',
    base: 'project/renders/pool-deck',
    widths: [640, 960, 1395],
    width: 1395,
    height: 926,
    alt: 'The swimming pool at dusk seen from above, with a timber sun deck, palms, parasols and the arched clubhouse colonnade along one edge.',
    provenance: 'project',
    credit: 'ATS Kingston Heath brochure, p.12',
    webp: false,
  },
  isometric4BHK: {
    id: 'isometric4BHK',
    base: 'project/plans/isometric-4bhk',
    widths: [640, 960, 1108],
    width: 1108,
    height: 703,
    alt: 'Cutaway isometric view of the Type A four-bedroom residence, showing the living and dining space opening onto a long balcony, the family lounge, kitchen and four bedrooms.',
    provenance: 'project',
    credit: 'ATS Kingston Heath brochure, p.21',
    webp: true,
  },
  isometric3BHK: {
    id: 'isometric3BHK',
    base: 'project/plans/isometric-3bhk',
    widths: [640, 960, 1096],
    width: 1096,
    height: 784,
    alt: 'Cutaway isometric view of the Type B three-bedroom residence, showing the combined living and dining space, the study and three bedrooms opening onto balconies.',
    provenance: 'project',
    credit: 'ATS Kingston Heath brochure, p.23',
    webp: true,
  },
  floorPlan4BHK: {
    id: 'floorPlan4BHK',
    base: 'project/plans/floor-plan-4bhk',
    widths: [640, 960, 1600],
    width: 1600,
    height: 1454,
    alt: 'Architectural floor plan of the Type A four-bedroom residence. The master bedroom, dining and living room run along the top of the plan onto a continuous balcony; the family lounge sits at the centre beside the kitchen and puja room, with Bedroom-1 and Bedroom-2 below and Bedroom-4 to the right of the living room. Each room is annotated with its dimensions in metres and in feet and inches.',
    provenance: 'project',
    credit: 'ATS Kingston Heath brochure, p.20',
    webp: true,
  },
  floorPlan3BHK: {
    id: 'floorPlan3BHK',
    base: 'project/plans/floor-plan-3bhk',
    widths: [640, 960, 1600],
    width: 1600,
    height: 1343,
    alt: 'Architectural floor plan of the Type B three-bedroom residence. A single living and dining volume runs across the centre of the plan with the study at its right-hand end, Bedroom-2 and Bedroom-1 to the left, Bedroom-3 and the kitchen below, and balconies along three sides. Each room is annotated with its dimensions in metres and in feet and inches.',
    provenance: 'project',
    credit: 'ATS Kingston Heath brochure, p.22',
    webp: true,
  },
  sitePlan: {
    id: 'sitePlan',
    base: 'project/site/site-plan',
    widths: [640, 960, 1280],
    width: 1280,
    height: 1345,
    alt: 'Coloured site plan of the Kingston Heath campus. Low-rise residential blocks stand along the north, east and south edges; the swimming pool and its timber deck sit at the upper left of a large central landscape of lawns, tree groves and winding walkways, with sports courts at the corners of the site.',
    provenance: 'project',
    credit: 'ATS Kingston Heath brochure, p.18',
    webp: true,
  },
  locationMap: {
    id: 'locationMap',
    base: 'project/site/location-map',
    widths: [640, 960, 1440],
    width: 1440,
    height: 1043,
    alt: 'Location map of the Noida–Greater Noida corridor. Kingston Heath is marked in the lower centre, close to the Noida–Greater Noida Expressway, the Sector 148 metro station, a nine-hole golf course and the road towards Jewar International Airport, with Noida to the north-west and Greater Noida to the east. The map is marked "not to scale".',
    provenance: 'project',
    credit: 'ATS Kingston Heath brochure, p.15',
    webp: true,
  },
} as const satisfies Record<string, ImageAsset>;

export type ImageKey = keyof typeof images;
