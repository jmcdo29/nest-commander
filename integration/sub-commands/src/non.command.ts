import { Command, CommandRunner } from 'nest-commander';
import { Mid1Command } from './mid-1.command';
import { Mid2Command } from './mid-2.command';

@Command({ name: 'ntop', executable: false, subCommands: [Mid1Command, Mid2Command] })
export class NonCommand implements CommandRunner {
  async run() {
    /* no op */
  }
}
