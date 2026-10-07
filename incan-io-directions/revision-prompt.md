# Selected option 2 revision

Generated on 2026-10-07. References: original option 2, official neutral standing Incus, official Incan wordmark. The original mockups remain historical; this is the selected revision.

Revise the attached selected Incan.io homepage design, named Forge Atelier. Create one realistic, production-quality landing-page mockup, same 1086 x 1448 dimensions and aspect ratio as the first reference. This is a revision of that design, not a different visual direction. Preserve its dark charcoal cinematic workshop hero, tangible warm bronze and black machined stone, brass seams, an actual Incan source workstation on the right, elegant Brawler editorial headings and Exo 2 UI/body, orderly ivory editorial sections below and a dark first-run closing area. Do not imitate the predominantly light Incan.pub catalog, do not add giant geometric prisms or gratuitous stats/cards. Keep purposeful spacing, readable product type, one primary action. No browser or device chrome.

Reference 1 is the chosen visual target. Reference 2 is the official Incus mascot character, which MUST be retained, once only, as a small quiet companion standing at the right edge of the first-run section near the bottom; about 140 px visible height, unobtrusive, no text overlap. Preserve his exact recognizable dark tan alpaca/llama identity, ears, gold armor, cyan visor and circular cyan core; no white mane, no replacement generic robot, no second mascot in the hero. Reference 3 is the official Incan wordmark; use it at upper left, no .pub suffix.

Critical content correction: Incan 0.6 is in development, NOT shipped. Its intended compilation path directly uses a pinned rustc compiler frontend, with no generated Rust-source semantic handoff. Oven is the shared build foundation for Incan and Rust. Rust remains a real ecosystem and backend, but generated Rust source must NOT appear as a pipeline stage or promise anywhere. Never say compiler already migrated/shipped. No invented metrics, no unverified AI tool features, no invented command interfaces. Today's reference date is 2026-10-07; do not add decorative dates.

Header stays compact, dark, continuous with hero: official Incan logo; Learn, Docs, Oven, GitHub; Get started.

Hero heading: "Python-readable.\nNative by design."
Hero supporting copy: "A statically typed language for clear application code. Compiler-planned ownership, native programs, and the Rust ecosystem."
Primary button "Try Incan"; secondary "Read the language guide".
Actual code workstation with legible syntax-highlighted Incan source:
model User:
    name: str
    age: int

def greet_user(user: User) -> str:
    return f"Hello, {user.name}!"

def main() -> None:
    user = User(name="Incan", age=42)
    println(greet_user(user))
Small output "Hello, Incan!" underneath. No fake performance counters.

Below hero, one calm ivory editorial grouped section:
heading "Start with something real."
Three slim horizontal linked rows, not boxed cards:
"01  Your first application" — "Create a project. Run it. Learn the essentials."
"02  A typed data workflow" — "Model your data and make transformations explicit."
"03  A reusable library" — "Build a library and use it from another project."
Elegant bronze fine dividers and quiet small arrows.

Next editorial section must replace the old generated-Rust narrative completely:
small eyebrow "0.6 · IN DEVELOPMENT"
heading "Two languages. One native foundation."
body "Incan owns the meaning of your code. The 0.6 compiler will lower it directly through rustc, while Oven plans builds for Incan, Rust, and mixed projects."
Use a restrained horizontal process trail: "Incan source → Compiler facts → Native program". This is conceptual, not executable UI. Include a single supporting line "No generated Rust source in the normal build path." and an "Explore the 0.6 direction →" link. Avoid internal HIR/MIR jargon. Show light technical line work matching the warm metal workshop, not a loud illustration.
Two short open editorial columns under this:
"Incan" / "Readable source. Explicit types. Planned ownership."
"Oven" / "A shared build graph, packages, and recorded artifacts."
Spacing and grouping, not feature-inventory badges.

Dark closing first-run section:
heading "Start small. Build something real."
copy "Incan is in active development. Try the current release, or follow the 0.6 cutover."
Small command terminal labelled "After installing Incan":
$ incan new hello --yes
$ cd hello && incan run
"Installation guide →" and quiet "Follow 0.6 →".
Place official Incus here, small standing quietly beside the terminal, introducing warmth without becoming the hero. One instance only. A minimal footer with Incan, Documentation, GitHub.
Keep the whole page uncrowded, grounded, strong hierarchy. No editorial phrases about GENERATED RUST or Rust-source output elsewhere. Preserve the selected design's tangible dark atelier personality.
