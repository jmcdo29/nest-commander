import {
  Command,
  CommandRunner,
  InquirerService,
  Option,
} from 'nest-commander';
import { LogService } from '../../common/log.service';
import { HelloOptions } from './hello.interface';

@Command({ name: 'hello', options: { isDefault: true } })
export class HelloCommand extends CommandRunner {
  constructor(
    private readonly inquirer: InquirerService,
    private readonly logger: LogService,
  ) {
    super();
  }

  async run(_inputs: string[], options?: HelloOptions): Promise<void> {
    options = await this.inquirer.ask('hello', options);
    this.sayHello(options);
  }

  @Option({
    flags: '-n --name [name]',
  })
  parseName(val: string) {
    return val;
  }

  sayHello(options: HelloOptions): void {
    this.logger.log(`Hello ${options.name}`);
  }
}
