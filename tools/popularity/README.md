# Popularity batch trial

An Incan collector for the six adopted packages in the playground. It reads public crates.io responses and public GitHub Packages HTML, then writes a candidate `package-context.json`, a daily `history.json`, and a per-source `report.json`. It does not edit or admit events to the production Incan.pub index.

Verified with the released Incan **0.5.1** toolchain on macOS arm64. HTTPS uses the installed `curl`; pacing uses `sleep`. Collection, validation, aggregation, history merging and fallback logic are authored in Incan. `rust::std` supplies process execution, argv and UTF-8 conversion directly; no Rust helper source was authored.

## Run from the repository root

```sh
cd tools/popularity
INCAN_HOME="$PWD/target/incan-home" incan build main.incn
cd ../..
tools/popularity/target/incan/main/oven/release/main live \
  tools/popularity/packages.json \
  assets/package-context.json \
  tools/popularity/target/trial \
  tools/popularity/target/evidence
```

Use the candidate snapshot as the seed for the next refresh. Keep the output directory to retain accumulated daily history. Successful observations replace matching dates; they are never added to a previous observation of the same date. All-time totals remain separate from the daily history.

For offline diagnosis, replace `live` with `replay` and provide the saved evidence directory. The batch records its UTC date for deterministic replay. Raw bodies, response headers and curl HTTP diagnostics stay under ignored `target/`; published diagnostics are reduced to status, elapsed time and response size.

## Source contracts

- crates.io: two requests per package, spaced by at least one second, with an identifying User-Agent and repository contact URL, following its [data access policy](https://crates.io/data-access#api). Daily package totals sum `version_downloads` and `meta.extra_downloads`; otherwise older versions are lost. The chart uses 30 complete UTC days, excluding today. The selected-version count is checked against the configured exact version.
- GHCR: one public package-page request per package. The parser requires one total-downloads label and exactly 30 distinct, contiguous chart dates, including today. Today's count is partial. Missing or changed markup, invalid counts and inconsistent totals reject that observation. These are GitHub's package download counts across versions/build tags; they do not measure unique users or successful Incan installs.
- Each source refreshes independently. A request or validation failure preserves its complete previous record, including the original capture timestamp. The report marks it `retained`, with a reason. HTTP 429 stops further crates.io requests in the batch; GHCR can continue. No automatic retries are enabled in this trial.
- Snapshot/history/report files are individually written through a temporary file and rename. The three files are **not** a transactional publication unit. A future scheduled publisher must validate a complete candidate directory, regenerate charts, and publish all assets in one commit.

## What the trial established

October 7, 2026: all 18 collector requests returned HTTP 200, and both sources refreshed for all six packages. Independent comparisons checked all 360 daily observations against the raw responses. Replaying saved input preserved the exact snapshot and did not double-count history. Injected HTTP 429, HTTP 503, changed GitHub chart markup and negative download counts preserved the affected last-good source records while unaffected sources refreshed. A separate replay checked that an early 429 stops later crates.io requests.

Two compiler quirks on 0.5.1 matched existing reports: [sorted dictionary keys](https://github.com/encero-systems/incan/issues/1461) and [literal reassignment / CLI text boundaries](https://github.com/encero-systems/incan/issues/1668). The collector materializes keys before sorting and uses an explicit string conversion for reassignment. These workarounds compiled and ran. A further typed `Err` reassignment problem has a reduced [follow-up draft](compiler-notes.md); the collector returns that error from an explicitly typed function. This trial does not assess the latest development compiler.

## Before scheduling nightly collection

This is a one-shot experiment; no nightly workflow has been enabled. Add bounded retries/backoff, a deliberate partial-failure policy, conditional caching where supported, and monitoring for changes to GitHub's HTML contract. The trial did not encounter or live-test upstream throttling/outages; failure checks used replay fixtures. At a much larger catalog size, evaluate the [crates.io database dump](https://crates.io/data-access#database-dump) for bulk data rather than scaling per-package API polling indefinitely. GHCR page scraping remains the less reliable dependency.

The package list is explicit configuration for this prototype. Production discovery should derive from the authoritative index and deduplicate upstream crates/package URLs, rather than request the same statistics once per adopted version or build tag.
