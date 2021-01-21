import { Command, CommandRunner } from 'nest-commander';
import { LogService } from './../../common/log.service';

@Command({ name: 'foo', options: { isDefault: true } })
export class FooCommand implements CommandRunner {
  constructor(private readonly logService: LogService) {}

  async run(): Promise<void> {
    this.logService.log('foo');
  }
}
