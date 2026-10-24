# Testing and editor content pilot

This pilot tests standalone chapters: connected explanations that readers can enter when they need to accomplish a task. Each chapter states its outcome and minimum prerequisites, develops the task through worked examples, and explains how to check the result. There is no required reading order.

The three chapters retain their How-to classification: [Write tests](write-tests.md), [Run tests](run-tests.md), and [Set up your editor](editor-setup.md). Existing tutorials and reference contracts remain separate.

## Read a chapter on its own

Choose the task you need now:

- [Write tests](write-tests.md) — understand placement, assertions, parameter cases and shared setup. Bring a working project and familiarity with basic functions and imports.
- [Run tests](run-tests.md) — establish what ran, narrow a failure and report meaningful CI results. Bring an existing test suite; the examples from the other chapter are optional.
- [Set up your editor](editor-setup.md) — connect an editor to the intended toolchain and verify its feedback. Bring a project, an installed toolchain and VS Code or Cursor.

The chapters introduce concepts where a decision needs them. Tables summarize choices after an explanation, and direct reference links remain available for readers who only need a signature or option. A chapter-like style does not change a document's Divio purpose: these pages help readers complete a task, while progressive tutorials and exact references remain separate.

## Where the material belongs

| Existing material | New home | What remains separate |
| --- | --- | --- |
| Language and tooling testing pages: placement, assertions, fixtures, parametrization, decorators | Write tests | Full std.testing API contracts and the language-book tutorial |
| Tooling testing: collection, filters, runner output, concurrency and CI | Run tests | Complete CLI option contracts |
| Editor Setup and LSP: extension, binaries, verification, settings and recovery | Set up your editor | Contributor build instructions, protocol contracts and integration payloads |

The preview navigation links to the rewritten guides. Editor Setup and LSP become one visible entry in the tooling hub, with both original source identities retained in the content map. Original pages remain available; no production URLs or anchors are retired.

## What was deliberately removed from the main path

The runner guide no longer repeats fixture or parametrization implementations. It links to the authoring guide when those concepts matter. The authoring guide points to exact signatures instead of reproducing the assertion API table. Its examples use complete scalar/string programs rather than an undefined Database client.

Editor setup no longer requires reading about metadata command payloads before configuring an ordinary editor. Those details remain linked for integration authors. A contributor checkout is a separate route, not the default installation path.

The old rule suggesting one assertion per test is not retained: related assertions may belong together when they describe one behavior.

## Source discrepancies to resolve

- The language testing guide advertises timeout behavior; the tooling guide explicitly says Oven Alpha rejects `--timeout` and `@timeout`. The new runner guide preserves that explicit limitation and requires release-candidate verification before relying on enforcement.
- The editor guide describes a format-on-save fallback while the LSP guide documents richer current integration. The new setup guide does not infer automatic formatting support from those other features.
- Source pages include several release eras. Consolidating their prose does not establish that every command is correct for the final 0.6 assets.

## Release checks

With the selected 0.6 release candidate:

1. Save the three complete examples from Write tests at their named paths. List tests over the project root and confirm both inline and conventional cases, including the three named parameter cases.
2. Run the examples. Change one expected result, confirm a failing status, then restore it. Run a selected case and verify collection/selection IDs.
3. Verify fixture isolation, marker selection and strict-marker diagnostics with dedicated fixtures. Check worker-scope behavior before promising session-wide sharing.
4. Exercise the CI command with successful, failing and empty collections. Inspect JSON Lines, the final summary, JUnit output and exit status.
5. Verify whether the release executor rejects or supports timeout requests and update the guide from that evidence.
6. Install the matching extension and toolchain in a clean supported editor profile. Verify Doctor paths, diagnostics, hover, definition navigation, completion and restart after an upgrade. Check automatic formatting separately.

Website compilation and link checks validate the rendered documents; they are not evidence that these release workflows have been executed.

## Reader trial

Start each reader on the chapter relevant to their task, without requiring them to read either of the others. Ask them to identify the prerequisites, then complete these tasks without coaching:

1. Put a unit test beside a private helper and find the command that will collect it.
2. Reuse setup across several input cases and explain whether a session fixture is shared across parallel workers.
3. Make an empty test collection fail CI and locate the exact API contract without searching.
4. Diagnose an editor using an older language server than the terminal.
5. Decide whether format-on-save or timeouts are guaranteed by this preview.

Expected answers: inline `module tests:` with test-only imports; list/run the production file or project root. Parametrize cases and inject fixtures by name; session scope is per worker batch. Use `--fail-on-empty` and the std.testing/CLI reference links. Compare Incan: Doctor paths and restart after correcting them. Neither feature is guaranteed here; timeout rejection is explicitly documented for the recorded Alpha executor.

Keep this approach if readers can enter any chapter, recognize what they need beforehand, follow the reasoning, and check their result without assembling instructions from several pages. Record any prerequisite that was assumed but not stated, and any point where the prose becomes an option list without explaining the decision. A successful build is not a reader-study result.

## Provenance

The consolidation uses the source snapshot recorded at Incan commit `1b179c7e2afd695c2e210455a0a126345a7b16a3`. The playground retains exact source inputs and their hashes under `tools/welcome/testing-editor-pilot/`. The new examples are editorial adaptations; successful execution on 0.6 is still pending. The std.testing and protocol references are existing documentation, not Pallay-generated API output.
