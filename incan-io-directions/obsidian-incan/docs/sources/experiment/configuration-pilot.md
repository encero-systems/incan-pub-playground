# Configuration guide: the content pilot

The goal is a complete task with fewer navigation decisions, while keeping the contracts and useful advanced material available. [Try the guide first](configuration.md) before reading the answer key below.

## What changed

| Before: relevant material in separate guides | After: one task path |
| --- | --- |
| File I/O: read UTF-8 text and handle a read failure | Read the actual configuration file, with its working-directory rule |
| TOML: parse, look up fields, choose defaults, report errors | Decode the two settings needed by the application |
| Dynamic JSON: required values, optional lookup, extraction | An alternative decoder for the same settings and validation |
| Application rules assembled by the reader | An explicit nonblank name and valid port range |

The navigation changes from consulting parts of three task guides to following one guide. Exact API lookup is still available alongside it. This is a proposed shorter route, not a measured improvement in completion time.

The guide uses selected-field decoding so optional defaults are explicit. It does not claim to validate all keys in the document. Whole-model decoding remains a separate documented option.

## What we did not remove

- The complete `std.fs`, `std.toml` and `std.json` references are imported unchanged. None is replaced by a short summary or a simulated API generator.
- Streaming, file handles, temporary files, serialization and dynamic JSON mutation still have their own purposes. They are not prerequisites for this task.
- Original guides remain reachable; this pilot does not retire their broader content or install redirects.
- The seven-section navigation stays available during the trial. This pilot tests task composition before a site-wide navigation change.

## Who owns each fact?

| Fact | Canonical home |
| --- | --- |
| This application defaults a missing port to 8080 | Configuration guide and its example |
| This application rejects blank names and ports outside 1–65535 | Configuration guide and its example |
| Accepted encodings, decoding strategy and file errors | [File API](../language/reference/stdlib/fs.md#file-contents) |
| TOML missing versus invalid lookup, strict types and source spans | [TOML API](../language/reference/stdlib/toml.md#typed-lookup) |
| JSON missing versus null and integer extraction | [JSON API](../language/reference/stdlib/json.md#object-access) |

The guide explains enough of these contracts to make the task safe to follow. It links the complete tables instead of copying them.

## Run the reader trial

Use one person who has not helped write the guide, if possible. Alternate which route they see first: the existing guides or this pilot. Do not coach navigation. Keep the input settings and questions identical.

Record the route taken, pages opened, wrong turns, time to a correct answer and missing information. A quick but incorrect answer is a failure. Separate finding an answer from successfully executing a program.

1. Starting from the documentation overview, find how to read a server name and port from a TOML file.
2. Predict what happens if the port is absent, a string, or zero. Explain why those are different.
3. Determine where the program looks for `app.toml` and what happens if it is missing.
4. Switch the example to JSON. Decide whether an explicit null port should use the default.
5. Find the exact contract for optional TOML lookup without searching the web.
6. Decide whether the program rejects unknown keys, preserves TOML comments, or starts a server.

Do not count a successful website build as example execution. With the matching 0.6 toolchain, also run the failure-path matrix in the guide and record compiler revision, commands, input bytes, output and exit status. Until that is done, the examples remain source-checked development examples.

??? info "Answer key — open after the trial"

    1. Documentation → Read and validate configuration; the example reads text, decodes selected fields into `Settings`, then validates application rules.
    2. Absent: 8080. String: a decode error, not a fallback. Zero: integer decoding succeeds, then application validation rejects it.
    3. The process's working directory. A missing file produces a read diagnostic; no settings are returned. The demonstration prints the error and returns normally, so its exit status is not a failure signal.
    4. Replace the TOML imports and decoder, use JSON input, and change the filename. Null is a present value and fails integer extraction.
    5. Follow the TOML typed-lookup link in the guide's contract table. Optional lookup accepts absence, not an invalid present value.
    6. None of those: unknown fields are ignored, the example never writes TOML, and it only prints settings. TOML serialization does not preserve authored formatting.

## What would count as success?

Keep this structure if readers can complete the task and explain its error paths with fewer wrong turns, while still finding the exact contracts. Revise it if they need unrelated pages to assemble the program, mistake application policy for library behavior, or miss an important limitation.

If the workflow remains hard even when explained coherently, inspect the APIs themselves. A docs redesign should not disguise avoidable differences or force users through unnecessary concepts.

No reader-study result or successful 0.6 example execution is claimed yet. The pilot provides the content, source evidence, questions and expected answers needed to run that evaluation.

## Source basis

The guide was checked against documentation, standard-library declarations and the typed-TOML fixture at Incan commit `1b179c7e2afd695c2e210455a0a126345a7b16a3`. Exact input snapshots and digests are retained in the playground's `tools/welcome/configuration-pilot/` directory. References retain their original content; the API generator has not produced them.
