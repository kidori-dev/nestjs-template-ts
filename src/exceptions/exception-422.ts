import { UnprocessableEntityException } from '@nestjs/common/exceptions/unprocessable-entity.exception';
import { customError } from '../constants/errors';

export class IncorrectPasswordException extends UnprocessableEntityException {
  constructor() {
    super(customError.IncorrectPassword);
  }
}

export class DataNotFoundException extends UnprocessableEntityException {
  constructor() {
    super(customError.DataNotFound);
  }
}
