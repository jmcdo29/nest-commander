---
'nest-commander': minor
---

Adds a new CliUtilityService and @InjectCommander() decorator

There is a new `CliUtilityService` and `@InjectCommander()` decorator that allows for direct access to the commander instance. The utility service has methods like `parseBoolean`, `parseInt`, and `parseFloat`. The number parsing methods are just simple wrappers around `Number.parse*()`, but the boolean parsing method handles true being `yes`, `y`, `1`, `true`, and `t` and false being `no`, `n`, `false`, `f`, and `0`.
