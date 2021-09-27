---
'nest-commander': minor
---

Subcommands can now be created

There's a new decorator, `@SubCommand()` for creating nested commands like `docker compose up`. There's also a new option on `@Command()` (`subCommands`) for setting up this sub command relationship.
