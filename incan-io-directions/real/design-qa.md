# Incan homepage design QA — external annotations and guided tour

final result: passed

## Findings and corrections

- [P2, fixed] Incus extended left of the community section. The earlier negative image margin placed the image 18px outside its section on desktop and 10px outside on phone. Removed negative margins and capped the image at its column width. Browser measurements at 1358px now put both left edges at 79px; the image also stays inside at 390px.
- [P2, fixed] Annotations were inside the code panel. Moved the code panel and explanatory aside into sibling grid columns. The code border ends before the notes; gold connectors cross the gap. On phones the notes sit below and outside the panel.
- [Requested interaction, implemented] The user suggested animating the code or using a ticker. A guided tour cycles three source/annotation highlights while all source text remains visible and copyable. Pause/Play and direct annotation selection work. Focus, hover, visibility, and offscreen state suspend automatic progression; reduced motion starts paused.
- [P2, fixed during this revision] Initial inactive-note opacity was .58, unnecessarily reducing readability. Raised it to .8. Separate hover and focus flags keep mouse departure from restarting rotation while keyboard focus remains inside.

No actionable P0/P1/P2 findings remain in the final captures.

## Source and comparison evidence

Source visual truth: `https://encero-systems.github.io/incan-pub-playground/assets/site/incan-io-directions/welcome-combined-community.webp`, corresponding local selected PNG `exec-e57e08c6-5434-4106-a860-583069553df2.png` (886 × 1775). The latest browser annotations on revision `95fcdac` explicitly supersede the mockup's enclosing annotation panel and protruding portrait. Smaller type, darker landscape, and canonical Incapunk header remain intentional changes requested in the preceding review.

Evidence under task checkout `qa/incan-io-tour/` (ignored, not deployed):

- Full comparison: `comparison.png` (1772 × 1781), selected visual left and revised HTML right, both at 886px width. Source raster 886 × 1775; implementation `reference-width.png` 886 × 1781, CSS viewport 886 × 1775, devicePixelRatio 1. Tour paused at Named data. Both opened together before assessment.
- Focused comparisons: `comparison-code.png` (1772 × 460) and `comparison-community.png` (1772 × 310). Each contains source and revised region at equal density without scaling. Crops use their respective section locations because the accepted smaller typography shifts vertical positions. Both opened and reviewed.
- Desktop: `desktop-final.png` (1358 × 1721), viewport 1358 × 915, density 1; `preview.png` viewport capture 1358 × 915.
- Tablet: `tablet.png` (768 × 1876), viewport 768 × 1024, density 1.
- Phone: `mobile.png` (390 × 2565), viewport 390 × 844, density 1. Opened and inspected; notes outside the code border and Incus contained.

The mockup has no tour interaction, so its static Named data state is compared against the same paused state in the HTML. Browser comments are the authority for the changed panel boundary and portrait containment.

## Comparison history

1. Prior revision `95fcdac`: smaller type, canonical header, background, gold paths and compact terminal had passed the earlier source comparison. The user identified two further geometry issues and suggested motion; those became the current blocking findings.
2. First revised capture `desktop.png`: external notes and contained portrait were correct. Readability review found inactive annotations too dim; hover/focus state review found one shared flag could incorrectly resume rotation. Both were corrected before final captures.
3. Final captures and combined source comparisons: no actionable P0/P1/P2 mismatch remains within the latest requested scope. The page preserves the approved welcome/code/start/tools/community hierarchy.

## Required fidelity surfaces

- **Typography:** Brawler and Exo 2 unchanged; code 16px desktop, 14px tablet, 12.5px phone. Annotation typography retains hierarchy and wraps without truncation. Inactive notes remain readable at .8 opacity.
- **Spacing/layout:** Code panel and annotations are distinct sibling columns, with 64px desktop gap and narrower tablet gaps. Notes move below on phones. Source code fits without horizontal scrolling at 768px; page body has no overflow at 390px or 1358px. Incus aligns with the section edge and stays within it.
- **Colors/tokens:** Existing Incapunk header, gold/cyan/teal palette and darkened hero retained. Tour uses a subtle source-row background, brighter active connector, and subdued inactive connectors. No flashing, moving text, or layout shift.
- **Images/assets:** Official logo and wordmark, generated landscape, transparent portrait and mist unchanged. Correct aspect ratios and sharpness preserved. Removing negative margins changes placement only. Paths remain library-rendered DOM connectors, not image substitutes.
- **Copy/content:** Source code and documented commands unchanged. Only “A closer look” and Pause/Play control labels added. No new language claims, sample packages or endorsement content.

## Browser verification

- Automatic progression observed from Named data to Typed functions after the 4.8-second interval.
- Pause switches to Play; direct Clear structure selection sets the current step, pauses, and navigates to its source anchor.
- Copy Incan example reports Copied; existing source text remains intact.
- Play followed by Project navigation stops progression while the source section is offscreen: current step remains Named data beyond a full interval.
- Desktop annotations are not descendants of `.code-panel`; phone notes are geometrically below the panel.
- Responsive connector rendering: six segments on desktop/tablet and zero on phone.
- Incus containment measured on desktop and phone; no page overflow.
- Browser console errors and warnings: none.
- JavaScript syntax, local HTML references/anchors, and Git whitespace checks passed before publication.

Reduced-motion behavior was checked in source and stylesheet; this browser does not expose motion-preference emulation, so it was not simulated. Compiler execution, production Incan.io integration and CI validation remain outside this static playground iteration.

## Implementation checklist

- [x] Contain portrait and preserve its full aspect ratio.
- [x] Place notes outside the code panel and reconnect source paths.
- [x] Add controllable, stationary-code guided highlighting.
- [x] Review matching-width source/prototype comparisons and responsive states.
- [x] Validate core tour and clipboard interactions without console errors.

## Follow-up polish

A real multi-example carousel could be added later using compiler-validated examples. The current tour deliberately works with the existing single example; no unverified snippets were introduced.
