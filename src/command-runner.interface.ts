import { DiscoveredMethodWithMeta } from '@golevelup/nestjs-discovery';
import { CommandOptions } from 'commander';

export interface CommandRunner {
  run(passedParams: string[], options?: Record<string, any>): Promise<void>;
}

export interface CommandMetadata {
  nameAndArgs: string;
  description?: string;
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
