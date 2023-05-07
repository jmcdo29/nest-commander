import { DiscoveredMethodWithMeta } from '@golevelup/nestjs-discovery';
import { ClassProvider, Type } from '@nestjs/common';
import { Command, CommandOptions } from 'commander';
import type {
  CheckboxQuestion,
  ConfirmQuestion,
  EditorQuestion,
  ExpandQuestion,
  InputQuestion,
  ListQuestion,
  NumberQuestion,
  PasswordQuestion,
  RawListQuestion,
} from 'inquirer';
import { CommandMeta, SubCommandMeta } from './constants';

export type InquirerKeysWithPossibleFunctionTypes =
  | 'transformer'
  | 'validate'
  | 'when'
  | 'choices'
  | 'message'
  | 'default';

type InquirerQuestionWithoutFilter<T> = Omit<T, 'filter'>;

type CommandRunnerClass = ClassProvider<CommandRunner> & typeof CommandRunner;

export abstract class CommandRunner {
  static registerWithSubCommands(
    meta: string = CommandMeta,
  ): CommandRunnerClass[] {
    // NOTE: "this' in the scope is inherited class
    const subcommands: CommandRunnerClass[] =
      Reflect.getMetadata(meta, this)?.subCommands || [];
    return subcommands.reduce(
      (current: CommandRunnerClass[], subcommandClass: CommandRunnerClass) => {
        const results = subcommandClass.registerWithSubCommands(SubCommandMeta);
        return [...current, ...results];
      },
      [this] as CommandRunnerClass[],
    );
  }
  protected command!: Command;
  public setCommand(command: Command): this {
    this.command = command;
    return this;
  }
  abstract run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void>;
}

export interface CommandMetadata {
  name: string;
  arguments?: string;
  description?: string;
  argsDescription?: Record<string, string>;
  options?: CommandOptions;
  subCommands?: Array<Type<CommandRunner>>;
  aliases?: string[];
}

export type RootCommandMetadata = Omit<CommandMetadata, 'name'> & {
  name?: string;
};

export interface OptionMetadata {
  flags: string;
  description?: string;
  defaultValue?: string | boolean | number;
  required?: boolean;
  name?: string;
  choices?: string[] | true;
  env?: string;
}

export interface OptionChoiceForMetadata {
  name: string;
}

export interface RunnerMeta {
  instance: CommandRunner;
  command: RootCommandMetadata;
  params: DiscoveredMethodWithMeta<OptionMetadata>[];
  help?: DiscoveredMethodWithMeta<HelpOptions>[];
}

export interface QuestionNameMetadata {
  name: string;
}

export type QuestionMetadata =
  | InquirerQuestionWithoutFilter<CheckboxQuestion>
  | InquirerQuestionWithoutFilter<ConfirmQuestion>
  | InquirerQuestionWithoutFilter<EditorQuestion>
  | InquirerQuestionWithoutFilter<ExpandQuestion>
  | InquirerQuestionWithoutFilter<InputQuestion>
  | InquirerQuestionWithoutFilter<ListQuestion>
  | InquirerQuestionWithoutFilter<NumberQuestion>
  | InquirerQuestionWithoutFilter<PasswordQuestion>
  | InquirerQuestionWithoutFilter<RawListQuestion>;

export type HelpOptions = 'before' | 'beforeAll' | 'after' | 'afterAll';
