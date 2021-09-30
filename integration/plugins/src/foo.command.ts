import { Command, CommandRunner } from 'nest-commander';
import { LogService } from '../../common/log.service';

@Command({ name: 'phooey' })
export class FooCommand implements CommandRunner {
  constructor(private readonly log: LogService) {}

  async run() {
    this.log.log('Foo!');
  }
}
