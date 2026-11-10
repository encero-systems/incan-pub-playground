# Comparison mockup design QA

Source visual truth: ../../comic/approval/field-test-target.png
Implementation screenshots: ../../comic/approval/field-test-overview.png, compactness-desktop.png, speed-desktop-final.png, overview-phone-final.png.

Viewport: 1402 x 1122 CSS pixels, source PNG 1402 x 1122. Browser full-page captures are 1402px wide at 1x density. The desktop component crop is 1280 x 1168; it is contained without distortion in the source-size canvas for side-by-side inspection. Full-view comparison: ../../comic/approval/field-test-comparison.png. Focused readable-text panel comparison: ../../comic/approval/field-test-focused.png. State: Nested orders, Overview, first format page, paused for inspection. Additional states: Compactness, Speed decode, Speed encode and mobile paging.

## Findings

No actionable P0, P1 or P2 findings remain. All important controls are functional, figures are readable, the phone layout has no horizontal overflow, and the character is visible when scrolled into view.

## Comparison history

1. Initial capture: the 1080px spread, figures and character were too small [P1]. Expanded the spread to 1280px and enlarged the character and metric typography. Before evidence: overview-first-aligned-comparison.png.
2. The refined side-by-side still showed small heading/format labels [P1], missing angled label plates [P2] and a rectangular speech backdrop [P2]. Applied the approved Bangers/Barlow scale, live caption plates and a generated oval speech balloon. After evidence: final-comparison.png and focused-comparison.png.
3. Phone review found a tight Compactness label and texture behind figures [P2]. Reduced only the narrow-screen tab size and confined the texture to the panel edge. Final evidence: overview-phone-final.png.
4. Speed panels were bottom-aligned beside the narrator, leaving an unnecessary gap above the results [P2]. Top-aligned the results. Final evidence: speed-desktop-final.png.

## Required fidelity surfaces

- Fonts/typography: approved local Bangers and Barlow are loaded. Desktop heading 68px, metric labels 21px and figures 24px; phone figures 16px. No clipped tab labels or metrics at 320px. Approved logo images are used unchanged.
- Spacing/layout: three-view hierarchy, common ticker, two measurement groups, fixed leading format and neighbouring formats follow the target. The module fits the existing site's chapter frame. Desktop shows three columns; phone shows the leading format and one rival. Character and speech are below the phone panels.
- Colors/tokens: existing ink, cream, amber and teal tokens retained. Halftone is behind the narrator and at panel edges, away from the numbers. Selected controls remain readable.
- Image quality: new Incus stopwatch/notebook pose and empty speech balloon use generated transparent PNGs; alpha compositing checked in browser. Existing brand marks, navigation-arrow SVG and halftones reused. Live text and figures remain selectable HTML.
- Copy/content: the selected three lenses and separate text/binary metrics are retained. Chapter numbering follows Edition 03's order. Original reported token counts replace the mock's initial values; the other figures remain centrally editable. No test-data labels or caveats were added to the visualization.

## Interactions and checks

- All 12 combinations of four workloads and three views passed at 1402px.
- Changing views retains the workload; changing workloads retains the encode/decode phase. Paging updates the visible formats and result captions while keeping .COMIC/Crumb fixed.
- Encode and decode display their corresponding values in both groups.
- Enter activates the view button and updates its pressed state.
- Explicit Play advanced the ticker during observation; Pause returned the control to Play. Runtime pauses for focus, hover, page visibility and reduced motion. Forced reduced-motion preference was not emulated in this browser check.
- Widths 320, 390, 700 and 1402 have no horizontal overflow in tested states. Phone artwork visibility was checked by actual scrolling, in addition to full-page capture.
- Explore the workloads opens the existing Benchmarks page, and Back returns to Edition 03.
- Browser console: zero errors. Local font availability checked. Both native site builds passed.

## Follow-up polish

P3: the existing chapter frame, accessible text Play/Pause controls, chapter number 04 and actual approved logo proportions intentionally differ from the generated reference. The tables retain straight internal grids for numerical alignment; stronger outer-panel tilt can remain an optional stylistic refinement.

## Implementation checklist

- [x] Required fidelity surfaces reviewed in combined and focused comparisons.
- [x] Earlier P1/P2 findings resolved with post-fix evidence.
- [x] Browser interactions, phone rendering and console checked.
- [x] Existing editions and unrelated page outputs preserved.

final result: passed

## Compactness case-file restoration

Source visual: the original scoreboard mockup, `comic/approval/original-1-scoreboard.png`. The pose and table-left/character-right composition are restored within the selected shared three-view shell. New transparent artwork is `assets/incus-case-file.png`; it is distinct from the stopwatch/notebook asset.

Evidence: case-file-desktop.png, case-file-phone.png and case-file-comparison.png under comic/approval. Desktop capture uses 1487 x 1058 CSS pixels, 1x density; component crop is 1280 x 1034. Original mock is 1487 x 1058; the side-by-side board contains the component without distortion. Phone capture uses 390 x 844, component 358 x 1308. Additional 320 and 700 CSS-pixel widths have no horizontal overflow, and the case-file artwork remains displayed.

Required surfaces: original local fonts/colors retained; table-left/portrait-right layout restored; figure is a generated PNG with transparency verified in the browser; no metrics or data-status copy changed. The caption is moved clear of the table edge. Switching to Overview hides the case-file image and restores the stopwatch image. New alt text describes the folder pose. Console errors: none. Native public and local-mirror builds passed.

All scoped findings are resolved. Speed's existing artwork/mobile behavior is outside this restoration.

final result: passed
