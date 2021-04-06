import { ModuleMetadata } from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { randomBytes } from 'crypto';
import { CommandRunnerModule, CommandRunnerService } from 'nest-commander';

export type CommandModuleMetadata = Exclude<ModuleMetadata, 'imports'> & {
  imports: NonNullable<ModuleMetadata['imports']>;
};

export class CommandTestFactory {
  static createTestingCommand(moduleMetadata: CommandModuleMetadata): TestingModuleBuilder {
    moduleMetadata.imports.push(CommandRunnerModule.forModule());
    return Test.createTestingModule(moduleMetadata);
  }

  static async run(app: TestingModule, args: string[] = []) {
    if (args?.length && args[0] !== 'node') {
      args = ['node', randomBytes(8).toString('utf-8') + '.js'].concat(args);
    }
    await app.init();
    const runner = app.get(CommandRunnerService);
    await runner.run(args);
    await app.close();
  }

  static setAnswer(value: any): void {
    process.stdin.push(value);
    process.stdin.push('\n');
  }
}
