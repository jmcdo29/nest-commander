import { Command, CommandRunner, InquirerService } from 'nest-commander';
import { PizzaOptions } from './pizza.interface';

@Command({ name: 'pizza', options: { isDefault: true } })
export class PizzaCommand implements CommandRunner {
  constructor(private readonly inquirerService: InquirerService) {}
  async run(_inputs: string[], options?: PizzaOptions): Promise<void> {
    options = await this.inquirerService.ask('pizza', options);
    console.log(options);
  }
}
