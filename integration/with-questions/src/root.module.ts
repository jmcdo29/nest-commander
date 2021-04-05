import { Module } from '@nestjs/common';
import { HelloCommand } from './hello.command';
import { WhoQuestion } from './who.question';

@Module({
  providers: [HelloCommand, WhoQuestion],
})
export class HelloCommandModule {}
