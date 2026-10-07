# Incan.io homepage content proposal

> Superseded after selecting option 2: [read the revised 0.6 content brief](revised-content-brief.html). The generated-Rust narrative below is historical and must not be used for implementation. Incus is retained in the revised design.

Source reviewed: https://incan.io/dev/ and the current repository's `workspaces/docs-site/docs/index.md`, on 2026-10-07. The root URL redirects to this development documentation homepage. The three static visual concepts use the selected Incan.pub material direction, the official Incan wordmark, Brawler display type and Exo 2 body type.

## Reader outcome

Help a developer understand what Incan is, see actual source, choose a first practical project and find installation instructions. Deeper technical evidence remains available through the documentation.

## Proposed sequence and copy

1. **Understand the language.** “Python-readable. Rust-native.” Supporting copy: “A statically typed language for clear application code. Write in Incan; compile to native binaries through Rust and Oven.” Primary action: Get started. Secondary action: Read the language guide. These retain the current homepage's statically typed, readable-source and native-artifact positioning.
2. **See actual source immediately.** The current homepage's `User` model and `greet_user` example moves into the hero or directly beneath it. Code and example output become live, syntax-highlighted text when a concept is implemented. The static image is not an executed playground or a compiled-code receipt.
3. **Choose one practical route.** “Start with something real.” Link to the existing first-application, typed-data-processor and reusable-library tutorials. Describe the concrete task rather than introduce internal terminology on the landing page.
4. **Understand the build once.** “You write intent. Incan plans ownership.” Explain Duckborrowing, generated Rust and inspectable build artifacts in one section. Merge the current compiler-flow, build-strip and repeated benefits; retain the deeper explanation as a link. The short visual trail omits detailed validation stages for readability; the docs remain authoritative.
5. **Try a small project.** Keep the current beta status explicit. Show the current verified documentation quickstart commands only after installation, and link to the installation guide. Link to Oven and Incan.pub as ecosystem surfaces without asserting a new publishing flow or registry launch.

## Proposed destinations

- Get started / Installation guide: https://incan.io/dev/tooling/tutorials/getting_started/
- Language guide / Docs: https://incan.io/dev/start_here/
- First application: https://incan.io/dev/tooling/tutorials/your_first_project/
- Typed data workflow: https://incan.io/dev/language/tutorials/typed_data_processor/
- Reusable library: https://incan.io/dev/tooling/tutorials/build_and_consume_library/
- How Incan works: https://incan.io/dev/language/explanation/how_incan_works/
- Ownership deep dive: https://incan.io/dev/contributing/explanation/duckborrowing/
- Oven: https://incan.io/dev/tooling/explanation/oven_alpha/
- Incan.pub during design review: the existing playground at https://encero-systems.github.io/incan-pub-playground/
- GitHub: https://github.com/encero-systems/incan

## Content kept deeper in the site

The full Rust comparison, release-specific Loaf envelope, detailed ownership branches, AI/toolchain thesis and additional API/async tutorials remain documentation content. They are useful evidence after the first explanation, but repeating them all on the homepage weakens its hierarchy.

## Implementation handoff

These are independent built-in Image Gen concepts, displayed as options 1, 2 and 3 in that order. Generated wording, decorative lettering, icon geometry and code rendering are visual approximations; this brief and the actual documentation are the content authority. No benchmark, community metric, release-version claim or production-maturity claim was supplied. Any decorative motto or incidental footer date in a concept is not required copy. An implementation should use the real wordmark, actual fonts and existing icon assets, with code and output as live HTML.

The Incan.pub website and package pages are preserved. Production Incan.io was not edited or deployed. A visual direction has not yet been selected for implementation.
