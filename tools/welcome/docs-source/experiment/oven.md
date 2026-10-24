# Build and run with Oven

Oven is the Incan-authored `incan` command line. It resolves the project's active dependencies and features, then asks the installed compiler to check or build the selected source.

## Check and run

Run these commands from your project directory:

```bash
incan check src/main.incn
incan run src/main.incn
```

`check` reports source errors without producing an executable. `run` builds when needed, then executes the program. Pass program arguments after `--`:

```bash
incan run src/main.incn -- input.csv
```

The program inherits the terminal's input and output. Its exit status becomes the command's exit status.

## Build an executable

```bash
incan build src/main.incn
incan build src/main.incn --profile release
```

The default profile is `debug`. Release builds require release-profile artifacts for the standard packages and other dependencies. Executables are written under `target/incan/<profile>/bin/`.

The compiler produces native code through the pinned Rust compiler. Incan source is not converted into a generated Rust project.

## Rebuilds and reuse

Oven reuses unchanged executables. Changes to source or selected build inputs invalidate that reuse. To inspect a rebuild decision:

```bash
OVEN_TRACE=- incan run src/main.incn
```

To inspect the selected source, features and dependencies:

```bash
incan describe-unit src/main.incn
```

## Run tests

```bash
incan test tests/test_greeting.incn
```

Pass a test source file explicitly. Tests execute on every invocation, even when their executable is reused. Dev.8's runner does not accept directory collection or the older selection/reporting flags.

## Missing dependencies

A dependency declaration does not download its artifacts. Oven prepares local Incan libraries before their consumers; external Rust units must be available in the installed registry closure. A missing dependency is reported explicitly. See [Manage dependencies](dependencies.md).

**Try it:** [Your first project](first-project.md) takes a small application through checking, running, tests and a debug build. Use the [CLI reference](cli-reference.md) for exact options.

*This chapter follows dev.8. The older `oven bake`, `lock` and `--release` interfaces do not apply. [Validation details](core-topics.md).*
