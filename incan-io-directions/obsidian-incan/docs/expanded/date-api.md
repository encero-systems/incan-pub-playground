# Date

`std.datetime.Date` · Gregorian calendar date

**API preview:** this page is authored from source declarations and documentation. The upcoming API generator has not produced it. This is a selected surface, not the complete Date API.

[Learn when to use Date](dates.md) · [Existing complete datetime reference](../language/reference/stdlib/datetime.md)

## Import

```incan
from std.datetime import Date, DateTimeError
```

A `Date` holds calendar fields `year`, `month`, and `day`, each an `int`. It carries no time of day, UTC offset, or timezone. Use checked factories when accepting external data.

## Date.fromisoformat

Static method:

```incan
@staticmethod
def fromisoformat(value: str) -> Result[Date, DateTimeError]
```

| Item | Contract |
| --- | --- |
| Input | A string in `YYYY-MM-DD` form |
| Success | `Ok` containing the parsed Gregorian date |
| Failure | `Err(DateTimeError)` for malformed or out-of-range input |
| Examples | `2026-04-14` is valid; `2026-02-30` is an invalid calendar date |

Error detail is suitable for display. Do not branch on the exact message wording; it is diagnostic text, not an error-code API.

[Use this method in a trial-period calculation](dates.md#calculate-a-trial-end-date).

## Date.isoformat

Instance method:

```incan
def isoformat(self) -> str
```

Returns the date in `YYYY-MM-DD` form. This method returns text directly; it does not return `Result`.

## Date.utc_today

Static method:

```incan
@staticmethod
def utc_today() -> Date
```

Returns the current UTC calendar date using the host system clock. It deliberately does not use the host's local timezone.

## Calendar arithmetic

Month arithmetic clamps the day to the last valid day in the destination month. This is part of the Date type's contract, not a promise that a month has a fixed duration.

[Choose between days and calendar months](dates.md#a-month-is-a-calendar-operation).

## Source and coverage

The signatures and contracts above come from `loaves/stdlib/data/src/datetime/civil/naive.incn`; the error-message guidance comes from `datetime/error.incn`. Exact input snapshots and hashes are retained with this experiment.

A production API page should derive public declarations, doc comments, symbol links, and version identity from the same checked build. Examples and contract completeness still need validation. A missing doc comment must appear as a documentation gap, not be filled with invented guarantees.
