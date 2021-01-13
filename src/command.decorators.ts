// import { SCOPE_OPTIONS_METADATA } from '@nestjs/common/constants';
import { CommandMeta, OptionMeta } from './constants';
import { CommandMetadata, OptionMetadata } from './command-runner.interface';

export function Command(options: CommandMetadata): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(CommandMeta, options, target);
    // Reflect.defineMetadata(SCOPE_OPTIONS_METADATA, null, target);
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
