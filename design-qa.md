# Vertical package document QA

final result: passed

Source visual truth: `/Users/danny/.codex/generated_images/01a114f0-5381-7002-af6c-7808d5f046d9/exec-c47d05fb-57d1-4b7a-8465-9e35b30c3cfb.png` (right metadata concept, option 2; 946 × 1663 pixels). The user requested vertical anchored content, deterministic information and restored real popularity graphs after these concepts.

Implementation: `http://127.0.0.1:8817/packages/crates-io/regex/`. Main desktop CSS viewport measured 1280 × 720 at capture; the full document capture is 1280 pixels wide. Density is 1 image pixel per CSS pixel. The concept is a generated raster, not a CSS export. Both images are displayed at the same column width in the comparison board, preserving aspect ratio; the implementation column shows the corresponding top document region, with its additional real feature rows. No browser chrome or device frame is included.

Evidence directory: `/Users/danny/.codex/visualizations/2026/10/07/01a114f0-5381-7002-af6c-7808d5f046d9/incan-pub-built/qa/`.

- Full-view combined comparison: `comparison-final.png`, with the source and rendered document in the same input.
- Focused combined metadata comparison: `comparison-focused.png`. Typography, authors, license and spacing are readable in this region. The additional charts follow below the source-matched metadata region.
- Complete rendered document: `desktop-full.png`.
- Browser-rendered preview: `preview.png` (also published at `assets/site/preview.png`).
- Responsive captures: `tablet-final.png` (1024 × 768), `portrait.png` (768 × 1024), `mobile-final.png` (390 × 844), `mobile-install.png`, `mobile-dependencies-final.png`.

Responsive dimensions were verified using same-origin iframe CSS viewports, because the in-app browser retained its desktop root width when the viewport override was requested. Frame document widths and scroll widths matched at 1024, 768 and 390 pixels; tables scroll within their own regions. These are browser-rendered responsive tests, not physical iPad Safari testing.

## Findings and comparison history

All actionable P0/P1/P2 findings have been fixed.

1. **P2: Header/metadata alignment and repeated feature prose.** Initial combined comparison (`desktop-first.png` plus the source in `qa/compare.html`) showed metadata starting below the full-width package heading, wasting vertical room. Feature cells repeated long explanatory phrases. Moved the heading into the article column, aligned metadata with the title, and used declared feature notation with a deterministic legend and explicit optional activation. Removed repeated overview facts already available in metadata. Verified in `comparison-before-typography.png` and the final comparison.
2. **P2: Quiet section hierarchy and small metadata.** The next combined comparison showed weak headings and small uppercase metadata labels compared with the concept. Restored serif metadata titles, increased main section titles, author/metadata value sizes and chart date labels. Final focused and full-view comparisons verify the correction.
3. **P2: Small-text contrast.** The initial gold text/button color did not meet 4.5:1 for small text. Darkened the text/action gold to `#846124`, darkened secondary captions/table headers, and strengthened filter borders. Main text uses `#292b28`; muted text uses `#696d66` on `#faf8f3`. Keyboard focus is visible. Post-fix evidence is in `preview.png` and the responsive captures.
4. **P2: Hidden table columns lacked a clear affordance on narrow screens.** `mobile-dependencies.png` showed activation outside the initial horizontal view. Added a scroll hint when a table actually overflows, kept table regions keyboard-focusable, and verified that keyboard scrolling reveals activation (`mobile-dependencies-final.png`, region scrollLeft 252, width 348, content width 600). Portrait tables that fit omit the hint.

## Required fidelity surfaces

- **Fonts/typography:** Brawler display and section titles; Exo 2 for UI and prose; the same monospace fallback stack as Incan.io for declarations. These match the live Incan.io theme verified on October 7, 2026; the raster's exact font is unknown. Intentional compact type remains for exhaustive data tables; body documentation and metadata are readable at normal browser scale. Headings wrap and retain clear hierarchy.
- **Spacing/layout:** Warm reading surface, broad article, narrow right metadata column, fine section dividers and a compact Add to project control. At portrait/phone widths metadata follows the main article and is reachable through a header shortcut. No page-level horizontal overflow.
- **Colors/tokens:** Charcoal header and restrained gold with warm paper backgrounds follow the selected direction. Text/action colors were darkened for small-text contrast; the real quantitative chart color remains gold.
- **Image/asset fidelity:** Official Incan wordmark plus a single `.pub`; existing sourced macOS/Linux/Windows icons. Gold chart assets are actual plots of frozen daily values, with checksummed files and source-separated labels. No invented artwork or image-generated chart curves. The concept's repository links are represented by clear service labels; the requested platform icons remain actual assets.
- **Copy/content:** Author README excerpt and documentation replace the concept's invented overview prose. All declared features remain in initial HTML, so the document is longer than the concept's five-row illustration. Requirements, defaults, target conditions, upstream dates and Incan availability are distinguished. Real release notes are bundled for regex and tokio. Advisory coverage, report destinations and six-record dependent coverage have truthful unavailable/limited states. These are intentional data-contract changes.

## Interaction and data validation

- License filter: Apache-2.0 → four records; Unlicense → memchr only.
- Query regex → one record; direct-publication filter → truthful empty state; reset restores all six and clears query.
- Package routes and assets checked for all six generated documents.
- TOML dialog: syntax-highlighted exact snippet, successful copy feedback, accessible title, Escape dismissal and focus returned to Add to project.
- Anchor navigation positions Dependencies below the sticky header; tables are contained and keyboard-scrollable.
- Main sections are present in initial HTML. No tabs or package-content fetch are required.
- Local Incan 0.5.1 build and seven Node test cases passed, including transitive defaults, weak forwarding, local cycles, target-specific dependencies, safe single-pass templates, scoped identities, frozen asset digests and byte-for-byte replay.
- Standalone page console checked: no errors. The iframe automation harness emitted one MutationObserver message during frame navigation; that API is absent from the application scripts/templates. Standalone rendering and interactions were rechecked cleanly. This message was not ignored as application evidence.

## Remaining scope and follow-up polish

No remaining P0/P1/P2 visual findings. Physical iPad testing, Linux workflow execution, scalable catalog search, additional version documents, owner publishing, advisory ingestion and report submission are outside this six-package playground. The manual-only CI recipe has not been dispatched. No nightly collector is installed.

Implementation checklist complete: layout, truthful data, sourced assets, compact install control, responsive containment, real plots, browser interactions, semantic checks, repeated render comparison and final screenshots.

## Incan.io font alignment

User-requested follow-up: adopted the live [Incan.io font pack](https://incan.io/shared/incapunk/incapunk.css) (Brawler 400/700, Exo 2 300–800) and its monospace fallback stack. Both templates load the same Google Fonts families with swap and preconnects. The official wordmark remains an image. Font loading, layout containment and a new browser preview were checked after the change.

## Syntax highlighting and documentation comments

Rust, Incan and TOML now render with token spans in initial HTML, using pinned Pygments 2.19.2 and a frozen copy of Incan's documentation lexer/token registry. The full recorded loaf.toml is highlighted alongside fenced Rust/TOML examples. Existing install-snippet highlighting/copy behavior is retained. Colors are scoped to code and fit the charcoal/gold palette; screenshots are published at `assets/site/syntax-rust-preview.png` and `assets/site/syntax-toml-preview.png`.

Nine local checks pass, including exact preservation of code text, Rust raw strings/lifetimes and rustdoc flags, Incan keywords/decorators/operators and aliases, TOML, safe markup escaping and unknown-language fallback. HTML comments in prose are suppressed without enabling raw HTML. Literal markup/comments inside inline and fenced code are preserved. Serde's leaked editorial comment is absent in the rendered document. Rust examples and the expanded recorded TOML were inspected in the browser. The manual workflow installs the pinned highlighter but has not been dispatched.
