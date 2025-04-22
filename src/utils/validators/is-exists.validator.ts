import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint({ name: 'IsExist', async: true })
export class IsExist implements ValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [entityClass, property] = args.constraints;
    if (!value) return false;

    if (!Array.isArray(value)) {
      const repository = this.dataSource.getRepository(entityClass);
      const count = await repository.count({ where: { [property]: value } });
      return count > 0;
    }

    if (Array.isArray(value) && value.length === 0) return false;
    let result = true;
    for (const item of value) {
      const repository = this.dataSource.getRepository(entityClass);
      const count = await repository.count({ where: { [property]: item } });
      if (count > 0) {
        continue;
      }
      result = false;
    }
    return result;
  }
}
