# Oven content inventory and placement proposal

Editorial audit, 2026-10-25. This is a placement plan, not published release documentation or a feature-validation report. The approved visual design stays in place.

## Sources examined

- Original published Oven page: https://incan.io/dev/tooling/explanation/oven_alpha/ (and its Markdown in the Incan documentation checkout).
- New landing page: `src/oven.incn` and generated `../../incan-io-directions/obsidian-incan/oven.html`.
- Existing rewritten chapters: `docs-source/experiment/oven.md`, `projects.md`, `dependencies.md`, plus their reference and tutorial destinations.
- Documentation classification inventory: `content-map.json`.
- The website's selected 0.6 documentation evidence: `core-topics/evidence.json`, snapshot `4d92c3db292df98fd236c9fff451f468422cfff2`. Examined `tooling/explanation/oven_alpha.md` and `oven_ecosystem.md` in that snapshot.
- DD-0007, Loaf artifacts and the one consumer index, at the same snapshot. This is a **draft design record**, used to locate concepts and questions, not to certify shipped behavior or stable artifact formats.

The original page contains historical Alpha behavior. Its themes are useful; its commands, artifact schemas, limitations and backend descriptions cannot be transplanted into final 0.6 copy. The selected website snapshot is evidence for editorial direction, not a substitute for final release verification.

## Findings

The new page retains the command-line introduction, source/build/package illustration, benchmarks and ecosystem links. It loses most of the original explanation of package contents, compatibility, reuse and inspection. Conversely, the original mixes product introduction, operator guidance and compiler internals in one page.

The new flow also collapses executable builds and reusable library packages into one outcome. The selected 0.6 ecosystem description explicitly distinguishes an executable from a library artifact set. Restore that distinction without turning the landing page into an architecture specification.

## Placement decisions

| Original material / reader question | New page today | Recommended destination and treatment |
| --- | --- | --- |
| Why Oven exists / what it manages | Generic build-tool introduction | Landing page: a short explanation of project configuration, dependencies and reusable build results. Explain the benefit through normal development tasks. |
| What a Loaf contains | One sentence about a build result | Landing page: public interface, reusable implementation and compatibility information in reader language. Expand in **Loaves and build reuse**. |
| Publisher → package → consumer | Replaced by source → Oven → Loaf | Keep the illustration, distinguish executable and library outcomes, explain how another project uses a library. Detailed example in the library tutorial. |
| Reuse and rebuild decisions | Missing | Landing page: a compact paragraph explaining unchanged inputs and rebuilding after changes. Full explanation and examples in **Loaves and build reuse**. Do not restore the Alpha-only rule that every miss requires a manual bake. |
| Inspecting why a result was selected or rejected | Missing | Landing page: one useful link and a short example of the question it answers. **Build inspection and troubleshooting** owns the commands, outputs and diagnosis. |
| Incan and Rust together | Mentioned, little explanation | Expand the existing landing-page block slightly; link **Manage dependencies** and **Rust interop**. No generated-Rust framing. |
| Build/run/test workflow | Check/run/build commands | Keep compact; include or visibly link testing. Reuse **Build and run with Oven**, **Write tests**, and the first-project exercise. |
| Project and dependency configuration | Resource links | Keep links; existing **Projects and configuration**, **Manage dependencies**, and manifest reference are their homes. No duplicate subpages. |
| Programmatic/compiler-facing surface | Missing | Contributor architecture and eventual generated API reference. Not a separate marketing card unless it serves an actual reader task. |
| Store limits, cleanup, leases, concurrency | Missing | Operational how-to within Oven documentation, linked from troubleshooting. Compiler-level lifecycle details remain contributor material. Do not copy old limits or paths. |
| Cargo comparison | Timing chart only | Keep measured performance separate from a concise explanation of workflow differences. Avoid blanket claims about Cargo correctness or arbitrary Cargo-project compatibility. |
| Benchmark protocol | Expandable placeholder methodology | Keep summary on landing page; reproducible results and workload details get a benchmark page when real measurements arrive. Separate clean, incremental and unchanged runs. |
| Alpha limitations and future capabilities | Mostly omitted | Replace with final 0.6 support information at the relevant task. Roadmap owns future features; release notes own historical limitations. Do not reintroduce Alpha banners or claim signatures/SBOM/registry support based on the old roadmap. |
| Receipt hashes, schema versions, SDK inventories | Omitted | Keep out of introductory copy. Exact machine formats belong in reference, and internal ownership in contributor architecture. |

## Proposed landing-page sequence

1. Existing Oven hero and primary actions.
2. Existing illustrated flow, clarifying executable versus reusable library outcomes.
3. A short explanation of Loaves and build reuse (roughly 120–180 words, preferably integrated with the flow and package artwork).
4. Existing commands and Incan/Rust block, with contextual links to the practical chapters.
5. Benchmarks, preserving the illustrative label until measurements replace the examples.
6. Existing package artwork with a more useful explanation and link to the Loaf chapter / Incan.pub.
7. Documentation links, shared Incus community area and footer.

Inspection can be introduced in the reuse explanation and linked from the documentation group; it does not require another full-width section. Avoid repeating the Loaf definition in both the flow and package banner.

## Documentation work

### New: Loaves and build reuse — Explanation

Standalone chapter answering: what is a Loaf; what does a consumer need; how are executable and library outputs different; what allows reuse; what changes require a rebuild? Include one concrete before/after example. Keep artifact extension tables and compatibility field inventories in reference, not the introduction.

End with **Build and consume a library**, a tutorial with downloadable producer and consumer projects. Rework the existing tutorial for 0.6 rather than creating a second tutorial. Its historical commands and verified-version banner need replacement; the current dependencies chapter already covers a simple local library.

### New: Build inspection and troubleshooting — How-to

Start from reader symptoms: an unexpected rebuild, a missing dependency, a different feature selection, or an incompatible build result. Show the relevant inspection output and how to act on it. Use final 0.6 commands and real sample output when authoring; no fabricated receipts. Link conceptual reuse rules back to the explanation chapter.

### Reuse existing chapters

Projects and configuration; Manage dependencies; Build and run with Oven; Write tests; Rust interop; CLI reference; manifest reference. Keep their document-type labels. References remain directly reachable under the Oven topic, not accessible only through prose or search.

## Draft introductory copy direction

> Oven reads your project configuration, prepares its dependencies, and builds your program. Use the same command-line tools to check code, run it, build an executable, and run tests.
>
> A library can be built as a Loaf: a reusable package containing its public interface and implementation. Other projects depend on that package rather than copying its source into their own project.
>
> When build inputs are unchanged, Oven can reuse existing results. When they change, it prepares the affected work again. Build inspection helps explain the selected dependencies and why a result was reused or rebuilt.

This is an editorial starting point. Precise compatibility guarantees, native artifact details and inspection commands must be reconciled with the final 0.6 behavior during authoring. That verification belongs in the work record; release-reader prose should describe the finished product directly.

## Recommended next implementation slice

Restore the Loaf/reuse explanation and executable/library distinction on the landing page. Write the two focused chapters, then adapt the existing downloadable library tutorial. Reuse existing routes for configuration and commands. Leave the benchmark-results page until there are real results to publish.
