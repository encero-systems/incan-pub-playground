# Forge light — annotated follow-up

Date: 2026-10-07. Scope: global header, brand suffix, install button and metadata dates. Prior QA retained in `design-qa-forge-initial.md`.

## Findings and fixes

- [P2, fixed] The first Forge pass used a flat green-charcoal global header instead of the reference's brown forged material and angled gold edge. Added an actual generated raster header texture and the reference's search icon. Global header navigation remains Catalog/Docs; the user clarified that top-bar styling was the requested change. Desktop package navigation remains on the left.
- [P2, fixed] `.pub` was too large and optically misaligned with the official image wordmark. Reduced it from 25 to 18 px on desktop and from 22 to 16 px on small screens, removed the old top padding, and aligned its lower edge with the wordmark. This explicitly overrides the generated reference's larger suffix.
- [P2, fixed] Install button lacked the plus icon, luminous brass surface and reference proportions. Added a standard Phosphor plus image, actual generated brass texture, brighter border and 47 px desktop height. Moved the desktop button left to clear the existing masthead's diagonal material seam. Native text/control behavior remains HTML.
- [P2, fixed] Stacked labels/dates left unused metadata space. Dates now align to their label on the same row, with compact spacing. The original reference stacks them; the user's annotated request takes priority.
- [P2, fixed during responsive QA] New angled header edge was too close to Docs/Search at intermediate widths. Reserved additional right-side clearance on tablet and narrow headers and recaptured both states. No control text intersects the gold edge in the final captures.

## Evidence and comparison

Source visual target: `assets/site/visual-directions/option-2.png` (1487 × 1058). User annotations: supplied `50E891ED-2346-4394-B870-C1F28D9B81A3/1-Pasted-Image-1.jpg`; inspected as feedback, not treated as a pixel-geometry target because it contains iPad browser chrome and annotations.

Final rendered implementation: `assets/site/forge-polish-preview.png` / ignored `qa/forge-polish-desktop-final.png`. Browser viewport 1487 × 1058 CSS px; captured image 1487 × 1058 px, density 1. The unframed source already has the same dimensions, so no scaling or density normalization was applied. State: regex latest manifest, light theme, initial scroll position, closed install dialog, loaded fonts.

The source and revised render were placed together in `qa/forge-polish-comparison.jpg`, opened and inspected. Focused same-image comparisons were also opened for the header (`qa/forge-polish-header-comparison.jpg`), button (`qa/forge-polish-cta-comparison.jpg`) and metadata (`qa/forge-polish-metadata-comparison.jpg`). These artifacts are local QA evidence, not new product UI.

Iteration history: `qa/forge-polish-before-header.png` shows the smaller suffix and compact date rows before the header asset. The first button correction retained a flat gold fill; the final capture uses its brass image texture. Landscape QA exposed edge/control proximity; updated right clearance is shown in `qa/forge-polish-ipad-final.png`, `qa/forge-polish-portrait-final.png` and `qa/forge-polish-phone-final.png`. The final desktop full-view and focused comparisons were regenerated and inspected after the brass texture and button placement corrections.

## Required fidelity surfaces

- Typography: Brawler/Exo 2 preserved. Smaller suffix is intentional user feedback; display/body/code families remain unchanged. Actual author README text and code remain intact.
- Spacing/layout: header search starts at the reference's approximately 276 px desktop position; optical wordmark alignment improved; button has compact proportions and avoids the material seam; dates share their label row. Responsive right clearance prevents decoration competing with controls.
- Colors/tokens: warm brown-charcoal header, antique gold edge, lit brass button and warm paper body. Original scoped syntax token colors remain intact.
- Images: official supplied logo retained. Header and button are real generated raster textures, inspected before insertion. Standard plus/magnifying-glass images come from Phosphor Icons Core 2.1.1; MIT license is bundled. No CSS/handwritten SVG replacement for these assets.
- Copy/content: only editable UI composition changes; exact package descriptions, author documentation, feature declarations, dates, chart data and absence states remain preserved. Source mockup's abbreviated README, illustrative features and smooth native-registry trend remain intentional data deviations documented in the earlier QA.

## Verification and checklist

- Local authored Incan renderer/Oven build passed; all 9 existing checks passed, including initial HTML/local assets, deterministic byte replay, chart/document digests, syntax highlighting and HTML-comment handling.
- Browser sizes: 1487 × 1058, 1194 × 834, 768 × 1024 and 390 × 844. No page-wide overflow in inspected states. Responsive browser testing only; physical iPadOS/Safari was not available locally.
- Search for memchr from the package header navigated to `/?q=memchr` and left exactly memchr visible in the catalog. Updated install button opens the correct modal; Escape closes it. Accessible name remains Add to project despite the decorative icon.
- Browser console captured no errors. New textures were present in computed styles; icon images loaded.
- Existing reduced-motion gating remains unchanged. No ambient animation added.
- `git diff --check` passed.

No unresolved P0/P1/P2 findings in this follow-up scope. P3: the generated header has a slightly broader corner angle than the reference; material placement and control clearance are correct.

final result: passed
