---
title: Installation
sidebar_label: Installation
---

So now you've got a fancy CLI application, and you've got it unit tested just fine, but you need to do e2e testing. How do you do it? With express there's supertest, and fastify has light-my-request with its `inject` framework, but how do you pass in CLI commands without spawning another shell? That's where the `nest-commander-testing` package comes in! It's built on top of Nest's own `@nestjs/testing` package, so the API should be very familiar. To install, simple use your favorite package manager and set the package as a `devDependency`

```shell
npm i -D nest-commander-testing
# OR
yarn add -D nest-commander-testing
# OR
pnpm i -D nest-commander-testing
```
