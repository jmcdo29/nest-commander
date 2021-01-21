import { Module } from '@nestjs/common/decorators';
import { LogService } from '../../common/log.service';
import { ThisCommandCommand } from './this-command.command';

@Module({
  providers: [LogService, ThisCommandCommand],
})
export class ThisCommandModule {}
