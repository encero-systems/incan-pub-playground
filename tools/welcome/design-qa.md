# Community intermediate-width layout QA

## Source and requested correction

User-annotated 700 × 1077 view: excessive empty second-row area in the community section. Before capture: `../../incan-io-directions/obsidian-incan/qa/community-medium-before.png`. The before image reuses the earlier settled `footer-mono-tiny-viewport.png` capture, which matches the user annotation; the first fresh before capture was mid-scroll and discarded. Approved identity, content, Incus and decorative rails retained; the requested correction is layout density at this width.

## Evidence and normalization

Evidence folder: `../../incan-io-directions/obsidian-incan/qa/`.
- `community-medium-after.png`: live 700 × 1077 viewport, matching before state/route.
- `community-medium-comparison.png`: before and after community crops placed together at identical 700px width, top aligned without stretching; the height reduction remains visible.
- `community-medium-preview.png`: final community/footer context crop.
- `community-medium-560.png`: lower edge of the new side-by-side breakpoint, 560 × 800.
- `community-phone-320.png`: existing stacked phone layout, 320 × 800.
Rendered screenshots use actual CSS dimensions and 1× pixels; temporary viewport overrides reset after checking. Focused full-size section crops show typography, image placement, links and rail together; no additional micro-crop needed for this spacing change.

## Findings and repair history

[P2, fixed] At 700px the <=740px rule made a flex column: centered copy followed by an independent 245px portrait row. Section measured 485.79px high and left most of that portrait row unused. Added a 560–740px grid with a flexible 180–220px portrait column and 24px gap; Incus remains at the bottom edge and community copy occupies the adjacent column. Section now measures 246.90px at 700 and 560px. Comparison confirms the empty second row is removed.

No remaining actionable P0/P1/P2 issues within the changed section.

## Fidelity surfaces

- Typography: existing font family, weights, sizes and copy retained. Heading and supporting text fit at both checked grid widths.
- Spacing/layout: side-by-side 560–740px, original stack below 560px. Portrait/copy bounds do not overlap; community actions and project links fit. No horizontal overflow at 700, 560 or 320px.
- Colors/tokens: existing obsidian, gold, cyan, backdrop opacity and fancy rail preserved.
- Image quality: original Incus and community backdrop reused; natural portrait proportions, no new approximation or stretch. Incus remains visibly separated from backdrop.
- Copy/content: all community links, action text, Incus link and footer credit remain. Footer stamp retains latest 96px desktop / 92px narrow size and credit keeps its 3px downward adjustment.

## Verification

Native Incan rebuild and source formatting pass. Homepage parity/static/source/output digests and nine-page docs checks pass. Browser console error log empty. Changes limited to one intermediate-width CSS block in Incan theme authoring. Desktop rules above 740px and phone rules below 560px retained.

## Follow-up polish

None required for this change.

final result: passed

## 2026-10-24 — topic-first content experiment and narrow hero

Result: passed for prototype scope. No publication.

- Six authored experiment pages join the nine retained pages in the existing Incan/Pallay Markdown pipeline. The original nine source snapshots were not rewritten.
- Guide/lookup routes, all local links and anchors, exact fenced text, heading IDs, page/source receipts, and source provenance pass the documentation checker.
- Three Date method signatures match the retained Incan source exactly. API generation is explicitly not claimed; no new 0.6 snippet execution is claimed.
- Desktop trait guide visually inspected at 1440 CSS pixels; task page inspected at 320 with no horizontal document overflow. The existing shell, type, gold/cyan colors, code treatment and footer remain intact.
- The 700px hero was 760px high; it is now 490px, with the emblem beside the introduction and lower art rather than occupying a separate tall row. 560px and 320px compositions also inspected without horizontal overflow. Below 560px the environment is lowered and fades behind the copy so the emblem remains on the plinth.
- Evidence: `qa/hero-tablet-before.png`, `qa/hero-tablet-after.png`, `qa/hero-phone-after.png`, `qa/docs-traits-desktop.png`, `qa/docs-experiment-overview.png` under the generated site.
- Content evaluation protocol and answer key are in `tools/welcome/content-experiment.md`. Actual reader comprehension has not yet been tested; visual/build checks do not establish it.

## 2026-10-24 — integrated 0.6 media kit

- Replaced the footer's raw-file destination with native Incan/Pallay `media.html`; original Katie file retained unchanged as provenance.
- Reused approved header, rail, artwork, community band and footer. Added reusable description download, code introduction, ecosystem, creator, brand downloads and resource links. Retained Katie attribution.
- User moved website launch to 0.6. Shared release badge now says Preview · 0.6. Homepage historical benchmarks remain labelled historical, and unmeasured build/source-size ambitions are labelled research goals, without 0.6 timing or token-count claims.
- Native build, homepage parity/digest checks, all 15 documentation checks and formatting passed. Media local links, assets, downloads and anchors resolved. Browser console had no errors.
- Browser checks at actual 320, 700 and 1440 CSS pixels showed no horizontal overflow. Fixed a clipped wordmark preview by containing the complete asset. Temporary viewport reset. Screenshots: media-phone.png, media-desktop.png, media-assets.png under generated qa/.
- Release follow-up: imported tutorial/API snapshots still carry their documented 0.5/source-preview limitations. This change does not establish 0.6 tutorial execution, API-generator output or full release readiness. Public deployment was not performed.

## 2026-10-24 — creator portrait

- Restored Danny's portrait alongside the biography at 140 × 187 CSS pixels, reducing to 90 × 120 at phone widths. At 320px, the biography flows full-width below the portrait and name.
- Original photo extracted unchanged from Katie's embedded JPEG. Built-in Image Gen created a dark architectural background without poster lettering; a follow-up edit changed the dyed hair to cyan at Danny's request. Originals and exact prompts retained in static/assets; asset SHA256 manifest updated.
- Native build and output/asset receipt checks passed. Browser verification at 320 and 700px showed no horizontal overflow and the new image loaded. Normal viewport restored; screenshot qa/media-cyan-portrait.png.
- Ray-Ban Meta frame details requested; that subsequent glasses edit is pending the user's answer.

### Approved glasses update

Danny supplied translucent grey Ray-Ban Meta frames and requested clear lenses, then approved the generated result. `danny-meijer-cyan-meta.png` is now the displayed portrait. Exact built-in Image Gen prompt and preceding variants are retained. Native build and receipt/asset checks passed; browser verified the final file loaded in the biography. Screenshot: qa/media-approved-portrait.png. This resolves the pending frame-details item above.

## 2026-10-24 — restore Katie's editorial contribution

- Restored Katie's readability/precision explanation, original introductory example (colon and `.incn` fixed), practical project learning path, full AI-first vision, Oven explanation, fuller Danny biography including Nike and teaching, resource introduction and roadmap guidance.
- Kept the approved layout language, portrait, brand downloads and reusable description. Expanded the page with Projects and Vision navigation. Attribution now leads with “Media kit prepared by Hamstrong Katie” and identifies the 0.6 adaptation.
- Targeted updates remove obsolete Rust-generation framing and 0.5 release positioning. The 0.6 preview is not labelled shipped; longer-term vision remains distinct from available functionality.
- Native build, homepage receipts/parity, all 15 docs checks and media local links/anchors passed. Original Katie HTML remains unchanged.
