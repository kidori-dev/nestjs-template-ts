import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class UserAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      return false;
    }

    if (!request.user.loginType) {
      return false;
    }

    if (request.user.loginType !== 'user') {
      return false;
    }

    return request.isAuthenticated();
  }
}
