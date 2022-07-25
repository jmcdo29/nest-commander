import { Command, CommandRunner } from 'nest-commander';
import { LogService } from '../../common/log.service';

@Command({
  name: 'phooey',
  description: 'This is a phooey command.',
})
export class FooCommand extends CommandRunner {
  constructor(private readonly log: LogService) {
    super();
  }

  async run() {
    this.log.log('Foo!');
  }
}
