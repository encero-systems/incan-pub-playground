# Manage dependencies

Declare project dependencies in `loaf.toml`. Incan libraries use a `pub::` import; Rust crates use `rust::`.

## Add a local Incan library

The library needs its own manifest and a `src/lib.incn` exposing its public API. In the consumer's manifest:

```toml
[dependencies]
pricing = { path = "../pricing" }
```

The path is relative to the manifest. Import through the declared alias:

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

Use table form when a Rust crate needs feature selection:

```toml
[rust-dependencies]
serde = { version = "1", features = ["derive"] }
```

An optional dependency uses `optional = true`; a package feature activates it with `dep:ALIAS`. Requests for a dependency's own features use `ALIAS/FEATURE`. See the [manifest reference](project-reference.md#projectfeatures) for the complete rules.

## Check dependency selection

```bash
incan describe-unit src/main.incn
```

This command shows the selected dependencies and features. Use it when a build selects a different version or feature set than you expected.

For all declaration options, see the [manifest reference](project-reference.md).
