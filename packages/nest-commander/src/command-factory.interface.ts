import { LoggerService, LogLevel } from '@nestjs/common';

export type ErrorHandler = (err: Error) => void;
export type NestLogger = LoggerService | LogLevel[] | boolean;

export interface CommandFactoryRunOptions {
  logger?: NestLogger;
  errorHandler?: ErrorHandler;
}

export interface CommanderOptionsType {
  errorHandler?: ErrorHandler;
}
