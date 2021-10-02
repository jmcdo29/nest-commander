import { LoggerService, LogLevel } from '@nestjs/common';

export type ErrorHandler = (err: Error) => void;
export type NestLogger = LoggerService | LogLevel[] | false;

export interface CommandFactoryRunOptions {
  logger?: NestLogger;
  errorHandler?: ErrorHandler;
  usePlugins?: boolean;
  cliName?: string;
}

export interface CommanderOptionsType {
  errorHandler?: ErrorHandler;
}
