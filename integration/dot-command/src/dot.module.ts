import { Module } from '@nestjs/common';
import { DotCommand } from './dot.command';

@Module({
  providers: [DotCommand],
})
export class DotModule {}
