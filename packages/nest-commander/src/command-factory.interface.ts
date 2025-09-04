import { LoggerService, LogLevel } from '@nestjs/common';
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';
import { Help, OutputConfiguration } from 'commander';
import type { CompletionFactoryOptions } from './completion.factory.interface';

export type ErrorHandler = (err: Error) => void;
export type ServiceErrorHandler = (err: Error) => PromiseLike<void> | void;
export type NestLogger = LoggerService | LogLevel[] | false;

export interface DefinedCommandFactoryRunOptions
  extends CommandFactoryRunOptions {
  cliName: string;
  usePlugins: boolean;
}

export interface CommandFactoryRunOptions
  extends NestApplicationContextOptions {
  logger?: NestLogger;
  errorHandler?: ErrorHandler;
  usePlugins?: boolean;
  cliName?: string;
  serviceErrorHandler?: ServiceErrorHandler;
  enablePositionalOptions?: boolean;
  enablePassThroughOptions?: boolean;
  outputConfiguration?: OutputConfiguration;
  helpConfiguration?: Partial<Help>;
  version?: string;

  /**
   * Apply Bash, ZSH and Fig completion to your CLI
   * @default false
   */
  completion?: false | CompletionFactoryOptions;
}

export interface CommanderOptionsType
  extends Omit<CommandFactoryRunOptions, 'logger'> {
  pluginsAvailable?: boolean;
}
