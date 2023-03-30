---
title: Commander
layout: ../../../layouts/MainLayout.astro
---

For `nest-commander`, a `command` is something that the CLI runner should do. This could be like
`@nestjs/cli`'s `start` or `build` commands, or it could be something like `git`'s `add` or
`commit`. To specify a command, all you need to do is decorate a class that extends the
`CommandRunner` abstract class with the `@Command()` decorator. No need to use `@Injectable()` or
anything else, the `@Command()` decorator will take care of allowing dependencies to be injected
into the class.

## Setting the Command Name and Arguments

The `@Command()` decorator takes in a set of options that allows the underlying `commander` package
to handle the command properly. The options are things like the command's `name`, its `arguments`,
the `description`, the `argsDescription` and general `options`, all of which will get passed to
commander and handled [as described by their docs](https://github.com/tj/commander.js).

To set a command's name, and make it the default actions, you would need to use the decorator as
follows. Let's make a command with the name `my-exec`. It will also take in a shell command to
execute. We'll call this, `task`.

```typescript title="src/task.command.ts"
@Command({
  name: 'my-exec',
  arguments: '<task>',
  options: { isDefault: true }
})
export class TaskRunner extends CommandRunner {
  async run(inputs: string[], options: Record<string, any>): Promise<void> {}
}
```

You'll notice for the `arguments` we use angle brackets around the argument name. This specifies
that the argument is required for the command, and commander will throw an error if it is not
supplied. If, however, we wanted to make the argument optional, we could wrap it in square brackets
instead like `[task]`.

Now, to run this command, we'll need to set up the [CommandFactory](./factory) and make use of one
of the execution methods as described later in the docs. For now, we'll just assume this application
is installed globally under the `crun` name. Running the above command would then look like

```shell
crun my-exec 'echo Hello World!'
# OR
crun 'echo Hello World!'
```

We can use either of these _because_ we set up the `options: { isDefault: true }` options.

This command doesn't do anything yet, but we'll get to the implementation of it later. For now,
let's explore how we can set options for the command.

## Setting Options for the Command

Options allow users to change certain behaviors of the command. Going back to Nest's CLI the `start`
command can take a `--watch` or `--debug` option to start up in different modes. For
`nest-commander` each of these options goes on its own method of the class it modifies. Going back
to our `run` command, say we wanted to allow the use of a different shell for running the command.
The easiest way to add this in would be to allow the user to use a flag, like `-s` and then the name
of the shell to use. Adding this option would then make our class look like the following

```typescript title="src/task.command.ts"
@Command({
  name: 'my-exec',
  arguments: '<task>',
  options: { isDefault: true }
})
export class TaskRunner extends CommandRunner {
  async run(inputs: string[], options: Record<string, any>): Promise<void> {}
  @Option({
    flags: '-s, --shell <shell>',
    description: 'A different shell to spawn than the default'
  })
  parseShell(val: string) {
    return val;
  }
}
```

The reason for each option to be tied to a method handler is because options from the command line
come in as strings. Most of the time, this is fine and works well, but there are times where it ends
up having problems, like passing booleans. These methods allow developers to set up their own
parsing methods for each option, so that when `my-exec` is called, all of the inputs are validated
and ready to be used immediately.

You'll also notice that the `flags` property has several parts to it, a `-s` short flag, a `--shell`
long flag, and `<shell>`. This means that the user can either use `-s` or `--shell` to add this
option, but if either is used they **must** provide a shell option. The `shell` name ends up being a
key of the `options` parameter for the `my-exec` method, and can be retrieved later using
`options.shell`.

The `description` is used when the `--help` flag is passed, and will help provide more information
to the CLI consumer.

You can add as many of these `@Option()` methods as necessary for your command, so long as they do
not duplicate option names. Each method may only have one `@Option()` decorator as well.

:::info

For more details on everything that is possible with options, take a look at
[`commander`'s Options documentation](https://www.npmjs.com/package/commander#options).

:::

You can also make an option completely required, like an argument, by setting `required: true` in
the metadata for the option.

### Variadic Options

Options also allow for variadic inputs but you will need to provide an option parser that
accumulates each option.

```typescript
  @Option({
    flags: '-c, --options <options...>',
    description: 'Specify options',
  })
  parseOptions(option: string, optionsAccumulator: string[] = []): string[] {
    optionsAccumulator.push(option);
    return optionsAccumulator;
  }
```

### Setting Choices for your Options

Commander also allows us to set up pre-defined choices for options. To do so we have two options:
setting the `choices` array directly as a part of the `@Option()` decorator, or using the
`@OptionChoiceFor()` decorator and a class method, similar to the [InquirerService](./inquirer).
With using the `@OptionChoiceFor()` decorator, we are also able to make use of class providers that
are injected into the command via Nest's DI which allows devs to read for the choices from a file or
database if that happens to be necessary.

```typescript
import { Option, OptionChoiceFor } from 'nest-commander';

@Command({ name: 'my-exec' })
export class RunCommand extends CommandRunner {
  constructor(
    private readonly choiceProvider: {
      getChoicesForRun: () => string[];
    }
  ) {
    super();
  }

  async run(args: any, options: { runWithColor: 'yes' | 'no' }) {
    console.log(options);
  }

  @Option({
    flags: '-c, --color [runWithColor]',
    name: 'withColor',
    description: 'Should the command use color in the output'
  })
  parseColorOption(option: string) {
    return option;
  }

  @OptionChoiceFor({ name: 'withColor' }) // make sure this matches the `name` of an `@Options()` decorator
  getColorChoices() {
    return this.choiceProvider.getChoicesForRun();
  }
}
```

## Adding Custom Help

By default, `commander` sets help to the `--help` or `-h` flag. If you need extra help added to the
command, you can use the `@Help()` decorator on a class method that returns a string. The valid
values for the `@Help()` decorator are `before`, `beforeAll`, `after` and `afterAll`, just like for
commander's `addHelpText` method.

## Getting the Commander Instance

If for some reason you need access to the `commander` instance, as of `nest-commander@2.4.0` you can
use `@InjectCommander()` to get the instance used.

## Getting the Current Command

Similarly, if you need to get the current Commander commander instance, you can access it via
`this.command`

:::info

This is only available in version 3.0.0 and on.

:::

## Sub Commands

It may also be that you want to add subcommands to your command, similar to `docker compose up`.
This is possible with the `@SubCommand()` decorator. Using this decorator, you can have your
original implementation for the `@Command()` decorator, with arguments as normal, and you can have
sub commands, as specific arguments that take in even more options. With our `my-exec` example
above, lets say we wanted to add a subcommand, `foo`. We'd make use of the `parents` option for the
`my-exec` command and reference the subcommand class, like so:

```ts
@Command({
  name: 'my-exec',
  arguments: '<task>',
  subCommands: [FooCommand]
})
export class RunCommand extends CommandRunner {}
```

Now we just make a subcommand with the same metadata options as the `@Command()` decorator

```ts
@SubCommand({ name: 'foo', arguments: '[phooey]' })
export class FooCommand extends CommandRunner {
  // command runner implementation
}
```

After adding the subcommand to the appropriate module's `providers` array, nest-commander will set
up the command so you can call `crun my-exec foo hello!` and the `FooCommand#run` method will be ran
instead of `RunCommand#run`. You can also chain commands as deep as you want, by adding
`subCommands` to the subcommand's metadata.

Subcommands can also take an `aliases` array for sub command aliases. We could add `aliases: ['f']`
to the above `FooCommand` and run it with `my-exec f` instead of `my-exec foo` and get the same
result. `aliases` must be passed as an array.

You can also use the `options: { isDefault: true }` option of the`@SubCommand()` decorator to set a
default subcommand for the command.

## Request Scoped Commands

In a CLI environment requests don't exist in the traditional HTTP sense. Because of this, `REQUEST`
scoped providers are problematic inside of `nest-commander` commands. However, thanks to the
`@RequestModule()` decorator it is possible to create a mock value for the command to make use of so
that the command and all of its dependencies remain `SINGLETON` or `DEFAULT` scoped allowing the
original providers of the application to be used without a major bit of re-architecting. The
decorator works _just_ like `@Module()` with one extra field, `requestObject` that gets merged into
the `providers` array under the `REQUEST` provider token from `@nestjs/core`. This makes Nest
resolve the "proper" value for `REQUEST` because it exists inside the current module.

```ts
@RequestModule({
  providers: [SimpleCommand, RequestScopedProvider],
  requestObject: { headers: { Authorization: 'Bearer token' } }
})
export class RequestScopedCommandModule {}
```

While we _call_ it `RequestScoped`, it is very much set to be singleton, which is a win for re-using
existing providers.

## Using a Command as the Root Command

Sometimes using `options: { isDefault: true }` isn't enough for the use case, like if you want to
have the `--help` flag output the default command's arguments and options. Fortunately, there is the
`@RootCommand()` decorator to replace the base `commander` command with your own command. This
command will be read, parsed, and set up before all of the other commands in your application to
allow for everything to keep working as is. It works **exactly** like `@Command()`, but does not
require a `name` argument to be passed.

:::info

The `@RootCommand()` decorator is also aliased as `@DefaultCommand()` if you prefer that
nomenclature, is available from 3.6.0 and on.

:::

## The Full Command

Let's say all we want to do is have our `my-exec` command run the task in another shell, and that's
it. If we take our above command we can see that it can be ran like so

```shell
crun my-exec 'echo Hello World!'
# OR
crun 'echo Hello World!'
# OR
crun 'echo Hello World!' --shell zsh
# OR
crun my-exec 'echo Hello World!' -s zsh
```

To create this kind of program, we can do the following:

```typescript title="src/task.command.ts"
import { spawn } from 'child_process';
import { Command, CommandRunner, Option } from 'nest-commander';
import { userInfo } from 'os';

@Command({
  name: 'my-exec',
  arguments: '<task>',
  options: { isDefault: true }
})
export class TaskRunner extends CommandRunner {
  async run(inputs: string[], options: Record<string, string>): Promise<void> {
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

The above command is meant to be a basic example, and should not be taken as a fully fleshed out CLI
example. There's error handling, input validation, and security that should all be considered.
Please do not use the above command in a production environment without adding the mentioned
necessities **at the very least**.

:::

## Register Commands

Though you'll find the implementation details in the [factory page](./factory), you must register
all of your commands including the sub commands as providers in a module class that the
`CommandFactory` ends up registering. For convenience, given that we register examples in Sub
Commands section and set them as providers in `app.module.ts` that set as root module to
`CommandFactory`.

```typescript title="src/app.module.ts"
@Module({
  providers: [RunCommand, FooCommand]
})
export class AppModule {}
```

If you have many sub commands and nested directories for that, it may feel tough to import all of
them. For this case, the static `regsiterWithSubCommands` method is available in all classes
inheriting `CommandRunner` which returns a list of itself and all sub commands. This means you can
write the setting like followed by example instead of the previous example.

```typescript title="src/app.module.ts"
@Module({
  providers: [...RunCommand.registerWithSubCommands()]
})
export class AppModule {}
```

This example works even if the `RunCommand` has more and nested subcommands and doesn't interfare
with registering other providers or commands if using spread operator or concat method of `Array`.
