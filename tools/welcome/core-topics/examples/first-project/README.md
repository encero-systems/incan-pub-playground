# First project

A greeting program and tests for Incan 0.6. Install Incan before starting.

From this directory:

    incan fmt --check src tests
    incan check src/main.incn
    incan run src/main.incn
    incan test tests/test_greeting.incn
    incan build src/main.incn

Expected: Hello, Incan! and two passing tests.

Exercise: change greet to return Hello, stranger! for an empty name; add a test for it.
