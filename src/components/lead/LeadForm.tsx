import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Field } from '@/components/form/Field.tsx';
import { FormContainer } from '@/components/form/FormContainer.tsx';
import { Input } from '@/components/form/Input.tsx';
import { Textarea } from '@/components/form/Textarea.tsx';
import { CTAButton } from '@/components/ui/CTAButton.tsx';
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

const EMPTY: LeadEnquiry = { name: '', email: '', message: '' };

interface LeadFormProps {
  /** Called once the provider confirms acceptance. The drawer shows the success state. */
  onSuccess: () => void;
  /**
   * Injectable for tests and for the day Web3Forms is replaced. Components never
   * import a provider by name — see src/lib/lead/types.ts.
   */
  submit?: SubmitLead;
}

/**
 * The enquiry form.
 *
 * Three fields, held in component state and nowhere else. Nothing is written to
 * localStorage, sessionStorage, a cookie or an analytics queue, and nothing the
 * visitor types is ever logged — the data exists in memory for as long as they
 * are looking at it, and then it is gone.
 *
 * Validation runs on submit. After that first attempt a field re-validates as
 * it is edited, so an error clears the moment it is fixed. Validating before
 * the visitor has finished typing their email address is how a form starts
 * arguing with someone who has done nothing wrong yet.
 */
export function LeadForm({ onSuccess, submit = submitLeadViaWeb3Forms }: LeadFormProps) {
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
   * press, or Enter held down in a text input, can dispatch two submits before
   * React has re-rendered. A ref is the only check that has already flipped.
   */
  const inFlight = useRef(false);

  /**
   * A failure message nobody can see is a form that appears to have done
   * nothing. On a phone — and on a short desktop window — the alert and the
   * retry button both sit below the fold of a scrolled drawer, so bring them
   * back into view. Focus is deliberately NOT moved: the alert is announced by
   * its role, and stealing focus mid-announcement cuts it short.
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
        // Focus by control name rather than by a ref per field: the elements
        // exist regardless of error state, so this lands immediately instead of
        // waiting for the error render to commit.
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
        // The drawer takes over from here. Values are dropped by unmounting
        // this component, which is also what guarantees a clean form next time.
        onSuccess();
        return;
      }

      // Everything the visitor typed stays exactly where it was. Losing a
      // written message to a dropped connection is unforgivable, and the retry
      // is simply pressing the button again.
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
      <fieldset disabled={busy} className="m-0 flex min-w-0 flex-col gap-7 border-0 p-0">
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

        <Field label={leadForm.fields.email.label} required error={errors.email}>
          <Input
            name="email"
            type="email"
            value={values.email}
            onChange={(e) => setField('email', e.target.value)}
            placeholder={leadForm.fields.email.placeholder}
            autoComplete="email"
            inputMode="email"
            enterKeyHint="next"
          />
        </Field>

        {/* Enter inserts a newline here and does not submit — the browser's own
            behaviour for a textarea, and the reason there is no key handler. */}
        <Field label={leadForm.fields.message.label} required error={errors.message}>
          <Textarea
            name="message"
            value={values.message}
            onChange={(e) => setField('message', e.target.value)}
            placeholder={leadForm.fields.message.placeholder}
          />
        </Field>

        {/* Announced, and legible without colour: the heading says what
            happened in words, so the champagne rule is decoration rather than
            the message. `danger` red is not used here — on the deep green
            drawer it fails contrast, and this is not a field-level error. */}
        {status === 'error' && (
          <div role="alert" className="flex flex-col gap-1.5 border-l border-gold pl-5">
            <p className="t-eyebrow text-gold">{leadForm.errorTitle}</p>
            <p className="t-small text-charcoal/75 [.surface-dark_&]:text-ivory/75">
              {leadForm.errorBody}
            </p>
          </div>
        )}

        <CTAButton type="submit" variant="gold" size="lg" className="w-full">
          {busy ? leadForm.submitting : leadForm.submit}
        </CTAButton>
      </fieldset>
    </FormContainer>
  );
}
