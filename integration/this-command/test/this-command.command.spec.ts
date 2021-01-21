import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import { LogService } from '../../common/log.service';
import { ThisCommandModule } from '../src/this-command.module';

describe('This Handler', () => {
  const logMock = jest.fn();
  let commandModule: TestingModule;

  beforeAll(async () => {
    commandModule = await CommandTestFactory.createTestingCommand({ imports: [ThisCommandModule] })
      .overrideProvider(LogService)
      .useValue({ log: logMock })
      .compile();
  });

  afterEach(() => {
    logMock.mockClear();
  });
  it.only('return true', () => {
    expect(true).toBe(true);
  });

  it('should call this-handler with arg hello', async () => {
    await CommandTestFactory.run(commandModule, ['this-command', 'hello']);
    expect(logMock).toBeCalledWith(['hello']);
  });
});
