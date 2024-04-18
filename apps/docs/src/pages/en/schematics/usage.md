---
title: Usage
layout: ../../../layouts/MainLayout.astro
---

:::info

We'll show how to use the `nest-commander-schematics` with
[`@nestjs/cli`](https://www.npmjs.com/package/@nestjs/cli), but it works with `@angular/cli` and
`nx` as well, as all of them use Angular's schematics under the hood.

:::

## Generating Commands

To generate a simple command you can use the `command` schematic:

```
nest g -c nest-commander-schematics command
```

from there the wizard will ask what the name of the command is and if you would like to add
questions. You can choose _no_ or provide a question set name at this point.

The available options for this command are the following:

```
--name=<name>         Command name.
--path=<name>         The path to create the service.
--sourceRoot=<name>   NestJS service source root directory.
--flat                Whether or not a directory is created. (default: false)
--spec                Whether or not a spec file is generated. (default: true)
--default             Whether or not the command is the default command for the CLI. (default: false)
--question=<name>     The name of the related question set.
```

### Generating Commands with Questions

As mentioned above, you can use the `command` schematic and provide a question set name. You can
also use `--question=<name>` to provide a name for the question set without waiting to answer the
prompt.

## Generating Questions

You can also generate a question set using the `question` schematic:

```
nest g -c nest-commander-schematics question
```

from there you can provide a name for the question set as mentioned by the wizard.

The available options for this command are the following:

```
--name=<name>         Questions set name.
--path=<name>         The path to create the service.
--sourceRoot=<name>   NestJS service source root directory.
--flat                Whether or not a directory is created. (default: false)
--spec                Whether or not a spec file is generated. (default: true)
```
