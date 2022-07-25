import { Command, CommandRunner, Help } from 'nest-commander';

@Command({
  name: 'after-all',
  description: 'after all',
})
export class AfterAllCommand extends CommandRunner {
  async run() {
    /* no op */
  }

  @Help('afterAll')
  afterAllHelp() {
    return 'after all help';
  }
}
