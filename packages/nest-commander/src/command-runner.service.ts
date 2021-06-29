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
      command.command.arguments && newCommand.argument(command.command.arguments);
      newCommand.description(
        command.command.description ?? '',
        command.command.argsDescription ?? {},
      );
      for (const option of command.params) {
        newCommand.option(
          option.meta.flags,
          option.meta.description ?? '',
          option.discoveredMethod.handler.bind(command.instance),
          option.meta.defaultValue ?? undefined,
        );
      }
      newCommand.action(() =>
        command.instance.run.call(command.instance, newCommand.args, newCommand.opts()),
      );
      this.commander.addCommand(newCommand, command.command.options);
    }
  }

  async run(args?: string[]): Promise<void> {
    await this.commander.parseAsync(args || process.argv);
  }
}
