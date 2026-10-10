# Catalog footer placement QA

final result: passed

## Finding and repair

[P2, fixed] The catalog ended before the viewport bottom on tall screens, leaving the page background visible beneath its footer. The catalog now uses a viewport-height flex column; its main content absorbs spare height while the header and compact footer retain their natural heights. Long pages continue to scroll normally. The change is scoped to the catalog body class and generated through the authored Incan renderer.

## Visual comparison

At the same observed 1745 × 1272 CSS viewport, the original footer bottom was 1152.39px; the corrected footer bottom is 1272.73px (fractional viewport/zoom rounding). The existing package rows, typography, colors, assets and footer content are preserved. The paired 1745 × 1272 captures are `qa/catalog-footer/before.png` and `qa/catalog-footer/after.png`. Their combined `comparison.jpg` was opened and inspected. The earlier homepage hero QA is preserved in `design-qa-hero-responsive.md`.

## Verification

- All six results, one Unlicense result and zero Direct publication results keep the footer at the tall viewport bottom.
- Reset restores all six results.
- At the observed 354 × 767 CSS phone viewport, the footer follows the 1515px document without covering content; no horizontal document overflow was observed. The table retains its existing horizontal scrolling region. `qa/catalog-footer/phone.png` was opened and inspected.
- Browser warning/error logs were empty. Temporary viewport overrides were reset.
- The Incan renderer built successfully; all ten existing checks passed, including deterministic replay and static routes/assets. Diff whitespace checks passed. No actionable P0/P1/P2 issue remains in this scoped repair. The manual CI check workflow was not dispatched.
