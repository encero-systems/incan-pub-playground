# Oven chapters and library exercise

The Oven landing page retains the approved imagery and layout. New content separates programs from library Loaves, explains reuse briefly, and links to focused chapters instead of reproducing the old Alpha page.

- `docs-source/experiment/loaves.md`: Explanation.
- `docs-source/experiment/build-troubleshooting.md`: How-to.
- `docs-source/experiment/library-project.md`: Tutorial replacing the historical build-and-consume route.
- `examples/library-project/`: source for the downloadable exercise.
- `verification.json`: actual execution evidence, kept out of reader-facing prose.

Source basis: the website's selected 0.6 documentation snapshot, recorded in `core-topics/evidence.json`; Oven ecosystem explanation, CLI reference, dependency and project configuration docs. DD-0007 is a draft design record, not a stable artifact-format specification. The chapters therefore explain package roles without promising file-layout stability.

The exercise ran on the existing macOS arm64 0.6 development bundle: fresh and repeated consumer runs printed 36, a standalone library build passed, unit inspection selected the local pricing library, and changing only the library implementation caused the consumer to print 41. The trace excerpts in the chapter come from these runs. Final release and native Windows execution remain release checks. The site generator itself uses the existing Incan/Pallay build workflow; that compiler is separate from the example runtime.

Build with `tools/welcome/build`. Verify with the existing site, Oven, docs and content-map checks plus `node tools/welcome/check-oven-content.mjs`.
