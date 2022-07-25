import { TestingModule } from '@nestjs/testing';
import { spy, Stub } from 'hanbi';
import { CommandTestFactory } from 'nest-commander-testing';
import { suite } from 'uvu';
import { equal } from 'uvu/assert';
import { LogService } from '../../common/log.service';
import { OptionChoicesModule } from '../src/option-choices.module';

export const OptionChoiceSuite = suite<{
  commandInstance: TestingModule;
  logMock: Stub<typeof console.log>;
}>('OptionChoice Suite');
OptionChoiceSuite.before(async (context) => {
  context.logMock = spy();
  context.commandInstance = await CommandTestFactory.createTestingCommand({
    imports: [OptionChoicesModule],
  })
    .overrideProvider(LogService)
    .useValue({ log: context.logMock.handler })
    .compile();
});
OptionChoiceSuite.before.each(({ logMock }) => {
  logMock.reset();
});
OptionChoiceSuite('Send in option "yes"', async ({ commandInstance, logMock }) => {
  await CommandTestFactory.run(commandInstance, ['-c', 'yes']);
  equal(logMock.firstCall?.args[0], { choice: 'yes' });
});
OptionChoiceSuite('Send in option "no"', async ({ commandInstance, logMock }) => {
  await CommandTestFactory.run(commandInstance, ['-c', 'no']);
  equal(logMock.firstCall?.args[0], { choice: 'no' });
});
OptionChoiceSuite('Send in "yes" for verify', async ({ commandInstance, logMock }) => {
  await CommandTestFactory.run(commandInstance, ['-v', 'yes']);
  equal(logMock.firstCall?.args[0], 'verify choice parser');
});

OptionChoiceSuite.run();
