import { Module } from '@nestjs/common';
import { LogService } from '../../common/log.service';
import { FooCommand } from './foo.command';

@Module({
  providers: [LogService, FooCommand],
})
export class FooModule {}
