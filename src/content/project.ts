import { brochure, client, docs, unverified } from './_source.ts';

/** Identity — brochure cover + back cover. */
export const project = {
  name: 'ATS Kingston Heath',
  shortName: 'Kingston Heath',
  strapline: brochure("NCR's First Wellness Homes", 'Printed under the logo on the cover.'),
  sector: 'Sector 150',
  city: 'Noida',
  locality: brochure('Sector 150, Noida'),
} as const;

/** Developer — back cover. Two levels of identity, both accurate. */
export const developer = {
  /** The brand buyers recognise. */
  group: brochure('ATS Infrastructure Ltd.'),
  /** The entity that holds this project. Belongs in fine print, not headlines. */
  entity: brochure('ATS Celerity Infrastructure Private Limited'),
  tagline: brochure('The better way home.'),
  website: brochure('https://www.atsgreens.com'),
  email: brochure('sales@atsgreens.com'),
  membership: brochure('CREDAI'),
} as const;

/** Regulatory — cover + back cover. Must appear on the page. */
export const regulatory = {
  reraNumber: brochure('UPRERAPRJ180413'),
  reraSite: brochure('https://www.up-rera.in'),
  projectStartDate: brochure('01/04/2021'),
  siteAddress: brochure('Plot No. SC-01/C, C-A-02, A-04, A-06, A-11 & A-12, Sector-150, Noida'),
  corporateOffice: brochure('ATS Tower, Plot No. 16, Sector 135, Noida-201305'),
  /**
   * Deliberately NOT modelled: the collection bank account number and IFSC code
   * printed on the brochure back cover. Publishing those on a public landing
   * page invites payment fraud against buyers.
   */
} as const;

/**
 * Contact — the ONE source of truth for every number the page dials, opens in
 * WhatsApp or prints. Components import from here and never inline a number.
 *
 * Numbers are stored in E.164 (`+` and country code, no spaces or separators).
 * That is the only format both `tel:` and `wa.me` can be derived from without
 * guessing a country, so the derivations in src/lib/contact.ts are pure string
 * work rather than a parser. Display formatting is also derived, never stored
 * a second time.
 *
 * The brochure prints only the ATS corporate switchboard. The campaign line is
 * a client-issued sales number: it appears in no printed source, so it carries
 * `client` provenance rather than `brochure`. It previously sat in `.env` as
 * CONTACT_NUMBER / WHATSAPP_NUMBER — the wrong home for it, because `.env` is
 * gitignored (a fresh clone or a CI build would have shipped dead links) and
 * the variables were not `VITE_`-prefixed, so no client code could read them.
 * A public sales number is content, not a secret.
 */
export const contact = {
  corporatePhone: brochure('+911207111500', 'Printed as 0120-7111500 (corporate office).'),
  campaignPhone: client(
    '+919315551280',
    'Sales line supplied by the client (previously CONTACT_NUMBER in .env).',
  ),
  /**
   * Typed `string | null` so the WhatsApp action stays conditional: if the
   * campaign ever moves to a landline the correct behaviour is for the button
   * to disappear, not to link to a number with no WhatsApp account behind it.
   */
  whatsapp: client<string | null>(
    '+919315551280',
    'Same line as the campaign number (previously WHATSAPP_NUMBER in .env).',
  ),
} as const;

/**
 * Pricing.
 * ₹16,500/sq ft appears in docs/prd.md §8 and docs/design.md §29 but does NOT
 * appear anywhere in the brochure, and the basis (super vs carpet area) is not
 * stated. It stays unverified, so `publish()` returns null and no price
 * renders until it is confirmed with the authorised sales team.
 */
export const pricing = {
  perSqFt: unverified(
    { amount: 16500, currency: 'INR', basis: 'super area (assumed)' },
    'Absent from the brochure; area basis unconfirmed. Confirm with ATS sales before publishing.',
  ),
  disclaimer: docs(
    'Pricing is indicative and subject to applicable charges, availability, configuration and developer terms. Verify the latest pricing with the authorised sales team.',
    'docs/design.md §29.',
  ),
  excludedCharges: brochure(
    ['GST', 'Stamp Duty', 'Registration Charges', 'Miscellaneous Charges', 'PLC', 'Lease Rent'],
    'Back-cover disclaimer: "prices exclude…".',
  ),
} as const;

/** Standing disclaimers that must accompany the matching content. */
export const disclaimers = {
  amenities: brochure(
    'Amenities, features and specifications are indicative and subject to change, addition or deletion as per architectural, structural or aesthetic considerations.',
    'Landscape legend, brochure p.19.',
  ),
  area: brochure('Super area may vary by ±10%.', 'Floor-plan notes, brochure pp.20 & 22.'),
  sitePlan: brochure(
    'Map not to scale. The site plan shown is tentative and the overall layout may vary for statutory or design reasons.',
    'Brochure p.18.',
  ),
  imagery: brochure(
    "Images are artist's impressions of the completed development and do not constitute a legal offering.",
    'Back-cover disclaimer.',
  ),
} as const;

/**
 * Claims that must never be asserted. Kept in code as a standing reminder for
 * anyone adding sections in later phases.
 */
export const doNotClaim = [
  'Possession or completion date — not stated in any source.',
  'Travel times or distances to airport, metro or expressway — the brochure gives none.',
  'Tower, floor or apartment counts, density, or tower spacing — not stated.',
  'Construction status or current availability.',
  'Price appreciation, rental yield or investment returns.',
  'Testimonials, reviews, ratings or awards.',
  'A golf course as part of the project — it is adjacent, and the 9-hole course is a nearby facility.',
  '"80% green cover" as a project attribute — it describes Sector 150, not Kingston Heath.',
] as const;
