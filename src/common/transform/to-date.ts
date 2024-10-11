import { TransformFnParams } from 'class-transformer';

export const toDate = ({ value }: TransformFnParams): any => {
  if (typeof value == 'undefined') return;
  return new Date(value);
};
