# Install Incan

Choose the instructions for your operating system, install Incan with one package manager, then run a small program to check the setup.

## Choose your platform

| Platform | Where to start |
| --- | --- |
| macOS — Apple Silicon or Intel | [Homebrew](#macos) is a convenient choice. PyPI and npm are alternatives. |
| Linux — x64, GNU/Linux | Use [PyPI or npm](#linux), or Homebrew if you already use it. |
| Windows — native | Use [PyPI or npm from PowerShell](#windows). |

Choose a build for your processor as well as your operating system. Check the [release downloads](https://github.com/encero-systems/incan/releases) for the available architectures, especially on ARM-based Windows or Linux machines.

### macOS

With [Homebrew](https://brew.sh/) installed, open Terminal and run:

```bash
brew tap encero-systems/tap
brew install incan
```

Use the Homebrew installation for your Mac's processor. On Apple Silicon, use a native terminal rather than an Intel terminal running through Rosetta.

Prefer your existing Python or Node.js tools? Use [PyPI](#pypi) or [npm](#npm) below instead. Then continue to [Check your installation](#check-your-installation).

### Linux

Choose [PyPI](#pypi) if you use Python tools, or [npm](#npm) if you use Node.js. Both provide the same `incan` command.

If you already use Homebrew on x64 Linux, the Homebrew commands above also apply. Alpine and other musl-based distributions need a matching build; the GNU/Linux binary is not a universal Linux executable.

### Windows

Install Incan natively from PowerShell using [PyPI](#pypi) or [npm](#npm). You do not need WSL.

For the PyPI route, install Python and pipx first. If Python is already installed, set up pipx with:

```powershell
py -m pip install --user pipx
py -m pipx ensurepath
```

Close and reopen PowerShell, then run `pipx install incan`. If you already use Node.js, `npm install -g @incan/toolchain` is the alternative.

If you prefer to work inside WSL2, follow the Linux instructions in your WSL terminal. Keep its Incan installation and editor environment together; they are separate from native Windows.

## PyPI

Use `pipx` to install Incan as a command-line application without adding it to your project's Python dependencies. [Install pipx](https://pipx.pypa.io/latest/how-to/install-pipx.html) if needed, then run:

```bash
pipx install incan
pipx ensurepath
```

Reopen your terminal after `ensurepath` so the command directory is on your `PATH`.

If you prefer `pip`, install into a virtual environment. On macOS or Linux:

```bash
python3 -m venv ~/.venvs/incan
source ~/.venvs/incan/bin/activate
python -m pip install incan
```

Activate this environment in each terminal where you use Incan. Avoid installing into a Linux distribution's managed system Python.

On Windows, you can use the environment directly without activating a script:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install incan
.\.venv\Scripts\incan.exe --version
```

Use the same full executable path for subsequent commands, or choose pipx to make `incan` available across projects.

## npm

With Node.js and npm installed in your terminal environment:

```bash
npm install -g @incan/toolchain
```

The package provides the `incan` and `incan-lsp` commands. Its first invocation downloads the matching toolchain, so it needs an internet connection and can take longer than later runs.

## Compiler prerequisites

Incan uses a native compiler toolchain. If your installation method asks you to install Rust separately, use the version required by the Incan release. For 0.6, this is Rust 1.98.0 with `rustc-dev`:

```bash
rustup toolchain install 1.98.0 --profile minimal --component rustc-dev
```

Install [rustup](https://rustup.rs/) first if the command is missing. This installs the required version alongside your existing Rust toolchains; you do not need to change your global default.

## Check your installation

Open a fresh terminal and check that both commands are available. If you installed with pip in a virtual environment, activate it or use the full executable paths shown above:

```bash
incan --version
incan-lsp --version
```

Next, [download the first-project example](../assets/first-project.zip), extract it, and open a terminal in its directory:

```bash
incan check src/main.incn
incan run src/main.incn
```

The program should print `Hello, Incan!`. This checks compilation as well as whether the command is on your `PATH`.

## Updating Incan

Update through the method you used to install it:

| Method | Update command |
| --- | --- |
| Homebrew | `brew update`, then `brew upgrade incan` |
| PyPI with pipx | `pipx upgrade incan` |
| PyPI with pip — macOS/Linux | Activate the environment, then `python -m pip install --upgrade incan` |
| PyPI with pip — Windows | `.\.venv\Scripts\python.exe -m pip install --upgrade incan` |
| npm | `npm install -g @incan/toolchain@latest` |

Run `incan --version` afterwards. If it still reports an older version, use `command -v incan` on macOS/Linux or `Get-Command incan` in PowerShell to find the selected installation.

## Manual installation

Use this route when you need to choose the installation location or work with downloaded archives. Get the executable, toolchain archive and standard-library sources for the same release and host from the [release downloads](https://github.com/encero-systems/incan/releases).

Put `incan` and `incan-lsp` (`.exe` on Windows) in a directory on your `PATH`. With the compiler prerequisites installed, run the commands for your shell.

**macOS / Linux:**

```bash
incan toolchain install /path/to/toolchain.tar.zst
export INCAN_STDLIB="/path/to/stdlib"
```

**Windows PowerShell:**

```powershell
incan toolchain install C:\Downloads\toolchain.tar.zst
$env:INCAN_STDLIB = "C:\Tools\Incan\stdlib"
```

Replace the example paths. The standard-library directory contains the packages and their `loaf.toml` files. These settings apply to the current shell. To keep them, use your shell profile on macOS/Linux or your user environment variables on Windows. Then run the installation checks above.

## Troubleshooting

- **Command not found:** reopen your terminal and check that your package manager's command directory is on `PATH`. For pipx, run `pipx ensurepath`.
- **Wrong version:** use `command -v incan` on macOS/Linux or `Get-Command incan` in PowerShell to find the selected executable. An older installation may appear earlier on `PATH`.
- **Missing compiler or standard package:** check the release's prerequisites. For a manual installation, also check `INCAN_STDLIB` and that the executable, archive and sources belong to the same release.
- **Works in a terminal but not the editor:** restart the editor and check which executable it selected. If you use WSL, open the project in the editor's WSL environment.

**Next:** [Set up your editor](editor-setup.md), or follow [Your first project](first-project.md) to build the example yourself.
