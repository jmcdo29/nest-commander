import { TestingModule } from '@nestjs/testing';
import { Stub, stubMethod } from 'hanbi';
import { CommandTestFactory } from 'nest-commander-testing';
import { suite } from 'uvu';
import { equal } from 'uvu/assert';
import { LogService } from '../../common/log.service';
import { NestedModule } from '../src/nested.module';

export const DefaultSubCommandSuite = suite<{
  logMock: Stub<typeof console.log>;
  exitMock: Stub<typeof process.exit>;
  commandInstance: TestingModule;
}>('Default Sub Command Suite');
DefaultSubCommandSuite.before(async (context) => {
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
DefaultSubCommandSuite.after.each(({ logMock, exitMock }) => {
  logMock.reset();
  exitMock.reset();
});
DefaultSubCommandSuite.after(({ exitMock }) => {
  exitMock.restore();
});
DefaultSubCommandSuite('top should call top mid1 bottom', async ({ commandInstance, logMock }) => {
  await CommandTestFactory.run(commandInstance, ['top']);
  equal(logMock.firstCall?.args[0], `top mid-1 bottom command`);
});
DefaultSubCommandSuite(
  'top mid-2 should call top mid2 command',
  async ({ commandInstance, logMock }) => {
    await CommandTestFactory.run(commandInstance, ['top', 'mid-2']);
    equal(logMock.firstCall?.args[0], `top mid-2 command`);
  },
);
