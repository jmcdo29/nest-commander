import { INestApplicationContext, Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { NestFactory } from '@nestjs/core';
import { cosmiconfig } from 'cosmiconfig';
import { CommandFactoryRunOptions, NestLogger } from './command-factory.interface';
import { CommandRootModule } from './command-root.module';
import { CommandRunnerModule } from './command-runner.module';
import { CommandRunnerService } from './command-runner.service';
import { cliPluginError } from './constants';

const isNil = (val: any) => {
  return val === undefined || val === null;
};

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
    const imports: ModuleMetadata['imports'] = [rootModule];
    if (usePlugins) {
      await this.registerPlugins(cliName, imports);
    }
    const app = await NestFactory.createApplicationContext(
      CommandRunnerModule.forModule(
        { module: CommandRootModule, imports },
        { errorHandler: tempHandler },
      ),
      {
        logger,
      },
    );
    const runner = app.get(CommandRunnerService);
    await runner.run();
    return app;
  }

  private static isFactoryOptionsObject(
    loggerOrOptions: CommandFactoryRunOptions | NestLogger,
  ): loggerOrOptions is CommandFactoryRunOptions {
    return (
      loggerOrOptions &&
      (!isNil((loggerOrOptions as CommandFactoryRunOptions).logger) ||
        !isNil((loggerOrOptions as CommandFactoryRunOptions).errorHandler) ||
        !isNil((loggerOrOptions as CommandFactoryRunOptions).usePlugins))
    );
  }

  private static async registerPlugins(
    cliName: string,
    imports: ModuleMetadata['imports'],
  ): Promise<void> {
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
    if (!pluginConfig || pluginConfig?.isEmpty) {
      throw new Error(cliPluginError(cliName));
    }
    for (const pluginPath of pluginConfig?.config.plugins ?? []) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const plugin = require(require.resolve(pluginPath, { paths: [process.cwd()] }));
      imports?.push(plugin.default);
    }
  }
}
