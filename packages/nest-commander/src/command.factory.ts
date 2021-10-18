import { INestApplicationContext, LoggerService, Type } from '@nestjs/common';
import { DynamicModule, ModuleMetadata } from '@nestjs/common/interfaces';
import { NestFactory } from '@nestjs/core';
import { cosmiconfig } from 'cosmiconfig';
import {
  CommanderOptionsType,
  CommandFactoryRunOptions,
  DefinedCommandFactoryRunOptions,
  NestLogger,
} from './command-factory.interface';
import { CommandRootModule } from './command-root.module';
import { CommandRunnerModule } from './command-runner.module';
import { CommandRunnerService } from './command-runner.service';

export class CommandFactory {
  static async run(
    rootModule: Type<any>,
    optionsOrLogger?: CommandFactoryRunOptions | NestLogger,
  ): Promise<void> {
    const app = await this.runApplication(rootModule, optionsOrLogger);
    await app.close();
  }

  static async runWithoutClosing(
    rootModule: Type<any>,
    optionsOrLogger?: CommandFactoryRunOptions | NestLogger,
  ): Promise<INestApplicationContext> {
    return this.runApplication(rootModule, optionsOrLogger);
  }

  private static async runApplication(
    rootModule: Type<any>,
    optionsOrLogger: CommandFactoryRunOptions | NestLogger = false,
  ): Promise<INestApplicationContext> {
    const options = this.getOptions(optionsOrLogger);

    const imports: ModuleMetadata['imports'] = [rootModule];
    let pluginsAvailable = false;
    if (options.usePlugins) {
      pluginsAvailable = await this.registerPlugins(options.cliName, imports);
    }
    const commandRunnerModule = this.createCommandModule(imports, { ...options, pluginsAvailable });
    const app = await NestFactory.createApplicationContext(commandRunnerModule, {
      logger: options.logger,
    });
    const runner = app.get(CommandRunnerService);
    await runner.run();
    return app;
  }

  private static createCommandModule(
    imports: ModuleMetadata['imports'],
    options: CommanderOptionsType,
  ): DynamicModule {
    return CommandRunnerModule.forModule({ module: CommandRootModule, imports }, options);
  }

  private static getOptions(
    optionsOrLogger: CommandFactoryRunOptions | NestLogger,
  ): DefinedCommandFactoryRunOptions {
    let logger: NestLogger | undefined;
    let tempHandler: ((err: Error) => void) | undefined;
    let usePlugins = false;
    let cliName = 'nest-commander';
    if (this.isFactoryOptionsObject(optionsOrLogger)) {
      ({
        logger,
        errorHandler: tempHandler,
        cliName = cliName,
        usePlugins = usePlugins,
      } = optionsOrLogger);
    } else {
      logger = optionsOrLogger;
    }
    return { logger, errorHandler: tempHandler, usePlugins, cliName };
  }

  private static isFactoryOptionsObject(
    loggerOrOptions: CommandFactoryRunOptions | NestLogger,
  ): loggerOrOptions is CommandFactoryRunOptions {
    return !(
      Array.isArray(loggerOrOptions) ||
      loggerOrOptions === false ||
      !!(loggerOrOptions as LoggerService).log
    );
  }

  private static async registerPlugins(
    cliName: string,
    imports: ModuleMetadata['imports'],
  ): Promise<boolean> {
    const pluginExplorer = cosmiconfig(cliName, {
      searchPlaces: [
        `.${cliName}rc`,
        `.${cliName}rc.json`,
        `.${cliName}rc.yaml`,
        `.${cliName}rc.yml`,
        `${cliName}.json`,
        `${cliName}.yaml`,
        `${cliName}.yml`,
      ],
    });
    const pluginConfig = await pluginExplorer.search();
    if (!pluginConfig) {
      return false;
    }
    for (const pluginPath of pluginConfig?.config.plugins ?? []) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      let finalPath = '';
      pluginPath.includes('/')
        ? finalPath = require.resolve(pluginPath, { paths: [process.cwd()] })
        : finalPath = require.resolve(
          `../node_modules/${pluginPath}`,
          { paths: [process.cwd()] }
        )
      const plugin = require(finalPath);
      imports?.push(plugin.default);
    }
    return true;
  }
}
