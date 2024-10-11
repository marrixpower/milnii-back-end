import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function PaginationDoc() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      type: Number,
      required: false,
      description: 'use either page or skip',
    }),
    ApiQuery({
      name: 'skip',
      type: Number,
      required: false,
      description: 'use either page or skip',
    }),
    ApiQuery({ name: 'limit', type: Number, required: false }),
    ApiQuery({
      name: 'order',
      type: Number,
      required: false,
      description: '1 | -1',
    }),
    ApiQuery({ name: 'sortBy', type: String, required: false }),
  );
}
