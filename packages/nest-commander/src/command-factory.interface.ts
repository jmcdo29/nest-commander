import { LoggerService, LogLevel } from '@nestjs/common';

export type ErrorHandler = (err: Error) => void;
export type NestLogger = LoggerService | LogLevel[] | false;

export interface DefinedCommandFactoryRunOptions extends CommandFactoryRunOptions {
  cliName: string;
  usePlugins: boolean;
}

export interface CommandFactoryRunOptions {
  logger?: NestLogger;
  errorHandler?: ErrorHandler;
  usePlugins?: boolean;
  cliName?: string;
  serviceErrorHandler?: ErrorHandler;
}

export interface CommanderOptionsType extends Omit<CommandFactoryRunOptions, 'logger'> {
  pluginsAvailable?: boolean;
  enablePositionalOptions?: boolean;
}
