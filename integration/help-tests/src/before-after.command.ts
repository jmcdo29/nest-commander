import { Command, CommandRunner, Help } from 'nest-commander';

@Command({
  name: 'before-after',
  description: 'before-after',
})
export class BeforeAfterCommand implements CommandRunner {
  async run() {
    /* no op */
  }

  @Help('before')
  beforeHelp() {
    return 'before help';
  }

  @Help('after')
  afterHelp() {
    return 'after help';
  }
}
