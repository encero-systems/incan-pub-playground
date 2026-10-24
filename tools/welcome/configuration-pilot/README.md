# Files and configuration content pilot

The published guide is authored in `../docs-source/experiment/configuration.md`. Its comparison, trial questions and answer key are in `configuration-pilot.md` beside it.

`config_toml.incn` is the complete displayed program. `decode_json.incn` is the displayed replacement decoder; `config_json.incn` assembles the complete alternative for later execution checks. These are new Incan examples checked against the recorded source contracts and fixture, not executed 0.6 programs. The website itself is built with the installed Incan 0.5.1 compiler.

Evidence snapshots are pinned by `evidence.json`. They support API inspection; they do not prove these new programs compile or run. All three API references were copied byte-for-byte from the same source revision. No authored Rust, API generator, API behavior change or source-document deletion is part of this pilot.

Run the existing documentation checker after a site build:

```sh
node tools/welcome/check-docs.mjs
node tools/welcome/check-content-map.mjs
```

The check covers source/renderer fidelity, complete reference snapshots, guide-to-contract and return routes, example text, evidence digests and explicit execution limitations. It does not substitute for the reader trial.

Before release, execute both complete programs with the selected 0.6 toolchain against the guide's input variations. Record the compiler revision, commands, inputs, stdout/stderr and exit status. Include invalid UTF-8, absent file, malformed document, absent/defaulted port, wrong field kinds, JSON null, missing name, blank name, out-of-range port, and accepted unrelated keys. A printed diagnostic is not a nonzero exit status in this demonstration.
