import { Command, CommandRunner, Help } from 'nest-commander';

@Command({
  name: 'after',
  description: 'after',
})
export class AfterCommand implements CommandRunner {
  async run() {
    /* no op */
  }

  @Help('after')
  afterHelp() {
    return 'after help';
  }
}
