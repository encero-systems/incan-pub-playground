# Incan documentation lexer

Source: https://github.com/encero-systems/incan/blob/1b179c7e2afd695c2e210455a0a126345a7b16a3/workspaces/docs-site/utils/incan_pygments.py

Apache-2.0; license retained in INCAN-LICENSE. The lexer class is unchanged. Its keyword, type and function loaders use a frozen snapshot from the same commit instead of probing an adjacent compiler checkout. The CLI loads custom classes without `__file__`, so the adapter reads its fixed repository-relative snapshot path. Only this trusted bundled file is loaded with Pygments' `-x`; package-provided language labels never select arbitrary files.

Pygments 2.19.2 supplies Rust and TOML lexers. This is presentation highlighting, not parsing or validation of package examples.
