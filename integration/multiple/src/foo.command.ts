import { Command, CommandRunner } from 'nest-commander';
import { LogService } from './../../common/log.service';

@Command({ name: 'foo', options: { isDefault: true } })
export class FooCommand extends CommandRunner {
  constructor(private readonly logService: LogService) {
    super();
  }

  async run(): Promise<void> {
    this.logService.log('foo');
  }
}
