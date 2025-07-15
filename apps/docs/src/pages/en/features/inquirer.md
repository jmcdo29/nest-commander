---
title: Inquirer
layout: ../../../layouts/MainLayout.astro
---

So now you've got a great CLI application, but what happens when someone runs the command and
forgets to pass in a parameter? Well, right now it's going to throw an error back out and the
process will fail. But what if we want to stop the execution and ask the user for input instead of
failing outright? That's where the `InquirerService` comes in. With the `InquirerService` we're able
to define a set of questions to ask and get the inputs back, then continue on with the normal
execution.

:::info

If using the `InquirerService` make sure to install `@types/inquirer` as a `devDependency` to ensure
typescript doesn't encounter any type errors

:::

## Creating a QuestionSet

To `nest-commander` a `QuestionSet`, as it sounds, is a set of related questions that should all be
asked together. To create a question set, simply create a class and decorate it with the
`@QuestionSet()` decorator. Provide the decorator a name via the options as well, as this name will
be used by the `InquirerService` to know which question set to ask. Let's expand on the previous
task runner. Say now maybe the user forgets to pass in a command, but we still want to let them
define it at runtime. The first thing we need to do is change the `<task>` to `[task]` to make
Commander understand that the argument is optional, even though we know it's really not. After that
we need to define the question set and question(s) to ask the user. We'll call the question set
`task-questions` and define it as follows:

```typescript title="src/task.questions.ts"
@QuestionSet({ name: 'task-questions' })
export class TaskQuestions {
  @Question({
    message: 'What task would you like to execute?',
    name: 'task'
  })
  parseTask(val: string) {
    return val;
  }
}
```

Once again, each `@Question()`, just like each `@Option()`, is its own method to allow for custom
parsing of the value. You can use this in tandem with other decorators like `@ValidateFor()` to
allow for verifying the input is correct before returning back to the executing program. The `name`
of the question maps back to the property of the object returned by the `InquirerService`'s `ask`
command.

Now to make use of this question set, let's head back to our `TaskRunner` class and make some
modifications:

```typescript title="src/task.command.ts"
@Command({
  name: 'my-exec',
  arguments: '[task]',
  options: { isDefault: true }
})
export class TaskRunner extends CommandRunner {
  constructor(private readonly inquirer: InquirerService) {
    super();
  }
  async run(inputs: string[], options: Record<string, string>): Promise<void> {
    let task = inputs[0];
    if (!task) {
      task = (await this.inquirer.ask<{ task: string }>('task-questions', undefined)).task;
    }
    const echo = spawn(task, {
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

Now, so long as `TaskQuestions` is added to the `providers` array, the `InquirerService` will pull
the correct question set, ask the user, and return the results as an object. We could also add in a
question about which shell to use, but that will be left as is for now.

## Inquirer Decorators

This will be a brief overview of the decorators that exist for the `InquirerService` to make use of.
Most of these all follow the same format and have functionalities that, hopefully, can be derived
from their name. Every decorator takes in an object with a `name` property, which should match the
`name` in a `@Question()` decorator.

- `@ValidateFor()` validates the input for a named input. Say that in the above we didn't want to
  accept any numeric characters. The `@ValidateFor()` decorated method can return a boolean if the
  input is valid or not.
- `@TransformFor()` is a custom transformer on top of the method that already exists, in case you
  want to separate it out further
- `@WhenFor()` is a custom method that can determine if a question should be asked or not based on
  other inputs already gathered
- `@ChoicesFor()` returns the choices that should be available for a select question
- `@DefaultFor()` returns the default for the question, in the case of no input
- `@MessageFor()` returns the message for the question, instead of having it in the decorator. This
  is to allow for external services to act on the message itself.

:::info

If you need to ask a question dynamically, not something that can be set up with decorators, you can
access `inquirer` directly using `this.inquirerService.inquirer`.

:::

Visit the [api docs](../../api) to learn more about the `InquirerService`'s `ask` command and extra
decorators.
