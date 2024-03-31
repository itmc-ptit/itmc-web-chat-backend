import { IsString } from 'class-validator';

export class CreateUserToGroupDto {
  @IsString()
  readonly groupChatId: string;

  @IsString()
  readonly userId: string;
}