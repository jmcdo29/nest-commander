import { CommandModule } from '../src';
import { RootModule } from './root.module';

type ExpectedParam =
  | Record<'string', string>
  | Record<'number', number>
  | Record<'boolean', boolean>;

const helpFixture = 'help';

describe('Basic Command', () => {
  const [firstArg, secondArg] = process.argv;
  let logSpy: jest.SpyInstance;

  function setArgv(...args: string[]) {
    process.argv = [firstArg, secondArg, 'basic', 'test', ...args];
  }
  function commandMock(expected: ExpectedParam): void {
    expect(logSpy).toBeCalledWith({ param: ['test'], ...expected });
  }

  beforeAll(() => {
    logSpy = jest.spyOn(console, 'log');
  });

  afterEach(() => {
    logSpy.mockClear();
  });

  describe('--string', () => {
    it('should work for basic --string', async () => {
      setArgv('--string=hello');
      await CommandModule.run(RootModule);
      commandMock({ string: 'hello' });
    });
    it('should work for basic -s', async () => {
      setArgv('-s', 'goodbye');
      await CommandModule.run(RootModule);
      commandMock({ string: 'goodbye' });
    });
  });
  describe('--number', () => {
    it('should work for basic --number', async () => {
      setArgv('--number=10');
      await CommandModule.run(RootModule);
      commandMock({ number: 10 });
    });
    it('should work for basic -n', async () => {
      setArgv('-n', '5');
      await CommandModule.run(RootModule);
      commandMock({ number: 5 });
    });
  });
  describe('--boolean', () => {
    it('should work for basic --boolean', async () => {
      setArgv('--boolean=true');
      await CommandModule.run(RootModule);
      commandMock({ boolean: true });
    });
    it('should work for basic -b', async () => {
      setArgv('-b', 'false');
      await CommandModule.run(RootModule);
      commandMock({ boolean: false });
    });
  });

  describe('--help', () => {
    it('should report help for --help', async () => {
      setArgv('--help');
      await CommandModule.run(RootModule);
      expect(logSpy).toBeCalledWith(helpFixture);
    });
    it('should report help for -h', async () => {
      setArgv('-h');
      await CommandModule.run(RootModule);
      expect(logSpy).toBeCalledWith(helpFixture);
    });
  });
});
