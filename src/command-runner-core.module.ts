import { DynamicModule, Module, Type } from '@nestjs/common';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { CommandRunnerCoreService } from './command-runner-core.service';

@Module({})
export class CommandRunnerCoreModule {
  static forModule(module: Type<any>): DynamicModule {
    return {
      module: CommandRunnerCoreModule,
      imports: [module, DiscoveryModule],
      providers: [CommandRunnerCoreService],
    };
  }
}
