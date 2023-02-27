---
title: API
layout: ../../layouts/MainLayout.astro
---

## nest-commander

### Commander Decorators

#### @Command()

This class decorator is pretty much what everything else in this package relies on existing. This is
the decorator that sets up the sub commands for the application that are to be consumed.

| Property        | Type                     | Required | Description                                                                                                                                                              |
| --------------- | ------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| name            | `string`                 | true     | The name of the command.                                                                                                                                                 |
| arguments       | `string`                 | false    | The arguments that the command takes in. For required arguments, wrap the argument in `<>`, for optional use `[]`.                                                       |
| description     | `string`                 | false    | The description of what the command does. This will be printed on the `--help` usage.                                                                                    |
| argsDescription | `Record<string, string>` | false    | The description for each argument. It will be used on `--help` as well.                                                                                                  |
| options         | `CommandOptions`         | false    | Extra options to pass to the commander instance. Check [commander's types](https://github.com/tj/commander.js/blob/master/typings/index.d.ts#L713) for more information. |
| subCommands     | `Type<CommandRunner>`    | false    | Subcommands related to the parent command, e.g.:<br/>`docker compose up` and `docker compose stop`.                                                                      |
| aliases         | `Array<string>`          | false    | Aliases for the `SubCommand`. You can pass this array to a `Command` but it will have no effect on the parsing of the command.                                           |

:::note

The above information holds for `@SubCommand()` as well, though `default` under `options` has no
effect.

:::

#### @RootCommand()

Just like `@Command()` except without the `name` property, and can only be used once per
application.

| Property        | Type                     | Required | Description                                                                                                                                                              |
| --------------- | ------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| arguments       | `string`                 | false    | The arguments that the command takes in. For required arguments, wrap the argument in `<>`, for optional use `[]`.                                                       |
| description     | `string`                 | false    | The description of what the command does. This will be printed on the `--help` usage.                                                                                    |
| argsDescription | `Record<string, string>` | false    | The description for each argument. It will be used on `--help` as well.                                                                                                  |
| options         | `CommandOptions`         | false    | Extra options to pass to the commander instance. Check [commander's types](https://github.com/tj/commander.js/blob/master/typings/index.d.ts#L713) for more information. |
| subCommands     | `Type<CommandRunner>`    | false    | Subcommands related to the parent command, e.g.:<br/>`docker compose up` and `docker compose stop`.                                                                      |
| aliases         | `Array<string>`          | false    | Aliases for the `SubCommand`. You can pass this array to a `Command` but it will have no effect on the parsing of the command.                                           |

#### @Option()

This method decorator allows for users to pass in extra options for commands defined with
`@Command()`. These options allow for the program to act in slightly different, yet predictable
ways.

| Property     | Type                      | Required | Description                                                                                                                                                                                                                                       |
| ------------ | ------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| flags        | `string`                  | true     | The flags that should work for this option. Multiple flags can exist for a single option, so long as they are separated by a comma, space, or pipe character. Just like with arguments, `<>` for required, `[]` for optional.                     |
| description  | `string`                  | false    | The description of the flags and option. Used with the `--help` output.                                                                                                                                                                           |
| defaultValue | `string` or `boolean`     | false    | The default value, if any, for the option.                                                                                                                                                                                                        |
| required     | `boolean`                 | false    | Make the option required like an argument and the command fail if the option is not provided.                                                                                                                                                     |
| name         | `string`                  | false    | The name of the option for the `CommandRunnerService` (internal) to use when pairing against a `@OptionChoicesFor()` decorator. This has no effect on the help text rendered by commander.                                                        |
| choices      | `Array<string>` OR `true` | false    | The choices for the option. If `true`, then the `CommandRunnerService` knows to go and find the `@OptionChoicesFor()` decorator that matches the `name` property. If an array, the options are used directly without searching to another method. |

#### @OptionChoicesFor()

This method decorator allows you to get chocies for an `@Option()` in a dynamic manner rather than
hard coding them into the `@Option()` decorator. The method this decorator decorates should return a
string array of options.

| Property | Type     | Requried | Description                                                                                            |
| -------- | -------- | -------- | ------------------------------------------------------------------------------------------------------ |
| name     | `string` | true     | The name to match back to the `@Option()` decorator. This is how the two decorators are tied together. |

#### @Help()

This method decorator allows you to add custom help text for your command in a specified position
with respect to the original help text

```ts
Help(position: 'before' | 'beforeAll' | 'after' | 'afterAll'): MethodDecorator
```

### InquirerService

#### `ask<T>`

An asynchronous command to allow for getting user input based on existing options from commander and
the name of a question set.

```typescript
ask<T>(name: string, options: Partial<T> | undefined): Promise<T>
// The following is just an alias for the above
prompt<T>(name: string, options: Partial<T> | undefined): Promise<T>
```

| Parameter | Type               | Required | Description                                                                                                                                                                                                                                             |
| --------- | ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name      | `string`           | true     | The name of the question set to ask for. This is defined in `@QuestionSet()`                                                                                                                                                                            |
| options   | `T` or `undefined` | true     | The pre-existing options that come from commander, or defined by the developer. The type here will determine the return type, unless `undefined`, then it is `any` unless passed in the generic. Values that are passed in will not be asked for again. |

### Inquirer Decorators

#### @QuestionSet()

This class decorator allows for the setup of a set of questions to ask.

| Property | Type     | Required | Description                                                                |
| -------- | -------- | -------- | -------------------------------------------------------------------------- |
| name     | `string` | true     | The name of the question set, to be later called by the `InquirerService`. |

#### @Question()

This method decorator allows for creating questions to ask the user. For information on each
specific kind of question, [Inquirer's docs](https://www.npmjs.com/package/inquirer) should be
consulted.

| Property    | Type                                                                                                             | Required | Description                                                                                                                                                                                   |
| ----------- | ---------------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type        | `"input"`, `"number"`, `"confirm"`, `"list"`, `"rawlist"`, `"expand"`, `"checkbox"`, `"password"`, or `"editor"` | false    | The kind of question for inquirer to ask. Each question has slightly different options, so pay attention to the type. Defaults to `"input"`.                                                  |
| name        | `string`                                                                                                         | true     | The name of the question's input. This is used when being passed back from the `InquirerService` and can be used with the `@*For()` decorators described below.                               |
| message     | `string`                                                                                                         | true\*   | The question to ask.                                                                                                                                                                          |
| default     | `string`, `number`, `boolean`, `array`                                                                           | false    | The default value for the question's input.                                                                                                                                                   |
| choices     | `array`                                                                                                          | true     | The choices to be defined for a `list`, `rawlist`, `checkbox`, and `expand` question. The array can be of strings, or numbers, or objects containing a `name`, `value`, and `short` property. |
| validate    | `Function`                                                                                                       | false    | A validation function that ensures the input is correct. On failed validation the question is re-asked.                                                                                       |
| transform   | `Function`                                                                                                       | false    | A transform method that takes the user's input and transforms it before printing it back to the terminal. This does not have an impact on the incoming value itself.                          |
| when        | `Function` or `boolean`                                                                                          | false    | A function or boolean to determine if a question should be asked or not.                                                                                                                      |
| pageSize    | `number`                                                                                                         | false    | The number of lines to render for `list`, `rawlist`, `checkbox`, and `expand` question.                                                                                                       |
| prefix      | `string`                                                                                                         | false    | Changes the _prefix_ message.                                                                                                                                                                 |
| suffix      | `string`                                                                                                         | false    | Changes the _suffix_ message.                                                                                                                                                                 |
| askAnswered | `boolean`                                                                                                        | false    | Force the prompt even if the question has been answered. Defaults to `false`.                                                                                                                 |
| loop        | `boolean`                                                                                                        | false    | Enable loop listing. Defaults to `true`.                                                                                                                                                      |

:::note

When you use the `@*For()` decorator factories, the equivalent option on `@Question()` (eg:
`message`) will not be used.

:::

\* The property itself is not required, but there must be a value for this, whether through dynamic
decorator or the `@Question()` decorator.

#### @ValidateFor()

This method decorator allows a user to define a dynamic value for inquirer's `validate` option for
the named question. The method this decorator decorates takes in the user input and answer hashes
and returns a boolean.

| Property | Type     | Required | Description                                      |
| -------- | -------- | -------- | ------------------------------------------------ |
| name     | `string` | true     | The name of the question this decorator effects. |

#### @TransformFor()

This method decorator allows a user to define a dynamic value for inquirer's `transform` option for
the named question. The method this decorator decorates takes in the user input, answer hashes, and
option flags and returns the input after transformation. This transformation **does not** impact
what is returned by Inquirer, only what is shown back to the user.

| Property | Type     | Required | Description                                      |
| -------- | -------- | -------- | ------------------------------------------------ |
| name     | `string` | true     | The name of the question this decorator effects. |

#### @WhenFor()

This method decorator allows a user to define a dynamic value for inquirer's `when` option for the
named question. The method this decorator decorates takes in the answer hashes and returns a boolean
for if the question should be shown or not.

| Property | Type     | Required | Description                                      |
| -------- | -------- | -------- | ------------------------------------------------ |
| name     | `string` | true     | The name of the question this decorator effects. |

#### @MessageFor()

This method decorator allows a user to define a dynamic value for inquirer's `message` option for
the named question. The method this decorator decorates takes in the current set of answers and
returns a string.

| Property | Type     | Required | Description                                      |
| -------- | -------- | -------- | ------------------------------------------------ |
| name     | `string` | true     | The name of the question this decorator effects. |

#### @ChoicesFor()

This method decorator allows a user to define a dynamic value for inquirer's `choices` option for
the named question. The method this decorator decorates takes in the current answer hashes and
returns an array of choices. These choices can be an array of `string`, `number`, or objects
containing a `name`, `value`, and `short`. The choices array can also contain a separator which can
be read about in [Inquirer's docs](https://www.npmjs.com/package/inquirer).

| Property | Type     | Required | Description                                      |
| -------- | -------- | -------- | ------------------------------------------------ |
| name     | `string` | true     | The name of the question this decorator effects. |

#### @DefaultFor()

This method decorator allows a user to define a dynamic value for inquirer's `default` option for
the named question. The method this decorator decorates takes in the current hash of answers and
returns a `number`, `string`, or `boolean`.

| Property | Type     | Required | Description                                      |
| -------- | -------- | -------- | ------------------------------------------------ |
| name     | `string` | true     | The name of the question this decorator effects. |

:::tip

Most of the decorators for the `@QuestionSet()` decorated class are just dynamic setters for
inquirer's options.
[Their docs will go more in depth about what each one does](https://www.npmjs.com/package/inquirer).

:::

### CliUtilityService

:::info

The `CliUtilityService` is available from `nest-commander@2.4.0` and on

:::

#### parseBoolean

A helper method to turn a string into a boolean based on true or false values.

| Property | Type     | Required | Description                                  |
| -------- | -------- | -------- | -------------------------------------------- |
| val      | `string` | true     | The string value to be turned into a boolean |

#### parseInt

A Simple wrapper around `Number.parseInt()`

| Property | Type     | Required | Description                                   |
| -------- | -------- | -------- | --------------------------------------------- |
| val      | `string` | true     | The string value to be turned into an integer |
| radix    | `number` | false    | The radix to use for praseInt. Defaults to 10 |

#### parseFloat

A simple wrapper around `Number.parseFloat()`

| Property | Type     | Required | Description                                |
| -------- | -------- | -------- | ------------------------------------------ |
| val      | `string` | true     | The string value to be turned into a float |

### CommandFactory

#### run

A static method that kicks off the command and manages the Nest application lifecycle.

```typescript
CommandFactory.run(rootModule: Type<any>, optionsOrLogger?: CommandFactoryRunOptions | NestLogger): Promise<void>
```

| Parameter       | Type                                       | Required | Description                                                                                                                   |
| --------------- | ------------------------------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| rootModule      | `Type<any>`                                | true     | The module, or module metadata, required to run the command. This is the same module metadata passed to `NestFactory.create`. |
| optionsOrLogger | `CommandFactoryRunOptions` or `NestLogger` | false    | Options or a Nest logger instance for the `CommandFactory` to pass on to `NestLogger`. See below for more information.        |

#### runWithoutClosing

The same static method as above, but without handling the closing of the Nest application when the
command finishes. This is to allow the setup of things like file watchers or pollers.

#### CommandFactoryRunOptions

Options that can be passed to the `run` or `runWithoutClosing` method to modify the behavior.

| Property                | Type         | Required | Description                                                                                                                                                                                   |
| ----------------------- | ------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| logger                  | `NestLogger` | false    | A logger instance to use with the CommandFactory. Defaults to `false` to turn off the initialization logs.                                                                                    |
| errorHandler            | `Function`   | false    | A custom error handler that takes in an `Error` and returns `void` synchronously.                                                                                                             |
| usePlugins              | `boolean`    | false    | The choice of if the built CLI should look for a config file and plugins or not.                                                                                                              |
| cliName                 | `string`     | false    | The name of the CLI and the prefix for the config file to be looked for. Defaults to `"nest-commander"`.                                                                                      |
| enablePositionalOptions | `boolean`    | false    | Make commander view `<comamnd> -p <sub-command>` and `<command <sub-command> -p` as two different commands. [Commander's reference](https://github.com/tj/commander.js#parsing-configuration) |
| serviceErrorHandler     | `Function`   | false    | A custom error handler that takes in an `Error` and return `void`. This is to handle errors at the Nest service level rather than the command level like `errorHandler`                       |

### CommandRunner

The `CommandRunner` is abstract class to define your command. You define the command in the class
inherits it.

#### registerWithSubCommands

A static method that returns a list of the root command class, which calls this api, and all sub
command classes set via the metadata of the `@Command()` and `@SubCommand()` decorators in the scope
of module tree that the root command class traverses.

```typescript title="src/app.module.ts"
@Module({
  providers: [...RunCommand.regsiterWithSubCommands()]
})
export class AppModule {}
```

| Parameter | Type     | Required | Description                                                                                                                                                                            |
| --------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| meta      | `string` | false    | `@Command` or `@SubCommand` decorator identifier is explicitly specified for extracting metadata,<br/> It is used internal this library and you shouldn't need to specify it normally. |

### @RequestModule()

A wrapper decorator for Nest's `@Module()` that exposes a way to set a request object mock for the
`REQUEST` injection token.

```typescript
@RequestModule({
  providers: [SomeCommand],
  requestObject: { headers: { Authorization: 'Bearer token' } }
})
export class SomeCommandModule {}
```

| Parameter     | Type                            | Required | Description                                                       |
| ------------- | ------------------------------- | -------- | ----------------------------------------------------------------- |
| imports       | Array<ModuleImport>             | false    | Imports for the current module. This is Nest's standard property  |
| controllers   | Type<any>[]                     | false    | Controllers for the module                                        |
| providers     | Provider[]                      | false    | Providers for the module. This includes commands                  |
| exports       | Array<ModuleImport or Provider> | false    | Values the module exports                                         |
| requestObject | Object                          | false    | The mock request object that should be used in place of `REQUEST` |

## nest-commander-testing

### CommandTestFactory

#### createTestingCommand

Similar to `@nestjs/testing`'s `createTestingModule`, this static method sets up a
`TestingModuleBuilder` that can be used with Nest's `overrideProvider` and `compile` methods for
creating a `TestingModule`.

```typescript
CommandFactory.createTestingCommand(moduleMetadata: CommandModuleMetadata): TestingModuleBuilder
```

| Parameter      | Type                    | Required | Description                                                                                                                                                    |
| -------------- | ----------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| moduleMetadata | `CommandModuleMetadata` | true     | Nest's module metadata which **requires** `imports` to be populated. This will get passed down to `createTestingModule` to create the proper testing metadata. |

#### run

Similar to `CommandFactory.run` but to be used within a test instance.

```typescript
CommandTestFactory.run(app: TestingModule, args?: string[]): Promise<void>
```

| Parameter | Type            | Required | Description                                                                                                                                                |
| --------- | --------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app       | `TestingModule` | true     | The testing application that is to be used for the `CommandFactory`. This should be set up in your `beforeAll()` or right before calling the `run` method. |
| args      | `Array<string>` | false    | The name of the command to run, if not the default, and the options that would normally be passed, each as a separate array entry.                         |

#### setAnswers

A command to mock the gathering of information from a user, to help with automated testing.

```typescript
CommandFactory.setAnswers(value: any | any[]): void
```

| Parameter | Type                  | Required | Description                                                                                                                         |
| --------- | --------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| value     | `Array<any>` or `any` | true     | The answers that are to be returned from the user's input gathers in `InquirerService#ask`. These should be the post-parsed values. |

#### useDefaultInquirer

A method to sub back in the regular `Inquirer` instance instead of the mock used for testing. If
this is used, the `setAnswers` will have no effect, and `stdin` data must be passed manually

```typescript
CommandFactory.useDefaultInquirer(): typeof CommandTestFactory
```
