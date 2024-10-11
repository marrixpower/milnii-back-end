import { BadRequestException } from '@nestjs/common';
import { TransformFnParams } from 'class-transformer';
import { Types } from 'mongoose';

export const toObjectId = ({ value, key }: TransformFnParams): any => {
  try {
    if (typeof value == 'undefined') return;
    if (value == 'null' || value == null) return null;
    if (Array.isArray(value)) return value.map((e) => new Types.ObjectId(e));
    return new Types.ObjectId(value);
  } catch (e) {
    throw new BadRequestException(key + ' is not a valid ObjectId');
  }
};
