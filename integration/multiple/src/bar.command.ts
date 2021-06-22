import { Command, CommandRunner } from '@nest-commander/nest-commander';
import { LogService } from './../../common/log.service';

@Command({ name: 'bar', options: { isDefault: false } })
export class BarCommand implements CommandRunner {
  constructor(private readonly logService: LogService) {}

  async run(): Promise<void> {
    this.logService.log('bar');
  }
}
