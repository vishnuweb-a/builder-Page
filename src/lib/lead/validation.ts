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

/** Ten digits opening with 6–9: the Indian mobile numbering plan. */
const INDIAN_MOBILE = /^[6-9]\d{9}$/;

/**
 * Phone.
 *
 * docs/prd.md §22 asks for Indian mobile validation, and that is the main
 * rule: after stripping spaces, hyphens, brackets and a +91 / 91 / 0 prefix,
 * ten digits beginning 6–9. That catches the mistakes people actually make —
 * a digit short, a digit extra, a landline typed by accident.
 *
 * It is not the ONLY rule, because a Sector 150 buyer is quite often an NRI
 * dialling from Dubai or Singapore, and rejecting their number outright loses
 * a lead the sales team would very much like to have. So a number entered with
 * an explicit international prefix is accepted on length alone.
 *
 * Prefix stripping is length-gated on purpose. A blind `^(91|0)` strip would
 * eat the leading "91" of 9187654321 — a perfectly valid ten-digit number —
 * and reject it. The prefix is only removed when what remains is the right
 * length to be a number in its own right.
 */
function validatePhone(raw: string): string | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return leadForm.errors.phoneRequired;

  // Letters mean this is not a phone number at all, however it is punctuated.
  if (/[a-z]/i.test(trimmed)) return leadForm.errors.phoneInvalid;

  const digits = trimmed.replace(/\D/g, '');

  const candidates = [digits];
  if (digits.length === 12 && digits.startsWith('91')) candidates.push(digits.slice(2));
  if (digits.length === 11 && digits.startsWith('0')) candidates.push(digits.slice(1));
  if (candidates.some((c) => INDIAN_MOBILE.test(c))) return undefined;

  // Explicitly international: trust the country code, check only plausibility.
  // 15 digits is the E.164 maximum; 8 is about the shortest real number.
  if (trimmed.startsWith('+') && digits.length >= 8 && digits.length <= 15) return undefined;

  return leadForm.errors.phoneInvalid;
}

/** Order matters: it decides which field receives focus after a failed submit. */
export const LEAD_FIELDS: readonly LeadField[] = ['name', 'phone', 'email', 'message'];

export function validateField(field: LeadField, value: string): string | undefined {
  const trimmed = value.trim();

  switch (field) {
    case 'name':
      return trimmed ? undefined : leadForm.errors.name;
    case 'phone':
      return validatePhone(value);
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

/**
 * Trimmed on the way out, so trailing whitespace never reaches the inbox.
 *
 * The phone number is trimmed and otherwise left exactly as typed. Reformatting
 * it into some canonical shape would help nobody: the sales team dials what is
 * in the email, and a "helpful" normaliser that drops a country code or invents
 * one turns a reachable lead into a wrong number.
 */
export const normalise = (values: LeadEnquiry): LeadEnquiry => ({
  name: values.name.trim(),
  phone: values.phone.trim(),
  email: values.email.trim(),
  message: values.message.trim(),
});
