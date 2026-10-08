# Incan homepage QA — six rotating examples

final result: passed

## Findings and corrections

- Added enums with data, optional values and explicit error handling to the existing three programs. Each source has matching syntax colors, filenames and outside-panel explanations.
- Reserved eleven source rows so longer programs do not shift the page during rotation. The original font sizes are retained.
- Replaced the six selectors with a native dropdown below 941px, keeping the existing previous/next and Pause/Play controls.
- [P2, fixed] The error message initially overflowed the 390px source viewport. Shortened it to “Must be positive” and repeated type checking, code emission and browser copy verification.

No actionable P0/P1/P2 website findings remain. Native execution remains unverified, as recorded below.

## Source and visual comparison

Baseline is the user-approved three-example revision `9f34c62`, captured in `qa/incan-io-examples/desktop-final.png` at 1358 × 1769. The original selected artwork remains `welcome-combined-community.webp`; later user feedback is authoritative for the header, scale, outside-panel notes and rotating examples.

Evidence in ignored local directory `qa/incan-io-six-examples/`:

- `comparison.png`: 2716 × 1824, accepted baseline left and updated page right. Both use CSS viewport 1358 × 915, density 1, top of page, Typed data selected, paused, Copy feedback cleared. Opened and inspected.
- `comparison-code.png`: equal-density cropped source regions, 2460 × 475. Opened and inspected. The extra two source rows add about 55px to the page; this is intentional and keeps transitions stable.
- `desktop-final.png`: 1358 × 1824. Brand, hero, compact terminal, tools and contained Incus retain the approved design.
- `example-4.png`, `example-5.png`, `example-6.png`: 1358 × 915 captures of the new programs, opened and inspected. The error example was subsequently shortened to fix its phone overflow; its final phone state was inspected.
- `768.png`: 768 × 1972, viewport 768 × 1024. Opened and inspected. Dropdown, callouts, source and existing page layout remain readable. Captured before the shorter error string, which does not alter geometry.
- `390.png`: final 390 × 2744 phone capture, viewport 390 × 844. Opened and inspected. All six sources fit at this width. Notes stack below the source and the chooser fits above it.
- `320.png`: smallest-width capture. All six states measured without page overflow; some source lines scroll within their own preformatted block at this width.

## Fidelity surfaces

- **Typography:** Brawler, Exo 2 and source-code sizes preserved. Controls remain secondary to the code. No truncated notes or selectors in inspected states.
- **Layout:** All six bodies measure 377.1875px desktop, 339.796875px tablet and 598.75px phone. Longer source programs do not change panel height. Notes remain outside the border and Incus remains contained.
- **Colors:** Existing gold/cyan palette, canonical header and 280ms fade retained. Reduced-motion starts paused and suppresses the fade in source; motion preference was not emulated by this browser.
- **Assets:** Official branding, landscape, mist, portrait, Tabler icons and local LeaderLine retained. No new raster assets or dependencies.
- **Content:** Six compact programs and explanations are generated from canonical sources and metadata. Selectors, dropdown options and count are also generated from the same example list. No new release or ecosystem availability claims.

## Verification

- All six desktop sources match their canonical `.incn` files. Clipboard contents for the three additions match the final source files; the original three had passed clipboard checks in the preceding revision.
- All six examples selected at 1358px, 768px, 390px and 320px. Active filename, count, dropdown selection and annotation destinations remain synchronized.
- Last-to-first and first-to-last wrap checked on tablet and both phone widths. Native dropdown selection pauses rotation. Native select arrow handling is preserved.
- Six connector segments on desktop/tablet after layout settles; none below 741px. Annotation destinations resolve to the active source.
- No page overflow. At 390px all sources fit after the correction. At 320px horizontal source scrolling is contained within the preformatted block.
- No browser console errors/warnings.
- The existing 12-second timer, pointer/focus/offscreen/hidden-document guards, Pause/Play and reduced-motion handling remain unchanged. Automatic advancement and desktop arrow navigation were verified in the previous revision.
- JavaScript syntax, generation idempotence, active IDs, local references and Git whitespace checked before publication.
- All six programs pass type checking and Rust emission with installed Incan 0.5.1; the final shorter error message was checked again.
- The previous native run attempt failed before execution with `manifest identity does not match its immutable content` in the existing Oven store. This task did not repair that store or retry the unchanged failure. Native outputs and the project command sequence remain unverified. Compiler and production Incan.io sources are unchanged; no authored Rust was added.

## Implementation checklist

- [x] Expand to six distinct highlighted examples with matching explanations.
- [x] Keep source height stable and preserve the approved font scale.
- [x] Add a compact chooser for smaller screens.
- [x] Verify exact source copies, selection synchronization and wraparound.
- [x] Inspect matched desktop comparisons and responsive captures.
- [x] Preserve the native-execution limitation independently of website QA.

No further visual repair is required for this iteration.
