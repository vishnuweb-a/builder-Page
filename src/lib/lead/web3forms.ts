import { leadForm } from '@/content/copy.ts';
import type { LeadEnquiry, SubmitLead, SubmitResult } from './types.ts';

/**
 * Web3Forms provider.
 *
 * The whole of the project's knowledge about Web3Forms is in this file: the
 * endpoint, the field names, the response shape, and the access key. Nothing
 * else imports it by name — components take `SubmitLead` from ./types.ts — so
 * replacing this with a CRM endpoint later is one new file and one changed
 * import, not a rebuild of the drawer.
 *
 * Why no backend: the page is static and ad-funded, and a Node process whose
 * only job is to relay three fields to an inbox is a server to patch, monitor
 * and pay for. Web3Forms accepts the post directly from the browser.
 */

const ENDPOINT = 'https://api.web3forms.com/submit';

/**
 * A hung request is worse than a failed one — the visitor watches "Sending…"
 * forever and has no way to retry. Fifteen seconds, then treat it as a network
 * failure with the form intact.
 */
const TIMEOUT_MS = 15_000;

/** Web3Forms answers `{ success, message }` on both acceptance and refusal. */
interface Web3FormsResponse {
  success?: boolean;
  message?: string;
}

const isResponseBody = (value: unknown): value is Web3FormsResponse =>
  typeof value === 'object' && value !== null;

/**
 * Development-only diagnostics.
 *
 * The rule this exists to enforce: NOTHING the visitor typed is ever passed
 * here. Not the name, not the email, not the message — not even truncated, and
 * not "just while debugging". A console entry is copied into bug reports and
 * screenshots, and their name and email are their data, not ours. Only the
 * failure reason and the provider's own message are logged, and only in dev.
 */
function warn(detail: string): void {
  if (import.meta.env.DEV) console.warn(`[lead] ${detail}`);
}

/**
 * Submit an enquiry to Web3Forms.
 *
 * The body is `application/x-www-form-urlencoded` rather than JSON, which is
 * one of the formats Web3Forms documents and the one that keeps this a CORS
 * "simple request" — no preflight OPTIONS round-trip before the post, which is
 * one fewer thing to fail on a phone with a poor connection.
 */
export const submitLeadViaWeb3Forms: SubmitLead = async (
  enquiry: LeadEnquiry,
): Promise<SubmitResult> => {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim();

  // No key means no request. Posting an empty access_key would produce a
  // guaranteed rejection that looks exactly like a real outage, and would send
  // the visitor's details to an endpoint that is going to discard them.
  if (!accessKey) {
    warn('Web3Forms access key is not configured. Set VITE_WEB3FORMS_ACCESS_KEY in .env.');
    return { ok: false, reason: 'unconfigured' };
  }

  const body = new URLSearchParams({
    access_key: accessKey,
    // Web3Forms' own supported fields: these shape the email that arrives, so
    // the sales team can see at a glance which project the enquiry is for.
    subject: leadForm.emailSubject,
    from_name: leadForm.emailFromName,
    name: enquiry.name,
    email: enquiry.email,
    message: enquiry.message,
  });

  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    // Offline, DNS failure, blocked by an extension, or timed out. The error
    // object is not logged: it can carry the request URL and we gain nothing.
    warn('Request to Web3Forms did not complete (offline, blocked or timed out).');
    return { ok: false, reason: 'network' };
  }

  // A completed request is not an accepted lead. Web3Forms reports refusal —
  // an invalid key, a rate limit — in the body, and treating HTTP 200 as
  // success would show a confirmation for an enquiry nobody received.
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    warn(`Web3Forms returned a non-JSON body (HTTP ${response.status}).`);
    return { ok: false, reason: 'unexpected' };
  }

  if (!isResponseBody(payload) || typeof payload.success !== 'boolean') {
    warn(`Web3Forms returned an unrecognised body (HTTP ${response.status}).`);
    return { ok: false, reason: 'unexpected' };
  }

  if (!response.ok || !payload.success) {
    warn(`Web3Forms rejected the submission (HTTP ${response.status}): ${payload.message ?? '—'}`);
    return { ok: false, reason: 'rejected', detail: payload.message };
  }

  return { ok: true };
};
