import { Module } from '@nestjs/common';
import { LogService } from '../../common/log.service';
import { HelloCommand } from './hello.command';
import { WhoQuestion } from './who.question';

@Module({
  providers: [HelloCommand, WhoQuestion, LogService],
})
export class HelloCommandModule {}
