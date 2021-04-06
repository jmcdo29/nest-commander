import { DynamicModule, Module, Type } from '@nestjs/common';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { Command } from 'commander';
import * as inquirer from 'inquirer';
import { CommandRunnerService } from './command-runner.service';
import { Commander, Inquirer } from './constants';
import { InquirerService } from './inquirer.service';

@Module({})
export class CommandRunnerModule {
  static forModule(module?: Type<any>): DynamicModule {
    return {
      global: true,
      module: CommandRunnerModule,
      imports: module ? [module, DiscoveryModule] : [DiscoveryModule],
      providers: [
        CommandRunnerService,
        InquirerService,
        {
          provide: Commander,
          useClass: Command,
        },
        {
          provide: Inquirer,
          useValue: inquirer,
        },
      ],
      exports: [InquirerService],
    };
  }
}
