---
'nest-commander': minor
---

Commands can now be built with the expectation of reading in plugins to dynamically modify the CLI

By using the `usePlugins` option for the `CommandFactory`, the built CLI can expect to find a configuration file at `nest-commander.json` (or several others, check the docs) to allow for users to plug commands in after the CLI is built.
