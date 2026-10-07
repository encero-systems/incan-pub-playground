# Deterministic static package pages

The Incan renderer builds the catalog and six vertical, anchored package documents from the frozen `assets/site/packages.json` bundle. No language model, registry resolution, package compilation, live statistics calls or GitHub credentials are involved in rendering.

From the repository root, with Incan **0.5.1**, Rust **1.98.0**, and Node/npm installed:

```sh
python3 -m venv tools/site/target/highlight-venv
source tools/site/target/highlight-venv/bin/activate
python3 -m pip install -r tools/site/requirements.txt
npm ci --ignore-scripts --no-audit --no-fund
npm run build
npm run check
python3 -m http.server 8817 --bind 127.0.0.1
```

`npm run build` compiles the authored `.incn` renderer through Oven, then renders static HTML using the pinned `markdown-it` CLI for author documentation. Generated Rust is a compiler artifact; no new Rust is authored. All main sections are in initial HTML. Browser JavaScript adds local filtering, anchors, dialogs and clipboard behavior, and never fetches package content.

## Inputs and provenance

The bundle pins the existing six-package playground snapshot to index commit `65d45e9e40ab2f5a04a67788dc2282b349e3f8d8`. Descriptions, SPDX license expressions, feature edges, dependencies, source and asset identities come from the original recorded manifests/events. Context and real daily download values were collected in the existing one-shot popularity trial on October 7, 2026. Neither the registry nor upstream counts represent unique people or installs.

Documentation was extracted from the exact adopted crate archive after its whole-file SHA-256 matched the recorded adoption checksum. Each frozen README carries its own file digest. Relative README links resolve against the VCS commit and path recorded inside that archive, rather than a guessed release tag. Markdown HTML is disabled; remote badge/images are omitted while alternate text and links are retained. Author prose and Cargo examples remain upstream Rust documentation.

Charts are **bundled quantitative assets** plotted from the frozen daily rows, with digests recorded in the bundle. This renderer does not regenerate plots or recollect statistics. A future refresh must replace the JSON, scoped documentation and matching charts together, then rerun checks and publish one coherent commit. Rendering never changes a collection timestamp or rewrites missing data as zero.

The feature expander traverses local default edges transitively, records deterministic breadth-first activation paths, terminates on cycles and ignores weak `dependency?/feature` forwarding when deciding optional-dependency activation. It is a declaration preview, not an Oven resolution: target predicates are printed as conditions, requirements are not resolved versions, and indexed build bindings remain separate evidence. Empty feature edges do not mean no effect in source. The tests cover transitive defaults, cycles, weak forwarding, optional activation, target-specific records, escaped metadata, single-pass template expansion, scoped routes, asset digests and byte-for-byte replay.

Only adopted package records are accepted by this prototype. Direct publishing is deliberately rejected until its registry metadata contract is implemented. Full scoped IDs already key page routes and chart paths; a future owner edition can have separate inputs, history and counts. Same names do not establish publisher relationships or automatic migration.

## CI and collection

`.github/workflows/site-check.yml` is a **manual-only** Linux build/check recipe using a checksum-pinned official Incan release and the npm lockfile. It does not collect data, schedule runs, deploy, or push changes. It has not been dispatched or verified on Linux. Local build and tests were run on macOS. GitHub Pages retains the repository's existing publication mechanism.

The separate on-machine collector remains in `tools/popularity/`. No nightly collector or cron entry is installed by this change. Run collection explicitly, retain last-good values after failed refreshes, and publish a reviewed complete snapshot.

## Preview boundaries

The catalog and dependents cover six records, not the entire index. All six latest versions have a detail document; older history rows link to upstream entries rather than reuse the current version's build data. Matching changelog sections are bundled for regex and tokio, extracted deterministically from their verified crate archives; other packages show a truthful unavailable state. Security advisory feeds are not bundled. Abuse and vulnerability dialogs clearly state that no registry reporting destination is configured; they send nothing.

For thousands of packages, retain one document per scoped identity/version and fetch only the requested page. Replace this six-row client filter with a compact search index and pagination; do not embed the entire registry's manifests and asset records into the catalog. Production snapshot admission, scalable search, additional version documents, owner publishing and trusted edition relationships are outside this playground.

## Code highlighting

Rust (`rust`, `rs`, and rustdoc flags such as `rust,no_run`), Incan (`incan`, `incn`) and TOML fences are highlighted at build time by Pygments 2.19.2. The complete recorded manifest is also highlighted; the compact install snippet retains its existing TOML colors and exact copy text. Incan uses the pinned documentation lexer and registry token snapshot in `vendor/`; no language autodetection is performed, and unsupported/unlabelled blocks remain plain text. Only the trusted bundled lexer is executable; package language labels never become paths or commands. Token colors are scoped to code blocks. Code bytes and HTML escaping are checked in fixtures, and no browser highlighter, extra script or live highlighting service is required.

Documentation preprocessing hides HTML comments in prose, including multiline comments. Literal HTML/comment text inside inline or fenced code remains visible; raw author HTML is still disabled. This also keeps literal `<img>` and `<br>` examples intact while removing live badges outside code.
