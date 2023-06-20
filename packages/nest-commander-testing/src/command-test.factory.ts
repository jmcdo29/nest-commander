import { ModuleMetadata } from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { randomBytes } from 'crypto';
import { Answers, DistinctQuestion, ListQuestion } from 'inquirer';
import {
  CommandRunnerModule,
  CommandRunnerService,
  Inquirer,
} from 'nest-commander';
import { CommanderOptionsType } from 'packages/nest-commander/src/command-factory.interface';

export type CommandModuleMetadata = Exclude<ModuleMetadata, 'imports'> & {
  imports: NonNullable<ModuleMetadata['imports']>;
};

export class CommandTestFactory {
  private static testAnswers = [];
  private static useOriginalInquirer = false;

  static useDefaultInquirer() {
    this.useOriginalInquirer = true;
    return this;
  }
  static createTestingCommand(
    moduleMetadata: CommandModuleMetadata,
    options?: CommanderOptionsType,
  ): TestingModuleBuilder {
    moduleMetadata.imports.push(
      CommandRunnerModule.forModule(undefined, options),
    );
    const testingModule = Test.createTestingModule(moduleMetadata);
    if (!this.useOriginalInquirer) {
      testingModule.overrideProvider(Inquirer).useValue({
        prompt: this.promptMock.bind(this),
      });
    }
    return testingModule;
  }

  private static async promptMock(
    questions: ReadonlyArray<DistinctQuestion>,
    answers: Answers = {},
  ) {
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if ((question.name && answers[question.name]) || !this.testAnswers[i]) {
        continue;
      }
      let answer;
      if (question.validate) {
        await question.validate(this.testAnswers[i]);
      }
      if (question.when && typeof question.when === 'function') {
        await question.when(answers);
      }
      if ((question as ListQuestion).choices) {
        let choices = (question as ListQuestion).choices;
        if (typeof choices === 'function') {
          choices = await choices(answers);
        }
        const choice = (
          choices as Array<{ key?: string; value?: string; name?: string }>
        ).find((c) => c.key === this.testAnswers[i]);
        answer = choice?.value || this.testAnswers[i];
      } else {
        answer = this.testAnswers[i];
      }
      if (question.default && typeof question.default === 'function') {
        await question.default(this.testAnswers);
      }
      if (question.message && typeof question.message === 'function') {
        await question.message(this.testAnswers);
      }
      answers[question.name ?? 'default'] =
        (await question.filter?.(answer, answers)) ?? answer;
    }
    return answers;
  }

  static async run(app: TestingModule, args: string[] = []) {
    const application = await this.runApplication(app, args);
    await application.close();
  }

  static async runWithoutClosing(app: TestingModule, args: string[] = []) {
    return this.runApplication(app, args);
  }

  private static async runApplication(app: TestingModule, args: string[] = []) {
    if (args?.length && args[0] !== 'node') {
      args = ['node', randomBytes(8).toString('hex') + '.js'].concat(args);
    }
    await app.init();
    const runner = app.get(CommandRunnerService);
    await runner.run(args);
    return app;
  }

  static setAnswers(value: any | any[]): void {
    if (!Array.isArray(value)) {
      value = [value];
    }
    this.testAnswers = value;
  }
}
