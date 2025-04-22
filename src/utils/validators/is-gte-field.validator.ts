import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsGteField(property: number, validationOptions?: ValidationOptions) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'isGteField',
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

          return (
            value !== undefined &&
            relatedValue !== undefined &&
            !isNaN(numValue) &&
            !isNaN(numRelated) &&
            numValue >= numRelated
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must be greater than or equal to ${relatedPropertyName}`;
        },
      },
    });
  };
}
