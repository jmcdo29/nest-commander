# NestJS Command

Have you been building amazing REST and RPC applications with [NestJS](https://docs.nestjs.com/)? Do you want that same structure for absolutely everything you're working with? Have you always wanted to build up some sweet CLI application but don't really know where to start? This is the solution. A package to bring building CLI applications to the Nest world with the same structure that you already know and love :heart:

## Installation

Before you get started, you'll need to install a few packages. First and foremost, this one: `nestjs-command` (name pending). You'll also need to install `@nestjs/common` and `@nestjs/core` as this package makes use of them under the hood, but doesn't want to tie you down to a specific version, yay peerDependencies!

```sh
npm i nestjs-command @nestjs/common @nestjs/core
# OR
yarn add nestjs-command @nestjs/common @nestjs/core
# OR
pnpm i nestjs-command @nestjs/common @nestjs/core
```

## A Command File

`nestjs-command` makes it easy to write new command line applications with [decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) via the `@Command()` decorator for classes and the `@Option()` decorator for methods of that class. Every command file _should_ implement the `CommandRunner` interface and _should_ be decorated with a `@Command()` decorator.

### CommandRunner

Every command is seen as an `@Injectable()` by Nest, so your normal Dependency Injection still works as you would expect it to (woohoo!). The only thing to take note of is the interface `CommandRunner`, which should be implemented by each command. The `CommandRunner` interface ensures that all commands have a `run` method that return a `Promise<void>` and takes in the parameters `string[], Record<string, any>`. The `run` command is where you can kick all of your logic off from, it will take in whatever parameters did not match option flags and pass them in as an array, just in case you are really meaning to work with multiple parameters. As for the options, the `Record<string, any>`, the names of these properties match the `name` property given to the `@Option()` decorators, while their value matches the return of the option handler. If you'd like better type safety, you are welcome to create an interface for your options as well. You can view how the [Basic Command test](test/basic.command.ts) manages that if interested.

### @Command()

The `@Command()` decorator is to define what CLI command the class is going to manage and take care of. The decorator takes in an object to define properties of the command. 

| property | type | required | description | 
| - | - | - | - |
| name | string | false | the name of the command |
| default | boolean | false | if this is the default command. Note: an application does not _have_ to have a default command, but it cannot have more than one default |
| description | string | false | the description of the command. This will be used by the `--help` or `-h` flags to have a formalized way of what to print out |

### @Option()

Often times you're not just running a single command with a single input, but rather you're running a command with multiple options and flags. Think of something like `git commit`: you can pass a `--amend` flag, a `-m` flag, or even `-a`, all of these change how the command runs. These flags are able to be set for each command using the `@Option()` decorator on a method for how that flag should be parsed. Do note that every command sent in via the command line is a raw string, so if you need to transform that string to a number or a boolean, or any other type, this handler is where it can be done. See the [putting it all together](#putting-it-all-together) for an example. The `@Option()` decorator, like the `@Command()` one, takes in an object of options defined in the table below

| property | type | required | description |
| - | - | - | - |
| name | string | true | the name that the flag/option should map out to. This is used to know how to pass the params to the `run` method of the `CommandHandler` |
| flags | string[] | true | the flags that map to the current handler. This is to allow for using multiple flags like `--string` or `-s` |
| required | boolean | false | a determinant if the flag is required for the command to run |
| description | string | false | the description of the option, used for when `command --help` or `command -h` is called to give more helpful output |

## Running the Command

Similar to how in a NestJS application we can use the `NestFactory` to create a server for us, and run it using `listen`, the `nestjs-command` package exposes a simple to use API to run your server. Import the `CommandFactory` and use the `static` method `run` and pass in the root module of your application. This would probably look like below

```ts
import { CommandFactory } from 'nestjs-command';
import { AppModule } from './app.module';

async function bootstrap() {
  await CommandFactory.run(AppModule);
}

bootstrap();
```

And that's it. Under the hood, `CommandFactory` will worry about calling `NestFactory` for you and calling `app.close()` when necessary, so you shouldn't need to worry about memory leaks there. If you need to add in some error handling, there's always `try/catch` wrapping the `run` command, or you can chain on some `.catch()` method to the `bootstrap()` call.

## Putting it All Together

So now you want to make a command. Let's make something similar to `npm`'s `install` command:

```ts

interface InstallOptions {
  dev: boolean;
  save: boolean;
  exact: boolean;
  optional: boolean;
  'no-save': boolean;
}

@Command({ name: 'install', default: false, description: 'Install packages via the npm registry' })
export class InstallCommand implements CommandRunner {

  async run(passedPackages: string[], options: InstallOptions): Promise<void> {
    // the implementation here will be left up to you, the important thing is to see how all of the decorators work together
  }

  private parseBooleanFromString(val: string): boolean {
    return JSON.parse(val);
  }

  @Option({
    name: 'dev',
    flags: ['--save-dev', '-D'],
    description: 'Save the packages to the devDependencies property of the package.json'
  })
  parseSaveDev(val: string): boolean {
    return this.parseBooleanFromString(val);
  }

  @Option({
    name: 'exact',
    flags: ['--save-exact'],
    description: 'Save the exact package version and do not allow it to change (i.e. do not add ^ or ~ to the package.json)'
  })
  parseSaveExact(val: string): boolean {
    return this.parseBooleanFromString(val);
  }

  // you can see how these all would be set up for the other flags as well
}
```

Now we add the `InstallCommand` to our `AppModule`'s `providers` array, like any other provider

```ts
@Module({
  providers: [InstallCommand],
})
export class AppModule {}
```

Set up our `main.ts`

```ts
async function bootstrap() {
  await CommandFactory.run(AppModule);
}
```

and set the `bin` property in your package.json so that on install you have the proper command name. Now with all of that you can test using `node dist/main -- install --save-dev=true` and see that indeed our `dev` property came in to the `run` method with the value of `true`.

## Enhancements

This is still a bit of a WIP, but the main idea is here. Currently the enhancements yet to come are

* default flag values
* wait for console input (like the Nest CLI or `npm init`)
* implement the `--help` and `-h` flags properly
* Allow for overriding the default `--help` and `-h` flags
* Allow multiple short flags together (i.e. -csf)