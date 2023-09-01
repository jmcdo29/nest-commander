---
title: CompletionFactory
layout: ../../../layouts/MainLayout.astro
---

So for now, we've got a CLI with all needed tools. Problem is - the end user
does not know what commands are available. We can fix that with the
`CompletionFactory`! This service has the ability to generate a completion
script for the end user to use, and will be generated dynamically based on the
commands and options available.

## Setup Your CompletionFactory

Your `main.ts` file:

```typescript
import { CommandFactory, CompletionFactory } from 'nest-commander';
import { AppModule } from './app.module';

const packageJson = require('../package.json');

(async () => {
  const app = await CommandFactory.createWithoutRunning(AppModule);

  const cliCommand = 'YOUR-CLI-COMMAND';
  const cliExecutable = 'YOUR-CLI-EXECUTABLE';

  CompletionFactory.registerCompletionCommand(app, cliCommand, cliExecutable);

  await CommandFactory.runApplication(app);
})();
```

## Generate Completion Script

Now, you can generate a dynamicly completion script for your CLI by running the
following command:

```bash
my-cli completion-script
```

<br>

**In order to load the completion script on shell startup**, you can add the
following to your `.bashrc` or `.zshrc` file:

```bash
echo "source <(my-cli completion-script)" >> ~/.bashrc
```

OR

```bash
echo "source <(my-cli completion-script)" >> ~/.zshrc
```

## Note

By using the `CompletionFactory`, your CLI creates 2 new commands:

- `completion-script` - Generates the completion script
- `completion` - Used by the shell to get the completion, triggered by tab

Please note that these commands does not exists in your CLI, and are only used
by the `CompletionFactory`.

## Supported Shells

- Bash
- ZSH
