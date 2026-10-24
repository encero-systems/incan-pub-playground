# Testing and editor content pilot

This revision tests an explanatory chapter with a single purpose: understanding how testing works in Incan. Its examples illustrate the ideas being discussed. Readers are not asked to create files, run a sequence of commands or complete an exercise.

## Read the revised chapter

[How testing works in Incan](write-tests.md) begins with the relationship between a type and a behavioral expectation. It develops that idea through assertions, test visibility, parameter cases, fixture dependencies and isolation, then considers what a test result establishes. Familiarity with basic functions, imports and strings is sufficient background.

The page is classified as **Explanation** in its breadcrumb, badge and module navigation. The existing URL is retained so earlier links remain usable. [Run tests](run-tests.md) and [Set up your editor](editor-setup.md) remain How-to guides; they have not received the same editorial rewrite.

A separate tutorial should be built around a complete downloadable project, with displayed snippets taken from its source, a stated toolchain version and verified commands and output. That tutorial is not part of this revision. No download or runnable-project claim is attached to these illustrative examples.

## Where the material belongs

| Existing material | New home | What remains separate |
| --- | --- | --- |
| Testing model: assertions, test visibility, parameter cases, fixture dependencies and isolation | How testing works in Incan · Explanation | Task instructions, full std.testing API contracts and the language-book tutorial |
| Tooling testing: collection, filters, runner output, concurrency and CI | Run tests | Complete CLI option contracts |
| Editor Setup and LSP: extension, binaries, verification, settings and recovery | Set up your editor | Contributor build instructions, protocol contracts and integration payloads |

The preview navigation links to the rewritten guides. Editor Setup and LSP become one visible entry in the tooling hub, with both original source identities retained in the content map. Original pages remain available; no production URLs or anchors are retired.

## What was deliberately removed from the main path

The runner guide no longer repeats fixture or parametrization implementations. It links to the explanatory chapter when those concepts matter. The explanatory chapter points to exact signatures instead of reproducing the assertion API table. Its examples use complete scalar/string programs rather than an undefined Database client.

Editor setup no longer requires reading about metadata command payloads before configuring an ordinary editor. Those details remain linked for integration authors. A contributor checkout is a separate route, not the default installation path.

The old rule suggesting one assertion per test is not retained: related assertions may belong together when they describe one behavior.

## Source discrepancies to resolve

- The language testing guide advertises timeout behavior; the tooling guide explicitly says Oven Alpha rejects `--timeout` and `@timeout`. The new runner guide preserves that explicit limitation and requires release-candidate verification before relying on enforcement.
- The editor guide describes a format-on-save fallback while the LSP guide documents richer current integration. The new setup guide does not infer automatic formatting support from those other features.
- Source pages include several release eras. Consolidating their prose does not establish that every command is correct for the final 0.6 assets.

## Release checks

With the selected 0.6 release candidate:

1. Verify the retained examples in `tools/welcome/testing-editor-pilot/` against the selected release candidate. The chapter is an explanation, so these are maintainer checks rather than reader exercises. Confirm inline and conventional discovery, including the three named parameter cases.
2. Run the examples. Change one expected result, confirm a failing status, then restore it. Run a selected case and verify collection/selection IDs.
3. Verify fixture isolation, marker selection and strict-marker diagnostics with dedicated fixtures. Check worker-scope behavior before promising session-wide sharing.
4. Exercise the CI command with successful, failing and empty collections. Inspect JSON Lines, the final summary, JUnit output and exit status.
5. Verify whether the release executor rejects or supports timeout requests and update the guide from that evidence.
6. Install the matching extension and toolchain in a clean supported editor profile. Verify Doctor paths, diagnostics, hover, definition navigation, completion and restart after an upgrade. Check automatic formatting separately.

Website compilation and link checks validate the rendered documents; they are not evidence that these release workflows have been executed.

## Editorial review

Read the explanation without running its examples. Consider whether each example makes the surrounding idea clearer, whether any paragraph unexpectedly starts instructing the reader to perform a task, and whether the chapter would remain coherent on a printed page.

Ask readers to explain why a function can be correctly typed yet fail its test, how parameter cases differ from fixture dependencies, and why a passing run does not establish that every intended test ran. Record unclear assumptions and places where API detail interrupts the argument. Build and link checks cannot establish that the chapter succeeds at this.

The separate How-to guides can still be tried against concrete tasks: select a known case, make an empty collection fail CI, or diagnose an editor using an older language server than the terminal.

## Provenance

The consolidation uses the source snapshot recorded at Incan commit `1b179c7e2afd695c2e210455a0a126345a7b16a3`. The playground retains exact source inputs and their hashes under `tools/welcome/testing-editor-pilot/`. The new examples are editorial adaptations; successful execution on 0.6 is still pending. The std.testing and protocol references are existing documentation, not Pallay-generated API output.
