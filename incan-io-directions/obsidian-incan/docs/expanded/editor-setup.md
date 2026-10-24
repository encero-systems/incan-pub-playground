# Set up your editor

Install the Incan extension and connect it to the language server from the same compiler line as your project.

## Install the extension

In VS Code or Cursor, use **Extensions → Install from VSIX…** when you have the matching extension package. For a development checkout, copy `workspaces/ide/vscode` into the editor's extensions directory:

```bash
# Run from the Incan checkout; choose your editor.
cp -R workspaces/ide/vscode ~/.vscode/extensions/incan-language
# Cursor: use ~/.cursor/extensions/incan-language instead.
```

Reload the editor and open your project folder. A `.incn` file should have Incan syntax highlighting.

## Select the language server

Use the matching `incan-lsp` executable. The toolchain archive does not install it. Set its literal path in editor settings:

```json
{
  "incan.lsp.enabled": true,
  "incan.lsp.path": "/absolute/path/to/incan-lsp"
}
```

The path does not expand `~` or shell variables. Leave it empty only when editor discovery selects the intended binary. Open **View → Output → Incan** to check that selection, then restart the server after changing it.

## Verify the connection

Open a valid source file. Hover a function, follow a local name to its definition, then introduce and undo a type error. The diagnostic should appear and clear. Highlighting alone does not establish a working language server.

Compare a disputed diagnostic with the compiler:

```bash
incan check src/main.incn --format json
```

Dev.8 has no `incan tools doctor` command. If the editor disagrees, check its selected binary and environment first.

## Format source

```bash
incan fmt src tests
incan fmt --check src tests
```

The first command formats files; the second checks without writing. Use an editor task for this command until format-on-save is verified for the selected extension.

[Try the first-project exercise](first-project.md), or read the [LSP integration reference](../tooling/reference/lsp_protocol_support.md) when writing an editor integration.

*The clean-profile editor check remains pending for the final 0.6 package. [Validation and consolidation notes](core-topics.md); [earlier testing/editor pilot](testing-editor-pilot.md).*
