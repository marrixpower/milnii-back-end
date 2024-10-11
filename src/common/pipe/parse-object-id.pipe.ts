import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';

export class ParseObjectIdPipe implements PipeTransform {
  transform(
    value: string,
    metadata: ArgumentMetadata,
  ): Types.ObjectId | undefined {
    try {
      if (!value) return;

      return new Types.ObjectId(value);
    } catch (e) {
      throw new BadRequestException('Invalid ObjectId in ' + metadata.type);
    }
  }
}
