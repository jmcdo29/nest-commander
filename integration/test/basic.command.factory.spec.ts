import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nestjs-commander-testing';
import { LogService } from '../src/log.service';
import { RootModule } from '../src/root.module';
import { commandMock, setArgv } from './utils';

describe('Basic Command', () => {
  const logMock = jest.fn();
  let commandInstance: TestingModule;

  beforeAll(async () => {
    commandInstance = await CommandTestFactory.createTestingCommand({
      imports: [RootModule],
    })
      .overrideProvider(LogService)
      .useValue({ log: logMock })
      .compile();
  });

  describe('--string', () => {
    it('should work for basic --string', async () => {
      setArgv('--string=hello');
      await CommandTestFactory.run(commandInstance);
      commandMock({ string: 'hello' }, logMock);
    });
    it('should work for basic -s', async () => {
      setArgv('-s', 'goodbye');
      await CommandTestFactory.run(commandInstance);
      commandMock({ string: 'goodbye' }, logMock);
    });
  });
  describe('--number', () => {
    it('should work for basic --number', async () => {
      setArgv('--number=10');
      await CommandTestFactory.run(commandInstance);
      commandMock({ number: 10 }, logMock);
    });
    it('should work for basic -n', async () => {
      setArgv('-n', '5');
      await CommandTestFactory.run(commandInstance);
      commandMock({ number: 5 }, logMock);
    });
  });
  describe('--boolean', () => {
    it('should work for basic --boolean', async () => {
      setArgv('--boolean=true');
      await CommandTestFactory.run(commandInstance);
      commandMock({ boolean: true }, logMock);
    });
    it('should work for basic -b', async () => {
      setArgv('-b', 'false');
      await CommandTestFactory.run(commandInstance);
      commandMock({ boolean: false }, logMock);
    });
  });
});
