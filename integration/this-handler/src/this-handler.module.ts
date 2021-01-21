import { Module } from '@nestjs/common/decorators';
import { LogService } from '../../common/log.service';
import { ThisHandlerCommand } from './this-handler.command';

@Module({
  providers: [LogService, ThisHandlerCommand],
})
export class ThisHandlerModule {}
