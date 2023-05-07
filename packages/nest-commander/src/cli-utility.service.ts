import { Injectable } from '@nestjs/common';

@Injectable()
export class CliUtilityService {
  static trueValues: string[] = ['yes', '1', 'y', 'true', 't'];
  static falseValues: string[] = ['no', 'n', '0', 'false', 'f'];
  parseBoolean(val: string): boolean {
    val = val.toLowerCase();
    const trueValue = CliUtilityService.trueValues.some((tVal) => tVal === val);
    const falseValue = CliUtilityService.falseValues.some(
      (fVal) => fVal === val,
    );
    if (trueValue) {
      return true;
    }
    if (falseValue) {
      return false;
    }
    throw new Error(
      `${val} is not a proper value for a boolean input. Please use ${CliUtilityService.falseValues.join(
        ', ',
      )} for a "false" value or ${CliUtilityService.trueValues.join(
        ', ',
      )} for a "true" value`,
    );
  }

  parseInt(val: string, radix = 10): number {
    return Number.parseInt(val, radix);
  }

  parseFloat(val: string): number {
    return Number.parseFloat(val);
  }
}
