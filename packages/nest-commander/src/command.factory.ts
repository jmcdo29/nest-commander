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
import { CompletionFactory } from './completion.factory';

export class CommandFactory {
  static async run(
    rootModule: Type<any>,
    optionsOrLogger?: CommandFactoryRunOptions | NestLogger,
  ): Promise<void> {
    const app = await this.createWithoutRunning(rootModule, optionsOrLogger);
    try {
      await this.runApplication(app);
    } finally {
      await app.close();
    }
  }

  static async runWithoutClosing(
    rootModule: Type<any>,
    optionsOrLogger?: CommandFactoryRunOptions | NestLogger,
  ): Promise<INestApplicationContext> {
    const app = await this.createWithoutRunning(rootModule, optionsOrLogger);
    await this.runApplication(app);
    return app;
  }

  static async createWithoutRunning(
    rootModule: Type<any>,
    optionsOrLogger: CommandFactoryRunOptions | NestLogger = false,
  ): Promise<INestApplicationContext> {
    const options = this.getOptions(optionsOrLogger);

    const imports: ModuleMetadata['imports'] = [rootModule];
    let pluginsAvailable = false;
    if (options.usePlugins) {
      pluginsAvailable = await this.registerPlugins(options.cliName, imports);
    }
    const commandRunnerModule = this.createCommandModule(imports, {
      ...options,
      pluginsAvailable,
    });
    const app = await NestFactory.createApplicationContext(
      commandRunnerModule,
      options,
    );

    if (options.completion) {
      CompletionFactory.registerCompletionCommand(app, options.completion);
    }

    return app;
  }

  static async runApplication(
    app: INestApplicationContext,
  ): Promise<INestApplicationContext> {
    const runner = app.get(CommandRunnerService);
    await runner.run();
    return app;
  }

  protected static createCommandModule(
    imports: ModuleMetadata['imports'],
    options: CommanderOptionsType,
  ): DynamicModule {
    return CommandRunnerModule.forModule(
      { module: CommandRootModule, imports },
      options,
    );
  }

  protected static getOptions(
    optionsOrLogger: CommandFactoryRunOptions | NestLogger,
  ): DefinedCommandFactoryRunOptions {
    let options: CommandFactoryRunOptions = {};
    const isOptionsIsFactoryOptionsObject =
      this.isFactoryOptionsObject(optionsOrLogger);
    options = isOptionsIsFactoryOptionsObject ? optionsOrLogger : options;

    options.logger =
      (isOptionsIsFactoryOptionsObject
        ? (optionsOrLogger as CommandFactoryRunOptions).logger
        : (optionsOrLogger as NestLogger)) || false;
    options.errorHandler = options.errorHandler || undefined;
    options.usePlugins = options.usePlugins || false;
    options.cliName = options.cliName || 'nest-commander';
    options.serviceErrorHandler = options.serviceErrorHandler || undefined;
    options.enablePositionalOptions = options.enablePositionalOptions || false;
    options.enablePassThroughOptions =
      options.enablePassThroughOptions || false;
    options.outputConfiguration = options.outputConfiguration || undefined;
    options.completion = options.completion || false;
    options.helpConfiguration = options.helpConfiguration || undefined;

    return options as DefinedCommandFactoryRunOptions;
  }

  protected static isFactoryOptionsObject(
    loggerOrOptions: CommandFactoryRunOptions | NestLogger,
  ): loggerOrOptions is CommandFactoryRunOptions {
    return !(
      Array.isArray(loggerOrOptions) ||
      loggerOrOptions === false ||
      !!(loggerOrOptions as LoggerService).log
    );
  }

  protected static async registerPlugins(
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
      const plugin = await import(
        require.resolve(pluginPath, { paths: [process.cwd()] })
      );
      imports?.push(plugin.default);
    }
    return true;
  }
}
