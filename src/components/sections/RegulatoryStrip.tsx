import type { ReactNode } from 'react';
import { Container } from '@/components/layout/Container.tsx';
import { Section } from '@/components/layout/Section.tsx';
import { Eyebrow } from '@/components/ui/Eyebrow.tsx';
import {
  contact,
  developer,
  disclaimers,
  pricing,
  project,
  publish,
  regulatory,
  sections,
} from '@/content/index.ts';

/**
 * Regulatory information.
 *
 * Everything on a real-estate advertisement that a buyer is entitled to check,
 * set as a considered end to the page rather than as a wall of small print:
 * a labelled grid at 12px, one hairline, no boxes, no scare capitals.
 *
 * Two deliberate omissions:
 *
 * • The collection bank account number and IFSC code printed on the brochure's
 *   back cover are NOT modelled anywhere in this codebase. Publishing them on a
 *   page that advertising traffic lands on invites payment fraud against
 *   buyers, and the sales team can give them to a genuine purchaser directly.
 *
 * • The campaign phone number and WhatsApp line are `unverified` in the content
 *   layer, so `publish()` returns null and neither renders. The number below is
 *   the ATS corporate office switchboard, labelled as exactly that — it is what
 *   the brochure prints, and calling it something it is not would be the first
 *   dishonest thing on the page.
 */

function Entry({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="t-eyebrow text-ivory/40">{label}</dt>
      <dd className="t-fine m-0 text-ivory/70">{children}</dd>
    </div>
  );
}

const linkClass =
  'text-ivory/80 underline decoration-gold/60 underline-offset-4 transition-colors hover:decoration-gold';

export function RegulatoryStrip() {
  const campaignPhone = publish(contact.campaignPhone);
  const price = publish(pricing.perSqFt);
  const copy = sections.regulatory;

  return (
    <Section tone="charcoal" rhythm="default" label="Project and regulatory information">
      <Container as="footer" className="flex flex-col gap-10">
        <Eyebrow rule>{copy.eyebrow}</Eyebrow>

        <dl className="m-0 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
          <Entry label={copy.reraLabel}>
            <span className="t-small block text-ivory">{regulatory.reraNumber.value}</span>
            <a
              href={regulatory.reraSite.value}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {copy.reraSiteLabel} up-rera.in
            </a>
          </Entry>

          <Entry label={copy.groupLabel}>
            <span className="t-small block text-ivory">{developer.group.value}</span>
            {developer.entity.value}
          </Entry>

          <Entry label={copy.siteLabel}>{regulatory.siteAddress.value}</Entry>

          <Entry label={copy.officeLabel}>
            {regulatory.corporateOffice.value}
            <br />
            <a href={`tel:${contact.corporatePhone.value}`} className={linkClass}>
              0120-7111500
            </a>
          </Entry>

          <Entry label={copy.startedLabel}>{regulatory.projectStartDate.value}</Entry>

          <Entry label="Project">
            {project.name} · {project.sector}, {project.city}
          </Entry>

          <Entry label={copy.chargesLabel}>{pricing.excludedCharges.value.join(' · ')}</Entry>

          <Entry label="ATS">
            <a
              href={developer.website.value}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              atsgreens.com
            </a>
            <br />
            <a href={`mailto:${developer.email.value}`} className={linkClass}>
              {developer.email.value}
            </a>
            <br />
            Member, {developer.membership.value}
          </Entry>

          {/* Rendered only once a campaign number is confirmed by marketing. */}
          {campaignPhone && (
            <Entry label="Sales">
              <a href={`tel:${campaignPhone}`} className={linkClass}>
                {campaignPhone}
              </a>
            </Entry>
          )}
        </dl>

        <div className="flex flex-col gap-3 border-t border-ivory/12 pt-8">
          <p className="t-fine max-w-4xl text-ivory/45">
            {disclaimers.imagery.value} {disclaimers.area.value} {disclaimers.amenities.value}{' '}
            {disclaimers.sitePlan.value}
          </p>
          {/* The price disclaimer accompanies a price. There is no published
              price, so printing its disclaimer would only imply one exists. */}
          {price && (
            <p className="t-fine max-w-4xl text-ivory/45">{pricing.disclaimer.value}</p>
          )}
          <p className="t-fine text-ivory/35">
            © {new Date().getFullYear()} {developer.entity.value}. {developer.tagline.value}
          </p>
        </div>
      </Container>
    </Section>
  );
}
