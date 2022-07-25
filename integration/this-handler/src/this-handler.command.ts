import { Command, CommandRunner, Option } from 'nest-commander';
import { LogService } from '../../common/log.service';

@Command({
  name: 'this-handler',
  description: 'Just adding a description for coverage',
  options: { isDefault: true },
})
export class ThisHandlerCommand extends CommandRunner {
  constructor(private readonly log: LogService) {
    super();
  }

  async run(params: string[], options: Record<string, string>) {
    this.logHandler(options);
  }

  logHandler(...args: any[]): void {
    this.log.log(...args);
  }

  @Option({
    flags: '-b,--basic [basic]',
    description: 'A value to pass for the this-handler method',
    defaultValue: 'oh HAI',
  })
  parseBasicOption(val: string): string {
    return this.handleParsingBasic(val);
  }

  handleParsingBasic(val: string): string {
    return val;
  }
}
