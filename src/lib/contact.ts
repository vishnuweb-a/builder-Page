/**
 * Contact-link derivation.
 *
 * Every `tel:` and every `wa.me` URL on the page is produced here, from the
 * E.164 numbers in src/content/project.ts. The point is not tidiness: `tel:`
 * tolerates a leading `+` and WhatsApp does not, and a WhatsApp link built with
 * a `+`, a space or a hyphen in it silently resolves to "phone number shared
 * via url is invalid" rather than failing loudly. Deriving both from one
 * canonical string means that difference is encoded once, in a function with a
 * name, instead of being re-remembered at every call site.
 */

/** Strips `+`, spaces, brackets and hyphens. `+91 93155 51280` → `919315551280` */
export const digitsOnly = (raw: string): string => raw.replace(/\D/g, '');

/**
 * `tel:` target. Kept in E.164 with the `+`: a national-format `tel:` is
 * ambiguous once the visitor is roaming, and every platform accepts the `+`.
 */
export const telHref = (raw: string): string => `tel:+${digitsOnly(raw)}`;

/**
 * `wa.me` target. The number must be the international number with no `+` and
 * no separators. `text` is URL-encoded into the standard prefill parameter.
 */
export const whatsappHref = (raw: string, text?: string): string => {
  const base = `https://wa.me/${digitsOnly(raw)}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
};

/**
 * Display form. Indian mobiles group as `+91 93155 51280` (5+5, the grouping
 * TRAI and every Indian carrier print); anything else is returned with a space
 * after the country code rather than mangled into a format it does not use.
 */
export const formatPhone = (raw: string): string => {
  const digits = digitsOnly(raw);
  if (digits.length === 12 && digits.startsWith('91')) {
    const national = digits.slice(2);
    return `+91 ${national.slice(0, 5)} ${national.slice(5)}`;
  }
  return raw.startsWith('+') ? raw : `+${digits}`;
};
