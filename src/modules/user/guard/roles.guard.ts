import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ICustomRequest } from '../../../utils/types/custom-request.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<number[]>('roles', [context.getClass(), context.getHandler()]);
    if (!roles || !roles.length) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      return false;
    }

    if (!request.user.role) {
      return false;
    }

    for (const item of roles) {
      if (!request.user.role[item]) {
        return false;
      }
    }
    return true;
  }
}
