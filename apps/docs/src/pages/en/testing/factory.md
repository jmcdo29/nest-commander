---
title: CommandTestFactory
layout: ../../../layouts/MainLayout.astro
---

To get started with the `CommandTestFactory` you need to make use of the `createTestingCommand`, similar to `TestingModule`'s `createTestingModule`. This command can take in general module metadata, including providers, but generally it's pretty easy to just take in the related module and use `overrideProvider` for mocking whatever providers are necessary to mock.

## Mocking Commands

Normally when running a CLI you'd do something like `<cli-name> <command-name> <argument> [options]`, right, something like `crun run 'echo Hello World!'`, but that's harder to do in a testing environment. With our `CommandTestFactory` instead, we can do something like the following:

```typescript title="test/task.command.spec.ts"
describe('Task Command', () => {
  let commandInstance: TestingModule;

  beforeAll(async () => {
    commandInstance = await CommandTestFactory.createTestingCommand({
      imports: [AppModule]
    }).compile();
  });

  it('should call the "run" method', async () => {
    const spawnSpy = jest.spyOn(childProcess, 'spawn');
    await CommandTestFactory.run(commandInstance, [
      'run',
      'echo Hello World!'
    ]);
    expect(spawnSpy).toBeCalledWith([
      'echo Hello World!',
      { shell: os.userInfo().shell }
    ]);
  });
});
```

:::tip

`TestingModule` is imported from `@nestjs/testing` package.

:::

Aside from the Jest spies that we're using, you'll notice that we use the `CommandTestFactory` to set up a `TestingModule` and use it to run a test command. We pass the `run` command here to match our `@Command()` we already created, but because `run` is the default command, it can be omitted. Then we pass in our arguments as the next array value, and any flags would be array values after it. All of this gets passed on to the commander instance and is processed as usual.

## Mocking User Input

Now this is great and all, but we also need to be able to mock user inputs, as we allow the `InquirerService` to take in responses to questions. For this, we can use `CommandTestFactory.setAnswers()`. We can pass an array of answers to the `setAnswers` method to mock the input gained from the user.

```typescript title="test/task.command.spec.ts"
describe('Task Command', () => {
  let commandInstance: TestingModule;

  beforeAll(async () => {
    commandInstance = await CommandTestFactory.createTestingCommand({
      imports: [AppModule]
    }).compile();
  });

  it('should call the "run" method', async () => {
    CommandTestFactory.setAnswers(['echo Hello World!']);
    const spawnSpy = jest.spyOn(childProcess, 'spawn');
    await CommandTestFactory.run(commandInstance, ['run']);
    expect(spawnSpy).toBeCalledWith([
      'echo Hello World!',
      { shell: os.userInfo().shell }
    ]);
  });
});
```

:::tip

The answers passed in will be what are passed back from the `InquirerService`'s `ask` method, so make sure to have already transformed the input as the `InquirerService` would.

:::
