import { Command, CommandRunner, Help } from 'nest-commander';

@Command({
  name: 'after-after-all',
  description: 'after after all',
})
export class AfterAfterAllCommand extends CommandRunner {
  async run() {
    /* no op */
  }

  @Help('after')
  afterHelp() {
    return 'after help';
  }

  @Help('afterAll')
  afterAllHelp() {
    return 'after all help';
  }
}
