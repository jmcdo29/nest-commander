import { join } from 'path';

export type ExpectedParam =
  | Record<'string', string>
  | Record<'number', number>
  | Record<'boolean', boolean>;

const [firstArg] = process.argv;
// overwrite the second arg to make commander happy
const secondArg = join(__dirname, 'basic.command.js');

export function setArgv(...args: string[]) {
  process.argv = [firstArg, secondArg, 'basic', 'test', ...args];
}
