# Build and run with Oven

Oven is Incan's build tool. Use the `incan` command to check source, run programs, build executables and run tests.

## Check and run

From your project directory:

```bash
incan check src/main.incn
incan run src/main.incn
```

`check` reports errors without producing an executable. `run` builds the program when needed and starts it.

Pass arguments to your program after `--`:

```bash
incan run src/main.incn -- input.csv
```

The program reads and writes through your terminal. Its exit status becomes the command's exit status.

## Build an executable

```bash
incan build src/main.incn
```

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

For command options, see the [CLI reference](cli-reference.md).

**Try it:** [Your first project](first-project.md) takes a small application through running, testing and building an executable.
