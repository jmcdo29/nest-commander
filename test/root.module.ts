import { Module } from '@nestjs/common';
import { BasicCommand } from './command';

@Module({
  providers: [BasicCommand],
})
export class RootModule {}
