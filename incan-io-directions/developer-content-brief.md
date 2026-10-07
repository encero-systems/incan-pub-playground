# Incan.io: developer homepage revision

Revised on 2026-10-07 after feedback that the cinematic workshop felt like a sales page and the redrawn Incus did not resemble the original character.

## What changes

The homepage introduces the programming language, shows a meaningful source example, explains a few concrete language concepts, and directs developers into documentation. Branding supports that purpose.

Retain Brawler headings, Exo 2 body type, charcoal, warm light surfaces, restrained brass and syntax colors. Remove the marble display case, physical terminal, spotlight scenery, oversized slogans, made-up mottos and ornamental compiler pipeline.

Use both the official Incan logo symbol and the official wordmark in the masthead. Incus is a quiet observer portrait near getting started, grounded in the existing artwork. In implementation, use the original bitmap assets unchanged, not generated interpretations of them.

## Page sequence

1. **Introduce Incan and show its source.** Heading: “A programming language for the modern world.” Supporting copy: “Expressive syntax, static types, and compiler-planned ownership for applications and libraries.” Actions: Get started and Language reference. In active development stays visible.
2. **Explain the language.** Models, enums and typed collections; Result and Option; explicit mutation with `mut`; Rust access through `rust::` imports. A short explanation links to Duckborrowing. Avoid universal interop, complete safety or performance guarantees.
3. **Offer practical learning paths.** A first project, typed data processing and reusable libraries, using the existing tutorials.
4. **Get started.** Existing commands appear after installation instructions. Incus accompanies this section as a small observer portrait.
5. **Separate development from availability.** A modest “0.6 · In development” note explains the direct native compiler path and shared Oven foundation. It does not present the cutover as shipped.

## Source example

This excerpt combines declarations from the existing typed-data tutorial, omitting explanatory docstrings. It illustrates syntax, not a newly executed application or benchmark:

```incan
from std.serde import json

@derive(Debug, Clone, json)
pub model Order:
    pub id: str
    pub product: str
    pub quantity: int
    pub unit_price: float

pub def order_total(quantity: int, unit_price: float) -> float:
    return float(quantity) * unit_price
```

The repository sources are `examples/advanced/typed_data_processor/src/domain.incn` and `src/transform.incn`. [The existing tutorial](https://incan.io/dev/language/tutorials/typed_data_processor/) explains the complete program and its release envelope.

After installation, retain the current homepage's commands:

```sh
incan new hello --yes
cd hello && incan run
```

## Destinations

- [Installation and getting started](https://incan.io/dev/tooling/tutorials/getting_started/)
- [Language reference](https://incan.io/dev/language/reference/)
- [First project](https://incan.io/dev/tooling/tutorials/your_first_project/)
- [Typed data tutorial](https://incan.io/dev/language/tutorials/typed_data_processor/)
- [Build and consume a library](https://incan.io/dev/tooling/tutorials/build_and_consume_library/)
- [Duckborrowing](https://incan.io/dev/contributing/explanation/duckborrowing/)
- [Meet Incus](https://incan.io/dev/project/incus/)
- [Roadmap](https://incan.io/dev/roadmap/)
- [0.6 native compiler contract](https://github.com/encero-systems/incan/issues/1337)
- [Backend cutover](https://github.com/encero-systems/incan/issues/652)

## Brand references

The real source assets are linked on the review page. The observer portrait preserves Incus's tan alpaca–llama head, cyan visor, gold armor and quiet character. The logo is the gold geometric frame around the cyan cube; the wordmark is separate. Generated image lettering and asset depictions remain illustrative. An HTML implementation must use the actual assets, real source text and working documentation links.

This revision supersedes the workshop content briefs for further design work. Earlier concepts remain available for comparison. Production Incan.io and the Incan.pub package website are unchanged.
