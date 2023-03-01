import { CommandRunner, Option, RootCommand } from 'nest-commander';

@RootCommand({ options: { isDefault: true } })
export class RootComamnd extends CommandRunner {
  async run(): Promise<void> {
    // no op
  }

  @Option({
    name: 'useYellow',
    flags: '-y, --yellow <yellow>',
  })
  parseYellow(yellow: string) {
    return yellow;
  }

  @Option({
    flags: '-b, --blue <blue>',
  })
  parseBlue(blue: string) {
    return blue;
  }
}
