# Trait rules

Use this page when checking a declaration. For the mental model and examples, start with [Traits and capabilities](traits.md).

## Declaration and adoption

| Question | Rule |
| --- | --- |
| Can I construct a trait? | No. Traits are abstract; `TraitName(...)` is not a constructor. |
| How does a type adopt one? | Declare `with TraitName` on the concrete type. |
| Does a matching method name suffice? | No. Trait conformance is nominal and adoption is explicit. |
| Can a trait provide behavior? | Yes. A method with a body supplies a default implementation. |
| How is a method required? | Declare its signature without a body. |
| Can a trait refine another? | Yes, with `with`; the relationship is transitive. |

Models, classes, enums, newtypes, and rusttypes can adopt traits. Required methods on an enum adopter belong in its body; variant payloads are not shared fields on the enum.

## Trait annotations and bounds

`Collection[int]` can be used as an annotation accepting concrete adopters of that instantiation. A generic bound such as `T with Collection[int]` constrains `T` while letting the signature refer to that concrete type elsewhere.

The compiler checks bounds at call sites, including transitive supertrait relationships.

## Where API documentation takes over

Generated documentation for a particular trait should list its type parameters, required methods, defaults, supertraits, and public adopters where available. Those declarations do not replace the language rules for how adoption and bounds work.

[Explore the standard trait families](../language/reference/stdlib/traits.md). For multiple instantiations, method disambiguation, and the full current discussion, [open the existing trait reference](../language/reference/derives_and_traits.md#traits-authoring).

## Scope

This is a focused reference slice based on the existing trait documentation, not a complete language specification or a new claim about 0.6 implementation coverage.
