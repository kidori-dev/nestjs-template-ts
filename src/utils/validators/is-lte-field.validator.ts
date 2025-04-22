import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsLteField(property: number, validationOptions?: ValidationOptions) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'isLteField',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = relatedPropertyName;

          const numValue = parseFloat(value);
          const numRelated = parseFloat(relatedValue);

          console.log(numValue, numRelated);

          return (
            value !== undefined &&
            relatedValue !== undefined &&
            !isNaN(numValue) &&
            !isNaN(numRelated) &&
            numValue <= numRelated
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must be less than or equal to ${relatedPropertyName}`;
        },
      },
    });
  };
}
