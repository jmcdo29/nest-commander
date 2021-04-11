import { CommonOptions } from '../common/common-options.interface';

export interface CommandOptions extends CommonOptions {
  question: string;
  default: boolean;
  isDefault?: boolean;
}
