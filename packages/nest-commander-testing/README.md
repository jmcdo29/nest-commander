# NestJS Commander Testing

So you;'ve built a CLI application, but you want to test it, and you want to be able to do your
usual NestJS DI mocking. Well, here's your solution :fireworks:

## Installation

Before you get started, you'll need to install a few packages. First and foremost, this one:
`nest-commander-testing` (name pending). You'll also need to install `@nestjs/testing` as this
package makes use of them under the hood, but doesn't want to tie you down to a specific version,
yay peerDependencies!

```sh
npm i nest-commander-testing @nestjs/testing
# OR
yarn add nest-commander-testing @nestjs/testing
# OR
pnpm i nest-commander-testing @nestjs/testing
```

## Testing With Mocks

So what's the use of writing a super awesome command line script if you can't test it super easily,
right? Fortunately, `nest-commander` has some utilities you can make use of that fits in perfectly
with the NestJS ecosystem, it'll feel right at home to any Nestlings out there. Instead of using the
`CommandFactory` for building the command in test mode, you can use `CommandTestFactory` and pass in
your metadata, very similarly to how `Test.createTestingModule` from `@nestjs/testing` works. In
fact, it uses this package under the hood. You're also still able to chain on the `overrideProvider`
methods before calling `compile()` so you can swap out DI pieces right in the test.
[A nice example of this can be seen in the basic.command.factory.spec.ts file](./../../integration/test/basic.command.factory.spec.ts).

## Testing Inquirer Questions

If you are making use of the `InquirerService`, you can use `CommandTestFactory.setAnswers` method
and pass either a single answer or multiple answers depending on how many answers you need to mock.
In doing so, a mock inquirer service will act similarly to inquirer without needing to modify
`process.stdin` or make use of any user input, allowing smooth testing in your CI pipelines. For an
example of this, please check the
[pizza command integration test](../../integration/pizza/test/pizza.command.spec.ts).
