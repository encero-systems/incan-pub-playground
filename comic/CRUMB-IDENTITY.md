# Crumb companion identity

Added 10 November 2026 within the .COMIC Edition 02 visual family. The original approved style tag `comic-style-edition-02-20261109` is unchanged.

- [Crumb front-page chapter](https://encero-systems.github.io/incan-pub-playground/comic/v2/#v2-crumb)
- [SVG wordmark](assets/crumb-logo.svg)
- [SVG fitted-cell symbol](assets/crumb-symbol.svg)
- [Deterministic vector generator](../tools/comic/brand/build-logo.py)

The compact CRUMB wordmark uses the bundled Bangers glyphs converted to outlines, with a cream angled plate, ink frame, grey print shadow and teal corner. Three fitted teal cells distinguish Crumb from .COMIC's speech bubble. Both SVGs are self-contained and scale without a font download.

Crumb remains the binary representation of the shared typed-value model. The new chapter introduces its relation to .COMIC, explains row and column layouts, and explicitly labels the profiles experimental. These are format-specification statements at the site's existing pin, not performance or production-conformance claims. CrumbDB is a separate storage product; this identity is for the encoding.

The logo appears in the dedicated chapter and the existing representation panel. The original homepage and the other pages retain their preceding content. The hero now introduces both forms and the edition navigation links directly to Crumb.

The source is in tools/comic/src/crumb.incn, v2.incn and components.incn. Regenerate published HTML through the Incan build. FontTools is only needed for editing/regenerating the vector logo, not for building the website.
