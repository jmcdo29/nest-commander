import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveredClassWithMeta, DiscoveryService } from '@golevelup/nestjs-discovery';
import { CommandMeta, OptionMeta } from './constants';
import {
  CommandMetadata,
  CommandRunner,
  OptionMetadata,
  RunnerMeta,
} from './command-runner.interface';

@Injectable()
export class CommandRunnerCoreService implements OnModuleInit {
  private commandMap: Record<string, RunnerMeta>;
  constructor(private readonly discoveryService: DiscoveryService) {
    this.commandMap = {};
  }

  async onModuleInit() {
    const providers = await this.discoveryService.providersWithMetaAtKey<CommandMetadata>(
      CommandMeta,
    );
    this.verifyOnlyOneDefault(providers);
    await this.populateCommandMapInstances(providers);
  }

  private verifyOnlyOneDefault(providers: DiscoveredClassWithMeta<CommandMetadata>[]): void {
    const defaults = providers.filter((provider) => {
      return provider.meta.default;
    });
    if (defaults.length > 1) {
      throw new Error('Too many default commands');
    }
  }

  private async populateCommandMapInstances(
    providers: DiscoveredClassWithMeta<CommandMetadata>[],
  ): Promise<void> {
    for (const provider of providers) {
      this.commandMap[provider.meta.name || 'default'] = {
        instance: provider.discoveredClass.instance as CommandRunner,
        params: await this.discoveryService.providerMethodsWithMetaAtKey<OptionMetadata>(
          OptionMeta,
          (foundProvider) => foundProvider.name === provider.discoveredClass.name,
        ),
      };
    }
  }

  async run(...args: string[]): Promise<void> {
    const { params, remainingArgs: passed } = this.separateArgs(...args.splice(1));
    const parsedParams: Record<string, any> = {};
    const commandToRun = this.commandMap[args[0]];
    if (Object.getOwnPropertyNames(params).some((name) => name === '--help' || name === '-h')) {
      this.printHelp(commandToRun);
      return;
    }
    Object.keys(params).forEach((param) => {
      const handler = commandToRun.params.filter((parserHandler) =>
        parserHandler.meta.flags.includes(param),
      )[0];
      parsedParams[handler.meta.name] = handler.discoveredMethod.handler(params[param]);
    });
    await commandToRun.instance.run(passed, parsedParams);
  }

  private printHelp(commandToRun: RunnerMeta) {
    // implement help command
    console.log('help');
  }

  private separateArgs(
    ...args: string[]
  ): { params: Record<string, string>; remainingArgs: string[] } {
    let skipNext = false;
    const returnMap: Record<string, string> = {};
    const remaining = [];
    for (let i = 0; i < args.length; i++) {
      if (skipNext) {
        skipNext = false;
        continue;
      }
      if (args[i].includes('--')) {
        const [key, value] = args[i].split('=');
        returnMap[key] = value;
      } else if (args[i].includes('-')) {
        skipNext = true;
        returnMap[args[i]] = args[i + 1];
      } else {
        remaining.push(args[i]);
      }
    }
    return { params: returnMap, remainingArgs: remaining };
  }
}
