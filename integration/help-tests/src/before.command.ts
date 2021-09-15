import { Command, CommandRunner, Help } from 'nest-commander';

@Command({ name: 'before', description: 'before' })
export class BeforeCommand implements CommandRunner {
  async run() {
    /* no op */
  }

  @Help('before')
  beforeHelp() {
    return 'before help';
  }
}
