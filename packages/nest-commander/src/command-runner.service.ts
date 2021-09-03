import { Inject, OnModuleInit } from '@nestjs/common';
import { DiscoveredClassWithMeta, DiscoveryService } from '@golevelup/nestjs-discovery';
import { Command } from 'commander';
import {
  CommandMetadata,
  CommandRunner,
  OptionMetadata,
  RunnerMeta,
} from './command-runner.interface';
import { Commander, CommanderOptions, CommandMeta, OptionMeta } from './constants';
import { CommanderOptionsType } from './command-factory.interface';

export class CommandRunnerService implements OnModuleInit {
  private commandMap: Array<RunnerMeta>;
  constructor(
    private readonly discoveryService: DiscoveryService,
    @Inject(Commander) private readonly commander: Command,
    @Inject(CommanderOptions) options: CommanderOptionsType,
  ) {
    if (options.errorHandler) {
      commander.exitOverride(options.errorHandler);
    }
    this.commandMap = [];
  }

  async onModuleInit() {
    const providers = await this.discoveryService.providersWithMetaAtKey<CommandMetadata>(
      CommandMeta,
    );
    await this.populateCommandMapInstances(providers);
    this.setUpCommander();
  }

  private async populateCommandMapInstances(
    providers: DiscoveredClassWithMeta<CommandMetadata>[],
  ): Promise<void> {
    for (const provider of providers) {
      const optionProviders = await this.discoveryService.providerMethodsWithMetaAtKey<OptionMetadata>(
        OptionMeta,
        (found) => found.name === provider.discoveredClass.name,
      );
      this.commandMap.push({
        command: provider.meta,
        instance: provider.discoveredClass.instance as CommandRunner,
        params: optionProviders,
      });
    }
  }

  private setUpCommander(): void {
    for (const command of this.commandMap) {
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
      newCommand.action(() =>
        command.instance.run.call(command.instance, newCommand.args, newCommand.opts()),
      );
      this.commander.addCommand(newCommand, command.command.options);
    }
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
