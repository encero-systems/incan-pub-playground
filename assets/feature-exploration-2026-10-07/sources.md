# Feature and document design grounding

Visual concepts only. The interactive prototype has not been changed.

The feature and dependency declarations were inspected in the local incan.pub origin/index snapshot at `f1bda98c3e86f4140586782846a7d9f0ecfe8b2a` on October 7, 2026. This is a declaration inspection, not a newly resolved or compiled project.

- `regex` 1.13.1: `default` enables `perf`; `perf` enables `perf-literal`; `perf-literal` activates optional `aho-corasick` and `memchr` dependencies and forwards `regex-automata/perf-literal`.
- `regex-automata` 0.4.18: `perf-literal` enables `perf-literal-substring` and `perf-literal-multisubstring`. These activate optional `memchr` and `aho-corasick`. The substring feature also forwards `aho-corasick?/perf-literal` when that dependency is enabled.
- `aho-corasick` 1.1.5: `perf-literal` activates optional `memchr`.
- Thus declared, feature-conditional paths can extend beyond one package level, including `regex -> regex-automata -> aho-corasick -> memchr`.
- Weak forwarding such as `memchr?/logging` changes an already enabled dependency; it does not independently activate it.
- Optional dependency declarations may be active under the default feature closure. Optional does not mean currently disabled.
- Feature declarations, target conditions, indexed build facts, and the resolved version/feature closure must be distinguished in a working implementation. The images contain generated wording and illustrative state, not an authoritative feature resolver.
- Generated platform labels are not authoritative. An absent indexed Windows build does not mean an upstream crate is incompatible with Windows.

## Single-page implementation direction

Render package descriptions, metadata, feature declarations, dependency reasons, dependents, builds, releases and security text in the initial document. Use meaningful headings and stable fragment anchors instead of replacing content with tabs. In-page find should reach content without switching views. Preserve a readable server-rendered or prerendered HTML representation for text clients; anchors by themselves do not guarantee LLM accessibility.

Use a compact Add to project action instead of the full-width installation band. Keep the primary dependency display a readable table with feature activation reasons. Offer a focused activation path when useful; a generic package-node graph should not be the default.
