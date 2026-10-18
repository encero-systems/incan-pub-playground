# Registry-backed website verification

Catalog search overlap repair: removed the absolutely positioned whole-row link overlay, whose containment depended on a positioned table row. The final row on page one is `arrow-ord`, matching the reported unexpected destination. Click delegation now follows each row's real package link, with no overlay above search or filters. Native name links retain keyboard navigation, and selecting text or using a nested control does not activate the row. Catalog CSS/script URLs were refreshed across all 27 pages.

The additional DOM regression checks static rows, rows replaced by filtering, search focus, filters, all four row cells, modifier clicks, middle clicks, nested controls and text selection. All 23 automated checks pass after this repair (tools/site/target/row-fix-check.log). Browser discovery still returns no available surfaces, so physical browser hit-testing remains unverified.

Initial registry release: all 22 automated checks passed, including full byte-identical replay and jsdom catalog/ticker interactions. That local run is recorded in tools/site/target/check.log.
Visual result: not confirmed. Browser discovery returned no browser surfaces; Safari access timed out. No new screenshots or false visual sign-off are supplied.

The existing Archive Hall homepage, Forge package masthead, shared header/footer, Brawler/Exo 2 fonts, charcoal/brass artwork and warm reading surface remain the visual reference. New controls use the existing styles: a compact version selector, visible catalog search and filter fields, pagination and expandable document/evidence groups. Source CSS review identified and repaired an initially missing Forge masthead/section-rail wrapper before final generation.

Functional checks cover all 1,311 packages and 1,707 indexed versions, 27 no-JavaScript catalog pages, recorded document integrity and provenance, complete replay, license expressions, exact-name search, missing observations, route/assets/anchors, HTML safety and catalog interactions in jsdom. jsdom does not establish rendered layout, responsive overflow or native touch behavior.

The earlier footer screenshot QA is preserved in design-qa-catalog-footer.md. Current data/build/verification boundaries are documented in docs/registry-site.md. The production registry remains unchanged, the Incan.io mockup remains parked, and no manual CI verification workflow is dispatched.
