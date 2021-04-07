import { Module } from '@nestjs/common';
import { PizzaCommand } from './pizza.command';
import { PizzaQuestion } from './pizza.question';

@Module({
  providers: [PizzaCommand, PizzaQuestion],
})
export class PizzaModule {}
