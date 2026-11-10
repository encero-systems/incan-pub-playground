# Three comparison views

Edition 03's field-test chapter uses one bounded local state scope for workload, view, speed phase, format pages and playback. Overview, Compactness and Speed retain the same workload. .COMIC and Crumb stay fixed while neighbouring formats change. Explicit Play/Pause controls govern the workload ticker; manual selection pauses playback, and the Pallay timer also respects focus, hover, visibility and reduced motion.

Edit figures in `content/comparison.json`; `static/comparison.json` is its downloadable copy. Rebuild the Incan site after updating both. Each of four workloads contains four text and four binary entries. `tokens` and `bytes` are integer counts; `encode_us` and `decode_us` are positive integer microseconds, displayed as milliseconds. The renderer computes the captions from these values.

The supplied `COMIC Syntax.html` is byte-identical to `static/COMIC-Syntax.html`, SHA-256 `bd8d1221134f1ea2215a644fbd42febda281c5c18b0c4bd25c5e6947e3656db3`. The .COMIC, TOON and JSON token counts were copied from its reported o200k_base table. The remaining figures are authorized visualization values. Source metadata records that distinction; the selected mockup intentionally omits data-status labels from the interface. No timing suite was executed by this website change.

`src/comparison.incn` authors all rendering and interactions. No new authored Rust or browser application JavaScript was introduced. The original homepage, Edition 02 and interior pages remain unchanged. This remains a playground visualization, not a format or performance release.
