# Projects and configuration

A project is source code plus `loaf.toml`. The manifest identifies the package, describes its dependencies and selects its source layout.

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

`src/main.incn` is the application entry point. Shared functions live in other source modules; tests import their public interfaces. A library uses `src/lib.incn`.

Source commands find the nearest manifest above the source file. Pass the source path explicitly, relative to your current directory.

## Package identity

```toml
[project]
name = "greeter"
version = "0.1.0"

[project.scripts]
main = "src/main.incn"
```

`name` and `version` are required. Script entries name existing source files; they do not let you omit the path from `incan run`.

```bash
incan run src/main.incn
```

Edit the manifest's version when releasing your package. Dev.8 does not provide project scaffolding, version-bump or named-environment commands.

## Source roots

Oven uses `src/` when it exists, otherwise the project root. Configure a different directory explicitly:

```toml
[build]
source-root = "app"
```

Imports resolve against that source root. Moving source files requires updating any script paths that name them.

## Dependencies and build outputs

Keep source, tests and authored manifests in version control. Files under `target/` are build outputs. Dependency declarations belong in the manifest; see [Manage dependencies](dependencies.md) for Incan libraries and Rust crates.

Dev.8 has no `incan lock` command. Do not carry the older lockfile workflow into a new project. The [manifest reference](project-reference.md) lists accepted fields, including package features and metadata; accepting `requires-incan` metadata does not currently enforce that requirement.

**Try it:** [Your first project](first-project.md) builds this layout and shares a function between the application and its tests.
