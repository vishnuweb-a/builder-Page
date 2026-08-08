# Assets

Provenance is the organising principle here, not file type. On a page whose
job is trust, the difference between an actual ATS render and an illustrative
image must never be ambiguous at a glance.

```
assets/
├── images/
│   ├── project/          ATS-originated. Safe to present as the project.
│   │   ├── renders/      Architectural renders (exterior, pool, landscape, interiors)
│   │   ├── plans/        Floor plans + isometric cutaways, Type A / Type B
│   │   └── site/         Site plan, landscape layout, location map
│   └── illustrative/     NOT the project. Must carry a visible caption if ever used.
├── logos/                ATS + Kingston Heath marks
└── icons/                Inline SVG, hairline style, matching the brochure
```

## Rules

1. **`project/` is for ATS-originated imagery only.** Anything in here may be
   shown without a qualifier, subject to the standard artist's-impression
   disclaimer (`disclaimers.imagery` in `src/content/project.ts`).
2. **`illustrative/` is empty and should stay that way** unless marketing
   supplies approved lifestyle imagery. Generic stock added merely to fill a
   layout is what makes a page look templated — and misrepresents the product.
3. **Do not copy the brochure's stock lifestyle photography here.** The
   brochure's licence covers print, not this website. Pages 1–5, 8–11 and 28 of
   the brochure are licensed stock and are excluded pending confirmation.
4. **No duplicates.** One source file per asset; responsive variants are
   generated at build time, not committed by hand.

## Fonts

Not stored here. Cormorant Garamond and Manrope are vendored through npm
(`@fontsource/*`) and emitted as self-hosted, content-hashed woff2 at build
time — no Google Fonts CDN request at runtime. See `src/index.css`.

## Source imagery

Eleven usable project visuals were identified in the brochure during research.
The highest native resolution among the renders is 1395×926, which is below
what a full-bleed desktop hero needs; the hero is therefore art-directed as a
contained editorial frame. Originals have been requested from ATS.

### Renders vs. drawings

The two kinds of asset came out of the PDF by different routes, and it matters:

- **Renders** (pool deck, green lawns, campus aerial) are embedded bitmaps.
  1395px is all there is, and no amount of processing will produce more.
- **Drawings** (both floor plans, the site plan, the location map) are *vector*
  artwork. They have no embedded bitmap at all, so they were rasterised from
  the page geometry at 500 dpi and downscaled. That is why the floor plans are
  sharp enough to read at 1600px inside the dialog while the renders are not,
  and why re-exporting them larger is possible later if it is ever needed.

The drawings are drawn on white paper. Each is tinted so pure white lands on
`--ivory-raised` (#FAF8F3), which is what stops a plan from sitting in a
glowing white box on an ivory page. The tint is a linear per-channel scale
rather than a threshold, so antialiased line edges pick up no halo.

### Still missing

- **The Kingston Heath wordmark.** It appears on the brochure cover and on the
  location map as artwork, but no usable logo file has been supplied. The
  header therefore sets the project name in type. Request the mark from ATS.
- **Interior renders.** docs/design.md §8 asks for living room, master bedroom,
  family lounge and kids' bedroom visuals. The brochure's interior photography
  is licensed stock (pp. 8–11) and is excluded. Until ATS supplies interior
  renders, the residences are communicated by drawing and dimension — which is
  honest, and is why the floor-plan dialog matters as much as it does.
