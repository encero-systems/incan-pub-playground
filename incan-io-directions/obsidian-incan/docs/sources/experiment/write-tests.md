# How testing works in Incan

A function's type describes the values it accepts and returns. It says less about the relationship between them. A function that accepts a string and returns a string might trim whitespace, change capitalization, or return its input untouched. All three implementations can have the same type. A test records a more specific expectation about the behavior.

Incan tests are functions containing such expectations. The test runner finds them, supplies any setup they require, and reports whether their assertions hold. Understanding how these pieces fit together helps explain both what a passing suite tells us and what it leaves open.

The examples in this chapter assume familiarity with functions, imports and basic string operations. They illustrate the testing model; they do not form a project to build or a sequence of exercises.

## An expectation made explicit

Consider a function that prepares a name for comparison by removing surrounding whitespace and converting it to lowercase. Its signature describes a string-to-string operation. The assertion below captures a particular consequence of that operation:

```incan
"""Normalize names and check the behavior beside its implementation."""


def normalize_name(name: str) -> str:
    return name.strip().lower()


module tests:
    from std.testing import assert_eq

    def test_normalize_name() -> None:
        assert_eq(normalize_name("  Alice  "), "alice")
```

The input contains two kinds of variation: spaces around the name and an uppercase initial. The expected value, `"alice"`, says that neither should remain. If the function stopped converting to lowercase, its type would still be correct, but this test would fail.

The expected value is written independently of the implementation. A test that calculated its expectation by repeating the same trimming and lowercasing operations could reproduce the implementation's mistake. Writing down the result makes the intended behavior available for comparison.

That does not make the expectation infallible. Lowercasing is appropriate for this example's comparison rule; it would be a questionable rule for displaying someone's name. A failed assertion identifies a disagreement between the program and the test. Deciding which one should change still requires an understanding of the program's purpose.

The language `assert` statement expresses an expectation as a condition. Helpers from `std.testing`, such as `assert_eq`, express common comparisons. Several assertions can describe one coherent behavior; the useful boundary is whether a failure can be understood in terms of that behavior. The [assertion reference](../language/reference/stdlib/testing.md#assertion-functions) describes the available comparisons and their signatures.

## Tests and the code they examine

The example places its test inside `module tests:` in the same file as the function. An inline test block can see names in the enclosing file, including private helpers. That makes it possible to examine an implementation detail without making it part of the module's public interface. The block's imports and declarations belong to the test context, and normal build/run output omits its test body.

A conventional test file provides another context. Its name matches `test_*.incn` or `*_test.incn`, and its tests are top-level functions. Such a file can import the code it examines through the same public interface available to other callers. Tests that span modules or check a public interface often fit naturally there.

The two locations answer different questions about visibility. An inline test can examine how a module is put together. A separate test can examine what the module exposes to its callers. Neither location, by itself, determines how useful the test is: that depends on the behavior being checked.

Location also matters to discovery. A top-level function named `test_*` in an ordinary production file is not collected merely because of its name; inline tests belong inside the file's test block. Likewise, a run restricted to the `tests/` directory does not include inline tests in `src/`. The scope of a run is therefore part of the meaning of its result.

## One behavior, several cases

The first assertion checks one input. It says nothing about an empty string, and it does not distinguish trimming from lowercasing: both happen in the same call. Several carefully chosen cases make those expectations easier to see.

Parameterization gives each case the same test body while allowing its input and expected value to differ. Here the small function is repeated so that the relationship remains visible in the example:

```incan
"""Exercise normalization with named input cases."""

from std.testing import assert_eq, parametrize


def normalize_name(name: str) -> str:
    return name.strip().lower()


@parametrize("name, expected", [
    ("  Alice  ", "alice"),
    ("BOB", "bob"),
    ("", ""),
], ids=["padded", "uppercase", "empty"])
def test_normalize_name(name: str, expected: str) -> None:
    assert_eq(normalize_name(name), expected)
```

The three rows describe three situations. `padded` combines surrounding whitespace with mixed case, `uppercase` checks capitalization without whitespace, and `empty` records that an empty string remains empty. The runner treats each row as a separate case, so its report can identify which situation failed.

Named cases also communicate the reasoning behind the selection. A long list of strings may exercise the function repeatedly without making clear what each string contributes. A short list whose cases represent distinct behavior is easier to maintain and interpret.

Parameterization is useful when the cases share a question. When the setup or expected behavior changes substantially, separate tests can make those differences clearer. The syntax is a means of expressing the relationship between cases; reducing the number of function declarations is a secondary benefit.

## Fixtures express dependencies

A test may need more than input values. It might require a temporary directory, a configured environment, or a resource that must be closed afterward. That preparation is part of the test's context. A fixture gives it a name and allows tests to declare that they depend on it.

Incan resolves a fixture through a test parameter with the same name. A string is enough to show the relationship:

```incan
"""Supply a shared input without repeating setup in each test."""

from std.testing import assert_eq, fixture


@fixture
def padded_name() -> str:
    return "  Alice  "


def test_trim(padded_name: str) -> None:
    assert_eq(padded_name.strip(), "Alice")


def test_normalize(padded_name: str) -> None:
    assert_eq(padded_name.strip().lower(), "alice")
```

Both tests declare a dependency on `padded_name`. The runner calls the fixture and supplies its value as the argument. The test body can then concentrate on the operation and its expected result.

For a string this small, repeating the value would be perfectly reasonable. The fixture shows its value more clearly when preparation is substantial, shared by several tests, or associated with cleanup. Giving that preparation a name makes the dependency visible at the test's boundary.

Fixtures can themselves depend on other fixtures. This forms a chain of preparation leading to the test. If preparation fails, the test may never reach its assertion. Such an error describes a failure to establish the required context, which is different from observing the program return an unexpected result.

Parameterization and fixtures can be used together. Parameterization describes the cases to examine; a fixture describes the context needed to examine them. Keeping those roles clear makes it easier to understand why a test has a particular argument.

## Scope, isolation and cleanup

A fixture's scope determines how long its prepared value can be reused. With the default function scope, each case receives fresh setup. Module scope permits reuse within a source file. Session scope permits reuse within a worker batch; it does not create one global instance shared by every parallel worker.

Reuse can avoid expensive preparation, but it also introduces a relationship between tests. If two tests receive the same mutable resource, a change made by one may affect the other. A test that passes alone and fails in a suite may be exposing that shared state. Choosing a scope therefore involves both the cost of preparation and the independence of the tests.

Cleanup is the other side of the resource's lifetime. In a fixture with `yield`, preparation precedes the yield, the yielded value is supplied to the test, and teardown follows. Teardown can run after an assertion failure while the worker remains alive. Terminating the worker process can prevent it from running, so a fixture is not an unconditional guarantee that an external resource will be recovered.

The [fixture reference](../language/reference/stdlib/testing.md#fixtures-and-parametrization) gives the precise rules for scopes, dependencies, asynchronous fixtures and teardown. Those rules become especially important when the resource outlives a single test or is shared beyond the test process.

## What a test result tells us

Before an assertion can succeed or fail, the runner must discover the test, include it in the selected run, and prepare it for execution. These stages explain why a successful command is not, on its own, evidence that every intended behavior was checked. A test outside the selected paths, or excluded by a mark, contributes no passing assertion to that run.

Marks add context to selection and reporting. A skipped test records that a check is not being executed. An expected-failure mark records that a failure is currently anticipated. Neither has the same meaning as an ordinary passing test. Reasons attached to these marks help preserve that distinction as the suite changes. The [runner chapter](run-tests.md#select-the-work-you-need) covers the commands that control selection.

A passing test establishes that its observed result agreed with its expectation under the conditions of that run. It does not establish that every possible input behaves correctly, or that the expectation itself captures the right requirement. A useful suite makes its chosen cases and conditions clear enough that another reader can judge what confidence they provide.

For the operational side—listing cases, narrowing a failure and interpreting CI results—see [Run tests](run-tests.md). Exact APIs belong in the [std.testing reference](../language/reference/stdlib/testing.md). The existing [language-book tutorial](../language/tutorials/book/13_unit_tests.md) provides a guided introduction.

> **Preview status.** This chapter follows the recorded development documentation. Its illustrative examples have not been executed against the matching 0.6 release candidate. [Editorial notes and release checks](testing-editor-pilot.md) record the remaining verification, including the executor's timeout limitation.
