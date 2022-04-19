import { Injectable } from '@nestjs/common';

@Injectable()
export class ChoicesProvider {
  getChoicesForChoicesOption(): string[] {
    return ['yes', 'no'];
  }
}
