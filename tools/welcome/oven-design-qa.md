# Oven implementation design QA

## Reference and captures

Approved reference: `incan-io-directions/oven-concepts/05-benchmarks.png` (805 × 1954). Live page: `incan-io-directions/obsidian-incan/oven.html`.

Final screenshots: `incan-io-directions/obsidian-incan/qa/oven-desktop.png` (1440 × 3088) and `oven-mobile.png` (390 × 4472). Browser viewport checks: 1440 × 1000, 700 × 1077, 390 × 844. Comparison used width-normalized reference and full-page capture, then focused hero, build/benchmark, package/footer views. Reference is a desktop composition; mobile is an intentional single-column adaptation.

## Comparison and corrections

- Preserved section sequence, Incus baking hero, source-to-Oven-to-Loaf flow, gold headings, cyan accents, three benchmark scenarios, package banner, shared community footer and Encero signature.
- Re-created standalone image assets rather than flattening the reference into a page. Typography uses the site's existing Exo 2 family. Copy, commands, navigation and charts are HTML.
- First pass: corrected cyan link colors, benchmark badge placement and missing/repeating Projects icon mask. Subsequent desktop capture confirms these repairs.
- The desktop illustration is inset to the content width. On phones, each flow stage has its own cropped image and caption. Benchmarks stack with consistent units and shared scale within each pair.
- Existing shared footer artwork and compact layout retained instead of replacing them with the generated concept's interpretation.
- No remaining actionable P0/P1/P2 issues. Minor art differences from the generated reference are expected; PNG asset optimization can be considered separately before production.

## Behavior and validation

- Mobile menu opens and Escape closes it; browser and native Incan reducers agree.
- Copy commands shows Copied and the live status. Source bytes and clipboard policy are checked automatically; OS clipboard contents were not independently asserted.
- Benchmark methodology disclosure opens and exposes comparison conditions.
- No horizontal overflow at 390 or 700 pixels. All image assets loaded during visual inspection.
- Existing homepage carousel pauses and advances after the shared adapter change.
- Browser warning/error logs empty.
- Native Incan build succeeds. Homepage, Oven, docs and content-map checks pass, including source/output digests, local links/anchors, semantic chart values, source snippets and navigation classification. Incan format check and git whitespace check pass.

Benchmark numbers remain explicitly illustrative. Commands were checked against the existing authored documentation; this task does not claim execution of those examples with the future release compiler.

final result: passed
