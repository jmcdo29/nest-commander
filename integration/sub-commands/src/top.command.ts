import { Command, CommandRunner } from 'nest-commander';

import { LogService } from '../../common/log.service';
import { Mid1Command } from './mid-1.command';
import { Mid2Command } from './mid-2.command';

@Command({ name: 'top', arguments: '[name]', subCommands: [Mid1Command, Mid2Command] })
export class TopCommand implements CommandRunner {
  constructor(private readonly log: LogService) {}

  async run(inputs: string[]) {
    this.log.log('top command');
    this.log.log(inputs);
  }
}
