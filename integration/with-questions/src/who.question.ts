import { Question, QuestionSet } from 'nest-commander';

@QuestionSet({ name: 'hello' })
export class WhoQuestion {
  @Question({
    message: 'What is your name?',
    name: 'name',
  })
  parseName(val: string) {
    return val;
  }
}
