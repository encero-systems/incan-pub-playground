# Loaves and build reuse

A Loaf is a reusable library package. It supplies the public declarations a consumer can import and the implementation needed to build against them. Oven prepares dependencies, checks compatibility, and reuses build results when their inputs have not changed.

## Programs and libraries

An application has an entry point, usually `src/main.incn`. Building it produces an executable:

```bash
incan build src/main.incn
```

A library exposes declarations from `src/lib.incn`. Building it produces library artifacts rather than a program to launch:

```bash
incan build src/lib.incn
```

Both use `loaf.toml` for project configuration. The source entry determines which kind of result you are building.

## What a consumer uses

A library package provides three things:

- **Public interface:** the functions and types other projects can import, including their signatures.
- **Implementation:** compiled code and the information needed to instantiate generic code for a consumer.
- **Build information:** the dependencies, feature selection and compatibility details needed to use the artifacts together.

The interface lets the compiler check a call before linking the program. The implementation supplies what that call executes. Private declarations remain implementation details; they are not an API the consumer can import.

For a local library, declare its directory in the consumer’s manifest:

```toml
[dependencies]
pricing = { path = "../pricing" }
```

Then import a public declaration:

```incan
from pub::pricing import total
```

Oven prepares the library before building the consumer. You do not need to copy its source into the application or build each dependency by hand. See [Manage dependencies](dependencies.md) for Rust crates, optional dependencies and features.

## When a build is reused

Oven can reuse a result when the inputs relevant to that build still match. Those inputs include source, dependencies, selected features and the build profile. An existing artifact with the right package name is not sufficient: it must also fit the selected build.

For example, a shop application calls `pricing.total(12, 3)`:

| Change | What to expect |
| --- | --- |
| Run the application again without changes | Oven can reuse the executable and run it again. |
| Change the calculation inside `pricing.total` | The library and the application need an updated build result. |
| Change `total`’s parameter types | Consumer calls are checked against the new interface; incompatible calls fail. |
| Select different features or a different profile | Oven selects or prepares results for that configuration. |

An unchanged public signature does not mean an unchanged program. A library implementation change can affect the application’s behavior even when its imports and calls stay the same.

## Reuse and test execution

Reusing a test executable saves compilation work. It does not skip the tests: `incan test` executes them on every invocation. Likewise, `incan run` runs your program even when no compilation is needed.

For an unexpected rebuild, use [Build inspection and troubleshooting](build-troubleshooting.md) to examine the selected configuration and trace the decision.

## Try it

[Build and consume a library](library-project.md) creates a small pricing library and a separate application. Download the complete example, change the library, and observe the consumer’s result.
