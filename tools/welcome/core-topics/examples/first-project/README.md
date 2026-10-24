# First project

An Incan 0.6.0-dev.8 documentation exercise. Requires a matching installed toolchain and INCAN_STDLIB.

From this directory:

    incan fmt --check src tests
    incan check src/main.incn
    incan run src/main.incn
    incan test tests/test_greeting.incn
    incan build src/main.incn

Expected: Hello, Incan! and two passing tests.

Exercise: change greet to return Hello, stranger! for an empty name; add a test for it.

Verified on macOS arm64 with the dev.8 rehearsal bundle built from 55b26c75f2f025feed1368c2c80a38193162302d. This is not a final 0.6 release certification. No legacy manifest or generated build output is included.
