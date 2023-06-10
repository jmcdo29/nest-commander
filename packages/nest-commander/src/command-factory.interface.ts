import { LoggerService, LogLevel } from '@nestjs/common';
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';

export type ErrorHandler = (err: Error) => void;
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
  serviceErrorHandler?: ErrorHandler;
  enablePositionalOptions?: boolean;
  enablePassThroughOptions?: boolean;
}

export interface CommanderOptionsType
  extends Omit<CommandFactoryRunOptions, 'logger'> {
  pluginsAvailable?: boolean;
}
