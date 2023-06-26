import { CommandTestFactory } from 'nest-commander-testing';
import { stubMethod } from 'hanbi';
import { suite } from 'uvu';
import { equal } from 'uvu/assert';
import { RootModule } from '../src/root.module';

export const VersionOptionSuite = suite('Version option');

VersionOptionSuite('Running version, and version enabled', async () => {
  const version = '1.0.0';
  const commandInstance = await CommandTestFactory.createTestingCommand(
    {
      imports: [RootModule],
    },
    {
      version,
    },
  ).compile();
  let stdoutSpy = stubMethod(process.stdout, 'write');
  const exitSpy = stubMethod(process, 'exit');

  await CommandTestFactory.run(commandInstance, ['--version']);
  let stdOutResult = stdoutSpy.firstCall?.args[0] as string;
  equal(stdOutResult.includes(version), true);

  stdoutSpy.restore();
  stdoutSpy = stubMethod(process.stdout, 'write');

  await CommandTestFactory.run(commandInstance, ['-V']);
  stdOutResult = stdoutSpy.firstCall?.args[0] as string;
  equal(stdOutResult.includes(version), true);

  stdoutSpy.restore();
  exitSpy.restore();
});

VersionOptionSuite(
  'Running version, but version option is disabled',
  async () => {
    const commandInstance = await CommandTestFactory.createTestingCommand(
      {
        imports: [RootModule],
      },
      {
        // no version option
      },
    ).compile();

    const stderrSpy = stubMethod(process.stderr, 'write');
    const exitSpy = stubMethod(process, 'exit');

    await CommandTestFactory.run(commandInstance, ['--version']);

    // error: unknown option '--version'
    equal(stderrSpy.firstCall?.args[0], `error: unknown option '--version'\n`);

    exitSpy.restore();
    stderrSpy.restore();
  },
);
