import { Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CommandFactoryRunOptions, NestLogger } from './command-factory.interface';
import { CommandRunnerModule } from './command-runner.module';
import { CommandRunnerService } from './command-runner.service';

export class CommandFactory {
  static async run(
    rootModule: Type<any>,
    optionsOrLogger: CommandFactoryRunOptions | NestLogger = false,
  ): Promise<void> {
    let logger: NestLogger;
    let errorHandler: ((err: Error) => void) | undefined;
    if (this.isFactoryOptionsObject(optionsOrLogger)) {
      logger = optionsOrLogger.logger ?? false;
      errorHandler = optionsOrLogger.errorHandler;
    } else {
      logger = optionsOrLogger;
    }
    errorHandler ||= (_err: Error) => {
      /* no op */
    };
    const app = await NestFactory.createApplicationContext(
      CommandRunnerModule.forModule(rootModule),
      {
        logger,
      },
    );
    const runner = app.get(CommandRunnerService);
    await runner.run().catch(errorHandler);
    await app.close();
  }

  private static isFactoryOptionsObject(
    loggerOrOptions: CommandFactoryRunOptions | NestLogger,
  ): loggerOrOptions is CommandFactoryRunOptions {
    return (
      loggerOrOptions &&
      (loggerOrOptions as CommandFactoryRunOptions).logger !== null &&
      (loggerOrOptions as CommandFactoryRunOptions).logger !== undefined
    );
  }
}
