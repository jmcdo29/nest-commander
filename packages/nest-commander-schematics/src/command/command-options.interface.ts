import { Path } from '@angular-devkit/core';

export interface CommandOptions {
  name: string;
  question: string;
  default: boolean;
  spec: boolean;
  flat: boolean;
  sourceRoot: string;
  path?: string | Path;
  type?: string;
  metadata?: string;
  module?: Path | null;
}
