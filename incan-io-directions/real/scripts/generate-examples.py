"""Generate the static homepage examples from their copyable Incan source files."""
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parent.parent
EXAMPLES = [
    {"file": "hello.incn", "label": "Typed data", "notes": [
        (2, "Named data.", "Define data with clear types."),
        (5, "Typed functions.", "Functions declare their input and output types."),
        (8, "Clear structure.", "A simple, familiar program structure."),
    ]},
    {"file": "collections.incn", "label": "Collections", "notes": [
        (1, "Typed collections.", "A list of integers goes in and comes out."),
        (3, "Filter and transform.", "Keep even numbers and square each one."),
        (7, "Reusable functions.", "Call the function with ordinary data."),
    ]},
    {"file": "matching.incn", "label": "Pattern matching", "notes": [
        (2, "Pattern matching.", "Choose a branch from the value."),
        (3, "Specific cases.", "Handle a known value explicitly."),
        (6, "A fallback.", "The wildcard handles the remaining values."),
    ]},
    {"file": "enums.incn", "label": "Enums", "notes": [
        (2, "Data-bearing variants.", "A variant can carry a value with it."),
        (6, "Construct a value.", "Choose a variant and supply its data."),
        (8, "Unpack the variant.", "Match the variant to access its text."),
    ]},
    {"file": "optional.incn", "label": "Optional values", "notes": [
        (1, "Explicit absence.", "Option describes a value that may be missing."),
        (3, "A present value.", "Some carries the name into this branch."),
        (5, "Handle absence.", "None has its own path and greeting."),
    ]},
    {"file": "results.incn", "label": "Error handling", "notes": [
        (1, "Explicit outcomes.", "Result declares success and error types."),
        (3, "Return an error.", "Invalid input gets a meaningful error value."),
        (8, "Handle both paths.", "Match success or error at the call site."),
    ]},
]
EXAMPLES.extend([
    {"file": "combinators.incn", "label": "Combinators", "caption": "Iterator composition · complete example", "notes": [
        (9, "Keep the useful values.", "Filter the input with a typed callback."),
        (10, "Compose transformations.", "Map each score without a separate loop."),
        (12, "Choose when to collect.", "Take two values, then materialize the result."),
    ]},
    {"file": "capabilities.incn", "label": "Capabilities", "caption": "Capability declaration excerpt · 0.6 / 0.7 preview", "notes": [
        (3, "Name the authority.", "Declare a domain capability in source."),
        (6, "Give it a scope.", "A grant can constrain the tenant dimension."),
        (9, "Connect the operation.", "Declare the capability required by this provider operation."),
    ]},
    {"file": "architect.sh", "label": "Architect", "caption": "Architect command sketch · 0.7 preview", "language": "shell", "notes": [
        (2, "Review the project.", "Ask Architect for evidence-backed findings."),
        (6, "Choose your focus.", "Narrow the review to architectural boundaries."),
        (10, "Feed your tools.", "Request structured findings for an editor or agent."),
    ]},
])
TOKENS = re.compile(r'f?"[^"\\]*(?:\\.[^"\\]*)*"|\b[A-Za-z_]\w*\b|\b\d+\b')
KEYWORDS = {"model", "def", "return", "for", "in", "if", "match", "case", "enum", "from", "import", "capability", "scope", "pub"}
TYPES = {"str", "int", "bool", "None", "List", "Option", "Result", "Message", "Some", "Ok", "Err"}
FUNCTIONS = {"greet_user", "main", "evens", "describe", "println", "greet", "checked", "positive", "double", "iter", "filter", "map", "take", "collect", "provider_operation", "issue_refund", "architect"}

def highlight(line):
    if line.lstrip().startswith('#'):
        return '<span class="comment">' + html.escape(line) + '</span>'
    parts, end = [], 0
    for token in TOKENS.finditer(line):
        parts.append(html.escape(line[end:token.start()]))
        value = token.group()
        kind = ("string" if '"' in value else "keyword" if value in KEYWORDS
                else "type" if value in TYPES else "function" if value in FUNCTIONS
                else "number" if value.isdigit() else None)
        escaped = html.escape(value)
        parts.append(f'<span class="{kind}">{escaped}</span>' if kind else escaped)
        end = token.end()
    parts.append(html.escape(line[end:]))
    return ''.join(parts)

blocks, definitions = [], []
for index, example in enumerate(EXAMPLES):
    name = Path(example['file']).stem
    notes = []
    for step, (line, title, description) in enumerate(example['notes']):
        notes.append({"lineId": f"line-{name}-{line}", "anchorId": f"anchor-{name}-{step}",
                      "title": title, "description": description})
    rows = []
    for n, line in enumerate((ROOT / 'examples' / example['file']).read_text().splitlines(), 1):
        content = highlight(line) or ' '
        for note in notes:
            if note['lineId'] == f'line-{name}-{n}':
                content = f'<span id="{note["anchorId"]}">{content}</span>'
        # Keep the original example's section anchors usable.
        row_id = {1: 'named-data', 4: 'typed-functions', 7: 'clear-structure'}.get(n) if index == 0 else None
        if row_id:
            content = f'<span id="{row_id}">{content}</span>'
        rows.append(f'<span class="line" id="line-{name}-{n}">{content}</span>')
    block = '\n'.join(rows)
    blocks.append(block)
    definitions.append({"template": f'example-{name}', "filename": example['file'],
                        "label": example['label'], "notes": notes, "lineCount": len(rows),
                        "caption": example.get("caption", "Complete Incan example"),
                        "language": example.get("language", "incan")})

page = ROOT / 'index.html'
s = page.read_text()
s = re.sub(r'(<code id="incan-example">).*?(</code>)', lambda m: m[1] + blocks[0] + m[2], s, count=1, flags=re.S)
templates = '\n'.join(f'<template id="{definition["template"]}">{block}</template>'
                       for definition, block in zip(definitions, blocks))
if '<!-- BEGIN EXAMPLE TEMPLATES -->' not in s:
    s = s.replace('</body>', '<!-- BEGIN EXAMPLE TEMPLATES -->\n<!-- END EXAMPLE TEMPLATES -->\n</body>')
s = re.sub(r'<!-- BEGIN EXAMPLE TEMPLATES -->.*?<!-- END EXAMPLE TEMPLATES -->',
           lambda _: '<!-- BEGIN EXAMPLE TEMPLATES -->\n' + templates + '\n<!-- END EXAMPLE TEMPLATES -->', s, flags=re.S)
selectors = '\n'.join(f'<button type="button" data-example="{i}" aria-pressed="{str(i == 0).lower()}">{html.escape(d["label"])}</button>' for i, d in enumerate(definitions) if i in (0, 6, 7, 8))
options = '\n'.join(f'<option value="{i}">{html.escape(d["label"])}</option>' for i, d in enumerate(definitions))
s = re.sub(r'<div class="example-tabs">.*?<div class="example-controls">',
           lambda _: '<div class="example-tabs">\n' + selectors + '\n</div>\n'
           + '<label class="example-picker"><span class="sr-only">Choose example</span><select id="example-select">\n'
           + options + '\n</select></label>\n<div class="example-controls">', s, count=1, flags=re.S)
s = re.sub(r'(<span class="example-count" aria-hidden="true">).*?(</span>)',
           lambda m: m[1] + f'01 / {len(definitions):02d}' + m[2], s, count=1)
page.write_text(s)
(ROOT / 'examples.js').write_text('// Derived from examples/*.incn by scripts/generate-examples.py.\n'
                                 + 'const homepageExamples = ' + json.dumps(definitions, indent=2) + ';\n')
