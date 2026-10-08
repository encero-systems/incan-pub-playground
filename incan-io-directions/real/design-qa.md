# Homepage revision QA

final result: passed

## Findings

No actionable P0/P1/P2 issues remain under the revised brief. This pass addresses the five browser comments and the explicit request to use the existing Incapunk header. The previous QA incorrectly accepted missing callout paths and atmosphere as minor differences; both are blockers in this revision.

| Reported issue | Correction | Evidence |
| --- | --- | --- |
| P1: flat header instead of the existing Incapunk surface | Adapt canonical `.md-header` color layers, rail, shadow, and logo treatment into the semantic sticky header | `incapunk-reference.png`, `comparison-hero.png`, `preview.png` |
| P2: landscape competes with foreground symbol | Darken/suppress saturation on the landscape's independent layer; retain foreground brand brightness | `comparison-hero.png` |
| P2: desktop typography feels magnified | Code 21px → 16px, heading 68px → approximately 51px at 1453px; annotation labels 21px → 16px; normal body/UI scale | `preview.png`, `comparison-code.png`, browser computed styles |
| P2: missing source callout paths | Restore long gold paths with angled ends and dots, linked to measured source spans and note labels | `comparison-code.png`, `after-wide.png` |
| P2: full-width terminal wastes space | At widths above 940px, place introductory text beside a compact terminal panel | `preview.png`, `after-wide.png` |
| P1: community atmosphere is absent | Restore separate teal mist raster behind Incus, fading to dark behind copy | `comparison-community.png` |

## Source and captured evidence

- Source visual truth: [approved mockup](https://encero-systems.github.io/incan-pub-playground/assets/site/incan-io-directions/welcome-combined-community.webp), original `exec-e57e08c6-5434-4106-a860-583069553df2.png`.
- Header source: `incan/workspaces/docs-site/docs/shared/incapunk/incapunk.css` and a fresh capture of `https://incan.io/dev/`.
- Implementation: `http://127.0.0.1:8824/incan-io-directions/real/`.
- Main comparison viewport: **886 × 1775 CSS px**, density **1**. Source image **886 × 1775**; final browser full-page capture **886 × 1781**. Images are placed side by side without stretching or density rescaling.
- State: default dark page, loaded local fonts and artwork, idle controls, closed mobile menu.
- Implementation screenshot: `../../qa/incan-io-revision/after-reference.png`.
- Full-view paired evidence: `../../qa/incan-io-revision/comparison-final.png`, source left, HTML right. Opened and inspected after the final corrections.
- Focused paired evidence in the same directory: `comparison-hero.png`, `comparison-code.png`, `comparison-community.png`. Regions are cropped from their corresponding source/implementation sections; vertical offsets differ because the layout and typography were explicitly revised. No crop is resized to pretend equal section heights.
- Wide desktop: `after-wide.png`, **1453 × 1721** pixels at **1453 × 979 CSS px**, density 1. `preview.png` is the corresponding **1453 × 979** viewport capture and shows hero, code, and compact terminal layout.
- Responsive captures: `tablet-final.png` (**768 × 1881**, viewport 768 × 1024); `mobile-final.png` (**390 × 2519**, viewport 390 × 844); `mobile-small.png` (**320 × 2735**, viewport 320 × 740).
- The existing user tab and one earlier public-page capture reported non-unit density and generated clipped full-page evidence. Those captures are excluded from visual acceptance. The valid comparison uses a fresh local QA tab with measured density 1. This is not evidence of the user's browser zoom setting.
- Screenshots remain local under the repository's existing ignored `qa/` directory.

## Iteration history

1. **Baseline — blocked:** user's annotated screenshots and approved source identify oversized type, missing paths/background, excessive landscape brightness, sparse terminal layout, and wrong header surface.
2. **First revision — blocked:** `clean-desktop.png` shows the compact scale, canonical header, restored library-rendered paths, independent landscape dimming, two-column run section, and new atmospheric raster. The 886px comparison found a premature two-column project breakpoint. Phone inspection found community copy inherited centered alignment. The action surfaces had also drifted from the bright primary/quiet outlined buttons of the reference.
3. **Corrections:** retain four project links down to 800px, correct small-screen alignment, reduce global texture intensity while preserving community atmosphere, restore bright gold primary/outlined supporting actions, and add space between code glyphs and connector endpoints.
4. **Final revision — passed:** recaptured `after-reference.png` and `after-wide.png`; opened the final full-view comparison and all three focused comparisons. Project titles fit, glyphs remain clear, paths track their intended text, primary action contrast is restored, and the community background is visible. No actionable P0/P1/P2 findings remain.

## Required fidelity surfaces

- **Fonts/typography:** local Brawler and Exo 2 remain canonical. Browser fonts load successfully. Native monospace remains selectable, legible, and syntax highlighted. Hierarchy, weight, line height, letter spacing, and wrapping were checked in the captures. The reduced scale is explicitly requested and takes precedence over the mockup's approximate lettering.
- **Spacing/layout:** the desktop vertical enlargement is removed; the 1453px page is approximately 1721px tall. Hero plus sticky header is 377px tall. Code remains the next major region. The run section uses horizontal space; projects and tools remain compact. No whole-page horizontal overflow at 320, 390, 768, 886, or 1453px. Narrow code panels scroll internally when necessary.
- **Colors/tokens:** header gradient, metallic rail, logo glow, and forged-gold heading treatment are adapted from Incapunk, not invented replacements. Landscape brightness is reduced independently of the foreground symbol. Cyan/gold accents and syntax colors remain recognizable. UI contrast and focus were visually checked; no formal contrast certification is claimed.
- **Image quality/assets:** official logo/wordmark preserve aspect ratios. The landscape and transparent Incus portrait remain the separate source assets. New community mist is a text-free raster generated from the selected visual, inspected before use. No UI text is baked into artwork. Asset texture/detail varies from the single generated mockup, while subject and atmosphere remain consistent.
- **Copy/content:** original language welcome, source, commands, projects, tools, and community story remain intact. The version still says “in development.” No fake adopters are added. The adoption insertion point stays hidden. Supporting project links and Meet Incus remain secondary.

## Behavior and verification

- Six library-rendered segments form three code-to-note paths. They remeasure after fonts load and panel/window resize. All paths and their shared definitions are hidden from assistive technology and ignore pointer events.
- At 768px, paths remain attached to the source. At 390px, paths are removed and notes remain semantic anchor links below the source. Resizing back to desktop recreates the paths.
- Both copy controls successfully fulfilled clipboard writes and announced the corresponding source/commands success state. Byte-for-byte clipboard readback and forced permission denial are not claimed.
- Mobile menu open/close, Project link, and Escape were tested. Escape returns focus to Menu; navigation closes the menu. Desktop Project navigation reaches the community section, with its heading below the sticky header.
- Local assets and anchor targets resolve. Documentation/community/catalog destinations are unchanged from the prior implementation. Prior HTTP checks of the 15 documentation links are retained; they were not redundantly rerun in this visual correction.
- Browser error log is empty. `node --check page.js` and `git diff --check` pass.
- Reduced motion disables smooth scrolling/transitions in CSS. Cross-engine checks, assistive-technology traversal, zoom resilience, and clipboard denial remain production integration checks, not claimed completed tests.
- This is website validation; no compiler execution of the sample or commands was performed.

## Acceptable differences / follow-up polish

- P3: exact mockup raster lettering and illustration detail cannot be identical to real canonical fonts and separately reconstructed artwork.
- Requested changes: the existing Incapunk header replaces the transparent mockup header; desktop type is smaller; the terminal becomes two columns on wider screens. These are intentional changes, not fidelity defects.
- P3: a six-pixel full-page height difference at the source width is acceptable; there is no clipped or missing content.

## Implementation checklist

- [x] Address all five browser comments and canonical header request.
- [x] Keep real text, official brand proportions, and canonical fonts.
- [x] Restore responsive source paths and separate atmospheric artwork.
- [x] Verify desktop, reference, tablet, and phone layouts.
- [x] Inspect full-view and focused comparisons after fixes.
- [x] Preserve source copy, links, clipboard controls, and future adopter hook.
