import { Module } from '@nestjs/common';
import { BarCommand } from './bar.command';
import { FooCommand } from './foo.command';
import { LogService } from './../../common/log.service';

@Module({
  providers: [BarCommand, FooCommand, LogService],
})
export class MultipleCommandModule {}
