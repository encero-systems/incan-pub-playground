# Manage dependencies

Declare project dependencies in `loaf.toml`. Incan libraries use a `pub::` import; Rust crates use `rust::`.

A dependency is code supplied by another package. The manifest says which package to use; an import brings its declarations into a source file. Adding a dependency does not automatically import its names.

## Add a local Incan library

The library needs its own manifest and a `src/lib.incn` exposing its public API. In the consumer's manifest:

```toml
[dependencies]
pricing = { path = "../pricing" }
```

For example, `shop/loaf.toml` can refer to a sibling `pricing/` directory with `../pricing`. The path is relative to the manifest, not the terminal’s working directory.

The key `pricing` is the name used in the import:

```incan
from pub::pricing import total
```

Here, `total` must be a public declaration supplied by that library. Build the consumer normally:

```bash
incan build src/main.incn
```

Oven prepares active path libraries first. You do not need to build each library separately.

## Use a Rust crate

Declare a requirement in the manifest:

```toml
[rust-dependencies]
regex = "1"
```

Then import the crate's public items without repeating the version:

```incan
from rust::regex import Regex


def main() -> None:
    match Regex.new("^[a-z]+$"):
        Ok(pattern) => println(pattern.is_match("incan"))
        Err(error) => println(str(error))
```

Save this as `src/main.incn` and run `incan run src/main.incn`. It prints `true`: the input contains only lowercase letters. The error branch handles an invalid pattern.

The crate version and features must be available in your installed toolchain. Adding a declaration does not download a crate; Oven reports an error if it cannot find a match.

For a single source file, an inline `@ "VERSION"` requirement is another way to state dependency intent. Do not combine an inline version with a manifest declaration for the same crate.

## Request features

Features select optional functionality supplied by a package. Use table form when a Rust crate needs them:

```toml
[rust-dependencies]
serde = { version = "1", features = ["derive"] }
```

This requests the crate's `derive` feature. The crate's default features remain enabled unless you set `default-features = false`.

To make a dependency optional, expose a feature in your own package. This separate example enables `regex` only when `search` is selected:

```toml
[rust-dependencies]
regex = { version = "1", optional = true }

[project.features]
search = ["dep:regex"]
```

```bash
incan build src/main.incn --features search
```

Code that imports an optional dependency must only be active when that feature is enabled. See the [manifest reference](project-reference.md#projectfeatures) for feature conditions, default features and forwarding a dependency's features.

## Check dependency selection

```bash
incan describe-unit src/main.incn
```

This command shows the selected dependencies and features. Use it when a build selects a different version or feature set than you expected.

For all declaration options, see the [manifest reference](project-reference.md).

## Try it

[Build and consume a library](library-project.md) includes a downloadable library and consumer project.
