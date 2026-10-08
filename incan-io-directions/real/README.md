# Incan homepage — working HTML

Responsive implementation of the [approved combined homepage mockup](https://encero-systems.github.io/incan-pub-playground/assets/site/incan-io-directions/welcome-combined-community.webp).

Open `index.html` through an HTTP server. From the playground repository root:

```sh
python3 -m http.server 8824 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:8824/incan-io-directions/real/`.

The page uses semantic HTML, a readable CSS file, and a small JavaScript file for the mobile menu, clipboard controls, and responsive source annotations. Code, labels, navigation, and buttons are actual page elements. All assets and fonts are local; there is no framework, package installation, build step, or runtime data request.

## Content and integration

- Brawler and Exo 2 match the existing Incan.io font families. Font licenses are included under `assets/fonts/`.
- The symbol and wordmark are official Incan assets, rendered at their original aspect ratios. The landscape and transparent Incus portrait reconstruct the selected artwork as separate raster assets. The community backdrop reconstructs the mockup’s teal mist. The landscape is dimmed on its own CSS layer, leaving the foreground logo bright.
- The sticky header surface, colored rail, logo glow, and display type treatment come from the existing Incapunk stylesheet. Only the relevant component styles are adapted; the MkDocs layout is not imported.
- Icons are from the pinned Tabler revision recorded in `assets/credits.json`; the MIT license is included.
- Source annotation lines use a locally vendored, pinned LeaderLine build, with its MIT license under `assets/vendor/`. Source and label positions are measured after fonts load and on resize. The long horizontal segment and angled end track real text rather than fixed screenshot coordinates. Paths hide below 741px, while explanatory links remain usable. The upstream library is archived; its scope here is static DOM connectors with no network or data handling.
- Documentation, Incus, GitHub, and the existing LinkedIn community have real links. Incan.pub currently links to the playground root using `../../`; replace those two destinations with `https://incan.pub/` when integrating into the production Incan.io site.
- The 0.6 label explicitly says “in development.” The command panel preserves the documented Oven bake step. This work validates the website; it does not claim compiler execution of the sample or commands.
- `#adopted-by` is a hidden insertion point between tools and community. Add only verified adopters, then remove `hidden`. If rotation is added, provide pause controls and respect reduced motion.
- Copy buttons use the browser clipboard API. When unavailable, the source is selected and a live status message explains how to copy manually.

See `design-qa.md` for comparison evidence, responsive checks, and validation limits. The production Incan.io site is not changed by this playground implementation.
