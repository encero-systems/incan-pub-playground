# Incan homepage QA — performance and deeper examples

final result: passed

## Findings and corrections

- The maintainer's intended 0.6/0.7 model governs this preview: Incan and Rust source live side by side in Oven-managed projects. Added that explanation below the examples and made the Rust tools link more prominent. The masthead labels the page as a 0.7 preview.
- Added a performance section with all eight existing README runtime measurements. Future build-speed and token-count goals carry separate target labels and no invented numbers.
- Expanded the carousel to nine items, adding iterator composition, a capability declaration excerpt and an Architect command sketch. Captions distinguish complete programs from feature previews.
- [P2, fixed before capture] Nine separate desktop tabs would crowd the existing controls. Four featured shortcuts plus the complete dropdown fit the existing row. Below 1101px, the dropdown replaces shortcuts.
- [P2, fixed] Split Architect's longer commands with shell continuations so its commands fit at 390px; repeated source and clipboard verification after the change.
- [P2, fixed] Hiding the performance heading's line break on mobile would join two sentences without a space. Added the space and inspected the final phone crop.

No actionable P0/P1/P2 website findings remain. Runtime and upcoming-feature validation limits are recorded below.

## Visual comparison evidence

Source: user-approved `7a90c43` page, freshly captured before edits as `qa/incan-io-performance/baseline.png`, 1358 × 1824. Latest implementation: `desktop-final.png`, 1358 × 2656. Both use CSS viewport 1358 × 915, density 1, top of page, Typed data selected, paused, cleared copy feedback. The additional content and thirteen-row source reserve intentionally increase page height.

Evidence in ignored local directory `qa/incan-io-performance/`:

- `comparison-final.png`, 2716 × 2656: matched full-page comparison, source left and final HTML right. Opened and inspected after loading the lazy community portrait.
- `comparison-code.png`, 2460 × 550: equal-density focused comparison of the source and updated code region. Opened and inspected. Original typography, border, outside-panel explanations and library-rendered connectors retained.
- `combinators.png`, `capabilities.png`, `architect.png`: 1358 × 915 viewport captures, opened and inspected. Architect was subsequently split into shorter shell lines; its final state appears in the inspected tablet and phone captures.
- `performance.png`, 1215 × 720: focused desktop section crop, opened and inspected. Tables and target labels are actual HTML.
- `768.png`, 768 × 2939, viewport 768 × 1024: final tablet capture, opened and inspected.
- `390.png`, 390 × 4183, viewport 390 × 915: final phone capture, opened and inspected. `phone-performance.png`, 390 × 1170, provides a readable focused crop of the benchmark section, also opened.
- `320.png`: smallest-width capture; all nine states measured for page and table overflow. Some code lines scroll inside their keyboard-focusable source block.

The first full capture omitted the still-unloaded lazy portrait. This was a capture-state issue: navigated to Project, confirmed natural image width 1159, returned to the matched top state and recaptured. Final comparison confirms portrait containment and the approved community background.

## Required fidelity surfaces

- **Typography:** Existing Brawler, Exo 2 and source font sizes unchanged. Performance heading inherits the existing gold display type; measured values use tabular numerals. No clipped controls or table columns at checked widths.
- **Layout:** Stable example bodies at 1358px (431.59375px), 768px (387.390625px) and 390px (641.25px). Two more reserved source rows support the longer composition example. Notes stay outside the border. At 320px, longer wrapped explanations can add about 4px; classified P3. Desktop/tablet performance uses two columns, phone stacks the narrative and table.
- **Colors:** Existing gold/cyan palette, canonical header, subdued artwork and fade retained. Measured-baseline and target labels are distinguished by wording and color.
- **Assets:** Official logo/wordmark, landscape, mist, portrait, Tabler icons and LeaderLine retained. No new raster assets or custom drawn diagrams.
- **Content:** Welcome remains language-first. Rust relationship follows the maintainer's forward direction. Historical runtime results are dated; build-time and token-count targets are not presented as measurements. Capability and Architect previews do not fabricate execution output.

## Verification and limits

- All nine examples selected at 1358, 768, 390 and 320px. Browser text matches each canonical file. Filenames, counts, dropdown values, captions and annotation destinations synchronize.
- Last-to-first and first-to-last wrap checked at all four widths. Manual selection pauses rotation. Exact clipboard contents match all three additions, including the final split Architect commands.
- No page or benchmark-panel overflow. Capability's longer signature scrolls inside the source block at 390px; some sources also scroll at 320px. Six connector segments remain on desktop/tablet after layout settles; paths hide on phone.
- Browser console errors/warnings: none.
- Existing 12-second rotation, pause guards and reduced-motion handling retained. Previous revision verified automatic advancement; no timing implementation changed here.
- JavaScript and shell syntax, example generation idempotence, active IDs, local references, Git whitespace and all eight benchmark rows checked.
- Seven complete programs pass installed Incan 0.5.1 type checking, including the new named-callback composition example. Capability declarations are supported by current-source fixtures and RFC 104, but the installed 0.5.1 parser rejects that newer declaration form. No development-compiler run is claimed. Architect commands follow RFC 105; installed 0.5.1 has no Architect command. Both previews are labeled accordingly.
- Existing benchmark measurements are copied from the README, not rerun. Date comes from `workspaces/benchmarks/results/results.md`. Future build speed and token comparisons require measurements before production release.
- Native execution remains unverified due to the existing Oven store integrity failure recorded in the prior revision. This task did not repair the store. Production Incan.io and compiler sources are unchanged; no authored Rust was added.

## Implementation checklist

- [x] Correct the future Rust relationship and keep the welcome language-first.
- [x] Add source-backed runtime comparison and clearly labeled future targets.
- [x] Add richer examples with accurate preview captions and working controls.
- [x] Inspect matched full/focused comparisons and responsive views.
- [x] Record measured evidence separately from future language/tooling validation.

## Follow-up polish

P3: at 320px, longer explanations can add approximately 4px during a switch. Refresh runtime results and add versioned build-time/token measurements before a production 0.7 launch. This is a design preview, not a release announcement.
