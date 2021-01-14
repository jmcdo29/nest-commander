import { ModuleMetadata } from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { CommandRunnerCoreModule, CommandRunnerCoreService } from 'nestjs-commander';

export class CommandTestFactory {
  static createTestingCommand(moduleMetadata: ModuleMetadata): TestingModuleBuilder {
    moduleMetadata.imports?.push(CommandRunnerCoreModule.forModule());
    return Test.createTestingModule(moduleMetadata);
  }

  static async run(app: TestingModule) {
    await app.init();
    const runner = app.get(CommandRunnerCoreService);
    await runner.run();
    await app.close();
  }
}
