# Build and consume a library

Create a pricing library, use it from a separate application, then change its implementation. You need [Incan installed](install.md) and a terminal. If you have not run an Incan program yet, start with [Your first project](first-project.md).

[Download the complete example](../assets/library-project.zip). Extract it and open a terminal in `library-project/`, or create these files yourself:

```text
library-project/
├── pricing/
│   ├── loaf.toml
│   └── src/lib.incn
└── shop/
    ├── loaf.toml
    └── src/main.incn
```

## Create the library

In `pricing/loaf.toml`:

```toml
[project]
name = "pricing"
version = "0.1.0"
```

In `pricing/src/lib.incn`:

```incan
pub def total(price: int, quantity: int) -> int:
    return price * quantity
```

`pub` makes `total` available to consumers. The library entry is `src/lib.incn`; it does not need a `main` function.

## Add the consumer

In `shop/loaf.toml`:

```toml
[project]
name = "shop"
version = "0.1.0"

[dependencies]
pricing = { path = "../pricing" }

[project.scripts]
main = "src/main.incn"
```

The dependency path is relative to this manifest. In `shop/src/main.incn`:

```incan
from pub::pricing import total


def main() -> None:
    println(total(12, 3))
```

## Run the application

From `library-project/`:

```bash
incan run shop/src/main.incn
```

Expected output:

```text
36
```

Oven prepares `pricing` before building `shop`. Running the same command again produces the same output and allows Oven to reuse the existing build results.

You can also build the library directly:

```bash
incan build pricing/src/lib.incn
```

This produces library artifacts. It does not run the shop application.

## Change the calculation

Add a fixed handling charge in `pricing/src/lib.incn`:

```incan
pub def total(price: int, quantity: int) -> int:
    return price * quantity + 5
```

Run the consumer again:

```bash
incan run shop/src/main.incn
```

It now prints `41`. The application source did not change, but the library implementation did. Oven prepares the updated build result before running the application.

## Continue

[Loaves and build reuse](loaves.md) explains the package boundary and compatibility rules. To see reuse decisions for this example, follow [Build inspection and troubleshooting](build-troubleshooting.md#explain-a-rebuild).
