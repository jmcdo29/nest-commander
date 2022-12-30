import { CommandRunner, SubCommand } from 'nest-commander';

import { LogService } from '../../common/log.service';

@SubCommand({ name: 'mid-2', aliases: ['m'] })
export class Mid2Command extends CommandRunner {
  constructor(private readonly log: LogService) {
    super();
  }

  async run() {
    this.log.log('top mid-2 command');
  }
}
