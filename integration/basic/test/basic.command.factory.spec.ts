import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import { spy, Stub } from 'hanbi';
import { suite } from 'uvu';
import { equal } from 'uvu/assert';
import { LogService } from '../../common/log.service';
import { RootModule } from '../src/root.module';

export const BasicFactorySuite = suite<{
  commandInstance: TestingModule;
  logMock: Stub<Console['log']>;
  args: string[];
}>('Basic Command With Factory');

BasicFactorySuite.before(async (context) => {
  context.logMock = spy();
  context.args = ['basic', 'test'];
  context.commandInstance = await CommandTestFactory.createTestingCommand({
    imports: [RootModule],
  })
    .overrideProvider(LogService)
    .useValue({ log: context.logMock.handler })
    .compile();
});

BasicFactorySuite.after.each(({ logMock }) => {
  logMock.reset();
});

for (const { flagAndVal, expected } of [
  {
    flagAndVal: ['--string=hello'],
    expected: { string: 'hello' },
  },
  {
    flagAndVal: ['-s', 'goodbye'],
    expected: { string: 'goodbye' },
  },
  {
    flagAndVal: ['--number=10'],
    expected: { number: 10 },
  },
  {
    flagAndVal: ['-n', '5'],
    expected: { number: 5 },
  },
  {
    flagAndVal: ['--boolean=true'],
    expected: { boolean: true },
  },
  {
    flagAndVal: ['-b', 'false'],
    expected: { boolean: false },
  },
]) {
  BasicFactorySuite(
    `${flagAndVal} \tlogs ${JSON.stringify(expected)}`,
    async ({ commandInstance, logMock, args }) => {
      await CommandTestFactory.run(commandInstance, [...args, ...flagAndVal]);
      equal(logMock.firstCall?.args[0], { param: ['test'], ...expected });
    },
  );
}
