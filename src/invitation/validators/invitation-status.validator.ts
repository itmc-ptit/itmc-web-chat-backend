import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { InvitationStatus } from '../entities/invitation-status.enum';

@ValidatorConstraint({ name: 'IsValidInvitationStatus', async: false })
export class IsValidInvitationStatusConstraint
  implements ValidatorConstraintInterface
{
  validate(
    invitationStatus: string,
    validationArguments?: ValidationArguments,
  ): boolean {
    const statusCollection: InvitationStatus[] =
      Object.values(InvitationStatus);
    return statusCollection.includes(
      invitationStatus.toLowerCase() as InvitationStatus,
    );
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Invalid invitation status!';
  }
}

export function IsValidInvitationStatus(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidInvitationStatusConstraint,
    });
  };
}
