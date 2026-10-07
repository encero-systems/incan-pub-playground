# Incan.io: selected workshop direction, revised for 0.6

Option 2 was selected on 2026-10-07. This revision preserves its dark workshop hero, warm brass, editorial lower sections, official wordmark, Brawler headings and Exo 2 body type. It introduces Incan on its own terms, replaces the earlier generated-Rust story and retains Incus. This is a static visual proposal, not a production homepage or evidence that the 0.6 cutover has shipped.

## The story

**Clear code. Native by design.**

Incan combines expressive syntax, static types, and compiler-planned ownership for native software.

The headline and primary definition describe Incan itself. Language comparisons belong in deeper documentation. Rust ecosystem access and interop are supporting capabilities, explained alongside Oven and the 0.6 compiler direction rather than defining Incan by another language.

Show actual Incan source immediately. Offer **Try Incan** and **Read the language guide**, then three practical entry points: a first application, a typed data workflow and a reusable library.

The next section is explicitly labeled **0.6 · In development**:

**One coherent native toolchain.**

Incan owns the meaning of your code. The 0.6 compiler will lower it directly through rustc, while Oven plans builds for Incan, Rust, and mixed projects.

The conceptual trail is **Incan source → Compiler facts → Native program**. Explain that the normal 0.6 build path does not generate Rust source. Rust remains the compiler backend and an interoperating language and ecosystem. Do not imply an independent machine-code backend, removal of Rust, completed parity, or a shipped 0.6 release.

Two short supporting descriptions:

- **Incan:** Readable source. Explicit types. Planned ownership.
- **Oven:** A shared build graph, packages, and recorded artifacts.

Close with **Start small. Build something real.** State that Incan is in active development and distinguish trying the current release from following the 0.6 cutover. After installation, the existing homepage's first-run example is:

```sh
incan new hello --yes
cd hello && incan run
```

Do not introduce proposed CLI commands as available commands. No benchmarks, community metrics, future debugging capabilities or agent features are claimed.

## Incus stays

Use the existing official standing Incus asset once, quietly beside the first-run example. Preserve the tan alpaca–llama, gold armor, cyan visor and circular core. Keep text and controls clear; do not promote him to a second hero. The character adds warmth and continuity with the Incan identity.

The existing character guidance says: “If Incus is the first thing you notice, we probably used him too loudly.” His omission from the first three concepts was a design omission, not a decision to retire him.

## Evidence and status

Reviewed repository and live issue evidence on 2026-10-07:

- [Native frontend through pinned rustc, with no generated Rust (#1337)](https://github.com/encero-systems/incan/issues/1337): the intended compiler architecture. The issue remains open.
- [Replacement backend parity cutover (#652)](https://github.com/encero-systems/incan/issues/652): normal builds must stop using generated Rust and Cargo. Open delivery work is not shipment evidence.
- [Remove the Rust-source backend (#654)](https://github.com/encero-systems/incan/issues/654): removal contract for the old handoff.
- Repository `workspaces/docs-site/docs/release_notes/0_6.md`: 0.6 is in development and has not shipped.
- Repository `workspaces/docs-site/docs/whitepapers/incan_oven_positioning.md`: shared Incan/Rust project and build direction.
- Repository `workspaces/docs-site/docs/project/incus.md`: character identity and quiet contextual placement.
- Repository `workspaces/docs-site/docs/index.md`: the actual `User` example and first-run commands.

## Implementation handoff

The revised image is the selected visual target. This brief and the owning compiler contracts govern content; generated lettering and code remain approximations. Implement code, commands and links as live HTML, using actual fonts and brand assets. The image's output label illustrates the existing example; it is not a new execution receipt.

Current installation and language-guide actions should retain existing documentation destinations. The 0.6 action should link to its development explanation or cutover contract, rather than pretend it is the current release. Longer technical explanations belong in documentation.

The first three mockups and original brief remain available for comparison, but their generated-Rust narrative is superseded by this revision. Production Incan.io and the existing Incan.pub package pages are outside this mockup change.
