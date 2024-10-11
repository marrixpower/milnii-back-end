import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'ValidPhoneNumber', async: true })
export class ValidPhoneNumberRule implements ValidatorConstraintInterface {
  async validate(value: string) {
    const regexp = new RegExp(
      '^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$',
      'igm',
    );

    return regexp.test(value);
  }

  defaultMessage() {
    return 'Phone number must be valid';
  }
}

export function IsValidPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ValidPhoneNumberRule,
    });
  };
}
