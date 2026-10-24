# Install Incan

Incan's command line is Oven. An installation needs the `incan` executable, its matching native toolchain, and the standard-package sources.

## Select the toolchain

These instructions target **0.6.0-dev.8**. Obtain the matching executable, toolchain archive and standard-package sources for your host. The archive contains compiled dependencies; the sources supply their declarations.

Put `incan` on your `PATH`, then check its version:

```bash
incan --version
```

It should report `incan 0.6.0-dev.8`. The older package-manager installers supply a different CLI.

## Install the archive

Archive installation requires a compatible host and local Rust 1.98.0 with `rustc-dev`. To keep this installation separate, set its home before installing:

```bash
export INCAN_HOME="$HOME/.incan-dev8"
incan toolchain install /path/to/toolchain.tar.zst
export INCAN_STDLIB="/path/to/stdlib"
```

Replace both placeholder paths. `INCAN_STDLIB` points to the directory containing the standard-package directories and their `loaf.toml` files. Keep these environment settings in the shell used for project commands.

Installation checks the driver's compiler identity before replacing an existing toolchain. The archive excludes the local Rust sysroot and does not install the `incan` or `incan-lsp` executables.

## Check a program

From a project directory:

```bash
incan check src/main.incn
incan run src/main.incn
```

A missing standard package or profile means the selected toolchain lacks the required artifact. Check the matching executable, home and sources before changing the program.

**Try it:** [Your first project](first-project.md) includes the complete source download, expected output and a small exercise. For editor integration, [set up your editor](editor-setup.md).

*Development preview: the bundled macOS toolchain has been tested for this chapter; final release downloads and other hosts still need release verification. [Validation details](core-topics.md).*
