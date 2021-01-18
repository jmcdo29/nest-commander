import { CommandMeta, OptionMeta } from './constants';
import { CommandMetadata, CommandRunner, OptionMetadata } from './command-runner.interface';

export function Command(
  options: CommandMetadata,
): <TFunction extends CommandRunner>(target: TFunction) => void | TFunction {
  return (target) => {
    Reflect.defineMetadata(CommandMeta, options, target);
    return target;
  };
}

export function Option(options: OptionMetadata): MethodDecorator {
  return (
    target: Record<string, any>,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(OptionMeta, options, descriptor.value);
    return descriptor;
  };
}
