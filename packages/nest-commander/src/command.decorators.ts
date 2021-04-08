import { Type } from '@nestjs/common';
import {
  ChoicesMeta,
  CommandMeta,
  DefaultMeta,
  MessageMeta,
  OptionMeta,
  QuestionMeta,
  QuestionSetMeta,
  TransformMeta,
  ValidateMeta,
  WhenMeta,
} from './constants';
import {
  CommandMetadata,
  CommandRunner,
  OptionMetadata,
  QuestionMetadata,
  QuestionNameMetadata,
} from './command-runner.interface';
import { Question } from 'inquirer';

function applyMethodMetadata(options: any, metadataKey: string): MethodDecorator {
  return (
    _target: Record<string, any>,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(metadataKey, options, descriptor.value);
    return descriptor;
  };
}

function applyClassMetadata(options: any, metadataKey: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(metadataKey, options, target);
    return target;
  };
}
export function Command(
  options: CommandMetadata,
): <TFunction extends Type<CommandRunner>>(target: TFunction) => void | TFunction {
  return applyClassMetadata(options, CommandMeta);
}

export function Option(options: OptionMetadata): MethodDecorator {
  return applyMethodMetadata(options, OptionMeta);
}

export function QuestionSet(options: QuestionNameMetadata): ClassDecorator {
  return applyClassMetadata(options, QuestionSetMeta);
}

export function Question(options: QuestionMetadata): MethodDecorator {
  return applyMethodMetadata(options, QuestionMeta);
}

export function ValidateFor(options: QuestionNameMetadata): MethodDecorator {
  return applyMethodMetadata(options, ValidateMeta);
}

export function TransformFor(options: QuestionNameMetadata): MethodDecorator {
  return applyMethodMetadata(options, TransformMeta);
}

export function WhenFor(options: QuestionNameMetadata): MethodDecorator {
  return applyMethodMetadata(options, WhenMeta);
}

export function MessageFor(options: QuestionNameMetadata): MethodDecorator {
  return applyMethodMetadata(options, MessageMeta);
}

export function ChoicesFor(options: QuestionNameMetadata): MethodDecorator {
  return applyMethodMetadata(options, ChoicesMeta);
}

export function DefaultFor(options: QuestionNameMetadata): MethodDecorator {
  return applyMethodMetadata(options, DefaultMeta);
}
