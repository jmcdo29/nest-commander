import { Module, ModuleMetadata } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

export const RequestModule = (
  metadata: ModuleMetadata & { requestObject: Record<string, any> },
): ClassDecorator => {
  const { requestObject, ...moduleMetadata } = metadata;
  moduleMetadata.providers ??= [];
  moduleMetadata.providers.push({
    provide: REQUEST,
    useValue: requestObject,
  });
  return Module(moduleMetadata);
};
