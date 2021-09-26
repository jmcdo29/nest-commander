import { CommandRunner, SubCommand } from 'nest-commander';

import { LogService } from '../../common/log.service';

@SubCommand({ name: 'bottom' })
export class BottomCommand implements CommandRunner {
  constructor(private readonly log: LogService) {}

  async run() {
    this.log.log('top mid-1 bottom command');
  }
}
