import { INestApplicationContext, Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CommandFactoryRunOptions, NestLogger } from './command-factory.interface';
import { CommandRunnerModule } from './command-runner.module';
import { CommandRunnerService } from './command-runner.service';

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
    let logger: NestLogger;
    let tempHandler: ((err: Error) => void) | undefined;
    if (this.isFactoryOptionsObject(optionsOrLogger)) {
      logger = optionsOrLogger.logger ?? false;
      tempHandler = optionsOrLogger.errorHandler;
    } else {
      logger = optionsOrLogger;
    }
    const app = await NestFactory.createApplicationContext(
      CommandRunnerModule.forModule(rootModule, { errorHandler: tempHandler }),
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
        !isNil((loggerOrOptions as CommandFactoryRunOptions).errorHandler))
    );
  }
}
