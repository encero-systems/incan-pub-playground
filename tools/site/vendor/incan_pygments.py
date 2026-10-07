# Adapted from Incan's documentation lexer; see README.md for source and license.
# Freeze registry data so highlighting does not depend on an adjacent checkout.
import json
import re
from pathlib import Path
from pygments.lexers.python import PythonLexer
from pygments.token import Keyword, Name, Operator, Token

_DATA = json.loads(Path("tools/site/vendor/incan-tokens.json").read_text(encoding="utf-8"))

def _keywords():
    return _DATA["keywords"]

def _load_stdlib_types():
    return set(_DATA["types"])

def _load_stdlib_functions():
    return set(_DATA["functions"])


class IncanLexer(PythonLexer):
    """Pygments lexer for the Incan programming language."""

    name = "Incan"
    aliases = ["incan", "incn"]
    filenames = ["*.incn"]
    mimetypes = ["text/x-incan"]

    flags = re.MULTILINE

    def __init__(self, **options):
        super().__init__(**options)
        self._incan_keywords = set(_keywords())
        self._incan_types = _load_stdlib_types()
        self._incan_functions = _load_stdlib_functions()

    def get_tokens_unprocessed(self, text, stack=("root",)):
        for index, token, value in super().get_tokens_unprocessed(text, stack=stack):
            if token is Name and value in self._incan_keywords:
                yield index, Keyword, value
                continue
            if token is Name and value in self._incan_types:
                yield index, Keyword.Type, value
                continue
            if token is Name and value in self._incan_functions:
                yield index, Name.Builtin, value
                continue
            if token is Name and value.startswith("assert_"):
                yield index, Name.Function, value
                continue
            if token is Token.Error and value == "?":
                yield index, Operator, value
                continue
            if token is Name and value[:1].isupper():
                yield index, Name.Class, value
                continue
            yield index, token, value
