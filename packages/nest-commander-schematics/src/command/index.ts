import { Rule, Source } from '@angular-devkit/schematics';
import { CommonSchematicFactory } from '../common';
import { CommandOptions } from './command-options.interface';

class CommandSchematicFactory extends CommonSchematicFactory<CommandOptions> {
  type = 'command';

  generate(options: CommandOptions): Source {
    this.templatePath = options.question ? './files/with-questions' : './files/without-questions';
    options.isDefault = options.default;
    return super.generate(options);
  }
}

export function command(options: CommandOptions): Rule {
  const commandFactory = new CommandSchematicFactory();
  return commandFactory.create(options);
}
