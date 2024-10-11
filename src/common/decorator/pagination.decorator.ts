import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { pagination } from '../types/pagination';

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): pagination => {
    let { limit, page, sortBy, order, skip } = ctx
      .switchToHttp()
      .getRequest().query;

    limit = limit ? +limit : 15;
    sortBy = sortBy ? sortBy : '_id';
    order = order ? +order : -1;
    page = page ? +page : 1;

    return {
      skip: skip ? +skip : +limit * (+page - 1),
      limit: +limit,
      sortBy,
      order,
    };
  },
);
