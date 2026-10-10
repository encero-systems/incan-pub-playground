# Shared footer QA

final result: passed

## Source and comparison

This scoped addition follows the approved Forge light / Archive Hall site. The current rendered catalog and homepage are the source visual truth: `qa/footer/catalog-before.png` and `qa/footer/home-before.png`. The catalog source is 1280 × 1053 pixels and the implementation `qa/footer/catalog-after.png` is 1280 × 1245 pixels; both use a 1280 × 720 CSS viewport at density 1. The added footer intentionally increases document height. `qa/footer/catalog-comparison.jpg` places both full-page captures together, aligned at the top. `qa/footer/footer-comparison.jpg` compares their bottom regions at equal scale. Both combined comparisons were opened and inspected.

The original masthead QA is preserved in `design-qa-shared-masthead.md`. This change does not redesign the header or the parked Incan.io preview.

## Findings and fidelity

No actionable P0/P1/P2 mismatch remains. The new footer is an intentional addition, not a pixel-for-pixel replacement of the old one-line preview note. A pre-handoff refinement reduced and bottom-aligned the .pub suffix beside the official wordmark.

- Typography: existing Exo 2 body and Brawler suffix retained. Quiet 13px links and 10px group headings preserve the catalog hierarchy; copyright and preview information remain secondary.
- Spacing: one shared four-column desktop component outside main content, with the same route-independent max width and gutters. Compact layouts use two columns and larger link targets. No main-content density or above-the-fold geometry change was observed in the paired catalog captures.
- Colors: warm neutral surface, existing text/gold palette and a fine brass divider. No additional decorative background competes with the landing artwork.
- Assets: official existing wordmark retained at its intrinsic aspect ratio. Existing artwork and charts are unchanged.
- Copy: About Incan.pub, registry documentation, publishing model, Incan.io, Oven, GitHub, community and Encero Systems copyright are present. The preview label and data contract remain visible. Reporting explicitly explains that no registry reporting destination is configured and sends nothing.

## Responsive and interaction checks

Desktop home, catalog and regex package footers were inspected in the in-app browser at 1280 × 720. The homepage footer was checked at 390 × 844 (`qa/footer/home-phone-footer.png`), and the catalog at 320 × 800 (`qa/footer/catalog-320-footer.png`); neither had horizontal document overflow. `qa/footer/package-footer.png` records the desktop package boundary and shared footer. Mobile and desktop reporting controls opened a native dialog with initial focus on Close; Close dismissed it. Footer routes and named navigation landmarks were inspected. Browser warning/error logs were empty during the final local checks.

The authored Incan renderer built successfully. All ten existing Node checks passed, including deterministic replay, scoped links and local asset references. Diff whitespace checks passed. The manual CI check workflow was not dispatched.

## Implementation checklist

- Shared authored footer partial and stylesheet are used on all eight generated Incan.pub documents.
- Regenerate through the Incan renderer after editing the partial.
- Configure real reporting destinations before replacing the preview reporting explanation with a submission flow.
