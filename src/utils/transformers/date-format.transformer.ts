import { MaybeType } from '../types/maybe.type';
import dayjs from 'dayjs';
import { TransformFnParams } from 'class-transformer/types/interfaces';

export const dateFormatTransformer = (value: string): MaybeType<string> => dayjs(value).format('YYYY.MM.DD HH:mm');

export const dateFullFormat = (value: string | Date) => {
  return dayjs(value).format('YYYY.MM.DD HH:mm');
};

export const dateFullFormatTransformer = (params: TransformFnParams): MaybeType<string> =>
  dayjs(params.value).format('YYYY.MM.DD HH:mm');

export const dateFullReverseTransformer = (params: TransformFnParams): MaybeType<string> =>
  dayjs(params.value).format('HH:mm:ss YYYY.MM.DD');

export const onlyDateHyphenFormatTransformer = (params: TransformFnParams): MaybeType<string> =>
  dayjs(params.value).format('YYYY-MM-DD');

export const onlyDateDotFormatTransformer = (params: TransformFnParams): MaybeType<string> => {
  if (!params.value) {
    return params.value;
  }
  return dayjs(params.value).format('YYYY.MM.DD');
};

export const onlyTimeFormatTransformer = (params: TransformFnParams): MaybeType<string> => {
  return dayjs(params.value).format('HH:mm:ss');
};

export const dateYYYYMMDDTransformer = (params: TransformFnParams): MaybeType<string> =>
  dayjs(params.value).format('YYYY.MM.DD HH:mm:ss');
