import {
  ClassConstructor,
  TransformFnParams,
  plainToClass,
} from 'class-transformer';

export const toClass = <T>(cls: ClassConstructor<T>) => {
  return ({ value }: TransformFnParams): any => {
    return plainToClass(cls, value);
  };
};
