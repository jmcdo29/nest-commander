import { DiscoveredMethodWithMeta } from '@golevelup/nestjs-discovery';
import { Type } from '@nestjs/common';
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

export type InquirerKeysWithPossibleFunctionTypes =
  | 'transformer'
  | 'validate'
  | 'when'
  | 'choices'
  | 'message'
  | 'default';

type InquirerQuestionWithoutFilter<T> = Omit<T, 'filter'>;

export abstract class CommandRunner {
  protected command!: Command;
  public setCommand(command: Command): this {
    this.command = command;
    return this;
  }
  abstract run(passedParams: string[], options?: Record<string, any>): Promise<void>;
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

export interface OptionMetadata {
  flags: string;
  description?: string;
  defaultValue?: string | boolean | number;
  required?: boolean;
  name?: string;
  choices?: string[] | true;
}

export interface OptionChoiceForMetadata {
  name: string;
}

export interface RunnerMeta {
  instance: CommandRunner;
  command: CommandMetadata;
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
