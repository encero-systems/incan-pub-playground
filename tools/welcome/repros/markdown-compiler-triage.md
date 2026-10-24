# Markdown adapter compiler triage

- Likely bug: yes; observed on released Incan 0.5.1 during the native docs build.
- Stage: Rust emission.
- Blocking status: workaround exists.
- Observation: `[str(character) for character in source]` where `source` is a `str` emitted `(source).iter()`, which rustc rejected with E0599 because String has no `iter` method.
- Reduced source: `string-comprehension-0.5.1.incn`. The application failure was verified; the reduced file has not been independently compiled yet.
- Workaround: an ordinary Incan `for character in source` loop appending each character to `list[str]`.
- Duplicate search: searched all issues for `string comprehension iter` and `string comprehension`. Closed #1490 is related iterator-comprehension lowering, but its reported receiver is a Rust iterator rather than str; it is not claimed to be the exact same case. Closed #1668 records other 0.5.1 emitter slips and the need to verify them on the development compiler.
- Follow-up: the report below is a local draft. The current development compiler was not tested; no new public issue was created for an old-release-only observation.

## Suggested title

bug - string list comprehension emits String.iter on 0.5.1

## Area

Compiler (frontend/backend/codegen)

## Summary

Expected: a list comprehension over a string yields its characters, as the equivalent ordinary loop does. Actual: the released 0.5.1 emitter uses `.iter()` on String and rustc rejects the generated code.

## Reproduction steps

Save as `repro.incn` and run `incan run repro.incn` in an explicitly baked project:

```incan
def main() -> None:
    source = "abc"
    characters = [str(character) for character in source]
    println("".join(characters))
```

This reduced file still needs independent execution and comparison against the current development compiler before filing. The same comprehension was observed to fail in the Markdown adapter build.

## Output / logs

```text
error[E0599]: no method named `iter` found for struct `std::string::String`
```

## Environment

Incan 0.5.1; macOS aarch64; Rust 1.98.0. Real workaround: append characters in an ordinary Incan loop. Related: https://github.com/encero-systems/incan/issues/1490 and https://github.com/encero-systems/incan/issues/1668.

## Complex-page import: Rust options field metadata

Observed in the native builder on 0.5.1: assigning `options.compile` on the Rust markdown crate's public `Options` produces a checked diagnostic that the field does not exist. The direct nested spelling also reported no `allow_dangerous_html` field on the inferred configuration type. A reduced candidate is `rust-options-fields-0.5.1.incn`; its field assignment failed in the complete application, but the candidate and current development compiler have not been independently exercised. Treat this as an old-toolchain interop limitation pending current-line verification, not a newly confirmed development regression.

The implementation does not need a Rust workaround. It keeps standard Markdown's safe parser configuration, handles explicit semantic HTML regions as validated Incan/Pallay structure, and parses Markdown-enabled section contents recursively. Native rejection fixtures and complete tutorial-content tests pass. Missing `str.find`, `lstrip`, and `rstrip` methods on this installed version were replaced with ordinary split/iteration/slicing; they are recorded as unsupported old-version APIs rather than asserted compiler defects.

Duplicate search for the options-field observation used `Rust struct field assignment` across all issue states. Closed #2233 is related inspected Rust field metadata through borrowed receivers, not established as the exact same Options-assignment case: https://github.com/encero-systems/incan/issues/2233. No new public report was filed without current-line verification.
