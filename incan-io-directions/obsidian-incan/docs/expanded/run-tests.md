# Run tests

A test result is only useful when you know what ran. This chapter follows a test run from discovering its cases to investigating a failure and reporting the result in CI. You will learn how to narrow the work without accidentally excluding the checks you meant to run.

## Before you begin

You need a working Incan project with at least one test and the toolchain selected for that project. Run the commands from the project root. You should know how to open a terminal there and recognize the difference between a file path and a test name.

You can use your existing suite; completing another chapter is not required. If you have no tests yet, the [language-book tutorial](../language/tutorials/book/13_unit_tests.md) introduces them. Commands below use `normalize` and `src/names.incn` as example names; substitute a test name or path from your own suite. [How testing works in Incan](write-tests.md) explains the model behind these commands.

> **0.6 content preview.** The commands follow the recorded runner documentation. Execution against the release candidate is still pending, including verification of the Oven Alpha timeout limitation described below.

## Check what will run

Begin by asking the runner to list the tests it can discover:

```bash
incan test --list .
```

The final `.` selects the project-root directory. That scope can include conventional test files as well as inline test blocks inside production files. Selecting only `tests/` would leave out an inline test in `src/`, even if that test belongs to the same project.

Read the list before interpreting a successful run. A missing test cannot fail, so a green result alone does not establish that your intended behavior was checked. Conventional files must match `test_*.incn` or `*_test.incn`; within a valid test context, functions use `test_*` names or `@test`. For inline tests, check that the declaration is inside the production file's `module tests:` block. [Tests and the code they examine](write-tests.md#tests-and-the-code-they-examine) explains those contexts.

Once the list contains the expected cases, run that scope:

```bash
incan test .
```

For a smaller loop while editing one file, select its path instead:

```bash
incan test src/names.incn
```

These commands answer different questions. The first checks the selected project scope; the second checks the file you are working on. A narrow run is useful feedback during an edit, followed by a broader run before you rely on the change.

## Select the work you need

Sometimes a file contains more cases than you need to investigate. The `-k` option matches test IDs, including parameter-case IDs. Use the names printed by `--list` to choose a meaningful match:

```bash
incan test -k "normalize" .
```

In the companion examples, this selects normalization checks. In your project, choose a fragment that identifies the behavior under investigation and inspect the selected results; an overly broad fragment may match several tests.

Marks let you select by purpose instead of spelling. For example, `incan test -m "smoke and not slow" .` selects a marker expression. Authors declare those marks in the tests; the runner interprets them when selecting work. Strict checking helps catch an unregistered mark, while slow-test and xfail options let you deliberately change the normal run policy.

| Intention | Command |
| --- | --- |
| Reject unregistered markers | `incan test --strict-markers .` |
| Include slow tests | `incan test --slow .` |
| Stop after the first failure | `incan test -x .` |
| Run xfail tests as ordinary tests | `incan test --run-xfail .` |
| Enable a collection-time feature probe | `incan test --feature new_parser .` |

The last option supplies a value to collection-time `feature(...)` checks. It does not configure arbitrary application behavior. [What a test result tells us](write-tests.md#what-a-test-result-tells-us) explains how these distinctions affect interpretation, and the [CLI reference](../tooling/reference/cli_reference.md) provides the full option contract.

## Investigate a failure

First identify how far the run got. Collection finds the test cases; compilation and preparation make them runnable; execution evaluates their assertions. If preparation fails, changing an expected assertion value cannot fix it because the assertion has not run yet.

For a selected failing test, request verbose output:

```bash
incan test -v -k "normalize" .
```

Read the diagnostic alongside the test ID. For an assertion failure, compare the actual result with the expected behavior before deciding whether the implementation or the test is wrong. For a toolchain or missing-plan failure, follow the project's supported setup and bake instructions. Keep the diagnostic and compiler version when asking for help.

Additional output is useful when it answers a specific question. `--nocapture` exposes output from passing tests, while `--durations 10` identifies the slowest cases. If a failure seems to depend on order, use `--shuffle --seed 12345` and retain the seed so the ordering experiment can be repeated.

Parallel workers can shorten an independent suite: `incan test --jobs 4 .` requests four workers. Before increasing concurrency, check whether tests share external files or services. A session fixture is per worker batch, not one instance shared across all workers. Isolation and fixture lifetime matter more than the worker count; [scope and isolation](write-tests.md#scope-isolation-and-cleanup) explains those choices.

## Make CI fail usefully

CI should report both failures and the unexpected absence of tests. Without an explicit empty-collection check, a successful exit can simply mean that nothing was collected. Combine that check with machine-readable output and a JUnit report:

```bash
incan test --fail-on-empty --format json --junit reports/junit.xml .
```

Prepare the selected toolchain and project dependencies before this command. Preserve its exit status in the CI job, and arrange to collect the JUnit artifact even when the command fails; the failing run is often the one whose report you most need.

The documented result stream is JSON Lines, with `incan.test.v1` result records followed by a summary. A report consumer should read the stream as records rather than assume one JSON document. Exit code `0` means success, but can include an empty collection unless `--fail-on-empty` is supplied. The recorded guide lists `1` for test failures, missing test files and fail-on-empty failures. Consult the [CLI reference](../tooling/reference/cli_reference.md) for the selected release's complete contract.

## Respect the executor boundary

The recorded **Oven Alpha executor rejects `--timeout` and `@timeout`** rather than running without the requested enforcement. The older authoring page describes timeout behavior more broadly, so this discrepancy must be resolved against the 0.6 release candidate before timeout support is promised.

Keep that boundary in mind when a test may hang or leave resources behind. Fixture teardown can run after an assertion failure while its worker remains alive, but cannot guarantee recovery after the process is terminated. Isolate external resources and make cleanup safe to repeat.

## Check your result

A useful verification covers more than the passing case. First list your intended scope and confirm that a known test appears. Run it, then temporarily change one expected value so it must fail. The selected run should report a failure; restore the value and confirm that it passes again. If either result is surprising, check the selected test ID before changing the program.

For CI, also try a selection that you have confirmed matches no tests, with `--fail-on-empty` enabled. It should fail rather than silently approve an empty run. Inspect the JSON Lines and JUnit output from both successful and failing runs, and verify that the job preserves the runner's status. These are release-verification steps for this preview; they have not yet been executed against the matching 0.6 candidate.

Once those checks hold, you can distinguish three outcomes: the intended tests passed, a behavior failed, or the runner could not execute the intended tests. That distinction makes the result actionable both at your desk and in CI.

## Go further

- [How testing works in Incan](write-tests.md) — test placement, assertions, parameter sets and fixtures.
- [Troubleshooting](../tooling/how-to/troubleshooting.md) — toolchain and build failures.
- [CLI reference](../tooling/reference/cli_reference.md) — exact commands and options.
- [Review notes and release checks](testing-editor-pilot.md) — source discrepancies and pending verification.
