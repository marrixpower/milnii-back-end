import { TransformFnParams } from 'class-transformer';

export const toArray = ({ value }: TransformFnParams): any => {
  if (typeof value == 'undefined') return;
  if (Array.isArray(value)) return value;
  return [value];
};
