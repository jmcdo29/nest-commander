---
title: Usage
sidebar_label: Usage
---

:::info

We'll show how to use the `nest-commander-schematics` with the `@nestjs/cli`, but it works with `@angular/cli` and `nx` as well, as all of them use Angular's schematics under the hood.

:::

## Generating Commands

To generate a simple command you can use

```shell
nest g -c nest-commander-schematics command
```

, from there the wizard will ask what the name of the command is and if you would like to add questions. You can choose no or provide a question set name at this point. You can also use `--default=true` to automatically set the `isDefault` option. `spec`, `flat`, `path`, and `sourceRoot` are also available options.

### Generating Commands with Questions

As mentioned above, you can use the `command` schematic and provide a question set name. You can also use `--question=<name>` to provide a name for the question set without waiting to answer the prompt.

## Generating Questions

You can also generate a question set using the schematic

```shell
nest g -c nest-commander-schematics question
```

from there you can provide a name for the question set as mentioned by the wizard. `spec`, `flat`, `path`, and `sourceRoot` are also usable options.
