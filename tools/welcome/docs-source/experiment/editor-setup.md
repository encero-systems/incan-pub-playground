# Set up your editor

The Incan extension adds syntax highlighting, diagnostics, hover information and go-to-definition to VS Code and Cursor.

## Install the extension

Download the Incan extension (`.vsix`) from the [release downloads](https://github.com/encero-systems/incan/releases). Install it using **Extensions → Install from VSIX…**. Reload the editor, then open your project folder.

Open the folder containing `loaf.toml`, rather than opening a source file on its own. This keeps the editor and terminal working from the same project.

On native Windows, open the project normally and use `incan-lsp.exe`. If you choose WSL instead, open the project through VS Code’s WSL environment and install the extension there too.

## Connect the language server

The extension uses `incan-lsp` for diagnostics and code navigation. Use the language server supplied with your Incan release. If the editor cannot find it, set its full path in your settings:

```json
{
  "incan.lsp.enabled": true,
  "incan.lsp.path": "/absolute/path/to/incan-lsp"
}
```

Find the executable with `command -v incan-lsp` on macOS/Linux or `(Get-Command incan-lsp).Source` in PowerShell. Paste its full path into the setting; it does not expand `~` or shell variables.

In JSON, escape Windows backslashes. For example:

```json
{
  "incan.lsp.enabled": true,
  "incan.lsp.path": "C:\\Tools\\Incan\\incan-lsp.exe"
}
```

Restart the language server after changing it.

Open an `.incn` file and hover a function to see its signature. Use **Go to Definition** to follow a name to its declaration. To check diagnostics, temporarily introduce a type error, save the file, then undo it. The error should appear and clear.

## Format your code

From the project directory:

```bash
incan fmt src tests
```

To check formatting without changing files:

```bash
incan fmt --check src tests
```

## Troubleshooting

Syntax highlighting works even when the language server is disconnected. If hover information or diagnostics are missing, open **View → Output → Incan** and check the server path.

If an editor diagnostic seems wrong, check the same file from the terminal:

```bash
incan check src/main.incn
```

Make sure the editor and terminal use the same Incan release and standard-library location.

**Try it:** Open [Your first project](first-project.md) in your editor. Follow `greet` to its definition, change the greeting, and run the program.
