import { Command, CommandRunner } from 'nest-commander';
import { LogService } from './../../common/log.service';

@Command({ name: 'bar', options: { isDefault: false } })
export class BarCommand extends CommandRunner {
  constructor(private readonly logService: LogService) {
    super();
  }

  async run(): Promise<void> {
    this.logService.log('bar');
  }
}
