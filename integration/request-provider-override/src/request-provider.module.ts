import { RequestModule } from 'nest-commander';
import { LogService } from '../../common/log.service';
import { RequestScopedService } from './request-scoped.service';
import { SimpleCommand } from './simple.command';

@RequestModule({
  providers: [LogService, SimpleCommand, RequestScopedService],
  requestObject: { custom: 'value' },
})
export class RequestProviderModule {}
