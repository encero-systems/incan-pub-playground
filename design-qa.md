# Context reader QA

final result: passed

Target: previously approved context reader (`preview.png` before this revision), with requested license filtering, a toggle attached to the catalog boundary, and TOML highlighting. The earlier source has a text toggle; the new edge control and expanded filter group are intentional changes.

Comparison evidence: `/private/tmp/reader-comparison.png` places the source and rendered revision together at 1280px width. Captures show the same memchr overview, light theme and expanded catalog. Full-page heights differ because the standalone toggle row was removed. Composition, wordmark, license, platform icons and feature hierarchy remain intact. The filter and dependency-code regions were also inspected at viewport scale. No P0/P1/P2 desktop differences remain beyond the requested changes.

Mobile refinement: initial collapsed-state capture left the control detached above the package. Fixed by attaching it to the left panel edge and reserving heading space. Revised 390px capture (`preview-mobile.png`) shows the control alongside the heading without overlap. DOM check reports 390px document width at a 390px viewport. Expanded mobile filter controls were visually inspected too.

Functional checks: Apache-2.0 returns four dual-license packages; Unlicense returns memchr; reset restores all six. Collapse/show works. TOML source round-trips for all six embedded manifests and dependency snippets, including empty arrays, escaped HTML characters and array tables. Copy retains original plain source.

Scale check: synthetic 10,000-record Node exercise verifies 50 rendered rows, next-page transitions and disabled next on the final page. Search suggestions are capped at eight. This is not an end-to-end mobile benchmark. Full manifests and assets are still embedded in the six-package prototype; production should fetch details on selection and build a compact metadata index from the Git-backed source. SPDX expressions should be parsed properly for production; the preview only token-matches its current simple license expressions.
