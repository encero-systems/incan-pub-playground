# Responsive homepage hero QA

final result: passed

## Visual truth and comparison

The user's annotated 818 × 1077 viewport is the target: the fixed-height background band appeared detached beneath the hero copy. The prior committed homepage and stylesheet were served from an ignored QA snapshot with asset URLs made absolute; all original images were confirmed loaded. Source capture: `qa/hero-responsive/before-full.png` (744 × 1414 pixels). Implementation: `qa/hero-responsive/after-full.png` (744 × 1184 pixels). Both used the same observed 818 × 1077 CSS viewport and browser zoom/capture scale. No image was resampled relative to its pair. Document height changes intentionally with the responsive repair.

`qa/hero-responsive/comparison-full.jpg` places both entire rendered pages side by side, aligned at the top. `qa/hero-responsive/comparison-hero.jpg` compares equal 780px upper crops. Both final combined comparisons were opened and inspected. Previous footer QA is preserved in `design-qa-footer-compact.md`.

## Findings and repair

[P2, fixed] Below 940px the original hero added 280px of bottom padding and an opaque copy surface above a fixed-size background. At 818px this created a separate rectangular image band, including a blank strip on its left. The hero now uses a full-width decorative plate, positioned within one continuous warm surface, with a short feather at its upper edge. The tablet copy and search widths keep controls on the clear side of the art. At the reported viewport, hero height drops from about 692px to 440px.

The first implementation used a longer feather that softened too much of the sculpture's top. The feather was shortened from 28% to 12% and final captures were compared again. No actionable P0/P1/P2 issue remains in this scoped correction.

## Fidelity surfaces

- Typography: existing Brawler and Exo 2 retained. Tablet heading reduced to 58px to balance the art; wide desktop styles remain unchanged.
- Spacing: tablet artificial image-band padding removed; content and art share a single 440px hero. Phones retain a stacked flow with overlapping, blended imagery instead of a detached rectangular band.
- Colors: existing warm paper, gold and charcoal tokens retained. The plate blends into its surrounding paper surface.
- Assets: the original archive-hero.webp remains decorative and at its natural aspect ratio. No replacement graphic or new illustration was introduced.
- Copy: headline, description, search and catalog link remain unchanged. Footer and package content are preserved.

## Verification

Browser checks covered the reported 818 × 1077 CSS viewport, a narrow 354 × 767 CSS viewport and a wider 1163 × 727 CSS viewport. The narrow and wide screenshots are `qa/hero-responsive/phone.png` and `qa/hero-responsive/wide.png`; both were opened and inspected. No horizontal document overflow was observed. Temporary viewport overrides were reset. Browser warning/error logs were empty on the corrected homepage.

The authored Incan renderer built successfully and all ten existing checks passed, including static routes/assets and deterministic replay. The final template cache key was regenerated through the same renderer. Diff whitespace checks passed. The manual CI check workflow was not dispatched.
