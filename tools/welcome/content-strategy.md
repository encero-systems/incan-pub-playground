# Incan documentation: topic-led content redesign

## Intended reader experience

A reader can start a program, understand a feature, complete a task, and find an exact contract without learning our filing system. Topics lead the navigation. Tutorial, guide, explanation and reference remain editorial roles: they describe what a page does, not the first decision the reader must make.

This is a redesign of the complete content map and a working navigation preview. It is not a claim that all 379 reader pages have been rewritten or moved into the new renderer. Existing bodies remain available at their current URLs; reworked pages open in the preview. No live docsite URLs are removed or redirected by this change.

## Navigation

| Section | Reader question | Content boundary |
| --- | --- | --- |
| Learn | How do I get started, or learn through a project? | One first-run path, audience orientation, language book and complete projects. |
| Language | What does this construct mean, and how do I use it? | Topic guides with exact language rules beside them; not a catch-all API directory. |
| Standard library | Which module do I need, and what does it guarantee? | Module selection, practical guidance and source API contracts. |
| Oven & tools | How do I build, test, inspect and deliver a project? | Project configuration, dependencies, builds, tests, diagnostics, editor and CLI contracts. |
| Interoperability | How does my program work with Rust or C? | Language boundaries, checked bindings, deployment and inspection contracts. |
| Contribute | How do I change Incan itself? | Compiler architecture, contributor learning, development workflow and evidence. |
| Project | What is shipping, proposed or changing? | Releases, roadmap, stability, people, RFCs and design records. |

Within a topic, order material by reader need: choose/understand, do, then exact rules or API. A single topic need not have every editorial role. A short, complete page is preferable to four thin pages created to fill a taxonomy.

## Complete source inventory

`content-map.json` covers all 402 Markdown files at the recorded source commit, including files absent from the old navigation. Every entry has its original path, content digest, headings, topic, role, editorial action, rationale, current URL and proposed destination. The source tree was clean for this inventory. Supporting snippets, authoring templates and vendored documentation have explicit dispositions instead of being silently omitted.

- 379 reader pages; 23 shared inputs and authoring aids.
- 266 retain their independent purpose; this is not a release-correctness verdict.
- 15 old hubs become topic navigation.
- 21 pages are consolidation inputs.
- 36 require a 0.6 rewrite/revalidation before promotion.
- 5 historical implementation pages stay available outside the default learning path.
- 25 API pages are candidates for source-owned reference.
- 11 mixed reference pages need symbol contracts separated from language rules and guidance.

Release-review flags are textual signals for editorial review, not proof of a defect. RFCs and release notes retain their own dates/status: a proposal is not documentation of shipped behavior. `proposed_url` is an editorial route plan; aliases must not be installed until their target exists and old anchors have been mapped.

## Consolidation decisions

### One first-run path

`tooling/how-to/install_and_run.md`, `tooling/tutorials/getting_started.md`, `tooling/tutorials/your_first_project.md` and `tooling/tutorials/pipeline_mini_project.md` repeat first-contact steps. Establish one version-pinned install/verify/create/run/test/build route. Keep a longer multi-file lesson and pipeline project as follow-on experiences. Audience routes link to the shared first-run steps, rather than copying them.

For release 0.6, verify the installation asset, supported hosts, project files, bake behavior and exact commands together. Existing 0.5 snapshots remain labelled until that verification is available.

### Language topics, with real rules

Group the enum explanation and modeling recipes under Enums and pattern matching. Group functions, closures, callable presets and generators without treating their semantics as interchangeable. Put imports, scopes, const/static state and aliases together, while retaining independently addressable rules.

Traits and derives need a common entry point. The guide explains declaring and adopting behavior; a language-rules page owns adoption, generic constraints, hooks and derive semantics. Individual trait APIs can be generated, but generation cannot replace these universal rules. Capability policy/grants and trait behavior must not be conflated simply because both use the word capability.

### Library guides beside API contracts

Dates and times currently spans tutorial, recipes, rationale and reference. The reworked guide provides a practical path and links the exact contract. Calendar, fixed-offset and timezone distinctions remain authored explanation. Keep the existing complete datetime reference until generated docs cover the whole public surface; the Date sample alone is not replacement coverage.

Apply the same boundary to collections, files/streams, JSON/TOML, hashing, async and graph APIs. Selection guides should explain when and why; generated pages should document signatures, defaults, returns, errors and constraints. Small examples may live in either where they answer the immediate reader question.

### Make 0.6 ownership explicit

Compiler architecture, the contributor book, first-contact commands, project configuration, build/release and CLI/inspection need a release-aware pass. Updating headings does not fix an obsolete pipeline. Normal 0.6 compilation must not be described as generating Rust source; Rust and Incan live side by side in Oven-managed projects.

The generated-Rust audits, legacy backend quality/coverage inventories and historical storage material stay reachable as historical or compatibility-maintenance documentation. They do not lead the 0.6 reader journey. Retain the original content and provenance instead of deleting it. The Rust-source backend deprecation policy is different: it stays in contributor architecture and requires a 0.6 update. The v0.5.1 post-mortem belongs with release history.

### Move project vision out of first contact

The 1.0 domain-native demo target, public-contract ambitions and ecosystem vision belong in Project, with their future scope visible. Learn should get a reader to a supported result. Comparisons remain available for evaluation, but do not repeat the primary overview on every route.

## Source documentation contract

Before an authored API page is retired, require:

1. Every public symbol is discoverable, with its signature, type parameters, defaults and return type.
2. Errors, constraints, mutation/ownership behavior and observable edge cases are documented at the symbol or module level.
3. Examples are tied to a selected compiler/library version and checked where executable.
4. Symbol links are stable across generated releases, with aliases for replaced reference anchors.
5. Module overviews preserve selection guidance, cross-symbol invariants and examples that do not belong to one declaration.
6. The API output records source revision and generator version; absence of documentation is visible rather than invented.

The content map's source-API candidates and mixed-contract entries identify the handover queue. This change implements no API generator and makes no new 0.6 execution claims.

## Migration sequence

1. **Complete in this preview:** inventory every Markdown file; classify its new home and disposition; expose all reader topics through working section hubs; retain current docsite links and the existing reworked pages.
2. **First release content pass:** replace repeated first-contact instructions with a verified 0.6 route; reconcile compiler/toolchain architecture and CLI/project contracts.
3. **Topic consolidation:** turn the existing dates/traits/Oven experiment into canonical content; then work through types, errors, modules and core library modules.
4. **Source API handover:** populate source docs and verify generated coverage before replacing reference pages. Keep language-rule pages authored.
5. **Cutover:** render the remaining bodies, migrate assets and diagrams, map every old anchor, install redirects, and run navigation/link/version checks on the final deployment.

Acceptance for the redesign is complete source coverage, no orphan classifications, explicit contract ownership, and navigable topic routes. Acceptance for a production migration additionally requires rewritten/version-verified bodies, working generated API docs where claimed, redirects and exercised examples. These are different milestones.

## Reader tasks to evaluate next

Use the new navigation without coaching. Record the chosen route and whether the answer is correct, not just whether a page was opened.

- Install the selected release and find the expected output of the first run.
- Decide whether to use a model or a class, then find the exact field/method rules.
- Parse a date and find what invalid input returns.
- Add a Rust dependency and identify the configuration authority.
- Diagnose a failed build and find the relevant CLI contract.
- Distinguish a shipped feature from an accepted RFC and a future roadmap item.

No reader-study outcome is claimed by build or link checks.

## Module lookup and visible document types

Standard library now opens an alphabetical index of the 26 modules with dedicated module reference pages in this snapshot. Each module has a local overview with separate How-to, Tutorial, Explanation and Reference sections. The index also links directly to each complete reference; `std.datetime` uses the full imported reference, not the authored Date-only sample. Unimported reference links are marked as current-docsite links. This index is a documentation inventory, not a claim to enumerate every source submodule.

Every content-map entry now has `doc_type` alongside its existing editorial role. Content pages use Tutorial, How-to, Reference or Explanation. Navigation hubs use Overview and shared authoring inputs use Supporting material. Design records retain their record role and lifecycle; a type label does not imply shipped behavior. The imported/reference page bodies remain unchanged. Authored preview pages have explicit type assignments in the renderer.
