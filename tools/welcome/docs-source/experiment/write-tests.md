# Write tests

Keep tests close to the behavior they check, share setup through fixtures, and use parameter sets when the same check needs several inputs. This guide owns test authoring; [Run tests](run-tests.md) covers discovery, selection and CI.

> **0.6 content preview.** This consolidation follows the recorded development documentation. The examples have not been executed against the release candidate. [Review notes and release checks](testing-editor-pilot.md) record the remaining checks.

## Choose where the test belongs

| Put tests in | Use it for |
| --- | --- |
| A conventional `test_*.incn` or `*_test.incn` file | Public behavior, integration tests and checks spanning modules |
| One `module tests:` block in a production file | Unit tests beside their implementation, including same-file private helpers |

In a conventional test file, declare tests and fixtures at the top level. Do not add a `module tests:` block there. In a production file, put tests and test-only imports inside its inline block; a top-level function named `test_*` in production code is not collected as a test.

Save this complete example as `src/names.incn` in an existing project:

```incan
"""Normalize names and check the behavior beside its implementation."""


def normalize_name(name: str) -> str:
    return name.strip().lower()


module tests:
    from std.testing import assert_eq

    def test_normalize_name() -> None:
        assert_eq(normalize_name("  Alice  "), "alice")
```

The block can access names in the enclosing file, including private helpers. Its names do not become production module members, and normal build/run output omits the test body. A production file may contain at most one such block.

For a separate test file, use the ordinary top-level form and import the public code under test. [Run tests](run-tests.md#check-what-will-run) explains how to check that either form is collected.

## Assert the behavior you care about

Use the language `assert` statement for a direct condition, or import helpers such as `assert_eq` for comparisons. An assertion should describe the behavior the test is protecting; several related assertions can belong in one test.

For `Option` and `Result`, helpers such as `assert_is_some`, `assert_is_ok` and `assert_is_err` both check the variant and return the contained value. This avoids unchecked unwraps in the test body. See the [assertion reference](../language/reference/stdlib/testing.md#assertion-functions) for exact signatures and optional messages, and [runtime error checks](../language/reference/stdlib/testing.md#assert_raises) when checking a raised error.

## Cover several inputs

Save this as `tests/test_normalization.incn`. It is a standalone example; in your application, import the production function rather than copying it into the test file.

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

Each parameter set becomes a separate case. Named IDs make failures and selected runs easier to recognize. Use `param_case` when one case needs its own marks; the [testing reference](../language/reference/stdlib/testing.md#fixtures-and-parametrization) is the contract home.

## Share setup with fixtures

A fixture supplies a value by name. Add a parameter with the fixture's name to a test or another fixture; the runner resolves the dependency.

This complete example can live in `tests/test_fixture.incn`:

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

Start with the default function scope so each case gets fresh setup. Use module scope to share within one source file, or session scope to share within a worker batch. A session fixture is **not one global instance across all parallel workers**.

For cleanup, use one top-level `yield`: setup goes before it, the yielded value is injected, and teardown follows. Teardown runs after assertion failure while the worker remains alive; process termination can bypass it. Async fixtures use the same decorator, `async def` and exactly one `yield`; setup and teardown are awaited. Dependencies are torn down in reverse order. See the [fixture contract](../language/reference/stdlib/testing.md#fixtures-and-parametrization) for scope and async details.

Shared `conftest.incn` fixtures apply to conventional tests under the matching `tests/**` subtree, not inline test blocks in production source directories. Built-in `tmp_path`, `tmp_workdir` and `env` fixtures are injected by parameter name. Use them when the test needs isolated files, working directories or environment changes; do not rely on a developer's persistent state.

## Mark intent explicitly

Import each decorator you use from `std.testing`.

| Need | Use |
| --- | --- |
| A test name that does not begin with `test_` | `@test` |
| A check that cannot run yet | `@skip(reason)` |
| A known failure that should remain visible | `@xfail(reason)` |
| A costly test excluded from ordinary runs | `@slow` |
| A selectable group | `@mark("smoke")`, with `"smoke"` registered in `TEST_MARKERS` for strict checking |

Conditional `skipif` and `xfailif` use collection-time conditions; `platform()` and `feature(name)` support those decisions. An unexpectedly passing xfail is a failure signal, not a reason to silently discard the mark. Keep its tracked reason current.

[Run tests](run-tests.md#select-the-work-you-need) owns marker selection, slow-test inclusion, strict checking and feature flags. Timeout enforcement depends on the executor; [check the release boundary](run-tests.md#respect-the-executor-boundary) before relying on it.

## Continue

- [Run tests](run-tests.md) — collect, select, diagnose and report results.
- [Unit tests in the language book](../language/tutorials/book/13_unit_tests.md) — a progressive tutorial.
- [std.testing reference](../language/reference/stdlib/testing.md) — exact assertion and fixture contracts.
