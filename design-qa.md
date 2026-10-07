# Context reader QA

final result: passed

Target: previously approved context reader (`preview.png` before this revision), with requested license filtering, a toggle attached to the catalog boundary, and TOML highlighting. The earlier source has a text toggle; the new edge control and expanded filter group are intentional changes.

Comparison evidence: `/private/tmp/reader-comparison.png` places the source and rendered revision together at 1280px width. Captures show the same memchr overview, light theme and expanded catalog. Full-page heights differ because the standalone toggle row was removed. Composition, wordmark, license, platform icons and feature hierarchy remain intact. The filter and dependency-code regions were also inspected at viewport scale. No P0/P1/P2 desktop differences remain beyond the requested changes.

Mobile refinement: initial collapsed-state capture left the control detached above the package. Fixed by attaching it to the left panel edge and reserving heading space. Revised 390px capture (`preview-mobile.png`) shows the control alongside the heading without overlap. DOM check reports 390px document width at a 390px viewport. Expanded mobile filter controls were visually inspected too.

Functional checks: Apache-2.0 returns four dual-license packages; Unlicense returns memchr; reset restores all six. Collapse/show works. TOML source round-trips for all six embedded manifests and dependency snippets, including empty arrays, escaped HTML characters and array tables. Copy retains original plain source.

Scale check: synthetic 10,000-record Node exercise verifies 50 rendered rows, next-page transitions and disabled next on the final page. Search suggestions are capped at eight. This is not an end-to-end mobile benchmark. Full manifests and assets are still embedded in the six-package prototype; production should fetch details on selection and build a compact metadata index from the Git-backed source. SPDX expressions should be parsed properly for production; the preview only token-matches its current simple license expressions.

## Package context extension — October 7

final result: passed

Source: the previously approved reader capture at `/private/tmp/package-context-source.png`. The combined comparison `/private/tmp/package-context-comparison.png` opens the source and revised memchr overview together at 1280px width. Requested differences are author attribution and explicit upstream links near the heading, two new tabs, and a compact registry-download summary. Catalog layout, license placement, installation snippet, platform icons and feature hierarchy remain intact. Additional focused captures inspected the popularity metrics/graph and Tokio release history.

Initial narrow graph capture clipped the final x-axis date label (P2). Fix: align the first/last date labels toward the plot interior, and generate compact chart variants with fewer ticks and larger relative type for viewports at/below 1100px. Post-fix 390px capture is `preview-mobile.png`; it shows the complete final date. DOM verification reports document width 390px for a 390px viewport, and the compact chart is selected. Mobile tabs can scroll horizontally; ArrowRight reaches Popularity from Releases and End reaches Provenance. Release rows and notes fit the narrow panel.

Functional verification: both popularity sources switch; actual GHCR counts are independent of upstream crates.io counts; graph source, snapshot time and partial-day status remain visible. All six contexts have authors, matching selected-version crates.io links and the recorded GitHub source URL. Tokio shows a matching GitHub release note excerpt, upstream release date and separate adoption date. Missing note excerpts are explicit preview states. Totals were checked against saved daily data, which includes older crates.io version downloads; charts use those same records. Published source archives were checksum-verified before authors were read. Authorship, upstream uploader and adoption actor are kept separate in Provenance.

The data is a dated snapshot, not a scheduled or live analytics service. No Incan.pub registry/index data was changed. See `assets/package-context-sources.md` for sources and integration limits. Existing license filtering, TOML source-preservation and 50-row pagination checks still pass.
