# Compiler follow-up draft

The trial ran with Incan 0.5.1. Known sorted-key and string-literal reassignment behavior is linked in the README. An additional reduced code-generation failure is recorded below. This is a ready-to-file draft, not a newly filed issue. It has not been reproduced on the current development compiler; verify there before raising a regression claim.

**Suggested title:** bug - Err reassignment loses a Result local's annotated success type

**Labels:** bug

**Issue type:** Bug

## Area

Compiler (frontend/backend/codegen)

## Summary

Incan 0.5.1 accepts reassignment of `Err` to a local annotated as `Result[JsonValue, str]`, but generated Rust specializes that expression as `Result<(), String>`. Expected: preserve the annotated success type. Actual: Rust compilation fails with E0308.

Non-blocking for the collector: returning the error from a function explicitly returning `Result[JsonValue, str]` compiles and preserves semantics.

## Reproduction steps

Save as `repro.incn` and run `incan build repro.incn`:

```incan
from std.json import JsonValue

def main() -> None:
    mut result: Result[JsonValue, str] = Ok(JsonValue.null())
    result = Err("failed")
    match result:
        Ok(_) => println("ok")
        Err(message) => println(message)
```

## Output / logs

```text
expected Result<JsonValue, String>, found Result<(), String>
```

Generated reassignment:

```rust
result = Err::<(), String>(("failed").to_string());
```

## Environment

macOS arm64. Released Incan 0.5.1 with its bundled SDK. Reduced source was compiled and produced the reported Rust error. No claim about the latest development line.

Duplicate searches covered `Err Unit` and `Result Err inference` across open and closed Incan issues; no exact match was identified. Related known collector workarounds: [#1461](https://github.com/encero-systems/incan/issues/1461), [#1668](https://github.com/encero-systems/incan/issues/1668). Exact draft text was checked for private paths and machine identifiers before saving.
