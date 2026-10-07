# Archive Hall landing-page QA

final result: passed

## Source, state and normalization

Selected visual truth: `assets/site/landing-directions/option-2.png`, The Archive Hall (1374 × 1145 pixels, unframed desktop page). The user subsequently changed the heading to “Building blocks for Oven.”, requested a rotating starter ticker, and changed the bottom link to “How loaves work.” Those are intentional changes to the source visual.

Implementation: browser-rendered `http://127.0.0.1:8817/`, CSS viewport 1374 × 1145 at density 1, warm light theme, top of page, top-upstream ticker group, manually paused for stable comparison. Final viewport evidence: `qa/archive-ticker-desktop-viewport.png` (1374 × 1145). Full document: `qa/archive-ticker-desktop.png` (1374 × 1179); the additional 34 pixels accommodate the requested ticker caption and controls. An export is retained at `assets/site/landing-preview.webp`.

Source and implementation were combined into the same image input, rather than judged from separate views: `qa/archive-comparison-final.jpg`. Focused comparisons: `qa/archive-focus-hero-final.jpg`, `qa/archive-focus-starters-final.jpg`, `qa/archive-focus-lower-final.jpg`. These inspect headline weight, live controls, attribution/licensing, the starter hierarchy and lower artwork. No density rescaling was needed. Full-page desktop screenshots were not substituted for viewport evidence.

## Comparison history and fixes

1. Pass 1 (`qa/archive-comparison-pass1.jpg`): [P2] the revised supporting text wrapped and increased hero height from the intended 496 to 521 pixels. Longer recorded starter descriptions also pushed the lower panel below the intended region. [P2] a diagonal stripe in the existing shared masthead texture crossed the top-right header, whereas the selected header was quiet. Fixed supporting copy, starter section spacing and background crop; shortened copy retains the Oven/loaf scope. No package description was rewritten.
2. Pass 2 (`qa/archive-comparison-pass2.jpg` plus `archive-focus-*-pass2.jpg`): hero returned to exactly 496 pixels beneath a 68-pixel header; the lower region began at 927 rather than 920. This small difference came from the required recorded descriptions. Increased Brawler headline weight to 700 to match the source's strong display hierarchy, and adjusted the search-button fill while retaining opaque white lettering. User then explicitly requested a ticker; its controls and provenance caption intentionally add vertical room.
3. Responsive pass: [P2] at 768 and 390 widths, the initial background sizing cropped the tall sculpture behind the content panel. [P2] at 768, a longer scoped package name wrapped its version and shifted the descriptions relative to its neighbors. Fixed compact artwork sizing to show the entire cluster in its own 280-pixel panel and reserved consistent title height for the three-column portrait layout. Rotation now starts paused on compact screens, and changing into a compact viewport also pauses it. Post-fix evidence: `qa/archive-portrait-final.png` and `qa/archive-mobile-final.png`.
4. Final full and focused combined comparisons found no remaining actionable P0/P1/P2 mismatch. Strong Brawler display type, ivory reading surfaces, gold separators and the brass/charcoal architectural material are retained. Actual descriptions and deterministic rankings are intentional content changes, not invented mock data.

## Required fidelity surfaces

- Fonts/typography: browser-confirmed Brawler 700 display and Exo 2 body fonts loaded. These are the requested Incan.io font families. Hero remains two lines; metadata stays secondary. Recorded descriptions are visually clamped on desktop and shown in full on narrow screens. The generated source cannot guarantee precise font glyphs; real Brawler is the authoritative implementation.
- Spacing/layout rhythm: header 68 pixels, hero 496, three desktop columns with fine vertical rules. Ticker caption/control space is intentional. Narrow screens separate artwork from live content and stack starter links. No horizontal document overflow at 1374, 1194, 768 or 390 widths.
- Colors/tokens: warm ivory `#faf8f3`, charcoal ink and header, bronze/gold links and rules. Search text remains opaque white semibold against dark bronze. Small factual text stays on calm light surfaces; footer text remains legible on the dark lower artwork.
- Image quality: original wordmark retained. The two text-free generated raster plates were opened and inspected before consumption. Natural stone, charcoal prisms, brass edges and fine engraved lines match the chosen material direction. Hero source exceeds desktop display width; no placeholder illustration or hand-drawn SVG/CSS substitutes are used. Existing Phosphor plus/search and the same-family arrow icon are standard licensed SVG assets.
- Copy/content: “Building blocks for Oven.”; “Find a loaf…”; “How loaves work”. Versions, full scoped IDs, descriptions, licenses and ranking metrics come from frozen recorded inputs. Crates.io ranking uses 30-day upstream counts; Incan registry ranking uses all-time GitHub Packages counts. They are never combined. Random sampling selects existing records. No Incan-owned/native-library group is fabricated because this snapshot has none.

## Runtime and interaction verification

Browser-tested desktop, landscape iPad 1194 × 834, portrait 768 × 1024 and narrow 390 × 844. Captures: `qa/archive-ipad-1194.png`, `qa/archive-portrait-final.png`, `qa/archive-mobile-final.png`. The landscape capture shows the same composition with working ticker controls; portrait/narrow final captures follow the artwork correction.

- Homepage search for regex navigated to `/catalog/?q=regex` and showed exactly one matching row.
- Catalog package link opened the regex document; Add to project opened the existing TOML dialog and Close dismissed it.
- Wordmark returned to the homepage. Package-page Catalog links use `/catalog/`.
- Previous/next selected groups; random group contained three distinct records from the local pool; registry group correctly displayed memchr, tokio and regex. Pause/Play toggled state. Compact startup pause was verified. Hover, keyboard-focus, page-visibility and reduced-motion guards were checked in the implementation; no emulated reduced-motion browser run is claimed.
- On the compact layout, a full starter-card link opened its scoped detail page. Catalog Unlicense filtering retained only memchr.
- Final browser error log was empty.
- `npm run build` passed through Incan/Oven. All 10 Node checks passed, including deterministic replay, correct new routes, top-upstream ordering, metadata escaping, existing documentation/asset digests and highlighting. `node --check assets/site/showcase.js` and `git diff --check` passed. The separate manual-only site-check workflow was not dispatched.

## Remaining boundaries and implementation checklist

- Complete: selected direction, live search/navigation, scoped starter links, ticker controls, factual rankings, compact artwork, official branding/fonts, unchanged package-detail functionality.
- P3: a future production catalog should supply an admitted Incan-owned group and its actual metadata; the current renderer continues to reject unsupported direct-publishing records. Six-record search remains a preview, not a scalable production implementation.
- Native iPad Safari was not driven directly; checks used the Codex in-app browser at iPad dimensions. Final publication verification is performed separately against GitHub Pages.

Package-page QA from the preceding completed change is retained in `design-qa-package-pages.md`.
