import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getRawHeader = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const rawHeader = req.rawHeaders;
    return rawHeader;
  },
);
