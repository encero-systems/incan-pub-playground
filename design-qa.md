# Forge light — selected Option 2

Date: 2026-10-07. Scope: existing public Incan.pub playground catalog and six package documents. The prior reading-layout QA is retained in `design-qa-reading-layout.md`.

## Reference and rendered comparison

Selected reference: `assets/site/visual-directions/option-2.png` (1487 × 1058). Final browser capture: `assets/site/forge-preview.png`, matched at 1487 × 1058 CSS pixels with loaded fonts. Source and implementation are combined side by side in `assets/site/forge-comparison.jpg`; a matched masthead/article/metadata crop is retained in ignored `qa/forge-header-comparison.jpg`. Both combined images were opened and inspected after the final desktop correction.

## Required surface review

- Layout: charcoal full-width package masthead, slim left scroll-anchor rail, broad warm article and right metadata match the selected hierarchy. The catalog keeps its existing functional table with matching header and surfaces. Tablet widths replace the side rail with wrapped anchors. Narrow widths stack metadata after the document and provide a direct Metadata anchor.
- Typography: Brawler and Exo 2 remain the user-requested Incan.io families. The generated reference uses somewhat different glyph shapes and larger display typography; those are deliberately not copied over the established font pack. Fonts were loaded in the browser; one page H1 is enforced. Author heading text and its relative levels remain present beneath section headings.
- Colors and line work: near-black charcoal, warm paper, restrained amber masthead edges and fine brass section rules. Code blocks have dark surfaces, a restrained brass top edge and the existing scoped token colors.
- Assets: official wordmark and existing platform icons retained. Actual generated raster `forge-masthead.webp` supplies the decorative forged texture and angled seam. Recorded download charts remain data-derived quantitative assets; no decorative replacement of trends.
- Content: full checksum-verified author README, exact feature declarations, dependency activation paths, source-specific chart histories, dates and truthful missing-data states are retained. The reference's short Rust example, abbreviated feature table, smooth registry trend and reduced navigation were illustrative. They are intentional content deviations. The duplicate Overview is removed; facet, origin and license are no longer repeated in Metadata. Upstream README prose can still contain its own license/features text.

## Corrections and reinspection

1. P2: initial section headings lacked the selected fine brass rule. Added a restrained rule and recaptured the matched desktop comparison.
2. P2: download cards were taller than needed. Tightened metadata rhythm, number line height, spacing and sparkline height; retained dates, source captions and exact chart assets. Reinspected the complete combined comparison and the phone Metadata view. Removed a narrow-screen contain override that unnecessarily narrowed the sparklines.
3. Navigation: the active section is retained while no document section intersects the observer. Script URLs are versioned for this change so returning visitors receive the updated behavior.

## Functional and responsive verification

- Browser widths checked: 1487 desktop, 1024 landscape tablet, 768 portrait tablet and 390 phone. No page-wide horizontal overflow in observed package/catalog states. Wide declaration tables retain their own scrolling containers. This is responsive browser testing, not a physical iPadOS/Safari run.
- Add to project opens the native modal with highlighted exact TOML; Copy shows its success state. Escape closes it and returns focus to Add to project. Existing code-content checks verify literal bytes and escaping.
- Dependencies anchor settled at approximately 100 px below viewport top, clear of the approximately 75 px desktop sticky header. Active rail item became Dependencies. Phone Metadata anchor settled at approximately 140 px, clear of the approximately 110 px header.
- Recorded manifest disclosure opens and contains highlighted TOML (534 token spans for regex).
- Unlicense catalog filter leaves memchr; tapping its description cell navigates to the package document. Existing whole-row navigation remains intact.
- Loaded images have nonzero intrinsic dimensions; browser console captured no errors in checked package states.
- Only short interaction/dialog transitions are added; every new motion rule is gated by `prefers-reduced-motion: no-preference`. No ambient loop or pointer-following effect.
- `npm run build` passed locally through the existing authored Incan renderer/Oven. `npm run check`: all 9 checks passed, including initial HTML/local assets, feature semantics, safe input handling, scoped identities, deterministic byte replay, documentation/chart digests, Rust/Incan/TOML highlighting and prose-only HTML-comment removal. `git diff --check` passed.

No unresolved P0/P1/P2 issues in this scope. Registry production admission, full-index search, live statistics refresh, additional version documents and configured reporting endpoints remain outside this preview, as documented in the existing data contract.

final result: passed
