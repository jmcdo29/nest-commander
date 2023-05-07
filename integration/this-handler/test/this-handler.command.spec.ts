import { TestingModule } from '@nestjs/testing';
import { Stub, stubMethod } from 'hanbi';
import { CommandTestFactory } from 'nest-commander-testing';
import { suite } from 'uvu';
import { equal } from 'uvu/assert';
import { LogService } from '../../common/log.service';
import { ThisHandlerModule } from '../src/this-handler.module';

export const ThisOptionHandlerSuite = suite<{
  commandInstance: TestingModule;
  logMock: Stub<typeof console.log>;
}>('This Option Handler Suite');
ThisOptionHandlerSuite.before(async (context) => {
  context.logMock = stubMethod(console, 'log');
  context.commandInstance = await CommandTestFactory.createTestingCommand({
    imports: [ThisHandlerModule],
  })
    .overrideProvider(LogService)
    .useValue({ log: context.logMock.handler })
    .compile();
});
ThisOptionHandlerSuite.after.each(({ logMock }) => {
  logMock.reset();
});
for (const { flagVal, expected } of [
  {
    flagVal: ['-b'],
    expected: 'oh HAI',
  },
  {
    flagVal: ['-b', 'hello'],
    expected: 'hello',
  },
]) {
  ThisOptionHandlerSuite(
    `this-handler with arg ${flagVal} and log ${expected}`,
    async ({ commandInstance, logMock }) => {
      await CommandTestFactory.run(
        commandInstance,
        ['this-handler'].concat(flagVal),
      );
      equal(logMock.firstCall?.args[0], { basic: expected });
    },
  );
}
