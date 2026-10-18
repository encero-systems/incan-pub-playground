"""Batch adapter for the existing pinned Pygments formatting dependency, without package execution."""
import html
import json
import sys
from pathlib import Path
import pygments
from pygments import highlight
from pygments.formatters import HtmlFormatter
from pygments.lexers import get_lexer_by_name
from pygments.lexers import load_lexer_from_file

if pygments.__version__ != '2.19.2':
    raise RuntimeError('Pygments 2.19.2 is required')
formatter = HtmlFormatter(nowrap=True)
result = {}
cache = {}
for block in json.loads(Path(sys.argv[1]).read_text()):
    language = block['language'].split(',')[0].lower()
    language = {'rs': 'rust', 'incn': 'incan'}.get(language, language)
    source = html.unescape(block['encoded'])
    key = (language, source)
    if key not in cache:
        if language in ('rust', 'toml', 'c', 'cpp', 'incan'):
            lexer = (load_lexer_from_file('tools/site/vendor/incan_pygments.py', 'IncanLexer')
                     if language == 'incan' else get_lexer_by_name(language))
            lexer.stripnl = False
            lexer.ensurenl = False
            body = highlight(source, lexer, formatter)
            cache[key] = '<pre><code class="syntax-highlight language-' + language + '">' + body + '</code></pre>'
        else:
            cache[key] = '<pre><code>' + html.escape(source, quote=False) + '</code></pre>'
    result[block['token']] = cache[key]
Path(sys.argv[2]).write_text(json.dumps(result))
