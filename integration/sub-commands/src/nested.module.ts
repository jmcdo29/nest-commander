import { Module } from '@nestjs/common';

import { LogService } from '../../common/log.service';
import { BottomCommand } from './bottom.command';
import { Mid1Command } from './mid-1.command';
import { Mid2Command } from './mid-2.command';
import { NonCommand } from './non.command';
import { TopCommand } from './top.command';

@Module({
  providers: [LogService, TopCommand, Mid1Command, Mid2Command, BottomCommand, NonCommand],
})
export class NestedModule {}
