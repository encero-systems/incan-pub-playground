# .COMIC website source snapshot

This is the Incan source for the [approved Edition 02 preview](../../comic/v2/), with its [release style pin](../../comic/STYLE-PIN.md). Incan owns the documents, appearance, content, diagrams, highlighting and interaction declarations. Pallay lowers them to browser output. The Python `build` script performs staging, native compilation and asset copying only; no consumer application JavaScript or Rust was authored here.

## Rebuild

Provide `COMIC_INCAN_HOME`, `PALLAY_SOURCE`, `COMIC_RUST_SYSROOT` and `COMIC_BUILD_ROOT` as absolute paths to a compatible installation, the matching Pallay source, the matching Rust sysroot and a disposable build directory. Then, from the repository root:

```sh
COMIC_OUTPUT="$PWD/comic" COMIC_BASE_PATH=/incan-pub-playground/comic tools/comic/build
```

An empty `COMIC_BASE_PATH` emits the original origin-root routes. The publication mount is `/incan-pub-playground/comic`; the selected front page remains `comic/v2/`, and `comic/index.html` preserves the original.

This snapshot used Incan `0.6.0-dev.8` and a matching Pallay development source with a LocalTimer mechanism. Their fingerprints are in the public receipt. The dependency is not claimed as a registry release and is not bundled here. A fresh machine needs that compatible closure; these files alone are not evidence of a portable released toolchain. Compilation uses the existing native toolchain without new Rust code.

## Pins and verification

The approved source snapshot ID is `6d105d53a585132fe1da13fdc739b3f53aaf421c`. Publication adds optional path-prefix handling in `src/main.incn`; the hosting-neutral build script gets local paths through environment variables. Content follows the specification stack after approval, and the receipt lists each output that differs from the approved snapshot. The zero-prefix build is compared against the approved outputs before mounting. The mounted HTML is then checked to differ solely by that prefix. Binary assets retain their exact bytes.

`../../comic/publication-receipt.json` includes hashes of every source/static input and published site output. The artifact is published from `main` through the repository's existing Pages setup; no new scheduled CI job is introduced.

Validate the pinned publication from the repository root with `python3 tools/comic/check-publication.py`. It checks the frozen source/output hashes and local link targets; intentional later changes need a new receipt and baseline.
