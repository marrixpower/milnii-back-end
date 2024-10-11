import { TransformFnParams } from 'class-transformer';

export const toBoolean = ({ value }: TransformFnParams): any => {
  if (typeof value == 'undefined') return;
  return value === 'true' || value === true;
};
