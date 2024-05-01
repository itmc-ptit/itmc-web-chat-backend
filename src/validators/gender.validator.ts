import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidGender', async: false })
export class IsValidGenderConstraint implements ValidatorConstraintInterface {
  validate(gender: string, args: ValidationArguments) {
    const genders = ['male', 'female', 'other'];
    return genders.includes(gender.toLowerCase());
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Invalid gender!';
  }
}

export function IsValidGender(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidGenderConstraint,
    });
  };
}
