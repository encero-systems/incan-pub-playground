# src/cli

Command-line entrypoint for Pallay.

Future command shape:

```bash
pallay build <content-root> --out <output-dir>
```

This source area should orchestrate adapters and renderers without owning their internals.
