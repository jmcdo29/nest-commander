import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import { PizzaModule } from '../src/pizza.module';

describe('Pizza Command', () => {
  let command: TestingModule;

  beforeAll(async () => {
    command = await CommandTestFactory.createTestingCommand({
      imports: [PizzaModule],
    }).compile();
  });

  it('should allow for each option to come from inquirer', async () => {
    CommandTestFactory.setAnswer(['p', true, '9999999999', 'Large', 42, 'Coke', 'Nope, all good!']);
    const logMock = jest.fn();
    console.log = logMock;
    await CommandTestFactory.run(command);
    expect(logMock).toBeCalledWith({
      toppings: 'PepperoniCheese',
      toBeDelivered: true,
      phone: '9999999999',
      size: 'large',
      quantity: 42,
      beverage: 'Coke',
      comments: 'Nope, all good!',
    });
  });
});
