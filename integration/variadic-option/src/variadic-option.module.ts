import { Module } from '@nestjs/common';
import { LogService } from '../../common/log.service';
import { VariadicOptionCommand } from './variadic-option.command';

@Module({
  providers: [LogService, VariadicOptionCommand],
})
export class VariadicOptionModule {}
