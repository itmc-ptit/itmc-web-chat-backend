import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsValidUserToGroupStatus', async: false })
export class IsValidUserToGroupStatusConstraint
  implements ValidatorConstraintInterface
{
  validate(status: string, validationArguments?: ValidationArguments): boolean {
    const statusList = ['online', 'away'];
    return statusList.includes(status);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Invalid status!';
  }
}

export function IsValidUserToGroupStatus(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidUserToGroupStatusConstraint,
    });
  };
}
