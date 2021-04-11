import { Rule } from '@angular-devkit/schematics';
import { CommonSchematicFactory } from '../common';
import { QuestionOptions } from './question-options.interface';

class QuestionSchematicsFactory extends CommonSchematicFactory<QuestionOptions> {
  type = 'questions';
}

export function question(options: QuestionOptions): Rule {
  const questionFactory = new QuestionSchematicsFactory();
  return questionFactory.create(options);
}
