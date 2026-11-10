# .COMIC website source snapshot

This is the Incan source for the [approved Edition 02 preview](../../comic/v2/), with its [release style pin](../../comic/STYLE-PIN.md). Incan owns the documents, appearance, content, diagrams, highlighting and interaction declarations. Pallay lowers them to browser output. The Python `build` script performs staging, native compilation and asset copying only; no consumer application JavaScript or Rust was authored here.

## Rebuild

Provide `COMIC_INCAN_HOME`, `PALLAY_SOURCE`, `COMIC_RUST_SYSROOT` and `COMIC_BUILD_ROOT` as absolute paths to a compatible installation, the matching Pallay source, the matching Rust sysroot and a disposable build directory. Then, from the repository root:

```sh
COMIC_OUTPUT="$PWD/comic" COMIC_BASE_PATH=/incan-pub-playground/comic tools/comic/build
```

An empty `COMIC_BASE_PATH` emits the original origin-root routes. The publication mount is `/incan-pub-playground/comic`; the selected front page is `comic/v3/` (Edition 03), with Edition 02 retained at `comic/v2/`, and `comic/index.html` preserves the original.

This snapshot used Incan `0.6.0-dev.8` and a matching Pallay development source with a LocalTimer mechanism. Their fingerprints are in the public receipt. The dependency is not claimed as a registry release and is not bundled here. A fresh machine needs that compatible closure; these files alone are not evidence of a portable released toolchain. Compilation uses the existing native toolchain without new Rust code.

## Pins and verification

The approved source snapshot ID is `6d105d53a585132fe1da13fdc739b3f53aaf421c`. The original publication added optional path-prefix handling in `src/main.incn`; the hosting-neutral build script gets local paths through environment variables. Later companion identity and Edition 03 additions are recorded separately; the original tag remains the reference for its 50 outputs. The mounted HTML is then checked to differ solely by that prefix. Binary assets retain their exact bytes.

`../../comic/publication-receipt.json` includes hashes of every source/static input and published site output. The artifact is published from `main` through the repository's existing Pages setup; no new scheduled CI job is introduced.

Validate the pinned publication from the repository root with `python3 tools/comic/check-publication.py`. It checks the frozen source/output hashes and local link targets; intentional later changes need a new receipt and baseline.

Crumb now has a dedicated Incan-authored chapter and a vector companion mark. See [identity notes](../../comic/CRUMB-IDENTITY.md) and [logo generation](brand/README.md). The original style tag remains an immutable baseline; the current receipt records subsequent additions separately.

Edition 03 is authored in `src/v3.incn`, reusing Edition 02 appearance and the shared chapters. Its comparison uses a new [Incus illustration](brand/incus-edition03.md); Edition 02 generated HTML remains unchanged.

The Edition 03 [comparison chapter](COMPARISON.md) uses one editable data file and shared local state for its three lenses. [Artwork and generation prompts](brand/field-test-artwork.md).
