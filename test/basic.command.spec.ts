import { join } from 'path';
import { CommandFactory } from '../src';
import { RootModule } from './root.module';

type ExpectedParam =
  | Record<'string', string>
  | Record<'number', number>
  | Record<'boolean', boolean>;

const helpFixture =`'Usage: basic.command basic [options]

A parameter parse

Options:
  -n, --number [number]    A basic number parser
  -s, --string [string]    A string return
  -b, --boolean [boolean]  A boolean parser
  -h, --help               display help for command';
`;
describe('Basic Command', () => {
  const [firstArg] = process.argv;
  // overwrite the second arg to make commander happy
  const secondArg = join(__dirname, 'basic.command.js');
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
      await CommandFactory.run(RootModule);
      commandMock({ string: 'hello' });
    });
    it('should work for basic -s', async () => {
      setArgv('-s', 'goodbye');
      await CommandFactory.run(RootModule);
      commandMock({ string: 'goodbye' });
    });
  });
  describe('--number', () => {
    it('should work for basic --number', async () => {
      setArgv('--number=10');
      await CommandFactory.run(RootModule);
      commandMock({ number: 10 });
    });
    it('should work for basic -n', async () => {
      setArgv('-n', '5');
      await CommandFactory.run(RootModule);
      commandMock({ number: 5 });
    });
  });
  describe('--boolean', () => {
    it('should work for basic --boolean', async () => {
      setArgv('--boolean=true');
      await CommandFactory.run(RootModule);
      commandMock({ boolean: true });
    });
    it('should work for basic -b', async () => {
      setArgv('-b', 'false');
      await CommandFactory.run(RootModule);
      commandMock({ boolean: false });
    });
  });
});
