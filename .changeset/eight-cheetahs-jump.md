---
'nest-commander': minor
'nest-commander-testing': patch
---

Adds a new `@Help()` decorator for custom commander help output

`nest-commander-testing` now also uses a `hex` instead of `utf-8` encoding when creating a random js file name during the `CommandTestFactory` command. This is to help create more predictable output names.
