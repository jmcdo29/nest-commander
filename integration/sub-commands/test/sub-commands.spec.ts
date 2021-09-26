import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import { LogService } from '../../common/log.service';
import { NestedModule } from '../src/nested.module';

describe('Sub Commands', () => {
  let commandModule: TestingModule;
  const logMock: jest.Mock = jest.fn();

  beforeAll(async () => {
    commandModule = await CommandTestFactory.createTestingCommand({
      imports: [NestedModule],
    })
      .overrideProvider(LogService)
      .useValue({
        log: logMock,
      })
      .compile();
  });

  afterEach(() => {
    logMock.mockReset();
  });
  it.each`
    command
    ${'top'}
    ${'top mid-1'}
    ${'top mid-1 bottom'}
    ${'top mid-2'}
  `('should run the $command command', async ({ command }: { command: string }) => {
    await CommandTestFactory.run(commandModule, [command]);
    expect(logMock).toBeCalledWith(`${command} command`);
  });
  it.each`
    command
    ${'mid-1'}
    ${'mid-2'}
    ${'bottom'}
  `('should  error on $command', async ({ command }: { command: string }) => {
    await expect(CommandTestFactory.run(commandModule, [command])).resolves.toBeUndefined();
    expect(logMock).toBeCalledTimes(0);
  });
});
