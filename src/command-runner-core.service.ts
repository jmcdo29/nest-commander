import { Inject, OnModuleInit } from '@nestjs/common';
import { DiscoveredClassWithMeta, DiscoveryService } from '@golevelup/nestjs-discovery';
import { Command } from 'commander';
import {
  CommandMetadata,
  CommandRunner,
  OptionMetadata,
  RunnerMeta,
} from './command-runner.interface';
import { Commander, CommandMeta, OptionMeta } from './constants';

export class CommandRunnerCoreService implements OnModuleInit {
  private commandMap: Array<RunnerMeta>;
  constructor(
    private readonly discoveryService: DiscoveryService,
    @Inject(Commander) private readonly commander: Command,
  ) {
    this.commandMap = [];
    commander.exitOverride();
  }

  async onModuleInit() {
    const providers = await this.discoveryService.providersWithMetaAtKey<CommandMetadata>(
      CommandMeta,
    );
    await this.populateCommandMapInstances(providers);
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
    for (const command of this.commandMap) {
      const newCommand = this.commander.createCommand(command.command.nameAndArgs);
      // this.commander.command(command.command.nameAndArgs, command.command.options ?? undefined);
      newCommand.description(command.command.description ?? '');
      for (const option of command.params) {
        newCommand.option(
          option.meta.flags,
          option.meta.description ?? '',
          option.discoveredMethod.handler,
          option.meta.defaultValue ?? undefined,
        );
      }
      newCommand.action(() =>
        command.instance.run.call(command.instance, newCommand.args, newCommand.opts()),
      );
      this.commander.addCommand(newCommand, command.command.options);
    }
  }

  async run(): Promise<void> {
    await this.commander.parseAsync();
  }
}
