import { HttpException, HttpStatus, ValidationError, ValidationPipeOptions } from '@nestjs/common';

const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) =>
    new HttpException(
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: JSON.stringify(
          errors.reduce(
            (accumulator, currentValue) => ({
              ...accumulator,
              [currentValue.property]: Object.values(currentValue.constraints ?? {}).join(', '),
            }),
            {},
          ),
        ),
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    ),
  transformOptions: {
    enableImplicitConversion: true,
  },
};

export default validationOptions;
