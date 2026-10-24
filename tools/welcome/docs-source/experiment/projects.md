# Projects and configuration

An Incan project contains source files and a `loaf.toml` manifest. The manifest names the package and declares its dependencies.

## Project layout

```text
greeter/
├── loaf.toml
├── src/
│   ├── main.incn
│   └── greeting.incn
└── tests/
    └── test_greeting.incn
```

Use `src/main.incn` for the application entry point and other source modules for shared code. A library uses `src/lib.incn`. Tests belong in `tests/`.

A module is a source file. Keeping `greet` in `greeting.incn` lets both the application and its tests use the same function. The `main` function in the entry file is where execution starts.

## The manifest

```toml
[project]
name = "greeter"
version = "0.1.0"

[project.scripts]
main = "src/main.incn"
```

`name` identifies the package; `version` is the version of your code, not the Incan compiler. Both are required. Script entries name existing source files. Run a program by passing its path:

```bash
incan run src/main.incn
```

Incan finds the nearest `loaf.toml` above the source file. Paths passed on the command line are relative to your current directory.

## Sharing code between files

A public declaration can be imported by another module. In `src/greeting.incn`:

```incan
pub def greet(name: str) -> str:
    return f"Hello, {name}!"
```

In `src/main.incn`:

```incan
from greeting import greet


def main() -> None:
    println(greet("Incan"))
```

`from greeting import greet` looks for the `greeting` module and imports its public function. The `.incn` extension is omitted from the import.

## Source roots

Imports resolve from `src/` when that directory exists, otherwise from the project root. To use another directory:

```toml
[build]
source-root = "app"
```

Update the script paths if you move your entry points.

## Source and build files

Keep source, tests and `loaf.toml` in version control. Add `target/` to `.gitignore`; it contains build outputs.

Declare libraries and Rust crates in the manifest as described in [Manage dependencies](dependencies.md). The [manifest reference](project-reference.md) lists all configuration fields.

**Try it:** [Your first project](first-project.md) uses this layout and tests a shared function.
