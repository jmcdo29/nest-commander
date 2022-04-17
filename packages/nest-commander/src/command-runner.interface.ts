import { DiscoveredMethodWithMeta } from '@golevelup/nestjs-discovery';
import { Type } from '@nestjs/common';
import { CommandOptions } from 'commander';
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

export interface CommandRunner {
  run(passedParams: string[], options?: Record<string, any>): Promise<void>;
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
  defaultValue?: string | boolean;
  required?: boolean;
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
