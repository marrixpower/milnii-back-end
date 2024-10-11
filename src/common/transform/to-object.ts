import { TransformFnParams } from 'class-transformer';

export const toObject = ({ value }: TransformFnParams): any => {
  if (typeof value == 'undefined') return;
  if (Array.isArray(value)) return value.map((e) => JSON.parse(e));
  return JSON.parse(value);
};
