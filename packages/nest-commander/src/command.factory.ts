import { LoggerService, LogLevel, Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CommandRunnerModule } from './command-runner.module';
import { CommandRunnerService } from './command-runner.service';

export class CommandFactory {
  static async run(
    rootModule: Type<any>,
    logger: LoggerService | LogLevel[] | boolean = false,
  ): Promise<void> {
    const app = await NestFactory.createApplicationContext(
      CommandRunnerModule.forModule(rootModule),
      {
        logger,
      },
    );
    const runner = app.get(CommandRunnerService);
    await runner.run();
    await app.close();
  }
}
