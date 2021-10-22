import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import { LogService } from '../../common/log.service';
import { NestedModule } from '../src/nested.module';

describe('Sub Commands', () => {
  let commandModule: TestingModule;
  const logMock: jest.Mock = jest.fn();
  const exitMock: jest.Mock = jest.fn();
  const trueExit = process.exit;

  beforeAll(async () => {
    commandModule = await CommandTestFactory.createTestingCommand({
      imports: [NestedModule],
    })
      .overrideProvider(LogService)
      .useValue({
        log: logMock,
      })
      .compile();
    process.exit = exitMock as never;
  });

  afterEach(() => {
    logMock.mockReset();
    exitMock.mockReset();
  });

  afterAll(() => {
    process.exit = trueExit;
  });
  it.each`
    command
    ${['top']}
    ${['top', 'mid-1']}
    ${['top', 'mid-1', 'bottom']}
    ${['top', 'mid-2']}
  `('should run the $command command', async ({ command }: { command: string[] }) => {
    await CommandTestFactory.run(commandModule, [...command]);
    expect(logMock).toBeCalledWith(`${command.join(' ')} command`);
  });
  it('should still be able to pass arguments', async () => {
    await CommandTestFactory.run(commandModule, ['top', 'hello!']);
    expect(logMock).toBeCalledTimes(2);
    expect(logMock).toHaveBeenNthCalledWith(1, 'top command');
    expect(logMock).toHaveBeenNthCalledWith(2, ['hello!']);
  });
  it.each`
    command
    ${'mid-1'}
    ${'mid-2'}
    ${'bottom'}
  `('should  error on $command', async ({ command }: { command: string }) => {
    await expect(CommandTestFactory.run(commandModule, [command])).resolves.toBeUndefined();
    expect(logMock).toBeCalledTimes(0);
    expect(exitMock).toBeCalledWith(1);
  });
  it('should be able to call ntop and get help', async () => {
    const writeSpy = jest.spyOn(process.stderr, 'write');
    await CommandTestFactory.run(commandModule, ['ntop']);
    const stderrCall = (writeSpy.mock.calls[0][0] as string).split('\n');
    expect(stderrCall[0]).toEqual(
      expect.stringMatching(/Usage: .+\w ntop \[options\] \[command\]/),
    );
    stderrCall.shift();
    expect(stderrCall.join('\n')).toBe(`
Options:
  -h, --help      display help for command

Commands:
  mid-1
  mid-2
  help [command]  display help for command
`);
  });
});
