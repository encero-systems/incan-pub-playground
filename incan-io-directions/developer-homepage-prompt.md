# Developer homepage revision

Generated 2026-10-07 after feedback on the sales-page feel, Incus identity and missing logo symbol. References: rejected language mockup, official Incus observer portrait, official wordmark, official Incan logo.

Create one revised Incan.io developer homepage mockup, 1086 x 1448, same full-page aspect ratio as the attached previous mockup. This is a purposeful reset of that rejected design, not another copy-only edit. Make it feel like the homepage of a serious programming language, where developers come to see the language and find its documentation. Clear hierarchy, readable type, purposeful spacing, mature visual restraint. No browser chrome, no fake statistics, no device bezel. Today's reference date is 2026-10-07; no dates or current release numbers need inventing.

References:
1 is the REJECTED current design: preserve only its Incan colors and general editorial quality, REMOVE its cinematic marble display case, physical stone terminal, spotlight lighting, gold gradient sales buttons, gigantic slogans, arbitrary mottos, ornamental machine-code pipeline, and cartoon full-body mascot.
2 is the REAL Incus observer artwork: use this exact portrait as a small embedded illustration, preserving the adult tan alpaca/llama head, narrow cyan visor, detailed gold armor, dark hair, solemn expression, realistic painterly identity. Do NOT recreate the previous cute cartoon standing creature, exaggerate the face, shorten the ears, change pose, or redesign Incus. His visual reference is this observer portrait only, not the mascot in image1.
3 is the official Incan wordmark.
4 is the official Incan logo SYMBOL, gold geometric frame and cyan cubic core. The user requires the LOGO as well as the wordmark: header must visibly contain both, a compact 40px symbol beside a 105px wordmark. Preserve the logo's real geometry and gold/cyan identity, no new monogram or replacement symbol.
Use Brawler for restrained editorial headings and Exo 2 for body/interface, monospace for code. Keep character and symbol faithful to attached real assets. Brand expression should come from these actual assets, typography, a thin brass rule and restrained syntax colors, not cinematic props.

Layout:
Compact 70px dark graphite header with official symbol + wordmark at left. Plain navigation: Learn, Language, Docs, Oven, GitHub. No sales badge/button.

A calm dark graphite opening section, generous margins, modest heading (~42px, not billboard size), two columns with the LANGUAGE EXAMPLE at least as prominent as the title.
Left small eyebrow "THE INCAN PROGRAMMING LANGUAGE".
Heading "A programming language for the modern world." Naturally two or three lines at moderate size.
Body "Expressive syntax, static types, and compiler-planned ownership for applications and libraries."
Two modest developer actions: "Get started" and "Language reference" in flat styles, no big gold gradient.
A simple understated note "In active development."

Right: a FLAT readable source block, no physical stone surround, no 3D console, no badges. Label "Models, JSON and typed functions". Show this actual repository-derived excerpt, legible syntax highlighting:
from std.serde import json

@derive(Debug, Clone, json)
pub model Order:
    pub id: str
    pub product: str
    pub quantity: int
    pub unit_price: float

pub def order_total(quantity: int, unit_price: float) -> float:
    return float(quantity) * unit_price
Keep the long signature legible with enough width. Small link below: "Explore the typed data tutorial →". No invented executed output or performance counters.

Below opening, warm off-white editorial language section, closer to documentation than marketing. Heading "A closer look at the language."
Four concise unboxed topics arranged as an orderly 2x2 editorial group with light separators, not four floating cards:
"Model your data" — "Models, enums and typed collections make data shapes explicit."
"Handle failure explicitly" — "Result and Option make success, failure and absence part of the type."
"Make mutation visible" — "State changes are marked with mut at the point of declaration."
"Use the Rust ecosystem" — "Access Rust crates through explicit rust:: imports."
Small ownership explanation under these, with link:
"Ownership, planned by the compiler" — "Incan analyzes how values are used and plans ownership from your source." Link "Read about Duckborrowing →".
Do not claim complete interop coverage, formal correctness, unlimited performance, or Python compatibility.

Then "Learn by building" with three COMPACT simple linked rows:
"Your first project" / "Create, run and test an application."
"Typed data processing" / "Models, JSON, transformations and explicit errors."
"Libraries and packages" / "Build a library and use it in another project."
No giant promotional typography, no generic slogans.

Closing dark editorial section, small headline "Get started".
A plain terminal with "$ incan new hello --yes" and "$ cd hello && incan run", labelled "After installing Incan". Link "Installation guide →".
On the right include the REAL Incus observer portrait as a small rectangular artwork (~160 x 107 px) with tiny "Meet Incus →" caption, a quiet optional detail. No full-body mascot, no posing or cheering. Make the portrait look like the actual provided bitmap.
Under commands, a quiet development note "0.6 · In development" and one short line "A direct native compiler path and a shared Oven build foundation for Incan and Rust." Link "Follow development →". Keep upcoming work clearly separate from current quickstart. No generated Rust-source stage.

Minimal footer: Documentation, GitHub, Roadmap. Remove all made-up mottos ("Open source. Clearly.", "same intent", "more constructive tomorrow", "ideas into enduring software") and all promotional extras. The result should unmistakably be a usable programming-language homepage design: authentic logo, actual code, concise language semantics, docs first, brand details in a supporting role. Not SaaS, not a product sales landing page, not a stone-metal cinematic poster, not the Incan.pub registry UI. Output one revised full-page design.
