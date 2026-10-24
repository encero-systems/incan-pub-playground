# Write tests

A useful test makes a promise about your program explicit. When the implementation changes, the test tells you whether that promise still holds. This chapter shows how to place those checks, cover several inputs without repeating yourself, and share setup when several tests need it.

By the end, you should be able to choose a home for a test, express its expected result, and recognize when a parameter set or a fixture makes the test easier to understand.

## Before you begin

You need an Incan project that already builds and a toolchain with the documented testing support. You should be comfortable defining a function, importing a name, and reading string and list values. The [getting-started tutorial](../tooling/tutorials/getting_started.md) covers project setup if you need it. No other chapter in this pilot is required first.

The examples use a small name-normalization function: it removes surrounding whitespace and converts the name to lowercase. Each code block is complete for its named file. You can use them independently; in an application, tests should exercise the real production function rather than maintain their own copy.

> **0.6 content preview.** The examples follow the recorded development documentation but have not been executed against the release candidate. [Review notes and release checks](testing-editor-pilot.md) track that remaining verification.

## Choose where the test belongs

Start with the behavior you want to protect. For a small helper, keeping the test beside the implementation makes their relationship easy to see. Incan supports an inline `module tests:` block for this purpose. Save this example as `src/names.incn`:

```incan
"""Normalize names and check the behavior beside its implementation."""


def normalize_name(name: str) -> str:
    return name.strip().lower()


module tests:
    from std.testing import assert_eq

    def test_normalize_name() -> None:
        assert_eq(normalize_name("  Alice  "), "alice")
```

The function promises to turn `"  Alice  "` into `"alice"`. The test calls the function with the padded name and compares the returned value with that expectation. It tests the result a caller cares about, so an implementation change can preserve the test as long as it preserves that behavior.

The inline block can access names in its enclosing file, including private helpers. Test-only imports belong inside that block. Its names do not become production module members, and normal build/run output omits the test body. A production file may contain at most one `module tests:` block.

When a test checks a public interface or spans several modules, a separate test file is often a clearer home. Name it `test_*.incn` or `*_test.incn`, declare tests at the top level, and import the public code you want to exercise. Do not wrap those declarations in another `module tests:` block. Conversely, putting a top-level `test_*` function in an ordinary production file does not make it a collected test.

The distinction is the test's context: an inline block gives access to the implementation beside it; a conventional test file exercises code through imports. Both forms can be collected from the project root.

## Assert the behavior you care about

An assertion is the point where the promise becomes a check. In the example, `assert_eq` compares the function's result with `"alice"`. The language `assert` statement is useful when the expectation is naturally a condition. Choose the form that makes a failure easiest to understand.

A test does not need to stop at one assertion. Several related checks can describe one behavior. If the checks start describing unrelated promises, separate tests will make it easier to identify what broke.

For `Option` and `Result`, first establish which variant you expect. Helpers such as `assert_is_some`, `assert_is_ok` and `assert_is_err` check that variant and return the contained value, allowing the next assertion to examine it without an unchecked unwrap. The [assertion reference](../language/reference/stdlib/testing.md#assertion-functions) gives the exact signatures and optional messages; [runtime error checks](../language/reference/stdlib/testing.md#assert_raises) cover expected raised errors.

## Cover several inputs

One padded name is a useful start, but it leaves other behavior unexamined. Does an uppercase name become lowercase? Does an empty name stay empty? These questions use the same operation and comparison, so they fit one parameterized test.

Save this independent example as `tests/test_normalization.incn`. The small function is included to make the example self-contained; import your production function when adapting it to an application.

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

Each row supplies a `name` and an `expected` value. The runner collects a separate case for each row, so a failure in `uppercase` can be distinguished from one in `empty`. The IDs describe the situations being checked; they are more useful during diagnosis than a collection of indistinguishable repeated calls.

Use parameterization when the same behavior must hold for several inputs. Keep distinct tests when the setup or the meaning of the check changes substantially. If a particular row needs its own marks, `param_case` provides that additional control; see the [parametrization reference](../language/reference/stdlib/testing.md#fixtures-and-parametrization).

## Share setup with fixtures

Parameter sets vary the inputs to a check. Fixtures solve a different problem: supplying setup that several checks need. A fixture declares a value once, and a test requests it by adding a parameter with the fixture's name. The runner resolves that dependency.

This deliberately small example can live in `tests/test_fixture.incn`:

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

Both tests request `padded_name`, but each makes a different assertion. This string would be easy to repeat; it keeps the injection mechanism visible before you apply it to more substantial setup. A fixture becomes useful when repetition obscures a test or when setup has a lifetime that needs managing.

Start with the default function scope, which provides fresh setup for each case. A broader scope trades that isolation for reuse: module scope shares within a source file, while session scope shares within a worker batch. A session fixture is **not one global instance across all parallel workers**. Choose the smallest scope that meets the test's needs, particularly when the value is mutable or represents an external resource.

When setup needs cleanup, a fixture can use one top-level `yield`. Setup runs before it, the yielded value is injected, and teardown follows. Teardown runs after an assertion failure while the worker remains alive; terminating the process can bypass it. Async fixtures use the same decorator with `async def` and exactly one `yield`; setup and teardown are awaited, and dependencies are torn down in reverse order. The [fixture contract](../language/reference/stdlib/testing.md#fixtures-and-parametrization) describes these lifetime rules in detail.

As the suite grows, shared `conftest.incn` fixtures can serve conventional tests under the matching `tests/**` subtree. They do not apply to inline blocks in production source directories. Built-in `tmp_path`, `tmp_workdir` and `env` fixtures are requested by parameter name when a test needs isolated files, a working directory or environment changes.

## Mark intent explicitly

Some tests need context beyond their assertion. A costly check may be excluded from everyday runs; a known failure may need to remain visible while a fix is pending. Marks make those decisions explicit instead of hiding them in comments or deleting the check.

Import each decorator from `std.testing`. Use `@skip(reason)` when a check cannot run yet, and `@xfail(reason)` when its failure is known and should remain tracked. An unexpectedly passing xfail is a failure signal: review the reason and remove the mark when the underlying problem is fixed. `@slow` identifies costly tests, and `@mark("smoke")` creates a selectable group. Register `"smoke"` in `TEST_MARKERS` when using strict marker checking. For a test whose name does not begin with `test_`, use `@test`.

Conditional `skipif` and `xfailif` evaluate collection-time conditions; `platform()` and `feature(name)` support those decisions. [Run tests](run-tests.md#select-the-work-you-need) explains how marks affect selection. Check the [executor's timeout limitation](run-tests.md#respect-the-executor-boundary) before relying on timeout enforcement.

## Check your result

From the project root, list the tests before running them:

```bash
incan test --list .
incan test .
```

If you saved all three examples, look for the inline test, the three named normalization cases, and the two fixture tests. Those are the expected checks for this preview, not a transcript of a verified release-candidate run. If one is missing, check its file name and test context first. Listing only `tests/` will not find the inline test in `src/names.incn`.

To check that an assertion protects the intended behavior, temporarily change the inline test's expected value from `"alice"` to `"Alice"` and run `incan test src/names.incn`. The comparison should fail. Restore `"alice"` and run again; it should pass. A collection or compilation error means the test has not reached that comparison yet. [Investigating a failure](run-tests.md#investigate-a-failure) helps distinguish those stages.

You now have three ways to keep checks readable: place them in an appropriate context, express repeated input cases together, and share setup through explicit dependencies. Use whichever the behavior needs; a small test does not need all three.

## Go further

- [Run tests](run-tests.md) — select cases, diagnose failures and report results in CI.
- [Unit tests in the language book](../language/tutorials/book/13_unit_tests.md) — a progressive introduction to testing.
- [std.testing reference](../language/reference/stdlib/testing.md) — exact assertion, fixture and decorator contracts.
