# Install Incan

Install Incan, then check that you can run it from your terminal.

## Download and install

Choose the Incan 0.6 files for your operating system and processor from the [release downloads](https://github.com/encero-systems/incan/releases). Use the executable, toolchain archive and standard-library sources from the same release.

Put the `incan` executable in a directory on your `PATH`. Check that your shell can find it:

```bash
incan --version
```

Install the toolchain archive, replacing the path with the file you downloaded:

```bash
incan toolchain install /path/to/toolchain.tar.zst
```

Archive installation requires Rust 1.98.0 with the `rustc-dev` component. Follow the platform setup instructions included with the release before running this command.

Set `INCAN_STDLIB` to the standard-library source directory:

```bash
export INCAN_STDLIB="/path/to/stdlib"
```

This directory contains the standard packages and their `loaf.toml` files. Add the setting to your shell profile so it is available in new terminals.

## Check your installation

[Download the first-project example](../assets/first-project.zip), extract it, and open a terminal in its directory. Run:

```bash
incan check src/main.incn
incan run src/main.incn
```

The program should print `Hello, Incan!`.

If your shell cannot find `incan`, check your `PATH`. If Incan cannot find a standard package, check `INCAN_STDLIB` and that the sources match your installed toolchain.

**Next:** [Set up your editor](editor-setup.md), or follow [Your first project](first-project.md) to build the example yourself.
