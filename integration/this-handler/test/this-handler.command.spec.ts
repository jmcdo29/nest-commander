import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import { LogService } from '../../common/log.service';
import { ThisHandlerModule } from '../src/this-handler.module';

describe('This Handler', () => {
  const logMock = jest.fn();
  let commandModule: TestingModule;

  beforeAll(async () => {
    commandModule = await CommandTestFactory.createTestingCommand({ imports: [ThisHandlerModule] })
      .overrideProvider(LogService)
      .useValue({ log: logMock })
      .compile();
  });

  afterEach(() => {
    logMock.mockClear();
  });

  it.each`
    flagVal            | expected
    ${['-b']}          | ${'oh HAI'}
    ${['-b', 'hello']} | ${'hello'}
  `(
    'should call this-handler with arg $flagVal and log $expected',
    async ({ flagVal, expected }: { flagVal: string[]; expected: string }) => {
      await CommandTestFactory.run(commandModule, ['this-handler'].concat(flagVal));
      expect(logMock).toBeCalledWith({ basic: expected });
    },
  );
});
