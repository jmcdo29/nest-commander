import { TestingModule } from '@nestjs/testing';
import { Stub, stubMethod } from 'hanbi';
import { CommandTestFactory } from 'nest-commander-testing';
import { suite } from 'uvu';
import { equal, ok } from 'uvu/assert';
import { RootCommandModule } from '../src/root-command.module';

export const RootCommandSuite = suite<{
  commandInstance: TestingModule;
  logMock: Stub<Console['log']>;
}>('RootCommand Test Suite');

RootCommandSuite.before(async (context) => {
  context.logMock = stubMethod(process.stdout, 'write');
  context.commandInstance = await CommandTestFactory.createTestingCommand({
    imports: [RootCommandModule],
  }).compile();
});

RootCommandSuite.after.each(({ logMock }) => {
  logMock.reset();
});
RootCommandSuite.after(({ logMock }) => {
  logMock.restore();
});

RootCommandSuite(
  "it should return root command's help with -h",
  async ({ commandInstance, logMock }) => {
    const exitStub = stubMethod(process, 'exit');
    const errMock = stubMethod(process.stderr, 'write');
    try {
      await CommandTestFactory.run(commandInstance, ['-h']);
    } catch {
      // no op
    }
    ok(
      logMock.firstCall?.args[0].includes('-y, --yellow <yellow>'),
      `Output help should include options from the @RootCommand()
      Instead, got ${logMock.firstCall?.args}
      `,
    );
    equal(
      exitStub.firstCall?.args[0],
      0,
      'process.exit should be called with 0',
    );
    exitStub.restore();
    errMock.restore();
  },
);
