# Complex documentation and 0.6 architecture QA

final result: passed

Verified 2026-10-23. This is a local prototype, not an update to the published docsite.

## Scope and content authority

The reader contains eight unchanged docsite Markdown snapshots and one authored 0.6 architecture adaptation. Original Markdown bytes and source hashes are retained. Eight transitive shared snippet inputs are copied, hashed and expanded in Incan, including installer shell text, complete source examples and shared RFC references. The prior architecture source remains a reference in the source manifest.

The architecture draft follows the current governing #652/#1337/#654/#1675 compiler cutover and #870/#1034 Oven authoring contracts read on this date. It shows declaration injection and checked-body MIR lowering through the pinned rustc, no generated Rust on the normal path, Incan-authored lowering/control policy and the bounded Rust host kernel. It does not assert the open acceptance work has shipped. Other imported pages retain their original version claims. The website builder itself uses installed Incan 0.5.1.

## Visual target and comparison

The selected visual target is the user-approved Incapunk 2.0 documentation reader, captured in `../qa/docs-enums-desktop.png`. The previous live architecture page was captured in `../qa/architecture-original-desktop.png`; its ASCII/Rust-source pipeline is historical content to replace, not a target to clone.

`../qa/docs-style-comparison.png` combines the approved reader and final architecture at 720 pixels per panel. Both input images are 1440 by 1000, captured with a 1440 by 1000 CSS viewport. The previous live architecture screenshot is 1309 by 909 and is not used for exact typography measurements. The approved reader and final architecture comparison was opened and inspected together.

The architecture intentionally adds an eyebrow, three reading paths, a collapsible development-context note and a new source-grounded body. It preserves the reader's header, document column, side navigation, table of contents and footer vocabulary. No imagery was replaced with approximate drawings; identity assets and typography are reused unchanged. Mermaid supplies real source-driven diagrams.

## Required fidelity surfaces

- Fonts/typography: existing Exo 2 headings/body and monospace code remain. Gold hierarchy, readable body sizing and compact navigation match the approved reader. Long titles and code wrap/scroll as intended.
- Spacing/layout: the three-column desktop reader and section rhythm are retained. New reading paths use the article column; mobile stacks them. The larger page inventory makes the sidebar longer without hiding its final entry at desktop height.
- Colours/tokens: the same obsidian, gold, cyan and muted-green variables are used. Diagram policy uses those same colours instead of introducing a separate theme.
- Assets: original cube/wordmark, font and icon assets remain byte-verified. The existing docsite's Mermaid runtime and MIT license are bundled and hashed.
- Copy/content: eight source snapshots are unchanged. The architecture is explicitly an authored 0.6 adaptation with linked current contracts and an in-development label. It replaces the old generated-Rust normal pipeline.

No actionable P0/P1/P2 mismatch remains from this focused pass. Repeated sidebar group labels and interactive diagram zoom are possible later polish, not functionality claimed by this build.

## Native and integrity checks

- `tools/welcome/build` completes with native Incan 0.5.1; no new authored Rust.
- `node tools/welcome/check-docs.mjs` passes for all nine pages: independent snippet reconstruction, exact raw Markdown and fenced example text/indentation, input/output hashes, local assets/links/anchors, unique IDs, reference resolution, tutorial panels, footnotes and architecture content guards.
- The generated content has 101 fenced examples (including three diagram sources), 25 tables, nine footnotes, six language panels and four Markdown-enabled tutorial panels.
- Native fixtures reject include traversal and unsafe HTML, preserve duplicate heading identities and parse Markdown inside validated semantic HTML regions.
- `node tools/welcome/check.mjs` still passes the nine-example homepage state machine and source/output/asset integrity checks.
- `incan fmt --check tools/welcome/src` and generated diagram JavaScript syntax checks pass.

## Browser checks

- Both architecture diagrams and the typed-API request diagram render to SVG with `data-render-state=ready`.
- The architecture reading paths and desktop section links reach their headings below the sticky header.
- The long-form explanation's nine footnotes, backlinks and accessibility label targets remain intact; the first footnote link was exercised.
- Tutorial metadata, ordered step rail, diagram caption and result/complete panels render, rather than disappearing as raw HTML.
- At a stable 320 CSS pixel viewport, the architecture page scroll width is 320 and compact table-of-contents links work. The tested `Who owns what` heading settled at 208px with a 72px sticky header. A transient measurement during viewport/DPR resizing was rechecked after stabilizing the viewport; it was not treated as an application defect.
- No broken images or warning/error console logs were observed in the final diagram-page check.

Evidence: `../qa/architecture-06-desktop.png`, `architecture-06-pipeline.png`, `architecture-06-mobile.png`, `docs-typed-api-diagram.png` and `docs-style-comparison.png`.

## Deliberate limits

Language panels are labelled static sections, not interactive tabs. The supported snippet syntax is the copied doc-root `_snippets` form; missing/cyclic/escaping includes and unsupported macros refuse. Standard Markdown keeps safe parser defaults; explicit tutorial HTML is handled as validated Pallay structure. This is not full MkDocs compatibility or a comprehensive accessibility audit. Diagram drawing uses a vendored browser library; document parsing, expansion, routing and rendering are authored and executed in Incan.
