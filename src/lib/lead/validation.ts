import { leadForm } from '@/content/copy.ts';
import type { LeadEnquiry } from './types.ts';

/**
 * Enquiry validation.
 *
 * Pure functions over plain values, deliberately outside the component: the
 * rules are the part worth reasoning about, and they should be readable without
 * a JSX file in the way.
 *
 * The governing principle is restraint. This form asks a family for their name
 * and a sentence; every rule beyond "did you actually type something" is a
 * chance to reject a real enquiry. So there is no name-character allow-list
 * (which breaks on apostrophes, hyphens, conjuncts and every script that is not
 * Latin), no minimum message length, and no attempt to decide whether an email
 * address "looks professional".
 */

export type LeadField = keyof LeadEnquiry;

export type LeadErrors = Partial<Record<LeadField, string>>;

/**
 * Email shape check, kept deliberately loose.
 *
 * Requires text, an @, text, a dot and text — which catches the typos people
 * actually make (missing @, trailing comma, "gmail" with no TLD) and rejects
 * nothing legitimate that a buyer in Noida is going to type. Full RFC 5322 is
 * not worth implementing: the address is verified by whether the reply arrives,
 * and a regex strict enough to be "correct" reliably rejects valid addresses.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Order matters: it decides which field receives focus after a failed submit. */
export const LEAD_FIELDS: readonly LeadField[] = ['name', 'email', 'message'];

export function validateField(field: LeadField, value: string): string | undefined {
  const trimmed = value.trim();

  switch (field) {
    case 'name':
      return trimmed ? undefined : leadForm.errors.name;
    case 'email':
      if (!trimmed) return leadForm.errors.emailRequired;
      return EMAIL.test(trimmed) ? undefined : leadForm.errors.emailInvalid;
    case 'message':
      return trimmed ? undefined : leadForm.errors.message;
  }
}

export function validateEnquiry(values: LeadEnquiry): LeadErrors {
  const errors: LeadErrors = {};
  for (const field of LEAD_FIELDS) {
    const error = validateField(field, values[field]);
    if (error) errors[field] = error;
  }
  return errors;
}

/** Trimmed on the way out, so trailing whitespace never reaches the inbox. */
export const normalise = (values: LeadEnquiry): LeadEnquiry => ({
  name: values.name.trim(),
  email: values.email.trim(),
  message: values.message.trim(),
});
