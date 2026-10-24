# Run tests

Choose what to collect, narrow a failing run, and make CI report meaningful failures. Run these commands from the project root using the toolchain selected for that project. [Write tests](write-tests.md) owns assertions, fixtures, parameter sets and markers.

> **0.6 content preview.** These commands follow the recorded runner documentation. Release-candidate execution remains to be checked; the documented Oven Alpha timeout limitation is called out below.

## Check what will run

List tests before executing them:

```bash
incan test --list .
```

Using `.` includes conventional test files and production files containing inline test blocks. Passing only `tests/` does not search `src/` for inline tests. Test-file names must match `test_*.incn` or `*_test.incn`; inside a valid test context, functions use `test_*` names or `@test`.

If a test is missing, check the path first, then its file name and test context. [Choose where the test belongs](write-tests.md#choose-where-the-test-belongs) explains the two supported forms.

Run the project or a single file:

```bash
incan test .
incan test src/names.incn
```

These are alternatives: the first runs the project scope; the second narrows it to the inline example from the authoring guide.

## Select the work you need

| Task | Command |
| --- | --- |
| Match a test name or parameter-case ID | `incan test -k "normalize" .` |
| Select a marker expression | `incan test -m "smoke and not slow" .` |
| Reject unregistered markers | `incan test --strict-markers .` |
| Include slow tests | `incan test --slow .` |
| Stop after the first failure | `incan test -x .` |
| Run xfail tests as ordinary tests | `incan test --run-xfail .` |
| Enable a collection-time feature probe | `incan test --feature new_parser .` |

Use the stable test ID printed by `--list` when selecting a particular parameter case. `-k` matches those IDs. A `--feature` flag supplies a value to collection-time `feature(...)` checks; it is not a general application configuration switch.

## Investigate a failure

Start with a selected test and verbose output:

```bash
incan test -v -k "normalize" .
```

Read whether the failure happened during collection, compilation/preparation, or test execution. A build or missing-plan failure is not an assertion failure. Keep the diagnostic and toolchain version when reporting it; follow the project's supported toolchain/bake instructions rather than editing generated artifacts.

| Need | Command |
| --- | --- |
| See output from passing tests | `incan test --nocapture .` |
| Find the slowest cases | `incan test --durations 10 .` |
| Investigate order dependence reproducibly | `incan test --shuffle --seed 12345 .` |
| Run independent worker batches concurrently | `incan test --jobs 4 .` |

Use the same seed to reproduce an ordering experiment. When enabling workers, remember that session-scoped fixtures are per worker batch; they are not a single process-wide service shared by the entire run. Tests that touch shared external resources need appropriate isolation or the runner's scheduling constraints.

## Make CI fail usefully

Require at least one collected test and produce both machine-readable results and a JUnit report:

```bash
incan test --fail-on-empty --format json --junit reports/junit.xml .
```

Prepare the selected Incan toolchain and project dependencies before this step. Preserve the command's exit status in CI, and collect the JUnit artifact even when tests fail.

The documented result stream is JSON Lines, with `incan.test.v1` result records and a final summary. Treat runner errors and test failures as unsuccessful runs. Exit code `0` means success, but without `--fail-on-empty` it can also mean an empty collection; this is why the CI command includes the flag. The recorded guide lists `1` for test failures, missing test files and fail-on-empty failures. See the [CLI reference](../tooling/reference/cli_reference.md) for the selected release's complete command contract.

## Respect the executor boundary

The recorded **Oven Alpha executor rejects `--timeout` and `@timeout`** rather than running without the requested enforcement. Do not use either as a safety guarantee for that executor. The older authoring page describes timeout behavior more broadly; that discrepancy must be reconciled against the 0.6 release candidate.

Fixture cleanup also cannot guarantee recovery after a worker process is terminated. Keep cleanup idempotent, isolate external resources and use narrow scopes when prompt release matters. [Write tests](write-tests.md#share-setup-with-fixtures) owns fixture authoring and lifetime choices.

## Continue

- [Write tests](write-tests.md) — author the checks that this runner executes.
- [Troubleshooting](../tooling/how-to/troubleshooting.md) — diagnose toolchain and build failures.
- [CLI reference](../tooling/reference/cli_reference.md) — exact options for the documented release.
- [Review notes and release checks](testing-editor-pilot.md) — the consolidation map and remaining verification.
