import { customError } from '../constants/errors';
import { ForbiddenException } from '@nestjs/common';

export class AccessDeniedException extends ForbiddenException {
  constructor() {
    super(customError.AccessDenied);
  }
}
