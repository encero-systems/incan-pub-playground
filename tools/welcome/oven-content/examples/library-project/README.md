# Build and consume a library

Requires Incan 0.6. From this directory:

    incan run shop/src/main.incn

Expected output: 36. Oven prepares the local pricing library before building shop.

To build the library by itself:

    incan build pricing/src/lib.incn

Exercise: add `+ 5` to the return expression in pricing/src/lib.incn, then run shop again. Expected output: 41.

The tutorial is in the Incan documentation under Oven → Dependencies and packages → Build and consume a library.
