import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import { LogService } from '../../common/log.service';
import { MultipleCommandModule } from '../src/root.module';

describe('Multiple Commands', () => {
  const logSpy = jest.fn();
  let commandInstance: TestingModule;

  beforeAll(async () => {
    commandInstance = await CommandTestFactory.createTestingCommand({
      imports: [MultipleCommandModule],
    })
      .overrideProvider(LogService)
      .useValue({ log: logSpy })
      .compile();
  });

  afterEach(() => {
    logSpy.mockClear();
  });

  it.each`
    command      | expected
    ${'foo'}     | ${'foo'}
    ${'bar'}     | ${'bar'}
    ${undefined} | ${'foo'}
  `(
    'call $command expect $expected',
    async ({
      command,
      expected,
    }: {
      command: 'bar' | 'foo' | undefined;
      expected: 'bar' | 'foo';
    }) => {
      await CommandTestFactory.run(commandInstance, command ? [command] : undefined);
      expect(logSpy).toBeCalledWith(expected);
    },
  );
});
