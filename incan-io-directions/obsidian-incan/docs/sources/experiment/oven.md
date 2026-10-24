# Build and run a project

Create a small Incan project and take it through preparation, execution, tests, and a native release build.

**Before you start:** install the toolchain using [Getting started](../tooling/tutorials/getting_started.md). This walkthrough uses the documented **0.5 command baseline**; it is not a claim that the developing 0.6 compiler is release-ready.

## 1. Create a project

```bash
incan new hello --yes
cd hello
```

The scaffold gives you an entry point, a starter test, and a project manifest.

| File | What to inspect here |
| --- | --- |
| `src/main.incn` | The program's starting point |
| `tests/test_main.incn` | The starter test |
| `loaf.toml` | Project metadata and the configured main script |

**Checkpoint:** find those three files before continuing. Run the following commands from the project directory.

## 2. Prepare the project

```bash
incan oven bake --project .
```

Oven prepares the project's build inputs and plans. Treat a preparation failure as its own problem: resolve it before expecting the run or build step to succeed.

**If it fails:** check the first diagnostic, your installed toolchain version, and whether the command is running next to the intended `loaf.toml`. Follow the [existing troubleshooting guide](../tooling/how-to/troubleshooting.md) for the reported failure.

## 3. Run it

```bash
incan run
```

**Checkpoint:** the starter program runs and prints its greeting. Edit the greeting in `src/main.incn`, run again, and confirm that the output changes.

If your edit has no effect, check that you edited the configured entry point in this project rather than another copy.

## 4. Run the tests

```bash
incan test
```

**Checkpoint:** the starter test is discovered and completes successfully. Once you change the program's behavior, replace the placeholder test with an assertion about that behavior.

[Extend this into a multi-module project with meaningful tests](../tooling/tutorials/your_first_project.md).

## 5. Build for release

```bash
incan build --release
```

**Checkpoint:** the build finishes successfully. Use the output path reported by your toolchain to locate the native executable; this guide does not assume an artifact path shared by every version and target.

## Keep the project reproducible

Keep source, tests, and the manifest in version control. Commit `oven.lock` once the project generates it. Build caches and generated outputs are not a replacement for the source project.

## Continue from here

- [Add a dependency](../tooling/how-to/dependencies.md).
- [Use Rust libraries alongside Incan](../language/how-to/rust_interop.md).
- [Look up project configuration](../tooling/reference/project_configuration.md).
- [Understand the developing 0.6 architecture](../contributing/explanation/architecture_0_6.md).

## Content basis

The command sequence comes from the canonical first-project snippet; file roles and lockfile guidance come from the first-project tutorial. This experiment reorganizes those instructions and adds checkpoints. It does not claim a newly verified installation or release build.
