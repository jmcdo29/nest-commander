import { TestingModule } from '@nestjs/testing';
import { stubMethod } from 'hanbi';
import { CommandTestFactory } from 'nest-commander-testing';
import { suite } from 'uvu';
import { equal } from 'uvu/assert';
import { PizzaModule } from '../src/pizza.module';

export const PizzaSuite = suite<{ commandInstance: TestingModule }>(
  'Pizza Command',
);
PizzaSuite.before(async (context) => {
  context.commandInstance = await CommandTestFactory.createTestingCommand({
    imports: [PizzaModule],
  }).compile();
});
PizzaSuite(
  'each option should be set-able from inquirer',
  async ({ commandInstance }) => {
    CommandTestFactory.setAnswers([
      'p',
      true,
      '9999999999',
      'Large',
      42,
      'Coke',
      'Nope, all good!',
    ]);
    const logMock = stubMethod(console, 'log');
    await CommandTestFactory.run(commandInstance);
    equal(logMock.firstCall?.args[0], {
      toppings: 'PepperoniCheese',
      toBeDelivered: true,
      phone: '9999999999',
      size: 'large',
      quantity: 42,
      beverage: 'Coke',
      comments: 'Nope, all good!',
    });
  },
);
