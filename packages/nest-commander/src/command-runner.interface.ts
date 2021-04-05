import { DiscoveredMethodWithMeta } from '@golevelup/nestjs-discovery';
import { CommandOptions } from 'commander';
import type { DistinctQuestion } from 'inquirer';

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

export type QuestionMetadata = Omit<
  DistinctQuestion,
  'transformer' | 'validate' | 'when' | 'filter'
> & { index?: number };
