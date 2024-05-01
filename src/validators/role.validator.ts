import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidRole', async: false })
export class IsValidRoleConstraint implements ValidatorConstraintInterface {
  validate(role: string, validationArguments?: ValidationArguments): boolean {
    const roles = ['admin', 'member'];
    return roles.includes(role);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Invalid gender!';
  }
}

export function IsValidRole(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidRoleConstraint,
    });
  };
}
