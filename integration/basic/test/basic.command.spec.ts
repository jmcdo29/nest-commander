import { Stub, stubMethod } from 'hanbi';
import { CommandFactory } from 'nest-commander';
import { join } from 'path';
import { suite } from 'uvu';
import { equal } from 'uvu/assert';
import { RootModule } from '../src/root.module';
import { ExpectedParam, setArgv } from './utils';

const outputHelp = `Usage: basic.command [options] [command]

Options:
  -h, --help       display help for command

Commands:
  basic [options]  A parameter parse
  help [command]   display help for command
`;

const logSpySuite = (name: string) => {
  const lgSuite = suite<{ logSpy: Stub<Console['log']> }>(name);
  lgSuite.before((context) => {
    context.logSpy = stubMethod(console, 'log');
  });
  lgSuite.after.each(({ logSpy }) => {
    logSpy.reset();
  });
  return lgSuite;
};

export function commandMock(expected: ExpectedParam, spy: Stub<Console['log']>): void {
  equal(spy.firstCall?.args[0], { param: ['test'], ...expected });
}

export const StringCommandSuite = logSpySuite('String Command');
StringCommandSuite('--string=hello', async ({ logSpy }) => {
  setArgv('--string=hello');
  await CommandFactory.run(RootModule);
  commandMock({ string: 'hello' }, logSpy);
});
StringCommandSuite('-s goodbye', async ({ logSpy }) => {
  setArgv('-s', 'goodbye');
  await CommandFactory.run(RootModule);
  commandMock({ string: 'goodbye' }, logSpy);
});

export const NumberCommandSuite = logSpySuite('Number Command');
NumberCommandSuite(' --number=10', async ({ logSpy }) => {
  setArgv('--number=10');
  await CommandFactory.run(RootModule);
  commandMock({ number: 10 }, logSpy);
});
NumberCommandSuite('-n 5', async ({ logSpy }) => {
  setArgv('-n', '5');
  await CommandFactory.run(RootModule);
  commandMock({ number: 5 }, logSpy);
});

export const BooleanCommandSuite = logSpySuite('Boolean Command');
BooleanCommandSuite('--boolean=true', async ({ logSpy }) => {
  setArgv('--boolean=true');
  await CommandFactory.run(RootModule);
  commandMock({ boolean: true }, logSpy);
});
BooleanCommandSuite('-b false', async ({ logSpy }) => {
  setArgv('-b', 'false');
  await CommandFactory.run(RootModule);
  commandMock({ boolean: false }, logSpy);
});

export const UnknownCommandSuite = logSpySuite('Unknown Command/Print Help');
UnknownCommandSuite('should not throw an error', async () => {
  const exitSpy = stubMethod(process, 'exit');
  process.argv = [process.argv[0], join(__dirname, 'basic.command.js'), '--help'];

  const stdErrSpy = stubMethod(process.stderr, 'write');
  const stdoutSpy = stubMethod(process.stdout, 'write');
  try {
    await CommandFactory.run(RootModule);
  } finally {
    stdErrSpy.restore();
    stdoutSpy.restore();
    equal(stdErrSpy.firstCall?.args, ["error: unknown option '--help'\n"]);
    equal(stdoutSpy.firstCall?.args, [outputHelp]);
    exitSpy.restore();
  }
});
UnknownCommandSuite('should not throw an error', async () => {
  const exitSpy = stubMethod(process, 'exit');
  process.argv = [process.argv[0], join(__dirname, 'basic.command.js'), '--help'];

  const stdErrSpy = stubMethod(process.stderr, 'write');
  const stdoutSpy = stubMethod(process.stdout, 'write');
  try {
    await CommandFactory.run(RootModule, {
      errorHandler: (err) => {
        console.log(err.message);
        process.exit(0);
      },
    });
  } finally {
    stdErrSpy.restore();
    stdoutSpy.restore();
    equal(stdErrSpy.firstCall?.args, ["error: unknown option '--help'\n"]);
    equal(stdoutSpy.firstCall?.args, [outputHelp]);
    exitSpy.restore();
  }
});
