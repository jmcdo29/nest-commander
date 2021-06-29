import { Question, QuestionSet, ValidateFor, WhenFor } from 'nest-commander';

@QuestionSet({ name: 'pizza' })
export class PizzaQuestion {
  @Question({
    type: 'expand',
    name: 'toppings',
    message: 'What about the toppings?',
    choices: [
      {
        key: 'p',
        name: 'Pepperoni and cheese',
        value: 'PepperoniCheese',
      },
      {
        key: 'a',
        name: 'All dressed',
        value: 'alldressed',
      },
      {
        key: 'w',
        name: 'Hawaiian',
        value: 'hawaiian',
      },
    ],
  })
  parseToppings(val: string) {
    return val;
  }

  @Question({
    type: 'confirm',
    name: 'toBeDelivered',
    message: 'Is this for delivery?',
    default: false,
  })
  parseToBeConfirmed(val: boolean) {
    return val;
  }

  @Question({
    type: 'input',
    name: 'phone',
    message: "What's your phone number?",
  })
  parsePhone(val: string) {
    return val;
  }

  @ValidateFor({ name: 'phone' })
  validatePhone(value: string) {
    const pass = value.match(
      /^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i,
    );
    if (pass) {
      return true;
    }

    return 'Please enter a valid phone number';
  }

  @Question({
    type: 'list',
    name: 'size',
    message: 'What size do you need?',
    choices: ['Large', 'Medium', 'Small'],
  })
  parseSize(val: string) {
    return val.toLowerCase();
  }

  @Question({
    type: 'input',
    name: 'quantity',
    message: 'How many do you need?',
  })
  parseQuantity(val: string) {
    return Number(val);
  }

  @ValidateFor({ name: 'quantity' })
  validateQuantity(val: string) {
    const valid = !isNaN(parseFloat(val));
    return valid || 'Please enter a number';
  }

  @Question({
    type: 'rawlist',
    name: 'beverage',
    message: 'You also get a free 2L beverage',
    choices: ['Pepsi', '7up', 'Coke'],
  })
  parseBeverage(val: string) {
    return val;
  }

  @Question({
    type: 'input',
    name: 'comments',
    message: 'Any comments on your purchase experience?',
    default: 'Nope, all good!',
  })
  parseComments(val: string) {
    return val;
  }

  @Question({
    type: 'list',
    name: 'prize',
    message: 'For leaving a comment, you get a freebie',
    choices: ['cake', 'fries'],
  })
  parsePrize(val: string) {
    return val;
  }

  @WhenFor({ name: 'prize' })
  whenPrize(answers: { comments: string }): boolean {
    return answers.comments !== 'Nope, all good!';
  }
}
