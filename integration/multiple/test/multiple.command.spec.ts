import { TestingModule } from '@nestjs/testing';
import { spy, Stub } from 'hanbi';
import { CommandTestFactory } from 'nest-commander-testing';
import { suite } from 'uvu';
import { equal } from 'uvu/assert';
import { LogService } from '../../common/log.service';
import { MultipleCommandModule } from '../src/root.module';

export const MultipleCommandSuite =
  suite<{ logSpy: Stub<Console['log']>; commandInstance: TestingModule }>('Multiple Commands');
MultipleCommandSuite.before(async (context) => {
  context.logSpy = spy();
  context.commandInstance = await CommandTestFactory.createTestingCommand({
    imports: [MultipleCommandModule],
  })
    .overrideProvider(LogService)
    .useValue({ log: context.logSpy.handler })
    .compile();
});
MultipleCommandSuite.after.each(({ logSpy }) => {
  logSpy.reset();
});
for (const { command, expected } of [
  {
    command: 'foo',
    expected: 'foo',
  },
  {
    command: 'bar',
    expected: 'bar',
  },
] as const) {
  MultipleCommandSuite(
    `call ${command} expect ${expected}`,
    async ({ logSpy, commandInstance }) => {
      await CommandTestFactory.run(commandInstance, command ? [command] : undefined);
      equal(logSpy.firstCall?.args[0], expected);
    },
  );
}
