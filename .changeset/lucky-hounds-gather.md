---
'nest-commander': patch
---

Call the `errorHandler` given to `CommandFactory.run` when a subcommand fails,
such as when a required option is missing, instead of letting commander exit the
process first. As with the root command, the handler is also called for `--help`
and `--version` exits, where `err.exitCode` is 0.
