# Shared masthead QA

final result: passed

## Source and comparison

The accepted homepage header is the visual truth for this scoped correction: `qa/header/home-before.png`, captured from the published Archive Hall page at desktop 1374 × 800, density 1. The original Archive Hall reference remains `assets/site/landing-directions/option-2.png`. The baseline package document is `qa/header/package-before.png` at identical viewport, theme and scroll state. Prior homepage QA is preserved in `design-qa-archive-hall.md`.

The before/after pages were inspected in one combined image input (`qa/header/full-before-after.jpg`). Focused comparisons show the initial mismatch (`qa/header/before-comparison.jpg`) and final home/catalog/package headers (`qa/header/after-comparison.jpg`). Header screenshots retain the first part of each page to show the boundary and surrounding context. `assets/site/header-consistency-preview.webp` exports the final comparison. Supplemental tablet comparisons: `qa/header/responsive-comparison.jpg`; phone search state: `qa/header/search-phone.png`.

## Findings and repair

[P2, fixed] Independent homepage markup/styles caused header height, wordmark placement, navigation and texture crop to differ on package documents. The desktop baseline was 68 pixels on home and 75 on package; compact layouts also diverged. A single authored HTML partial (`tools/site/templates/header.html`) and final shared stylesheet (`assets/site/header.css`) now supply all eight documents. Homepage-specific header overrides were removed.

The shared header preserves the accepted homepage geometry and quiet brass/charcoal crop. Search is a compact disclosure on every page, intentionally adding one consistently placed control. Its popover overlays content without changing header height. Catalog has the sole active-navigation color; state does not change geometry. Homepage and package heroes remain different page content by design.

## Required surfaces

- Typography: Brawler wordmark suffix and Exo 2 navigation; identical computed font sizes/line heights across all three page types. Official wordmark retained; `.pub` baseline, margin and size match.
- Spacing and layout: identical header, brand, suffix, search and navigation bounds on home/catalog/package at each tested viewport. Header is 68 pixels on desktop/tablet and 60 at compact widths. Desktop exact measurements are in `qa/header/measurements-desktop.json`; responsive measurements in `qa/header/measurements-responsive.json`.
- Colors: identical texture URL, crop, background color and border across routes. Intentional catalog active color is the only navigation state difference. Search uses legible opaque text against a dark surface.
- Assets: same existing wordmark and decorative masthead texture. No new generated imagery or package data.
- Copy: same Search, Catalog, Docs and GitHub labels and destinations. Shared summary has an explicit accessible label when its text is hidden on narrow screens. Package body, metadata, charts and install flow were preserved.

## Responsive and interaction evidence

Browser checked 1374 × 800, 1194 × 834, 768 × 1024, 390 × 844 and 320 × 800. All three page types matched at 320, 768 and 1194 widths; no horizontal document overflow. Compact search target is 44 × 44 pixels. Screenshots reviewed at desktop, landscape/portrait tablet and phone.

- Shared search opened with input focus, submitted from home/package into the catalog, and returned exactly one matching package.
- Escape closed the disclosure and restored focus to the summary. Clicking outside closed it.
- Catalog search filtered locally; license filtering produced the empty state, reset restored six rows, and another query produced one row.
- Popover stayed inside the compact viewport and did not resize the header. Browser console reported no errors during the final route checks.
- Authored Incan renderer compiled locally; all ten existing checks passed, including safe projection, escaping, highlighting, fixture replay and local route/assets checks. JavaScript syntax and diff whitespace checks passed.

A minimal string reassignment hit an already recorded Incan 0.5.1 emission defect (issue 1668); direct branch returns avoid it in authored Incan. No Rust workaround or new compiler issue was added. Triage evidence is retained in `qa/header/compiler-triage.md`.

No actionable P0/P1/P2 visual mismatch remains in this scoped masthead correction. The manual build-check CI workflow was not dispatched; publication uses the existing GitHub Pages mechanism.
