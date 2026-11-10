"""Build the outlined Crumb companion mark from the bundled Bangers font."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen

root = Path(__file__).resolve().parents[1]
font = TTFont(root / "static/fonts/Bangers-Regular.ttf")
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
outline = SVGPathPen(glyphs)
bounds = BoundsPen(glyphs)
x = 0
for letter in "CRUMB":
    name = cmap[ord(letter)]
    transform = (1, 0, 0, 1, x, 0)
    glyphs[name].draw(TransformPen(outline, transform))
    glyphs[name].draw(TransformPen(bounds, transform))
    x += font["hmtx"].metrics[name][0]
x0, y0, x1, y1 = bounds.bounds
scale = min(302 / (x1-x0), 76 / (y1-y0))
tx = 116 - x0*scale
ty = 98 + y0*scale
cells = '<path d="M34 30H58L50 86H26Z"/><path d="M62 30H94L90 54H58Z"/><path d="M58 58H90L86 86H54Z"/>'
logo = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 128" role="img" aria-labelledby="crumb-logo-title crumb-logo-desc">
<title id="crumb-logo-title">Crumb</title><desc id="crumb-logo-desc">Crumb wordmark with three fitted teal cells on an angled cream panel.</desc>
<path d="M26 14H398L378 120H6Z" fill="#111820" opacity=".18"/>
<path d="M22 8H394L374 114H2Z" fill="#fff4df" stroke="#111820" stroke-width="3" stroke-linejoin="miter"/>
<path d="M362 9H392L386 41Z" fill="#00777e"/>
<g fill="#00777e" stroke="#111820" stroke-width="2.5" stroke-linejoin="miter">{cells}</g>
<path d="{outline.getCommands()}" transform="matrix({scale:.8f} 0 0 {-scale:.8f} {tx:.8f} {ty:.8f})" fill="#111820"/>
</svg>'''
symbol = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-labelledby="crumb-symbol-title">
<title id="crumb-symbol-title">Crumb fitted-cell symbol</title>
<g transform="translate(-12 -10)" fill="#00777e" stroke="#111820" stroke-width="2.5" stroke-linejoin="miter">{cells}</g>
</svg>'''
(root / "static/crumb-logo.svg").write_text(logo+"\n")
(root / "static/crumb-symbol.svg").write_text(symbol+"\n")
print("Built Crumb SVG wordmark and symbol with outlined Bangers lettering.")
