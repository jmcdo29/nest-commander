import { Command, CommandRunner, Option } from 'nest-commander';

interface RequiredOptionCommandOptions {
  name?: string;
}

@Command({
  name: 'required-option',
  description: 'A command with a required option',
})
export class RequiredOptionCommand extends CommandRunner {
  async run(
    _passedParam: string[],
    options?: RequiredOptionCommandOptions,
  ): Promise<void> {
    console.log(`required-option ${options?.name}`);
  }

  @Option({
    flags: '-n, --name <name>',
    description: 'A required name',
    required: true,
  })
  parseName(val: string): string {
    return val;
  }
}
