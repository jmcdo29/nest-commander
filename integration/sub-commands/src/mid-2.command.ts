import { CommandRunner, SubCommand } from 'nest-commander';

import { LogService } from '../../common/log.service';

@SubCommand({ name: 'mid-2' })
export class Mid2Command implements CommandRunner {
  constructor(private readonly log: LogService) {}

  async run() {
    this.log.log('top mid-2 command');
  }
}
