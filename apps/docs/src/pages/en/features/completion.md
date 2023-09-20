---
title: CompletionFactory
layout: ../../../layouts/MainLayout.astro
---

So for now, we've got a CLI with all the needed tools. The problem is - the end
user does not know what commands are available. We can fix that with the
`CompletionFactory`! This service has the ability to generate a completion
script for the end user to use, both for ZSH & Bash and Fig! The completion will
be generated dynamically based on the commands and options available.

## Setup Your Completion Using The CompletionFactory

Your `main.ts` file:

```typescript
import { CommandFactory, CompletionFactory } from 'nest-commander';
import { AppModule } from './app.module';

(async () => {
  const cliCommand = 'YOUR-CLI-COMMAND';
  const cliExecutable = 'YOUR-CLI-EXECUTABLE-PATH';

  const app = await CommandFactory.createWithoutRunning(AppModule, {
    completion: {
      cmd: cliCommand,
      fig: true,
      nativeShell: {
        executablePath: cliExecutable
      }
    }
  });

  // Could be done also by using the `registerCompletionCommand` method under `CompletionFactory`

  CompletionFactory.registerCompletionCommand(app, {
    cmd: cliCommand,
    fig: true,
    nativeShell: {
      executablePath: cliExecutable
    }
  });

  await CommandFactory.runApplication(app);
})();
```

<br>

## Generate Completion Script - ZSH & Bash

Now, you can dynamically generate a completion script for your CLI by running
the the following command:

```bash
my-cli completion-script
```

<hr>

Although, there is no need for that. The best convention will be to load this
script on shell startup:

**To load the completion script on shell startup**, you can use this command to
update your `.bashrc` or `.zshrc` file:

```bash
echo "source <(my-cli completion-script)" >> ~/.bashrc
```

OR

```bash
echo "source <(my-cli completion-script)" >> ~/.zshrc
```

In case zsh does not load the completion script, you can add the following
commands to your config file in order to enable completion:

```bash
autoload -Uz compinit
compinit
```

<br>

## Fig Completion integration

After setting up your `CompletionFactory`, you can generate a completion file
for Fig, and deploy it later. To do so, run the following command:

### Creates a `.fig` directory over your working directory

```bash
npx @withfig/autocomplete-tools init
npm --prefix ./.fig/autocomplete run create-spec <CLI_NAME>
```

### Generate a completion file

```bash
my-cli generate-fig-spec > ./.fig/autocomplete/src/<CLI_NAME>.ts
```

If created by running the CLI via an NPM script, check the output file and make
sure no execution logs exist.

### Build the completion file

```bash
npm --prefix ./.fig/autocomplete run build
```

<br>
<hr>
<br>

**In order to test it, you need to have the executable CLI file related to the
completion file you just created, in that way:**

```tree
.
├── .fig
│   └── autocomplete
│       ├── build
│       │   └── <CLI_NAME>.js
│       └── src
│           └── <CLI_NAME>.ts
└── <CLI_EXECUTABLE> - same name as <CLI_NAME>
```

Then, Fig will be available over your CLI by running:

```bash
./<CLI_NAME> <FIG AVAILABLE HERE!>
```

<br>

To publish your completion file, execute the following:

```bash
npm --prefix ./.fig/autocomplete run publish-spec
```

Now, you'll have Fig completion over your CLI globally! (can be accessed only by
you - unless you publish it to Fig's community).

You can also generate this completion file as a part of your build process, and
publish it along with your CLI, so your users will have it by default.

<br>

Read more about Fig completion:

[Private Autocomplete](https://fig.io/docs/guides/private-autocomplete)

[Autocomplete For Internal Tools](https://fig.io/docs/guides/autocomplete-for-internal-tools)

[Create Your CLI Spec](https://fig.io/docs/getting-started) &
[Upload Your CLI To Fig's Community](https://fig.io/docs/getting-started/contributing)

<br>

## Note

By using the `CompletionFactory`, your CLI might create 3 new commands:

- `completion-script` - Generates the completion script (ZSH & Bash)
- `completion` - Used by the shell to get the completion, triggered by tab (ZSH
  & Bash)
- `generate-fig-spec` - Generates a completion file (Fig)

Please note that these commands do not exist in your CLI, and are only used by
the `CompletionFactory`.

## Supported Shells

- Bash
- ZSH
