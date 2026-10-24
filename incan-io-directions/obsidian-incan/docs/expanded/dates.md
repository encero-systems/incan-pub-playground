# Dates and times

A calendar date, an elapsed duration, and an instant on the clock answer different questions. Choose the type before writing the calculation.

## Choose your starting point

| What you need | Use | Why |
| --- | --- | --- |
| Measure how long work took | `Instant` | A monotonic clock for elapsed time |
| Represent a host-clock timestamp | `SystemTime` | A point in time relative to the system clock |
| Store a birthday or renewal date | `Date` | A calendar date without a time of day |
| Store a local date and time | `DateTime` | Calendar fields without a UTC offset |
| Exchange a timestamp with an offset | `DateTimeOffset` | A date and time paired with a fixed UTC offset |

`DateTimeOffset` can represent `+01:00`. That alone does not represent `Europe/Amsterdam`: named zones need rules for daylight-saving and historical changes. Named timezone support belongs in separately versioned packages.

## Calculate a trial end date

Suppose a subscription has a fourteen-day trial. Accept the signup date as text, parse it, and return the end date:

```incan
from std.datetime import Date, DateTimeError, TimeDelta

def trial_end(start: str) -> Result[Date, DateTimeError]:
    signup = Date.fromisoformat(start)?
    return Ok(signup + TimeDelta.days(14))
```

The parser returns `Result` because user input can fail. The `?` passes a parsing error to the caller; arithmetic only happens after parsing succeeds.

For a signup on `2026-04-14`, this calculation gives `2026-04-28`. A form or command-line entry point can decide how to present an invalid date to the user.

[See the accepted input and error contract for Date.fromisoformat](date-api.md#datefromisoformat).

## A month is a calendar operation

For monthly renewals, replace a fixed number of days with a calendar interval:

```incan
from std.datetime import Date, DateTimeError, YearMonthInterval

def renewal_date(start: str, months: int) -> Result[Date, DateTimeError]:
    signup = Date.fromisoformat(start)?
    return Ok(signup + YearMonthInterval.months(months))
```

Adding one month clamps to the last valid day of the destination month. January 31 therefore becomes February 28 in a non-leap year. A fixed thirty-day interval expresses a different policy.

## Keep formatting at the boundary

Keep `Date` values while doing date arithmetic. Call `isoformat()` when you need to store or display ISO text. Use `strftime(...)` for a specific display format.

[Look up Date and its formatting methods](date-api.md). For the broader clock/calendar model, [read the existing explanation](../language/explanation/datetime_model.md).

## Try changing the example

1. Start a trial near the end of a month. Does adding fourteen days preserve your intended policy?
2. Compare a monthly renewal with a thirty-day interval.
3. Decide where your application should turn a parsing error into a useful message.

## Content basis

Adapted from the existing dates-and-times tutorial, reference, and model explanation. Examples are checked against those sources; this preview does not claim a new compiler execution result.
