import { Module } from '@nestjs/common';
import { LogService } from '../../common/log.service';
import { AfterAfterAllCommand } from './after-after-all.command';
import { AfterAllCommand } from './after-all.command';
import { AfterCommand } from './after.command';
import { BeforeAfterCommand } from './before-after.command';
import { BeforeAllCommand } from './before-all.command';
import { BeforeBeforeAllCommand } from './before-before-all.command';
import { BeforeCommand } from './before.command';
import { FooCommand } from './foo.command';

@Module({
  providers: [
    FooCommand,
    LogService,
    BeforeCommand,
    BeforeAllCommand,
    BeforeBeforeAllCommand,
    BeforeAfterCommand,
    BeforeAfterCommand,
    AfterCommand,
    AfterAfterAllCommand,
    AfterAllCommand,
  ],
})
export class FooModule {}
