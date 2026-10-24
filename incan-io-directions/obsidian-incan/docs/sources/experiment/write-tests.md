# How testing works in Incan

Incan tests are functions that check behavior through assertions. The runner discovers tests, prepares their fixtures and reports the results.

## Assertions

An assertion checks an expected result. Here, `assert_eq` checks that `normalize_name` trims whitespace and converts the name to lowercase:

```incan
"""Normalize names and check the behavior beside its implementation."""


def normalize_name(name: str) -> str:
    return name.strip().lower()


module tests:
    from std.testing import assert_eq

    def test_normalize_name() -> None:
        assert_eq(normalize_name("  Alice  "), "alice")
```

The language `assert` statement checks a condition; helpers such as `assert_eq` handle common comparisons. Expected values should express the requirement independently of the implementation. Repeating the implementation inside an assertion can repeat its mistakes.

See the [assertion reference](../language/reference/stdlib/testing.md#assertion-functions) for available helpers.

## Test placement

Tests can live in two places:

- **Inline:** a `module tests:` block inside a production file, as above. It can access private helpers in that file. Its imports and declarations belong to the test context and are omitted from normal builds.
- **Separate files:** top-level tests in files named `test_*.incn` or `*_test.incn`. These typically import the public interfaces they test.

A top-level `test_*` function in an ordinary production file is not collected. Inline tests must be inside its test block. Discovery also depends on the selected path: searching `tests/` will not find inline tests in `src/`.

## Test parameterization

`@parametrize` runs the same test with several sets of arguments. Each row becomes a separate case, identified in the results by its optional name:

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

These cases check padded, uppercase and empty names. Parameterization suits checks that share the same logic. Separate tests are clearer when their setup or expected behavior differs substantially.

## Fixtures

Fixtures provide test setup. A test requests a fixture by declaring a parameter with the same name; the runner calls the fixture and supplies its value:

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

Fixtures can depend on other fixtures. If setup fails, the dependent test cannot reach its assertions. This is a setup error, distinct from an assertion failure.

## Fixture scope and cleanup

Scope controls how long a fixture value is reused:

- **Function** (default): fresh setup for each case.
- **Module:** shared within a source file.
- **Session:** shared within a worker batch, not across all parallel workers.

Broader scopes reduce repeated setup but can share mutable state between tests. One test's changes may then affect another's result.

A fixture with `yield` performs setup before the yield and cleanup afterward. Cleanup can run after an assertion failure, but terminating the worker process can prevent it. See the [fixture reference](../language/reference/stdlib/testing.md#fixtures-and-parametrization) for dependency, scope and teardown rules.

## Test results

A passing result applies to the cases that actually ran. Tests outside the selected paths or excluded by marks provide no passing checks. Skipped and expected-failure results should be read separately from ordinary passes.

[Run tests](run-tests.md) covers discovery, selection, diagnostics and CI. The [std.testing reference](../language/reference/stdlib/testing.md) documents the APIs.

> **Preview:** these examples have not been executed against the matching 0.6 release candidate. [Verification notes](testing-editor-pilot.md).
