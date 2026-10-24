# Five core topics for 0.6

These chapters apply the concise testing-page style to the first project workflow. Explanations describe the rules; the tutorial is a separate downloadable exercise.

| Topic | Read | Practice or lookup |
| --- | --- | --- |
| Installation and first program | [Install Incan](install.md) | [Your first project](first-project.md) · [Download](../assets/first-project.zip) |
| Editor setup | [Set up your editor](editor-setup.md) | Hover, definition and diagnostic checks |
| Projects and configuration | [Projects and configuration](projects.md) | [Manifest reference](project-reference.md) |
| Building and running | [Build and run with Oven](oven.md) | [CLI reference](cli-reference.md) |
| Dependencies | [Manage dependencies](dependencies.md) | Manifest declarations and unit inspection |

## Source and verification

The chapters use the dev.8 integration documentation at `4d92c3db292df98fd236c9fff451f468422cfff2`. The manifest and CLI reference pages retain those contracts, with links adapted for this site. The earlier full-site inventory remains a separate snapshot.

The first-project exercise was run using the macOS arm64 rehearsal bundle from `55b26c75f2f025feed1368c2c80a38193162302d`, installed into a separate home. Checks cover formatting, type checking, greeting output, two passing tests, an intentional assertion failure, a debug build and unit inspection. This validates the exercise on that development bundle; it is not a final-release or cross-platform claim.

Final release checks remain: installer downloads, the final compiler/standard-package combination, release-profile artifacts and a clean VS Code/Cursor installation. The guide does not assume a published dev.8 download.

## Consolidation boundaries

- Installation owns toolchain setup; the tutorial links to it rather than repeating installers.
- Editor setup combines extension and language-server selection. Protocol details stay in reference.
- Projects explains layout and configuration. The manifest reference owns exact accepted fields.
- Oven explains the normal command loop. The CLI reference owns options and exit behavior.
- Dependencies covers declarations and selection. Detailed cross-language contracts remain separate.

The old imported getting-started page remains available as a historical snapshot. New navigation uses the dev.8 exercise. Testing and Rust-interoperability imports have not all been rewritten against dev.8; their original release context remains explicit. In particular, do not apply the old test-runner flags to dev.8.
