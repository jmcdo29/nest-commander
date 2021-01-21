import { Module } from '@nestjs/common';
import { BasicCommand } from './basic.command';
import { LogService } from './../../common/log.service';

@Module({
  providers: [BasicCommand, LogService],
})
export class RootModule {}
