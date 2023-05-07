import { TestingModule } from '@nestjs/testing';
import { spy, Stub, stubMethod } from 'hanbi';
import { CommandTestFactory } from 'nest-commander-testing';
import { Callback, suite, Test } from 'uvu';
import { equal, match } from 'uvu/assert';
import { LogService } from '../../common/log.service';
import { FooModule } from '../src/foo.module';

const shouldAddHelp = <T>(suite: Test<T>, placement: string, fn: Callback<T>) =>
  suite(`should add help ${placement} the regular help`, fn);

const argsBuilder = (name: string): string[] => {
  return [name, '-h'];
};

const exitCalledWithZero = (spy: Stub<typeof process.exit>) => {
  equal(spy.firstCall?.args[0], 0);
};

const matchUsage = (spyVal: string[], position: string) => {
  match(spyVal[0], new RegExp(`Usage: .+\\w ${position} \\[options\\]`));
};

export const HelpSuite = suite<{
  exitSpy: Stub<typeof process.exit>;
  stdoutSpy: Stub<typeof process.stdout.write>;
  commandInstance: TestingModule;
}>('Command with Custom Help');
HelpSuite.before(async (context) => {
  stubMethod(process.stderr, 'write');
  context.exitSpy = stubMethod(process, 'exit');
  context.stdoutSpy = stubMethod(process.stdout, 'write');
  context.commandInstance = await CommandTestFactory.createTestingCommand({
    imports: [FooModule],
  })
    .overrideProvider(LogService)
    .useValue({ log: spy().handler })
    .compile();
});
HelpSuite.before.each(({ exitSpy, stdoutSpy }) => {
  exitSpy.reset();
  stdoutSpy.reset();
});
HelpSuite.after(({ exitSpy, stdoutSpy }) => {
  exitSpy.restore();
  stdoutSpy.restore();
});
shouldAddHelp(
  HelpSuite,
  'before',
  async ({ commandInstance, stdoutSpy, exitSpy }) => {
    await CommandTestFactory.run(commandInstance, argsBuilder('before'));
    equal(
      stdoutSpy.firstCall?.args[0],
      `before help
`,
    );
    const stdoutCall: string[] = stdoutSpy
      .getCall(1)
      ?.args[0]?.toString()
      .split('\n');
    matchUsage(stdoutCall, 'before');
    stdoutCall.shift();
    equal(
      stdoutCall.join('\n'),
      `
before

Options:
  -h, --help  display help for command
`,
    );
    exitCalledWithZero(exitSpy);
  },
);
shouldAddHelp(
  HelpSuite,
  'beforeAll',
  async ({ commandInstance, stdoutSpy, exitSpy }) => {
    await CommandTestFactory.run(commandInstance, argsBuilder('before-all'));
    equal(
      stdoutSpy.firstCall?.args[0],
      `before all help
`,
    );
    const stdoutCall: string[] = stdoutSpy
      .getCall(1)
      .args[0].toString()
      .split('\n');
    matchUsage(stdoutCall, 'before-all');
    stdoutCall.shift();
    equal(
      stdoutCall.join('\n'),
      `
before-all

Options:
  -h, --help  display help for command
`,
    );
    exitCalledWithZero(exitSpy);
  },
);

shouldAddHelp(
  HelpSuite,
  'beforeAll and before',
  async ({ commandInstance, stdoutSpy, exitSpy }) => {
    await CommandTestFactory.run(
      commandInstance,
      argsBuilder('before-before-all'),
    );
    equal(
      stdoutSpy.firstCall?.args[0],
      `before all help
`,
    );
    equal(
      stdoutSpy.getCall(1).args[0],
      `before help
`,
    );
    const stdoutCall: string[] = stdoutSpy
      .getCall(2)
      .args[0].toString()
      .split('\n');
    matchUsage(stdoutCall, 'before-before-all');
    stdoutCall.shift();
    equal(
      stdoutCall.join('\n'),
      `
before-before-all

Options:
  -h, --help  display help for command
`,
    );
    exitCalledWithZero(exitSpy);
  },
);
shouldAddHelp(
  HelpSuite,
  'before and after',
  async ({ commandInstance, exitSpy, stdoutSpy }) => {
    await CommandTestFactory.run(commandInstance, argsBuilder('before-after'));
    equal(
      stdoutSpy.firstCall?.args[0],
      `before help
`,
    );
    const stdoutCall: string[] = stdoutSpy
      .getCall(1)
      .args[0].toString()
      .split('\n');
    matchUsage(stdoutCall, 'before-after');
    stdoutCall.shift();
    equal(
      stdoutCall.join('\n'),
      `
before-after

Options:
  -h, --help  display help for command
`,
    );
    equal(
      stdoutSpy.getCall(2).args[0],
      `after help
`,
    );
    exitCalledWithZero(exitSpy);
  },
);
shouldAddHelp(
  HelpSuite,
  'after',
  async ({ commandInstance, exitSpy, stdoutSpy }) => {
    await CommandTestFactory.run(commandInstance, argsBuilder('after'));
    const stdoutCall: string[] =
      stdoutSpy.firstCall?.args[0].toString().split('\n') ?? [];
    matchUsage(stdoutCall, 'after');
    stdoutCall.shift();
    equal(
      stdoutCall.join('\n'),
      `
after

Options:
  -h, --help  display help for command
`,
    );
    equal(
      stdoutSpy.getCall(1).args[0],
      `after help
`,
    );

    exitCalledWithZero(exitSpy);
  },
);
shouldAddHelp(
  HelpSuite,
  'afterAll',
  async ({ commandInstance, exitSpy, stdoutSpy }) => {
    await CommandTestFactory.run(commandInstance, argsBuilder('after-all'));
    const stdoutCall: string[] =
      stdoutSpy.firstCall?.args[0].toString().split('\n') ?? [];
    matchUsage(stdoutCall, 'after-all');
    stdoutCall.shift();
    equal(
      stdoutCall.join('\n'),
      `
after all

Options:
  -h, --help  display help for command
`,
    );
    equal(
      stdoutSpy.getCall(1).args[0],
      `after all help
`,
    );
    exitCalledWithZero(exitSpy);
  },
);
shouldAddHelp(
  HelpSuite,
  'after and afterAll',
  async ({ commandInstance, exitSpy, stdoutSpy }) => {
    await CommandTestFactory.run(
      commandInstance,
      argsBuilder('after-after-all'),
    );
    const stdoutCall: string[] =
      stdoutSpy.firstCall?.args[0].toString().split('\n') ?? [];
    matchUsage(stdoutCall, 'after-after-all');
    stdoutCall.shift();
    equal(
      stdoutCall.join('\n'),
      `
after after all

Options:
  -h, --help  display help for command
`,
    );
    equal(
      stdoutSpy.getCall(1).args[0],
      `after help
`,
    );
    equal(
      stdoutSpy.getCall(2).args[0],
      `after all help
`,
    );
    exitCalledWithZero(exitSpy);
  },
);
shouldAddHelp(
  HelpSuite,
  'in all places with',
  async ({ commandInstance, exitSpy, stdoutSpy }) => {
    await CommandTestFactory.run(commandInstance, argsBuilder('foo'));
    equal(
      stdoutSpy.firstCall?.args[0],
      `before all help
`,
    );
    equal(
      stdoutSpy.getCall(1).args[0],
      `before help
`,
    );
    const stdoutCall: string[] = stdoutSpy
      .getCall(2)
      .args[0].toString()
      .split('\n');
    matchUsage(stdoutCall, 'foo');
    stdoutCall.shift();
    equal(
      stdoutCall.join('\n'),
      `
Options:
  -h, --help  display help for command
`,
    );
    equal(
      stdoutSpy.getCall(3).args[0],
      `after help
`,
    );
    equal(
      stdoutSpy.getCall(4).args[0],
      `after all help
`,
    );
    exitCalledWithZero(exitSpy);
  },
);
