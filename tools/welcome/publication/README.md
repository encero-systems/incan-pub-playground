# Shared documentation publication: staging consumer

This is the website-side connection to Pallay's real `load_docs`, `docs_files` and `publish_docs` APIs. The Incan consumer uses the existing content map:402 exact Markdown inputs (379 reader pages and23 supporting inputs), plus10 explicit code/diagram/shell include inputs in `publication/include-inputs.json`. It preserves current directory URLs and calls the shared parser in strict `incan-book` mode. Missing or changed source files, undeclared includes, unsupported constructs and broken links stop publication. Proposed editorial destinations do not change canonical URLs.

The approved website stays untouched. A new task-owned staging directory contains a copy of the approved public preview; complete corpus pages go under `/corpus/`. The current homepage, Oven, media and `.html` chapter pilots remain intact. The new pages import the existing website shell, topic navigation and shared Incus/footer, with root-relative links for nested routes. Approved overview/topic/module navigation is regenerated under `/corpus/navigation/` with destinations into the staged corpus. The copied `.html` chapter pilots remain available separately. Static assets are reused, not regenerated. No private Pallay source is copied into this repository or into output.

## Evidence and current limits

Source and manifest checks pass, and the new consumer parses/formats with the installed Incan0.5.1 formatter. **The consumer has not been typechecked, compiled or executed against the matched0.6 toolchain.** The integration coordinator’s shared-Pallay0.6 probe currently reports a missing compiled registry dependency, `crates-io/markdown=1.0.0`; a matched dependency closure is still required. A successful static check is not completed migration or release readiness.

The content map is a frozen October24 snapshot, not the moving compiler checkout. Preflight lists every missing/changed file. Do not regenerate hashes to hide drift: review/capture an updated complete source inventory first. The supplementary manifest binds all ten currently referenced non-Markdown includes. Preflight inventories recursive explicit `--8<-- "path"` dependencies across declared inputs, rejects missing/cyclic/escaping includes and changed bytes, and never expands or renders Markdown. Shared Pallay remains responsible for parsing and include expansion. Newly introduced inputs require a reviewed manifest update. The engine supports only directory URLs, so existing `.html` pilots are retained independently. Full Material compatibility, diagram rendering, style mapping for newly parsed callouts/tabs, version aliases/redirects and static browser query search remain acceptance work. The engine's generated search page is currently its standard presentation; `search-index.json` alone is not a working website search feature.

The dependency pin is a private integrated source snapshot, not a published package. It includes the preserved original implementation and reviewed native compiler workarounds; focused activity checks do not establish full-package publication. Supply the exact clean checkout named by `pallay-pin.json`. A portable released dependency and matched compiler/driver/SDK closure remain separate prerequisites.

## Read-only checks

From the website root:

```sh
node --test tools/welcome/publication/check.mjs tools/welcome/publication/paths.test.mjs tools/welcome/publication/output.test.mjs tools/welcome/publication/wrapper.test.mjs
INCAN_DOCS_ROOT=/absolute/path/to/captured/docs tools/welcome/publication/run --preflight
incan fmt --check tools/welcome/src/docs_publication.incn
bash -n tools/welcome/publication/run
```

Preflight only reads inputs and prints JSON. The tests use tiny disposable files in `TMPDIR`; set it to the task-owned cache when running under the integration loop. No source is modified and no compiler build is triggered.

## Native staging gate

Only run within the coordinator’s assigned build budget, after the matching task-owned toolchain home and compiled dependency closure are ready. Set `INCAN_DOCS_ROOT` to the captured corpus, `INCAN_DOCS_PALLAY` to the exact clean pinned checkout, `INCAN_DOCS_INCAN` to the matched executable, and `INCAN_HOME` to the prepared matching compiler home under this worker's cache root. `INCAN_DOCS_CACHE` must name a **new direct child** of workspace `tmp/.ralph-cache/encero-v1-publishing/docs-integration/`.

```sh
tools/welcome/publication/run --build
```

The wrapper resolves source/dependency/compiler inputs to physical absolute paths before changing directory, builds the Incan consumer directly using the prepared dependency closure, copies the existing public preview to a fresh staging site, then runs strict publication. Before reporting success, it checks emitted reader pages, staged overview/topic/module links and module-reference destinations with `publication/output.mjs`. It never deploys. A failed run may leave its own partial staging/cache directory; it must not be served as a successful publication. `corpus/receipt.json` is a development input/output receipt, not a signed release. The underlying publisher is not atomic. Review the receipt and full page/anchor coverage, compare approved visual/interaction regressions at phone/tablet/desktop widths, then run without Python installed before considering production replacement.

The matched 0.6 CLI provides `build` and `run`; it does not provide the legacy `lock` or `oven bake` commands. Dependency admission/preparation is a separate prerequisite, including the exact shared Pallay source and its compiled Markdown dependency. The wrapper never tries to prepare that closure through a legacy publisher. A missing dependency must fail the build.

The wrapper deliberately does not copy shared caches or download a toolchain. Existing MkDocs/Mike production deployment and registry Pygments remain elsewhere; this source increment does not claim either has been removed.

The output-checker tests use small HTML fixtures to prove that stale topic navigation and missing references are rejected. They are not proof that the new Incan navigation renderer has executed. Run `node tools/welcome/publication/output.mjs /absolute/staging/site/corpus tools/welcome/content-map.json` against a real native publication when the matched dependency closure is available.

The wrapper sequence test runs this actual shell script against a tiny temporary source/dependency fixture and a controlled CLI stub. It verifies only `--version`, `build` and `run` are invoked; relative paths survive the directory change; and version/build/run/traversal failures prevent a success message. This is host contract evidence, not compiler or rendering proof.
