import { Module } from '@nestjs/common';
import { LogService } from '../../common/log.service';
import { ChoicesProvider } from './choices-provider.service';
import { OptionsTestCommand } from './option-choices.command';

@Module({
  providers: [LogService, ChoicesProvider, OptionsTestCommand],
})
export class OptionChoicesModule {}
