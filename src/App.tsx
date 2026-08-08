import { Header } from './components/layout/Header.tsx';
import { MobileCTABar, MobileCTASpacer } from './components/layout/MobileCTABar.tsx';
import { LeadDrawerProvider } from './components/lead/LeadDrawerProvider.tsx';
import { Hero } from './components/sections/Hero.tsx';
import { Promise } from './components/sections/Promise.tsx';
import { Residences } from './components/sections/Residences.tsx';
import { Lifestyle } from './components/sections/Lifestyle.tsx';
import { Amenities } from './components/sections/Amenities.tsx';
import { Location } from './components/sections/Location.tsx';
import { Developer } from './components/sections/Developer.tsx';
import { ClosingCTA } from './components/sections/ClosingCTA.tsx';
import { RegulatoryStrip } from './components/sections/RegulatoryStrip.tsx';

/**
 * PHASE 3 — the complete property story.
 *
 * The order is an argument, not a menu. Each section answers the question the
 * previous one raises, and the visitor is invited to visit at four points along
 * the way rather than at every paragraph:
 *
 *   Hero          what is this, and where          → CTA
 *   Promise       why space is the proposition
 *   Residences    what you would actually live in  → CTA
 *   Lifestyle     what is outside the window
 *   Amenities     what the campus gives a family   → CTA
 *   Location      how it connects                  → CTA
 *   Developer     who is behind it
 *   Closing       the invitation                   → CTA
 *   Regulatory    what you can check
 *
 * Still to come: the lead form itself, the secure submission endpoint, and
 * analytics. The drawer opens and traps focus today but cannot be submitted —
 * a form that appears to work while dropping leads is worse than none.
 */
export default function App() {
  return (
    <LeadDrawerProvider>
      <a
        href="#main"
        className="t-button sr-only bg-forest px-6 py-4 text-ivory focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
      >
        Skip to content
      </a>

      <Header />

      <main id="main">
        <Hero />
        <Promise />
        <Residences />
        <Lifestyle />
        <Amenities />
        <Location />
        <Developer />
        <ClosingCTA />
      </main>

      <RegulatoryStrip />
      <MobileCTASpacer />
      <MobileCTABar />
    </LeadDrawerProvider>
  );
}
