# Build and run with Oven

Oven is Incan's build tool. Use the `incan` command to check source, run programs, build executables and run tests.

## Check and run

From your project directory:

```bash
incan check src/main.incn
incan run src/main.incn
```

`check` reports errors without producing an executable. Use it for quick feedback while editing. `run` builds the program when needed and starts it; there is no need to run `build` first.

Pass arguments to your program after `--`:

```bash
incan run src/main.incn -- input.csv
```

The program reads and writes through your terminal. Its exit status becomes the command's exit status.

## Build an executable

```bash
incan build src/main.incn
```

Unlike `run`, `build` creates the executable without starting it. Use it when you want to run the binary separately or prepare a build for someone else.

The default build profile is `debug`. Find the executable under `target/incan/debug/bin/`.

For a release build:

```bash
incan build src/main.incn --profile release
```

Release executables go under `target/incan/release/bin/`. The installed toolchain and dependencies must include the selected profile.

## Rebuilding

Oven reuses an executable when its source and build inputs have not changed. After editing your code, run the same command again; Oven rebuilds what is needed.

## Run tests

Pass the test file you want to run:

```bash
incan test tests/test_greeting.incn
```

Tests execute each time, even when their executable is reused. A failed test returns a nonzero exit status.

## Troubleshooting a build

If a dependency is missing, check its declaration in `loaf.toml` and whether it is available in your toolchain. [Manage dependencies](dependencies.md) explains local libraries, Rust crates and features.

If you need to see which dependencies and features a build selected, run `incan describe-unit src/main.incn`. Check those against your manifest before changing application code.

For command options, see the [CLI reference](cli-reference.md).

**Try it:** [Your first project](first-project.md) takes a small application through running, testing and building an executable.
