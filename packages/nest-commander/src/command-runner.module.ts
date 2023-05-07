import { DynamicModule, Logger, Module, Type } from '@nestjs/common';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { Command } from 'commander';
import * as inquirer from 'inquirer';
import { CommanderOptionsType } from './command-factory.interface';
import { CommandRunnerService } from './command-runner.service';
import { Commander, CommanderOptions, Inquirer } from './constants';
import { InquirerService } from './inquirer.service';
import { CliUtilityService } from './cli-utility.service';

@Module({})
export class CommandRunnerModule {
  static inquirerOptions: {
    input: NodeJS.ReadStream;
    output: NodeJS.WriteStream;
  } = {
    input: process.stdin,
    output: process.stdout,
  };
  static forModule(
    module?: Type<any> | DynamicModule,
    options?: CommanderOptionsType,
  ): DynamicModule {
    return {
      global: true,
      module: CommandRunnerModule,
      imports: module ? [module, DiscoveryModule] : [DiscoveryModule],
      providers: [
        Logger,
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
        {
          provide: CommanderOptions,
          useValue: options ?? {},
        },
        {
          provide: 'InquirerOptions',
          useValue: this.inquirerOptions,
        },
        CliUtilityService,
      ],
      exports: [InquirerService, CliUtilityService, Commander],
    };
  }
}
