import { DiscoveredMethodWithMeta } from '@golevelup/nestjs-discovery';
import { CommandOptions } from 'commander';
import type {
  Answers,
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

type InquirerWithoutFunctions<T extends Answers> = Omit<
  T,
  'transformer' | 'validate' | 'when' | 'filter'
> & { index?: number };

export interface CommandRunner {
  run(passedParams: string[], options?: Record<string, any>): Promise<void>;
}

export interface CommandMetadata {
  name: string;
  arguments?: string;
  description?: string;
  argsDescription?: Record<string, string>;
  options?: CommandOptions;
}

export interface OptionMetadata {
  flags: string;
  description?: string;
  defaultValue?: string | boolean;
}

export interface RunnerMeta {
  instance: CommandRunner;
  command: CommandMetadata;
  params: DiscoveredMethodWithMeta<OptionMetadata>[];
}

export interface QuestionNameMetadata {
  name: string;
}

export type QuestionMetadata =
  | InquirerWithoutFunctions<CheckboxQuestion>
  | InquirerWithoutFunctions<ConfirmQuestion>
  | InquirerWithoutFunctions<ExpandQuestion>
  | InquirerWithoutFunctions<EditorQuestion>
  | InquirerWithoutFunctions<InputQuestion>
  | InquirerWithoutFunctions<ListQuestion>
  | InquirerWithoutFunctions<NumberQuestion>
  | InquirerWithoutFunctions<PasswordQuestion>
  | InquirerWithoutFunctions<RawListQuestion>;
