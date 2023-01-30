import { stubMethod } from 'hanbi';
import { CommandTestFactory } from 'nest-commander-testing';
import { suite } from 'uvu';
import { equal } from 'uvu/assert';
import { LogService } from '../../common/log.service';
import { RequestProviderModule } from '../src/request-provider.module';

export const RequestProviderSuite = suite('Default Request Provider');

RequestProviderSuite('Default Request Provider', async () => {
  const logSpy = stubMethod(console, 'log');
  const commandInstance = await CommandTestFactory.createTestingCommand({
    imports: [RequestProviderModule],
  })
    .overrideProvider(LogService)
    .useValue({ log: logSpy.handler })
    .compile();
  await CommandTestFactory.run(commandInstance, []);
  equal(logSpy.firstCall?.args[0], { custom: 'value' });
});
