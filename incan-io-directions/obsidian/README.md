# Incan.io — obsidian 0.7 homepage prototype

This standalone HTML/CSS prototype implements the approved dark direction without modifying `../real/` or the Incan.pub site.

Run from the repository root:

```sh
python3 -m http.server 8923 --bind 127.0.0.1
```

Open `/incan-io-directions/obsidian/`.

- Content, nine example templates, carousel, copy controls, responsive menu and LeaderLine annotations are reused from the existing 0.7 prototype.
- HTML and CSS are authored directly for this visual prototype; browser interactions remain the existing JavaScript implementation. This is not an Incan-authored replacement for the production docs site.
- Original tesseract and Incus assets are preserved. The new supplied wordmark lockup is used as an image, not recreated as text.
- Hero and community environment images are generated art. Exact prompts are in `assets/`.
- Runtime benchmark figures retain their August 21, 2026 attribution. They are historical results, not 0.7 measurements. Build speed and source size remain explicit 0.7 targets.
- Documentation search submits to the existing Incan docs. Incan.pub links target the public playground.
- Light mode is deliberately deferred. The future adopter strip remains hidden until verified entries exist.

The selected visual source is `exec-eea472c5-d126-47a8-9b8d-a6fffbf4f06d.png`, generated in this task. Browser evidence and comparison findings are recorded in `design-qa.md`.
