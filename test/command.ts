import { Command, CommandRunner, Option } from '../src';

interface BasicCommandOptions {
  string?: string;
  boolean?: boolean;
  number?: number;
  [key: string]: any;
}

@Command({ name: 'basic', description: 'A parameter parse', default: true })
export class BasicCommand implements CommandRunner {
  async run(passedParam: string, options?: BasicCommandOptions): Promise<void> {
    if (options?.boolean !== undefined && options?.boolean !== null) {
      this.runWithBoolean(passedParam, options.boolean);
    } else if (options?.number) {
      this.runWithNumber(passedParam, options.number);
    } else if (options?.string) {
      this.runWithString(passedParam, options.string);
    } else {
      this.runWithNone(passedParam);
    }
  }

  @Option({
    flags: ['--number', '-n'],
    description: 'A basic number parser',
    required: false,
    name: 'number',
  })
  parseNumber(val: string): number {
    return Number.parseInt(val);
  }

  @Option({
    flags: ['--string', '-s'],
    description: 'A string return',
    required: false,
    name: 'string',
  })
  parseString(val: string): string {
    return val;
  }

  @Option({
    flags: ['--boolean', '-b'],
    description: 'A boolean parser',
    required: false,
    name: 'boolean',
  })
  parseBool(val: string): boolean {
    return JSON.parse(val);
  }

  runWithString(param: string, option: string): void {
    console.log({ param, string: option });
  }

  runWithNumber(param: string, option: number): void {
    console.log({ param, number: option });
  }

  runWithBoolean(param: string, option: boolean): void {
    console.log({ param, boolean: option });
  }

  runWithNone(param: string): void {
    console.log({ param });
  }
}
