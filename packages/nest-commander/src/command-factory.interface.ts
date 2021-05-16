import { LoggerService, LogLevel } from '@nestjs/common';

export type NestLogger = LoggerService | LogLevel[] | boolean;

export interface CommandFactoryRunOptions {
  logger?: NestLogger;
  errorHandler?: (err: Error) => void;
}
