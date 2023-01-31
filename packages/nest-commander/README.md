# NestJS Commander

Have you been building amazing REST and RPC applications with [NestJS](https://docs.nestjs.com/)? Do
you want that same structure for absolutely everything you're working with? Have you always wanted
to build up some sweet CLI application but don't really know where to start? This is the solution. A
package to bring building CLI applications to the Nest world with the same structure that you
already know and love :heart: Built on top of the popular
[Commander](https://github.com/tj/commander.js) package.

## Installation

Before you get started, you'll need to install a few packages. First and foremost, this one:
`nest-commander` (name pending). You'll also need to install `@nestjs/common` and `@nestjs/core` as
this package makes use of them under the hood, but doesn't want to tie you down to a specific
version, yay peerDependencies!

```sh
npm i nest-commander @nestjs/common @nestjs/core
# OR
yarn add nest-commander @nestjs/common @nestjs/core
# OR
pnpm i nest-commander @nestjs/common @nestjs/core
```

## A Command File

`nest-commander` makes it easy to write new command line applications with
[decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) via the `@Command()`
decorator for classes and the `@Option()` decorator for methods of that class. Every command file
_should_ implement the `CommandRunner` interface and _should_ be decorated with a `@Command()`
decorator.

### CommandRunner

Every command is seen as an `@Injectable()` by Nest, so your normal Dependency Injection still works
as you would expect it to (woohoo!). The only thing to take note of is the interface
`CommandRunner`, which should be implemented by each command. The `CommandRunner` interface ensures
that all commands have a `run` method that return a `Promise<void>` and takes in the parameters
`string[], Record<string, any>`. The `run` command is where you can kick all of your logic off from,
it will take in whatever parameters did not match option flags and pass them in as an array, just in
case you are really meaning to work with multiple parameters. As for the options, the
`Record<string, any>`, the names of these properties match the `name` property given to the
`@Option()` decorators, while their value matches the return of the option handler. If you'd like
better type safety, you are welcome to create an interface for your options as well. You can view
how the [Basic Command test](test/basic.command.ts) manages that if interested.

### @Command()

The `@Command()` decorator is to define what CLI command the class is going to manage and take care
of. The decorator takes in an object to define properties of the command. The options passed here
would be the same as the options passed to a new `command` for Commander

| property        | type                   | required | description                                                                                                                             |
| --------------- | ---------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| name            | string                 | true     | the name of the command                                                                                                                 |
| arguments       | string                 | false    | Named arguments for the command to work with. These can be required `<>` or optional `[]`, but do not map to an option like a flag does |
| description     | string                 | false    | the description of the command. This will be used by the `--help` or `-h` flags to have a formalized way of what to print out           |
| argsDescription | Record<string, string> | false    | An object containing the description of each argument. This will be used by `-h` or `--help`                                            |
| Options         | CommandOptions         | false    | Extra options to pass on down to commander                                                                                              |

For mor information on the `@Command()` and `@Option()` parameters, check out the
[Commander docs](https://github.com/tj/commander.js).

### @Option()

Often times you're not just running a single command with a single input, but rather you're running
a command with multiple options and flags. Think of something like `git commit`: you can pass a
`--amend` flag, a `-m` flag, or even `-a`, all of these change how the command runs. These flags are
able to be set for each command using the `@Option()` decorator on a method for how that flag should
be parsed. Do note that every command sent in via the command line is a raw string, so if you need
to transform that string to a number or a boolean, or any other type, this handler is where it can
be done. See the [putting it all together](#putting-it-all-together) for an example. The `@Option()`
decorator, like the `@Command()` one, takes in an object of options defined in the table below

| property     | type              | required | description                                                                                                         |
| ------------ | ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| flags        | string            | true     | a string that represents the option's incoming flag and if the option is required (using <>) or optional (using []) |
| description  | string            | false    | the description of the option, used if adding a `--help` flag                                                       |
| defaultValue | string or boolean | false    | the default value for the flag                                                                                      |

Under the hood, the method that the`@Option()` is decorating is the custom parser passed to
commander for how the value should be parsed. This means if you want to parse a boolean value, the
best way to do so would be to use `JSON.parse(val)` as `Boolean('false')` actually returns `true`
instead of the expected `false`.

### Inquirer Integration

nest-commander also can integrate with [`inquirer`](https://www.npmjs.com/package/inquirer) to allow
for user input during your CLI run. I tried to keep this integration as smooth as possible, but
there are some caveats to watch for:

1. Whatever inputs you want to handle via inquirer, must be omitted from commander if you don't want
   them passed in at all, or they must be optional if you want them to be passable from the command
   line. If you use a required option and it is not passed from the command line, commander will
   fail the CLI call.
2. Inquirer plugins are not yet supported. I do have an idea for this, but they are out of scope for
   the initial integration.
3. You, as the developer, have options on how to set up the inquirer integration. The details will
   come later, but know that you are given power here. Use it wisely.

### QuestionSet

A class decorated with `@QuestionSet()` is a class that represents a related set of questions.
Looking at inquirer's own examples, this could be like the
[pizza example](https://github.com/SBoudrias/Inquirer.js/blob/master/packages/inquirer/examples/pizza.js).
There's nothing too special about this decorator, all it does is allow the underlying engine to find
the appropriate question set when it is needed. The `@QuestionSet()` decorator takes an object of
options defined below

| property | type   | required | description                                                                       |
| -------- | ------ | -------- | --------------------------------------------------------------------------------- |
| name     | string | true     | The name that will be used by the `InquirerService` when getting a prompt to run. |

### Question

Here's where the options start to open up. Each `@Question()` should decorate a class method. This
method will essentially become the `filter` property for `inquirer`. If you don't need any filtering
done, simply return the value that comes into the method. All of the other properties come from, and
adhere to the types of, [`Inquirer`](https://www.npmjs.com/package/inquirer) and their documentation
can better illustrate what values are needed when and where.

#### Question Functional Properties

With Inquirer, several of the properties can have functions instead of simple types. For these
properties, you can do one of two things: 1) pass the function to the decorator or 2) use the
`@*For()`^ decorator. Each `@*For()` decorator takes in an object similar to the `@Question()`
decorator as described below

| property | type   | required | description                                                                            |
| -------- | ------ | -------- | -------------------------------------------------------------------------------------- |
| name     | string | true     | The name that will be used to determine which `@Question()` this decorator belongs to. |

##### Passing to the `@Question()` decorator

Below is an example of using the `validate` method in the `@Question()` decorator

```ts
@Question({
  type: 'input',
  name: 'phone',
  message: "What's your phone number?",
  validate: function(value: string) {
    const pass = value.match(
      /^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i,
    );
    if (pass) {
      return true;
    }
    return 'Please enter a valid phone number';
  }
})
parsePhone(val: string) {
  return val;
}
```

##### Using the `@*For()` decorator

Below is an example of a `@Question()` and `@ValidateFor()` decorator in use

```ts
@Question({
  type: 'input',
  name: 'phone',
  message: "What's your phone number?",
})
parsePhone(val: string) {
  return val;
}

@ValidateFor({ name: 'phone' })
validatePhone(value: string) {
  const pass = value.match(
    /^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i,
  );
  if (pass) {
    return true;
  }

  return 'Please enter a valid phone number';
}
```

As you can see, the `name` of both `@Question()` and `@ValidateFor()` align, allowing the underlying
engine to properly map the `validatePhone` method to the `phone`'s property set.

^ Please note that `@*For()` is shorthand for `@ValidateFor()`, `@ChoicesFor()`, `@MessageFor()`,
`@DefaultFor()`, and `@WhenFor()`.

### InquirerService

The `InquirerService` is an injectable provider that allows you to call inquirer for a specific set
of questions (named with `@QuestionSet()`). When calling the question set, you can pass in the
already obtained options as well, and inquirer will skip over the options that are already answered,
unless the `askAnswered` property is set to `true` as mentioned in their docs. You can use either
`InquirerService#ask` or `InquirerService#prompt`, as they are aliases for each other. The return
from the `InquirerService#prompt` method is the non-partial variant of the options passed in; in
other words, the return is the answers that the user provided, mapping appropriately in the cases
where necessary, such as lists. For an example usage, please check the
[pizza integration test](../../integration/pizza/src/pizza.command.ts).

## Running the Command

Similar to how in a NestJS application we can use the `NestFactory` to create a server for us, and
run it using `listen`, the `nest-commander` package exposes a simple to use API to run your server.
Import the `CommandFactory` and use the `static` method `run` and pass in the root module of your
application. This would probably look like below

```ts
import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

async function bootstrap() {
  await CommandFactory.run(AppModule);
}

bootstrap();
```

And that's it. Under the hood, `CommandFactory` will worry about calling `NestFactory` for you and
calling `app.close()` when necessary, so you shouldn't need to worry about memory leaks there. If
you need to add in some error handling, there's always `try/catch` wrapping the `run` command, or
you can chain on some `.catch()` method to the `bootstrap()` call.

## Error Handling

By default, `nest-commander` does not add in any error handling, other that the default that
`commander` itself does. If you would like to use commander's `exitOverride` you can pass an
`errorHandler` property to the `options` object of the `CommandFactory.run` method. This error
handler should take in an error object, and return void.

```ts
import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

async function bootstrap() {
  await CommandFactory.run(AppModule, {
    errorHandler: (err) => {
      console.error(err);
      process.exit(1); // this could also be a 0 depending on how you want to handle the exit code
    }
  });
}

bootstrap();
```

## Testing

There is a testing helper package called
[`nest-commander-testing`](./../nest-commander-testing/README.md) that works very similarly to
`@nestjs/testing`. Check out it's documentation and examples for help.

## Putting it All Together

The following class would equate to having a CLI command that can take in the subcommand `basic` or
be called directly, with `-n`, `-s`, and `-b` (along with their long flags) all being supported and
with custom parsers for each option. The `--help` flag is also supported, as is customary with
commander.

```ts
import { Command, CommandRunner, Option } from 'nest-commander';
import { LogService } from './log.service';

interface BasicCommandOptions {
  string?: string;
  boolean?: boolean;
  number?: number;
}

@Command({ name: 'basic', description: 'A parameter parse' })
export class BasicCommand implements CommandRunner {
  constructor(private readonly logService: LogService) {}

  async run(passedParam: string[], options?: BasicCommandOptions): Promise<void> {
    if (options?.boolean !== undefined && options?.boolean !== null) {
      this.runWithBoolean(passedParam, options.boolean);
    } else if (options?.number) {
      this.runWithNumber(passedParam, options.number);
    } else if (options?.string) {
      this.runWithString(passedParam, options.string);
    } else {
      this.runWithNone(passedParam);
    }
  }

  @Option({
    flags: '-n, --number [number]',
    description: 'A basic number parser'
  })
  parseNumber(val: string): number {
    return Number(val);
  }

  @Option({
    flags: '-s, --string [string]',
    description: 'A string return'
  })
  parseString(val: string): string {
    return val;
  }

  @Option({
    flags: '-b, --boolean [boolean]',
    description: 'A boolean parser'
  })
  parseBoolean(val: string): boolean {
    return JSON.parse(val);
  }

  runWithString(param: string[], option: string): void {
    this.logService.log({ param, string: option });
  }

  runWithNumber(param: string[], option: number): void {
    this.logService.log({ param, number: option });
  }

  runWithBoolean(param: string[], option: boolean): void {
    this.logService.log({ param, boolean: option });
  }

  runWithNone(param: string[]): void {
    this.logService.log({ param });
  }
}
```

Make sure the command class is added to a module

```ts
@Module({
  providers: [LogService, BasicCommand]
})
export class AppModule {}
```

And now to be able to run the CLI in your main.ts you can do the following

```ts
async function bootstrap() {
  await CommandFactory.run(AppModule);
}

bootstrap();
```

And just like that, you've got a command line application. All that's left is to run your build
command (usually `nest build`) and run start like normal (`node dist/main`). If you're looking to
package the command line app for other devs consumption (making somethng like the `@nestjs/cli` or
`jest`), then you can add the `bin` property to the `package.json` and map the command
appropriately.
