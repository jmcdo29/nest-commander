import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import { spy, Stub, stubMethod } from 'hanbi';
import { suite } from 'uvu';
import { equal } from 'uvu/assert';
import { LogService } from '../../common/log.service';
import { RootModule } from '../src/root.module';

export const OutputConfigSuite = suite<{
  commandInstance: TestingModule;
  errorLogMock: Stub<Console['log']>;
}>('OutputConfig Test suite');

OutputConfigSuite.before(async (context) => {
  context.errorLogMock = spy();
  context.commandInstance = await CommandTestFactory.createTestingCommand(
    {
      imports: [RootModule],
    },
    {
      outputConfiguration: {
        writeErr: (msg) => context.errorLogMock.handler(msg),
      },
      serviceErrorHandler: (err) => {
        throw err;
      },
    },
  ).compile();
});

OutputConfigSuite.after.each(({ errorLogMock }) => {
  errorLogMock.reset();
});

OutputConfigSuite(
  'outputConfig should be use in the root command',
  async ({ commandInstance, errorLogMock }) => {
    const exitSpy = stubMethod(process, 'exit');
    // unknown command, should trigger an error
    await CommandTestFactory.run(commandInstance, ['unknown']);
    equal(
      errorLogMock.firstCall?.args[0],
      `error: unknown command 'unknown'\n`,
    );
    exitSpy.restore();
  },
);

OutputConfigSuite(
  'outputConfig should have been passed down to subcommands',
  async ({ commandInstance, errorLogMock }) => {
    const exitSpy = stubMethod(process, 'exit');
    // no args given, should trigger an error
    await CommandTestFactory.run(commandInstance, ['basic']);
    equal(
      errorLogMock.firstCall?.args[0],
      `error: required option '-n, --number <number>' not specified\n`,
    );
    exitSpy.restore();
  },
);
