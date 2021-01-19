import { LoggerService, LogLevel, Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CommandRunnerCoreModule } from './command-runner-core.module';
import { CommandRunnerCoreService } from './command-runner-core.service';

export class CommandFactory {
  static async run(
    rootModule: Type<any>,
    logger: LoggerService | LogLevel[] | boolean = false,
  ): Promise<void> {
    const app = await NestFactory.createApplicationContext(
      CommandRunnerCoreModule.forModule(rootModule),
      {
        logger,
      },
    );
    const runner = app.get(CommandRunnerCoreService);
    await runner.run();
    await app.close();
  }
}
