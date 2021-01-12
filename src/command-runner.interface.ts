import { DiscoveredMethodWithMeta } from '@golevelup/nestjs-discovery';

export interface CommandRunner {
  run(...args: any[]): Promise<void>;
}

export interface CommandMetadata {
  name?: string;
  default?: boolean;
  description?: string;
}

export interface OptionMetadata {
  flags: string[];
  description?: string;
  required?: boolean;
  name: string;
}

export interface RunnerMeta {
  instance: CommandRunner;
  params: DiscoveredMethodWithMeta<OptionMetadata>[];
}
