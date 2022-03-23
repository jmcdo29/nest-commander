import { TestingModule } from '@nestjs/testing';
import { Stub, stubMethod } from 'hanbi';
import { CommandTestFactory } from 'nest-commander-testing';
import { suite } from 'uvu';
import { equal } from 'uvu/assert';
import { LogService } from '../../common/log.service';
import { HelloCommandModule } from '../src/root.module';

export const SetQuestionSuite =
  suite<{ commandInstance: TestingModule; logMock: Stub<typeof console.log> }>(
    'Set Question Suite',
  );
SetQuestionSuite.before.each(async (context) => {
  context.logMock = stubMethod(console, 'log');
  context.commandInstance = await CommandTestFactory.createTestingCommand({
    imports: [HelloCommandModule],
  })
    .overrideProvider(LogService)
    .useValue({ log: context.logMock.handler })
    .compile();
});
SetQuestionSuite.after.each(({ logMock }) => {
  logMock.reset();
});
for (const { name, expected } of [
  {
    name: 'Jay',
    expected: 'Hello Jay',
  },
  {
    name: 'Test',
    expected: 'Hello Test',
  },
]) {
  SetQuestionSuite(
    `the arg ${name} should be passed to the command, populated from inquirer`,
    async ({ commandInstance, logMock }) => {
      logMock.passThrough();
      CommandTestFactory.setAnswers(name);
      await CommandTestFactory.run(commandInstance);
      equal(logMock.firstCall?.args[0], expected);
    },
  );
}
