# src/core

Core Pallay data structures and models.

Initial responsibility:

- target-neutral surface artifacts
- page, route, layout, interaction, action, constraint, projection, and diagnostic models
- validation and inspection
- canonical HelloWorld fixtures
- ordinary-Incan experience contracts, target placement plans, deterministic scenario fixtures, and inspectable trace/decision/receipt outputs
- parallel semantic-model v2 contracts for experience state lifetime and availability, artifact and candidate bindings, single-effect interactions, operation/attempt/outcome reconciliation, flows, capabilities, ports, and effect-specific plans

The current `surface.incn` also contains a deliberately small in-memory static HTML and generated-artifact emitter for the HelloWorld vertical slice. `experience_contract.incn` adds the first in-memory contract laboratory for authenticated save/share, exclusive asynchronous assignment, accumulating offline evidence, and selective disclosure plus external authority. Both are temporary spike surfaces. `semantic_model_v2.incn` is the parallel ordinary-Incan replacement candidate; it is intentionally not custom vocabulary and does not delete v1 while the model is under test. The broader application simulations live under `src/lab` so their domain behavior is not mistaken for Pallay core. Production target lowerers belong in dedicated target modules and must consume canonical core artifacts rather than introducing parallel semantics. Production application authorities, stores, queries, reconciliation, networking, and Omerus mechanics remain outside `src/core`.

The executable authoring implementation now lives in `src/weave/` and `src/targets/`. It binds to semantic model v2 and preserves these earlier laboratories as comparators. See `docs/architecture/executable-weave.md`.
