import { Command, CommandRunner, Help } from 'nest-commander';
import { LogService } from '../../common/log.service';

@Command({
  name: 'foo',
  options: {
    isDefault: true,
  },
})
export class FooCommand implements CommandRunner {
  constructor(private readonly logger: LogService) {}
  async run(inputs: any, options: any) {
    this.logger.log(inputs, options);
  }

  @Help('before')
  beforeHelp() {
    return 'before help';
  }

  @Help('after')
  afterHelp() {
    return 'after help';
  }

  @Help('beforeAll')
  beforeAllHelp() {
    return 'before all help';
  }

  @Help('afterAll')
  afterAllHelp() {
    return 'after all help';
  }
}
