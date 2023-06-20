import { Command, CommandRunner, Option } from 'nest-commander';

@Command({ name: 'basic' })
export class BasicCommand extends CommandRunner {
  constructor() {
    super();
  }

  async run(): Promise<void> {
    // no op
  }

  @Option({
    flags: '-n, --number <number>',
    description: 'A basic number option',
    required: true,
  })
  parseNumber(val: string): number {
    return Number(val);
  }
}
