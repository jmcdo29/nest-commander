import { Command, CommandRunner } from 'nest-commander';
import { LogService } from '../../common/log.service';

@Command({ name: 'this-command', arguments: '<with-value>' })
export class ThisCommandCommand extends CommandRunner {
  constructor(private readonly log: LogService) {
    super();
  }

  async run(params: string[]) {
    this.logHandler(params);
  }

  logHandler(...args: any[]): void {
    this.log.log(...args);
  }
}
