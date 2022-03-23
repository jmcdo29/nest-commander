import { TestingModule } from '@nestjs/testing';
import { Stub, stubMethod } from 'hanbi';
import { CommandTestFactory } from 'nest-commander-testing';
import { suite } from 'uvu';
import { equal } from 'uvu/assert';
import { LogService } from '../../common/log.service';
import { NestedModule } from '../src/nested.module';

export const SubCommandSuite = suite<{
  logMock: Stub<typeof console.log>;
  exitMock: Stub<typeof process.exit>;
  commandInstance: TestingModule;
}>('Sub Command Suite');
SubCommandSuite.before(async (context) => {
  context.exitMock = stubMethod(process, 'exit');
  context.logMock = stubMethod(console, 'log');
  context.commandInstance = await CommandTestFactory.createTestingCommand({
    imports: [NestedModule],
  })
    .overrideProvider(LogService)
    .useValue({
      log: context.logMock.handler,
    })
    .compile();
});
SubCommandSuite.after.each(({ logMock, exitMock }) => {
  logMock.reset();
  exitMock.reset();
});
SubCommandSuite.after(({ exitMock }) => {
  exitMock.restore();
});
for (const command of [['top'], ['top', 'mid-1'], ['top', 'mid-1', 'bottom'], ['top', 'mid-2']]) {
  SubCommandSuite(`run the ${command} command`, async ({ commandInstance, logMock }) => {
    await CommandTestFactory.run(commandInstance, command);
    equal(logMock.firstCall?.args[0], `${command.join(' ')} command`);
  });
}
SubCommandSuite('parameters should still be passable', async ({ commandInstance, logMock }) => {
  await CommandTestFactory.run(commandInstance, ['top', 'hello!']);
  equal(logMock.callCount, 2);
  equal(logMock.firstCall?.args[0], 'top command');
  equal(logMock.getCall(1).args[0], ['hello!']);
});
for (const command of ['mid-1', 'mid-2', 'bottom']) {
  SubCommandSuite(
    `write an error from ${command} command`,
    async ({ commandInstance, logMock, exitMock }) => {
      const errStub = stubMethod(process.stderr, 'write');
      await CommandTestFactory.run(commandInstance, [command]);
      equal(logMock.callCount, 0);
      equal(exitMock.firstCall?.args[0], 1);
      errStub.restore();
    },
  );
}
