import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { MemberStatus } from '../entities/member-status.enum';

@ValidatorConstraint({ name: 'IsValidUserToGroupStatus', async: false })
export class IsValidUserToGroupStatusConstraint
  implements ValidatorConstraintInterface
{
  validate(status: string, validationArguments?: ValidationArguments): boolean {
    const statusList = Object.values(MemberStatus);
    return statusList.includes(status.toLowerCase() as MemberStatus);
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
