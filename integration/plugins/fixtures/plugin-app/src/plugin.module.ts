import { Module } from '@nestjs/common';
import { PluginCommand } from './plugin.command';

@Module({
  providers: [PluginCommand],
})
export class PluginModule {}
