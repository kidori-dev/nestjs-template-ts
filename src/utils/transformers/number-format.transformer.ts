import { MaybeType } from '../types/maybe.type';
import BigNumber from 'bignumber.js';
import { TransformFnParams } from 'class-transformer/types/interfaces';

export const numberCommaFormatTransformer = (params: TransformFnParams): MaybeType<string> => {
  // 소수점이 없으면 그냥 정수로 표시하고, 있으면 소수점 precision 자리까지 표시
  const data = new BigNumber(params.value);
  if (data.decimalPlaces() === 0) {
    return data.toFormat(0); // 소수점 없이 정수로 표시
  } else {
    return data.toFormat(2); // 소수점 precision 자리까지 표시
  }
};

export const toNumberTransformer = (params: TransformFnParams): MaybeType<string | number> => {
  return new BigNumber(params.value).toNumber();
};
