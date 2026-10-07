1.13.1 (2026-07-15)
===================
This is a release that fixes a bug where incorrect regex match offsets could be
reported. Note that this doesn't impact whether a match occurs or not, just
where it occurs. The match offsets are still valid for slicing, they just may
not refer to the correct leftmost-first match. See
[#1364](https://github.com/rust-lang/regex/pull/1364) for (many) more details.

Bug fixes:

* [#1354](https://github.com/rust-lang/regex/issues/1354):
Fixes previously unsound reverse suffix and inner optimizations.
