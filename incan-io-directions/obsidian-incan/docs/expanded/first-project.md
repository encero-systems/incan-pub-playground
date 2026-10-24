# Your first project

Build a greeting program, share its function with a test, then change its behavior.

**You need:** an [installed dev.8 toolchain](install.md) and a terminal. [Download the complete project](../assets/first-project.zip), or create the files below.

## Create the files

```bash
mkdir -p first-project/src first-project/tests
cd first-project
```

Create `loaf.toml`:

```toml
[project]
name = "first_project"
version = "0.1.0"

[project.scripts]
main = "src/main.incn"
```

Put the greeting function in `src/greeting.incn`. `pub` makes it available to other modules:

```incan
pub def greet(name: str) -> str:
    return f"Hello, {name}!"
```

Create the entry point, `src/main.incn`:

```incan
from greeting import greet


def main() -> None:
    println(greet("Incan"))
```

## Run the program

```bash
incan check src/main.incn
incan run src/main.incn
```

The program prints:

```text
Hello, Incan!
```

Change `"Incan"` in `main` to your name and run it again.

## Test the function

Create `tests/test_greeting.incn`:

```incan
from greeting import greet


def test_greeting() -> None:
    assert greet("Incan") == "Hello, Incan!"


def test_another_name() -> None:
    assert greet("Ada") == "Hello, Ada!"
```

Run the tests:

```bash
incan test tests/test_greeting.incn
```

Both tests should pass:

```text
test_greeting.incn::test_greeting PASSED
test_greeting.incn::test_another_name PASSED
```

Change one expected greeting to an incorrect value and rerun. The test should fail. Restore the correct value before continuing.

## Build the executable

```bash
incan fmt src tests
incan build src/main.incn
```

Find the executable under `target/incan/debug/bin/`. Running it produces the same greeting as `incan run`.

## Exercise

Make `greet("")` return `"Hello, stranger!"`. Add a test for the empty name and keep the two existing tests passing. This adds a new case without changing the behavior for named users.

Read [Projects and configuration](projects.md) for the layout rules, or [Build and run with Oven](oven.md) for profiles and executable reuse.

*Verified: program output, two passing tests, deliberate assertion failure and debug build on macOS arm64 with the dev.8 rehearsal bundle. [Exact version and checks](core-topics.md).*
