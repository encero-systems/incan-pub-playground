# Incan implementation QA

Result: passed focused fidelity and interaction checks on 2026-10-23. No remaining actionable findings from this pass.

## Reference and scope

Reference: `../obsidian/`, the approved HTML prototype. Target: this separate Incan-generated directory. Source and build instructions: `../../tools/welcome/README.md`.

Incan owns structured page components, content, appearance, typed state, transitions and browser policy. The pinned Pallay foundation emits the reducer; a generic browser adapter supplies DOM, clipboard, focus, timer and measurement APIs. Browsers execute generated HTML/CSS/JavaScript. This is not a WebAssembly or complete Pallay release claim. No new authored Rust was introduced, and the reference implementation is preserved.

## Visual evidence

- `qa/comparison-full.png`: full reference and target, side by side.
- `qa/comparison-community.png`: Incus, community background, decorative rails and footer signature.
- `qa/incan-preview.png`: normalized desktop preview.
- `qa/incan-mobile.png`: 320 CSS pixel mobile capture.
- `qa/layout-metrics.json`: matching source and target measurements at 1440 by 1000 CSS pixels, DPR 1.1, Enums selected and rotation paused.

The measured hero, welcome copy, example section, example body, run section, community section and footer rectangles match exactly. Both document scroll widths are 1440 at that desktop width. Six annotation connector segments render on desktop; connectors are suppressed on mobile as in the reference. At 320 pixels, document scroll width is 320 and the footer identity fits.

Typography and spacing, hero composition, example annotations, Incus breakout, decorative rails and footer identity were visually compared. Approved cube, wordmark, Incus and font assets retain their bytes. Generated CSS retains the approved rules, with only trailing whitespace differences.

The screenshot backend captured the full desktop page at 1309 by 2774 pixels despite the recorded CSS viewport. Both full-page comparison captures use that same scale. The raw viewport capture includes backend padding; `incan-preview.png` extracts the rendered 1309 by 909 region and scales it to 1200 pixels wide. DOM measurements, rather than screenshot padding, establish layout width.

## Functional evidence

- Native Incan build completed using Incan 0.5.1 and the isolated pinned Pallay package.
- `node tools/welcome/check.mjs` passes native/browser reducer parity for nine reference steps, all nine direct selections, rejected-event atomicity, unique document IDs, binding targets and source/output/asset hashes.
- Source formatting and emitted JavaScript syntax checks pass.
- Browser checks cover all nine examples, next/previous wraparound, quick selection, active annotation highlighting and pause behavior.
- Rotation advances after a fresh foreground load; pause/play controls work. An initially inconclusive timer observation during multi-tab capture was rechecked in the foreground with visibility, hover and focus guards inspected.
- Mobile menu opens and closes with Escape; arrow navigation changes examples; copy resolves with success feedback. Operating-system paste was not independently tested.
- No broken images or browser console warnings/errors were observed in the final pass.

During implementation, note wrapper highlighting was added to the presentation bindings to preserve the reference's active annotation appearance. Final comparison evidence reflects that correction.

## Limits

This is a local development preview, not an external publication. The page's future 0.7 direction and historical benchmark labels remain unchanged; building the site does not validate future compiler features or produce new benchmark measurements. Compiler 0.5.1 workarounds and related closed reports are recorded under `tools/welcome/repros/`; the current development compiler was not tested. These checks do not establish full accessibility conformance.
