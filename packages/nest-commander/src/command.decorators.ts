import { Type } from '@nestjs/common';
import {
  CommandMetadata,
  CommandRunner,
  HelpOptions,
  OptionMetadata,
  QuestionMetadata,
  QuestionNameMetadata,
} from './command-runner.interface';
import {
  ChoicesMeta,
  CommandMeta,
  DefaultMeta,
  HelpMeta,
  MessageMeta,
  OptionMeta,
  QuestionMeta,
  QuestionSetMeta,
  SubCommandMeta,
  TransformMeta,
  ValidateMeta,
  WhenMeta,
} from './constants';

type CommandDecorator = <TFunction extends Type<CommandRunner>>(
  target: TFunction,
) => void | TFunction;

const applyMethodMetadata = (options: any, metadataKey: string): MethodDecorator => {
  return (
    _target: Record<string, any>,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(metadataKey, options, descriptor.value);
    return descriptor;
  };
};

const applyClassMetadata = (options: any, metadataKey: string): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(metadataKey, options, target);
    return target;
  };
};
export const Command = (options: CommandMetadata): CommandDecorator => {
  return applyClassMetadata(options, CommandMeta);
};

export const SubCommand = (options: CommandMetadata): CommandDecorator => {
  return applyClassMetadata(options, SubCommandMeta);
};

export const Option = (options: OptionMetadata): MethodDecorator => {
  return applyMethodMetadata(options, OptionMeta);
};

export const QuestionSet = (options: QuestionNameMetadata): ClassDecorator => {
  return applyClassMetadata(options, QuestionSetMeta);
};

export const Question = (options: QuestionMetadata): MethodDecorator => {
  return applyMethodMetadata(options, QuestionMeta);
};

export const ValidateFor = (options: QuestionNameMetadata): MethodDecorator => {
  return applyMethodMetadata(options, ValidateMeta);
};

export const TransformFor = (options: QuestionNameMetadata): MethodDecorator => {
  return applyMethodMetadata(options, TransformMeta);
};

export const WhenFor = (options: QuestionNameMetadata): MethodDecorator => {
  return applyMethodMetadata(options, WhenMeta);
};

export const MessageFor = (options: QuestionNameMetadata): MethodDecorator => {
  return applyMethodMetadata(options, MessageMeta);
};

export const ChoicesFor = (options: QuestionNameMetadata): MethodDecorator => {
  return applyMethodMetadata(options, ChoicesMeta);
};

export const DefaultFor = (options: QuestionNameMetadata): MethodDecorator => {
  return applyMethodMetadata(options, DefaultMeta);
};

export const Help = (options: HelpOptions): MethodDecorator => {
  return applyMethodMetadata(options, HelpMeta);
};
