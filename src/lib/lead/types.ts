/**
 * The lead contract, stated independently of who delivers it.
 *
 * Web3Forms is a decision about plumbing, not about the product. Everything the
 * UI touches lives in this file, so swapping the provider later — for a CRM
 * endpoint, or an owned API — means writing one new module that satisfies
 * `SubmitLead` and changing one import. No component knows the provider's name,
 * its field names, or its response shape.
 */

/** Exactly the four fields the form collects. Nothing else is gathered. */
export interface LeadEnquiry {
  readonly name: string;
  /** As typed, trimmed. Never reformatted — see the note in validation.ts. */
  readonly phone: string;
  readonly email: string;
  readonly message: string;
}

/**
 * Why a submission failed, in terms the UI can act on.
 *
 * The visitor sees one message for all four — a landing page should never
 * explain its own plumbing to a stranger — but the distinction matters for
 * development diagnostics, and would matter to any future retry policy.
 */
export type SubmitFailure =
  /** No access key is configured. A local/dev problem, never the visitor's. */
  | 'unconfigured'
  /** The request never completed: offline, DNS, CORS, timeout. */
  | 'network'
  /** The provider answered, and refused. */
  | 'rejected'
  /** The provider answered with something we do not recognise. */
  | 'unexpected';

export type SubmitResult =
  | { readonly ok: true }
  | {
      readonly ok: false;
      readonly reason: SubmitFailure;
      /**
       * Developer-facing detail. MUST NOT contain any field the visitor typed —
       * see the note in web3forms.ts about what may be logged.
       */
      readonly detail?: string;
    };

export type SubmitLead = (enquiry: LeadEnquiry) => Promise<SubmitResult>;
