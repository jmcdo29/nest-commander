import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import { LogService } from '../../common/log.service';
import { HelloCommandModule } from '../src/root.module';

describe('Hello Command', () => {
  const logMock = jest.fn();
  let commandModule: TestingModule;
  beforeEach(async () => {
    commandModule = await CommandTestFactory.createTestingCommand({
      imports: [HelloCommandModule],
    })
      .overrideProvider(LogService)
      .useValue({ log: logMock })
      .compile();
  });

  afterEach(() => {
    logMock.mockReset();
  });

  it.each`
    name      | expected
    ${'Jay'}  | ${'Hello Jay'}
    ${'Test'} | ${'Hello Test'}
  `(
    'should call the hello command with arg $username populated from inquirer',
    async ({ name, expected }: { name: string; expected: string }) => {
      CommandTestFactory.setAnswers(name);
      await CommandTestFactory.run(commandModule);
      expect(logMock).toBeCalledWith(expected);
    },
  );
});
