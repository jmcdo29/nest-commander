import { DynamicModule, Module, Type } from '@nestjs/common';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { Command } from 'commander';
import { CommandRunnerCoreService } from './command-runner-core.service';
import { Commander } from './constants';

@Module({})
export class CommandRunnerCoreModule {
  static forModule(module?: Type<any>): DynamicModule {
    return {
      module: CommandRunnerCoreModule,
      imports: module ? [module, DiscoveryModule] : [DiscoveryModule],
      providers: [
        CommandRunnerCoreService,
        {
          provide: Commander,
          useClass: Command,
        },
      ],
    };
  }
}
