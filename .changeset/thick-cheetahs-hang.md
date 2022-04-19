---
'nest-commander': minor
---

Allow for command options to have defined choices

Option choices are now supported either as a static string array or via the `@OptionChoicesFor()` decorator on a class method. This decorator method approach allows for using a class's injected providers to give the chocies, which means they could come from a database or a config file somewhere if the CLI is set up to handle such a case
