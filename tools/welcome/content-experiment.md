# Topic-first documentation experiment

Date: 2026-10-24. Local prototype; no publication or full-site migration.

## Hypothesis

Readers can find a concept, complete a task, and reach an exact contract more easily when topic names lead the navigation. Divio intent remains an editorial tool, without requiring the reader to choose a quadrant first.

## Implemented sample

| Topic | Entry and authored guidance | Contract home | Original sources |
| --- | --- | --- | --- |
| Dates and times | `docs/dates.html`: choose a type, trial end, renewal policy | `docs/date-api.html`: selected Date signatures, errors and calendar behavior | Tutorial, reference, datetime model; actual Date and DateTimeError source |
| Trait capabilities | `docs/traits.html`: default behavior, required behavior, adoption, generic bounds | `docs/traits-reference.html`: language-level rules | Derives and traits reference |
| Oven project workflow | `docs/oven.html`: create, bake, run, test, release; checkpoints and recovery links | Existing CLI and configuration reference remain authoritative | Canonical first-contact snippet and first-project tutorial |

`docs/explore.html` provides a task-facing entry point. `docs/index.html` also exposes the new content; the nine earlier imports remain in a collapsed navigation group, expanded on those pages.

The API sample is explicitly authored. No API generator has been implemented or simulated. Signatures and claims were checked against exact local source snapshots, retained under `experiment-evidence/` with SHA256 provenance. Existing version claims remain visible: the Oven task uses the documented 0.5 command baseline; the 0.6 architecture stays a separately labelled development design. The examples have not been re-executed against a 0.6 compiler.

## Editorial changes

- Start with reader decisions and outcomes, not documentation categories.
- Put Date parsing syntax, accepted input, and errors in the API sample; the guide links there instead of repeating its contract table.
- Keep universal trait rules in language reference; the guide teaches with examples. Generated docs for individual traits cannot own these language-wide rules.
- Give each Oven step an observable checkpoint. Link full configuration and troubleshooting details rather than duplicating them.
- Preserve source content separately from adaptations. Existing imports are unchanged.
- Keep links to unported detail honest: they open the existing docsite. This sample is deliberately not a replacement for all datetime or trait documentation.

## Reader trial

Use the existing site and this sample in alternating order; do not coach navigation. Record the route, time to a supported answer, wrong turns and missing information. Success requires the correct answer, not merely finding a page.

1. A fourteen-day trial starts on April 14, 2026. Find how to calculate its end date, and what happens to invalid input.
2. Does an offset of +01:00 encode the rules for Europe/Amsterdam? Find the reason.
3. Can a type satisfy a trait merely by declaring a method of the right name? Find the rule and an adoption example.
4. Why use a generic bound when an ordinary trait annotation also accepts adopters?
5. Starting with an installed toolchain, find the path to a release executable and where to look if preparation fails.

Assess whether readers can explain the difference between authored guides, API contracts, and language rules without being taught the site taxonomy. No reader-study result is claimed yet.

## Decision after the trial

Keep the model if it reduces wrong turns without hiding needed detail. Revise topic boundaries if readers repeatedly bounce between guide and reference. Only then expand to other topics, assign a canonical home to each fact, and plan redirects from old URLs.

## Remaining work outside this experiment

Real source-driven API generation; compiler-version pinning and executable documentation checks; complete member coverage; source-symbol links and cross-package search; global content migration and old-URL redirects. None is implied by this preview.

## Answer key for the reader trial

1. Parse with `Date.fromisoformat`, propagate or handle the `Result`, add `TimeDelta.days(14)`: April 28, 2026. Malformed/out-of-range input returns `DateTimeError`.
2. No. A fixed offset carries no named-zone daylight-saving or historical rules.
3. No. Declare explicit adoption with `with`; use a required method or inherit a provided default as appropriate.
4. A generic `T` lets the signature preserve and reuse the concrete type while constraining its required capability.
5. Create and enter the project; bake; run; test; release-build. If baking fails, inspect the first diagnostic, toolchain version, project directory and manifest before moving on.

These are editorial acceptance answers grounded in the inspected source, not observed reader-study outcomes.
