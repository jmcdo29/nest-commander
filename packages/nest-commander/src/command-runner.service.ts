import { Inject, OnModuleInit } from '@nestjs/common';
import { DiscoveredClassWithMeta, DiscoveryService } from '@golevelup/nestjs-discovery';
import { Command } from 'commander';
import { CommanderOptionsType } from './command-factory.interface';
import {
  CommandMetadata,
  CommandRunner,
  HelpOptions,
  OptionMetadata,
  RunnerMeta,
} from './command-runner.interface';
import {
  cliPluginError,
  Commander,
  CommanderOptions,
  CommandMeta,
  HelpMeta,
  OptionMeta,
  SubCommandMeta,
} from './constants';

export class CommandRunnerService implements OnModuleInit {
  private subCommands?: DiscoveredClassWithMeta<CommandMetadata>[];

  constructor(
    private readonly discoveryService: DiscoveryService,
    @Inject(Commander) private readonly commander: Command,
    @Inject(CommanderOptions) private readonly options: CommanderOptionsType,
  ) {}

  async onModuleInit() {
    const providers = await this.discoveryService.providersWithMetaAtKey<CommandMetadata>(
      CommandMeta,
    );
    const commands = await this.populateCommandMapInstances(providers);
    await this.setUpCommander(commands);

    if (this.options.usePlugins) {
      this.commander.showHelpAfterError(`
${this.commander.helpInformation()}
${cliPluginError(this.options.cliName ?? 'nest-commander', this.options.pluginsAvailable)}`);
    }
    if (this.options.errorHandler) {
      this.commander.exitOverride(this.options.errorHandler);
    }
  }

  private async populateCommandMapInstances(
    providers: DiscoveredClassWithMeta<CommandMetadata>[],
  ): Promise<RunnerMeta[]> {
    const commands: RunnerMeta[] = [];
    for (const provider of providers) {
      const optionProviders =
        await this.discoveryService.providerMethodsWithMetaAtKey<OptionMetadata>(
          OptionMeta,
          (found) => found.name === provider.discoveredClass.name,
        );
      const helpProviders = await this.discoveryService.providerMethodsWithMetaAtKey<HelpOptions>(
        HelpMeta,
        (found) => found.name === provider.discoveredClass.name,
      );
      commands.push({
        command: provider.meta,
        instance: provider.discoveredClass.instance as CommandRunner,
        params: optionProviders,
        help: helpProviders,
      });
    }
    return commands;
  }

  private async setUpCommander(commands: RunnerMeta[]): Promise<void> {
    for (const command of commands) {
      const newCommand = await this.buildCommand(command);
      this.commander.addCommand(newCommand, command.command.options);
    }
  }

  private async buildCommand(command: RunnerMeta): Promise<Command> {
    const newCommand = this.commander.createCommand(command.command.name);
    if (command.command.arguments) {
      this.mapArgumentDescriptions(
        newCommand,
        command.command.arguments,
        command.command.argsDescription,
      );
    }
    newCommand.description(command.command.description ?? '');
    for (const option of command.params) {
      const { flags, description, defaultValue = undefined, required = false } = option.meta;
      const handler = option.discoveredMethod.handler.bind(command.instance);
      const optionsMethod: 'option' | 'requiredOption' = required ? 'requiredOption' : 'option';
      newCommand[optionsMethod](flags, description ?? '', handler, defaultValue ?? undefined);
    }
    for (const help of command.help ?? []) {
      newCommand.addHelpText(help.meta, help.discoveredMethod.handler.bind(command.instance));
    }
    newCommand.action(() =>
      command.instance.run.call(command.instance, newCommand.args, newCommand.opts()),
    );
    if (command.command.subCommands?.length) {
      this.subCommands ??= await this.discoveryService.providersWithMetaAtKey<CommandMetadata>(
        SubCommandMeta,
      );
      const subCommandsMetaForCommand = this.subCommands.filter((subMeta) =>
        command.command.subCommands
          ?.map((subCommand) => subCommand.name)
          .includes(subMeta.discoveredClass.name),
      );
      const subCommands = await this.populateCommandMapInstances(subCommandsMetaForCommand);
      for (const subCommand of subCommands) {
        newCommand.addCommand(await this.buildCommand(subCommand));
      }
    }
    return newCommand;
  }

  private mapArgumentDescriptions(
    command: Command,
    args = '',
    argDescriptions: Record<string, string> = {},
  ): void {
    const trueArgDefs: Record<string, string> = {};

    const splitArgs = args.split(' ');
    for (const arg of splitArgs) {
      let added = false;
      for (const key of Object.keys(argDescriptions)) {
        if (arg.includes(key)) {
          added = true;
          trueArgDefs[arg] = argDescriptions[key];
        }
      }
      command.argument(arg, added ? trueArgDefs[arg] : '');
    }
  }

  async run(args?: string[]): Promise<void> {
    await this.commander.parseAsync(args || process.argv);
  }
}
