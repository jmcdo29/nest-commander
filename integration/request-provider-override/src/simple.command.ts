import { Command, CommandRunner } from 'nest-commander';
import { LogService } from '../../common/log.service';
import { RequestScopedService } from './request-scoped.service';

@Command({ name: 'simple', options: { isDefault: true } })
export class SimpleCommand extends CommandRunner {
  constructor(
    private readonly requestProvider: RequestScopedService,
    private readonly logger: LogService,
  ) {
    super();
  }

  async run(_params: Record<string, any>, _options: Record<string, any>) {
    this.logger.log(this.requestProvider.getRequest());
  }
}
