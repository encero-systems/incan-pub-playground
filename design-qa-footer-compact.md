# Compact brown footer QA

final result: passed

## Visual target and comparison

The user requested a much smaller logo, less vertical space and a brown footer, then approved the rendered direction. The source is the initial shared footer capture `qa/footer-compact/before.png`; implementation is `qa/footer-compact/after.png`. Both captures are 818 × 1077 pixels at the same observed 818 × 1077 CSS viewport, with no density resampling. Both are anchored at the document bottom, so earlier content moves vertically as the footer shrinks. `qa/footer-compact/comparison.jpg` combines both viewport captures; `qa/footer-compact/footer-comparison.jpg` combines equal-scale lower 450px crops. Both were opened and inspected. Previous footer QA is retained in `design-qa-footer-initial.md`.

## Findings and changes

The original oversized logo and tall light footer are resolved. At the comparison width, the wordmark shrank from 91px to 56px and footer height from approximately 433px to 165px. Retaining four compact columns down to 760px avoids the earlier premature two-column layout. The repeated brand tagline was removed; existing navigation, copyright and preview information remain.

- Typography: Exo 2 links and Brawler suffix retained; smaller official wordmark with proportional .pub, readable 12px links and secondary 10px information.
- Spacing: reduced padding, column/row gaps and bottom rule spacing. Smaller screens retain grouped navigation, with project links wrapping in one shared row beneath the registry/ecosystem columns.
- Colors: solid dark brown #30271f, warm light link text, muted brass headings and thin rules. Existing header and main content styling remain untouched.
- Assets: original wordmark at its natural aspect ratio, no replacement drawings or new imagery.
- Copy: only the redundant Open source, clearly tagline was removed. About, Incan.io, documentation, community, publishing, reporting limitations and copyright remain intact.

## Verification

The combined desktop comparison has no remaining actionable P0/P1/P2 issue in this scope. A narrow-screen browser check recorded a 354 × 767 CSS viewport, approximately 370px footer height and no horizontal document overflow; `qa/footer-compact/phone.png` was opened and inspected. The reporting control opened its existing native dialog and Close dismissed it. Browser warning/error logs were empty. The temporary viewport override was reset.

The canonical Incan renderer built successfully and regenerated all eight documents. All ten existing checks passed, including deterministic replay, local routes/assets, escaping and highlighting. Diff whitespace checks passed. No new reporting destinations or submission behavior were introduced. The manual CI check workflow was not dispatched.
