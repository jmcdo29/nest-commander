import { TestingModule } from '@nestjs/testing';
import { Stub, stubMethod } from 'hanbi';
import { CommandTestFactory } from 'nest-commander-testing';
import { suite } from 'uvu';
import { equal } from 'uvu/assert';
import { LogService } from '../../common/log.service';
import { ThisCommandModule } from '../src/this-command.module';

export const ThisCommandHandlerSuite = suite<{
  commandInstance: TestingModule;
  logMock: Stub<typeof console.log>;
}>('This Command Handler Suite');
ThisCommandHandlerSuite.before(async (context) => {
  context.logMock = stubMethod(console, 'log');
  context.commandInstance = await CommandTestFactory.createTestingCommand({
    imports: [ThisCommandModule],
  })
    .overrideProvider(LogService)
    .useValue({ log: context.logMock.handler })
    .compile();
});
ThisCommandHandlerSuite.after.each(({ logMock }) => {
  logMock.reset();
});
ThisCommandHandlerSuite(
  'should call this-handler with arg hello',
  async ({ commandInstance, logMock }) => {
    await CommandTestFactory.run(commandInstance, ['this-command', 'hello']);
    equal(logMock.firstCall?.args[0], ['hello']);
  },
);
