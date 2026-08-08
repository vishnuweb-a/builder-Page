import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Field } from '@/components/form/Field.tsx';
import { FormContainer } from '@/components/form/FormContainer.tsx';
import { Input } from '@/components/form/Input.tsx';
import { CTAButton, type CTAVariant } from '@/components/ui/CTAButton.tsx';
import { leadForm } from '@/content/index.ts';
import { prefersReducedMotion } from '@/motion/index.ts';
import { submitLeadViaWeb3Forms } from '@/lib/lead/web3forms.ts';
import type { LeadEnquiry, SubmitLead } from '@/lib/lead/types.ts';
import {
  LEAD_FIELDS,
  normalise,
  validateEnquiry,
  validateField,
  type LeadErrors,
  type LeadField,
} from '@/lib/lead/validation.ts';

export type LeadFormStatus = 'idle' | 'submitting' | 'error';

const EMPTY: LeadEnquiry = { name: '', phone: '' };

interface LeadFormProps {
  /** Called once the provider confirms acceptance. The host shows the success state. */
  onSuccess: () => void;
  /** The submit button's fill. `gold` on the green drawer, `primary` on light. */
  submitVariant?: CTAVariant;
  /**
   * Injectable for tests and for the day Web3Forms is replaced. Components never
   * import a provider by name — see src/lib/lead/types.ts.
   */
  submit?: SubmitLead;
}

/**
 * The enquiry form. One implementation, two homes: the first-viewport panel and
 * the lead drawer both render THIS component — there is no second form.
 *
 * Two fields, held in component state and nowhere else. Nothing is written to
 * localStorage, sessionStorage, a cookie or an analytics queue, and nothing the
 * visitor types is ever logged — the details exist in memory for as long as
 * they are looking at them, and then they are gone. That matters more at two
 * fields than at one: a name beside a phone number is the part a leak hurts.
 *
 * Nothing here is animated and nothing here waits. The component renders its
 * fields on the first paint with no opacity gate, no entrance, and no
 * dependency on Anime.js having run: if the motion layer never executes, the
 * form is still there and still submits. That is the one rule this file must
 * never break, because it is now the page's primary conversion point.
 *
 * Validation runs on submit. After that first attempt the field re-validates as
 * it is edited, so an error clears the moment it is fixed. Validating before
 * the visitor has finished typing is how a form starts arguing with someone who
 * has done nothing wrong yet.
 */
export function LeadForm({
  onSuccess,
  submitVariant = 'primary',
  submit = submitLeadViaWeb3Forms,
}: LeadFormProps) {
  const [values, setValues] = useState<LeadEnquiry>(EMPTY);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<LeadFormStatus>('idle');
  /** True once submit has been pressed; gates live re-validation. */
  const [attempted, setAttempted] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  /**
   * Guards against a second request, synchronously.
   *
   * `disabled` on the button and a `status` check both close the common case,
   * but neither is synchronous within a single event loop turn — a fast double
   * press, or Enter held down in the text input, can dispatch two submits
   * before React has re-rendered. A ref is the only check that has already
   * flipped.
   */
  const inFlight = useRef(false);

  /**
   * A failure message nobody can see is a form that appears to have done
   * nothing. On a phone — and in a scrolled drawer — the alert and the retry
   * button can both sit below the fold, so bring them back into view. Focus is
   * deliberately NOT moved: the alert is announced by its role, and stealing
   * focus mid-announcement cuts it short.
   */
  useEffect(() => {
    if (status !== 'error') return;
    formRef.current?.querySelector('button[type="submit"]')?.scrollIntoView({
      block: 'nearest',
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, [status]);

  const setField = useCallback(
    (field: LeadField, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      if (!attempted) return;
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    },
    [attempted],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (inFlight.current) return;

      setAttempted(true);
      const nextErrors = validateEnquiry(values);
      setErrors(nextErrors);

      const firstInvalid = LEAD_FIELDS.find((field) => nextErrors[field]);
      if (firstInvalid) {
        // Focus by control name rather than by a ref per field: the element
        // exists regardless of error state, so this lands immediately instead
        // of waiting for the error render to commit.
        const control = formRef.current?.elements.namedItem(firstInvalid);
        if (control instanceof HTMLElement) control.focus();
        setStatus('idle');
        return;
      }

      inFlight.current = true;
      setStatus('submitting');

      const result = await submit(normalise(values));

      inFlight.current = false;

      if (result.ok) {
        // The host takes over from here. Values are dropped by unmounting this
        // component, which is also what guarantees a clean form next time.
        onSuccess();
        return;
      }

      // What the visitor typed stays exactly where it was, and the retry is
      // simply pressing the button again.
      setStatus('error');
    },
    [values, submit, onSuccess],
  );

  const busy = status === 'submitting';

  return (
    <FormContainer ref={formRef} onSubmit={handleSubmit} aria-busy={busy || undefined}>
      {/*
        `fieldset` + `disabled` disables every control inside it in one go while
        a request is in flight, including the submit button — no per-input
        `disabled` prop to forget. The border and padding resets keep it
        invisible; it is a semantic grouping, not a box.
      */}
      <fieldset disabled={busy} className="m-0 flex min-w-0 flex-col gap-5 border-0 p-0 md:gap-7">
        <Field label={leadForm.fields.name.label} required error={errors.name}>
          <Input
            name="name"
            type="text"
            value={values.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder={leadForm.fields.name.placeholder}
            autoComplete="name"
            enterKeyHint="next"
          />
        </Field>

        {/*
          The number is how this team actually follows a lead up, so it sits
          directly under the name. `type="tel"` rather than `type="number"`: a
          number input strips a leading +, rejects spaces, and hangs a spinner
          off a phone number.
        */}
        <Field label={leadForm.fields.phone.label} required error={errors.phone}>
          <Input
            name="phone"
            type="tel"
            value={values.phone}
            onChange={(e) => setField('phone', e.target.value)}
            placeholder={leadForm.fields.phone.placeholder}
            autoComplete="tel"
            inputMode="tel"
            enterKeyHint="send"
          />
        </Field>

        {/* Announced, and legible without colour: the heading says what
            happened in words, so the champagne rule is decoration rather than
            the message. `--accent-ink` resolves per surface, so this reads on
            the ivory panel and on the green drawer without a second variant. */}
        {status === 'error' && (
          <div role="alert" className="flex flex-col gap-1.5 border-l border-gold pl-5">
            <p className="t-eyebrow text-accent">{leadForm.errorTitle}</p>
            <p className="t-small text-charcoal/75 [.surface-dark_&]:text-ivory/75">
              {leadForm.errorBody}
            </p>
          </div>
        )}

        <CTAButton type="submit" variant={submitVariant} size="lg" className="w-full">
          {busy ? leadForm.submitting : leadForm.submit}
        </CTAButton>
      </fieldset>
    </FormContainer>
  );
}
