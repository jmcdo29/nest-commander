import { CommandRunner, SubCommand } from 'nest-commander';

import { LogService } from '../../common/log.service';
import { BottomCommand } from './bottom.command';

@SubCommand({ name: 'mid-1', subCommands: [BottomCommand] })
export class Mid1Command extends CommandRunner {
  constructor(private readonly log: LogService) {
    super();
  }

  async run() {
    this.log.log('top mid-1 command');
  }
}
