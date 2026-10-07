# Forge light — continuous header artwork

Date: 2026-10-07. Scope: correct the angled gold artwork at the global-header/package-masthead boundary. Prior reports remain in `design-qa-forge-polish.md` and `design-qa-forge-initial.md`.

## Finding and correction

[P2, fixed] The separately generated header strip had a different seam position and slope from the masthead. The user identified the visible discontinuity in the supplied `B95E78DA-7503-48F2-857D-6EB869B702BD/1-Pasted-Image-1.jpg`. The previous report understated this as a minor angle difference; it was a material join defect.

Both surfaces now use the existing `forge-masthead.webp` at the same width and 500 px scene height. The masthead starts at the negative global-header height, so the same source pixels continue across the boundary. Header height is 75 px on desktop and 104 px in the existing wrapped mobile layout. The ordinary horizontal UI divider remains. The independently generated `forge-header.webp` remains historical and is no longer referenced by CSS. The CSS query version advances to `forge-3` on the catalog and all six package documents.

## Visual evidence

Source: `assets/site/visual-directions/option-2.png`, 1487 × 1058. Final render: `assets/site/forge-continuous-preview.png`, captured at 1487 × 1058 CSS px and density 1 with loaded fonts, initial scroll position, regex latest manifest and closed install dialog. No normalization was needed. The user screenshot contains browser chrome and annotations; it is feedback evidence, not an exact pixel target.

Opened and inspected `qa/seam-comparison.jpg`, placing the source, previous published render and corrected render in one image. Also inspected `qa/seam-join-comparison.jpg`, the corresponding right-side header/masthead crops. The new seam is continuous; the old independent diagonal visibly jumps at the boundary. QA images under `qa/` remain local and ignored.

Reference deviations already requested by the user remain: smaller `.pub`, compact date rows, actual complete author README and exact quantitative charts. The source's clipped header-divider corner is not replicated as a second decorative seam; the shared raster supplies the continuous material line.

## Fidelity checks

- Typography: Brawler and Exo 2 retained; existing code fonts and syntax colors retained.
- Layout/spacing: header dimensions match the scene offsets; existing brand, search, navigation, install button and three-column article retain their positions.
- Colors/images: original charcoal/gold raster retained, with no new generated artwork or CSS imitation. The gold seam stays clear of global navigation at inspected widths.
- Content: package records, README, metadata, chart assets and install text unchanged.

## Verification

- Local Incan/Oven build passed. All 9 existing checks passed, including deterministic byte replay, frozen documentation/chart digests, syntax highlighting and HTML-comment handling.
- Browser captures inspected at 1487 × 1058, 1280 × 860, 1194 × 834, 768 × 1024 and 390 × 844. Header/masthead offsets are 75/75 px or 104/104 px; no page-wide horizontal overflow in these states. This is responsive browser testing, not physical iPadOS/Safari testing.
- Narrow install button opened the correct accessible dialog, and Close dismissed it. Dependencies anchor landed below the sticky 104 px header at approximately 142 px. Header search for memchr opened the catalog with exactly one visible package. Browser console captured no errors.
- Existing reduced-motion behavior preserved; no new animation or script introduced.

No unresolved P0/P1/P2 findings in this correction scope.

final result: passed
