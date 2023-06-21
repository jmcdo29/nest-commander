import { Module } from '@nestjs/common';
import { BasicCommand } from './basic.command';

@Module({
  providers: [BasicCommand],
})
export class RootModule {}
