# CrumbDB homepage

The **photocopied** theme uses toner-worn black type, blue notebook ink, and uneven stamped controls. Incus appears as a blue-ink scratchpad illustration. The public playground route is [CrumbDB](https://encero-systems.github.io/incan-pub-playground/crumbdb/).

Incan owns the page structure, copy, walkthrough, diagram, and theme. The native build emits HTML and CSS. Browser-native links and disclosure controls handle navigation and the walkthrough.

From the playground root, use Incan 0.5.1 and Rust 1.98.0:

```sh
tools/crumbdb/build
python3 -m http.server 8946 --bind 127.0.0.1
```

Open `/crumbdb/`. Use `CRUMBDB_INCAN` to select another compatible compiler, `CRUMBDB_INCAN_HOME` to select the build cache, or `CRUMBDB_OUTPUT` to emit into another directory. Regenerate the published files from Incan source and the assets in this directory.

```sh
check_dir=$(mktemp -d)
CRUMBDB_OUTPUT="$check_dir" tools/crumbdb/build
diff -r crumbdb "$check_dir"
```

The page presents CrumbDB as a managed graph database in development. The record-to-source example illustrates the planned workflow. Early-access registration is closed in this preview.

The font licenses are adjacent to the bundled fonts. The shared Encero wordmark uses the playground’s existing Lato asset. The Incus illustration was created with ImageGen for this page.
