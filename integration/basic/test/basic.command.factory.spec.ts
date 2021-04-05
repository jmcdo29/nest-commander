import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import { LogService } from '../../common/log.service';
import { RootModule } from '../src/root.module';

describe('Basic Command With Factory', () => {
  const logMock = jest.fn();
  let commandInstance: TestingModule;

  const args = ['basic', 'test'];

  beforeAll(async () => {
    commandInstance = await CommandTestFactory.createTestingCommand({
      imports: [RootModule],
    })
      .overrideProvider(LogService)
      .useValue({ log: logMock })
      .compile();
  });

  describe('flags', () => {
    it.each`
      flagAndVal            | expected
      ${['--string=hello']} | ${{ string: 'hello' }}
      ${['-s', 'goodbye']}  | ${{ string: 'goodbye' }}
      ${['--number=10']}    | ${{ number: 10 }}
      ${['-n', '5']}        | ${{ number: 5 }}
      ${['--boolean=true']} | ${{ boolean: true }}
      ${['-b', 'false']}    | ${{ boolean: false }}
    `(
      '$flagAndVal \tlogs $expected',
      async ({ flagAndVal, expected }: { flagAndVal: string[]; expected: Record<string, any> }) => {
        await CommandTestFactory.run(commandInstance, [...args, ...flagAndVal]);
        expect(logMock).toBeCalledWith({ param: ['test'], ...expected });
      },
    );
  });
});
