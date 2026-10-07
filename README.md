# Incan.pub design playground

A public HTML review surface, separate from the production registry website.

[Open the catalog](https://encero-systems.github.io/incan-pub-playground/) or [the regex package page](https://encero-systems.github.io/incan-pub-playground/packages/crates-io/regex/).

Six packages use the same vertical document layout: memchr, serde, serde_json, regex, tokio and anyhow. Features, dependencies, indexed builds, release history, source attribution and popularity are derived from frozen records; the README contains author-provided upstream documentation. Download graphs keep crates.io context separate from Incan registry pulls.

Build locally with `npm ci --ignore-scripts`, `npm run build`, and `npm run check`, using Incan 0.5.1 and Rust 1.98.0. See [renderer documentation](tools/site/README.md) for sources, checks and the manual-only CI recipe. No nightly collector is enabled.

Earlier explorations remain in the concept galleries and [previous working prototype](previous-prototype.html). The [data contract](package-data-design.md) records provenance and future scoped-edition rules. This preview does not implement direct/native publisher admission, production search, upstream advisory collection or report submission.
