import { CommandFactory } from 'nest-commander';
import { join } from 'path';
import { RootModule } from '../src/root.module';
import { commandMock, setArgv } from './utils';

console.log = jest.fn();

const outputHelp = `Usage: main-error-handler [options] [command]

Options:
  -h, --help       display help for command

Commands:
  basic [options]  A parameter parse
  help [command]   display help for command
(outputHelp)
`;

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
  // these tests need to be skipped because of  how `process.exit` works within jest.
  // I know what these are testing works, it just sucks to not be able to easily test them
  describe.skip('Unknown command/print help', () => {
    it('should not throw an error', async () => {
      const exit = process.exit;
      // @ts-expect-error need to override process.exit
      jest.spyOn(process, 'exit').mockImplementationOnce((code) => {
        expect(code).toBe(0);
      });
      process.argv = [process.argv[0], join(__dirname, 'basic.command.js'), '--help'];
      await CommandFactory.run(RootModule);
      const stdOutSpy = jest.spyOn(process.stdout, 'write');
      expect(stdOutSpy).toBeCalledWith(outputHelp);
      process.exit = exit;
    });
    it('should not throw an error', async () => {
      const exit = process.exit;
      // @ts-expect-error need to override process.exit
      jest.spyOn(process, 'exit').mockImplementationOnce((code) => {
        expect(code).toBe(0);
      });
      process.argv = [process.argv[0], join(__dirname, 'basic.command.js'), '--help'];
      await CommandFactory.run(RootModule, {
        errorHandler: (err) => {
          console.log(err.message);
          process.exit(0);
        },
      });
      const stdOutSpy = jest.spyOn(process.stdout, 'write');
      expect(stdOutSpy).toBeCalledWith(outputHelp);
      process.exit = exit;
    });
  });
});
