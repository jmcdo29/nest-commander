import { Command, CommandRunner, Help } from 'nest-commander';

@Command({
  name: 'before-before-all',
  description: 'before-before-all',
})
export class BeforeBeforeAllCommand extends CommandRunner {
  async run() {
    /* no op */
  }

  @Help('before')
  beforeHelp() {
    return 'before help';
  }

  @Help('beforeAll')
  beforeAllHelp() {
    return 'before all help';
  }
}
