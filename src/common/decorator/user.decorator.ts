import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const InjectUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    if (ctx.getType() === 'http') {
      const request = ctx.switchToHttp().getRequest();

      const user = request.user;

      return data ? user?.[data] : user;
    } else if (ctx.getType() === 'ws') {
      const wsData = ctx.switchToWs().getData();

      return wsData.user;
    }
  },
);
