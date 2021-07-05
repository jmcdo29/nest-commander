---
'nest-commander': minor
'nest-commander-testing': minor
---

Allow for commands to be run indefinitely

There is a new `runWithoutClosing` method in the `CommandFactory` class. This command allows for not having the created Nest Application get closed immediately, which should allow for the use of indefinitely runnable commands.
