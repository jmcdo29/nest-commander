import { DynamicModule, Module, Type } from '@nestjs/common';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { Command } from 'commander';
import { CommandRunnerService } from './command-runner.service';
import { Commander } from './constants';

@Module({})
export class CommandRunnerModule {
  static forModule(module?: Type<any>): DynamicModule {
    return {
      module: CommandRunnerModule,
      imports: module ? [module, DiscoveryModule] : [DiscoveryModule],
      providers: [
        CommandRunnerService,
        {
          provide: Commander,
          useClass: Command,
        },
      ],
    };
  }
}
