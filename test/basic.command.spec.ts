import { CommandFactory } from '../src';
import { RootModule } from './root.module';
import { commandMock, setArgv } from './utils';

describe('Basic Command', () => {
  let logSpy: jest.SpyInstance;

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
      commandMock({ string: 'hello' }, logSpy);
    });
    it('should work for basic -s', async () => {
      setArgv('-s', 'goodbye');
      await CommandFactory.run(RootModule);
      commandMock({ string: 'goodbye' }, logSpy);
    });
  });
  describe('--number', () => {
    it('should work for basic --number', async () => {
      setArgv('--number=10');
      await CommandFactory.run(RootModule);
      commandMock({ number: 10 }, logSpy);
    });
    it('should work for basic -n', async () => {
      setArgv('-n', '5');
      await CommandFactory.run(RootModule);
      commandMock({ number: 5 }, logSpy);
    });
  });
  describe('--boolean', () => {
    it('should work for basic --boolean', async () => {
      setArgv('--boolean=true');
      await CommandFactory.run(RootModule);
      commandMock({ boolean: true }, logSpy);
    });
    it('should work for basic -b', async () => {
      setArgv('-b', 'false');
      await CommandFactory.run(RootModule);
      commandMock({ boolean: false }, logSpy);
    });
  });
});
