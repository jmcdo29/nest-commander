import { CommandTestFactory } from 'nest-commander-testing';
import { suite } from 'uvu';
import { ok, unreachable } from 'uvu/assert';
import { DotModule } from '../src/dot.module';

export const DotCommandSuite = suite('DotCommand');
DotCommandSuite('Command does not throw error', async () => {
  try {
    const commandInstance = await CommandTestFactory.createTestingCommand({
      imports: [DotModule],
    }).compile();
    await CommandTestFactory.run(commandInstance);
    ok(true);
  } catch (err) {
    unreachable('If we got here the .command property was not populated');
  }
});
