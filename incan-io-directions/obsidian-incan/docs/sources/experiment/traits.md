# Traits and capabilities

A trait describes behavior that different types agree to provide. Use one when a function cares about what a value can do, rather than which concrete type it is.

Here, “capability” means a trait's behavior contract. This guide does not cover capability-policy declarations or grants.

## Define behavior with a default

```incan
trait Describable:
    def describe(self) -> str:
        return "An object"

class Product with Describable:
    name: str

def main() -> None:
    p = Product(name="Laptop")
    println(p.describe())
```

`Product` explicitly adopts `Describable` with `with`. It inherits the default `describe` implementation, so this program prints `An object`. The default does not automatically read the product's name.

This is a small complete example from the existing trait reference. The examples below focus on individual declarations.

## Require behavior instead

A required method has a signature without an implementation:

```incan
trait Collection[T]:
    def first(self) -> T
```

Each adopting type supplies the behavior. The trait describes the operation callers can rely on; it does not choose how a collection stores its values.

## Accept the capability

```incan
def first_item(values: Collection[int]) -> int:
    return values.first()
```

The annotation accepts concrete values that adopt `Collection[int]`. A matching method name on its own does not establish that explicit contract.

## Refine a capability

```incan
trait OrderedCollection[T] with Collection[T]:
    def sorted(self) -> Self
```

An ordered collection also promises the behavior of `Collection[T]`. The relationship is transitive: callers that need only `Collection[int]` can accept its ordered refinement.

A generic bound is useful when you also need to preserve the concrete type:

```incan
def require_ordering[T with OrderedCollection[int]](values: T) -> T:
    return values
```

The input and output remain the same type `T`, while the bound requires the ordered-collection contract.

## Choose the next detail

- [Check adoption, required methods, and generic bounds](traits-reference.md).
- [Browse standard trait families](../language/reference/stdlib/traits.md).
- [Read the larger derives and traits reference](../language/reference/derives_and_traits.md).

## Content basis

Reorganized from the local trait reference. These examples illustrate that documented surface; they have not been newly executed against the developing 0.6 compiler for this experiment.
