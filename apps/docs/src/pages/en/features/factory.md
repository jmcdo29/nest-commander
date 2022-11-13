---
title: CommandFactory
layout: ../../../layouts/MainLayout.astro
---

Okay, so you've got this fancy command set up, it takes in some user input, and is ready to go, but how do you start the CLI application? Well, just like in a Nest application where you can use `NestFactory.create()`, `nest-commander` comes with it's own `CommandFactory.run()` method. So let's wire everything up, set up the `main.ts` and see how this all works together.

## Registering Your Commands and Questions

You may have noticed in the [Inquirer](./inquirer.md) section a quick mention of adding the question set class to the `providers`. In fact, both command classes and question set classes are nothing more than specialized providers! Due to this, we can simply add these classes to a module's metadata and make sure that module is in the root module the `CommandFactory` uses.

```typescript title="src/app.module.ts"
@Module({
  providers: [TaskRunner, TaskQuestions]
})
export class AppModule {}
```

Do note that these providers do not need to be in the root module, nor do they need to be added to the `exports` array, unless they are injected elsewhere. Now with the `AppModule` set up, we can create the `main.ts` with the `CommandFactory`.

```typescript title="src/main.ts"
const bootstrap = async () => {
  await CommandFactory.run(AppModule);
};

bootstrap();
```

And just like that, the command is hooked up and will run. You can use `typescript`, the NestJS CLI, or `ts-node` to compile and run the `dist/main.js` file (or `src/main.ts` in the case of `ts-node`). For a more in depth explanation on how to run the newly created commands, it is encouraged you check out the `Execution` portion of the docs.

## Logging

By default, the `CommandFactory` turns **off** the Nest logger, due to the noise that the Nest logs create on startup with all of the modules and dependencies being resolved. If you'd like to turn logging back on, simple pass a valid logger configuration to the `CommandFactory` as a second parameter (e.g.: `new Logger()` from `@nestjs/common`).

## Error Handling

By default, there is no error handler for commander provided by `nest-commander`. If there's a problem, it will fall back to commander's default functionality, which is to print the help information. If you want to provide your own handler though, simply pass an object with the `errorHandler` property that is a function taking in an `error` and returning `void`.

## Indefinite Running

The `CommandFactory` also allows you to set up an infinite runner, so that you can set up file watchers or similar. All you need to do is instead of using `run` use `runWithoutClosing`. All other options are the same.

For more information on the `CommandFactory`, please refer to the [API docs](../api.md#commandfactory).
