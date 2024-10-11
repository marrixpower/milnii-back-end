import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'ValidCoordinates', async: true })
export class ValidCoordinatesRule implements ValidatorConstraintInterface {
  async validate(value: string) {
    const [longitude, latitude] = value;

    return (
      typeof latitude === 'number' &&
      typeof longitude === 'number' &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  }

  defaultMessage() {
    return 'Coordinates must be valid';
  }
}

export function IsValidCoordinates(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidCoordinates',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ValidCoordinatesRule,
    });
  };
}
