import { exec } from 'child_process';
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
  describe('Unknown command/print help', () => {
    it('should not throw an error', (done) => {
      exec(
        `${join(__dirname, '..', 'node_modules', '.bin', 'ts-node')} ${join(
          __dirname,
          '..',
          'src',
          'main.ts',
        )} --help`,
        (err) => {
          process.stdout.write(err?.message || '');
          expect(err?.code).toBeFalsy();
          done();
        },
      );
    });
    it('should not throw an error', (done) => {
      exec(
        `${join(__dirname, '..', 'node_modules', '.bin', 'ts-node')} ${join(
          __dirname,
          '..',
          'src',
          'main-error-handler.ts',
        )} --help`,
        (err, stdout) => {
          expect(err?.code).toBeFalsy();
          expect(stdout).toEqual(outputHelp);
          done();
        },
      );
    });
  });
});
