# Oven content and chapters QA

2026-10-25. Scope: restored Loaf/reuse introduction, focused documentation chapters, and library tutorial/download.

- Incan/Pallay generator rebuilt the landing page, documentation and source receipts.
- Site, Oven, docs, content-map and Oven-content checks passed. Local links and anchors, document types, exact displayed source, artifact digests and native/browser interaction parity are covered by those checks.
- macOS arm64 exercise execution: initial and repeated consumer runs print 36; standalone library build succeeds; describe-unit selects pricing as a local Loaf; changing only the library implementation makes the consumer print 41. Trace excerpts are from these runs.
- Reviewed at 1440px desktop and 390px phone widths. Flow, chapter typography, reader navigation and package artwork remain legible without horizontal page overflow. The longer package copy stacks above the loaf image on phones.
- Download stays on the playground, and the archive contains only the six example source/README/ignore files, with bytes matching the maintained example.
- Final 0.6 release and native Windows runtime checks are still needed before production launch. Benchmark values remain illustrative.
