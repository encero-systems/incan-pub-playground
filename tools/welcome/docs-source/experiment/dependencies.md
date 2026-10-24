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

Oven prepares active path libraries first. Their artifacts live under the consumer's `target/incan/loaves/` directory.

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

The requirement must match a unit available in the installed toolchain, including its features. Adding a declaration does not download a crate. An unavailable unit produces an error.

For a single source file, an inline `@ "VERSION"` requirement is another way to state dependency intent. Do not combine an inline version with a manifest declaration for the same crate.

## Request features

Use table form when a Rust crate needs feature selection:

```toml
[rust-dependencies]
serde = { version = "1", features = ["derive"] }
```

An optional dependency uses `optional = true`; a package feature activates it with `dep:ALIAS`. Requests for a dependency's own features use `ALIAS/FEATURE`. See the [manifest reference](project-reference.md#projectfeatures) for the complete rules.

## Inspect what was selected

```bash
incan describe-unit src/main.incn
```

The JSON description lists active features, Loaves, Rust crates and native artifacts. Check this when a build selects an unexpected dependency. Keep the declarations in version control; dev.8 has no `incan lock` command or lock-policy flags.

For calls, type conversions and callbacks, continue with the [Rust interoperability reference](../language/how-to/rust_interop.md). That imported page retains its earlier release context; its legacy CLI advice does not override this chapter.

*The complete regex example passed on the same dev.8 macOS bundle as the first-project exercise. [Validation details](core-topics.md).*
