import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ICustomRequest } from '../types/custom-request.interface';

export const Admin = createParamDecorator((data: ICustomRequest, ctx: ExecutionContext) => {
  const req: ICustomRequest = ctx.switchToHttp().getRequest();
  return req.user;
});
