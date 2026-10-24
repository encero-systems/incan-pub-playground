# Set up your editor

A working editor should help you understand a program while you write it: show the types of names, take you to their declarations, and point out errors. This chapter connects VS Code or Cursor to your Incan toolchain and shows how to tell whether that connection is working.

## Before you begin

You need VS Code or Cursor, an Incan project folder, and a compiler installation that can build that project. If you still need the toolchain, start with the [installation guide](../tooling/how-to/install_and_run.md) and return here afterward. You should be able to open the editor's command palette and run a command in a terminal; you do not need to understand the language-server protocol or complete another chapter in this pilot.

The goal is a verified editor connection to the intended installation. Syntax coloring is the first visible sign, but hover information and diagnostics are the more useful checks.

> **0.6 content preview.** This guide consolidates the existing setup and LSP documentation. The matching 0.6 release package and editor session still need verification before these instructions become release guidance.

## Start with one toolchain

There are three pieces involved. The editor extension recognizes Incan files and connects the editor to its tools. The language server, `incan-lsp`, supplies semantic feedback such as diagnostics and hover information. The compiler is the tool you use to build and run the project. Keeping them aligned avoids a confusing situation in which the editor and terminal disagree about the same program.

Install the compiler and language server from the same supported release. Use the [installation guide](../tooling/how-to/install_and_run.md) for available packages and hosts; its current version label matters. Do not substitute a different release's language server merely because it is already on your machine.

On macOS or Linux, inspect the tools your terminal resolves:

```bash
command -v incan
command -v incan-lsp
incan --version
```

Both paths should identify the installation you intend to use. If either lookup finds nothing, finish installing that tool or make it discoverable before continuing. Keep the reported compiler version available for comparison.

An already-running editor may have a different environment from this terminal. These commands establish what the shell finds; the next steps establish what the editor actually starts.

## Install the extension

With the tools available, install the part that connects them to your editor:

1. Obtain the Incan `.vsix` extension from the matching release's assets.
2. In VS Code or Cursor, open Extensions and choose **Install from VSIX…**.
3. Select the file, reload the editor, and open your Incan project folder.
4. Open a `.incn` file to activate the extension and language server.

For the 0.6 release, verify the actual published asset before following this path. Opening the file should activate Incan syntax highlighting. That confirms that the extension recognizes the file; hover, navigation and diagnostics additionally require the language server to start successfully.

## Verify the editor connection

Use the editor's own report to check that it found the right tools. Run **Incan: Doctor** from the command palette. Then open **View → Output**, select **Incan**, and check the reported compiler and language-server paths, including whether each came from a setting, the workspace or `PATH`.

The terminal counterpart is:

```bash
incan tools doctor
```

Compare the reports before changing settings. If the terminal and editor disagree, choose the intended installation and correct the editor configuration. For a deliberate override, set a literal executable path:

```json
{
  "incan.lsp.enabled": true,
  "incan.lsp.path": "/absolute/path/to/incan-lsp"
}
```

Replace the placeholder with a real executable. The setting is a path, not a shell command: `~`, `$HOME` and command substitutions are not expanded. Leave the path empty when you want the extension's documented workspace/PATH discovery instead.

After upgrading either binary or changing the path, reload the window or restart the Incan language server. Rebuilding a file on disk does not replace an editor process that is already running it.

## Check your result

Open a small, valid `.incn` file in the project. Hover a declaration and follow a local symbol to its definition. Then introduce a temporary type error, observe the diagnostic, and undo the edit. This checks both directions of the feedback loop: the editor should report the problem and remove the diagnostic when it is repaired.

Use these observations to distinguish a connected language server from syntax highlighting alone:


| Check | Expected observation |
| --- | --- |
| Open a declaration and an import | Incan syntax highlighting appears |
| Hover a declaration in a valid file | Its type or signature appears |
| Follow a local symbol with Go to Definition | The editor opens its declaration |
| Introduce a temporary type error, then undo it | A diagnostic appears and clears after repair |
| Request completion in a known context | The language server offers relevant supported completions |

Basic highlighting alone does not prove that semantic features are connected. Checked public API hover information requires successful type checking; a broken file can fall back to syntax-oriented information.

Once those checks work, you have evidence that the editor is responding to the project through its language server. The exact feature checks still need to be performed against the matching 0.6 release package before this preview becomes release guidance.

For formatting, use [Formatting with incan fmt](../tooling/how-to/formatting.md). The source setup guide still describes a task/file-watcher fallback for format-on-save, so this preview does not promise that automatic formatting is available in the selected extension.

## Fix common setup problems

If highlighting appears but semantic feedback does not, return to the Incan output channel. It can tell you whether the server started at all, which is a more useful first question than changing several settings at once. If the server runs but its feedback seems stale, compare the reported paths and restart it after correcting the installation.

The following checks help narrow the next step:

| Symptom | Check next |
| --- | --- |
| Highlighting works, but hover and diagnostics do not | Confirm `incan-lsp` starts in the Incan output channel and LSP is enabled |
| Feedback looks older than terminal results | Compare Doctor's paths, then restart the editor server after correcting them |
| Configured server will not start | Check that the path is literal, exists and is executable |
| No diagnostics appear | Check the `.incn` extension, active Incan extension and output log |
| Rich hover data is missing | Fix parse/type errors first; not every private declaration has a public API projection |

For an issue report, include the compiler version, the Doctor report and relevant output-channel messages. Remove private paths or other sensitive details that are not needed to reproduce the problem.

## If you develop Incan itself

Use the contributor build workflow to keep the compiler and LSP from the same checkout. The recorded development guide uses `make build` and then verifies the shell paths and **Incan: Doctor** output. Follow the [checkout-specific LSP instructions](../tooling/how-to/lsp.md#recommended-build-from-a-clone-cli-lsp-stay-in-sync) for the details; this is a separate path from installing a published release.

## Other editors and integration work

The original [Editor Setup guide](../tooling/how-to/editor_setup.md) documents fallback syntax associations for Vim/Neovim and JetBrains. A Python syntax association is approximate highlighting, not Incan language-server integration.

If you are building an editor integration, use [LSP protocol support](../tooling/reference/lsp_protocol_support.md) and the existing [contract-model emit command](../tooling/how-to/lsp.md#contract-model-emit-command). Protocol payloads and metadata behavior belong in that integration reference, rather than being prerequisites for ordinary editor setup.

## Go further

- [Formatting with incan fmt](../tooling/how-to/formatting.md) — format source consistently once the editor connection works.
- [LSP protocol support](../tooling/reference/lsp_protocol_support.md) — exact integration capabilities for editor authors.
- [Review notes and release checks](testing-editor-pilot.md) — source differences and the remaining release verification.
