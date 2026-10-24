# Read and validate configuration

Load the settings your application needs from a file, reject invalid input, and return a typed value to the rest of the program. This guide follows one path: **read → decode → validate**.

> **0.6 content preview.** These examples have not yet been compiled or run against 0.6. They are checked against development-source contracts; the outputs below are expected results.

## Decide what to accept

Our application needs a nonblank server name and a port between 1 and 65535. An absent port means `8080`; a present invalid port is an error. These are application choices, not defaults supplied by the standard library.

Use TOML for this example. If your configuration arrives as JSON, use the alternative decoder below; file reading and application validation stay the same.

We read selected fields from a potentially larger document. Other fields are ignored. This is **not** a closed-schema validator that rejects unknown keys. For a stable whole-document schema, consider model deserialization; the [TOML model contract](../language/reference/stdlib/toml.md#serialization-traits) describes that separate path.

## Create the input file

Save this as `app.toml` in the directory from which you will run the example:

```toml
[server]
name = "demo"
port = 8080
```

`Path("app.toml")` is relative to the process's working directory, not automatically to the source file. The example reads a small UTF-8 text file into memory. Large streams and configuration discovery are separate tasks.

## Load checked settings

Save this complete program as `config.incn`. It separates the three failure boundaries without requiring the caller to know the parser's types:

```incan
"""Read selected server settings and reject invalid application values."""

from std.fs import Path
from std import toml
from std.toml import TomlError


model Settings:
    """The settings the application needs after loading configuration."""

    name: str
    port: int


def decode_settings(source: str) -> Result[Settings, TomlError]:
    """Read required name and default the port only when it is absent."""
    document = toml.parse(source)?
    name = document.get[str]("server.name")?
    port = document.get_optional[int]("server.port")?.unwrap_or(8080)
    return Ok(Settings(name=name, port=port))


def validate_settings(settings: Settings) -> Result[Settings, str]:
    """Apply this application's rules after checking field types."""
    if settings.name.strip() == "":
        return Err("server.name must not be blank")
    if settings.port < 1 or settings.port > 65535:
        return Err("server.port must be between 1 and 65535")
    return Ok(settings)


def load_settings(filename: str) -> Result[Settings, str]:
    """Read, decode and validate; describe a failure at its boundary."""
    match Path(filename).read_text(encoding="utf-8", errors="strict"):
        Err(error) => return Err(f"Cannot read {filename}: {error.message()}")
        Ok(source) =>
            match decode_settings(source):
                Err(error) => return Err(f"Invalid configuration: {error.message()}")
                Ok(settings) => return validate_settings(settings)


def main() -> None:
    """Report the checked settings; this example does not start a server."""
    match load_settings("app.toml"):
        Ok(settings) => println(f"Configuration ready: {settings.name} on port {settings.port}")
        Err(message) => println(message)
```

With a compiler that supports the documented APIs, run `incan run config.incn` from the directory containing `app.toml`. The expected successful output is:

```text
Configuration ready: demo on port 8080
```

This only reports settings; it does not bind a network port or start a server. On failure, the demonstration prints a diagnostic and returns normally. A production command should map failure to its own nonzero exit status; application startup should proceed only in the `Ok` branch.

## Understand the three boundaries

1. **Read:** `read_text` can fail because of the path, permissions or decoding. Strict UTF-8 decoding rejects invalid input instead of replacing bytes. Reading the file directly preserves the actual failure; an existence check is not a substitute.
2. **Decode:** `get[str]` requires a string. `get_optional[int]` returns absence only for a missing path; an invalid present value still fails. The `?` propagates that failure before `unwrap_or(8080)` can supply a default.
3. **Validate:** an integer can still be an invalid port. `validate_settings` checks application meaning after decoding has established the field types.

The short example converts failures into display text at the loading boundary. An application that needs structured recovery can retain typed errors instead. It need not change the reading or parsing contract.

## Check the failure paths

Change one thing at a time, then restore the original input. Compare the category of failure rather than depending on exact parser wording.

| Change | Expected outcome | Where it is handled |
| --- | --- | --- |
| Remove `port` | Use `8080` | Optional lookup |
| Set `port = "8080"` | Reject the string; do not use the default | Decode |
| Set `port = 0` or `port = 65536` | Reject the range | Application validation |
| Set `name = "   "` | Reject the blank name | Application validation |
| Remove `name` | Reject the missing required field | Decode |
| Leave a quote unclosed | Reject malformed TOML | Parse |
| Run from a directory without `app.toml` | Report a read failure | File read |
| Add an unrelated field | Accept it without using it | Selected-field policy |

The important distinction is **absent versus invalid**. Defaults must not conceal broken configuration.

## Use JSON instead

For the equivalent input, save `app.json`:

```json
{"server": {"name": "demo", "port": 8080}}
```

In the program above, replace the two TOML imports and `decode_settings` with this block. Change `load_settings("app.toml")` to `load_settings("app.json")`. Keep `Settings`, file reading and application validation unchanged.

```incan
from std.json import JsonError, JsonValue


def decode_settings(source: str) -> Result[Settings, JsonError]:
    """Read selected JSON fields without treating an invalid port as absent."""
    document = JsonValue.parse(source)?
    server = document.require("server")?
    name = server.require("name")?.expect_str()?
    mut port = 8080
    match server.get("port"):
        None => pass
        Some(value) =>
            port = value.expect_int()?
    return Ok(Settings(name=name, port=port))
```

`require` rejects missing required fields and invalid object receivers. `get("port")` returns `None` for a missing key, while a present JSON `null` is still a value: `expect_int()` rejects it. Strings and fractional JSON numbers are also invalid ports. The same failure-path checks apply, using JSON syntax; add a test with `"port": null`.

This difference in optional lookup is worth explaining once. It does not require a second file-loading tutorial.

## Look up the exact contracts

| Question | Contract home |
| --- | --- |
| How does text reading handle encodings and errors? | [Path.read_text and file contents](../language/reference/stdlib/fs.md#file-contents) |
| What counts as a missing or mistyped TOML field? | [TOML typed lookup](../language/reference/stdlib/toml.md#typed-lookup) |
| How do I attach a TOML diagnostic to a source location? | [TomlError](../language/reference/stdlib/toml.md#tomlerror) |
| What is the difference between missing JSON and null? | [JSON object access](../language/reference/stdlib/json.md#object-access) |
| Which JSON values can be extracted as integers? | [JSON extraction](../language/reference/stdlib/json.md#extraction) and [numeric mapping](../language/reference/stdlib/json.md#numeric-mapping) |

These are complete imported reference snapshots, not generated API documentation. The guide owns this workflow and its application policy; the reference owns signatures, accepted values and error contracts.

## Keep the scope small

This guide does not edit or rewrite the input file. In particular, TOML serialization does not preserve comments, ordering or formatting. It also does not implement environment overrides, secret management, live reload, large-file streaming or unknown-key rejection. Add those when the application requires them rather than making them prerequisites for reading two settings.

## About this pilot

This task brings together the relevant parts of the existing file I/O, TOML and dynamic JSON guides. Their wider material remains available. [See the comparison and reader trial](configuration-pilot.md) for what was consolidated, what was retained and how to judge whether this is easier to use.
