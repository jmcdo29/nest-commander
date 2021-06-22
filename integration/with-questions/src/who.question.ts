import { Question, QuestionSet } from '@nest-commander/nest-commander';

@QuestionSet({ name: 'hello' })
export class WhoQuestion {
  @Question({
    message: 'What is your name?',
    name: 'username',
  })
  parseName(val: string) {
    return val;
  }
}
