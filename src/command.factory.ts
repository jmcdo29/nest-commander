import { Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CommandRunnerCoreModule } from './command-runner-core.module';
import { CommandRunnerCoreService } from './command-runner-core.service';

export class CommandFactory {
  static async run(rootModule: Type<any>): Promise<void> {
    const app = await NestFactory.createApplicationContext(
      CommandRunnerCoreModule.forModule(rootModule),
      {
        logger: false,
      },
    );
    const runner = app.get(CommandRunnerCoreService);
    const [, , ...args] = process.argv;
    await runner.run(...args);
    await app.close();
  }
}
