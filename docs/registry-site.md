# Registry-backed Incan.pub

The existing Forge/Archive Hall design now renders the registry catalog, rather than a hand-maintained set of six package pages.

## Data and identity

`assets/registry/snapshot.json` pins index `18c77d028d27bcd9bb4f7c951834521236c93e4b`. Its 1,311 packages contain 1,707 adopted versions. The input retains the authoritative package JSON, manifests and referenced content blobs. It does not mirror source archives, binaries or the event log.

The Incan snapshot command reads a clean index checkout and validates scoped identities, versions, declared paths and schemas. The formatting boundary verifies every retained document's SHA-256, byte size and UTF-8 before rendering. Git attributes preserve digest-bound inputs without line-ending normalization. Whitespace checks apply to authored files; retained upstream bytes and generated HTML containing that literal source are excluded from whitespace normalization. Formatting keys include both digest and recorded format: identical bytes can legitimately be Markdown in one declaration and plain text in another.

Every package has a latest landing page and every indexed version has its own static document at `packages/<scope>/<name>/versions/<version>/`. Version pages have their own manifests, documents, features, dependencies and assets. The selector and release table link to those exact pages. The index's `latest` policy determines the landing page; upstream release dates are not inferred from adoption dates.

## Browsing

The catalog has 50 rows per page and real static pagination, including when JavaScript is disabled. An approximately 677 KB summary index adds name/description/keyword search, exact-name ranking, category and SPDX filtering, build-platform filtering, sorting and browser history. Only one result page is inserted in the DOM. No package manifests or READMEs are downloaded to search the catalog.

License controls support a contained SPDX identifier or an exact expression. A contained identifier is not a claim that the entire license expression can be ignored. Platform filters refer to indexed builds for the selected latest version, not universal upstream compatibility.

## Documentation and evidence

READMEs honor their declared paths. Labels distinguish author-provided files from registry-generated content. All license documents are retained, including dual licenses and generated declaration notices. Packaged changelogs can contain multiple releases and are labeled accordingly. Missing authors and observations remain missing.

Rust, Incan, TOML and C/C++ code fences are highlighted at build time. The five recorded reStructuredText documents are presented as literal text, without executing reStructuredText directives. Pinned Pygments remains the formatting dependency, invoked once for a batch rather than once per code block. Node's pinned Markdown-it supplies Markdown formatting; registry selection and page projection remain authored in Incan. Raw author HTML is inert, prose comments are suppressed and remote images are omitted. Relative links use recorded VCS commit/path evidence for supported repository hosts; they are not guessed from release tags.

Dependents are reverse direct declarations across all indexed versions. They are not a claim that a requirement resolves to the displayed version. Build sections preserve unit identities within grouped bindings and show the registry's attestation references. This site does not independently verify attestation signatures or rebuild packages. Bound-fact statuses remain separate from asset availability and vulnerability coverage.

## Statistics and future publications

The existing six-package popularity observations remain dated October 7, 2026. They are labeled historical, source-specific and across versions. Packages without collected statistics show an unavailable state, not zero. Homepage popularity rankings explicitly cover only those six measured packages; its random selection loads the compact search summary lazily and samples the whole indexed catalog. The static curated selection remains a fallback if that optional request fails.

The current index has only adopted Rust libraries. No C/Clove or owner publication is fabricated. The Clove contract in `package-data-design.md` remains the producer/renderer extension point once actual C records exist. Unknown scopes are refused during snapshot import instead of silently receiving a Rust layout.

The reporting UI retains its explicit unconfigured state. A confidential reporting destination, advisory-source ingestion and optional statistics scheduling are separate configuration/work; this update does not invent those services or install cron jobs.

## Build and refresh locally

Prerequisites: installed Incan 0.5.1 toolchain, its matching Rust toolchain, Node 22.13 or newer compatible with jsdom, and Python with `tools/site/requirements.txt` installed. These are build dependencies; published pages are static.

```sh
npm ci --ignore-scripts --no-audit --no-fund
python3 -m pip install -r tools/site/requirements.txt
npm run build:tool
# Only when deliberately updating the pinned registry snapshot:
npm run snapshot -- /absolute/path/to/incan.pub-index assets/registry
npm run build:site
npm run check
python3 -m http.server 8817 --bind 127.0.0.1
```

`npm run build` combines tool compilation and offline site generation. Build and tests make no live registry or popularity requests. Snapshot refresh is an explicit on-machine operation against the owned index checkout. Commit the complete candidate inputs and generated output together after checks; do not publish a partially refreshed directory.

The new renderer keeps the previous fixture rendering mode so its feature activation, escaping and syntax-highlighting regression cases still run. Existing and new tests cover the entire package/version route set, static pagination, document checksums, multiple licenses, generated notices, exact version data, compound license filters, stateful DOM controls and a byte-identical full replay.

## Verification limits

Local functional checks use Node and jsdom; jsdom does not prove rendered layout or touch interaction. Native/in-app browser discovery was unavailable and Safari inspection timed out during this implementation, so a fresh screenshot comparison is not confirmed. The retained CSS/assets and masthead structure are preserved, with new controls styled to match, but visual QA remains a distinct follow-up check. No manual GitHub Actions verification workflow was dispatched.

The released compiler needs the same explicit string conversions already documented for #1668. Arithmetic is materialized before conversion to avoid the released emitter's precedence issue, and text copies at the formatting-link boundary are explicit. No Rust helper was authored and the development compiler was not modified or assessed.
