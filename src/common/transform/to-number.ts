import { TransformFnParams } from 'class-transformer';

export const toNumber = ({ value }: TransformFnParams): any => {
  if (typeof value == 'undefined') return;
  return Number(value);
};
