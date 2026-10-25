# Build inspection and troubleshooting

Use `incan describe-unit` to inspect the selected project configuration. Use `OVEN_TRACE` to see whether Oven reused or rebuilt a result. Run these commands against the same source path and with the same options as the build you are investigating.

## Inspect the selected build

```bash
incan describe-unit src/main.incn
```

The command prints JSON. Start with these fields:

| Field | What to check |
| --- | --- |
| `source`, `project_root` | Are you building the intended file and project? |
| `kind`, `profile` | Is this a program or library, and is the profile correct? |
| `active_features` | Are the features you need enabled? |
| `loaves`, `rust_crates` | Are the expected dependencies selected? |

If your build uses options, pass them to inspection too:

```bash
incan describe-unit src/main.incn --features search --profile debug
```

Here, `search` must be a feature declared by your project. Inspecting the default configuration will not explain a build that selected different features.

## Explain a rebuild

On macOS or Linux:

```bash
OVEN_TRACE=- incan run src/main.incn
```

In PowerShell:

```powershell
$env:OVEN_TRACE = "-"
incan run src/main.incn
Remove-Item Env:OVEN_TRACE
```

The trace goes to standard error; the program’s output stays on standard output. A repeated run of the [library exercise](library-project.md) includes these lines:

```text
oven: unit pricing library: reused
oven: unit shop program: reused
```

These are excerpts from a run, not the complete trace. Other lines describe preparation and input checks; their wording can change.

If a result is rebuilt unexpectedly, compare the source, manifest, dependency selection, features and profile with the previous invocation. A library implementation change can require a new consumer executable even when the library’s public interface is unchanged. See [Loaves and build reuse](loaves.md#when-a-build-is-reused).

To keep the trace, set `OVEN_TRACE` to a filename instead of `-`. Turn it off after diagnosis so later commands do not continue writing to that file.

## A dependency is missing

Check the dependency declaration in `loaf.toml`, then inspect the selected unit:

- For a path library, resolve the path relative to the **consumer’s manifest**. Check that the library has its own `loaf.toml` and `src/lib.incn`.
- For an import such as `from pub::pricing import total`, check the dependency key `pricing` and that `total` is public.
- For a Rust crate, check the requested version and features against the available package artifacts.

An optional dependency also needs its enabling feature. The [dependency guide](dependencies.md) shows declarations and imports together.

## A feature is missing or rejected

Compare `declared_features` and `active_features` in the unit description. A feature must be declared before you can select it with `--features`.

`--no-default-features` changes the root package’s feature selection. A dependency’s `default-features = false` changes that dependency’s defaults. They apply at different places; check both when a dependency has unexpected functionality.

See the [feature configuration reference](project-reference.md#projectfeatures) for optional dependencies and feature forwarding.

## Artifacts are incompatible

Read the diagnostic for the package or profile that failed selection. Check that the selected toolchain and package artifacts belong together, and that artifacts exist for the requested profile. Renaming or copying an unrelated artifact into the expected directory does not make it compatible.

For a local path dependency, build the consumer normally so Oven can prepare the library for it. If the error concerns installed packages, check your toolchain installation and selected profile. See [Install Incan](install.md) and the [CLI reference](cli-reference.md).

## A test still runs after an unchanged build

That is expected. Oven can reuse compilation results, but `incan test` executes the collected tests each time. See [Run tests](run-tests.md) for the testing workflow.
