import { Command, CommandRunner, Options } from 'nest-commander';
import { LogService } from '../../common/log.service';

@Command({ name: 'variadic-test', options: { isDefault: true } })
export class VariadicOptionCommand extends CommandRunner {
  constructor(private readonly logger: LogService) {
    super();
  }

  async run(_args: string[], options: { locales: string[] }) {
    this.logger.log(options);
  }

  @Options<string[]>({
    flags: '-l, --locales [locales...]',
    defaultValue: ['en'],
    description: 'Locales to use',
  })
  parseLocale(val: string): string {
    return val;
  }
}
