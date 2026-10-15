import { stubMethod } from 'hanbi';
import { CommandFactory } from 'nest-commander';
import { CommanderError } from 'commander';
import { join } from 'path';
import { suite } from 'uvu';
import { equal, is } from 'uvu/assert';
import { RootModule } from '../src/root.module';

export const RequiredOptionErrorHandlerSuite = suite<{
  handled: Error[];
}>('Required Option Error Handler');

RequiredOptionErrorHandlerSuite.before.each((context) => {
  context.handled = [];
  process.argv = [
    process.argv[0],
    join(__dirname, 'basic.command.js'),
    'required-option',
  ];
});

RequiredOptionErrorHandlerSuite(
  'calls the errorHandler instead of exiting when a required option is missing',
  async ({ handled }) => {
    const exitSpy = stubMethod(process, 'exit');
    const stdErrSpy = stubMethod(process.stderr, 'write');
    try {
      await CommandFactory.run(RootModule, {
        errorHandler: (err) => {
          handled.push(err);
        },
      });
    } finally {
      exitSpy.restore();
      stdErrSpy.restore();
    }
    equal(exitSpy.callCount, 1);
    equal(handled.length, 1);
    is(
      (handled[0] as CommanderError).code,
      'commander.missingMandatoryOptionValue',
    );
    // commander calls `process.exit` right after the callback returns, which is
    // why a handler that wants a different exit code has to exit itself.
    equal(exitSpy.firstCall?.args, [1]);
  },
);
