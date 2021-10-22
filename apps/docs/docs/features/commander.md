---
title: Commander
sidebar_label: Commander
---

For `nest-commander`, a `command` is something that the CLI runner should do. This could be like `@nestjs/cli`'s `start` or `build` commands, or it could be something like `git`'s `add` or `commit`. To specify a command, all you need to do is decorate a class that implements the `CommandRunner` interface with the `@Command()` decorator. No need to use `@Injectable()` or anything else, the `@Command()` decorator will take care of allowing dependencies to be injected into the class.

## Setting the Command Name and Arguments

The `@Command()` decorator takes in a set of options that allows the underlying `commander` package to handle the command properly. The options are things like the command's `name`, its `arguments`, the `description`, the `argsDescription` and general `options`, all of which will get passed to commander and handled [as described by their docs](https://github.com/tj/commander.js).

To set a command's name, and make it the default actions, you would need to use the decorator as follows. Let's make a command with the name `run`. It will also take in a shell command to execute. We'll call this, `task`.

```typescript title="src/task.command.ts"
@Command({
  name: 'run',
  arguments: '<task>',
  options: { isDefault: true }
})
export class TaskRunner implements CommandRunner {
  async run(
    inputs: string[],
    options: Record<string, any>
  ): Promise<void> {}
}
```

You'll notice for the `arguments` we use angle brackets around the argument name. This specifies that the argument is required for the command, and commander will throw an error if it is not supplied. If, however, we wanted to make the argument optional, we could wrap it in square brackets instead like `[task]`.

Now, to run this command, we'll need to set up the [CommandFactory](./factory.md) and make use of one of the execution methods as described later in the docs. For now, we'll just assume this application is installed globally under the `crun` name. Running the above command would then look like

```shell
crun run 'echo Hello World!'
# OR
crun 'echo Hello World!'
```

We can use either of these _because_ we set up the `options: { isDefault: true }` options.

This command doesn't do anything yet, but we'll get to the implementation of it later. For now, let's explore how we can set options for the command.

## Setting Options for the Command

Options allow users to change certain behaviors of the command. Going back to Nest's CLI the `start` command can take a `--watch` or `--debug` option to start up in different modes. For `nest-commander` each of these options goes on its own method of the class it modifies. Going back to our `run` command, say we wanted to allow the use of a different shell for running the command. The easiest way to add this in would be to allow the user to use a flag, like `-s` and then the name of the shell to use. Adding this option would then make our class look like the following

```typescript title="src/task.command.ts"
@Command({
  name: 'run',
  arguments: '<task>',
  options: { isDefault: true }
})
export class TaskRunner implements CommandRunner {
  async run(
    inputs: string[],
    options: Record<string, any>
  ): Promise<void> {}
  @Option({
    flags: '-s, --shell <shell>',
    description: 'A different shell to spawn than the default'
  })
  parseShell(val: string) {
    return val;
  }
}
```

The reason for each option to be tied to a method handler is because options from the command line come in as strings. Most of the time, this is fine and works well, but there are times where it ends up having problems, like passing booleans. These methods allow developers to set up their own parsing methods for each option, so that when `run` is called, all of the inputs are validated and ready to be used immediately.

You'll also notice that the `flags` property has several parts to it, a `-s` short flag, a `--shell` long flag, and `<shell>`. This means that the user can either use `-s` or `--shell` to add this option, but if either is used they **must** provide a shell option. The `shell` name ends up being a key of the `options` parameter for the `run` method, and can be retrieved later using `options.shell`.

The `description` is used when the `--help` flag is passed, and will help provide more information to the CLI consumer.

You can add as many of these `@Option()` methods as necessary for your command, so long as they do not duplicate option names. Each method may only have one `@Option()` decorator as well.

:::info

For more details on everything that is possible with options, take a look at [`commander`'s Options documentation](https://www.npmjs.com/package/commander#options).

:::

You can also make an option completely required, like an argument, by setting `required: true` in the metadata for the option.

## Adding Custom Help

By default, `commander` sets help to the `--help` or `-h` flag. If you need extra help added to the command, you can use the `@Help()` decorator on a class method that returns a string. The valid values for the `@Help()` decorator are `before`, `beforeAll`, `after` and `afterAll`, just like for commander's `addHelpText` method.

## Sub Commands

It may also be that you want to add subcommands to your command, similar to `docker compose up`. This is possible with the `@SubCommand()` decorator. Using this decorator, you can have your original implementation for the `@Command()` decorator, with arguments as normal, and you can have sub commands, as specific arguments that take in even more options. With our `run` example above, lets say we wanted to add a subcommand, `foo`. We'd make use of the `parents` option for the `run` command and reference the subcommand class, like so:

```ts
@Command({
  name: 'run',
  arguments: '<task>',
  subCommands: [FooCommand]
})
export class RunCommand implements CommandRunner {}
```

Now we just make a subcommand with the same metadata options as the `@Command()` decorator

```ts
@SubCommand({ name: 'foo', arguments: '[phooey]' })
export class FooCommand implements CommandRunner {
  // command runner implementation
}
```

and now nest-commander will set up the command so you can call `crun run foo hello!` and the `FooCommand#run` method will be ran instead of `RunCommand#run`. You can also chain commands as deep as you want, by adding `subCommands` to the subcommand's metadata.

:::info

You can make the parent command non-executable by passing `executable: false` as one of the options for the command's metadata. Now if the parent command is called, the help will be printed. You still need `async run() {}` in the class to satisfy the interface.

:::

## The Full Command

Let's say all we want to do is have our `run` command run the task in another shell, and that's it. If we take our above command we can see that it can be ran like so

```shell
crun run 'echo Hello World!'
# OR
crun 'echo Hello World!'
# OR
crun 'echo Hello World!' --shell zsh
# OR
crun run 'echo Hello World!' -s zsh
```

To create this kind of program, we can do the following:

```typescript title="src/task.command.ts"
import { spawn } from 'child_process';
import { Command, CommandRunner, Option } from 'nest-commander';
import { userInfo } from 'os';

@Command({
  name: 'run',
  arguments: '<task>',
  options: { isDefault: true }
})
export class TaskRunner implements CommandRunner {
  async run(
    inputs: string[],
    options: Record<string, string>
  ): Promise<void> {
    const echo = spawn(inputs[0], {
      shell: options.shell ?? userInfo().shell
    });
    echo.stdout.on('data', (data: Buffer) => {
      console.log(data.toString());
    });
  }
  @Option({
    flags: '-s, --shell <shell>',
    description: 'A different shell to spawn than the default'
  })
  parseShell(val: string) {
    return val;
  }
}
```

And now the `TaskRunner` is setup and ready to be used.

:::caution

The above command is meant to be a basic example, and should not be taken as a fully fleshed out CLI example. There's error handling, input validation, and security that should all be considered. Please do not use the above command in a production environment without adding the mentioned necessities **at the very least**.

:::
