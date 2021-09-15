import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import { LogService } from '../../common/log.service';
import { FooModule } from '../src/foo.module';

const shouldAddHelp = (placement: string, fn: jest.ProvidesCallback) =>
  it(`should add help ${placement} the regular help`, fn);

const argsBuilder = (name: string): string[] => {
  return [name, '-h'];
};

describe('Commands with Custom Help', () => {
  let stdout: NodeJS.WriteStream & {
    fd: 1;
  };
  let exit: (_code?: number) => never;
  let exitSpy: jest.SpyInstance;
  let stdoutSpy: jest.SpyInstance;
  const logMock = jest.fn();
  let commandModule: TestingModule;

  beforeAll(async () => {
    commandModule = await CommandTestFactory.createTestingCommand({
      imports: [FooModule],
    })
      .overrideProvider(LogService)
      .useValue({ log: logMock })
      .compile();
    stdout = process.stdout;
    exit = process.exit;
  });

  beforeEach(() => {
    exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => {
      /* no op */
    }) as unknown as any);
    stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    stdoutSpy.mockClear();
    logMock.mockClear();
  });

  afterAll(() => {
    process.stdout = stdout;
    process.exit = exit;
  });
  shouldAddHelp('before', async () => {
    await CommandTestFactory.run(commandModule, argsBuilder('before'));
    expect(stdoutSpy.mock.calls[0][0]).toEqual(`before help
`);
    const stdoutCall: string[] = stdoutSpy.mock.calls[1][0].split('\n');
    expect(stdoutCall[0]).toEqual(expect.stringMatching(/Usage: .+\w before \[options\]/));
    stdoutCall.shift();
    expect(stdoutCall.join('\n')).toBe(`
before

Options:
  -h, --help  display help for command
`);
    expect(exitSpy).toBeCalledWith(0);
  });
  shouldAddHelp('beforeAll', async () => {
    await CommandTestFactory.run(commandModule, argsBuilder('before-all'));
    expect(stdoutSpy).toBeCalledWith(`before all help
`);
    const stdoutCall: string[] = stdoutSpy.mock.calls[1][0].split('\n');
    expect(stdoutCall[0]).toEqual(expect.stringMatching(/Usage: .+\w before-all \[options\]/));
    stdoutCall.shift();
    expect(stdoutCall.join('\n')).toBe(`
before-all

Options:
  -h, --help  display help for command
`);
    expect(exitSpy).toBeCalledWith(0);
  });
  shouldAddHelp('beforeAll and before', async () => {
    await CommandTestFactory.run(commandModule, argsBuilder('before-before-all'));
    expect(stdoutSpy).toBeCalledWith(`before all help
`);
    expect(stdoutSpy).toBeCalledWith(`before help
`);
    const stdoutCall: string[] = stdoutSpy.mock.calls[2][0].split('\n');
    expect(stdoutCall[0]).toEqual(
      expect.stringMatching(/Usage: .+\w before-before-all \[options\]/),
    );
    stdoutCall.shift();
    expect(stdoutCall.join('\n')).toBe(`
before-before-all

Options:
  -h, --help  display help for command
`);
    expect(exitSpy).toBeCalledWith(0);
  });
  shouldAddHelp('before and after', async () => {
    await CommandTestFactory.run(commandModule, argsBuilder('before-after'));
    expect(stdoutSpy).toBeCalledWith(`before help
`);
    const stdoutCall: string[] = stdoutSpy.mock.calls[1][0].split('\n');
    expect(stdoutCall[0]).toEqual(expect.stringMatching(/Usage: .+\w before-after \[options\]/));
    stdoutCall.shift();
    expect(stdoutCall.join('\n')).toBe(`
before-after

Options:
  -h, --help  display help for command
`);
    expect(stdoutSpy).toBeCalledWith(`after help
`);
    expect(exitSpy).toBeCalledWith(0);
  });
  shouldAddHelp('after', async () => {
    await CommandTestFactory.run(commandModule, argsBuilder('after'));
    const stdoutCall: string[] = stdoutSpy.mock.calls[0][0].split('\n');
    expect(stdoutCall[0]).toEqual(expect.stringMatching(/Usage: .+\w after \[options\]/));
    stdoutCall.shift();
    expect(stdoutCall.join('\n')).toBe(`
after

Options:
  -h, --help  display help for command
`);
    expect(stdoutSpy).toBeCalledWith(`after help
`);

    expect(exitSpy).toBeCalledWith(0);
  });
  shouldAddHelp('afterAll', async () => {
    await CommandTestFactory.run(commandModule, argsBuilder('after-all'));
    const stdoutCall: string[] = stdoutSpy.mock.calls[0][0].split('\n');
    expect(stdoutCall[0]).toEqual(expect.stringMatching(/Usage: .+\w after-all \[options\]/));
    stdoutCall.shift();
    expect(stdoutCall.join('\n')).toBe(`
after all

Options:
  -h, --help  display help for command
`);
    expect(stdoutSpy).toBeCalledWith(`after all help
`);
    expect(exitSpy).toBeCalledWith(0);
  });
  shouldAddHelp('after and afterAll', async () => {
    await CommandTestFactory.run(commandModule, argsBuilder('after-after-all'));
    const stdoutCall: string[] = stdoutSpy.mock.calls[0][0].split('\n');
    expect(stdoutCall[0]).toEqual(expect.stringMatching(/Usage: .+\w after-after-all \[options\]/));
    stdoutCall.shift();
    expect(stdoutCall.join('\n')).toBe(`
after after all

Options:
  -h, --help  display help for command
`);
    expect(stdoutSpy).toBeCalledWith(`after help
`);
    expect(stdoutSpy).toBeCalledWith(`after all help
`);
    expect(exitSpy).toBeCalledWith(0);
  });
  shouldAddHelp('in all places with', async () => {
    await CommandTestFactory.run(commandModule, argsBuilder('foo'));
    expect(stdoutSpy).toBeCalledWith(`before all help
`);
    expect(stdoutSpy).toBeCalledWith(`before help
`);
    const stdoutCall: string[] = stdoutSpy.mock.calls[2][0].split('\n');
    expect(stdoutCall[0]).toEqual(expect.stringMatching(/Usage: .+\w foo \[options\]/));
    stdoutCall.shift();
    expect(stdoutCall.join('\n')).toBe(`
Options:
  -h, --help  display help for command
`);
    expect(stdoutSpy).toBeCalledWith(`after help
`);
    expect(stdoutSpy).toBeCalledWith(`after all help
`);
    expect(exitSpy).toBeCalledWith(0);
  });
});
