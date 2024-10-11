import { TransformFnParams } from 'class-transformer';

export const toPhoneNumber = ({ value }: TransformFnParams): any => {
  if (typeof value == 'undefined') return value;

  return '+' + value.replace('+', '');
};
