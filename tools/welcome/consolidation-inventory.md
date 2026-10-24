# Incan documentation consolidation inventory

Prepared 24 October 2026. This is a proposed editing queue for the 0.6 website, not a list of approved deletions. The aim is fewer competing explanations and one owner per contract while retaining clear Tutorial, How-to, Reference and Explanation boundaries.

## Evidence and scope

Based on `content-map.json`, whose 402 Markdown inputs are pinned to Incan commit `1b179c7e2afd695c2e210455a0a126345a7b16a3`. Candidate source paths below were checked against their recorded hashes. The intake has 21 merge inputs, 25 source-API candidates and 11 mixed-contract candidates; those categories are not proof that pages can be retired.

Body review focused on onboarding, testing, editor setup, positioning, dates, configuration, registries, derives and logging. Other clusters use section-level review and are marked medium confidence or candidate batch. Pallay extraction coverage has not been independently verified here. No source bodies, routes or published pages are changed by this inventory.

## Recommended order

1. C01 Testing and C02 Editor setup: consolidate repeated tasks and remove circular reader routes.
2. C03 Project configuration: establish one contract owner, with 0.6 validation.
3. C04 Choosing Incan and C05 Derives: consolidate selected explanation material.
4. C09 Logging with Pallay: validate the replacement process on one real module, then expand C10.
5. C06 onboarding, C07 redirects, C08 embedded API tables and C11 configuration as release preparation. C12 needs finer section review before text merges.

## Candidate register

| ID | Area | Action | Confidence |
| --- | --- | --- | --- |
| C01 | Testing | Combine repeated sections | High |
| C02 | Editor setup and language server | Combine the setup journey | High |
| C03 | Project configuration contracts | Deduplicate reference sections | High |
| C04 | Why choose Incan | Combine repeated positioning | High |
| C05 | Derives and traits explanations | Combine selected explanatory sections | Medium |
| C06 | First run | Unify entry and reuse shared steps | High |
| C07 | File I/O forwarding page | Replace with a redirect when migrating | High |
| C08 | Library tables inside import reference | Move API duplication to module reference | Medium |
| C09 | Logging as the Pallay handover pilot | Replace handwritten API inventory after parity | High |
| C10 | Remaining source-owned API references | Replace only after coverage | Candidate batch |
| C11 | Configuration task overlap | Reuse a cross-module task guide | High |
| C12 | Modules and state | Unify navigation and remove small repeated passages | Medium |

## C01 Testing

**Action:** Combine repeated sections. **Confidence:** High.

Both how-to pages cover inline tests, assertions, markers, fixtures and parametrization, despite announcing different scopes.

**Destination:** Keep Write tests (How-to) for authoring and Run tests (How-to) for discovery, selection, execution and CI. Give each repeated section one owner and link across. Keep the book lesson (Tutorial) and std.testing contracts (Reference) separate.

**Before retiring anything:** Reconcile overlapping examples and rules against the selected 0.6 runner; moving API signatures alone will not remove this overlap.

- [tooling/how-to/testing.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/tooling/how-to/testing.md)
- [language/how-to/testing_stdlib.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/how-to/testing_stdlib.md)
- [language/reference/stdlib/testing.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/testing.md)
- [language/tutorials/book/13_unit_tests.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/tutorials/book/13_unit_tests.md)

## C02 Editor setup and language server

**Action:** Combine the setup journey. **Confidence:** High.

Editor Setup repeats the feature list and sends the reader to LSP for setup; LSP sends the reader back to Editor Setup for the extension. LSP also carries protocol-consumer material such as the contract-model emit command.

**Destination:** One Set up your editor (How-to): install, select matching binaries, enable features, verify, troubleshoot. Move command payload contracts to protocol Reference; retain formatter CLI usage as its own task.

**Before retiring anything:** Check release-install instructions against 0.6. Keep compiler-contributor setup as a clearly named branch of the instructions, not the default user route.

- [tooling/how-to/editor_setup.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/tooling/how-to/editor_setup.md)
- [tooling/how-to/lsp.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/tooling/how-to/lsp.md)
- [tooling/how-to/formatting.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/tooling/how-to/formatting.md)
- [tooling/reference/lsp_protocol_support.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/tooling/reference/lsp_protocol_support.md)

## C03 Project configuration contracts

**Action:** Deduplicate reference sections. **Confidence:** High.

The two references independently define [project], scripts and environment fields. Both contain a table for extends, requires-incan, detached, cwd, env-vars and scripts.

**Destination:** One canonical manifest Reference owns each field, default and merge rule. Keep lifecycle commands and project-root/workspace behavior addressable as Reference topics; retain project and workspace How-to pages.

**Before retiring anything:** Compare every overlapping contract before moving it. Revalidate examples and requirements for 0.6; do not paste the two long references into one larger page.

- [language/reference/project_lifecycle.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/project_lifecycle.md)
- [tooling/reference/project_configuration.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/tooling/reference/project_configuration.md)
- [language/how-to/project_lifecycle.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/how-to/project_lifecycle.md)
- [language/how-to/workspaces.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/how-to/workspaces.md)

## C04 Why choose Incan

**Action:** Combine repeated positioning. **Confidence:** High.

Why Incan and What Incan is for repeat audience, native-artifact motivation and non-goals. Why not just Rust repeats the same decision boundary. Rust-shaped confidence has a more substantial Rust-reader argument.

**Destination:** One Choosing Incan (Explanation) owns purpose, fit, tradeoffs and limits. Keep audience-specific comparisons where they explain concrete differences; remove repeated generic introductions. Fold the short Why not just Rust decision summary into that overview or the Rust comparison after section comparison.

**Before retiring anything:** Rewrite legacy generated-Rust/backend positioning for 0.6. Keep specific interoperability and language comparison material; this is not a mandate to collapse every comparison into one page.

- [language/explanation/why_incan.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/explanation/why_incan.md)
- [start_here/what_incan_is_for.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/start_here/what_incan_is_for.md)
- [language/explanation/why_not_just_rust.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/explanation/why_not_just_rust.md)
- [language/explanation/rust_shaped_confidence.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/explanation/rust_shaped_confidence.md)
- [comparisons/rust.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/comparisons/rust.md)
- [comparisons/python.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/comparisons/python.md)
- [comparisons/javascript_typescript.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/comparisons/javascript_typescript.md)

## C05 Derives and traits explanations

**Action:** Combine selected explanatory sections. **Confidence:** Medium.

The first two explanations both introduce derives versus custom hooks and point to the same authoritative reference. The hook explanation and customization recipes have distinct purposes.

**Destination:** One explanation of derives, custom hooks and trait adoption absorbs duplicated introductory material. Preserve language-hook semantics, customization How-to, and exact language Reference. Source-generated trait APIs remain separate.

**Before retiring anything:** Reconcile 0.6 derive behavior before publication. Preserve compiler-level rules that no individual trait signature can express.

- [language/explanation/derives_and_traits.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/explanation/derives_and_traits.md)
- [language/explanation/how_derives_work.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/explanation/how_derives_work.md)
- [language/explanation/traits_as_language_hooks.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/explanation/traits_as_language_hooks.md)
- [language/how-to/customize_derived_behavior.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/how-to/customize_derived_behavior.md)
- [language/reference/derives_and_traits.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/derives_and_traits.md)

## C06 First run

**Action:** Unify entry and reuse shared steps. **Confidence:** High.

Install and run and Getting started expose the same install/create/run loop. They already share snippets, so this is mainly duplicated reader routes rather than independently maintained command text. The other tutorials have distinct project outcomes.

**Destination:** One obvious first-run Tutorial, supported by an installation How-to for host choices and recovery. Keep the multi-module project and pipeline lesson as follow-ons; link to prerequisites rather than repeating first contact.

**Before retiring anything:** Verify release assets, supported hosts and the full 0.6 command path. Preserve shared snippets rather than recreating their content.

- [tooling/how-to/install_and_run.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/tooling/how-to/install_and_run.md)
- [tooling/tutorials/getting_started.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/tooling/tutorials/getting_started.md)
- [tooling/tutorials/your_first_project.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/tooling/tutorials/your_first_project.md)
- [tooling/tutorials/pipeline_mini_project.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/tooling/tutorials/pipeline_mini_project.md)

## C07 File I/O forwarding page

**Action:** Replace with a redirect when migrating. **Confidence:** High.

The old File I/O reference is only 33 whitespace-delimited words: it points to std.fs and the practical guide. It contains no member contract to split.

**Destination:** Keep std.fs as the canonical Reference and retain the File I/O How-to. Map the old reference URL to its equivalent destination when production routes are migrated.

**Before retiring anything:** Target and alias must exist before retiring the forwarding page. Correct the earlier split-contract classification during the next content-map revision.

- [language/reference/file_io.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/file_io.md)
- [language/reference/stdlib/fs.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/fs.md)
- [language/how-to/file_io.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/how-to/file_io.md)

## C08 Library tables inside import reference

**Action:** Move API duplication to module reference. **Confidence:** Medium.

The import-language reference includes dedicated std.math and std.async sections alongside import syntax, namespace and alias rules.

**Destination:** Keep import semantics and short import examples in language Reference. Put the detailed module surface in its module Reference and link to it.

**Before retiring anything:** Compare individual sections against module docs before removing them. Import/prelude/name-resolution rules must not disappear with the tables.

- [language/reference/imports_and_modules.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/imports_and_modules.md)
- [language/reference/stdlib/math.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/math.md)
- [language/reference/stdlib/async.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/async.md)

## C09 Logging as the Pallay handover pilot

**Action:** Replace handwritten API inventory after parity. **Confidence:** High.

The logging reference enumerates functions, Logger methods, enum values, configuration defaults and LogRecord fields. It also records meaningful policy: libraries do not configure logging, event fields override bound fields, and some configuration behaviors are unavailable.

**Destination:** Let the Pallay module and symbol pages own the logging API inventory. Keep Logging (How-to) for tasks and keep telemetry as a separate module. Put cross-symbol policy in a source-authored module overview or a clearly linked explanation.

**Before retiring anything:** The screenshot demonstrates a proposed presentation, not verified extraction coverage. Check aliases, defaults, LoggerName constraints, field precedence, inert/unsupported settings and stable links against source before retiring the handwritten reference.

- [language/reference/stdlib/logging.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/logging.md)
- [language/how-to/logging.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/how-to/logging.md)
- [language/reference/stdlib/telemetry.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/telemetry.md)

## C10 Remaining source-owned API references

**Action:** Replace only after coverage. **Confidence:** Candidate batch.

The inventory marks 25 pages source-api and 11 split-contract. These are editorial queues, not 36 automatically deletable pages; C07 demonstrates that a classification can need correction.

**Destination:** Review each module against Pallay output. Move signatures/member tables to source documentation and retain selection guidance, module invariants and language-wide rules. Collections, datetime, graph, hashing, JSON/TOML and testing are candidate follow-ons.

**Before retiring anything:** Coverage must include symbols, defaults, returns, errors, behavior, examples, revision provenance and old anchors. Do not combine modules merely to reduce the page count.

- [language/reference/stdlib/async.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/async.md)
- [language/reference/stdlib/checksum.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/checksum.md)
- [language/reference/stdlib/collections.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/collections.md)
- [language/reference/stdlib/compression.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/compression.md)
- [language/reference/stdlib/datetime.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/datetime.md)
- [language/reference/stdlib/derives.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/derives.md)
- [language/reference/stdlib/encoding.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/encoding.md)
- [language/reference/stdlib/environ.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/environ.md)
- [language/reference/stdlib/fs.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/fs.md)
- [language/reference/stdlib/graph.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/graph.md)
- [language/reference/stdlib/hash.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/hash.md)
- [language/reference/stdlib/io.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/io.md)
- [language/reference/stdlib/json.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/json.md)
- [language/reference/stdlib/logging.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/logging.md)
- [language/reference/stdlib/math.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/math.md)
- [language/reference/stdlib/reflection.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/reflection.md)
- [language/reference/stdlib/regex.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/regex.md)
- [language/reference/stdlib/registry.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/registry.md)
- [language/reference/stdlib/result.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/result.md)
- [language/reference/stdlib/telemetry.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/telemetry.md)
- [language/reference/stdlib/tempfile.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/tempfile.md)
- [language/reference/stdlib/testing.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/testing.md)
- [language/reference/stdlib/toml.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/toml.md)
- [language/reference/stdlib/traits.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/traits.md)
- [language/reference/stdlib/uuid.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/stdlib/uuid.md)

## C11 Configuration task overlap

**Action:** Reuse a cross-module task guide. **Confidence:** High.

The existing preview combines selected-field configuration loading across these modules. The source guides also cover streaming, publication of files, TOML serialization and dynamic JSON updates that are outside that task.

**Destination:** Keep Read and validate configuration (How-to) as the combined task. Reuse or link its load/validate sequence from module guides; retain format-specific and file-management tasks and complete References.

**Before retiring anything:** The pilot is already prepared. Check it with the matching 0.6 compiler and reader tasks before treating it as evidence for broader consolidation.

- [language/how-to/file_io.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/how-to/file_io.md)
- [language/how-to/toml.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/how-to/toml.md)
- [language/how-to/dynamic_json.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/how-to/dynamic_json.md)

## C12 Modules and state

**Action:** Unify navigation and remove small repeated passages. **Confidence:** Medium.

The topic spans module discovery, lexical scope, const/static choices, alias identity and shared-state recipes. These are related but not interchangeable reader questions.

**Destination:** Keep a shared topic entry. Make the const-versus-static decision explanation canonical and link to it. Retain separate scopes/name-resolution Explanation, state recipes (How-to), and static/alias rules (Reference).

**Before retiring anything:** The old map marks several of these merge. Treat that as grouping until a section-level overlap review proves a text merge is worthwhile; avoid one large Modules and state page.

- [language/explanation/imports_and_modules.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/explanation/imports_and_modules.md)
- [language/explanation/scopes_and_name_resolution.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/explanation/scopes_and_name_resolution.md)
- [language/explanation/consts.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/explanation/consts.md)
- [language/explanation/static_storage.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/explanation/static_storage.md)
- [language/how-to/imports_and_modules.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/how-to/imports_and_modules.md)
- [language/how-to/module_state.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/how-to/module_state.md)
- [language/reference/static_storage.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/static_storage.md)
- [language/reference/symbol_aliases.md](https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/docs/language/reference/symbol_aliases.md)

## Keep separate unless new evidence shows duplication

- **Datetime:** the Tutorial builds a subscription schedule; the How-to collects recipes; the Explanation distinguishes runtime timing, civil values, offsets and intervals. Share examples and link them, but do not merge the three solely because all discuss dates. The earlier merge recommendation was too broad.
- **Typed registries:** the Tutorial builds a catalogue, the How-to covers migration/reexports/diagnostics, and the Explanation distinguishes checked and loaded views. These are distinct jobs.
- **Hashing:** algorithm/task guidance, security guarantees and member contracts should remain distinguishable.
- **Graphs and collections:** selection guidance and data-model rationale are not duplicates of API signatures.
- **Language book:** progressive lessons remain a learning sequence even when they use the same symbols as API examples.
- **RFCs and release history:** keep their status and chronology. Removing them from a default learning route is a navigation decision, not consolidation of current user guidance.

## Acceptance for each consolidation

Identify the specific repeated sections and their surviving owner. Preserve unique examples, errors, constraints and version boundaries. Give the resulting content page one primary Divio type; extract a distinct page if it has acquired a second substantial job. Check examples with the intended release. Map old URLs and anchors only after replacements exist. For API handovers, compare actual generated output with the authored contracts and document gaps. Measure removed duplication and reader task success rather than promising a page-count reduction in advance.
