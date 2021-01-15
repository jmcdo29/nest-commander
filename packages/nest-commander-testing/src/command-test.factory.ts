import { ModuleMetadata } from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { CommandRunnerCoreModule, CommandRunnerCoreService } from 'nest-commander';

export class CommandTestFactory {
  static createTestingCommand(moduleMetadata: ModuleMetadata): TestingModuleBuilder {
    moduleMetadata.imports?.push(CommandRunnerCoreModule.forModule());
    return Test.createTestingModule(moduleMetadata);
  }

  static async run(app: TestingModule, args?: string[]) {
    await app.init();
    const runner = app.get(CommandRunnerCoreService);
    await runner.run(args);
    await app.close();
  }
}
