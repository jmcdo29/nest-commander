import { Command, CommandRunner } from 'nest-commander';

@Command({ name: 'dot', options: { isDefault: true } })
export class DotCommand extends CommandRunner {
  async run() {
    if (!this.command) {
      throw new Error('No .command property set');
    }
  }
}
