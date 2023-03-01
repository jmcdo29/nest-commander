import { Module } from '@nestjs/common';
import { RootComamnd } from './root.command';

@Module({
  providers: [RootComamnd],
})
export class RootCommandModule {}
