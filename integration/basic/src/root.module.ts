import { Module } from '@nestjs/common';
import { BasicCommand } from './basic.command';
import { RequiredOptionCommand } from './required-option.command';
import { LogService } from './../../common/log.service';

@Module({
  providers: [BasicCommand, RequiredOptionCommand, LogService],
})
export class RootModule {}
