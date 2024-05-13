import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserStatus } from '../entities/user-status.enum';

@ValidatorConstraint({ name: 'isValidGender', async: false })
export class IsValidUserStatusConstraint
  implements ValidatorConstraintInterface
{
  validate(value: string, args: ValidationArguments) {
    const status = Object.values(UserStatus);
    return status.includes(value.toLowerCase() as UserStatus);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Invalid gender!';
  }
}

export function IsValidUserStatus(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidUserStatusConstraint,
    });
  };
}
