import { CommandRunner, SubCommand } from 'nest-commander';

import { LogService } from '../../common/log.service';
import { BottomCommand } from './bottom.command';

@SubCommand({ name: 'mid-1', parent: [BottomCommand] })
export class Mid1Command implements CommandRunner {
  constructor(private readonly log: LogService) {}

  async run() {
    this.log.log('top mid-1 command');
  }
}
