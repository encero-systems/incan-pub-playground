# Incan homepage QA — rotating examples

final result: passed

## Findings and corrections

- [Requested interaction, implemented] Replace the single example's guided highlighting loop with three distinct complete programs: Typed data, Collections, Pattern matching. Each has its own filename, syntax colors, source callouts and explanations.
- [P2, fixed during this revision] Consecutive source anchors made the original short connector ends nearly vertical. Connector bend widths now adapt to the vertical distance and available space, preserving readable angled lines across all three examples.
- [P2, fixed during this revision] The collection comprehension initially required horizontal scrolling at 390px. Reflowed it as a multiline comprehension while keeping the example at nine lines. It now fits the 352px source viewport. Its final version again passes type checking and code emission.
- Existing portrait containment, outside-panel notes, subdued hero, canonical Incapunk header and compact terminal are preserved.

No actionable P0/P1/P2 website findings remain. Native execution of the example programs remains unverified, as recorded separately below.

## Source and comparison evidence

Primary visual baseline: the user-reviewed `7167612` homepage, captured in `qa/incan-io-tour/desktop-final.png` (1358 × 1721). Public baseline: `https://encero-systems.github.io/incan-pub-playground/incan-io-directions/real/?v=7167612`. Original selected artwork remains `welcome-combined-community.webp` at 886 × 1775, but the user's later feedback explicitly requests the changed header, scale, contained portrait, outside-panel annotations and now multiple examples.

Evidence under `qa/incan-io-examples/` (ignored, not deployed):

- Full paired comparison: `comparison.png` (2716 × 1769), baseline left and revised HTML right. Both captures use CSS viewport 1358 × 915, density 1, top of page, Typed data selected, paused, Copy feedback cleared. The new selector/control row adds 48px to the full-page height: revised `desktop-final.png` is 1358 × 1769. Both full and focused paired comparisons were opened before passing QA.
- Focused comparison: `comparison-code.png` (2460 × 420), respective example regions from the same two captures, equal density without rescaling. This verifies that typography and code geometry are preserved while selectors and rotation controls are added.
- All three desktop states: `example-1.png`, `example-2.png`, `example-3.png`, each 1358 × 915 viewport capture, density 1. Opened and inspected, including the final multiline collections source and matching callouts.
- Tablet captures: `768-1.png`, `768-2.png`, `768-3.png`, 768 × 1924 full-page captures, CSS viewport 768 × 1024, density 1. All three source blocks fit their 463px viewport without scrolling in the measured test. The reflowed collection source is shorter than the already-fitting original at this width.
- Phone captures: `390-1.png`, `390-2.png`, `390-3.png`, 390 × 2701 full-page captures, CSS viewport 390 × 844, density 1. Final collections phone capture opened and inspected. Controls wrap cleanly and all three programs fit at 390px. At 320px the page and controls still fit; the source may scroll within its own preformatted block.

The comparison uses the same default example and pause state. The new selector row is an intentional addition, rather than a mismatch. Other page regions retain their geometry and styling apart from the additional row's vertical displacement.

## Comparison history

1. Revision `7167612` passed the earlier comparison after containing Incus and moving notes outside the panel. The user requested more examples.
2. Initial carousel captures showed overly steep connector endings for the new anchor positions and a small collection-code overflow at 390px. The bend algorithm and source formatting were corrected.
3. Final paired comparisons and all three desktop states show stable source-panel height, correct callouts and unchanged brand/layout. Phone collection source fits after reflow. No actionable P0/P1/P2 website finding remains.

## Required fidelity surfaces

- **Typography:** Existing Brawler, Exo 2 and monospace sizes retained. Syntax highlighter derives markup from source files; numbers use the established warm palette. Controls remain secondary to the code. No truncation of filenames, controls or notes in inspected states.
- **Spacing/layout:** A compact selector row sits above the code. All three example bodies measure 322.6875px desktop, 292.171875px tablet, and 556.25px phone in the tested states. Nine source rows per program and a minimum mobile note height avoid content jumps during rotation. Notes remain outside the bordered code panel; Incus remains contained.
- **Colors/tokens:** Gold, cyan, teal and canonical Incapunk header unchanged. Selected-example buttons have a subdued cyan surface/border; focus outlines remain visible. Fade is 280ms and disabled for reduced-motion users; no typing animation or flashing.
- **Images/assets:** Official branding, landscape, portrait, mist and existing Tabler icons retained. Previous navigation uses the existing arrow icon reversed. Callout paths remain library-rendered and attached to actual source/note spans.
- **Copy/content:** Three self-contained, nine-line Incan programs replace one repetitive guided loop. Filenames and explanations update together. Source files are authoritative, templates/metadata are generated, and browser text and clipboard contents were compared with those sources. No new ecosystem availability or release claims added.

## Browser and source verification

- Direct selectors, previous/next, last-to-first wrap, and arrow-key navigation checked.
- Automatic advancement observed from hello.incn to a later program while the section was visible and focus was elsewhere. Manual selection and note links pause rotation; Pause/Play updates its accessible label.
- Existing focus, pointer, hidden-document and viewport guards retained. Reduced-motion starts paused and suppresses the fade in code; the browser does not expose motion-preference emulation, so this preference was not simulated.
- All three source texts match their canonical `.incn` files; clipboard readback matches all three after waiting for successful copy completion. Switching examples resets stale Copy feedback.
- Six connector segments remain on desktop/tablet; no connector segments on phone. Annotation links point to the active example's source rows.
- Tested all three states at 1358px, 768px, 390px and 320px. No page-body or persistent-control overflow.
- Browser console errors/warnings: none.
- JavaScript syntax, generation idempotence, local references, and Git whitespace checked before publication.
- All final source files pass `incan --no-banner check` and `incan --no-banner --emit-rust` with installed Incan 0.5.1.
- Native run attempted in a separate temporary directory. It failed before executing the example with `manifest identity does not match its immutable content` in the existing Oven store. That store was not repaired or cleared by this task. Native outputs and the separate project-command sequence are not claimed verified. Production Incan.io and compiler sources are unchanged; this task adds no authored Rust.

## Implementation checklist

- [x] Generate three highlighted examples and matching annotations from canonical source files.
- [x] Add controllable rotation, direct selection, wraparound and keyboard navigation.
- [x] Pause for reading/interaction and honor reduced motion.
- [x] Keep layout stable and copy the active source exactly.
- [x] Inspect paired visual comparisons and responsive states.
- [x] Record the native-execution limitation independently of website QA.

## Follow-up polish

No further visual change is required for this iteration. Additional examples can use the same source/generator contract after focused compiler checks. Native execution can be rechecked when the Oven store integrity issue is resolved.
