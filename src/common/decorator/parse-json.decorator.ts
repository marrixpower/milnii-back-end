import { applyDecorators, BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';

export const ParseJson = () => {
  return applyDecorators(
    Transform(
      ({ value, key }) => {
        if (typeof value !== 'string') return value;
        try {
          try {
            return JSON.parse(value);
          } catch (error) {
            return JSON.parse(`[${value}]`);
          }
        } catch (error) {
          throw new BadRequestException(`Invalid JSON in "${key}"`);
        }
      },
      { toClassOnly: true },
    ),
  );
};
