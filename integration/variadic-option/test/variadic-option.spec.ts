import { TestingModule } from '@nestjs/testing';
import { spy, Stub } from 'hanbi';
import { CommandTestFactory } from 'nest-commander-testing';
import { suite } from 'uvu';
import { equal } from 'uvu/assert';
import { LogService } from '../../common/log.service';
import { VariadicOptionModule } from '../src/variadic-option.module';

export const VariadicOptionSuite = suite<{
  commandInstance: TestingModule;
  logMock: Stub<typeof console.log>;
}>('VariadicOption Suite');

VariadicOptionSuite.before.each(async (context) => {
  context.logMock = spy();
  context.commandInstance = await CommandTestFactory.createTestingCommand({
    imports: [VariadicOptionModule],
  })
    .overrideProvider(LogService)
    .useValue({ log: context.logMock.handler })
    .compile();
});

VariadicOptionSuite(
  'Uses default value when no option is provided',
  async ({ commandInstance, logMock }) => {
    await CommandTestFactory.run(commandInstance);
    equal(logMock.firstCall?.args[0], { locales: ['en'] });
  },
);

VariadicOptionSuite(
  'Replaces default with a single provided value',
  async ({ commandInstance, logMock }) => {
    await CommandTestFactory.run(commandInstance, ['-l', 'fr']);
    equal(logMock.firstCall?.args[0], { locales: ['fr'] });
  },
);

VariadicOptionSuite(
  'Accumulates multiple provided values',
  async ({ commandInstance, logMock }) => {
    await CommandTestFactory.run(commandInstance, ['-l', 'fr', '-l', 'de']);
    equal(logMock.firstCall?.args[0], { locales: ['fr', 'de'] });
  },
);

VariadicOptionSuite(
  'Accumulates three provided values without default prepended',
  async ({ commandInstance, logMock }) => {
    await CommandTestFactory.run(commandInstance, [
      '-l',
      'fr',
      '-l',
      'de',
      '-l',
      'es',
    ]);
    equal(logMock.firstCall?.args[0], { locales: ['fr', 'de', 'es'] });
  },
);

VariadicOptionSuite.run();
