# Design QA — obsidian Incan.io prototype

**Source visual truth:** `qa/source-approved.png` (870 × 1808 pixels), copied from this task's selected `exec-eea472c5-d126-47a8-9b8d-a6fffbf4f06d.png`.

**Implementation:** `http://127.0.0.1:8923/incan-io-directions/obsidian/`.

**State:** Enums (04/09), paused for comparison, charcoal theme. The normal page starts the existing guided rotation, subject to reduced-motion, visibility, hover and focus preferences.

## Evidence and normalization

- Full-view, same comparison input: `qa/comparison-final.png` contains the source and the final browser-rendered implementation together, both normalized to 720 pixels wide.
- Focused code and annotations: `qa/comparison-code-final.png`.
- Final desktop implementation: `qa/desktop-final.png` (1309 × 2783 capture pixels); CSS viewport 1440 × 1000; document 1440 × 3062; browser DPR 1.1. The native full-page backend exports a density-adjusted image; comparisons normalize pixel widths and use actual DOM bounds to distinguish capture scaling from layout overflow. Source equivalent height at 1440-wide is about 2993; the implementation is about 2% taller, principally because it retains workload sizes and evidence notes.
- Focused hero and community fixes at actual browser size: `qa/hero-fill-fix.png`, `qa/community-contrast-fix.png`.
- Responsive adaptations: `qa/mobile-final.png` at CSS 390 × 845; `qa/tablet-capabilities.png` at CSS 820 × 1080. No separate mobile reference was supplied, so these are responsive usability checks rather than pixel-match assertions.

## Comparison history and resolved findings

1. Initial capture: P2 portrait missing in a full-page screenshot because lazy loading had not occurred. Fix: eagerly load the original portrait. Post-fix evidence shows Incus and all image assets loaded.
2. First combined comparison: P2 hero scene began below its container, leaving a horizontal transition. User also reported the hero did not fill naturally. Fix: use a continuous full-height architectural stage at desktop/tablet widths and generate a dedicated, continuous portrait environment at narrow widths. Keep the original cube as an unchanged image overlay. Post-fix evidence: `hero-fill-fix.png`, `mobile-final.png`; desktop and tablet scene stages cover the hero bounds.
3. User reported Incus blending into the architectural background. Fix: dim the decorative environment to 38% opacity (32% on mobile), retain the portrait's original pixels, and add a restrained shadow. Post-fix evidence: `community-contrast-fix.png` and final full-page capture.
4. Narrow-phone check found P2 horizontal overflow from the Meet Incus link at 320px. Fix: keep the link inside the portrait footprint. Recheck: document scrollWidth equals viewport width at 320, 390, 820 and 1440 CSS pixels; benchmark and navigation controls remain within page bounds.
5. Focused code comparison: increased desktop code from 15px to 18px, keeping the code panel's reserved height stable across all nine examples; source annotations remain outside its border.

## Required fidelity surfaces

- **Fonts and typography:** existing self-hosted Exo 2 pack retained per the earlier font requirement, using sans-serif display weights instead of old Brawler headings. This is an intentional family constraint, not a claim that the generated reference's type outlines are identical. Monospace source is 18px at desktop, 16px at smaller desktop, 13px at tablet and 12px on phone. Header and supporting UI remain smaller. Fonts loaded successfully; no clipped headings in tested layouts.
- **Spacing and layout rhythm:** full section order retained: welcome; annotated examples; Rust context; run commands; first projects; performance; four tools; Incus/community; footer. Code uses a main panel and an external note column at larger widths. Phone adapts to a single column and smaller two-column project links. Source table's retained workload/evidence detail explains the small extra page height.
- **Colors and tokens:** body is exactly `rgb(8, 12, 10)`; dark green-charcoal panels; gold headings/rules; cyan limited to source syntax, links and emitted-light accents. No navy page wash remains. Community brightness is intentionally lower than the original mock after the user's correction.
- **Image quality and asset fidelity:** original cube and Incus source hashes/bytes verified unchanged. Source wordmark lockup is used directly as an image. Three scene environments were generated from the selected art direction, with prompts saved alongside. Library icons and LeaderLine paths are retained; no hand-drawn substitute logos or CSS illustrations. Original identity assets intentionally differ from the generated reference's altered cube/portrait.
- **Copy and content:** nine examples and all supporting content retained from the approved earlier 0.7 page. No generated-Rust story. Eight benchmark rows and their exact values retained; August 21, 2026 historical attribution, workload sizes and measurement-noise note retained. Build speed and token reduction remain targets. Architect remains Preview. Future adopter strip remains hidden.

## Interactions checked in the in-app browser

- All nine dropdown examples: filenames, example counts, syntax, notes and line counts update together, including combinators, capabilities and Architect.
- Next/previous controls; selected tabs; manual selection pauses rotation. Automatic progression was observed from Enums to Optional values after normal playback.
- Code copy invokes the Clipboard API successfully and updates the status. The browser's isolated clipboard-read interface returned a separate empty store, so OS paste contents were not independently asserted.
- Mobile menu opens; navigation appears; Escape closes it and returns focus. Project and home anchors work.
- Documentation search submitted `q=enums` to the existing docs and visibly opened matching search results (40 documents in this check).
- Six desktop annotation path segments attached to the source spans and external notes. Paths are suppressed at phone widths.
- Images loaded, fonts loaded, no console warnings/errors in the final local-page check.

## Findings

No remaining actionable P0/P1/P2 findings in the implemented scope and tested states.

## Follow-up polish / limits

- P3: the original emblem's gold is more weathered than the generated reference. Preserving the actual identity asset is intentional; no recoloring was applied.
- P3: font-pack proportions and atmospheric scene details are not pixel-identical to the generated image. This is a functioning HTML rendition with original identity assets, not a flattened screenshot.
- No claim of production deployment, compiler validation, new benchmark runs, exhaustive accessibility testing or verified native OS clipboard paste.

## Implementation checklist

- [x] Approved charcoal direction and full 0.7 content.
- [x] Responsive environments, original branding and Incus.
- [x] Nine examples and library-rendered external annotations.
- [x] Working navigation, copy feedback, native docs search and mobile menu.
- [x] Desktop, tablet, 390px and 320px overflow checks.
- [x] Reference/implementation full-view and focused comparisons.
- [x] Keep local preview running; retain old prototype unchanged.

final result: passed


## Reopened: user wide-screen evidence

The user's external-browser screenshot exposed an untested wide-screen defect:
`.hero-art` was still capped at 1720px, producing a visible central rectangle.
The earlier checks stopped at 1440 CSS pixels and were insufficient to claim
full-width behaviour across large desktop windows.

Fix: remove the artwork width cap. At wide widths, keep the unchanged cube at
440px and re-anchor the background's plinth vertically; the environment fills
the full viewport without scaling the cube to an excessive size. Content stays
in its existing readable grid. Wide-screen verification: artwork bounds are 0–3000 CSS pixels at a 3000px viewport, and 0–3724 at the browser’s maximum resulting viewport. Background covers the entire hero height; the unchanged cube stays 440px wide. A fresh 1920px load has scrollWidth 1920 and artWidth 1920. Evidence: `qa/wide-3000-fixed.png`, `qa/wide-1920-fixed.png`. The user subsequently approved the corrected full-width result.


## Requested inline brand refinement

Replace plain Incan lettering in the welcome heading with a crop of the supplied
brand image. Reuse its exact pixels; exclude the separate tesseract from this
inline crop. Superseded by the clean-alpha asset refinement below.


## Post-fix pass: original rails, foreground Incus, clean inline wordmark

Source truth: original `incan/workspaces/docs-site/docs/shared/incapunk/incapunk.css`
`--inc-rail` and `.md-header::after`, supplied `assets/brand-source.png`, approved
`qa/source-approved.png`, plus the user's requested shorter community panel.
The exact cyan/gold/coral rail is reused below the masthead and across the full
viewport at the bottom of both hero sections. Header fill remains charcoal.

Earlier findings: missing original rail treatment; community panel too tall for
Incus to break its upper edge; inline wordmark retained source haze/reflection.
Fixes: 2px original gradient rails; community min-height 330→290px with the
portrait anchored to its bottom; genuine RGBA wordmark cleanup with confined
cyan emission and no floor. Original emblem, portrait and masthead image remain
unchanged. H1 accessible name is explicitly “Welcome to Incan.”

Rendered evidence: `qa/rails-hero.png`, `qa/rails-community.png`,
`qa/after-rails-incus.png`, `qa/rails-desktop-1440.png`, `qa/rails-mobile-320.png`.
Combined before/after comparison: `qa/comparison-rails-incus.png` (left before,
right after). Both full captures use CSS1037×1076; source before943×2736px,
post-fix943×2725px. Focused lower470px regions normalized to740px each for
side-by-side inspection. Their slightly different page heights are intentional.
Desktop1440 and actual320px narrow viewport also checked. Fractional density
normalization is a screenshot-backend detail, not layout overflow.

Five-surface review:
- Typography: existing Exo 2 unchanged; inline wordmark baseline visually aligned;
  H1 remains within the 320px viewport with its accessible label intact.
- Spacing/layout: at1037px Incus image bottom and section bottom both992.145px;
  portrait top658.466px versus panel top701.236px, giving43px head/ear breakout.
  Smaller tablet uses a reduced breakout; narrow mobile retains readable stacked
  content. The rails span the viewport without widening the document.
- Tokens/color: original rail stops preserved, charcoal surface and original gold
  and cyan assets retained; community atmosphere stays restrained.
- Image quality: cleanup1983×793px has actual alpha min0/max255; CSS crops only
  transparent canvas padding. No floor reflection visible in the rendered H1.
- Copy/content: existing0.7 direction, historic measurements and labels unchanged.

Functional checks: scrollWidth equals viewport at1037,1440,352 and320; no broken
images; mobile menu opens and Escape closes; fresh browser warning/error list
empty. No actionable P0/P1/P2 findings in this focused pass. Prior accepted
P3 reference/font differences remain documented above.

final result: passed


## Footer signature refinement
Approved user-supplied markup and font specification: | italic by ENCERO, Lato Bold700, uppercase0.14em tracking; no .systems. Font and bundled license copied. Browser verification completed below.


Footer signature post-fix evidence: `qa/encero-credit-muted.png`1037×1076px,
focused `qa/encero-credit-footer.png`. Source target is the exact markup/CSS and local
Lato font supplied by the user. Existing footer composition remains intact.
Lato700 loaded successfully, computed tracking1.96px at14px confirms0.14em;
“by” italic, divider half opacity, href https://encero.systems/. No .systems suffix.
User follow-up requested less white-on-black emphasis: signature opacity0.68,
restoring full opacity on hover or keyboard focus. Surrounding color inherited.
Font and bundled license bytes copied without modification.
Responsive check: actual321CSSpx viewport scrollWidth321, identity width256.53px
fits within its horizontal gutters; desktop1037px also fits. A diagnostic291px
viewport exposed the existing masthead minimum width; supported320px layout
remains intact. No new console warnings/errors. Five surfaces: typography and
color match the supplied signature plus requested opacity; footer rhythm,
original logo pixels, and all other copy unchanged. No actionable P0/P1/P2
findings. Focus treatment retained. No external publication performed.

The earlier attempted before/after capture did not preserve the footer scroll position and was rejected as comparison evidence; only the verified muted footer capture is used for this narrow user-specified CSS change.


## Incapunk material and hero hierarchy refinement
User approved panel rims, button depth, active tabs; requested small Welcome to, modern programming language subheading and four qualities. Browser and comparison checks completed below.


### Post-fix evidence: materials and revised welcome
- Source: prior approved `qa/incapunk-reuse/06-current-home.png`, old Incapunk
  component captures under `qa/incapunk-reuse/`, and the user's exact new copy.
- Implementation: `qa/materials-final.png` and `qa/materials-desktop.png`;
  `qa/materials-tablet-820.png`, `qa/materials-mobile-320.png`.
- Combined comparison: `qa/comparison-materials-hero.png`, source left/current
  right. Both compare the1037×1076CSS viewport at top scroll position.
  Before capture1037×1076px; raw current1037×1076 includes browser-backend
  padding from fractional1.1density. Its943×978rendered area is normalized
  back to1037×1076 in `materials-final.png`. The selected example differs
  (old results, current typed data); code line count/content differences are
  not reported as defects. Focused `qa/comparison-materials-buttons.png`
  compares button material, old above/current below.
- Typography: Exo2 retained. Welcome prefix20desktop/17phone; original wordmark
  remains the main identity. Tagline is uppercase14desktop/12phone with
  restrained tracking. Four qualities are semantic list items. Removed the
  dangling presentation period beside the wordmark; accessible H1 name remains
  Welcome to Incan.
- Rhythm: hero desktop heights and original artwork alignment unchanged.
  Phone height760 accommodates new copy and stacked actions. At820px copy
  endsx331.53, cube startsx476.62; no overlap. Source and current comparison
  preserve page structure; new copy spacing is intentional.
- Color: near-black panels retained; subtle1px metallic rims, inset headers,
  shallow gold button gradient and cyan secondary rim. Selected tabs use
  a gold line and local tinted fill. On phone a localized upper-scene shade
  keeps the small text readable over the architectural image.
- Image quality: original cube and Incus unchanged, clean-alpha wordmark reused;
  no new generated art. Footer signature and community composition retained.
- Copy: A modern programming language; Static typing; Readable source;
  Native compilation; Rust compatibility.0.7preview framing and benchmark
  evidence labels unchanged.
- Functional: Typed data and Combinators select matching file and annotation
  content; phone selector selects Architect (architect.sh), all9options remain.
  ScrollWidth equals viewport at320,820,1037,1440 and2880. No broken images;
  fonts loaded and captured warning/error list empty. Reduced-motion CSS still
  disables transitions. No new JavaScript behavior or external publication.
- No actionable P0/P1/P2 findings remain in this scoped refinement. This does
  not claim compiler/runtime validation or a full accessibility conformance audit.
