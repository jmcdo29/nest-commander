import { Module } from '@nestjs/common';

import { LogService } from '../../common/log.service';
import { TopCommand } from './top.command';

@Module({
  providers: [LogService, ...TopCommand.registerWithSubCommands()],
})
export class NestedModule {}
