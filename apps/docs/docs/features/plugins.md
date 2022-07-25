---
title: Plugins
sidebar_label: Plugins
---

As of version 2.3.0, you can build your CLI with the ability to read for extra plugins that are developed by other people. By using the `usePlugins` option with the `CommandFactory`, you'll be setting up you shiny new CLI to expect to find a config file with a `plugins` property that is an array of strings, either as the locations of packages in a local environment, or npm package names.

## The Config File

The config file, by default, can be _one_ of the following:

- `.nest-commanderrc`
- `.nest-commanderrc.json`
- `.nest-commanderrc.yaml`
- `.nest-commanderc.yml`
- `nest-commander.json`
- `nest-commander.yaml`
- `nest-commander.yml`

If you'd lke to use a name other than `nest-commander`, you can pass the `cliName` option to the `CommandFactory` as well.

Now the config file should be incredibly simple, just a JSON object with a `plugins` property that is an array of strings, e.g.

```json
{
  "plugins": ["nest-commander-plugin", "./my/local/plugin"]
}
```

## The Plugins

Each plugin registered needs to have a **default** export that is a Nest module that adds the new command as a `provider`.

```ts title=src/plugin.command.ts
@Command({ name: 'plugin' })
export class PluginCommand extends CommandRunner {
  async run() {
    console.log('From the plugin!');
  }
}
```

```ts title=src/plugin.module.ts
@Module({
  providers: [PluginCommand]
})
export class PluginModule {}
```

```ts title=src/index.ts
import { PluginModule } from './plugin.module';
export default PluginModule;
```

:::info

If the command you've built uses `usePlugins: true` and a config file is not found, commander will still be allowed to try and execute the command given. If an error ends up being thrown, such as a command not found error, then the user of the CLI will get a warning about a possible config file missing, along with commander's standard help message.

:::
