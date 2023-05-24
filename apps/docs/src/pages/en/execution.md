---
title: Execution and Publishinig
layout: ../../layouts/MainLayout.astro
---

## Before Running

To execute the command locally, whether for testing, prototyping, or just every day use without a
package install, you first need to build the application from the Typescript code to JavaScript so
that the `node` processor can handle the code properly. You can use any method of compilation you
find preferable, Typescript's `tsc`, `@nestjs/cli`'s `build`,
[`esbuild`](https://esbuild.github.io/), [`swc`](https://esbuild.github.io/), `webpack`. Just make
sure that the compiler understands and can handle decorators, and the output code is transpiled
correctly.

:::info

You do not need to compile the code if you use `ts-node`, but make sure that decorators are still
taken into account.

:::

## Local Execution (Using Node)

Once the code is compiled, you can use `node` to kick of the command using

```shell
node ./dist/main [args] [options]
```

This does make use of the packages locally installed in the `node_modules`, but other than that
there's nothing fancy necessary.

### Local Execution (Without Node explicitly)

You can also add a [shebang](<https://en.wikipedia.org/wiki/Shebang_(Unix)>) to the top of your
`main.ts` and make the file executable by using [chmod](https://en.wikipedia.org/wiki/Chmod), then
just use

```shell
./dist/main [args] [options]
```

but this generally is not necessary to do.

## Nest CLI

You can also use the Nest CLI to build and start the command.  You can pass any arguments after `--`

```shell
nest start --watch -- [args]
```

## Ts-Node

If you don't feel like compiling the application every time you make a small change, or don't want
to set up a file watcher to watch for you, you can use
[`ts-node`](https://github.com/TypeStrong/ts-node) to start up the command. Just like with the
`node` variants, you just need to pass the main path to the command.

```shell
ts-node src/main.ts [args] [options]
# OR is ts-node is not installed globally
npx|yarn|pnpm ts-node src/main.ts [args] [options]
```

## Packaging the CLI

The last option, and probably the most useful one, is using a package manager to distribute the CLI
via an npm package. You can add a `bin` property to the `package.json` and give your CLI a name
along with a path to the main file and on installation npm will set up the path in the
`node_modules/.bin` if a local install or `$(npm prefix -g)/bin` for a global package install.

Important note from npmjs documentation ([link](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#bin)):
>Please make sure that your file(s) referenced in bin starts with #!/usr/bin/env node, otherwise the scripts are started without the node executable!

If we take the `crun` application we've made so far, we can set up the `package.json` like so:

```json
{
  "name": "crun",
  "description": "A command line runner using nest-commander",
  "bin": {
    "crun": "dist/main.js"
  },
  "scripts": {
    "build": "nest build"
  },
  "dependencies": {
    "@nestjs/common": "^7.0.0",
    "@nestjs/core": "^7.0.0",
    "nest-commander": "^1.2.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^7.0.0",
    "@nestjs/schematics": "^7.0.0",
    "@nestjs/testing": "^7.0.0",
    "jest": "^26.0.0",
    "nest-commander-schematics": "^1.1.0",
    "nest-commander-testing": "^1.1.0",
    "typescript": "^4.3.0"
  }
}
```

Now if we were to publish this package and someone were to install it, the `crun` command would be
available either globally via a global install, so `crun` could be used on the command line
directly, or locally via a local install, so `crun` could be used in a `package.json` script or
using `npx/yarn/pnpm`.
