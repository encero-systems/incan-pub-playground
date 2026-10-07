# 1.53.2 (October 3rd, 2026)

### Fixed

- fs: handle integer overflow in buffered relative seek ([#8574])
- io: revert "always cleanup `AsyncFd` registration list on deregister" ([#8540])
- process: unregister Windows wait before closing child handle ([#8564])
- rt: drop blocking pool mutex before shutting down rejected task ([#8562])
- sync: fix mpsc index wraparound in block reclamation ([#8546])
- sync: forget mpsc `Permit` before sending value ([#8560])
- sync: validate `MAX_PERMITS` in `Semaphore::acquire` ([#8548])
- sync: wake broadcast `Sender::closed` outside mutex ([#8558])
- task: drop replaced waker outside lock in `JoinSet` ([#8554])
- time: drop timer lock before dropping waker in `clear_entry` ([#8552])
- time: expire timers directly on shutdown without rotating wheel ([#8570])

### Fixed (unstable)

- fs: clamp `io_uring` read length to `u32::MAX` ([#8572])
- rt: ignore `current_thread` task dumps from other runtimes ([#8544])
- rt: preserve `io_uring` context if a completion waker panics ([#8566])
- sync: fix semaphore use-after-free and permit leak on tracing panic ([#8542])
- taskdump: restore deferred leaf wakes during capture ([#8445])
- time: drop stored waker when cancelling alt timer entry ([#8550])

[#8445]: https://github.com/tokio-rs/tokio/pull/8445
[#8572]: https://github.com/tokio-rs/tokio/pull/8572

[#8445]: https://github.com/tokio-rs/tokio/pull/8445
[#8572]: https://github.com/tokio-rs/tokio/pull/8572
[#8540]: https://github.com/tokio-rs/tokio/pull/8540
[#8542]: https://github.com/tokio-rs/tokio/pull/8542
[#8544]: https://github.com/tokio-rs/tokio/pull/8544
[#8546]: https://github.com/tokio-rs/tokio/pull/8546
[#8548]: https://github.com/tokio-rs/tokio/pull/8548
[#8550]: https://github.com/tokio-rs/tokio/pull/8550
[#8552]: https://github.com/tokio-rs/tokio/pull/8552
[#8554]: https://github.com/tokio-rs/tokio/pull/8554
[#8558]: https://github.com/tokio-rs/tokio/pull/8558
[#8560]: https://github.com/tokio-rs/tokio/pull/8560
[#8562]: https://github.com/tokio-rs/tokio/pull/8562
[#8564]: https://github.com/tokio-rs/tokio/pull/8564
[#8566]: https://github.com/tokio-rs/tokio/pull/8566
[#8570]: https://github.com/tokio-rs/tokio/pull/8570
[#8574]: https://github.com/tokio-rs/tokio/pull/8574
