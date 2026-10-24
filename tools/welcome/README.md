# Incan-authored welcome page

This is a separate implementation of the approved Incapunk 2.0 homepage. The hand-authored HTML reference at `incan-io-directions/obsidian/` is preserved. Generated output is in `incan-io-directions/obsidian-incan/`.

## Build and preview

From the repository root, with Incan 0.5.1 on PATH:

```sh
tools/welcome/build
node tools/welcome/check.mjs
python3 -m http.server 8923 --bind 127.0.0.1
```

Open `/incan-io-directions/obsidian-incan/`. The HTTP command is only a static preview server; the application does not use Python. `INCAN_WELCOME_INCAN` selects the compiler; `INCAN_WELCOME_CACHE` selects an isolated cache; `INCAN_WELCOME_OUTPUT` selects another generated output directory.

The builder explicitly bakes the pinned Pallay library, then the consumer, then runs the native Incan executable. It does not load the reference HTML or its JavaScript to construct the page. Artwork, fonts and icon licenses are bundled under `static/`; the builder copies those assets to the generated site.

## Authoring boundary

- `src/layout.incn`, `page.incn`, `components.incn`: structured document components and reusable composition.
- `src/examples.incn`: the nine examples, highlighted source, explanatory notes and anchor identities.
- `src/interaction.incn`: typed session state, next/previous wraparound, explicit selection, pause/play, note highlighting and menu transitions. Pallay validates the bindings and evaluates the same transitions natively.
- `src/mechanisms.incn`: browser policy for timing, visibility/focus/hover guards, keyboard gestures, clipboard feedback, dynamic ARIA attributes and measured annotation links.
- `src/theme.incn`: the approved appearance declaration. Generated CSS retains the approved rules; only trailing whitespace differs.
- `src/browser_target.incn`: a generic browser adapter emitted as JavaScript. It supplies browser-only APIs and DOM measurement from the declared policy; it contains no example names, page copy or application-specific branches. The existing LeaderLine library renders the connectors.
- `vendor/pallay`: a pinned local snapshot of the executable Pallay foundation, with its original license. `vendor/pallay-provenance.json` records baseline file hashes; `vendor/overrides.json` records the responsive-image and initial-document-projection extensions. The upstream Pallay checkout was not modified.

Incan owns the authored components, content, appearance, state and interaction rules. Browsers execute emitted HTML/CSS/JavaScript: this is not an Incan-to-WebAssembly claim. The main document is rendered at build time, including the initial example state; client-side code adds interactivity. There is no new authored Rust.

## Evidence and limits

`build-receipt.json` records the compiler identity and source/output hashes. `reference.json` records native Incan transition results. The check command compares the emitted reducer against that oracle, checks all selections, verifies rejected-event atomicity, document IDs, binding targets, asset bytes and build hashes. These are development receipts, not signed releases.

The website now targets the 0.6 release preview. Compiling this site with 0.5.1 does not establish implementation of 0.6 language features or new benchmark results. Historical measurements remain labelled as historical, and longer-term performance ambitions remain goals. Imported documentation snapshots retain their explicit source and version context.

`repros/triage.json` documents the installed compiler's legacy string-lowering workarounds and related closed reports. No shared compiler/Oven cache or unrelated checkout was repaired.

## Real Markdown documentation preview

The same build now imports three unchanged Markdown snapshots from the actual Incan docsite into `docs/`: What Incan is for, Modeling with enums, and the collections reference. Open `docs/index.html`, or use Docs in the homepage masthead.

Run `npm ci --ignore-scripts` once for the repository's development-only DOM test dependency, then `node tools/welcome/check-docs.mjs` to verify source bytes, fenced examples, links, anchors and import receipts. The native build also runs its own parsing fixtures. Visual and browser evidence is recorded in the generated `docs/design-qa.md`.

`src/markdown_docs.incn` calls the pinned `markdown` 1.0.0 Rust crate directly through Incan interop. Standard Markdown/GFM parsing is supplied by that existing library. Incan handles the Material callout/language-panel adapter, structured Pallay nodes, stable headings and table of contents, lexical code colouring, URL routing and native document rendering. No new Rust is authored; no browser Markdown parser is used.

`src/docs_layout.incn` shares the homepage header/footer and appearance. `src/docs_main.incn` validates native parser fixtures and writes the pages and `docs/import-receipt.json`. The source files and their Apache-2.0 license live under `docs-source/`; its manifest records the repository commit and exact source hashes. It is a local working-tree snapshot, not an assertion that those bytes were published in that commit. Generated pages offer an original-Markdown link.

Material language tabs become labelled static panels with both examples visible; callouts use native details/summary. Snippet includes/macros fail explicitly until their sources and semantics are imported. This is a three-page parsing experiment, not full MkDocs compatibility. Source claims remain unchanged and may describe a different release horizon than the homepage.

The first dependency fetch must populate Cargo's registry cache with the pinned `markdown` crate and its `unicode-id` dependency before the offline compatibility publisher can bake it. The application remains Incan; Cargo is dependency tooling.

## Complex-page expansion and 0.6 architecture

The reader now has nine pages: eight unchanged docsite snapshots plus an authored 0.6 architecture adaptation. The additional imports are Getting started, Build a typed API, Web framework, Rust interoperability, and Compile time and runtime. Eight copied snippet inputs are expanded by Incan, including nested installer snippets, complete Incan examples and the shared RFC reference definitions. The adapter preserves reference definitions across callout/panel chunks and retains GFM footnotes and their backlinks.

Explicit tutorial HTML regions (`aside`, step lists, captions and Markdown-enabled sections) enter through Pallay's validated tree. Standard Markdown retains the Rust parser's safe HTML defaults. Unknown raw HTML is rejected rather than silently dropped. Native fixtures cover unsafe HTML rejection, include traversal rejection, duplicate headings and parsed Markdown inside tutorial regions.

`docs_architecture.incn` adds reading paths to the new Markdown draft at `docs-source/contributing/explanation/architecture_0_6.md`. The draft follows current governing issues #652, #1337, #654, #1675, #870 and #1034 read on 2026-10-23. In particular, normal compilation targets the pinned rustc through declaration injection and MIR, with no generated Rust; Oven semantic policy belongs in Incan behind the bounded host kernel. This replaces the old pipeline instead of merely reskinning it. It is clearly a development design, not a completed-release claim. The previous architecture source remains under `docs-source/contributing/explanation/architecture.md` as reference material, with its digest recorded in the snapshot manifest.

`docs_diagrams.incn` emits the generic Mermaid browser mechanism; the existing docsite's vendored Mermaid runtime and MIT license are copied without modification and covered by the asset manifest. The three diagrams retain their original source behind native details controls. All content parsing, expansion, routing and document rendering still runs in the native Incan builder; only diagram drawing uses the browser library.

Verification now covers nine pages, independently reconstructed include expansion, exact fenced-code text, source/output receipts, local links and anchors, tutorial metadata/steps/panels, footnotes and 0.6 content guards. The latest QA report is `incan-io-directions/obsidian-incan/docs/design-qa.md`.

## Topic-first content experiment (2026-10-24)

Six authored Markdown pages under `docs-source/experiment/` now join the nine earlier pages. Start at `docs/explore.html`: dates and times, trait capabilities, and an Oven project workflow. The Date API sample is explicitly a manually authored preview of future generated reference, checked against source. Original snapshots remain separate; `experiment-evidence/manifest.json` records the exact local evidence. See `content-experiment.md` for the editorial map, reader tasks, and migration decision criteria. No reader study, new 0.6 example execution, or production API generator is claimed.

## Media kit

`src/media.incn` authors the integrated 0.6 media page, its scoped styles and downloadable description. The shared footer links to `media.html` from both the homepage and docs. It reuses the approved shell, artwork and community section, retains Katie's credit, and distinguishes the release preview from the longer-term AI vision. Brand downloads use the existing assets; no vector masters or additional license grants are implied.

Katie's original file remains unchanged at `static/assets/incan-media-kit.html` for provenance, covered by the asset manifest. It is no longer the linked media page. The original source remains in Downloads.

The creator portrait uses `static/assets/danny-meijer-obsidian.png`, an identity-preserving built-in Image Gen edit of the photograph embedded in Katie's file. The extracted original remains `danny-meijer.jpg`; the exact prompt is retained as `danny-meijer-obsidian-prompt.txt`. The website displays the edited portrait at 140 × 187 CSS pixels (90 × 120 on phones), alongside the biography.

The displayed variant is `danny-meijer-cyan.png`: a second built-in Image Gen edit changing the dyed curls to cyan at Danny’s request. The exact follow-up prompt is `danny-meijer-cyan-prompt.txt`; the original and orange-haired edit are retained.

Final approved portrait: `danny-meijer-cyan-meta.png`, with cyan curls and translucent grey Ray-Ban Meta-style frames with clear lenses, matched to Danny’s supplied reference. Generated with built-in Image Gen; exact prompt: `danny-meijer-cyan-meta-prompt.txt`. Earlier portrait variants remain preserved.

## Complete documentation content map (2026-10-24)

`content-map.json` inventories all 402 Markdown files from the recorded Incan docs snapshot and assigns reader-facing topics, editorial actions, source/API ownership and proposed migration URLs. `content-strategy.md` explains the consolidation decisions and the difference between this navigation redesign and the remaining body/redirect migration.

`src/docs_catalog.incn` owns the new seven-section navigation, section hubs and the editorial migration map. The existing 15 rendered pages retain their provenance; remaining bodies are explicitly linked to the current docsite. Source-generated API documentation is still future work. The new `docs/index.html` is the primary entry; `docs/content-map.html` exposes every classification.

After building, run `node tools/welcome/check-content-map.mjs`. Supply the original docs directory as its optional argument to independently compare every Markdown filename and source digest against the inventory. `check-docs.mjs` now also validates all generated section hubs and their local anchors.

### Files and configuration pilot

`docs/configuration.html` combines selected-field configuration loading into one task guide across file I/O, TOML and JSON. `docs/configuration-pilot.html` records the consolidation boundaries and reader trial. Three complete reference snapshots remain separate contract homes. Example programs and pinned source evidence are in `configuration-pilot/`; the examples are source-checked but await execution with the matching 0.6 compiler. The renderer and navigation remain authored in Incan.

### Module navigation and documentation types

`docs/nav-library.html` lists 26 documented modules alphabetically, in column-first order. Each module has its own overview with separate How-to, Tutorial, Explanation and Reference sections, plus a direct reference shortcut. `std.datetime` uses the complete imported module reference at `datetime-api.html`; the earlier Date-only API sample remains separate. Links to unimported bodies retain the Current docsite label.

Every inventory entry has an explicit `doc_type`. Rendered documentation pages and directory entries show Tutorial, How-to, Reference or Explanation badges; navigation hubs use Overview and authoring inputs use Supporting material. These labels describe the current page purpose, independently of topic, migration status and release readiness. The checkers verify type coverage, module membership and reference routes.
